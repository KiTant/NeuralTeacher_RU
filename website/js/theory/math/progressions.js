function renderTheoryProgressions(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Числовые последовательности: прогрессии</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Числовая последовательность</h3>
                <p><b>Числовая последовательность</b> — функция, заданная на множестве натуральных чисел. Обозначается $a_1, a_2, a_3, \\ldots, a_n, \\ldots$ или $\\{a_n\\}$.</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Аналитический способ</b>: формула $n$-го члена: $a_n = 2n + 1$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Рекуррентный способ</b>: каждый член выражается через предыдущий: $a_1 = 1$, $a_{n+1} = a_n + 2$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Арифметическая прогрессия</h3>
                <p><b>Арифметическая прогрессия</b> — последовательность, каждый член которой, начиная со второго, равен предыдущему, сложенному с одним и тем же числом $d$ (разностью прогрессии).</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$a_{n+1} = a_n + d$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формула $n$-го члена</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$a_n = a_1 + (n - 1)d$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: $a_1 = 3$, $d = 2$. Тогда $a_{10} = 3 + 9 \\cdot 2 = 21$.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Характеристическое свойство</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$a_n = \\frac{a_{n-1} + a_{n+1}}{2}$$
                    <p class="text-sm text-slate-400 mt-1">Каждый член равен среднему арифметическому соседних.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сумма $n$ первых членов</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Формула 1</p>
                        $$S_n = \\frac{a_1 + a_n}{2} \\cdot n$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">Формула 2</p>
                        $$S_n = \\frac{2a_1 + (n-1)d}{2} \\cdot n$$
                    </div>
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: найти сумму первых 10 натуральных чисел.</p>
                    <p>$S_{10} = \\dfrac{1 + 10}{2} \\cdot 10 = 55$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Геометрическая прогрессия</h3>
                <p><b>Геометрическая прогрессия</b> — последовательность, каждый член которой, начиная со второго, равен предыдущему, умноженному на одно и то же число $q$ (знаменатель прогрессии), $q \\neq 0$.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$b_{n+1} = b_n \\cdot q$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формула $n$-го члена</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$b_n = b_1 \\cdot q^{n-1}$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: $b_1 = 2$, $q = 3$. Тогда $b_5 = 2 \\cdot 3^4 = 162$.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Характеристическое свойство</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$b_n^2 = b_{n-1} \\cdot b_{n+1}$$
                    <p class="text-sm text-slate-400 mt-1">Квадрат каждого члена равен произведению соседних (при $b_n > 0$).</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сумма $n$ первых членов</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">При $q \\neq 1$</p>
                        $$S_n = \\frac{b_1(q^n - 1)}{q - 1}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">При $q = 1$</p>
                        $$S_n = b_1 \\cdot n$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сходящаяся геометрическая прогрессия</h3>
                <p>При $|q| < 1$ прогрессия называется <b>бесконечно убывающей</b>. Сумма бесконечного числа членов:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                    $$S = \\frac{b_1}{1 - q}, \\quad |q| < 1$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: $1 + \\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\ldots$</p>
                    <p>$b_1 = 1$, $q = \\dfrac{1}{2}$, $S = \\dfrac{1}{1 - \\frac{1}{2}} = 2$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сравнение прогрессий</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse bg-slate-800/30 rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="p-3 text-left text-slate-300"></th>
                                <th class="p-3 text-center text-blue-400">Арифметическая</th>
                                <th class="p-3 text-center text-emerald-400">Геометрическая</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 font-medium text-white">Определение</td>
                                <td class="p-3 text-center">$a_{n+1} = a_n + d$</td>
                                <td class="p-3 text-center">$b_{n+1} = b_n \\cdot q$</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 font-medium text-white">$n$-й член</td>
                                <td class="p-3 text-center">$a_1 + (n-1)d$</td>
                                <td class="p-3 text-center">$b_1 \\cdot q^{n-1}$</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 font-medium text-white">Свойство</td>
                                <td class="p-3 text-center">$a_n = \\frac{a_{n-1}+a_{n+1}}{2}$</td>
                                <td class="p-3 text-center">$b_n^2 = b_{n-1} \\cdot b_{n+1}$</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 font-medium text-white">Сумма</td>
                                <td class="p-3 text-center">$\\frac{a_1+a_n}{2} \\cdot n$</td>
                                <td class="p-3 text-center">$\\frac{b_1(q^n-1)}{q-1}$</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
