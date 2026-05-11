function renderTheoryQuadEq(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Квадратные уравнения</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Определение</h3>
                <p>Уравнение вида $ax^2 + bx + c = 0$ называется <b>квадратным</b>, где $a \\neq 0$, $b$ и $c$ — любые действительные числа.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>$a$ — старший коэффициент (при $x^2$)</li>
                    <li>$b$ — средний коэффициент (при $x$)</li>
                    <li>$c$ — свободный член</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">Дискриминант</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">$$D = b^2 - 4ac$$</div>
                <p>Дискриминант определяет количество и характер корней:</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">$D > 0$</p>
                        <p class="text-sm">Два различных действительных корня</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                        <p class="text-amber-400 font-bold mb-1">$D = 0$</p>
                        <p class="text-sm">Один действительный корень (кратности 2)</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                        <p class="text-red-400 font-bold mb-1">$D < 0$</p>
                        <p class="text-sm">Действительных корней нет</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формула корней</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">$$x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$$</div>
                <p>При $D = 0$: $x = -\\dfrac{b}{2a}$</p>

                <h3 class="text-xl font-semibold text-white pt-4">Теорема Виета</h3>
                <p>Если $x_1$ и $x_2$ — корни квадратного уравнения $ax^2 + bx + c = 0$, то:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    $$x_1 + x_2 = -\\frac{b}{a} \\qquad x_1 \\cdot x_2 = \\frac{c}{a}$$
                </div>
                <p class="text-sm text-slate-400">Обратная теорема: если числа $p$ и $q$ удовлетворяют $p + q = -\\frac{b}{a}$ и $p \\cdot q = \\frac{c}{a}$, то они являются корнями уравнения.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Неполные квадратные уравнения</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">$ax^2 + bx = 0 \\;(c=0)$</p>
                        <p>$x(ax + b) = 0 \\Rightarrow x_1 = 0,\\; x_2 = -\\dfrac{b}{a}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">$ax^2 + c = 0 \\;(b=0)$</p>
                        <p>$x^2 = -\\dfrac{c}{a} \\Rightarrow$ корни есть, если $-\\dfrac{c}{a} \\geq 0$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">$ax^2 = 0 \\;(b=c=0)$</p>
                        <p>$x = 0$ — единственный корень</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Свойства коэффициентов</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">1.</span>
                        <p>Если $a + b + c = 0$, то $x_1 = 1,\\; x_2 = \\frac{c}{a}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">2.</span>
                        <p>Если $a - b + c = 0$, то $x_1 = -1,\\; x_2 = -\\frac{c}{a}$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Разложение на множители</h3>
                <p>Если $x_1$ и $x_2$ — корни, то:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">$$ax^2 + bx + c = a(x - x_1)(x - x_2)$$</div>
            </div>
        </div>
    `;
    renderMath(main);
}
