function renderTheoryPowersFsu(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Степени и формулы сокращённого умножения</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Степень с натуральным показателем</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$a^n = \\underbrace{a \\cdot a \\cdot \\ldots \\cdot a}_{n \\text{ раз}}$$
                    <p class="text-sm text-slate-400 mt-1">$a$ — основание степени, $n$ — показатель степени ($n \\in \\mathbb{N}$).</p>
                </div>
                <p class="mt-2">$a^1 = a$, &nbsp; $a^2$ — «$a$ в квадрате», &nbsp; $a^3$ — «$a$ в кубе»</p>

                <h3 class="text-xl font-semibold text-white pt-4">Свойства степеней</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">Умножение степеней</p>
                        $$a^m \\cdot a^n = a^{m+n}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Деление степеней</p>
                        $$\\frac{a^m}{a^n} = a^{m-n} \\quad (a \\neq 0)$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Возведение степени в степень</p>
                        $$(a^m)^n = a^{m \\cdot n}$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Степень произведения</p>
                        $$(ab)^n = a^n \\cdot b^n$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                        <p class="text-sm text-slate-400 mb-1">Степень частного</p>
                        $$\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n} \\quad (b \\neq 0)$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Степень с нулевым показателем</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                    $$a^0 = 1 \\quad (a \\neq 0)$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Степень с отрицательным показателем</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-pink-500">
                    $$a^{-n} = \\frac{1}{a^n} \\quad (a \\neq 0)$$
                    <p class="text-sm text-slate-400 mt-1">Пример: $2^{-3} = \\dfrac{1}{2^3} = \\dfrac{1}{8}$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Стандартный вид числа</h3>
                <p>Число записывается в виде $a \\cdot 10^n$, где $1 \\leq |a| < 10$:</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>$3{,}7 \\cdot 10^5 = 370000$</p>
                    <p>$1{,}2 \\cdot 10^{-3} = 0{,}0012$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формулы сокращённого умножения (ФСУ)</h3>
                <div class="space-y-4">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-5 rounded-lg">
                        <p class="text-blue-400 font-bold mb-2">Квадрат суммы</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">
                            $$(a + b)^2 = a^2 + 2ab + b^2$$
                        </div>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-2">Квадрат разности</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-emerald-500">
                            $$(a - b)^2 = a^2 - 2ab + b^2$$
                        </div>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-5 rounded-lg">
                        <p class="text-amber-400 font-bold mb-2">Разность квадратов</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-amber-500">
                            $$a^2 - b^2 = (a - b)(a + b)$$
                        </div>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-5 rounded-lg">
                        <p class="text-purple-400 font-bold mb-2">Куб суммы</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-500">
                            $$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$
                        </div>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-5 rounded-lg">
                        <p class="text-red-400 font-bold mb-2">Куб разности</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-red-500">
                            $$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$$
                        </div>
                    </div>
                    <div class="bg-cyan-500/10 border border-cyan-500/20 p-5 rounded-lg">
                        <p class="text-cyan-400 font-bold mb-2">Сумма кубов</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-cyan-500">
                            $$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$$
                        </div>
                    </div>
                    <div class="bg-pink-500/10 border border-pink-500/20 p-5 rounded-lg">
                        <p class="text-pink-400 font-bold mb-2">Разность кубов</p>
                        <div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-pink-500">
                            $$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$
                        </div>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Применение ФСУ</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Вычисление</p>
                        <p>$43^2 - 57^2 = (43 - 57)(43 + 57) = (-14) \\cdot 100 = -1400$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Разложение на множители</p>
                        <p>$4x^2 - 9 = (2x)^2 - 3^2 = (2x - 3)(2x + 3)$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Сокращение дробей</p>
                        <p>$\\dfrac{x^2 - 25}{x - 5} = \\dfrac{(x - 5)(x + 5)}{x - 5} = x + 5$</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
