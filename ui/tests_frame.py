import customtkinter as ctk
from CTkCodeBoxPlus import CTkCodeBox, MenuSettings, NumberingSettings
import tkinter as tk
from CTkMessagebox import CTkMessagebox
from typing import TYPE_CHECKING
from utils.ai_manager import request_test_config
from utils.variables import FILES, DEFAULT_CTKCODEBOX_KEYBINDINGS, DISPLAY_APP_NAME, Logger
import os
import json
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class TestsFrame(ctk.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(master=MainWindow)

        self.MainWindow = MainWindow
        self.save_debounce = False

        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=2)

        self.params_frame = ctk.CTkFrame(self)
        self.params_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        self.params_frame.grid_columnconfigure(0, weight=1)

        self.params_title = ctk.CTkLabel(self.params_frame, text="Параметры теста (для генерации)",
                                         font=ctk.CTkFont(size=16, weight="bold"))
        self.params_title.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="w")

        self.diff_label = ctk.CTkLabel(self.params_frame, text="Сложность:")
        self.diff_label.grid(row=1, column=0, padx=10, pady=(5, 0), sticky="w")
        self.difficulty_var = tk.StringVar(value="Средний")
        self.diff_frame = ctk.CTkFrame(self.params_frame, fg_color="transparent")
        self.diff_frame.grid(row=2, column=0, padx=10, pady=5, sticky="w")
        self.diff_easy = ctk.CTkRadioButton(self.diff_frame, text="Лёгкий", variable=self.difficulty_var, 
                                            value="Лёгкий", command=self._auto_save_cfg)
        self.diff_medium = ctk.CTkRadioButton(self.diff_frame, text="Средний", variable=self.difficulty_var, 
                                              value="Средний", command=self._auto_save_cfg)
        self.diff_hard = ctk.CTkRadioButton(self.diff_frame, text="Тяжёлый", variable=self.difficulty_var, 
                                            value="Тяжёлый", command=self._auto_save_cfg)
        self.diff_easy.grid(row=0, column=0, padx=(0, 10), pady=0, sticky="w")
        self.diff_medium.grid(row=0, column=1, padx=(0, 10), pady=0, sticky="w")
        self.diff_hard.grid(row=0, column=2, padx=(0, 10), pady=0, sticky="w")

        self.q_label = ctk.CTkLabel(self.params_frame, text="Количество вопросов:")
        self.q_label.grid(row=3, column=0, padx=10, pady=(10, 0), sticky="w")
        self.q_value_label = ctk.CTkLabel(self.params_frame, text="10")
        self.q_value_label.grid(row=3, column=0, padx=10, pady=(10, 0), sticky="e")
        self.q_slider = ctk.CTkSlider(self.params_frame, from_=5, to=25, command=self._on_q_slider)
        self.q_slider.set(10)
        self.q_slider.grid(row=4, column=0, padx=10, pady=5, sticky="ew")

        self.types_label = ctk.CTkLabel(self.params_frame, text="Типы вопросов:")
        self.types_label.grid(row=5, column=0, padx=10, pady=(10, 0), sticky="w")
        self.checkbox_multiple = ctk.CTkCheckBox(self.params_frame, text="Несколько вариантов ответа", 
                                                 command=self._auto_save_cfg)
        self.checkbox_entry = ctk.CTkCheckBox(self.params_frame, text="Ввод ответа (через поле)", 
                                              command=self._auto_save_cfg)
        self.checkbox_multiple.grid(row=6, column=0, padx=10, pady=2, sticky="w")
        self.checkbox_entry.grid(row=7, column=0, padx=10, pady=2, sticky="w")

        self.expl_required = ctk.CTkCheckBox(self.params_frame, text="Генерировать объяснение к каждому заданию", 
                                             command=self._auto_save_cfg)
        self.expl_required.grid(row=8, column=0, padx=10, pady=(30, 0), sticky="w")

        self.send_button = ctk.CTkButton(self.params_frame, text="Отправить запрос", command=self.create_cfg)
        self.send_button.grid(row=9, column=0, padx=10, pady=(10, 5), sticky="ew")

        self.io_frame = ctk.CTkFrame(self.params_frame, fg_color="transparent")
        self.io_frame.grid(row=10, column=0, padx=10, pady=(0, 15), sticky="ew")
        self.io_frame.grid_columnconfigure(0, weight=1)
        self.io_frame.grid_columnconfigure(1, weight=1)

        self.export_button = ctk.CTkButton(self.io_frame, text="Выгрузить в файл", command=self._export_to_file)
        self.export_button.grid(row=0, column=0, padx=(0, 5), pady=0, sticky="ew")

        self.import_button = ctk.CTkButton(self.io_frame, text="Загрузить из файла", command=self._import_from_file)
        self.import_button.grid(row=0, column=1, padx=(5, 0), pady=0, sticky="ew")

        self.input_frame = ctk.CTkFrame(self)
        self.input_frame.grid(row=0, column=1, padx=(0, 20), pady=20, sticky="nsew")
        self.input_frame.grid_rowconfigure(3, weight=1)
        self.input_frame.grid_columnconfigure(0, weight=1)

        self.input_title = ctk.CTkLabel(self.input_frame, text="Тем(а, ы) или материал для теста",
                                        font=ctk.CTkFont(size=16, weight="bold"))
        self.input_title.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="w")

        self.gen_type_var = tk.StringVar(value="topics")
        self.gen_type_frame = ctk.CTkFrame(self.input_frame, fg_color="transparent")
        self.gen_type_frame.grid(row=1, column=0, padx=10, pady=5, sticky="w")
        self.radiobutton_topics = ctk.CTkRadioButton(self.gen_type_frame, text="По тем(е, ам)",
                                                     variable=self.gen_type_var, value="topics",
                                                     command=self._auto_save_cfg)
        self.radiobutton_material = ctk.CTkRadioButton(self.gen_type_frame, text="По материалу",
                                                       variable=self.gen_type_var, value="material",
                                                       command=self._auto_save_cfg)
        self.radiobutton_topics.grid(row=0, column=0, padx=(0, 10), pady=0, sticky="w")
        self.radiobutton_material.grid(row=0, column=1, padx=(0, 10), pady=0, sticky="w")

        self.input_hint = ctk.CTkLabel(self.input_frame, text="Введите темы через запятую ИЛИ напишите материал.")
        self.input_hint.grid(row=2, column=0, padx=10, pady=(0, 5), sticky="w")
        self.topic_textbox = CTkCodeBox(self.input_frame, height=200, language="text",
                                        menu_settings=MenuSettings(False), numbering_settings=NumberingSettings(False),
                                        highlight_current_line=False, keybinding_settings=DEFAULT_CTKCODEBOX_KEYBINDINGS)
        self.topic_textbox.grid(row=3, column=0, padx=10, pady=(0, 10), sticky="nsew")
        self.topic_textbox.bind("<KeyRelease>", lambda k: self._auto_save_cfg())

        self._auto_load_cfg()

    def _on_q_slider(self, value, save: bool = True):
        value_int = int(round(value))
        self.q_value_label.configure(text=str(value_int))
        if save:
            self._auto_save_cfg()

    def create_cfg(self, request_test: bool = True):
        params = {
            "difficulty": self.difficulty_var.get(),
            "generation_type": self.gen_type_var.get(),
            "questions": int(round(float(self.q_slider.get()))),
            "allow_multiple_choice": bool(self.checkbox_multiple.get()),
            "allow_entry_answer": bool(self.checkbox_entry.get()),
            "explanation_required": self.expl_required.get(),
            "input_text": self.topic_textbox.get("1.0", ctk.END).strip()
        }
        if request_test:
            self._auto_save_cfg()
            request_test_config(self, params)
        return params

    def _export_to_file(self):
        content = self.topic_textbox.get("1.0", ctk.END).strip()
        if not content:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (экспорт текста)", message="Текстовое поле пустое — нечего выгружать.", icon="warning")
            return
        filepath = ctk.filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Текстовые файлы", "*.txt"), ("Все файлы", "*.*")],
            title="Сохранить текст в файл"
        )
        try:
            if filepath:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
        except PermissionError as e:
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Не удалось записать файл для экспорта из теста (Permission): {e}")
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (экспорт текста)", message=f"Ошибка прав: {e}", icon="warning")
        except Exception as e:
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Не удалось записать файл для экспорта из теста: {e}")
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (экспорт текста)", message=f"Неизвестная ошибка: {e}", icon="warning")

    def _import_from_file(self):
        filepath = ctk.filedialog.askopenfilename(
            filetypes=[("Текстовые файлы", "*.txt"), ("Word документы", "*.docx *.doc"), ("OpenOffice/LibreOffice документы", "*.odt"),
                       ("Markdown файлы", "*.md"), ("PDF файлы", "*.pdf"), ("Все файлы", "*.*")],
            title="Выбрать файл для загрузки"
        )
        if not filepath or not os.path.exists(filepath):
            return
        ext = os.path.splitext(filepath)[1].lower()
        try:
            if ext in [".txt", ".md"]:
                try:
                    with open(filepath, "r", encoding='utf-8') as f:
                        text = f.read()
                except UnicodeDecodeError:
                    try:
                        with open(filepath, "r", encoding='cp1251') as f:
                            text = f.read()
                    except UnicodeDecodeError:
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            text = f.read()
            elif ext == ".docx":
                from docx import Document
                doc = Document(filepath)
                text = "\n".join(p.text for p in doc.paragraphs)
            elif ext == ".pdf":
                import pdfplumber
                with pdfplumber.open(filepath) as pdf:
                    text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            elif ext == ".odt":
                from odf import text as odf_text, teletype, opendocument
                doc = opendocument.load(filepath)
                text = "\n".join(teletype.extractText(p) for p in doc.getElementsByType(odf_text.P))
            elif ext == ".doc":  # Только для Windows
                try:
                    import win32com.client
                    word = win32com.client.Dispatch("Word.Application")
                    word.Visible = False
                    doc = word.Documents.Open(os.path.abspath(filepath))
                    text = doc.Content.Text
                    doc.Close()
                    word.Quit()
                except Exception as e:
                    CTkMessagebox(title=f"{DISPLAY_APP_NAME} (импорт текста)",
                                  message=f"Ошибка чтения .doc (требуется MS Word): {e}",
                                  icon="warning")
                    return
            else:
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (импорт текста)",
                              message=f"Формат '{ext}' не поддерживается.\n"
                                      f"Поддерживаются: .doc, .docx, .pdf, .odt, .txt, .md",
                              icon="warning")
                return
            if text.strip():
                self.topic_textbox.delete("1.0", ctk.END)
                self.topic_textbox.insert("1.0", text.strip())
                self._auto_save_cfg()
            else:
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (импорт текста)", message="Файл не содержит текста.", icon="warning")
        except Exception as e:
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Не удалось прочитать файл для импорта в тест: {e}")
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (импорт текста)", message=f"Не удалось прочитать файл: {e}", icon="cancel")

    def lock_input(self, text):
        self.send_button.configure(state="disabled", text=text)
        self.MainWindow.frames["settings"].toggle_change_ability(False)

    def unlock_input(self):
        self.send_button.configure(state="normal", text="Сформировать запрос")
        self.MainWindow.frames["settings"].toggle_change_ability(True)

    def _auto_load_cfg(self):
        path = FILES.get(f"last_test_file")
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            if isinstance(data, dict) and data:
                self.difficulty_var.set(data["difficulty"])
                self.gen_type_var.set(data["generation_type"])
                self.q_slider.set(data["questions"])
                self._on_q_slider(data["questions"], False)
                self.checkbox_multiple.select() if data["allow_multiple_choice"] else self.checkbox_multiple.deselect()
                self.checkbox_entry.select() if data["allow_entry_answer"] else self.checkbox_entry.deselect()
                self.expl_required.select() if data["explanation_required"] else self.expl_required.deselect()
                self.topic_textbox.delete("1.0", ctk.END)
                self.topic_textbox.insert("1.0", data["input_text"], push_history=False)

    def _auto_save_cfg(self):
        if not self.save_debounce:
            self.save_debounce = True
            self.after(1000, setattr, self, "save_debounce", False)
            path = FILES.get(f"last_test_file")
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(self.create_cfg(False), f, ensure_ascii=False, indent=4)
