import json
from g4f import models, Provider
from CTkCodeBoxPlus import KeybindingSettings
import os
import requests
from PIL import Image
import customtkinter as ctk

APP_NAME = "NeuralTeacher"
DISPLAY_APP_NAME = "НейроУчитель"
REPO_NAME = APP_NAME + "_RU"
ICON_PATH = 'assets/graduation-cap.ico'
VERSION = "1.2.1"
IS_WIN7 = False  # При запуске проекта на Windows 7 нужно поставить на True
DEFAULT_CTKCODEBOX_KEYBINDINGS = KeybindingSettings(B__on_backtick="") if IS_WIN7 else KeybindingSettings()


def resource_path(file):
    data_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))
    return os.path.join(data_dir, file)

ORPK = ["a6089edef857be8b734a2949eb9a07b97e47e5d15178581050bde0aa65dfb347",
        "-1v-"
        "ro"
        "-ks"]
ORPK = ("".join(ORPK))[::-1]  # Этот ключ был создан специально для общего пользования (в НейроУчителе)

FRAMES = (("navigation", "navigation_frame", "NavigationFrame"), ("tests", "tests_frame", "TestsFrame"),
          ("homework", "homework_frame", "HomeworkFrame"), ("explanation", "explanation_frame", "ExplanationFrame"),
          ("settings", "settings_frame", "SettingsFrame"), ("about", "about_frame", "AboutFrame"))

APPDATA = os.getenv('APPDATA')
FILES = {
    "settings_file": os.path.join(APPDATA, APP_NAME, 'settings.json'),
    "last_explanation_chats": os.path.join(APPDATA, APP_NAME, 'last_explanation_chats.json'),
    "last_homework_chats": os.path.join(APPDATA, APP_NAME, 'last_homework_chats.json'),
    "last_test_file": os.path.join(APPDATA, APP_NAME, 'last_test_file.json'),
    "model_map": resource_path("model_map.json"),
    "provider_map": resource_path("provider_map.json")
}

IMAGES_INFO = (("logo_image", "assets/graduation-cap.png", (26, 26)), ("file_icon_image", "assets/file-down.png", (20, 20)),
               ("create_test_image", "assets/brain-cog.png", (20, 20)), ("explanation_chat_image", "assets/book-open-text.png", (20, 20)),
               ("homework_help_image", "assets/microscope.png", (20, 20)), ("settings_image", "assets/folder-cog.png", (20, 20)),
               ("about_image", "assets/app-window.png", (20, 20)))
IMAGES = {}
for image_name, path, size in IMAGES_INFO:
    IMAGES[image_name] = ctk.CTkImage(Image.open(resource_path(path)), size=size)
del IMAGES_INFO

MAIN_THEMES = ("Синяя", "Роза", "Жёлтая", "Тёмно-синяя", "Зелёная", "Розовая",
               "Фиолетовая", "Морковка", "Кофе", "Небо", "Красная", "Марш", "Металл")

APPEARANCE_MODES = {"Тёмная": "Dark", "Светлая": "Light", "Системная": "System"}

MAIN_THEMES_TRANSLATED = {
    "Синяя": "Blue",
    "Роза": "Rose",
    "Жёлтая": "Yellow",
    "Тёмно-синяя": "Dark-blue",
    "Зелёная": "Green",
    "Розовая": "Pink",
    "Фиолетовая": "Violet",
    "Морковка": "Carrot",
    "Кофе": "Coffee",
    "Небо": "Sky",
    "Красная": "Red",
    "Марш": "Marsh",
    "Металл": "Metal"
}

DEFAULT_SETTINGS = {
    "theme": "Dark",
    "main_theme": "Blue",
    "keybinds": "Enabled",
    "auto_homework_load": "Enabled",
    "auto_homework_save": "Enabled",
    "auto_explanation_load": "Enabled",
    "auto_explanation_save": "Enabled",
    "auto_update_check": "Enabled",
    "ai_model": "GPT-4",
    "provider": "Yqcloud",
    "tray_icon": "Enabled",
    "PAIK": "",
    "ORK": "",
    "OllK": "",
    "HFK": ""
}


def get_provider_map():
    from utils.updater import find_current_username

    def convert(object_to_convert, is_file: bool = False):
        data = object_to_convert.json() if not is_file else object_to_convert
        provider_map = {}
        for name, (api_key_name, additional_info) in data.items():
            provider = getattr(Provider, name, None)
            if not provider:
                continue
            provider_map[provider] = (api_key_name, additional_info)
        return provider_map
    try:
        url = f"https://raw.githubusercontent.com/{find_current_username()}/{REPO_NAME}/refs/heads/master/provider_map.json"
        response = requests.get(url, timeout=5)
        if response.ok:
            convert(response)
    except:
        pass
    with open(FILES["provider_map"], "r", encoding='utf-8') as f:
        return convert(json.load(f), True)


def get_model_map():
    from utils.updater import find_current_username

    def convert(object_to_convert, is_file: bool = False):
        data = object_to_convert.json() if not is_file else object_to_convert
        model_map = {}
        for model_name, providers in data.items():
            model_providers = {}
            for provider_str, model_str in providers.items():
                model = models.ModelRegistry.get(model_str) or model_str
                provider = getattr(Provider, provider_str, None)
                if provider:
                    model_providers[provider] = model
            if not model_providers:
                continue
            model_map[model_name] = model_providers
        return model_map
    try:
        url = f"https://raw.githubusercontent.com/{find_current_username()}/{REPO_NAME}/refs/heads/master/model_map.json"
        response = requests.get(url, timeout=5)
        if response.ok:
            return convert(response)
    except:
        pass
    with open(FILES["model_map"], 'r', encoding='utf-8') as f:
        return convert(json.load(f), True)

MODEL_MAP = get_model_map()
PROVIDER_MAP = get_provider_map()
