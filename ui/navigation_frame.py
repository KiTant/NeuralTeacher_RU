import customtkinter
from typing import TYPE_CHECKING
from utils.variables import Logger
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class NavigationFrame(customtkinter.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(master=MainWindow)
        self.MainWindow = MainWindow

        self.buttons_to_create = (("tests", "Создание теста", "create_test_image"), ("explanation", "Объяснение\nтемы / понятий", "explanation_chat_image"),
                                  ("homework", "Помощь с ДЗ", "homework_help_image"), ("settings", "Настройки", "settings_image"),
                                  ("about", "О программе", "about_image"))
        self.buttons = {}
        if self.MainWindow.settings["logging"] == "Enabled": Logger.log_action("Создание кнопок в навигации...")
        for num, (key, name, icon_name) in enumerate(self.buttons_to_create):
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_action(f"Создание кнопки {num}: {key}, {name}, {icon_name}...")
            button = customtkinter.CTkButton(self, corner_radius=20, height=40, border_spacing=10, text=name,
                                             fg_color="transparent", text_color=("gray10", "gray90"), hover_color=("gray70", "gray30"),
                                             image=MainWindow.images.get(icon_name, None), anchor="w",
                                             command=lambda frame_name=key: MainWindow.select_frame_by_name(frame_name))
            setattr(self, f"frame_{key}_button", button)
            button.grid(row=num+1, column=0, sticky="ew")
            self.buttons[key] = button
        if self.MainWindow.settings["logging"] == "Enabled": Logger.log_info("Кнопки в навигации созданы")

        self.grid(row=0, column=0, sticky="nsew")
        self.grid_rowconfigure(6, weight=1)

        self.navigation_frame_label = customtkinter.CTkLabel(self, text="  НейроУчитель", image=MainWindow.images["logo_image"], compound="left",
                                                             font=customtkinter.CTkFont(size=15, weight="bold"))
        self.navigation_frame_label.grid(row=0, column=0, padx=20, pady=20)

        self.appearance_mode_menu = customtkinter.CTkOptionMenu(self, values=["Тёмная тема", "Светлая тема", "Системная тема"],
                                                                command=MainWindow.change_appearance_mode_event)
        self.appearance_mode_menu.grid(row=6, column=0, padx=20, pady=20, sticky="s")