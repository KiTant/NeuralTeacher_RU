import customtkinter as ctk
from CTkMessagebox import CTkMessagebox
from typing import TYPE_CHECKING, Any, Dict, List
from utils.variables import ICON_PATH, resource_path
import random
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
        self._base_questions: List[Dict[str, Any]] = qs.copy()
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

    def _build_header(self):
        for w in self.header_frame.winfo_children():
            w.destroy()

        title = self.config_data.get("title", "Тест")
        if self._normalize_text(title) == "название теста (короткое)":
            title = "Тест"

        self.title_label = ctk.CTkLabel(self.header_frame, text=title, font=ctk.CTkFont(size=18, weight="bold"))
        self.title_label.grid(row=0, column=0, padx=5, pady=(0, 4), sticky="w")

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
