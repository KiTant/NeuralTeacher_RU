import customtkinter as ctk
from ui.main_window import MainWindow
from utils.helpers import resource_path
from utils.variables import DEFAULT_SETTINGS

ctk.set_appearance_mode(DEFAULT_SETTINGS["theme"])
ctk.set_default_color_theme(resource_path(f'assets/themes/{DEFAULT_SETTINGS["main_theme"].lower()}.json'))

if __name__ == '__main__':
    app = MainWindow()
    app.mainloop()
