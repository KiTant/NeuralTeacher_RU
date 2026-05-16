import customtkinter as ctk
from CTkMessagebox import CTkMessagebox
from typing import TYPE_CHECKING, Any, Dict, List
from utils.variables import ICON_PATH, resource_path, Logger, DISPLAY_APP_NAME
import random
import webbrowser
import tempfile
import os
import html as htmlL
if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass


class InTestWindow(ctk.CTkToplevel):
    def __init__(self, MainWindow: "MainWindowClass", config: Dict[str, Any]):
        super().__init__(master=MainWindow)
        self.MainWindow = MainWindow
        self.config_data: Dict[str, Any] = config or {}
        self.finished: bool = False

        self._block_main_window()

        self.title(self.config_data.get("title", "Тест"))
        self.geometry("900x700")
        self.grab_set()
        self.focus()
        self.resizable(False, False)
        self.protocol("WM_DELETE_WINDOW", self._on_close)
        self.after(100, lambda: self.iconbitmap(resource_path(ICON_PATH)))

        qs = self.config_data.get("questions", [])
        if not isinstance(qs, list):
            qs = []
        self.shuffle: bool = self.config_data.get("shuffle", True)
        self._base_questions: List[Dict[str, Any]] = self._fix_questions_format(qs.copy())
        self.questions: List[Dict[str, Any]] = self._base_questions.copy()
        if self.shuffle:
            random.shuffle(self.questions)
        self.current_index: int = 0
        self.answers: Dict[str, Any] = {}

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)

        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="new")
        self.header_frame.grid_columnconfigure(0, weight=1)

        self.body_frame = ctk.CTkFrame(self)
        self.body_frame.grid(row=1, column=0, padx=10, pady=5, sticky="nsew")
        self.body_frame.grid_columnconfigure(0, weight=1)
        self.body_frame.grid_rowconfigure(1, weight=1)

        self.nav_frame = ctk.CTkFrame(self)
        self.nav_frame.grid(row=2, column=0, padx=10, pady=(5, 10), sticky="ew")
        self.nav_frame.grid_columnconfigure(0, weight=1)
        self.nav_frame.grid_columnconfigure(1, weight=1)
        self.nav_frame.grid_columnconfigure(2, weight=0)

        self._build_header()
        self._build_nav()
        self._render_current_question()

    def _block_main_window(self):
        self.MainWindow.set_navigation_toggled(False)

    def _unblock_main_window(self):
        self.MainWindow.set_navigation_toggled(True)
        self.MainWindow.frames["tests"].unlock_input()
        self.MainWindow.select_frame_by_name("tests")

    def _fix_questions_format(self, questions):
        for question in questions:
            if question["type"] in ["multiple_choice", "multi_select"]:
                question["options"] = [str(option) for option in question["options"]]
        return questions

    def _build_header(self):
        for w in self.header_frame.winfo_children():
            w.destroy()

        title = self.config_data.get("title", "Тест")
        if self._normalize_text(title) == "название теста (короткое)":
            title = "Тест"

        self.title_label = ctk.CTkLabel(self.header_frame, text=title, font=ctk.CTkFont(size=18, weight="bold"))
        self.title_label.grid(row=0, column=0, padx=5, pady=(0, 4), sticky="w")

        self.print_btn = ctk.CTkButton(self.header_frame, text="Распечатать",
                                       command=lambda: PrintSettingsDialog(self, self.config_data, self.answers),
                                       width=120)
        self.print_btn.grid(row=0, column=1, padx=5, pady=(5, 4), sticky="e")

        total = max(1, len(self.questions))
        without_answer = self._count_without_answer()
        idx_text = f"Вопрос {min(self.current_index + 1, total)}/{total}; Кол-во вопросов без ответа: {without_answer}"
        self.index_label = ctk.CTkLabel(self.header_frame, text=idx_text)
        self.index_label.grid(row=1, column=0, padx=5, pady=(0, 0), sticky="w")

    def _build_nav(self):
        for w in self.nav_frame.winfo_children():
            w.destroy()

        self.prev_btn = ctk.CTkButton(self.nav_frame, text="Назад", command=self._go_prev)
        self.prev_btn.grid(row=0, column=0, padx=(0, 5), pady=5, sticky="w")

        self.next_btn = ctk.CTkButton(self.nav_frame, text="Далее", command=self._go_next)
        self.next_btn.grid(row=0, column=1, padx=5, pady=5, sticky="w")

        self.finish_btn = ctk.CTkButton(self.nav_frame, text="Завершить", command=self._finish_test)
        self.finish_btn.grid(row=0, column=2, padx=5, pady=5, sticky="e")

        self._update_nav_buttons()

    def _update_nav_buttons(self):
        total = len(self.questions)
        self.prev_btn.configure(state=("normal" if self.current_index > 0 else "disabled"))
        self.next_btn.configure(state=("normal" if self.current_index < total - 1 else "disabled"))

    def _clear_body(self):
        for w in self.body_frame.winfo_children():
            w.destroy()

    def _render_current_question(self):
        self._build_header()
        self._clear_body()

        if not self.questions:
            lbl = ctk.CTkLabel(self.body_frame, text="Нет вопросов в тесте")
            lbl.grid(row=0, column=0, padx=10, pady=10, sticky="nw")
            return

        q = self.questions[self.current_index]
        q_type = str(q.get("type", "entry")).strip()
        q_text = str(q.get("text", "")).strip()
        q_id = str(q.get("id", f"q{self.current_index+1}"))

        q_label = ctk.CTkLabel(self.body_frame, text=q_text, wraplength=860, justify="left",
                               font=ctk.CTkFont(size=15, weight="bold"))
        q_label.grid(row=0, column=0, padx=10, pady=(10, 8), sticky="nw")

        content_frame = ctk.CTkFrame(self.body_frame, fg_color="transparent")
        content_frame.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="nsew")
        content_frame.grid_columnconfigure(0, weight=0)

        self._current_widgets = {"type": q_type, "id": q_id}

        if q_type == "multiple_choice":
            self._render_multiple_choice(content_frame, q)
        elif q_type == "multi_select":
            self._render_multi_select(content_frame, q)
        else:
            self._render_entry(content_frame, q)

        self._update_nav_buttons()

    def _render_multiple_choice(self, parent, q):
        options = q.get("options", [])
        self._mc_var = ctk.IntVar(value=-1)
        prev = self.answers.get(q.get("id"))
        if isinstance(prev, int):
            self._mc_var.set(prev)
        for i, opt in enumerate(options):
            rb = ctk.CTkRadioButton(parent, text="", variable=self._mc_var, value=i)
            rb.grid(row=i, column=0, padx=5, pady=4, sticky="nw")
            lbl = ctk.CTkLabel(parent, text=str(opt), wraplength=825, justify="left")
            lbl.grid(row=i, column=0, padx=35, pady=4, sticky="nw")
            lbl.bind("<Button-1>", lambda e, idx=i: self._mc_var.set(idx))

    def _render_multi_select(self, parent, q):
        options = q.get("options", [])
        selected = self.answers.get(q.get("id"))
        if not isinstance(selected, list):
            selected = []
        self._ms_vars: List[ctk.BooleanVar] = []
        for i, opt in enumerate(options):
            var = ctk.BooleanVar(value=(i in selected))
            cb = ctk.CTkCheckBox(parent, text="", variable=var)
            cb.grid(row=i, column=0, padx=5, pady=4, sticky="w")
            lbl = ctk.CTkLabel(parent, text=str(opt), wraplength=825, justify="left")
            lbl.grid(row=i, column=0, padx=35, pady=4, sticky="w")
            lbl.bind("<Button-1>", lambda e, v=var: v.set(not bool(v.get())))
            self._ms_vars.append(var)

    def _render_entry(self, parent, q):
        prev = self.answers.get(q.get("id"))
        self._entry = ctk.CTkEntry(parent, width=600)
        self._entry.grid(row=0, column=0, padx=5, pady=5, sticky="w")
        if isinstance(prev, str):
            try:
                self._entry.delete(0, ctk.END)
                self._entry.insert(0, prev)
            except Exception:
                pass

    def _collect_current_answer(self):
        if not self.questions:
            return
        q = self.questions[self.current_index]
        q_id = q.get("id")
        q_type = str(q.get("type", "entry")).strip()
        if q_type == "multiple_choice":
            val = self._mc_var.get() if hasattr(self, "_mc_var") else -1
            if val >= 0:
                self.answers[q_id] = val
        elif q_type == "multi_select":
            if hasattr(self, "_ms_vars"):
                chosen = [i for i, var in enumerate(self._ms_vars) if bool(var.get())]
                self.answers[q_id] = chosen
        else:
            if hasattr(self, "_entry"):
                self.answers[q_id] = self._entry.get()

    def _count_without_answer(self):
        answered = 0
        for q in self.questions:
            q_id = q.get("id")
            ans = self.answers.get(q_id)
            answered += 1 if ans or (isinstance(ans, int) and ans == 0) else 0
        return len(self.questions) - answered

    def _go_prev(self):
        self._collect_current_answer()
        if self.current_index > 0:
            self.current_index -= 1
            self._render_current_question()

    def _go_next(self):
        self._collect_current_answer()
        if self.current_index < len(self.questions) - 1:
            self.current_index += 1
            self._render_current_question()

    @staticmethod
    def _normalize_text(s: str) -> str:
        return (s or "").strip().lower()

    def _score_question(self, q: Dict[str, Any], answer: Any) -> (int, int, bool):
        score_val = int(q.get("score", 1))
        q_type = str(q.get("type", "entry")).strip()
        correct = q.get("correct")
        ok = False
        if q_type == "multiple_choice":
            try:
                if isinstance(correct, list) and len(correct) == 1 and isinstance(answer, int):
                    ok = (answer == int(correct[0]))
                elif isinstance(correct, int) and isinstance(answer, int):
                    ok = answer == correct
            except Exception:
                ok = False
        elif q_type == "multi_select":
            try:
                if isinstance(correct, list) and isinstance(answer, list):
                    ok = set(map(int, correct)) == set(map(int, answer))
            except Exception:
                ok = False
        else:
            if isinstance(correct, list):
                ok = any(self._normalize_text(answer) == self._normalize_text(c) for c in correct)
            elif isinstance(correct, str):
                ok = self._normalize_text(answer) == self._normalize_text(correct)
            else:
                ok = False
        return (score_val if ok else 0), score_val, ok

    def _finish_test(self):
        self._collect_current_answer()
        total_points = 0
        max_points = 0
        details = []
        for q in self.questions:
            q_id = q.get("id")
            ans = self.answers.get(q_id)
            got, mx, ok = self._score_question(q, ans)
            total_points += got
            max_points += mx
            details.append((q, ans, ok, got, mx))

        percent = 0 if max_points == 0 else round(100 * total_points / max_points, 2)
        self.finished = True
        self._results_show_expl = False
        self._show_results(total_points, max_points, percent, details)

    def _show_results(self, total_points: int, max_points: int, percent: float, details):
        self._clear_body()
        self._build_header()
        for w in self.nav_frame.winfo_children():
            w.destroy()

        summary = ctk.CTkLabel(self.body_frame,
                               text=f"Результат: {total_points}/{max_points} баллов ({percent}%)",
                               font=ctk.CTkFont(size=16, weight="bold"))
        summary.grid(row=0, column=0, padx=10, pady=(10, 8), sticky="w")

        scroll = ctk.CTkScrollableFrame(self.body_frame)
        scroll.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="nsew")
        scroll.grid_columnconfigure(0, weight=1)

        def _answer_to_text(q, ans, correct: bool = False) -> str:
            q_type = str(q.get("type", "entry")).strip()
            if q_type in ("multiple_choice", "multi_select") or correct:
                options = q.get("options", [])
                if q_type == "multiple_choice":
                    if isinstance(ans, int) and 0 <= ans < len(options):
                        return str(options[ans])
                    elif isinstance(ans, list) and len(ans) == 1 and 0 <= ans[0] < len(options):
                        return str(options[int(ans[0])])
                    return "—"
                else:
                    if isinstance(ans, list) and options:
                        texts = [str(options[i]) for i in ans if isinstance(i, int) and 0 <= i < len(options)]
                        return ", ".join(texts) if texts else "—"
                    elif isinstance(ans, list) and not options:
                        return "; ".join(ans) if ans else "—"
                    return "—"
            else:
                return str(ans) if isinstance(ans, str) and ans.strip() else "—"

        show_expl = bool(getattr(self, "_results_show_expl", False))

        for i, (q, ans, ok, got, mx) in enumerate(details, start=1):
            txt = str(q.get("text", ""))
            status = "Верно" if ok else "Неверно"
            head = ctk.CTkLabel(scroll, text=f"{i}. {txt}", wraplength=740, justify="left",
                                font=ctk.CTkFont(weight="bold"))
            head.grid(row=(i-1)*3, column=0, padx=5, pady=(6, 2), sticky="w")
            your_answ_text = _answer_to_text(q, ans)
            stat = ctk.CTkLabel(scroll, text=f"{status} (+{got}/{mx}) | Ваш ответ: {your_answ_text}", wraplength=820)
            stat.grid(row=(i-1)*3+1, column=0, padx=5, pady=(0, 2), sticky="w")
            if show_expl:
                expl = q.get("explanation")
                expl_lbl = ctk.CTkLabel(scroll, text=f"Ответ: {_answer_to_text(q, q.get('correct'), True)} "
                                                     f"| Пояснение: {expl if expl else 'Нету'}", wraplength=820, justify="left")
                expl_lbl.grid(row=(i-1)*3+2, column=0, padx=5, pady=(0, 2), sticky="w")
        actions = ctk.CTkFrame(self.body_frame, fg_color="transparent")
        actions.grid(row=2, column=0, padx=10, pady=10, sticky="ew")
        actions.grid_columnconfigure(0, weight=0)
        actions.grid_columnconfigure(1, weight=0)
        actions.grid_columnconfigure(2, weight=1)

        show_btn = ctk.CTkButton(
            actions,
            text=("Показать ответы и пояснения" if not show_expl else "Ответы и пояснения показаны (если имеются)"),
            state=("normal" if not show_expl else "disabled"),
            command=lambda: self._reveal_explanations(total_points, max_points, percent, details)
        )
        show_btn.grid(row=0, column=0, padx=(0, 6), sticky="w")

        retry_btn = ctk.CTkButton(actions, text="Перерешать заново", command=self._restart_test)
        retry_btn.grid(row=0, column=1, padx=6, sticky="w")

        close_btn = ctk.CTkButton(actions, text="Закрыть", command=self._close_now)
        close_btn.grid(row=0, column=2, padx=6, sticky="e")

    def _reveal_explanations(self, total_points: int, max_points: int, percent: float, details):
        self._results_show_expl = True
        self._show_results(total_points, max_points, percent, details)

    def _restart_test(self):
        self.finished = False
        self.answers.clear()
        self.current_index = 0
        try:
            self.questions = self._base_questions.copy()
        except Exception:
            self.questions = []
        if self.shuffle:
            random.shuffle(self.questions)
        self._results_show_expl = False
        self._build_nav()
        self._render_current_question()

    def _on_close(self):
        if not self.finished:
            ans = CTkMessagebox(title="Выход из теста",
                                message="Вы уверены, что хотите закрыть тест? Все вопросы будут утеряны.",
                                icon="warning", option_1="Отмена", option_2="Да").get()
            if ans != "Да":
                return
        self._close_now()

    def _close_now(self):
        try:
            self._unblock_main_window()
        finally:
            self.grab_release()
            self.destroy()

    def _open_print_settings(self):
        PrintSettingsDialog(self, self.config_data, self.answers)

    def _generate_print_html(self, include_answers: bool, selected_indices: List[int]) -> str:
        title = self.config_data.get("title", "Тест")
        if self._normalize_text(title) == "название теста (короткое)":
            title = "Тест"

        html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>{htmlL.escape(title)}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }}
        h1 {{ text-align: center; }}
        .question {{ margin: 20px 0; page-break-inside: avoid; }}
        .question-text {{ font-weight: bold; margin-bottom: 10px; }}
        .options {{ margin-left: 20px; }}
        .option {{ margin: 5px 0; }}
        .answer {{ margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px; }}
        .correct {{ color: green; font-weight: bold; }}
        .answers-page {{ page-break-before: always; margin-top: 50px; }}
        @media print {{ body {{ margin: 0; }} }}
    </style>
</head>
<body>
    <h1>{htmlL.escape(title)}</h1>
"""

        for idx in selected_indices:
            if idx >= len(self.questions):
                continue
            q = self.questions[idx]
            q_text = q.get("text", "")
            q_type = q.get("type", "entry")
            options = q.get("options", [])

            html += f'<div class="question">\n'
            html += f'  <div class="question-text">{idx + 1}. {htmlL.escape(q_text)}</div>\n'

            if q_type in ("multiple_choice", "multi_select"):
                html += '  <div class="options">\n'
                for i, opt in enumerate(options):
                    html += f'    <div class="option">{chr(1040 + i)}) {htmlL.escape(str(opt))}</div>\n'
                html += '  </div>\n'

            html += '</div>\n'

        if include_answers:
            html += '<div class="answers-page">\n'
            html += '  <h1>Ответы</h1>\n'
            for idx in selected_indices:
                if idx >= len(self.questions):
                    continue
                q = self.questions[idx]
                q_text = q.get("text", "")
                q_type = q.get("type", "entry")
                options = q.get("options", [])
                correct = q.get("correct", [])
                explanation = q.get("explanation", "")

                html += f'<div class="question">\n'
                html += f'  <div class="question-text">{idx + 1}. {htmlL.escape(q_text)}</div>\n'
                html += '  <div class="answer">\n'
                html += '    <strong>Правильный ответ:</strong> '
                if q_type == "multiple_choice":
                    if isinstance(correct, list) and correct:
                        ans_idx = int(correct[0]) if isinstance(correct[0], (int, str)) else 0
                        if 0 <= ans_idx < len(options):
                            html += f'{chr(1040 + ans_idx)}) {htmlL.escape(str(options[ans_idx]))}'
                    elif isinstance(correct, int) and 0 <= correct < len(options):
                        html += f'{chr(1040 + correct)}) {htmlL.escape(str(options[correct]))}'
                elif q_type == "multi_select":
                    if isinstance(correct, list):
                        ans_texts = []
                        for c in correct:
                            try:
                                c_idx = int(c)
                                if 0 <= c_idx < len(options):
                                    ans_texts.append(f'{chr(1040 + c_idx)}) {htmlL.escape(str(options[c_idx]))}')
                            except (ValueError, TypeError):
                                pass
                        html += ', '.join(ans_texts) if ans_texts else htmlL.escape(str(correct))
                else:
                    if isinstance(correct, list):
                        html += ', '.join(htmlL.escape(str(c)) for c in correct)
                    else:
                        html += htmlL.escape(str(correct))
                
                if explanation:
                    html += f'<br><strong>Пояснение:</strong> {htmlL.escape(explanation)}'
                html += '</div>\n'
            html += '</div>\n'

        html += '</body>\n</html>'
        return html

    def _print_test(self, include_answers: bool, selected_indices: List[int]):
        html_content = self._generate_print_html(include_answers, selected_indices)
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False, encoding='utf-8') as f:
            f.write(html_content)
            temp_path = f.name
        
        try:
            webbrowser.open(f'file:///{temp_path.replace(os.sep, "/")}')
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Печать)",
                          message="Открыт браузер с тестом. Нажмите Ctrl+P для печати или используйте меню печати браузера.",
                          icon="info")
        except Exception as e:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Ошибка печати)", message=f"Не удалось открыть браузер: {e}", icon="cancel")
            if self.MainWindow.settings["logging"] == "Enabled": Logger.log_error(f"Ошибка печати: {e}")
        finally:
            self.after(5000, lambda: os.unlink(temp_path) if os.path.exists(temp_path) else None)


class PrintSettingsDialog(ctk.CTkToplevel):
    def __init__(self, parent_window: InTestWindow, config: Dict[str, Any], answers: Dict[str, Any]):
        super().__init__(master=parent_window)
        self.parent = parent_window
        self.config = config
        self.answers = answers
        self.questions = parent_window.questions
        
        self.title("Настройки печати")
        self.geometry("500x600")
        self.grab_set()
        self.focus()
        self.resizable(False, False)
        self.after(100, lambda: self.iconbitmap(resource_path(ICON_PATH)))
        
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        
        self.header_frame = ctk.CTkFrame(self)
        self.header_frame.grid(row=0, column=0, padx=10, pady=(10, 5), sticky="ew")
        self.header_frame.grid_columnconfigure(0, weight=1)
        
        self.scroll_frame = ctk.CTkScrollableFrame(self)
        self.scroll_frame.grid(row=1, column=0, padx=10, pady=5, sticky="nsew")
        self.scroll_frame.grid_columnconfigure(0, weight=1)
        
        self.actions_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.actions_frame.grid(row=2, column=0, padx=10, pady=(5, 10), sticky="ew")
        self.actions_frame.grid_columnconfigure(0, weight=1)
        
        self._build_header()
        self._build_question_list()
        self._build_actions()
    
    def _build_header(self):
        self.include_answers_var = ctk.BooleanVar(value=False)
        self.cb_answers = ctk.CTkCheckBox(self.header_frame, text="Печатать ответы и пояснения", 
                                          variable=self.include_answers_var)
        self.cb_answers.grid(row=0, column=0, padx=10, pady=10, sticky="w")
        
        self.select_all_var = ctk.BooleanVar(value=True)
        self.cb_select_all = ctk.CTkCheckBox(self.header_frame, text="Выбрать все вопросы",
                                             variable=self.select_all_var, command=self._toggle_all)
        self.cb_select_all.grid(row=1, column=0, padx=10, pady=(0, 10), sticky="w")
    
    def _build_question_list(self):
        self.question_vars = []
        for i, q in enumerate(self.questions):
            var = ctk.BooleanVar(value=True)
            self.question_vars.append(var)
            
            q_text = q.get("text", "")
            truncated = q_text[:80] + "..." if len(q_text) > 80 else q_text
            
            frame = ctk.CTkFrame(self.scroll_frame, fg_color="transparent")
            frame.grid(row=i, column=0, padx=5, pady=2, sticky="ew")
            frame.grid_columnconfigure(1, weight=1)
            
            cb = ctk.CTkCheckBox(frame, text="", variable=var)
            cb.grid(row=0, column=0, padx=5, pady=5, sticky="w")
            
            lbl = ctk.CTkLabel(frame, text=f"{i + 1}. {truncated}", wraplength=350, justify="left", anchor="w")
            lbl.grid(row=0, column=1, padx=(2, 5), pady=5, sticky="ew")
    
    def _build_actions(self):
        self.print_btn = ctk.CTkButton(self.actions_frame, text="Печать", command=self._on_print,
                                       fg_color="#2E8BC0", hover_color="#1E6B90")
        self.print_btn.grid(row=0, column=0, padx=10, pady=10, sticky="ew")
        
        self.cancel_btn = ctk.CTkButton(self.actions_frame, text="Отмена", command=self.destroy)
        self.cancel_btn.grid(row=0, column=1, padx=(0, 10), pady=10, sticky="ew")
    
    def _toggle_all(self):
        value = self.select_all_var.get()
        for var in self.question_vars:
            var.set(value)
    
    def _on_print(self):
        selected_indices = [i for i, var in enumerate(self.question_vars) if var.get()]
        
        if not selected_indices:
            CTkMessagebox(title=f"{DISPLAY_APP_NAME} (Печать)", message="Выберите хотя бы один вопрос для печати.", icon="warning")
            return
        
        include_answers = self.include_answers_var.get()
        self.parent._print_test(include_answers, selected_indices)
        self.after(100, self.destroy)
