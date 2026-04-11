from g4f import models, Provider
import os
import requests

APP_NAME = "NeuralTeacher"
DISPLAY_APP_NAME = "НейроУчитель"
REPO_NAME = APP_NAME + "_RU"
ICON_PATH = 'assets/graduation-cap.ico'
VERSION = "1.1.0"
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
    "provider": "Yqcloud",
    "tray_icon": "Enabled",
    "PAIK": "",
    "ORK": "",
    "OllK": "",
    "HFK": ""
}


def get_provider_map():
    from utils.updater import find_current_username
    default_provider_map = {
        Provider.Yqcloud: ("", "API ключ не требуется"),
        Provider.OpenRouter: ("ORK", "Нужен API ключ OpenRouter (необязательно на 03.04.26)"),
        Provider.DeepInfra: ("", "Может пригодиться работающий VPN для использования моделей провайдера (для пользователей из РФ)"),
        Provider.PollinationsAI: ("PAIK", "Нужен API ключ PollinationsAI"),
        Provider.Ollama: ("OllK", "Нужен API ключ Ollama"),
        Provider.HuggingFace: ("HFK", "Нужен API ключ HuggingFace")
    }
    try:
        url = f"https://raw.githubusercontent.com/{find_current_username()}/{REPO_NAME}/refs/heads/master/provider_map.json"
        response = requests.get(url, timeout=5)
        if response.ok:
            data = response.json()
            provider_map = {}
            for name, (api_key_name, additional_info) in data.items():
                provider = getattr(Provider, name, None)
                if not provider:
                    continue
                provider_map[provider] = (api_key_name, additional_info)
            return provider_map
    except:
        pass
    return default_provider_map


def get_model_map():
    from utils.updater import find_current_username
    default_model_map = {
        "GPT-4": {Provider.Yqcloud: models.gpt_4},
        "GPT OSS 120B": {Provider.OpenRouter: "openai/gpt-oss-120b:free", Provider.Ollama: "gpt-oss:120b-cloud",
                         Provider.DeepInfra: "openai/gpt-oss-120b", Provider.HuggingFace: "openai/gpt-oss-120b"},
        "Step 3.5 Flash": {Provider.OpenRouter: "stepfun/step-3.5-flash:free", Provider.DeepInfra: "stepfun-ai/Step-3.5-Flash"},
        "MiniMax M2.5": {Provider.OpenRouter: "minimax/minimax-m2.5:free", Provider.HuggingFace: "MiniMaxAI/MiniMax-M2.5",
                         Provider.Ollama: "minimax-m2.5:cloud", Provider.DeepInfra: "MiniMaxAI/MiniMax-M2.5"},
        "Nemotron 3 Super": {Provider.OpenRouter: "nvidia/nemotron-3-super-120b-a12b:free",
                             Provider.DeepInfra: "nvidia/NVIDIA-Nemotron-3-Super-120B-A12B",
                             Provider.Ollama: "nemotron-3-super:cloud"},
        "Deepseek V3.2": {Provider.DeepInfra: "deepseek-ai/DeepSeek-V3.2", Provider.PollinationsAI: "deepseek",
                          Provider.Ollama: "deepseek-v3.2:cloud", Provider.HuggingFace: 'deepseek-ai/DeepSeek-V3.2'},
        "Kimi K2.5": {Provider.DeepInfra: "moonshotai/Kimi-K2.5", Provider.HuggingFace: 'moonshotai/Kimi-K2.5',
                      Provider.Ollama: 'kimi-k2.5:cloud'},
        "GLM-5": {Provider.PollinationsAI: 'glm', Provider.HuggingFace: 'zai-org/GLM-5', Provider.Ollama: 'glm-5:cloud',
                  Provider.DeepInfra: "zai-org/GLM-5"},
        "GPT-5 Nano": {Provider.PollinationsAI: 'openai-fast'},
        "GPT-5 Mini": {Provider.PollinationsAI: 'openai'},
        "Gemini 2.5 Flash Lite": {Provider.PollinationsAI: 'gemini-fast'},
    }
    try:
        url = f"https://raw.githubusercontent.com/{find_current_username()}/{REPO_NAME}/refs/heads/master/model_map.json"
        response = requests.get(url, timeout=5)
        if response.ok:
            data = response.json()
            model_map = {}
            for name, providers in data.items():
                model_providers = {}
                for provider_str, model_str in providers.items():
                    if hasattr(models, model_str):
                        model = getattr(models, model_str)
                    else:
                        model = models.ModelRegistry.get(model_str) or model_str
                    provider = getattr(Provider, provider_str, None)
                    if provider:
                        model_providers[provider] = model
                if not model_providers:
                    continue
                model_map[name] = model_providers
            return model_map
    except:
        pass
    return default_model_map

MODEL_MAP = get_model_map()
PROVIDER_MAP = get_provider_map()
