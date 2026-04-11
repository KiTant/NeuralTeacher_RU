import customtkinter as ctk
import pystray
import threading
from PIL import Image
from utils.helpers import resource_path
from utils.settings_manager import settings_load
from utils.variables import DEFAULT_SETTINGS, FILES, APPEARANCE_MODES, ICON_PATH, MODEL_MAP, PROVIDER_MAP
from ui.navigation_frame import NavigationFrame
from ui.tests_frame import TestsFrame
from ui.explanation_frame import ExplanationFrame
from ui.homework_frame import HomeworkFrame
from ui.settings_frame import SettingsFrame
from ui.about_frame import AboutFrame

ctk.set_appearance_mode("Dark")


class MainWindow(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("НейроУчитель")
        self.geometry("1000x650")

        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        self.logo_image = ctk.CTkImage(Image.open(resource_path('assets/graduation-cap.png')), size=(26, 26))
        self.image_icon_image = ctk.CTkImage(Image.open(resource_path('assets/file-down.png')), size=(20, 20))
        self.create_test_image = ctk.CTkImage(Image.open(resource_path('assets/brain-cog.png')), size=(20, 20))
        self.explanation_chat_image = ctk.CTkImage(Image.open(resource_path('assets/book-open-text.png')), size=(20, 20))
        self.homework_help_image = ctk.CTkImage(Image.open(resource_path('assets/microscope.png')), size=(20, 20))
        self.settings_image = ctk.CTkImage(Image.open(resource_path('assets/folder-cog.png')), size=(20, 20))
        self.about_image = ctk.CTkImage(Image.open(resource_path('assets/app-window.png')), size=(20, 20))

        self.updating = False

        self.tray_icon = None

        self.settings = DEFAULT_SETTINGS.copy()
        settings_load(self, FILES.get("settings_file"))
        self.after(100, lambda: self.iconbitmap(resource_path(ICON_PATH)))
        if self.settings["ai_model"] not in MODEL_MAP:
            self.settings["ai_model"] = DEFAULT_SETTINGS["ai_model"]
        if self.settings["provider"] not in PROVIDER_MAP:
            self.settings["provider"] = DEFAULT_SETTINGS["provider"]

        self.protocol("WM_DELETE_WINDOW", self.window_hide)

        self.create_frames()

    def create_frames(self):
        if getattr(self, "frames", None):
            for frame in self.frames.values():
                frame.grid_forget()
                frame.after(500, frame.destroy)
            self.frames = {}
            self.create_frames()
        else:
            self.navigation_frame = NavigationFrame(self)
            self.tests_frame = TestsFrame(self)
            self.homework_frame = HomeworkFrame(self)
            self.explanation_frame = ExplanationFrame(self)
            self.settings_frame = SettingsFrame(self)
            self.about_frame = AboutFrame(self)
            self.frames = {"navigation": self.navigation_frame, "tests": self.tests_frame, "homework": self.homework_frame,
                           "explanation": self.explanation_frame, "settings": self.settings_frame, "about": self.about_frame}

    def select_frame_by_name(self, name):
        for buttonName, button in self.navigation_frame.buttons.items():
            button.configure(fg_color=("gray75", "gray25") if name == buttonName else "transparent")
        for frameName, frame in self.frames.items():
            if name == frameName:
                frame.grid(row=0, column=1, sticky="nsew")
            elif frameName != "navigation":
                frame.grid_forget()

    def change_appearance_mode_event(self, new_appearance_mode: str):
        for modeName, mode in APPEARANCE_MODES.items():
            if new_appearance_mode.startswith(modeName):
                self.settings['theme'] = mode
                ctk.set_appearance_mode(mode)
                break

    def set_navigation_toggled(self, enabled: bool):
        for button in self.navigation_frame.buttons.values():
            button.configure(state="normal" if enabled else "disabled")
        self.select_frame_by_name("None")

    def window_hide(self):
        if self.settings['tray_icon'] == 'Enabled':
            self.withdraw()
            self.create_tray_icon()
        else:
            self.tests_frame._auto_save_cfg()
            self.destroy()

    def quit_app(self):
        self.tests_frame._auto_save_cfg()
        if self.tray_icon:
            self.tray_icon.stop()
        self.deiconify()
        self.after(250, self.destroy)

    def window_show(self):
        if self.tray_icon:
            self.tray_icon.stop()
            self.tray_icon = None
        self.deiconify()
        self.focus_force()

    def create_tray_icon(self):
        menu = (
            pystray.MenuItem('Открыть программу', self.window_show, default=True),
            pystray.MenuItem('Выход из программы', self.quit_app)
        )
        self.tray_icon = pystray.Icon("NeuralTeacher", Image.open(resource_path('assets/graduation-cap.png')),
                                      "НейроУчитель", menu)
        threading.Thread(target=self.tray_icon.run, daemon=True).start()
