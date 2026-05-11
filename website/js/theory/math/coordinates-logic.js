function renderTheoryCoordinatesLogic(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Координаты на плоскости и основы логики</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Координатная прямая</h3>
                <p><b>Координатная прямая</b> — прямая с выбранным на ней началом отсчёта, единичным отрезком и направлением.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>Каждой точке координатной прямой соответствует единственное число — её <b>координата</b>.</p>
                    <p>Точка $A(3)$ расположена правее нуля, точка $B(-2)$ — левее.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Координатная плоскость</h3>
                <p>Две взаимно перпендикулярные координатные прямые с общим началом отсчёта образуют <b>координатную плоскость</b>.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li><b>Ось абсцисс</b> $Ox$ — горизонтальная ось</li>
                    <li><b>Ось ординат</b> $Oy$ — вертикальная ось</li>
                    <li><b>Начало координат</b> $O(0; 0)$ — точка пересечения осей</li>
                </ul>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    <p>Положение точки задаётся парой чисел $(x; y)$:</p>
                    <p>$A(2; 3)$ — 2 единицы вправо от $O$, 3 единицы вверх</p>
                    <p>$B(-1; -4)$ — 1 единица влево, 4 единицы вниз</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Координатные четверти</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
                        <p class="text-emerald-400 font-bold">I четверть</p>
                        <p>$x > 0,\\; y > 0$</p>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                        <p class="text-blue-400 font-bold">II четверть</p>
                        <p>$x < 0,\\; y > 0$</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <p class="text-red-400 font-bold">III четверть</p>
                        <p>$x < 0,\\; y < 0$</p>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg">
                        <p class="text-purple-400 font-bold">IV четверть</p>
                        <p>$x > 0,\\; y < 0$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Расстояние между точками</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    <p class="text-sm text-slate-400 mb-1">На координатной прямой</p>
                    $$|AB| = |x_A - x_B|$$
                </div>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500 mt-3">
                    <p class="text-sm text-slate-400 mb-1">На координатной плоскости</p>
                    $$|AB| = \\sqrt{(x_A - x_B)^2 + (y_A - y_B)^2}$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Основы логики</h3>
                <p>Логика — наука о формах и законах мышления. В математике используются <b>высказывания</b> — предложения, о которых можно сказать, истинны они или ложны.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Логические операции</h3>
                <div class="space-y-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">Отрицание (инверсия)</p>
                        <p>Если $A$ истинно, то $\\neg A$ ложно, и наоборот.</p>
                        <p class="text-sm text-slate-400 mt-1">«Не $A$», «Неверно, что $A$»</p>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-1">Конъюнкция (логическое И)</p>
                        <p>$A \\wedge B$ истинно только тогда, когда истинны оба $A$ и $B$.</p>
                        <p class="text-sm text-slate-400 mt-1">«$A$ и $B$»</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <p class="text-amber-400 font-bold mb-1">Дизъюнкция (логическое ИЛИ)</p>
                        <p>$A \\vee B$ ложно только тогда, когда ложны оба $A$ и $B$.</p>
                        <p class="text-sm text-slate-400 mt-1">«$A$ или $B$»</p>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                        <p class="text-purple-400 font-bold mb-1">Импликация</p>
                        <p>$A \\Rightarrow B$ ложно только когда $A$ истинно, а $B$ ложно.</p>
                        <p class="text-sm text-slate-400 mt-1">«Если $A$, то $B$»</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Таблица истинности</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse bg-slate-800/30 rounded-lg overflow-hidden">
                        <thead>
                            <tr class="bg-slate-700/50">
                                <th class="p-3 text-center text-slate-300">$A$</th>
                                <th class="p-3 text-center text-slate-300">$B$</th>
                                <th class="p-3 text-center text-slate-300">$\\neg A$</th>
                                <th class="p-3 text-center text-slate-300">$A \\wedge B$</th>
                                <th class="p-3 text-center text-slate-300">$A \\vee B$</th>
                                <th class="p-3 text-center text-slate-300">$A \\Rightarrow B$</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">И</td>
                                <td class="p-3 text-center">Л</td><td class="p-3 text-center">И</td>
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">И</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">Л</td>
                                <td class="p-3 text-center">Л</td><td class="p-3 text-center">Л</td>
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">Л</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 text-center">Л</td><td class="p-3 text-center">И</td>
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">Л</td>
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">И</td>
                            </tr>
                            <tr class="hover:bg-slate-700/20">
                                <td class="p-3 text-center">Л</td><td class="p-3 text-center">Л</td>
                                <td class="p-3 text-center">И</td><td class="p-3 text-center">Л</td>
                                <td class="p-3 text-center">Л</td><td class="p-3 text-center">И</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Необходимое и достаточное условия</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Необходимое условие</b>: если $A \\Rightarrow B$, то $B$ необходимо для $A$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Достаточное условие</b>: если $A \\Rightarrow B$, то $A$ достаточно для $B$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Необходимое и достаточное</b> ($A \\Leftrightarrow B$): $A$ выполняется тогда и только тогда, когда выполняется $B$.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
