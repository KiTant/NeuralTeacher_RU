import customtkinter
from customtkinter.windows.widgets.theme.theme_manager import ThemeManager
from typing import TYPE_CHECKING
from CTkListbox import CTkListbox
from utils.variables import MAIN_THEMES, MODEL_MAP, DEFAULT_SETTINGS, FILES, MAIN_THEMES_TRANSLATED
from utils.helpers import resource_path
from utils.settings_manager import *
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class SettingsFrame(customtkinter.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(master=MainWindow)
        self.MainWindow = MainWindow

        self.setting_ui_elements = {}

        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        self.left_frame = customtkinter.CTkFrame(self)
        self.left_frame.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        self.left_frame.grid_columnconfigure(0, weight=1)

        self.theme_title = customtkinter.CTkLabel(self.left_frame, text="Основная тема (цвет)",
                                                  font=customtkinter.CTkFont(size=15, weight="bold"))
        self.theme_title.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="w")

        self.theme_listbox = CTkListbox(self.left_frame, command=self._on_theme_select, height=120,
                                        hover_color=ThemeManager.theme["CTkOptionMenu"]["button_hover_color"],
                                        highlight_color=ThemeManager.theme["CTkButton"]["hover_color"])
        self.theme_listbox.grid(row=1, column=0, padx=10, pady=(0, 15), sticky="nsew")
        for theme in MAIN_THEMES:
            self.theme_listbox.insert("END", theme)

        self.model_title = customtkinter.CTkLabel(self.left_frame, text="Модель ИИ",
                                                  font=customtkinter.CTkFont(size=15, weight="bold"))
        self.model_title.grid(row=2, column=0, padx=10, pady=(10, 5), sticky="w")

        self.model_listbox = CTkListbox(self.left_frame, command=self._on_model_select, height=150,
                                        hover_color=ThemeManager.theme["CTkOptionMenu"]["button_hover_color"],
                                        highlight_color=ThemeManager.theme["CTkButton"]["hover_color"])
        self.model_listbox.grid(row=3, column=0, padx=10, pady=(0, 10), sticky="nsew")
        for model in MODEL_MAP.keys():
            self.model_listbox.insert("END", model)

        self.NPAIK_title = customtkinter.CTkLabel(self.left_frame, text="PAIK (Ключ от PollinationsAI)",
                                                  font=customtkinter.CTkFont(size=15, weight="bold"))
        self.NPAIK_title.grid(row=4, column=0, padx=10, pady=(10, 5), sticky="w")

        self.NPAIK_entry = customtkinter.CTkEntry(self.left_frame, placeholder_text='Пример: pk_h4IsO47pElkU9WYL')
        self.NPAIK_entry.grid(row=5, column=0, padx=10, pady=(0, 10), sticky="nsew")

        self.NPAIK_entry.bind("<KeyRelease>", lambda x: self._on_entry_change("PAIK", self.NPAIK_entry))

        self.right_frame = customtkinter.CTkFrame(self)
        self.right_frame.grid(row=0, column=1, padx=(0, 20), pady=20, sticky="nsew")
        self.right_frame.grid_columnconfigure(0, weight=1)

        self.toggles_title = customtkinter.CTkLabel(self.right_frame, text="Поведение приложения",
                                                    font=customtkinter.CTkFont(size=15, weight="bold"))
        self.toggles_title.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="w")

        self.cb_keybinds = customtkinter.CTkCheckBox(self.right_frame, text="Горячие клавиши (скоро)",
                                                     command=lambda: self._on_toggle("keybinds", self.cb_keybinds))
        self.cb_hw_load = customtkinter.CTkCheckBox(self.right_frame, text="Автозагрузка чатов ДЗ",
                                                    command=lambda: self._on_toggle("auto_homework_load", self.cb_hw_load))
        self.cb_hw_save = customtkinter.CTkCheckBox(self.right_frame, text="Автосохранение чатов ДЗ",
                                                    command=lambda: self._on_toggle("auto_homework_save", self.cb_hw_save))
        self.cb_expl_load = customtkinter.CTkCheckBox(self.right_frame, text="Автозагрузка чатов объяснений",
                                                      command=lambda: self._on_toggle("auto_explanation_load", self.cb_expl_load))
        self.cb_expl_save = customtkinter.CTkCheckBox(self.right_frame, text="Автосохранение чатов объяснений",
                                                      command=lambda: self._on_toggle("auto_explanation_save", self.cb_expl_save))
        self.cb_tray_icon = customtkinter.CTkCheckBox(self.right_frame, text="Иконка в трее (после закрытия программы)",
                                                      command=lambda: self._on_toggle("tray_icon", self.cb_tray_icon))

        self.cb_keybinds.grid(row=1, column=0, padx=10, pady=4, sticky="w")
        self.cb_hw_load.grid(row=2, column=0, padx=10, pady=4, sticky="w")
        self.cb_hw_save.grid(row=3, column=0, padx=10, pady=4, sticky="w")
        self.cb_expl_load.grid(row=4, column=0, padx=10, pady=4, sticky="w")
        self.cb_expl_save.grid(row=5, column=0, padx=10, pady=4, sticky="w")
        self.cb_tray_icon.grid(row=6, column=0, padx=10, pady=4, sticky="w")

        self.setting_ui_elements[self.cb_keybinds] = ("CheckBox", "keybinds")
        self.setting_ui_elements[self.cb_hw_load] = ("CheckBox", "auto_homework_load")
        self.setting_ui_elements[self.cb_hw_save] = ("CheckBox", "auto_homework_save")
        self.setting_ui_elements[self.cb_expl_load] = ("CheckBox", "auto_explanation_load")
        self.setting_ui_elements[self.cb_expl_save] = ("CheckBox", "auto_explanation_save")
        self.setting_ui_elements[self.cb_tray_icon] = ("CheckBox", "tray_icon")
        self.setting_ui_elements[self.NPAIK_entry] = ("Entry", "PAIK")

        self.after(250, self._set_vars)

        self.actions_frame = customtkinter.CTkFrame(self.right_frame, fg_color="transparent")
        self.actions_frame.grid(row=7, column=0, padx=10, pady=(10, 5), sticky="ew")
        self.actions_frame.grid_columnconfigure((0, 1), weight=1)

        self.btn_save_apply = customtkinter.CTkButton(self.actions_frame, text="Сохранить действующие",
                                                      command=self._save_settings)
        self.btn_save_apply.grid(row=0, column=0, padx=(5, 0), pady=5, sticky="ew")
        self.btn_apply_previous = customtkinter.CTkButton(self.actions_frame, text="Применить с последнего сохранения",
                                                      command=self._apply_previous_settings)
        self.btn_apply_previous.grid(row=0, column=1, padx=(5, 0), pady=5, sticky="ew")

        self.NPAIK_desc = customtkinter.CTkLabel(self.right_frame,
                                                 text=f"NPAIK - Нужен PollinationsAI Key для модели ИИ; Подробнее в 'О программе'",
                                                 font=customtkinter.CTkFont(size=16, weight="bold"), justify="left", wraplength=500)
        self.NPAIK_desc.grid(row=8, column=0, padx=0, pady=5, sticky="w")

        self.AC1_desc = customtkinter.CTkLabel(self.right_frame,
                                               text=f"AC1 - Нужен работающий VPN либо включенный Cloudflare WARP для модели ИИ (для пользователей из РФ)",
                                               font=customtkinter.CTkFont(size=16, weight="bold"), justify="left",
                                               wraplength=500)
        self.AC1_desc.grid(row=9, column=0, padx=0, pady=5, sticky="w")

    @staticmethod
    def _set_checkbox_from_setting(checkbox: customtkinter.CTkCheckBox, value: str):
        if str(value).lower() == "enabled":
            checkbox.select()
        else:
            checkbox.deselect()

    @staticmethod
    def _set_entry_from_setting(entry: customtkinter.CTkEntry, value: str):
        entry.delete(0, customtkinter.END)
        entry.insert(0, value)

    def _on_theme_select(self, selected_option: str):
        if self.btn_apply_previous.cget("state") == "normal":
            current_loaded_theme = ThemeManager._currently_loaded_theme.rsplit("/")[-1][:-5].capitalize()
            should_recreate = (self.MainWindow.settings["main_theme"] != self._get_translated_theme_name(selected_option)
                               or self.MainWindow.settings["main_theme"] != current_loaded_theme)
            self.MainWindow.settings["main_theme"] = self._get_translated_theme_name(selected_option)
            customtkinter.set_default_color_theme(resource_path(f'assets/themes/{self.MainWindow.settings["main_theme"].lower()}.json'))
            if should_recreate:
                self.MainWindow.create_frames()

    def _on_model_select(self, selected_option: str):
        if self.btn_apply_previous.cget("state") == "normal":
            self.MainWindow.settings["ai_model"] = selected_option

    def _on_toggle(self, key: str, checkbox: customtkinter.CTkCheckBox):
        self.MainWindow.settings[key] = "Enabled" if bool(checkbox.get()) else "Disabled"

    def _on_entry_change(self, key: str, entry: customtkinter.CTkEntry):
        self.MainWindow.settings[key] = entry.get() if entry.get().strip() != "" else ""

    def _save_settings(self):
        settings_save(self.MainWindow, FILES.get("settings_file"))

    def _apply_previous_settings(self):
        settings_load(self.MainWindow, FILES.get("settings_file"))
        self._set_vars()

    def _set_vars(self):
        for elem, info in self.setting_ui_elements.items():
            if info[0] == "CheckBox":
                self._set_checkbox_from_setting(elem, self.MainWindow.settings.get(info[1], DEFAULT_SETTINGS[info[1]]))
            elif info[0] == "Entry":
                self._set_entry_from_setting(elem, self.MainWindow.settings.get(info[1], DEFAULT_SETTINGS[info[1]]))
        try:
            self.model_listbox.select(list(MODEL_MAP.keys()).index(self.MainWindow.settings.get("ai_model", DEFAULT_SETTINGS["ai_model"])))
        except ValueError:
            self.model_listbox.select(list(MODEL_MAP.keys()).index(DEFAULT_SETTINGS["ai_model"]))
        self.theme_listbox.select(MAIN_THEMES.index(self._get_translated_theme_name(self.MainWindow.settings["main_theme"], False)))
        self.MainWindow.navigation_frame.appearance_mode_menu.set("Тёмная тема" if self.MainWindow.settings['theme'] == "Dark"
                                      else "Светлая тема" if self.MainWindow.settings['theme'] == "Light" else "Системная тема")

    def toggle_change_ability(self, enabled: bool):
        for elem in self.setting_ui_elements.keys():
            elem.configure(state="normal" if enabled else "disabled")
        self.btn_apply_previous.configure(state="normal" if enabled else "disabled")
        self.MainWindow.navigation_frame.frame_settings_button.configure(state="normal" if enabled else "disabled")

    @staticmethod
    def _get_translated_theme_name(key: str, absolute: bool = True):
        return MAIN_THEMES_TRANSLATED.get(key, "Blue") if absolute else (
            list(MAIN_THEMES_TRANSLATED.keys()))[list(MAIN_THEMES_TRANSLATED.values()).index(key)]
