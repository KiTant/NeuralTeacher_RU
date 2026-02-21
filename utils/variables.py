from g4f import models, Provider
import os

APP_NAME = "NeuralTeacher"
DISPLAY_APP_NAME = "НейроУчитель"
REPO_NAME = APP_NAME + "_RU"
ICON_PATH = 'assets/graduation-cap.ico'
VERSION = "1.0.0"
ORPK = ["a6089edef857be8b734a2949eb9a07b97e47e5d15178581050bde0aa65dfb347",
        "-1v-"
        "ro"
        "-ks"]
ORPK = ("".join(ORPK))[::-1]  # Этот ключ был создан специально для общего пользования (в НейроУчителе)

APPDATA = os.getenv('APPDATA')
FILES = {
    "settings_file": os.path.join(APPDATA, APP_NAME, 'settings.json'),
    "last_explanation_chats": os.path.join(APPDATA, APP_NAME, 'last_explanation_chats.json'),
    "last_homework_chats": os.path.join(APPDATA, APP_NAME, 'last_homework_chats.json'),
    "last_test_file": os.path.join(APPDATA, APP_NAME, 'last_test_file.json'),
}

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
    "ai_model": "GPT-4",
    "tray_icon": "Enabled",
    "PAIK": ""
}

MODEL_MAP = {
    "GPT-4": (models.gpt_4, Provider.Yqcloud),
    "GPT OSS 120B": ("openai/gpt-oss-120b:free", Provider.OpenRouter),
    "GLM-4.5 air": ("z-ai/glm-4.5-air:free", Provider.OpenRouter),
    "Deepseek V3.2 (AC1)": ("deepseek-ai/DeepSeek-V3.2", Provider.DeepInfra),
    "Kimi K2.5 (AC1)": ("moonshotai/Kimi-K2.5", Provider.DeepInfra),
    "GPT-5.2 (NPAIK)": ('openai-large', Provider.PollinationsAI),
    "GLM-5 (NPAIK)": ('glm', Provider.PollinationsAI),
    "GPT-5 Nano (NPAIK)": ('openai-fast', Provider.PollinationsAI),
    "GPT-5 Mini (NPAIK)": ('openai', Provider.PollinationsAI),
    "Gemini 2.5 Flash Lite (NPAIK)": ('gemini-fast', Provider.PollinationsAI),
}
