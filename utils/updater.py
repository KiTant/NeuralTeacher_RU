from CTkMessagebox import CTkMessagebox
import requests
import threading
from utils.variables import VERSION, APP_NAME, DISPLAY_APP_NAME, REPO_NAME, IS_WIN7, Logger
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


def _stop_update(MainWindow: "MainWindowClass", title, message, icon, topmost=True, autocheck=False):
    if not autocheck:
        CTkMessagebox(title=title, message=message, icon=icon, topmost=topmost)
    MainWindow.updating = False


def find_current_username():
    try:
        response = requests.get('https://api.github.com/user/111273015')
        if response.ok:
            info = response.json()
            return info['login']
        else:
            return 'KiTant'
    except requests.exceptions.ConnectionError:
        return 'KiTant'


def _download_last_release(MainWindow: "MainWindowClass", version: str, asset_name: str):
    msg = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (обновление)",
                        message=f"Обновление {DISPLAY_APP_NAME} запущено. Пожалуйста, подождите...",
                        icon="info")
    threading.Thread(target=_download_last_release_thread, args=(MainWindow, msg, version, asset_name), daemon=True).start()


def _download_last_release_thread(MainWindow: "MainWindowClass", msg, version: str, asset_name: str):
    try:
        response = requests.get(f'https://github.com/{find_current_username()}/{REPO_NAME}/releases/download/{version}/{asset_name}')
    except requests.exceptions.ConnectionError:
        MainWindow.after(0, lambda: (msg.destroy(),
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                         message="Произошла ошибка подключения. Пожалуйста, проверьте свой интернет.", topmost=False)))
        return
    if response.ok:
        try:
            with open(f"{DISPLAY_APP_NAME}{version}.exe", "wb") as file:
                file.write(response.content)
            MainWindow.after(0, lambda: (msg.destroy(),
                _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (обновление)", icon="check",
                            message="Новое обновление успешно загружено как новый файл"
                                    " в той же директории (папке), где находится ЭТА версия программы."
                                    "Вы можете удалить эту версию и открыть новую.")))
        except PermissionError as e:
            if MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка прав при создании файла (обновление): {e}")
            MainWindow.after(0, lambda: (msg.destroy(),
                _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                             message="Ошибка прав при попытке создать новый файл с обновлённой версией программы.")))
        except Exception as e:
            if MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Неизвестная ошибка при создании файла (обновление): {e}")
            MainWindow.after(0, lambda: (msg.destroy(),
                _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                             message="Неизвестная ошибка при попытке создать новый файл с обновлённой версией программы.")))
    else:
        if MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка при попытке получить файл новейшей версии: {response}")
        MainWindow.after(0, lambda: (msg.destroy(),
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (загрузка обновления)", icon="cancel",
                         message="Неизвестная ошибка при попытке получить новейшую версию. проверьте своё подключение к интернету.")))


def check_last_version(MainWindow: "MainWindowClass", autocheck: bool = False):
    if getattr(MainWindow, 'updating', False):
        return
    MainWindow.updating = True
    msg = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (проверка обновлений)",
                        message="Попытка проверить обновления, пожалуйста подождите...",
                        icon="info") if not autocheck else None
    threading.Thread(target=_check_last_version_thread, args=(MainWindow, msg, autocheck), daemon=True).start()


def _check_last_version_thread(MainWindow: "MainWindowClass", msg, autocheck):
    try:
        response = requests.get(f"https://api.github.com/repos/{find_current_username()}/{REPO_NAME}/releases/latest")
    except requests.exceptions.ConnectionError:
        MainWindow.after(0, lambda: ((msg.destroy() if not autocheck else None),
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (проверка обновлений)",
                         message="Произошла ошибка подключения. Пожалуйста, проверьте своё подключение к интернету.",
                         icon="info", topmost=False, autocheck=autocheck)))
        return
    MainWindow.after(0, lambda: _handle_check_response(MainWindow, msg, response, autocheck))


def _handle_check_response(MainWindow: "MainWindowClass", msg, response, autocheck):
    msg.destroy() if not autocheck else None
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
                    asset_name = asset['name'].strip()
                    if asset_name.startswith(APP_NAME) and asset_name.endswith(".exe"):
                        is_win7_file = asset_name.endswith("Win7.exe")
                        if (is_win7_file and IS_WIN7) or (not IS_WIN7 and not is_win7_file):
                            found_file = True
                            _download_last_release(MainWindow, latest_release['tag_name'], asset['name'])
                if not found_file:
                    _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (обновление)", icon="info",
                                message=f"Не найден основной файл {DISPLAY_APP_NAME} новой версии для этой операционной системы, обновление остановлено.")
        else:
            _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (проверка обновлений)", icon="info",
                        message=f"У вас самая новейшая версия {DISPLAY_APP_NAME}", autocheck=autocheck)
    else:
        if MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка при попытке получить инфо о новейшей версии: {response}")
        _stop_update(MainWindow, title=f"{DISPLAY_APP_NAME} (проверка обновлений)", icon="cancel",
                     message="Неизвестная ошибка при попытке получить информацию о новейшей версии. Пожалуйста, проверьте своё подключение к интернету.",
                     autocheck=autocheck)
