from CTkMessagebox import CTkMessagebox
from g4f import ChatCompletion, Provider
from utils.variables import MODEL_MAP, APP_NAME, DISPLAY_APP_NAME, DEFAULT_SETTINGS, ORPK
import customtkinter as ctk
import threading
import json
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ui.assistant_frame import AssistantChatFrame


def parse_json_safely(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        candidate = text[start:end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            return None
    return None


def get_api_key(Window: "AssistantChatFrame", provider: Provider):
    api_key = None
    if provider == Provider.PollinationsAI:
        api_key = Window.MainWindow.settings.get("PAIK", DEFAULT_SETTINGS["PAIK"])
    elif provider == Provider.OpenRouter:
        api_key = ORPK
    return api_key


def send_message(Window: "AssistantChatFrame", event=None, message=None, system_prompt: str = None):
    user_message = Window.message_textbox.get("1.0", "end-1c") if message is None else message
    if not user_message.strip():
        return

    selected_model_name = Window.MainWindow.settings["ai_model"]
    selected_model_info = MODEL_MAP.get(selected_model_name)
    if not selected_model_info:
        Window.display_message({"role": APP_NAME,
                                "content": f"Ошибка: Модель '{selected_model_name}' не найдена или не поддерживается.",
                                "model_name": DISPLAY_APP_NAME}, "bot")
        return

    selected_model, selected_provider = selected_model_info

    user_message_data = {"role": "user", "content": user_message, "is_edited": False, "model_name": "User"}

    Window.display_message(user_message_data, "user")
    Window.message_history.append(user_message_data)
    Window.message_textbox.delete("1.0", ctk.END)
    Window.lock_input()

    threading.Thread(
        target=get_ai_response,
        args=(Window, Window.message_history.copy(), selected_model, selected_provider, selected_model_name, system_prompt),
        daemon=True
    ).start()


def get_ai_response(Window: "AssistantChatFrame", conversation_history, model, provider=None, model_name="AI", system_prompt: str = None):
    try:
        clean_history = [{"role": msg["role"], "content": msg["content"]} for msg in conversation_history if msg["role"] != APP_NAME]
        if system_prompt:
            clean_history.insert(0, {"role": "system", "content": system_prompt})
        api_key = get_api_key(Window, provider)
        response = ChatCompletion.create(model=model, messages=clean_history, provider=provider, stream=False, api_key=api_key)
        ai_response = response if isinstance(response, str) else str(response)
        ai_response_data = {"role": "assistant", "content": ai_response, "is_edited": False,
                            "type": "text", "model_name": model_name}
    except Exception as e:
        ai_response_data = {"role": APP_NAME,
                            "content": f"Ошибка при попытке получить ответ от ИИ:"
                                       f" {e}\nПопробуйте выбрать другую модель. "
                                       f"Будет лучше, если вы удалите это сообщение", "is_edited": False,
                            "type": "text", "model_name": model_name}
    Window.after(0, Window.display_ai_response, ai_response_data)


def regenerate_ai_response(Window: "AssistantChatFrame", ai_message_data, system_prompt: str = None):
    try:
        ai_index = Window.message_history.index(ai_message_data)
        if ai_index > 0 and Window.message_history[ai_index - 1]["role"] == "user":
            del Window.message_history[ai_index]
            Window.redraw_chat()

            selected_model_name = Window.MainWindow.settings["ai_model"]
            selected_model_info = MODEL_MAP.get(selected_model_name)
            if not selected_model_info:
                Window.display_message({"role": APP_NAME,
                                        "content": f'Ошибка: Модель "{selected_model_name}" не найдена или не поддерживается.',
                                        "type": "text", "model_name": DISPLAY_APP_NAME}, "bot")
                return
            selected_model, selected_provider = selected_model_info
            threading.Thread(
                target=get_ai_response,
                args=(Window, Window.message_history[:ai_index].copy(), selected_model,
                      selected_provider, selected_model_name, system_prompt),
                daemon=True
            ).start()

            Window.lock_input("Снова думаю...")

        else:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                          message=f"Ошибка в процессе перегенерирования ответа: "
                                  f"Предыдущее сообщение не является сообщением от пользователя,"
                                  f" и отредактировать ответ не представляется возможным.", icon="warning")
    except ValueError:
        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                      message=f"Ошибка в процессе перегенерирования ответа: Сообщение от ИИ не найдено в истории",
                      icon="warning")
    except Exception as e:
        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                      message=f"Ошибка в процессе перегенерирования ответа: {e}", icon="cancel")


def request_test_config(Window, request_dict: dict, on_config=None):
    difficulty = request_dict.get("difficulty", "Средний")
    questions = request_dict.get("questions", 10)
    generation_type = request_dict.get("generation_type", "По тем(е, ам)")
    input_text = request_dict.get("input_text", "")
    allow_mc = request_dict.get("allow_multiple_choice", True)
    allow_entry = request_dict.get("allow_entry_answer", True)
    expl_required = request_dict.get("explanation_required", True)

    config_template = (
        '{"title":"Название теста (короткое)", "shuffle":true,' \
        '"questions":[{"id":"q1","type":"multiple_choice","text":"Вопрос 1",' \
        '"options":["Вариант 1","Вариант 2","Вариант 3"],"correct":[0],"score":1,' \
        '"explanation":"Ответ/Пояснение (как можно короче, ЭТО ДОЛЖНО БЫТЬ ВСЕГДА, ЕСЛИ РАЗРЕШЕНО ПО ПАРАМЕТРУ)"}]}}'
    )

    user_prompt = (
        "Сделай конфиг в виде JSON для теста по следующим параметрам: "
        f"Сложность теста должна быть: {difficulty}; "
        f"Кол-во вопросов: {questions}; "
        f"Тип теста: {generation_type}; "
        f"Тем(а,ы)/Материал по которым должен быть тест: {input_text}; "
        f"НУЖНО ЛИ использовать вопросы с множественным выбором в конфиге: {'ДА' if allow_mc else 'НЕТ'}; "
        f"НУЖНО ЛИ использовать вопросы с письменным вводом в конфиге: {'ДА' if allow_entry else 'НЕТ'}; "
        f"НУЖНО ЛИ добавлять объяснения к ответам: {'ДА' if expl_required else 'НЕТ'}"
        "ШАБЛОН КОНФИГА: " + config_template + "\n\n"
        "Требования к конфигу: "
        "- Ровно один валидный объект JSON без пояснений и без markdown. "
        f"- В массиве questions должно быть ровно указанное количество вопросов: {questions}. "
        "- Типы вопросов: multiple_choice (один ответ), multi_select (несколько ответов), entry (ввод текста). "
        "- Для multiple_choice/multi_select поле options — массив строк, поле correct — массив индексов правильных опций. "
        "- Для entry поле correct — строка (образец ответа) или массив допустимых ответов. "
        "- Для каждого вопроса добавь поле score (целое число). "
        "- Не добавляй комментарии."
        "- НЕ делай такие выборы ответа, где сразу может быть ответ."
    )
    Window.lock_input("Генерация теста...")
    selected_model_name = Window.MainWindow.settings["ai_model"]
    selected_model_info = MODEL_MAP.get(selected_model_name)
    if not selected_model_info:
        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Тест)", message=f"Ошибка: Модель '{selected_model_name}' не найдена.", icon="warning")
        Window.unlock_input()
        return
    model, provider = selected_model_info

    def worker():
        try:
            messages = [
                {"role": "system", "content": "Ты генерируешь тесты и выводишь только валидный JSON. No code fences."},
                {"role": "user", "content": user_prompt}
            ]
            api_key = get_api_key(Window, provider)
            resp = ChatCompletion.create(model=model, messages=messages, provider=provider, stream=False, api_key=api_key)
            ai_response = resp if isinstance(resp, str) else str(resp)
            config = parse_json_safely(ai_response)
            if not isinstance(config, dict):
                raise ValueError("Не удалось распарсить JSON конфиг теста. "
                                 "Попробуйте запросить тест от ИИ снова. "
                                 "Если ошибка будет повторяться, попробуйте сменить модель.")

            def handle():
                if on_config:
                    on_config(config)
                else:
                    test_w = None
                    try:
                        from ui.in_test_window import InTestWindow
                        test_w = InTestWindow(Window.MainWindow, config)
                    except Exception as e:
                        Window.unlock_input()
                        test_w.destroy()
                        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Тест)", message=f"Ошибка открытия окна теста: {e}", icon="cancel")

            handle()
        except Exception as e:
            Window.unlock_input()
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Тест)", message=f"Ошибка генерации конфига: {e}", icon="cancel")

    threading.Thread(target=worker, daemon=True).start()

__all__ = ["send_message", "regenerate_ai_response", "request_test_config"]
