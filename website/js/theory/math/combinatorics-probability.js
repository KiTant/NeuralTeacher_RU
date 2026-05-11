function renderTheoryCombinatoricsProbability(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Комбинаторика и теория вероятностей</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Комбинаторика</h3>
                <p><b>Комбинаторика</b> — раздел математики, изучающий способы подсчёта количества различных комбинаций.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Правило умножения</h3>
                <p>Если элемент $A$ можно выбрать $m$ способами, а после каждого такого выбора элемент $B$ — $n$ способами, то пару $(A, B)$ можно выбрать $m \\cdot n$ способами.</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>Пример: 3 вида супа и 4 вида второго блюда → $3 \\cdot 4 = 12$ вариантов обеда.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Правило сложения</h3>
                <p>Если элемент $A$ можно выбрать $m$ способами, а элемент $B$ — $n$ способами (выборы несовместны), то выбрать $A$ или $B$ можно $m + n$ способами.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Перестановки</h3>
                <p><b>Перестановка</b> — упорядоченное расположение $n$ различных элементов.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$P_n = n! = 1 \\cdot 2 \\cdot 3 \\cdot \\ldots \\cdot n$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>$P_3 = 3! = 6$ — три объекта можно расставить 6 способами.</p>
                    <p class="text-sm text-slate-400">$0! = 1$ по определению.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Размещения</h3>
                <p><b>Размещение</b> — упорядоченный набор из $k$ элементов, выбранных из $n$ различных элементов ($k \\leq n$).</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$A_n^k = \\frac{n!}{(n - k)!}$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Сколькими способами выбрать старосту и заместителя из 20 человек?</p>
                    <p>$A_{20}^2 = \\dfrac{20!}{18!} = 20 \\cdot 19 = 380$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сочетания</h3>
                <p><b>Сочетание</b> — неупорядоченный набор из $k$ элементов, выбранных из $n$ различных элементов ($k \\leq n$).</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$C_n^k = \\frac{n!}{k!(n - k)!}$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Сколькими способами выбрать 3 дежурных из 10 учеников?</p>
                    <p>$C_{10}^3 = \\dfrac{10!}{3! \\cdot 7!} = \\dfrac{10 \\cdot 9 \\cdot 8}{1 \\cdot 2 \\cdot 3} = 120$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Свойства сочетаний</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$C_n^k = C_n^{n-k}$ &nbsp; (симметрия)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$C_n^0 = C_n^n = 1$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$C_n^k = C_{n-1}^{k-1} + C_{n-1}^k$ &nbsp; (треугольник Паскаля)</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Теория вероятностей</h3>
                <p><b>Теория вероятностей</b> — раздел математики, изучающий закономерности случайных событий.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Случайный опыт и событие</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Случайный опыт (эксперимент)</b> — действие, результат которого заранее неизвестен.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Событие</b> — возможный исход опыта. Обозначается $A$, $B$, $C$, ...</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Виды событий</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">Достоверное</p>
                        <p class="text-sm">Обязательно произойдёт</p>
                        <p class="text-sm">$P = 1$</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                        <p class="text-red-400 font-bold mb-1">Невозможное</p>
                        <p class="text-sm">Никогда не произойдёт</p>
                        <p class="text-sm">$P = 0$</p>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">
                        <p class="text-blue-400 font-bold mb-1">Случайное</p>
                        <p class="text-sm">Может произойти или нет</p>
                        <p class="text-sm">$0 < P < 1$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Классическое определение вероятности</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    $$P(A) = \\frac{m}{n}$$
                    <p class="text-sm text-slate-400 mt-1">$m$ — число благоприятных исходов, $n$ — общее число равновозможных исходов.</p>
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: вероятность вытащить туза из 36 карт.</p>
                    <p>$m = 4$ (4 туза), $n = 36$</p>
                    <p>$P = \\dfrac{4}{36} = \\dfrac{1}{9}$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Противоположное событие</h3>
                <p>Событие $\\bar{A}$ (не $A$) — противоположное событию $A$.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$P(\\bar{A}) = 1 - P(A)$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Несовместные события</h3>
                <p>События называются <b>несовместными</b>, если они не могут произойти одновременно.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    <p class="text-sm text-slate-400 mb-1">Теорема сложения</p>
                    $$P(A \\cup B) = P(A) + P(B)$$
                    <p class="text-sm text-slate-400 mt-1">Для несовместных событий.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Независимые события</h3>
                <p>События называются <b>независимыми</b>, если наступление одного не влияет на вероятность другого.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p class="text-sm text-slate-400 mb-1">Теорема умножения</p>
                    $$P(A \\cap B) = P(A) \\cdot P(B)$$
                    <p class="text-sm text-slate-400 mt-1">Для независимых событий.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Формула Бернулли</h3>
                <p>Вероятность того, что в $n$ независимых испытаниях событие наступит ровно $k$ раз:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                    $$P_n(k) = C_n^k \\cdot p^k \\cdot (1-p)^{n-k}$$
                    <p class="text-sm text-slate-400 mt-1">$p$ — вероятность события в одном испытании.</p>
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: монету бросают 4 раза. Вероятность ровно 2 орлов?</p>
                    <p>$p = 0{,}5$, $n = 4$, $k = 2$</p>
                    <p>$P_4(2) = C_4^2 \\cdot 0{,}5^2 \\cdot 0{,}5^2 = 6 \\cdot \\dfrac{1}{16} = \\dfrac{3}{8}$</p>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
