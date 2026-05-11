function renderTheoryRationalFractions(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Рациональные дроби</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Рациональное выражение</h3>
                <p><b>Рациональное выражение</b> — выражение, составленное из чисел, переменных, арифметических операций и возведения в степень с натуральным показателем.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">Целое выражение</p>
                        <p>Не содержит деления на выражение с переменной:</p>
                        <p class="mt-1">$3x^2 + 2x - 1$, &nbsp; $5a(b + c)$</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <p class="text-amber-400 font-bold mb-1">Дробное выражение</p>
                        <p>Содержит деление на выражение с переменной:</p>
                        <p class="mt-1">$\\dfrac{x + 1}{x - 2}$, &nbsp; $\\dfrac{a}{b} + 3$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Рациональная дробь</h3>
                <p><b>Рациональная дробь</b> — дробь, числитель и знаменатель которой — многочлены.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$\\frac{P(x)}{Q(x)}, \\quad Q(x) \\neq 0$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Допустимые значения переменных</h3>
                <p>Значения, при которых знаменатель не обращается в нуль:</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>$\\dfrac{x + 3}{x - 5}$ — допустимы все $x \\neq 5$</p>
                    <p>$\\dfrac{2a}{a^2 - 4}$ — допустимы все $a \\neq \\pm 2$ (так как $a^2 - 4 = (a-2)(a+2)$)</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Основное свойство рациональной дроби</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$\\frac{a}{b} = \\frac{a \\cdot c}{b \\cdot c} \\quad (c \\neq 0)$$
                    <p class="text-sm text-slate-400 mt-1">Числитель и знаменатель можно умножить или разделить на одно и то же ненулевое выражение.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сокращение дробей</h3>
                <p>Разделить числитель и знаменатель на их общий множитель:</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$\\dfrac{6x^2}{3x} = \\dfrac{6x^2 : 3x}{3x : 3x} = 2x$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$\\dfrac{x^2 - 9}{x + 3} = \\dfrac{(x-3)(x+3)}{x+3} = x - 3$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сложение и вычитание</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Одинаковые знаменатели</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">
                            $$\\frac{a}{c} + \\frac{b}{c} = \\frac{a + b}{c}$$
                        </div>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Разные знаменатели</p>
                        <p>Привести к общему знаменателю (обычно НОК знаменателей), затем сложить:</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500 mt-2">
                            $$\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$$
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Умножение и деление</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Умножение</p>
                        $$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{ac}{bd}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Деление</p>
                        $$\\frac{a}{b} : \\frac{c}{d} = \\frac{ad}{bc}$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Возведение в степень</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                    $$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n} \\quad (b \\neq 0)$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Тождественные преобразования</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Изменение знака дроби</b>: $\\dfrac{-a}{b} = \\dfrac{a}{-b} = -\\dfrac{a}{b}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Вынесение минуса</b>: $\\dfrac{1 - x}{x - 1} = \\dfrac{-(x - 1)}{x - 1} = -1$</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
