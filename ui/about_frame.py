import customtkinter
from typing import TYPE_CHECKING
from utils.updater import find_current_username, check_last_version
from utils.helpers import open_link
from utils.variables import VERSION, REPO_NAME
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class AboutFrame(customtkinter.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(master=MainWindow)
        self.title_label = customtkinter.CTkLabel(self, text=f"НейроУчитель",
                                                  font=customtkinter.CTkFont(size=24, weight="bold"))
        self.title_label.grid(row=0, column=0, padx=20, pady=(20, 5), sticky="w")

        self.version_label = customtkinter.CTkLabel(self, text=f"Версия: {VERSION}",
                                                    font=customtkinter.CTkFont(size=20, weight="bold"))
        self.version_label.grid(row=1, column=0, padx=20, pady=5, sticky="w")

        self.github_button = customtkinter.CTkButton(self, text="Открыть страницу GitHub проекта",
                                                     command=lambda: open_link(f"https://github.com/{find_current_username()}/{REPO_NAME}"))
        self.github_button.grid(row=2, column=0, padx=20, pady=(15, 5), sticky="w")

        self.update_button = customtkinter.CTkButton(self, text="Проверить обновления",
                                                     command=lambda: check_last_version(MainWindow))
        self.update_button.grid(row=3, column=0, padx=20, pady=5, sticky="w")

        self.all_versions_label = customtkinter.CTkLabel(self, text=f"Сборник всех версий программы НейроУчитель в Telegram на случай блокировки GitHub в РФ:",
                                                         font=customtkinter.CTkFont(size=20, weight="bold"), justify="left", wraplength=800)
        self.all_versions_label.grid(row=4, column=0, padx=20, pady=(15, 5), sticky="w")
        self.telegram_channel_button = customtkinter.CTkButton(self, text="Перейти в Telegram канал",
                                                               command=lambda: open_link("https://t.me/+xb_ogXI6kZc0MDIy"))
        self.telegram_channel_button.grid(row=5, column=0, padx=20, pady=5, sticky="w")
        self.api_key_info = customtkinter.CTkLabel(self, text=f"Если хотите посмотреть пример получения API ключа, то можете глянуть видео-инструкцию в Telegram "
                                                              f"канале (выше) или Youtube (ниже)",
                                                   font=customtkinter.CTkFont(size=16, weight="bold"),
                                                   justify="left", wraplength=750)
        self.api_key_info.grid(row=6, column=0, padx=20, pady=(15, 5), sticky="w")
        self.api_key_guide_button = customtkinter.CTkButton(self, text="Перейти на видео по примеру получения API ключа (на Youtube)",
                                                            command=lambda: open_link("https://www.youtube.com/watch?v=RVGnYL8ORXU"))
        self.api_key_guide_button.grid(row=7, column=0, padx=20, pady=5, sticky="w")
