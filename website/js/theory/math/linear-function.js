function renderTheoryLinearFunction(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Линейная функция</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Определение</h3>
                <p>Функция вида $y = kx + b$, где $k$ и $b$ — числа, называется <b>линейной</b>.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>$k$ — <b>угловой коэффициент</b> (определяет наклон)</li>
                    <li>$b$ — свободный член (смещение по оси $Oy$)</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">График линейной функции</h3>
                <p>График линейной функции — <b>прямая</b>. Для построения достаточно двух точек.</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Построение</p>
                        <p>Найдём две точки: при $x = 0$ получаем $y = b$; при $x = 1$ получаем $y = k + b$.</p>
                        <p class="text-sm text-slate-400 mt-1">Пример: $y = 2x - 1$. Точки: $(0; -1)$ и $(1; 1)$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Точка пересечения с осью $Oy$</p>
                        <p>При $x = 0$: $y = b$. Точка $(0; b)$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Точка пересечения с осью $Ox$</p>
                        <p>При $y = 0$: $x = -\\dfrac{b}{k}$. Точка $\\left(-\\dfrac{b}{k}; 0\\right)$.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Влияние коэффициента $k$</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">$k > 0$</p>
                        <p>Функция возрастает</p>
                        <p class="text-sm text-slate-400">Прямая идёт вверх</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                        <p class="text-amber-400 font-bold mb-1">$k = 0$</p>
                        <p>$y = b$ — константа</p>
                        <p class="text-sm text-slate-400">Горизонтальная прямая</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                        <p class="text-red-400 font-bold mb-1">$k < 0$</p>
                        <p>Функция убывает</p>
                        <p class="text-sm text-slate-400">Прямая идёт вниз</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Влияние коэффициента $b$</h3>
                <p>$b$ определяет сдвиг графика вдоль оси $Oy$:</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$b > 0$ — график сдвинут вверх</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$b < 0$ — график сдвинут вниз</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$b = 0$ — прямая проходит через начало координат</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Частный случай: прямая пропорциональность</h3>
                <p>При $b = 0$ получаем $y = kx$ — <b>прямую пропорциональность</b>.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>График — прямая, проходящая через начало координат $(0; 0)$.</p>
                    <p>Достаточно найти одну точку (кроме $O$).</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Взаимное расположение прямых</h3>
                <div class="space-y-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-1">Параллельность</p>
                        <p>Прямые $y = k_1 x + b_1$ и $y = k_2 x + b_2$ параллельны, если:</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500 mt-2">
                            $$k_1 = k_2, \\quad b_1 \\neq b_2$$
                        </div>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p class="text-red-400 font-bold mb-1">Пересечение</p>
                        <p>Прямые пересекаются, если $k_1 \\neq k_2$.</p>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">Совпадение</p>
                        <p>Прямые совпадают, если $k_1 = k_2$ и $b_1 = b_2$.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Линейное уравнение с двумя переменными</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    $$ax + by = c$$
                    <p class="text-sm text-slate-400 mt-1">График — прямая. Если $b \\neq 0$, можно выразить $y$:</p>
                    $$y = -\\frac{a}{b}x + \\frac{c}{b}$$
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
