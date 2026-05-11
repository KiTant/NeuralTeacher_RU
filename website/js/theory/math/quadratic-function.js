function renderTheoryQuadraticFunction(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Квадратичная функция</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Определение</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$y = ax^2 + bx + c, \\quad a \\neq 0$$
                </div>
                <p class="mt-2">График — <b>парабола</b>.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>При $a > 0$ — ветви параболы направлены вверх</li>
                    <li>При $a < 0$ — ветви параболы направлены вниз</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">Вершина параболы</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$x_0 = -\\frac{b}{2a}$$
                    $$y_0 = f(x_0) = c - \\frac{b^2}{4a}$$
                </div>
                <p class="mt-2">Координаты вершины: $\\left(-\\dfrac{b}{2a};\\; f\\!\\left(-\\dfrac{b}{2a}\\right)\\right)$</p>

                <h3 class="text-xl font-semibold text-white pt-4">Ось симметрии</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$x = -\\frac{b}{2a}$$
                </div>
                <p class="mt-2">Парабола симметрична относительно вертикальной прямой $x = x_0$.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Точки пересечения с осями</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">С осью $Oy$</p>
                        <p>При $x = 0$: $y = c$. Точка $(0; c)$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">С осью $Ox$</p>
                        <p>Решить $ax^2 + bx + c = 0$. Количество точек зависит от $D$:</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <div class="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-center text-sm">
                                <p class="text-emerald-400 font-bold">$D > 0$</p>
                                <p>2 точки</p>
                            </div>
                            <div class="bg-amber-500/10 border border-amber-500/20 p-2 rounded text-center text-sm">
                                <p class="text-amber-400 font-bold">$D = 0$</p>
                                <p>1 точка</p>
                            </div>
                            <div class="bg-red-500/10 border border-red-500/20 p-2 rounded text-center text-sm">
                                <p class="text-red-400 font-bold">$D < 0$</p>
                                <p>нет точек</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Вид $y = a(x - x_0)^2 + y_0$</h3>
                <p>Выделение полного квадрата позволяет записать:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    $$y = a\\!\\left(x + \\frac{b}{2a}\\right)^2 - \\frac{D}{4a}$$
                    <p class="text-sm text-slate-400 mt-1">где $D = b^2 - 4ac$ — дискриминант.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сдвиги параболы $y = ax^2$</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$y = ax^2 + n$ — сдвиг на $n$ вверх ($n > 0$) или вниз ($n < 0$)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$y = a(x - m)^2$ — сдвиг на $m$ вправо ($m > 0$) или влево ($m < 0$)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$y = a(x - m)^2 + n$ — сдвиг на $m$ по горизонтали и $n$ по вертикали</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Свойства квадратичной функции</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-2">При $a > 0$</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            <li>Область значений: $[y_0; +\\infty)$</li>
                            <li>Убывает на $(-\\infty; x_0]$</li>
                            <li>Возрастает на $[x_0; +\\infty)$</li>
                            <li>Наименьшее значение $y_0$</li>
                        </ul>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p class="text-red-400 font-bold mb-2">При $a < 0$</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            <li>Область значений: $(-\\infty; y_0]$</li>
                            <li>Возрастает на $(-\\infty; x_0]$</li>
                            <li>Убывает на $[x_0; +\\infty)$</li>
                            <li>Наибольшее значение $y_0$</li>
                        </ul>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Построение графика</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">1.</span>
                        <p>Найти координаты вершины $x_0 = -\\dfrac{b}{2a}$, $y_0 = f(x_0)$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">2.</span>
                        <p>Провести ось симметрии $x = x_0$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">3.</span>
                        <p>Найти точки пересечения с осями координат</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">4.</span>
                        <p>Найти дополнительные точки (симметричные относительно оси)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">5.</span>
                        <p>Соединить точки плавной кривой</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
