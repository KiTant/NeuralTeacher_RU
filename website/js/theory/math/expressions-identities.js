function renderTheoryExpressionsIdentities(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Выражения и тождества</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Числовые выражения</h3>
                <p><b>Числовое выражение</b> — запись, составленная из чисел, знаков действий и скобок.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>$5 + 3 \\cdot 2 = 5 + 6 = 11$</p>
                    <p>$(7 - 2) \\cdot (3 + 1) = 5 \\cdot 4 = 20$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Буквенные выражения</h3>
                <p><b>Буквенное выражение</b> (выражение с переменной) — содержит буквы (переменные).</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    <p>$3a + 2b$ — буквенное выражение</p>
                    <p>При $a = 2,\\; b = 5$: $3 \\cdot 2 + 2 \\cdot 5 = 16$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Переменная и область определения</h3>
                <p><b>Переменная</b> — буква, вместо которой можно подставить различные числа.</p>
                <p><b>Область определения</b> — множество значений переменной, при которых выражение имеет смысл.</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>$\\dfrac{5}{x - 3}$ — определено при $x \\neq 3$</p>
                    <p>$\\sqrt{x}$ — определено при $x \\geq 0$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Тождество</h3>
                <p><b>Тождество</b> — равенство, верное при любых допустимых значениях переменных.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$a + b = b + a$$
                    $$a(b + c) = ab + ac$$
                    $$-(a - b) = -a + b = b - a$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Тождественные преобразования</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Раскрытие скобок</p>
                        <p>Перед скобками «+» — знаки не меняются:</p>
                        <p>$a + (b - c) = a + b - c$</p>
                        <p class="mt-2">Перед скобками «−» — знаки меняются:</p>
                        <p>$a - (b - c) = a - b + c$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Распределительное свойство</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500 mt-2">
                            $$a(b + c) = ab + ac$$
                            $$ab + ac = a(b + c) \\text{ — вынесение общего множителя}$$
                        </div>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Приведение подобных слагаемых</p>
                        <p>Слагаемые с одинаковой буквенной частью — <b>подобные</b>:</p>
                        <p>$3a + 5a - 2a = (3 + 5 - 2)a = 6a$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Уравнение</h3>
                <p><b>Уравнение</b> — равенство, содержащее переменную.</p>
                <p><b>Корень уравнения</b> — значение переменной, при котором уравнение обращается в верное числовое равенство.</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p class="font-medium text-white mb-1">Свойства уравнений</p>
                        <ul class="list-disc list-inside space-y-1 text-sm">
                            <li>Можно перенести слагаемое в другую часть, изменив его знак</li>
                            <li>Можно умножить или разделить обе части на одно и то же число $\\neq 0$</li>
                        </ul>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Линейное уравнение с одной переменной</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    $$ax + b = 0 \\quad (a \\neq 0)$$
                    $$x = -\\frac{b}{a}$$
                </div>
                <div class="space-y-2 mt-3">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>Пример: $3x - 7 = 2x + 5$</p>
                        <p>$3x - 2x = 5 + 7$</p>
                        <p>$x = 12$</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
