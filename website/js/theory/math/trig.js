function renderTheoryTrig(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Тригонометрия</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Определение</h3>
                <p>Тригонометрические функции определяются через отношения сторон прямоугольного треугольника или через единичную окружность (тригонометрический круг).</p>

                <h3 class="text-xl font-semibold text-white pt-4">Прямоугольный треугольник</h3>
                <p>Для угла $\\alpha$ в прямоугольном треугольнике:</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">
                        <p class="text-blue-400 font-bold mb-1">Синус</p>
                        <p>$\\sin \\alpha = \\dfrac{\\text{противолежащий катет}}{\\text{гипотенуза}}$</p>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">Косинус</p>
                        <p>$\\cos \\alpha = \\dfrac{\\text{прилежащий катет}}{\\text{гипотенуза}}$</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                        <p class="text-amber-400 font-bold mb-1">Тангенс</p>
                        <p>$\\tan \\alpha = \\dfrac{\\sin \\alpha}{\\cos \\alpha}$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Радианы и градусы</h3>
                <p>Углы можно измерять в градусах или радианах. <b>Один радиан</b> — это центральный угол, длина дуги которого равна радиусу окружности:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">$$1 \\text{ рад} \\approx 57°17'45'' \\approx 57{,}3°$$</div>
                <p>Полная окружность составляет $360° = 2\\pi$ рад. Формулы перевода:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Градусы → Радианы</p>
                        $$\\alpha_{\\text{рад}} = \\alpha_{\\text{град}} \\cdot \\frac{\\pi}{180}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Радианы → Градусы</p>
                        $$\\alpha_{\\text{град}} = \\alpha_{\\text{рад}} \\cdot \\frac{180}{\\pi}$$
                    </div>
                </div>
                <p class="text-sm text-slate-400">Примеры: $90° = \\dfrac{\\pi}{2}$ рад, $60° = \\dfrac{\\pi}{3}$ рад, $45° = \\dfrac{\\pi}{4}$ рад, $180° = \\pi$ рад.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Единичная окружность</h3>
                <p>На единичной окружности радиуса 1 точка $A$ имеет координаты $(\\cos \\alpha,\\; \\sin \\alpha)$, где $\\alpha$ — угол поворота от положительного направления оси $Ox$.</p>
                <p>Знаки функций по четвертям:</p>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                        <p class="text-emerald-400 font-bold">I четверть</p>
                        <p>$\\sin > 0,\\; \\cos > 0$</p>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                        <p class="text-blue-400 font-bold">II четверть</p>
                        <p>$\\sin > 0,\\; \\cos < 0$</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <p class="text-red-400 font-bold">III четверть</p>
                        <p>$\\sin < 0,\\; \\cos < 0$</p>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                        <p class="text-purple-400 font-bold">IV четверть</p>
                        <p>$\\sin < 0,\\; \\cos > 0$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Таблица значений</h3>
                <div class="overflow-x-auto">
                    <style>
                        .trig-table th, .trig-table td { border: 1px solid rgba(71,85,105,0.5); }
                        .trig-table th:first-child, .trig-table td:first-child { border-left: none; }
                        .trig-table th:last-child, .trig-table td:last-child { border-right: none; }
                        .trig-table thead tr:first-child th { border-top: none; }
                        .trig-table tbody tr:last-child td { border-bottom: none; }
                    </style>
                    <table class="trig-table w-full text-sm border-collapse bg-slate-800/30 rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="p-3 text-left text-slate-300" rowspan="2">$\\alpha$</th>
                                <th class="p-3 text-center">$0°$</th>
                                <th class="p-3 text-center">$30°$</th>
                                <th class="p-3 text-center">$45°$</th>
                                <th class="p-3 text-center">$60°$</th>
                                <th class="p-3 text-center">$90°$</th>
                                <th class="p-3 text-center">$180°$</th>
                            </tr>
                            <tr class="bg-slate-700/40">
                                <th class="p-3 text-center text-slate-300">$0$</th>
                                <th class="p-3 text-center text-slate-300">$\\dfrac{\\pi}{6}$</th>
                                <th class="p-3 text-center text-slate-300">$\\dfrac{\\pi}{4}$</th>
                                <th class="p-3 text-center text-slate-300">$\\dfrac{\\pi}{3}$</th>
                                <th class="p-3 text-center text-slate-300">$\\dfrac{\\pi}{2}$</th>
                                <th class="p-3 text-center text-slate-300">$\\pi$</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-4 text-blue-400 font-semibold">$\\sin$</td>
                                <td class="p-4 text-center">$0$</td>
                                <td class="p-4 text-center">$\\dfrac{1}{2}$</td>
                                <td class="p-4 text-center">$\\dfrac{\\sqrt{2}}{2}$</td>
                                <td class="p-4 text-center">$\\dfrac{\\sqrt{3}}{2}$</td>
                                <td class="p-4 text-center">$1$</td>
                                <td class="p-4 text-center">$0$</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-4 text-emerald-400 font-semibold">$\\cos$</td>
                                <td class="p-4 text-center">$1$</td>
                                <td class="p-4 text-center">$\\dfrac{\\sqrt{3}}{2}$</td>
                                <td class="p-4 text-center">$\\dfrac{\\sqrt{2}}{2}$</td>
                                <td class="p-4 text-center">$\\dfrac{1}{2}$</td>
                                <td class="p-4 text-center">$0$</td>
                                <td class="p-4 text-center">$-1$</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-4 text-amber-400 font-semibold">$\\tan$</td>
                                <td class="p-4 text-center">$0$</td>
                                <td class="p-4 text-center">$\\dfrac{1}{\\sqrt{3}}$</td>
                                <td class="p-4 text-center">$1$</td>
                                <td class="p-4 text-center">$\\sqrt{3}$</td>
                                <td class="p-4 text-center">—</td>
                                <td class="p-4 text-center">$0$</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Основные тождества</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">Основное тригонометрическое тождество</p>
                        $$\\sin^2 \\alpha + \\cos^2 \\alpha = 1$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Связь тангенса и косинуса</p>
                        $$1 + \\tan^2 \\alpha = \\frac{1}{\\cos^2 \\alpha}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Связь котангенса и синуса</p>
                        $$1 + \\cot^2 \\alpha = \\frac{1}{\\sin^2 \\alpha}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Связь тангенса и котангенса</p>
                        $$\\tan \\alpha \\cdot \\cot \\alpha = 1$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формулы приведения</h3>
                <p>Позволяют выразить тригонометрические функции углов $\\frac{\\pi}{2} \\pm \\alpha$, $\\pi \\pm \\alpha$, $\\frac{3\\pi}{2} \\pm \\alpha$, $2\\pi \\pm \\alpha$ через функции угла $\\alpha$.</p>
                <p class="text-sm text-slate-400 mt-1"><b>Правило:</b> если «точка опоры» — $\\dfrac{\\pi}{2}$ или $\\dfrac{3\\pi}{2}$, функция меняется на кофункцию ($\\sin \\leftrightarrow \\cos$, $\\tan \\leftrightarrow \\cot$). Знак определяется по знаку исходной функции в данной четверти.</p>
                <div class="space-y-4 mt-4">
                    <div class="bg-slate-800/30 p-5 rounded-lg space-y-3">
                        <p>$\\sin\\!\\left(\\dfrac{\\pi}{2} - \\alpha\\right) = \\cos \\alpha$</p>
                        <p>$\\cos\\!\\left(\\dfrac{\\pi}{2} - \\alpha\\right) = \\sin \\alpha$</p>
                    </div>
                    <div class="bg-slate-800/30 p-5 rounded-lg space-y-3">
                        <p>$\\sin\\!\\left(\\dfrac{3\\pi}{2} - \\alpha\\right) = -\\cos \\alpha$</p>
                        <p>$\\cos\\!\\left(\\dfrac{3\\pi}{2} - \\alpha\\right) = -\\sin \\alpha$</p>
                    </div>
                    <div class="bg-slate-800/30 p-5 rounded-lg">
                        <p>$\\sin(\\pi - \\alpha) = \\sin \\alpha$</p>
                        <p>$\\cos(\\pi - \\alpha) = -\\cos \\alpha$</p>
                    </div>
                    <div class="bg-slate-800/30 p-5 rounded-lg">
                        <p>$\\sin(\\pi + \\alpha) = -\\sin \\alpha$</p>
                        <p>$\\cos(\\pi + \\alpha) = -\\cos \\alpha$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формулы сложения</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">$$\\sin(\\alpha \\pm \\beta) = \\sin \\alpha \\cos \\beta \\pm \\cos \\alpha \\sin \\beta$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">$$\\cos(\\alpha \\pm \\beta) = \\cos \\alpha \\cos \\beta \\mp \\sin \\alpha \\sin \\beta$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-amber-500">$$\\tan(\\alpha \\pm \\beta) = \\frac{\\tan \\alpha \\pm \\tan \\beta}{1 \\mp \\tan \\alpha \\cdot \\tan \\beta}$$</div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формулы двойного угла</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">$$\\sin 2\\alpha = 2\\sin \\alpha \\cos \\alpha$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">$$\\cos 2\\alpha = \\cos^2 \\alpha - \\sin^2 \\alpha = 2\\cos^2 \\alpha - 1 = 1 - 2\\sin^2 \\alpha$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-amber-500">$$\\tan 2\\alpha = \\frac{2\\tan \\alpha}{1 - \\tan^2 \\alpha}$$</div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формулы половинного угла</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">$$\\sin \\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1 - \\cos \\alpha}{2}}$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">$$\\cos \\frac{\\alpha}{2} = \\pm\\sqrt{\\frac{1 + \\cos \\alpha}{2}}$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-amber-500">$$\\tan \\frac{\\alpha}{2} = \\frac{\\sin \\alpha}{1 + \\cos \\alpha} = \\frac{1 - \\cos \\alpha}{\\sin \\alpha}$$</div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сумма и разность</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">$$\\sin \\alpha + \\sin \\beta = 2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">$$\\sin \\alpha - \\sin \\beta = 2\\cos\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-amber-500">$$\\cos \\alpha + \\cos \\beta = 2\\cos\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$$</div>
                    <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-500">$$\\cos \\alpha - \\cos \\beta = -2\\sin\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}$$</div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Простейшие тригонометрические уравнения</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-2">$\\sin x = a$, где $|a| \\leq 1$</p>
                        <p class="text-sm">$x = (-1)^n \\arcsin a + \\pi n,\\quad n \\in \\mathbb{Z}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-2">$\\cos x = a$, где $|a| \\leq 1$</p>
                        <p class="text-sm">$x = \\pm \\arccos a + 2\\pi n,\\quad n \\in \\mathbb{Z}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-2">$\\tan x = a$</p>
                        <p class="text-sm">$x = \\arctan a + \\pi n,\\quad n \\in \\mathbb{Z}$</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
