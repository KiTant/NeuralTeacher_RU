import os
import webbrowser
from CTkMessagebox import CTkMessagebox
from utils.variables import DISPLAY_APP_NAME
import pyperclip


def copy_text_to_clipboard(text_to_copy):
    if text_to_copy:
        try:
            pyperclip.copy(text_to_copy)
        except:
            pass


def resource_path(file):
    data_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    return os.path.join(data_dir, file)


def open_link(link: str):
    try:
        webbrowser.open(link)
    except:
        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (открытие ссылки)",
                      message=f"Неизвестная ошибка при попытке открыть ссылку: {link}",
                      icon="cancel")
