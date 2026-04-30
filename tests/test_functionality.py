import pytest
import customtkinter as ctk
from unittest.mock import MagicMock, patch
import os
import json

from utils.variables import DEFAULT_SETTINGS, FILES
from utils.settings_manager import settings_change_new_keys, settings_save, settings_load
from utils.helpers import parse_json_safely


# ═══════════════════════════════════════════════════════════════
#  Fixtures
# ═══════════════════════════════════════════════════════════════

@pytest.fixture(scope="session")
def ctk_root():
    root = ctk.CTk()
    root.withdraw()
    root.update()
    yield root
    root.destroy()


@pytest.fixture
def mock_settings_frame():
    mock = MagicMock()
    mock.toggle_change_ability = MagicMock()
    return mock


@pytest.fixture
def mock_navigation_frame():
    mock = MagicMock()
    mock.appearance_mode_menu = MagicMock()
    mock.frame_settings_button = MagicMock()
    mock.buttons = {}
    return mock


@pytest.fixture
def main_window(ctk_root, mock_settings_frame, mock_navigation_frame):
    mw = ctk_root
    mw.settings = DEFAULT_SETTINGS.copy()
    mw.frames = {
        "settings": mock_settings_frame,
        "navigation": mock_navigation_frame,
    }
    mw.images = {}
    mw.updating = False
    return mw


@pytest.fixture
def tmp_files(tmp_path):
    return {
        "settings_file": str(tmp_path / "settings.json"),
        "last_explanation_chats": str(tmp_path / "last_explanation_chats.json"),
        "last_homework_chats": str(tmp_path / "last_homework_chats.json"),
        "last_test_file": str(tmp_path / "last_test_file.json"),
    }


# ═══════════════════════════════════════════════════════════════
#  Pure-logic tests (no tkinter widgets needed)
# ═══════════════════════════════════════════════════════════════

class TestParseJsonSafely:
    def test_valid_json(self):
        assert parse_json_safely('{"a": 1}') == {"a": 1}

    def test_json_embedded_in_text(self):
        result = parse_json_safely('Here is the result: {"a": 1} done')
        assert result == {"a": 1}

    def test_invalid_json(self):
        assert parse_json_safely("no json here") is None

    def test_empty_string(self):
        assert parse_json_safely("") is None


class TestSettingsChangeNewKeys:
    def test_adds_missing_keys(self):
        settings = {"theme": "Dark"}
        result = settings_change_new_keys(settings, DEFAULT_SETTINGS)
        for key in DEFAULT_SETTINGS:
            assert key in result

    def test_removes_unknown_keys(self):
        settings = {**DEFAULT_SETTINGS, "unknown_key": "value"}
        result = settings_change_new_keys(settings, DEFAULT_SETTINGS)
        assert result["unknown_key"] == "None"

    def test_preserves_existing_values(self):
        settings = {**DEFAULT_SETTINGS, "theme": "Light"}
        result = settings_change_new_keys(settings, DEFAULT_SETTINGS)
        assert result["theme"] == "Light"


class TestInTestWindowPureLogic:
    def test_normalize_text(self):
        from ui.in_test_window import InTestWindow
        assert InTestWindow._normalize_text("  Hello World  ") == "hello world"
        assert InTestWindow._normalize_text("") == ""
        assert InTestWindow._normalize_text(None) == ""
        assert InTestWindow._normalize_text("Тест") == "тест"

    @pytest.fixture
    def scorer(self):
        from ui.in_test_window import InTestWindow
        mock_self = MagicMock()
        mock_self._normalize_text = lambda s: (s or "").strip().lower()
        return mock_self

    def test_score_question_multiple_choice_correct(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "multiple_choice", "score": 2, "correct": 1}
        got, mx, ok = InTestWindow._score_question(scorer, q, 1)
        assert ok is True
        assert got == 2
        assert mx == 2

    def test_score_question_multiple_choice_wrong(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "multiple_choice", "score": 1, "correct": 0}
        got, mx, ok = InTestWindow._score_question(scorer, q, 2)
        assert ok is False
        assert got == 0

    def test_score_question_multi_select_correct(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "multi_select", "score": 3, "correct": [0, 2]}
        got, mx, ok = InTestWindow._score_question(scorer, q, [0, 2])
        assert ok is True
        assert got == 3

    def test_score_question_multi_select_wrong(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "multi_select", "score": 3, "correct": [0, 2]}
        got, mx, ok = InTestWindow._score_question(scorer, q, [1, 3])
        assert ok is False

    def test_score_question_entry_correct(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "entry", "score": 1, "correct": "42"}
        got, mx, ok = InTestWindow._score_question(scorer, q, "42")
        assert ok is True

    def test_score_question_entry_case_insensitive(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "entry", "score": 1, "correct": "Moscow"}
        got, mx, ok = InTestWindow._score_question(scorer, q, "moscow")
        assert ok is True

    def test_score_question_entry_list_correct(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "entry", "score": 1, "correct": ["москва", "Moscow"]}
        got, mx, ok = InTestWindow._score_question(scorer, q, "москва")
        assert ok is True

    def test_score_question_no_answer(self, scorer):
        from ui.in_test_window import InTestWindow
        q = {"type": "entry", "score": 1, "correct": "42"}
        got, mx, ok = InTestWindow._score_question(scorer, q, None)
        assert ok is False
        assert got == 0


class TestSettingsFrameStaticMethods:
    def test_get_translated_theme_name_absolute(self):
        from ui.settings_frame import SettingsFrame
        assert SettingsFrame._get_translated_theme_name("Синяя") == "Blue"
        assert SettingsFrame._get_translated_theme_name("Роза") == "Rose"
        assert SettingsFrame._get_translated_theme_name("Неизвестная") == "Blue"  # default

    def test_get_translated_theme_name_reverse(self):
        from ui.settings_frame import SettingsFrame
        assert SettingsFrame._get_translated_theme_name("Blue", False) == "Синяя"
        assert SettingsFrame._get_translated_theme_name("Rose", False) == "Роза"

    def test_set_checkbox_from_setting_enabled(self, ctk_root):
        from ui.settings_frame import SettingsFrame
        cb = ctk.CTkCheckBox(ctk_root)
        SettingsFrame._set_checkbox_from_setting(cb, "Enabled")
        assert bool(cb.get()) is True

    def test_set_checkbox_from_setting_disabled(self, ctk_root):
        from ui.settings_frame import SettingsFrame
        cb = ctk.CTkCheckBox(ctk_root)
        SettingsFrame._set_checkbox_from_setting(cb, "Disabled")
        assert bool(cb.get()) is False

    def test_set_entry_from_setting(self, ctk_root):
        from ui.settings_frame import SettingsFrame
        entry = ctk.CTkEntry(ctk_root)
        SettingsFrame._set_entry_from_setting(entry, "test_value")
        assert entry.get() == "test_value"

    def test_set_entry_from_setting_empty(self, ctk_root):
        from ui.settings_frame import SettingsFrame
        entry = ctk.CTkEntry(ctk_root)
        entry.insert(0, "old")
        SettingsFrame._set_entry_from_setting(entry, "")
        assert entry.get() == ""


# ═══════════════════════════════════════════════════════════════
#  TestsFrame tests
# ═══════════════════════════════════════════════════════════════

class TestTestsFrame:
    @pytest.fixture
    def tests_frame(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            from ui.tests_frame import TestsFrame
            frame = TestsFrame(main_window)
            yield frame
            frame.destroy()

    def test_create_cfg_returns_params(self, tests_frame):
        tests_frame.topic_textbox.insert("1.0", "Биология", push_history=False)
        params = tests_frame.create_cfg(request_test=False)
        assert "difficulty" in params
        assert "generation_type" in params
        assert "questions" in params
        assert "allow_multiple_choice" in params
        assert "allow_entry_answer" in params
        assert "explanation_required" in params
        assert "input_text" in params
        assert params["input_text"] == "Биология"

    def test_create_cfg_default_difficulty(self, tests_frame):
        params = tests_frame.create_cfg(request_test=False)
        assert params["difficulty"] == "Средний"

    def test_create_cfg_default_gen_type(self, tests_frame):
        params = tests_frame.create_cfg(request_test=False)
        assert params["generation_type"] == "topics"

    def test_on_q_slider_updates_label(self, tests_frame):
        tests_frame._on_q_slider(15.0, save=False)
        assert tests_frame.q_value_label.cget("text") == "15"

    def test_on_q_slider_rounds_value(self, tests_frame):
        tests_frame._on_q_slider(14.7, save=False)
        assert tests_frame.q_value_label.cget("text") == "15"

    def test_lock_input_disables_button(self, tests_frame):
        tests_frame.lock_input("Загрузка...")
        assert tests_frame.send_button.cget("state") == "disabled"
        assert tests_frame.send_button.cget("text") == "Загрузка..."
        tests_frame.MainWindow.frames["settings"].toggle_change_ability.assert_called_with(False)

    def test_unlock_input_enables_button(self, tests_frame):
        tests_frame.lock_input("Загрузка...")
        tests_frame.unlock_input()
        assert tests_frame.send_button.cget("state") == "normal"
        assert tests_frame.send_button.cget("text") == "Сформировать запрос"
        tests_frame.MainWindow.frames["settings"].toggle_change_ability.assert_called_with(True)

    def test_auto_save_cfg_saves_correct_data(self, tests_frame, tmp_files):
        with patch.dict(FILES, tmp_files):
            tests_frame.save_debounce = False
            tests_frame._auto_save_cfg()
            with open(tmp_files["last_test_file"], 'r', encoding='utf-8') as f:
                data = json.load(f)
            assert data["difficulty"] == "Средний"
            assert data["generation_type"] == "topics"

    def test_auto_load_cfg_restores_state(self, main_window, tmp_files):
        cfg_data = {
            "difficulty": "Тяжёлый",
            "generation_type": "material",
            "questions": 20,
            "allow_multiple_choice": True,
            "allow_entry_answer": True,
            "explanation_required": True,
            "input_text": "Математика"
        }
        os.makedirs(os.path.dirname(tmp_files["last_test_file"]), exist_ok=True)
        with open(tmp_files["last_test_file"], 'w', encoding='utf-8') as f:
            json.dump(cfg_data, f)

        with patch.dict(FILES, tmp_files):
            from ui.tests_frame import TestsFrame
            frame = TestsFrame(main_window)
            assert frame.difficulty_var.get() == "Тяжёлый"
            assert frame.gen_type_var.get() == "material"
            assert int(round(float(frame.q_slider.get()))) == 20
            frame.destroy()

    def test_export_to_file_writes_content(self, tests_frame, tmp_path):
        tests_frame.topic_textbox.insert("1.0", "Тестовый контент для экспорта", push_history=False)
        target = str(tmp_path / "export_test.txt")
        with open(target, 'w', encoding='utf-8') as f:
            f.write("")
        with patch("ui.tests_frame.ctk.filedialog.asksaveasfilename", return_value=target):
            tests_frame._export_to_file()
        with open(target, 'r', encoding='utf-8') as f:
            assert f.read() == "Тестовый контент для экспорта"

    def test_export_to_file_empty_textbox(self, tests_frame):
        tests_frame.topic_textbox.delete("1.0", ctk.END)
        with patch("ui.tests_frame.ctk.filedialog.asksaveasfilename"):
            with patch("ui.tests_frame.CTkMessagebox") as mock_msg:
                tests_frame._export_to_file()
                mock_msg.assert_called()

    def test_import_from_file_txt(self, tests_frame, tmp_path):
        txt_file = tmp_path / "import_test.txt"
        txt_file.write_text("Импортированный текст", encoding='utf-8')
        with patch("ui.tests_frame.ctk.filedialog.askopenfilename", return_value=str(txt_file)):
            tests_frame._import_from_file()
        assert "Импортированный текст" in tests_frame.topic_textbox.get("1.0", ctk.END)

    def test_import_from_file_cancels(self, tests_frame):
        original = tests_frame.topic_textbox.get("1.0", ctk.END)
        with patch("ui.tests_frame.ctk.filedialog.askopenfilename", return_value=""):
            tests_frame._import_from_file()
        assert tests_frame.topic_textbox.get("1.0", ctk.END) == original

    def test_difficulty_radio_buttons(self, tests_frame):
        tests_frame.diff_easy.invoke()
        assert tests_frame.difficulty_var.get() == "Лёгкий"
        params = tests_frame.create_cfg(request_test=False)
        assert params["difficulty"] == "Лёгкий"

        tests_frame.diff_hard.invoke()
        assert tests_frame.difficulty_var.get() == "Тяжёлый"
        params = tests_frame.create_cfg(request_test=False)
        assert params["difficulty"] == "Тяжёлый"

    def test_gen_type_radio_buttons(self, tests_frame):
        tests_frame.radiobutton_material.invoke()
        assert tests_frame.gen_type_var.get() == "material"
        params = tests_frame.create_cfg(request_test=False)
        assert params["generation_type"] == "material"


# ═══════════════════════════════════════════════════════════════
#  AssistantChatFrame tests (covers ExplanationFrame & HomeworkFrame)
# ═══════════════════════════════════════════════════════════════

class TestAssistantChatFrame:
    @pytest.fixture
    def chat_frame(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            from ui.assistant_frame import AssistantChatFrame
            frame = AssistantChatFrame(main_window, "Test system prompt", "explanation")
            yield frame
            frame.destroy()

    def test_initial_state(self, chat_frame):
        assert chat_frame.current_chat_name == "Обычный чат"
        assert chat_frame.chats == {"Обычный чат": []}
        assert chat_frame.message_history == []

    def test_create_new_chat(self, chat_frame):
        with patch("ui.assistant_frame.ctk.CTkInputDialog") as mock_dialog:
            mock_instance = MagicMock()
            mock_instance.get_input.return_value = "Математика"
            mock_dialog.return_value = mock_instance
            chat_frame.create_new_chat()
        assert "Математика" in chat_frame.chats
        assert chat_frame.current_chat_name == "Математика"

    def test_create_new_chat_duplicate_name(self, chat_frame):
        with patch("ui.assistant_frame.ctk.CTkInputDialog") as mock_dialog:
            mock_instance = MagicMock()
            mock_instance.get_input.return_value = "Обычный чат"
            mock_dialog.return_value = mock_instance
            with patch("ui.assistant_frame.CTkMessagebox"):
                chat_frame.create_new_chat()
        assert list(chat_frame.chats.keys()).count("Обычный чат") == 1

    def test_switch_chat(self, chat_frame):
        chat_frame.chats["Физика"] = [{"role": "user", "content": "hello", "type": "text"}]
        chat_frame.switch_chat("Физика")
        assert chat_frame.current_chat_name == "Физика"
        assert len(chat_frame.message_history) == 1

    def test_switch_chat_nonexistent_does_nothing(self, chat_frame):
        original = chat_frame.current_chat_name
        chat_frame.switch_chat("Несуществующий")
        assert chat_frame.current_chat_name == original

    def test_clear_current_chat(self, chat_frame):
        chat_frame.message_history.append({"role": "user", "content": "test", "type": "text"})
        with patch("ui.assistant_frame.CTkMessagebox") as mock_msg:
            mock_instance = MagicMock()
            mock_instance.get.return_value = "Да"
            mock_msg.return_value = mock_instance
            chat_frame.clear_current_chat()
        assert chat_frame.message_history == []

    def test_delete_current_chat(self, chat_frame):
        chat_frame.chats["Второй чат"] = []
        with patch("ui.assistant_frame.CTkMessagebox") as mock_msg:
            mock_instance = MagicMock()
            mock_instance.get.return_value = "Да"
            mock_msg.return_value = mock_instance
            chat_frame.switch_chat("Второй чат")
            chat_frame.delete_current_chat()
        assert "Второй чат" not in chat_frame.chats

    def test_delete_only_chat_prevented(self, chat_frame):
        assert len(chat_frame.chats) == 1
        with patch("ui.assistant_frame.CTkMessagebox") as mock_msg:
            chat_frame.delete_current_chat()
            mock_msg.assert_called()

    def test_display_ai_response(self, chat_frame):
        ai_data = {"role": "assistant", "content": "Ответ ИИ", "model_name": "TestModel"}
        chat_frame.display_ai_response(ai_data)
        assert ai_data in chat_frame.message_history

    def test_display_ai_response_limits_history(self, chat_frame):
        for i in range(30):
            chat_frame.message_history.append({"role": "user", "content": f"msg {i}", "type": "text"})
        ai_data = {"role": "assistant", "content": "Ответ"}
        chat_frame.display_ai_response(ai_data)
        assert len(chat_frame.message_history) <= 25

    def test_delete_message(self, chat_frame):
        msg = {"role": "user", "content": "delete me", "type": "text"}
        chat_frame.message_history.append(msg)
        chat_frame.delete_message(msg)
        assert msg not in chat_frame.message_history

    def test_lock_input(self, chat_frame):
        chat_frame.lock_input("Думаю...")
        assert chat_frame.send_button.cget("state") == "disabled"

    def test_unlock_input(self, chat_frame):
        chat_frame.lock_input("Думаю...")
        chat_frame.unlock_input()
        assert chat_frame.send_button.cget("state") == "normal"

    def test_toggle_input_disables_all(self, chat_frame):
        chat_frame._toggle_input("Ждите", False)
        assert chat_frame.send_button.cget("state") == "disabled"
        assert chat_frame.export_button.cget("state") == "disabled"
        assert chat_frame.import_button.cget("state") == "disabled"
        assert chat_frame.new_chat_button.cget("state") == "disabled"
        assert chat_frame.delete_chat_button.cget("state") == "disabled"
        assert chat_frame.clear_chat_button.cget("state") == "disabled"

    def test_auto_save_chats(self, chat_frame, tmp_files):
        chat_frame.MainWindow.settings["auto_explanation_save"] = "Enabled"
        with patch.dict(FILES, tmp_files):
            chat_frame._auto_save_chats()
            assert os.path.exists(tmp_files["last_explanation_chats"])

    def test_auto_load_chats(self, main_window, tmp_files):
        chats_data = {"Загруженный чат": [{"role": "user", "content": "test", "type": "text"}]}
        os.makedirs(os.path.dirname(tmp_files["last_explanation_chats"]), exist_ok=True)
        with open(tmp_files["last_explanation_chats"], 'w', encoding='utf-8') as f:
            json.dump(chats_data, f)

        main_window.settings["auto_explanation_load"] = "Enabled"
        with patch.dict(FILES, tmp_files):
            from ui.assistant_frame import AssistantChatFrame
            frame = AssistantChatFrame(main_window, "prompt", "explanation")
            assert "Загруженный чат" in frame.chats
            frame.destroy()

    def test_export_chats(self, chat_frame, tmp_path):
        target = str(tmp_path / "export.json")
        with patch("ui.assistant_frame.ctk.filedialog.asksaveasfilename", return_value=target):
            with patch("ui.assistant_frame.CTkMessagebox"):
                chat_frame.export_chats()
        with open(target, 'r', encoding='utf-8') as f:
            data = json.load(f)
        assert "Обычный чат" in data

    def test_import_chats(self, chat_frame, tmp_path):
        import_data = {"Импортированный": [{"role": "user", "content": "hi", "type": "text"}]}
        src = tmp_path / "import.json"
        src.write_text(json.dumps(import_data, ensure_ascii=False), encoding='utf-8')
        with patch("ui.assistant_frame.ctk.filedialog.askopenfilename", return_value=str(src)):
            with patch("ui.assistant_frame.CTkMessagebox"):
                chat_frame.import_chats()
        assert "Импортированный" in chat_frame.chats


# ═══════════════════════════════════════════════════════════════
#  ExplanationFrame tests
# ═══════════════════════════════════════════════════════════════

class TestExplanationFrame:
    def test_inherits_assistant_chat_frame(self):
        from ui.explanation_frame import ExplanationFrame
        from ui.assistant_frame import AssistantChatFrame
        assert issubclass(ExplanationFrame, AssistantChatFrame)

    def test_system_prompt_content(self):
        from ui.explanation_frame import system_prompt
        assert "преподаватель" in system_prompt.lower()

    def test_frame_name(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            from ui.explanation_frame import ExplanationFrame
            frame = ExplanationFrame(main_window)
            assert frame.frame_name == "explanation"
            frame.destroy()


# ═══════════════════════════════════════════════════════════════
#  HomeworkFrame tests
# ═══════════════════════════════════════════════════════════════

class TestHomeworkFrame:
    def test_inherits_assistant_chat_frame(self):
        from ui.homework_frame import HomeworkFrame
        from ui.assistant_frame import AssistantChatFrame
        assert issubclass(HomeworkFrame, AssistantChatFrame)

    def test_system_prompt_content(self):
        from ui.homework_frame import system_prompt
        assert "домашн" in system_prompt.lower()

    def test_frame_name(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            from ui.homework_frame import HomeworkFrame
            frame = HomeworkFrame(main_window)
            assert frame.frame_name == "homework"
            frame.destroy()


# ═══════════════════════════════════════════════════════════════
#  SettingsFrame tests
# ═══════════════════════════════════════════════════════════════

class TestSettingsFrame:
    @pytest.fixture
    def settings_frame(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            from ui.settings_frame import SettingsFrame
            frame = SettingsFrame(main_window)
            yield frame
            frame.destroy()

    def test_on_toggle_enabled(self, settings_frame):
        cb = ctk.CTkCheckBox(settings_frame)
        cb.select()
        settings_frame._on_toggle("auto_update_check", cb)
        assert settings_frame.MainWindow.settings["auto_update_check"] == "Enabled"

    def test_on_toggle_disabled(self, settings_frame):
        cb = ctk.CTkCheckBox(settings_frame)
        cb.deselect()
        settings_frame._on_toggle("auto_update_check", cb)
        assert settings_frame.MainWindow.settings["auto_update_check"] == "Disabled"

    def test_on_entry_change(self, settings_frame):
        entry = ctk.CTkEntry(settings_frame)
        entry.insert(0, "test_api_key")
        settings_frame._on_entry_change("PAIK", entry)
        assert settings_frame.MainWindow.settings["PAIK"] == "test_api_key"

    def test_on_entry_change_empty(self, settings_frame):
        entry = ctk.CTkEntry(settings_frame)
        settings_frame._on_entry_change("PAIK", entry)
        assert settings_frame.MainWindow.settings["PAIK"] == ""

    def test_toggle_change_ability_enabled(self, settings_frame):
        settings_frame.toggle_change_ability(True)
        for elem in settings_frame.setting_ui_elements:
            assert elem.cget("state") == "normal"

    def test_toggle_change_ability_disabled(self, settings_frame):
        settings_frame.toggle_change_ability(False)
        for elem in settings_frame.setting_ui_elements:
            assert elem.cget("state") == "disabled"

    def test_save_settings(self, settings_frame, tmp_files):
        with patch.dict(FILES, tmp_files):
            settings_frame._save_settings()
            assert os.path.exists(tmp_files["settings_file"])
            with open(tmp_files["settings_file"], 'r', encoding='utf-8') as f:
                data = json.load(f)
            assert data["theme"] == settings_frame.MainWindow.settings["theme"]

    def test_apply_previous_settings(self, settings_frame, tmp_files):
        with patch.dict(FILES, tmp_files):
            settings_frame._save_settings()
            settings_frame.MainWindow.settings["theme"] = "Light"
            with patch.object(settings_frame, '_set_vars'):
                settings_frame._apply_previous_settings()
            assert settings_frame.MainWindow.settings["theme"] == DEFAULT_SETTINGS["theme"]


# ═══════════════════════════════════════════════════════════════
#  NavigationFrame tests
# ═══════════════════════════════════════════════════════════════

class TestNavigationFrame:
    @pytest.fixture
    def nav_frame(self, main_window):
        from ui.navigation_frame import NavigationFrame
        from utils.variables import IMAGES
        main_window.images = IMAGES
        main_window.change_appearance_mode_event = MagicMock()
        frame = NavigationFrame(main_window)
        yield frame
        frame.destroy()

    def test_buttons_created(self, nav_frame):
        expected_keys = ["tests", "explanation", "homework", "settings", "about"]
        for key in expected_keys:
            assert key in nav_frame.buttons


# ═══════════════════════════════════════════════════════════════
#  AboutFrame tests
# ═══════════════════════════════════════════════════════════════

class TestAboutFrame:
    @pytest.fixture
    def about_frame(self, main_window):
        from ui.about_frame import AboutFrame
        frame = AboutFrame(main_window)
        yield frame
        frame.destroy()

    def test_version_label(self, about_frame):
        from utils.variables import VERSION
        assert VERSION in about_frame.version_label.cget("text")

    def test_title_label(self, about_frame):
        assert "НейроУчитель" in about_frame.title_label.cget("text")

    def test_buttons_exist(self, about_frame):
        assert about_frame.github_button is not None
        assert about_frame.update_button is not None
        assert about_frame.telegram_channel_button is not None
        assert about_frame.api_key_guide_button is not None


# ═══════════════════════════════════════════════════════════════
#  Settings manager integration tests
# ═══════════════════════════════════════════════════════════════

class TestSettingsManager:
    def test_save_and_load_roundtrip(self, main_window, tmp_files):
        with patch.dict(FILES, tmp_files):
            main_window.settings["theme"] = "Light"
            main_window.settings["ai_model"] = "GPT-4"
            settings_save(main_window, tmp_files["settings_file"])

            main_window.settings["theme"] = "Dark"
            settings_load(main_window, tmp_files["settings_file"])
            assert main_window.settings["theme"] == "Light"
            assert main_window.settings["ai_model"] == "GPT-4"

    def test_load_nonexistent_file(self, main_window, tmp_files):
        original_theme = main_window.settings["theme"]
        with patch.dict(FILES, tmp_files):
            settings_load(main_window, tmp_files["settings_file"] + "_nonexistent")
        assert main_window.settings["theme"] == original_theme
