function renderTheoryFractionsProportions(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Обыкновенные дроби, отрицательные числа, пропорции</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Обыкновенные дроби</h3>
                <p>Дробь $\\dfrac{a}{b}$ (где $b \\neq 0$) состоит из <b>числителя</b> $a$ и <b>знаменателя</b> $b$.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li><b>Правильная дробь</b>: числитель меньше знаменателя ($\\frac{3}{7}$)</li>
                    <li><b>Неправильная дробь</b>: числитель $\\geq$ знаменателя ($\\frac{7}{3}$)</li>
                    <li><b>Смешанное число</b>: $2\\frac{1}{3} = \\frac{7}{3}$</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">Основное свойство дроби</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$\\frac{a}{b} = \\frac{a \\cdot c}{b \\cdot c} \\quad (c \\neq 0)$$
                    <p class="text-sm text-slate-400 mt-1">Если числитель и знаменатель умножить или разделить на одно и то же число, дробь не изменится.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сокращение дробей</h3>
                <p>Деление числителя и знаменателя на их общий делитель:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    <p>$\\dfrac{12}{18} = \\dfrac{12 : 6}{18 : 6} = \\dfrac{2}{3}$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сложение и вычитание дробей</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Одинаковые знаменатели</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">
                            $$\\frac{a}{c} + \\frac{b}{c} = \\frac{a+b}{c}$$
                        </div>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Разные знаменатели</p>
                        <p>Привести к общему знаменателю (НОК знаменателей), затем сложить:</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">
                            $$\\frac{a}{b} + \\frac{c}{d} = \\frac{a \\cdot d + c \\cdot b}{b \\cdot d}$$
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Умножение и деление дробей</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Умножение</p>
                        $$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Деление</p>
                        $$\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Отрицательные числа</h3>
                <p>Числа, перед которыми стоит знак «минус»: $-1, -5, -0{,}3$. Они расположены на числовой оси слева от нуля.</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Модуль числа</p>
                        <p><b>Модуль</b> (абсолютная величина) — расстояние от числа до нуля на координатной прямой:</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500 mt-2">
                            $$|a| = \\begin{cases} a, & a \\geq 0 \\\\ -a, & a < 0 \\end{cases}$$
                        </div>
                        <p class="mt-2">$|5| = 5$, &nbsp; $|-7| = 7$, &nbsp; $|0| = 0$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Сравнение</p>
                        <p>Из двух отрицательных чисел больше то, у которого модуль меньше:</p>
                        <p>$-3 > -7$, так как $|-3| < |-7|$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Действия с отрицательными числами</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Сложение</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            <li>Оба положительных: $3 + 5 = 8$</li>
                            <li>Оба отрицательных: $(-3) + (-5) = -8$</li>
                            <li>Разных знаков: из большего модуля вычитаем меньший, ставим знак большего модуля</li>
                            <li>$(-7) + 3 = -4$, &nbsp; $7 + (-3) = 4$</li>
                        </ul>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Умножение и деление</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            <div class="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-center">
                                <p class="text-emerald-400 font-bold mb-1">Одинаковые знаки → плюс</p>
                                <p>$(-a) \\cdot (-b) = ab$</p>
                                <p>$(-a) : (-b) = \\frac{a}{b}$</p>
                            </div>
                            <div class="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center">
                                <p class="text-red-400 font-bold mb-1">Разные знаки → минус</p>
                                <p>$(-a) \\cdot b = -ab$</p>
                                <p>$a : (-b) = -\\frac{a}{b}$</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Пропорции</h3>
                <p><b>Пропорция</b> — равенство двух отношений:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$\\frac{a}{b} = \\frac{c}{d} \\quad \\text{или} \\quad a : b = c : d$$
                </div>
                <p class="mt-2">$a$ и $d$ — <b>крайние члены</b>, $b$ и $c$ — <b>средние члены</b>.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Основное свойство пропорции</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$a \\cdot d = b \\cdot c$$
                    <p class="text-sm text-slate-400 mt-1">Произведение крайних членов равно произведению средних.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Нахождение неизвестного члена</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$\\dfrac{x}{b} = \\dfrac{c}{d} \\Rightarrow x = \\dfrac{b \\cdot c}{d}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$\\dfrac{a}{x} = \\dfrac{c}{d} \\Rightarrow x = \\dfrac{a \\cdot d}{c}$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Прямая и обратная пропорциональность</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">Прямая</p>
                        <p>При увеличении одной величины другая увеличивается во столько же раз:</p>
                        <p class="mt-1">$y = kx$ ($k > 0$)</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <p class="text-amber-400 font-bold mb-1">Обратная</p>
                        <p>При увеличении одной величины другая уменьшается во столько же раз:</p>
                        <p class="mt-1">$y = \\dfrac{k}{x}$ ($k > 0$)</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
