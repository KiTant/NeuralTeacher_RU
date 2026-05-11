function renderTheoryDivisibility(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Делимость чисел: НОД и НОК</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Делители и кратные</h3>
                <p><b>Делитель</b> числа $a$ — число, на которое $a$ делится без остатка.</p>
                <p><b>Кратное</b> числа $a$ — число, которое делится на $a$ без остатка.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>Делители числа 12: $1, 2, 3, 4, 6, 12$</p>
                    <p>Кратные числа 5: $5, 10, 15, 20, 25, \\ldots$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Признаки делимости</h3>
                <div class="space-y-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">На 2</p>
                        <p>Число делится на 2, если его последняя цифра чётная (0, 2, 4, 6, 8).</p>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-1">На 3</p>
                        <p>Число делится на 3, если сумма его цифр делится на 3.</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <p class="text-amber-400 font-bold mb-1">На 4</p>
                        <p>Число делится на 4, если две его последние цифры образуют число, делящееся на 4.</p>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                        <p class="text-purple-400 font-bold mb-1">На 5</p>
                        <p>Число делится на 5, если его последняя цифра 0 или 5.</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <p class="text-red-400 font-bold mb-1">На 9</p>
                        <p>Число делится на 9, если сумма его цифр делится на 9.</p>
                    </div>
                    <div class="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                        <p class="text-cyan-400 font-bold mb-1">На 10</p>
                        <p>Число делится на 10, если оно оканчивается нулём.</p>
                    </div>
                    <div class="bg-pink-500/10 border border-pink-500/20 p-4 rounded-lg">
                        <p class="text-pink-400 font-bold mb-1">На 25</p>
                        <p>Число делится на 25, если две его последние цифры — 00, 25, 50 или 75.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Простые и составные числа</h3>
                <p><b>Простое число</b> — имеет ровно два делителя: 1 и само себя.</p>
                <p><b>Составное число</b> — имеет более двух делителей.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>Простые: $2, 3, 5, 7, 11, 13, 17, 19, 23, 29, \\ldots$</p>
                    <p>Число 1 — ни простое, ни составное.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Разложение на простые множители</h3>
                <p>Любое составное число можно представить в виде произведения простых чисел:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    <p>$60 = 2^2 \\cdot 3 \\cdot 5$</p>
                    <p>$84 = 2^2 \\cdot 3 \\cdot 7$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">НОД — Наибольший общий делитель</h3>
                <p><b>НОД$(a, b)$</b> — наибольшее натуральное число, на которое делятся без остатка и $a$, и $b$.</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Способ 1: Через разложение</p>
                        <p>Разложить оба числа на простые множители и взять произведение общих множителей в наименьших степенях.</p>
                        <p class="mt-2">$60 = 2^2 \\cdot 3 \\cdot 5$, &nbsp; $84 = 2^2 \\cdot 3 \\cdot 7$</p>
                        <p>НОД$(60, 84) = 2^2 \\cdot 3 = 12$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Способ 2: Алгоритм Евклида</p>
                        <p>Большее число делим на меньшее, затем меньшее — на остаток, и так до нулевого остатка:</p>
                        <p class="mt-2">$84 : 60 = 1$ (ост. $24$)</p>
                        <p>$60 : 24 = 2$ (ост. $12$)</p>
                        <p>$24 : 12 = 2$ (ост. $0$)</p>
                        <p>НОД$(60, 84) = 12$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">НОК — Наименьшее общее кратное</h3>
                <p><b>НОК$(a, b)$</b> — наименьшее натуральное число, которое делится без остатка и на $a$, и на $b$.</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Через разложение</p>
                        <p>Взять произведение всех простых множителей в наибольших степенях:</p>
                        <p class="mt-2">$60 = 2^2 \\cdot 3 \\cdot 5$, &nbsp; $84 = 2^2 \\cdot 3 \\cdot 7$</p>
                        <p>НОК$(60, 84) = 2^2 \\cdot 3 \\cdot 5 \\cdot 7 = 420$</p>
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Связь НОД и НОК</p>
                        $$\\text{НОК}(a, b) = \\frac{a \\cdot b}{\\text{НОД}(a, b)}$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Взаимно простые числа</h3>
                <p>Числа называются <b>взаимно простыми</b>, если их НОД равен 1.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    <p>НОД$(8, 15) = 1$ — числа взаимно простые</p>
                    <p>НОК взаимно простых чисел: НОК$(a, b) = a \\cdot b$</p>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
