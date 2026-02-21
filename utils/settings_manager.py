import customtkinter as ctk
import os
import json
from utils.variables import DEFAULT_SETTINGS
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


def settings_apply(MainWindow: "MainWindowClass"):
    ctk.set_appearance_mode(MainWindow.settings['theme'])


def settings_change_new_keys(settings, default_values: dict):
    for key in list(default_values.keys()):
        if key not in settings:
            settings[key] = default_values[key]
    for key in list(settings.keys()):
        if key not in default_values:
            settings[key] = None
    return settings


def settings_save(MainWindow: "MainWindowClass", file, attr_name: str = "settings"):
    os.makedirs(os.path.dirname(file), exist_ok=True)
    with open(file, 'w', encoding='utf-8') as f:
        json.dump(getattr(MainWindow, attr_name), f, indent=4)
        f.close()


def settings_load(MainWindow: "MainWindowClass", file,
                  default_values: dict = DEFAULT_SETTINGS, attr_name: str = "settings"):
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            data = settings_change_new_keys(json.load(f), default_values)
            setattr(MainWindow, attr_name, data)
            settings_apply(MainWindow)
            f.close()
    else:
        settings_apply(MainWindow)

__all__ = ["settings_save", "settings_load"]
