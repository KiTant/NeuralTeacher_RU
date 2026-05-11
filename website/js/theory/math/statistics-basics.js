function renderTheoryStatisticsBasics(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Основы статистики</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Что такое статистика</h3>
                <p><b>Статистика</b> — наука о сборе, обработке и анализе данных. Основные этапы: сбор данных, систематизация, анализ, интерпретация.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Генеральная и выборочная совокупность</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Генеральная совокупность</b> — множество всех объектов, о которых нужно получить информацию.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Выборка</b> — часть генеральной совокупности, отобранная для исследования.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Вариационный ряд</h3>
                <p>Упорядоченная последовательность вариант (значений признака).</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>Пример: оценки учеников — 3, 4, 5, 3, 4, 4, 5, 3, 4, 5</p>
                    <p>Вариационный ряд: 3, 3, 3, 4, 4, 4, 4, 5, 5, 5</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Частота и относительная частота</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Частота</b> — сколько раз значение встречается в выборке.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Относительная частота</b> — частота, делённая на объём выборки:</p>
                    </div>
                </div>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500 mt-2">
                    $$w = \\frac{n_i}{N}$$
                    <p class="text-sm text-slate-400 mt-1">$n_i$ — частота варианты, $N$ — объём выборки. Сумма всех относительных частот равна 1.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Среднее арифметическое</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                    $$\\bar{x} = \\frac{x_1 + x_2 + \\ldots + x_n}{n} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Пример: $3, 4, 5, 3, 4, 4, 5, 3, 4, 5$</p>
                    <p>$\\bar{x} = \\dfrac{3 + 4 + 5 + 3 + 4 + 4 + 5 + 3 + 4 + 5}{10} = \\dfrac{40}{10} = 4$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Мода</h3>
                <p><b>Мода</b> ($M_o$) — значение, встречающееся чаще других в выборке.</p>
                <div class="bg-slate-800/30 p-4 rounded-lg">
                    <p>В ряду 3, 3, 3, 4, 4, 4, 4, 5, 5, 5 мода = 4 (встречается 4 раза).</p>
                    <p class="text-sm text-slate-400">Ряд может иметь несколько мод или не иметь моды вовсе.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Медиана</h3>
                <p><b>Медиана</b> ($M_e$) — значение, делящее упорядоченный ряд пополам.</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Нечётное число элементов</b>: медиана — средний элемент.</p>
                        <p>1, 3, <b>5</b>, 7, 9 → $M_e = 5$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p><b>Чётное число элементов</b>: медиана — среднее двух средних.</p>
                        <p>1, 3, <b>5, 7</b>, 9, 11 → $M_e = \\dfrac{5 + 7}{2} = 6$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Размах</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                    $$R = x_{\\max} - x_{\\min}$$
                </div>
                <div class="bg-slate-800/30 p-4 rounded-lg mt-2">
                    <p>Ряд: 3, 3, 3, 4, 4, 4, 4, 5, 5, 5</p>
                    <p>$R = 5 - 3 = 2$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Дисперсия</h3>
                <p>Мера разброса данных относительно среднего:</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    $$D = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$$
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Стандартное отклонение</h3>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-red-500">
                    $$\\sigma = \\sqrt{D}$$
                </div>
                <p class="text-sm text-slate-400 mt-1">Показывает, насколько в среднем значения отклоняются от среднего.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Визуализация данных</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">
                        <p class="text-blue-400 font-bold mb-1">Столбчатая диаграмма</p>
                        <p class="text-sm">Сравнение частот категорий</p>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">Круговая диаграмма</p>
                        <p class="text-sm">Доли каждой категории</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                        <p class="text-amber-400 font-bold mb-1">Гистограмма</p>
                        <p class="text-sm">Распределение по интервалам</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
