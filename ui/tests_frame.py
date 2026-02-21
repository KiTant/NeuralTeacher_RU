import customtkinter as ctk
from CTkCodeBoxPlus import CTkCodeBox, MenuSettings, NumberingSettings
import tkinter as tk
from typing import TYPE_CHECKING
from utils.ai_manager import request_test_config
from utils.variables import FILES
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
        self.send_button.grid(row=9, column=0, padx=10, pady=(10, 15), sticky="ew")

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
                                        highlight_current_line=False)
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

    def lock_input(self, text):
        self.send_button.configure(state="disabled", text=text)
        self.MainWindow.settings_frame.toggle_change_ability(False)

    def unlock_input(self):
        self.send_button.configure(state="normal", text="Сформировать запрос")
        self.MainWindow.settings_frame.toggle_change_ability(True)

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
