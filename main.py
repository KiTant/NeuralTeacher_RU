import customtkinter as ctk
from ui.main_window import MainWindow
from utils.variables import DEFAULT_SETTINGS, resource_path, IS_WIN7
import g4f
from utils.variables import Logger

g4f.debug.version_check = False
if IS_WIN7:
    Logger.log_info("Приложение запущено с поддержкой Windows 7")
    import asyncio
    import sys

    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

ctk.set_appearance_mode(DEFAULT_SETTINGS["theme"])
ctk.set_default_color_theme(resource_path(f'assets/themes/{DEFAULT_SETTINGS["main_theme"].lower()}.json'))

if __name__ == '__main__':
    Logger.log_action("Запуск основного окна...")
    app = MainWindow()
    app.mainloop()
