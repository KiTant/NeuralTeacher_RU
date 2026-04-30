import webbrowser
import json
from CTkMessagebox import CTkMessagebox
from CTkCodeBoxPlus import register_keybind as register_keybind
from g4f import Provider
from utils.variables import MODEL_MAP, PROVIDER_MAP, DEFAULT_SETTINGS, ORPK, DISPLAY_APP_NAME
import customtkinter as ctk
import pyperclip
from typing import Union, TYPE_CHECKING
if TYPE_CHECKING:
    from ui.assistant_frame import AssistantChatFrame
    from ui.settings_frame import SettingsFrame


def get_selected_model_info(provider: Provider, model_name: str):
    model = MODEL_MAP[model_name].get(provider, None)
    if not provider or not model:
        return None
    return model, provider


def get_api_key(Window: Union["AssistantChatFrame", "SettingsFrame"], provider: Provider):
    api_key = None
    if PROVIDER_MAP[provider] and PROVIDER_MAP[provider][0]:
        name = PROVIDER_MAP[provider][0]
        api_key = Window.MainWindow.settings.get(name, DEFAULT_SETTINGS.get(name, None))
    if provider == Provider.OpenRouter and not api_key:
        api_key = ORPK
    return api_key


def copy_text_to_clipboard(text_to_copy):
    if text_to_copy:
        try:
            pyperclip.copy(text_to_copy)
        except:
            pass


def open_link(link: str):
    try:
        webbrowser.open(link)
    except Exception:
        CTkMessagebox(title=f"{DISPLAY_APP_NAME} (открытие ссылки)",
                      message=f"Неизвестная ошибка при попытке открыть ссылку: {link}",
                      icon="cancel")


def parse_json_safely(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    start, end = text.find('{'), text.rfind('}')
    if start != -1 and end != -1 and end > start:
        candidate = text[start:end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            return None
    return None


def entry_paste(entry: ctk.CTkEntry):
    try:
        try:
            entry.delete(ctk.SEL_FIRST, ctk.SEL_LAST)
        finally:
            entry.insert(ctk.INSERT, pyperclip.paste())
    except Exception:
        return


def entry_copy(entry: ctk.CTkEntry):
    try:
        pyperclip.copy(entry.get()[entry.index(ctk.SEL_FIRST):entry.index(ctk.SEL_LAST)])
    except Exception:
        return


def entry_cut(entry: ctk.CTkEntry):
    entry_copy(entry)
    try:
        entry.delete(ctk.SEL_FIRST, ctk.SEL_LAST)
    except Exception:
        return


def entry_keybinds_normalize(entry: ctk.CTkEntry):
    register_keybind(entry, "Ctrl+C", lambda: entry_copy(entry), bind_scope='widget')
    register_keybind(entry, "Ctrl+V", lambda: entry_paste(entry), bind_scope='widget')
    register_keybind(entry, "Ctrl+X", lambda: entry_cut(entry), bind_scope='widget')
    register_keybind(entry, "Esc", entry.master.focus)
    register_keybind(entry, "Return", entry.master.focus)
