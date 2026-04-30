import customtkinter as ctk
import json
from CTkCodeBoxPlus import CTkCodeBox, MenuSettings, NumberingSettings
import tkinter
from utils.variables import DISPLAY_APP_NAME, FILES, DEFAULT_CTKCODEBOX_KEYBINDINGS, Logger
import os
from utils.ai_manager import *
from utils.helpers import copy_text_to_clipboard
from CTkMessagebox import CTkMessagebox
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class AssistantChatFrame(ctk.CTkFrame):
    def __init__(self, MainWindow: "MainWindowClass", system_prompt: str, frame_name: str):
        super().__init__(master=MainWindow)
        self.MainWindow = MainWindow

        self.system_prompt = system_prompt
        self.frame_name = frame_name

        self.current_chat_name = "Обычный чат"
        self.chats = {self.current_chat_name: []}
        self.message_history = self.chats[self.current_chat_name]
        self.message_row_index = 0
        self.message_to_edit = None

        self._initialize_components()
        self._auto_load_chats()

    def _initialize_components(self):
        self.grid_columnconfigure(0, weight=0)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.chat_list_frame = ctk.CTkFrame(self, width=200)
        self.chat_list_frame.grid(row=0, column=0, rowspan=3, padx=(10, 5), pady=10, sticky="nsew")
        self.chat_list_frame.grid_rowconfigure(5, weight=1)

        self.chat_list_label = ctk.CTkLabel(self.chat_list_frame, text="Чаты", font=ctk.CTkFont(size=16, weight="bold"))
        self.chat_list_label.grid(row=0, column=0, padx=10, pady=10)

        self.chat_listbox = ctk.CTkOptionMenu(self.chat_list_frame, values=[self.current_chat_name],
                                              command=self.switch_chat)
        self.chat_listbox.grid(row=1, column=0, padx=10, pady=5, sticky="new")

        self.new_chat_button = ctk.CTkButton(self.chat_list_frame, text="Новый чат", command=self.create_new_chat)
        self.new_chat_button.grid(row=2, column=0, padx=10, pady=5, sticky="s")

        self.clear_chat_button = ctk.CTkButton(self.chat_list_frame, text="Очистить чат",
                                               command=self.clear_current_chat)
        self.clear_chat_button.grid(row=3, column=0, padx=10, pady=5, sticky="s")

        self.delete_chat_button = ctk.CTkButton(self.chat_list_frame, text="Удалить чат",
                                                command=self.delete_current_chat)
        self.delete_chat_button.grid(row=4, column=0, padx=10, pady=5, sticky="s")

        self.export_button = ctk.CTkButton(self.chat_list_frame, text="Экспортировать чаты", command=self.export_chats)
        self.export_button.grid(row=5, column=0, padx=10, pady=5, sticky="s")

        self.import_button = ctk.CTkButton(self.chat_list_frame, text="Импортировать чаты", command=self.import_chats)
        self.import_button.grid(row=7, column=0, padx=10, pady=5, sticky="s")

        self.chat_panel = ctk.CTkFrame(self)
        self.chat_panel.grid(row=0, column=1, rowspan=3, padx=(5, 10), pady=10, sticky="nsew")
        self.chat_panel.grid_columnconfigure(0, weight=1)
        self.chat_panel.grid_rowconfigure(0, weight=1)

        self.chat_display = ctk.CTkScrollableFrame(self.chat_panel, fg_color="transparent")
        self.chat_display.grid(row=0, column=0, padx=10, pady=5, sticky="nsew")
        self.chat_display.grid_columnconfigure(0, weight=1)
        self.chat_display.grid_columnconfigure(1, weight=1)
        self.chat_display.bind("<Configure>", self._update_scroll_region)

        self.input_frame = ctk.CTkFrame(self.chat_panel)
        self.input_frame.grid(row=1, column=0, padx=10, pady=(5, 10), sticky="sew")
        self.input_frame.grid_columnconfigure(0, weight=1)
        self.input_frame.grid_rowconfigure(0, weight=1)

        self.message_textbox = CTkCodeBox(self.input_frame, height=80, language="text",
                                          menu_settings=MenuSettings(False), numbering_settings=NumberingSettings(False),
                                          highlight_current_line=False,
                                          keybinding_settings=DEFAULT_CTKCODEBOX_KEYBINDINGS)
        self.message_textbox.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")
        self.message_textbox.bind("<Return>", lambda e: send_message(self, e, system_prompt=self.system_prompt))
        self.message_textbox.bind("<Shift-Return>", lambda event: self.message_textbox.insert("insert", ""))

        self.send_button = ctk.CTkButton(self.input_frame, text="Отправить сообщение",
                                         command=lambda: send_message(self, system_prompt=self.system_prompt))
        self.send_button.grid(row=0, column=1, padx=10, pady=10, sticky="ne")

        self.message_context_menu = tkinter.Menu(self, tearoff=0)

    def display_message(self, message_data, sender):
        msg_frame = ctk.CTkFrame(self.chat_display, fg_color="transparent")
        column = 0
        sender_name = "Пользователь" if sender == "user" else message_data.get("model_name", "AI")
        msg_frame.grid_columnconfigure(1, weight=0)
        content_padx = (5, 0)
        name_sticky = "w"
        frame_sticky = "w"
        message_text = message_data["content"]

        msg_frame.grid(row=self.message_row_index, column=column, padx=5, pady=5, sticky=frame_sticky)
        self.message_row_index += 1

        sender_label = ctk.CTkLabel(msg_frame, text=sender_name, font=ctk.CTkFont(weight="bold"))
        sender_label.grid(row=0, column=0, columnspan=2, padx=5, pady=(0, 2), sticky=name_sticky)

        text_widget = CTkCodeBox(msg_frame, activate_scrollbars=False, language="text", menu_settings=MenuSettings(False),
                                 highlight_current_line=False, numbering_settings=NumberingSettings(False),
                                 keybinding_settings=DEFAULT_CTKCODEBOX_KEYBINDINGS,
                                 width=min(550, 10 * len(message_text) - 30),
                                 height=min(300, len(message_text)/2.5 + 15))
        text_widget.insert("1.0", message_text)
        text_widget.configure(state="disabled")

        text_widget.bind("<Button-3>",
                         lambda event, msg_data=message_data: self._on_message_right_click(event, msg_data))

        def _on_text_scroll(event):
            view_fraction = text_widget.yview()
            if view_fraction == (0.0, 1.0):
                return
            elif event.delta > 0 and view_fraction[0] == 0.0:
                return
            elif event.delta < 0 and view_fraction[1] == 1.0:
                return
            else:
                text_widget.yview_scroll(-1 * event.delta // 120, "units")
                return "break"

        text_widget.bind("<MouseWheel>", _on_text_scroll)
        text_widget.bind("<Button-4>", _on_text_scroll)
        text_widget.bind("<Button-5>", _on_text_scroll)

        text_widget.grid(row=1, column=0 if sender == "user" else 1, padx=content_padx, pady=0, sticky="nsew")

        self.chat_display.update_idletasks()
        self.chat_display._parent_canvas.yview_moveto(1.0)

    def _on_message_right_click(self, event, message_data):
        self.message_context_menu.delete(0, ctk.END)
        self.message_to_edit = message_data
        self.message_context_menu.add_command(label="Копировать весь текст",
                                              command=lambda: copy_text_to_clipboard(message_data["content"]))
        if message_data["role"] == "assistant":
            try:
                message_index = self.message_history.index(message_data)
                if message_index > 0 and self.message_history[message_index - 1]["role"] == "user":
                    self.message_context_menu.add_command(label="Перегенерировать ответ",
                                                          command=lambda: regenerate_ai_response(self, message_data, self.system_prompt))
            except ValueError:
                pass
        elif message_data["role"] == "user":
            if message_data.get("type") == "text":
                self.message_context_menu.add_command(label="Редактировать", command=self._open_edit_copy_window)
        self.message_context_menu.add_command(label="Удалить", command=lambda: self.delete_message(message_data))
        try:
            self.message_context_menu.tk_popup(event.x_root, event.y_root)
        finally:
            self.message_context_menu.grab_release()

    def _open_edit_copy_window(self):
        if self.message_to_edit is None:
            return
        edit_window = ctk.CTkToplevel(self)
        edit_window.title("Редактирование сообщения")
        edit_window.geometry("500x400")
        edit_window.transient(self)

        edit_window.grid_columnconfigure(0, weight=1)
        edit_window.grid_rowconfigure(0, weight=1)

        edit_textbox = CTkCodeBox(edit_window, language="text", menu_settings=MenuSettings(False),
                                  keybinding_settings=DEFAULT_CTKCODEBOX_KEYBINDINGS)
        edit_textbox.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")
        edit_textbox.insert("1.0", self.message_to_edit["content"])

        button_frame = ctk.CTkFrame(edit_window, fg_color="transparent")
        button_frame.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="ew")
        button_frame.grid_columnconfigure(0, weight=1)

        save_button = ctk.CTkButton(button_frame, text="Сохранить",
                                    command=lambda: self._save_edited_message(edit_textbox, edit_window))
        save_button.grid(row=0, column=0, padx=(0, 5), sticky="e")

        copy_button = ctk.CTkButton(button_frame, text="Копировать всё",
                                    command=lambda: copy_text_to_clipboard(edit_textbox.get("1.0", "end-1c")))
        copy_button.grid(row=0, column=1, padx=(5, 0), sticky="e")

    def _save_edited_message(self, edit_textbox, edit_window):
        if self.message_to_edit is not None:
            new_text = edit_textbox.get("1.0", "end-1c")
            self.message_to_edit["content"] = new_text
            self.message_to_edit["is_edited"] = True
            self.redraw_chat()
        edit_window.destroy()
        self.message_to_edit = None

    def delete_message(self, message_data_to_delete):
        try:
            idx = next((i for i, m in enumerate(self.message_history) if m is message_data_to_delete), None)
            if idx is None:
                raise ValueError("Message not found by identity")
            self.message_history.pop(idx)
            self.redraw_chat()
            self._auto_save_chats()
        except ValueError:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Ошибка при удалении: Сообщение не найдено в истории", icon="warning")
        except Exception as e:
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка при попытке удалить сообщение: {e}")
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Ошибка при удалении: {e}", icon="cancel")

    def display_ai_response(self, ai_response_data):
        self.display_message(ai_response_data, "bot")
        self.message_history.append(ai_response_data)
        max_history_length = 25
        if len(self.message_history) > max_history_length:
            self.message_history = self.message_history[-max_history_length:]
        self._auto_save_chats()
        self.unlock_input()

    def unlock_input(self):
        self._toggle_input("Отправить сообщение", True)

    def lock_input(self, text="Думаю..."):
        self._toggle_input(text, False)

    def _toggle_input(self, text: str, enabled: bool):
        self.message_textbox.configure(state="normal" if enabled else "disabled")
        self.send_button.configure(state="normal" if enabled else "disabled", text=text if text else self.send_button.cget("text"))
        self.export_button.configure(state="normal" if enabled else "disabled")
        self.import_button.configure(state="normal" if enabled else "disabled")
        self.chat_listbox.configure(state="normal" if enabled else "disabled")
        self.new_chat_button.configure(state="normal" if enabled else "disabled")
        self.delete_chat_button.configure(state="normal" if enabled else "disabled")
        self.clear_chat_button.configure(state="normal" if enabled else "disabled")
        self.MainWindow.frames["settings"].toggle_change_ability(enabled)

    def _clear_chat_display(self):
        for widget in self.chat_display.winfo_children():
            widget.destroy()
        self.message_row_index = 0

    def redraw_chat(self):
        self._clear_chat_display()
        for message in self.message_history:
            self.display_message(message, message["role"])
        self.chat_display.update_idletasks()
        self.chat_display._parent_canvas.yview_moveto(1.0)
        self._update_scroll_region()

    def _update_scroll_region(self, event=None):
        if self.chat_display.winfo_exists():
            self.chat_display._parent_canvas.configure(scrollregion=self.chat_display._parent_canvas.bbox("all"))

    def create_new_chat(self):
        if self.new_chat_button.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Нельзя создать новый чат во время генерации ответа.", icon="warning")
            return
        chat_name = ctk.CTkInputDialog(text="Введите название нового чата:", title="Новый чат").get_input()
        if chat_name and chat_name not in self.chats:
            self.chats[chat_name] = []
            self.chat_listbox.configure(values=list(self.chats.keys()))
            self.chat_listbox.set(chat_name)
            self.switch_chat(chat_name)
            self.chat_display._parent_canvas.yview_moveto(0.0)
            self._auto_save_chats()
        elif chat_name:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Чат с названием '{chat_name}' уже существует.", icon="warning")

    def switch_chat(self, chat_name):
        if self.chat_listbox.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Нельзя переключать чат во время генерации ответа.", icon="warning")
            self.chat_listbox.set(self.current_chat_name)
            return
        if chat_name != self.current_chat_name and chat_name in self.chats:
            self.current_chat_name = chat_name
            self.message_history = self.chats[self.current_chat_name]
            self.redraw_chat()

    def export_chats(self):
        if self.export_button.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Экспорт невозможен во время генерации ответа.", icon="warning")
            return
        file_path = ctk.filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON Files", "*.json"), ("All files", "*.*")],
                                                     title="Сохранить чаты как...")
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(self.chats, f, ensure_ascii=False, indent=4)
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Чаты успешно экспортированы в {file_path}", icon="check")
            except Exception as e:
                if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка экспорта чата с ИИ: {e}")
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Ошибка экспорта: {e}", icon="cancel")

    def import_chats(self):
        if self.import_button.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Импорт невозможен во время генерации ответа.", icon="warning")
            return
        file_path = ctk.filedialog.askopenfilename(defaultextension=".json", filetypes=[("JSON Files", "*.json"), ("All files", "*.*")],
                                               title="Выберите файл для импорта...")
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    imported_chats = json.load(f)
                temp_chat_name = "__temp_import_chat__"
                while temp_chat_name in self.chats:
                    temp_chat_name += "_"
                self.chats[temp_chat_name] = []
                values = list(self.chats.keys())
                if temp_chat_name not in values:
                    values.append(temp_chat_name)
                    self.chat_listbox.configure(values=values)
                self.switch_chat(temp_chat_name)
                self.chats.update(imported_chats)
                self.chat_listbox.configure(values=list(self.chats.keys()))
                target_chat_name = "Обычный чат" if "Обычный чат" in self.chats else list(self.chats.keys())[0]
                self.chat_listbox.set(target_chat_name)
                self.switch_chat(target_chat_name)
                if temp_chat_name in self.chats:
                    del self.chats[temp_chat_name]
                    self.chat_listbox.configure(values=list(self.chats.keys()))
                    self.chat_listbox.set(self.current_chat_name)
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                              message=f"Чаты успешно импортированы из {file_path}", icon="check")
                self._auto_save_chats()
            except Exception as e:
                if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка импорта чата с ИИ: {e}")
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                              message=f"Ошибка импорта: {e}", icon="cancel")

    def clear_current_chat(self):
        if self.clear_chat_button.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Нельзя очищать чат во время генерации ответа.", icon="warning")
            return
        confirm = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                                 message=f"Очистить все сообщения в чате '{self.current_chat_name}'?",
                                 icon="warning", option_1="Нет", option_2="Да").get()
        if confirm == "Да":
            self.chats[self.current_chat_name] = []
            self.message_history = self.chats[self.current_chat_name]
            self.redraw_chat()
            self._auto_save_chats()

    def delete_current_chat(self):
        if self.delete_chat_button.cget("state") == "disabled":
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Нельзя удалять чат во время генерации ответа.", icon="warning")
            return
        if len(self.chats) <= 1:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message="Нельзя удалить единственный чат.", icon="warning")
            return
        confirm = CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)",
                                message=f"Удалить чат '{self.current_chat_name}' целиком?",
                                icon="warning", option_1="Нет", option_2="Да").get()
        if confirm == "Да":
            try:
                del self.chats[self.current_chat_name]
                self.current_chat_name = list(self.chats.keys())[0]
                self.message_history = self.chats[self.current_chat_name]
                self.chat_listbox.configure(values=list(self.chats.keys()))
                self.chat_listbox.set(self.current_chat_name)
                self.redraw_chat()
                self._auto_save_chats()
            except Exception as e:
                if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка удаления чата: {e}")
                CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Чат с ИИ)", message=f"Ошибка удаления чата: {e}", icon="cancel")

    def _auto_load_chats(self):
        if self.MainWindow.settings.get(f"auto_{self.frame_name}_load", "Disabled").lower() == "enabled":
            path = FILES.get(f"last_{self.frame_name}_chats")
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                if isinstance(data, dict) and data:
                    self.chats = data
                    self.current_chat_name = list(self.chats.keys())[0]
                    self.message_history = self.chats[self.current_chat_name]
                    self.chat_listbox.configure(values=list(self.chats.keys()))
                    self.chat_listbox.set(self.current_chat_name)
                    self.redraw_chat()

    def _auto_save_chats(self):
        if self.MainWindow.settings.get(f"auto_{self.frame_name}_save", "Disabled").lower() == "enabled":
            path = FILES.get(f"last_{self.frame_name}_chats")
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(self.chats, f, ensure_ascii=False, indent=4)
