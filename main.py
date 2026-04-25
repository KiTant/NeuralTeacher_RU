import customtkinter as ctk
from ui.main_window import MainWindow
from utils.variables import DEFAULT_SETTINGS, resource_path, IS_WIN7
import g4f

g4f.debug.version_check = False
if IS_WIN7:
    import asyncio
    import sys

    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

ctk.set_appearance_mode(DEFAULT_SETTINGS["theme"])
ctk.set_default_color_theme(resource_path(f'assets/themes/{DEFAULT_SETTINGS["main_theme"].lower()}.json'))

if __name__ == '__main__':
    app = MainWindow()
    app.mainloop()
