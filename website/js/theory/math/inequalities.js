function renderTheoryInequalities(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Неравенства</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Числовые неравенства</h3>
                <p>Запись $a < b$ означает, что число $a$ меньше числа $b$ (на координатной прямой $a$ расположено левее $b$).</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p>Строгие: $a < b$, $a > b$</p>
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p>Нестрогие: $a \\leq b$, $a \\geq b$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Свойства неравенств</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">1.</span>
                        <p>Если $a < b$, то $b > a$ (симметричность)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">2.</span>
                        <p>Если $a < b$ и $b < c$, то $a < c$ (транзитивность)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">3.</span>
                        <p>Если $a < b$, то $a + c < b + c$ (прибавление одного и того же числа)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-emerald-400 font-bold shrink-0">4.</span>
                        <p>Если $a < b$ и $c > 0$, то $ac < bc$ (умножение на положительное)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-red-400 font-bold shrink-0">5.</span>
                        <p>Если $a < b$ и $c < 0$, то $ac > bc$ (умножение на отрицательное — знак меняется!)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">6.</span>
                        <p>Если $a < b$ и $c < d$, то $a + c < b + d$ (сложение неравенств одного знака)</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Линейное неравенство с одной переменной</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$ax + b > 0 \\quad (\\text{или} \\; <, \\; \\leq, \\; \\geq)$$
                </div>
                <p class="mt-2">Решается аналогично уравнению, но при делении/умножении на отрицательное число знак неравенства меняется.</p>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p class="font-medium text-white mb-1">Пример</p>
                    <p>$-2x + 6 > 0$</p>
                    <p>$-2x > -6$</p>
                    <p>$x < 3$ &nbsp; <span class="text-red-400">(разделили на $-2$, знак изменился)</span></p>
                    <p class="text-sm text-slate-400 mt-1">Ответ: $x \\in (-\\infty; 3)$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Числовые промежутки</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Интервал</b>: $(a; b) = \\{x \\mid a < x < b\\}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Отрезок</b>: $[a; b] = \\{x \\mid a \\leq x \\leq b\\}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Полуинтервал</b>: $(a; b]$, $[a; b)$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Луч</b>: $[a; +\\infty)$, $(-\\infty; b]$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Открытый луч</b>: $(a; +\\infty)$, $(-\\infty; b)$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Системы неравенств</h3>
                <p>Решение системы — пересечение решений каждого неравенства.</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p class="font-medium text-white mb-1">Пример</p>
                    <p>$\\begin{cases} 2x - 1 > 3 \\\\ 3x - 2 < 7 \\end{cases}$</p>
                    <p class="mt-2">$\\begin{cases} x > 2 \\\\ x < 3 \\end{cases}$</p>
                    <p>Ответ: $x \\in (2; 3)$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Квадратные неравенства</h3>
                <p>Неравенство вида $ax^2 + bx + c > 0$ (или $<, \\leq, \\geq$).</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Метод интервалов</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            <li>Найти корни квадратного трёхчлена</li>
                            <li>Отметить их на числовой прямой</li>
                            <li>Определить знаки на каждом интервале</li>
                            <li>Выбрать интервалы с нужным знаком</li>
                        </ul>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Пример</p>
                        <p>$x^2 - 5x + 6 > 0$</p>
                        <p>Корни: $x_1 = 2$, $x_2 = 3$</p>
                        <p>Знаки: $+$ на $(-\\infty; 2)$, $-$ на $(2; 3)$, $+$ на $(3; +\\infty)$</p>
                        <p>Ответ: $x \\in (-\\infty; 2) \\cup (3; +\\infty)$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Метод интервалов (общий)</h3>
                <p>Для решения неравенства вида $f(x) > 0$:</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">1.</span>
                        <p>Найти нули функции $f(x) = 0$ и точки, где $f$ не определена</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">2.</span>
                        <p>Отметить все найденные точки на числовой прямой</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">3.</span>
                        <p>Определить знак $f$ на каждом интервале (пробная точка)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">4.</span>
                        <p>Выбрать интервалы с нужным знаком, учесть строгое/нестрогое неравенство</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
