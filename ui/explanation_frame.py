import ui.assistant_frame
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ui.main_window import MainWindow as MainWindowClass

system_prompt = (
            "Ты — дружелюбный преподаватель. Объясняй темы и понятия для школьников и студентов "
            "кратко и понятно, используя простые слова, примеры и аналогии. При необходимости задавай "
            "уточняющие вопросы и предлагай мини-проверки понимания. "
            "ОЧЕНЬ ВАЖНО: Пиши всегда простым текстом без специальных HTML/LaTeX/визуальных схем или 'особых функций отображения' "
            "(например, НЕ рисуй деление в столбик). Не используй смайлы/emoji. Не используй что-то типо /frac{0+a}{2}/right. Можно применять стандартные "
            "компьютерные символы для математики (например, степени a^2, корень √, ≥, ≤ и т.д.)."
        )


class ExplanationFrame(ui.assistant_frame.AssistantChatFrame):
    def __init__(self, MainWindow: "MainWindowClass"):
        super().__init__(MainWindow=MainWindow, system_prompt=system_prompt, frame_name="explanation")
