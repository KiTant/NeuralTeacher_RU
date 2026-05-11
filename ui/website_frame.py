import multiprocessing
import customtkinter
import webview
from utils.variables import resource_path
from typing import TYPE_CHECKING, Union
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


def open_window():
    webview.create_window("НейроУчитель: Теория и инструменты",
                          resource_path('website/NeuralTeacherWeb.html'),
                          width=1200, height=800, min_size=(800, 600))
    webview.start()


class WebsiteFrame(customtkinter.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(master=MainWindow)
        self.web_info = customtkinter.CTkLabel(self, text="Окно открывается не сразу (около 2-3 секунд). Закрывается около 3-4 секунд",
                                               font=customtkinter.CTkFont(size=16, weight="bold"),
                                               justify="left", wraplength=750)
        self.web_info.grid(row=0, column=0, padx=20, pady=(15, 5), sticky="w")
        self.browser_process: Union[multiprocessing.Process, None] = None

    def close_window(self):
        if self.browser_process and self.browser_process.is_alive():
            self.browser_process.terminate()
            self.browser_process.join()
            self.browser_process = None
        else:
            return

    def start(self):
        if self.browser_process is None or not self.browser_process.is_alive():
            self.browser_process = multiprocessing.Process(target=open_window, daemon=True)
            self.browser_process.start()
        else:
            return

    def destroy(self):
        self.close_window()
        super().destroy()
