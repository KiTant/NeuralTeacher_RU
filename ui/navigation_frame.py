import customtkinter
from typing import TYPE_CHECKING, Union
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

        for num, info in enumerate(self.buttons_to_create):
            button = customtkinter.CTkButton(self, corner_radius=20, height=40, border_spacing=10, text=info[1],
                                             fg_color="transparent", text_color=("gray10", "gray90"), hover_color=("gray70", "gray30"),
                                             image=getattr(MainWindow, info[2], None), anchor="w",
                                             command=lambda name=info[0]: MainWindow.select_frame_by_name(name))
            setattr(self, f"frame_{info[0]}_button", button)
            button.grid(row=num+1, column=0, sticky="ew")
            self.buttons[info[0]] = button

        self.grid(row=0, column=0, sticky="nsew")
        self.grid_rowconfigure(6, weight=1)

        self.navigation_frame_label = customtkinter.CTkLabel(self, text="  НейроУчитель", image=MainWindow.logo_image, compound="left",
                                                             font=customtkinter.CTkFont(size=15, weight="bold"))
        self.navigation_frame_label.grid(row=0, column=0, padx=20, pady=20)

        self.appearance_mode_menu = customtkinter.CTkOptionMenu(self, values=["Тёмная тема", "Светлая тема", "Системная тема"],
                                                                command=MainWindow.change_appearance_mode_event)
        self.appearance_mode_menu.grid(row=6, column=0, padx=20, pady=20, sticky="s")