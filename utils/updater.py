from CTkMessagebox import CTkMessagebox
import requests
from utils.variables import VERSION, APP_NAME, DISPLAY_APP_NAME, REPO_NAME
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


def _stop_update(MainWindow: "MainWindowClass", title, message, icon):
    CTkMessagebox(title=title, message=message, icon=icon)
    MainWindow.updating = False


def find_current_username():
    response = requests.get('https://api.github.com/user/111273015')
    if response.ok:
        info = response.json()
        return info['login']
    else:
        return 'KiTant'


def _download_last_release(MainWindow: "MainWindowClass", version: str, asset_name: str):
    msg = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (обновление)",
                        message=f"Обновление {DISPLAY_APP_NAME} запущено, пожалуйста подождите...",
                        icon="info")
    response = requests.get(f'https://github.com/{find_current_username()}/{REPO_NAME}/releases/download/{version}/{asset_name}')
    msg.destroy()
    if response.ok:
        try:
            with open(f"{APP_NAME}{version}.exe", "wb") as file:
                file.write(response.content)
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (обновление)", icon="check",
                        message="Новое обновление успешно загружено как новый файл"
                                " в той же директории, где находится ЭТА версия программы."
                                "Вы можете удалить эту версию и открыть новую.")
        except:
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                        message="Неизвестная ошибка при попытке создать новый файл с обновлённой версией программы.")
    else:
        _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                    message="Неизвестная ошибка при попытке получить новейшую версию. Пожалуйста, проверьте свой интернет.")


def check_last_version(MainWindow: "MainWindowClass"):
    MainWindow.updating = True
    msg = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (проверка обновлений)",
                        message="Попытка проверить обновления, пожалуйста подождите...",
                        icon="info")
    response = requests.get(f"https://api.github.com/repos/{find_current_username()}/{REPO_NAME}/releases/latest")
    msg.destroy()
    if response.ok:
        latest_release = response.json()
        if VERSION < latest_release['tag_name'][1:]:
            msg = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (проверка обновлений)",
                                message="Ваша версия программы устарела, хотите обновиться?",
                                icon="info", options=["Да", "Нет"], topmost=False)
            if msg.get() in ["Да"]:
                found_file = False
                if not latest_release['assets']:
                    MainWindow.updating = False
                    return
                for asset in latest_release['assets']:
                    if asset['name'].strip().startswith(APP_NAME) and asset['name'].strip().endswith(".exe"):
                        found_file = True
                        _download_last_release(MainWindow, latest_release['tag_name'], asset['name'])
                if not found_file:
                    _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (обновление)", icon="info",
                                message=f"Не найден основной файл {DISPLAY_APP_NAME} новой версии, обновление остановлено.")
        else:
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (проверка обновлений)", icon="info",
                        message=f"У вас самая новейшая версия {DISPLAY_APP_NAME}")
    else:
        _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (проверка обновлений)", icon="cancel",
                    message="Неизвестная ошибка при попытке получить информацию о новейшей версии. Пожалуйста, проверьте свой интернет.")
