import customtkinter
from customtkinter.windows.widgets.theme.theme_manager import ThemeManager
from typing import TYPE_CHECKING
from CTkListbox import CTkListbox
from utils.variables import MAIN_THEMES, MODEL_MAP, DEFAULT_SETTINGS, FILES, MAIN_THEMES_TRANSLATED, PROVIDER_MAP
from g4f import Provider
from utils.helpers import resource_path, entry_keybinds_normalize
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

        self.theme_listbox = CTkListbox(self.left_frame, command=self._on_theme_select, height=100,
                                        hover_color=ThemeManager.theme["CTkOptionMenu"]["button_hover_color"],
                                        highlight_color=ThemeManager.theme["CTkButton"]["hover_color"])
        self.theme_listbox.grid(row=1, column=0, padx=10, pady=(0, 15), sticky="nsew")
        for theme in MAIN_THEMES:
            self.theme_listbox.insert("END", theme)

        self.model_title = customtkinter.CTkLabel(self.left_frame, text="Модель ИИ",
                                                  font=customtkinter.CTkFont(size=15, weight="bold"))
        self.model_title.grid(row=2, column=0, padx=10, pady=(10, 5), sticky="w")

        self.model_listbox = CTkListbox(self.left_frame, command=self._on_model_select, height=120,
                                        hover_color=ThemeManager.theme["CTkOptionMenu"]["button_hover_color"],
                                        highlight_color=ThemeManager.theme["CTkButton"]["hover_color"])
        self.model_listbox.grid(row=3, column=0, padx=10, pady=(0, 10), sticky="nsew")
        for model in MODEL_MAP.keys():
            self.model_listbox.insert("END", model)

        self.model_provider_title = customtkinter.CTkLabel(self.left_frame, text="Провайдер модели ИИ",
                                                           font=customtkinter.CTkFont(size=15, weight="bold"))
        self.model_provider_title.grid(row=4, column=0, padx=10, pady=(10, 5), sticky="w")

        self.model_provider_listbox = CTkListbox(self.left_frame, command=self._on_model_provider_select, height=100,
                                                 hover_color=ThemeManager.theme["CTkOptionMenu"]["button_hover_color"],
                                                 highlight_color=ThemeManager.theme["CTkButton"]["hover_color"])
        self.model_provider_listbox.grid(row=5, column=0, padx=10, pady=(0, 10), sticky="nsew")
        for provider in MODEL_MAP[self.MainWindow.settings["ai_model"]].keys():
            self.model_provider_listbox.insert("END", provider.__name__)

        self.provider_key_title = customtkinter.CTkLabel(self.left_frame, text="API ключ для провайдера",
                                                         font=customtkinter.CTkFont(size=15, weight="bold"))
        self.provider_key_title.grid(row=6, column=0, padx=10, pady=(10, 5), sticky="w")

        self.provider_key_entry = customtkinter.CTkEntry(self.left_frame, placeholder_text='Пример: pk_h4IsO47pElkU9WYL')
        self.provider_key_entry.grid(row=7, column=0, padx=10, pady=(0, 10), sticky="nsew")

        self.provider_key_entry.bind("<KeyRelease>",
                                     lambda x: self._on_entry_change(PROVIDER_MAP[getattr(Provider, self.MainWindow.settings["provider"], None)][0], self.provider_key_entry),
                                     add="+")

        entry_keybinds_normalize(self.provider_key_entry)

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
        self.setting_ui_elements[self.provider_key_entry] = ("Entry",
                                                             PROVIDER_MAP[getattr(Provider,
                                                                                  self.MainWindow.settings["provider"],
                                                                                  list(MODEL_MAP[self.MainWindow.settings["ai_model"]].keys())[0])][0])

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

        self.api_key_desc = customtkinter.CTkLabel(self.right_frame,
                                                   text=f"API ключ для провайдера - Особый ключ для получения доступа к моделям определённого провайдера. "
                                                        f"Можно получить на сайте провайдера, который легко найти в поисковике по названию. "
                                                        f'В "О программе" есть пример получения API ключа',
                                                   font=customtkinter.CTkFont(size=16, weight="bold"), justify="left", wraplength=500)
        self.api_key_desc.grid(row=8, column=0, padx=0, pady=5, sticky="w")

        self.provider_desc = customtkinter.CTkLabel(self.right_frame,
                                                    text=f"Инфо о выбранном провайдере: ...",
                                                    font=customtkinter.CTkFont(size=16, weight="bold"), justify="left", wraplength=500)
        self.provider_desc.grid(row=9, column=0, padx=0, pady=5, sticky="w")

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
            self.model_provider_listbox.delete("all")
            self.MainWindow.settings["ai_model"] = selected_option
            names = []
            for provider in MODEL_MAP[self.MainWindow.settings["ai_model"]].keys():
                self.model_provider_listbox.insert("END", provider.__name__)
                names.append(provider.__name__)
            try:
                self.model_provider_listbox.select(names.index(self.MainWindow.settings["provider"]))
            except ValueError:
                self.model_provider_listbox.select(0)

    def _on_model_provider_select(self, selected_option: str):
        if self.btn_apply_previous.cget("state") == "normal":
            self.MainWindow.settings["provider"] = selected_option
            provider = getattr(Provider, self.MainWindow.settings["provider"], None)
            needs_api_key = PROVIDER_MAP[provider][0] if provider else None
            self.provider_desc.configure(text=f'Инфо о выбранном провайдере: {PROVIDER_MAP[provider][1] if provider else "..."}')
            if needs_api_key:
                from utils.helpers import get_api_key
                if not self.provider_key_title.winfo_manager():
                    self.provider_key_title.grid(row=6, column=0, padx=10, pady=(10, 5), sticky="w")
                    self.provider_key_entry.grid(row=7, column=0, padx=10, pady=(0, 10), sticky="nsew")
                self.provider_key_entry.delete(0, "end")
                self.provider_key_entry.insert(0, get_api_key(self, provider) or "")
            else:
                self.provider_key_title.grid_forget()
                self.provider_key_entry.grid_forget()

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
                self._set_entry_from_setting(elem, self.MainWindow.settings.get(info[1], DEFAULT_SETTINGS.get(info[1], "")))
        self.model_listbox.select(list(MODEL_MAP.keys()).index(self.MainWindow.settings.get("ai_model", DEFAULT_SETTINGS["ai_model"])))
        self.theme_listbox.select(MAIN_THEMES.index(self._get_translated_theme_name(self.MainWindow.settings["main_theme"], False)))
        names = [button.cget("text") for button in self.model_provider_listbox.buttons.values()]
        self.model_provider_listbox.select(names.index(self.MainWindow.settings["provider"]))
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
