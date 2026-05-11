function renderTheoryNaturalNumbers(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Натуральные числа, шкалы, десятичные дроби</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Натуральные числа</h3>
                <p>Числа, используемые для счёта предметов: $1, 2, 3, \\ldots$ — называются <b>натуральными</b>. Множество натуральных чисел обозначается $\\mathbb{N}$.</p>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>Наименьшее натуральное число — $1$</li>
                    <li>Наибольшего натурального числа не существует</li>
                    <li>Для любого натурального числа $n$ существует следующее за ним число $n + 1$</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">Сравнение натуральных чисел</h3>
                <p>Из двух натуральных чисел меньше то, которое при счёте называется раньше. На координатном луче меньшее число расположено левее.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>$a < b$ — число $a$ меньше числа $b$</p>
                    <p>$a > b$ — число $a$ больше числа $b$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Арифметические действия</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <p class="text-blue-400 font-bold mb-1">Сложение</p>
                        <p>$a + b = c$</p>
                        <p class="text-sm text-slate-400">Переместительное: $a + b = b + a$</p>
                        <p class="text-sm text-slate-400">Сочетательное: $(a + b) + c = a + (b + c)$</p>
                    </div>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <p class="text-emerald-400 font-bold mb-1">Умножение</p>
                        <p>$a \\cdot b = c$</p>
                        <p class="text-sm text-slate-400">Переместительное: $a \\cdot b = b \\cdot a$</p>
                        <p class="text-sm text-slate-400">Сочетательное: $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                        <p class="text-amber-400 font-bold mb-1">Вычитание</p>
                        <p>$a - b = c$, где $a > b$</p>
                        <p class="text-sm text-slate-400">$a - b = c \\Leftrightarrow c + b = a$</p>
                    </div>
                    <div class="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                        <p class="text-purple-400 font-bold mb-1">Деление</p>
                        <p>$a : b = c$</p>
                        <p class="text-sm text-slate-400">$a : b = c \\Leftrightarrow c \\cdot b = a$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Порядок действий</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">1.</span>
                        <p>Действия в скобках</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">2.</span>
                        <p>Умножение и деление (слева направо)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                        <span class="text-blue-400 font-bold shrink-0">3.</span>
                        <p>Сложение и вычитание (слева направо)</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Шкалы и координатный луч</h3>
                <p><b>Шкала</b> — это линия с делениями, каждому из которых соответствует определённое число (значение величины).</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p class="font-medium text-white mb-1">Координатный луч</p>
                        <p>Луч с началом отсчёта в точке $O$, на котором отмечены единичные отрезки. Каждой точке луча соответствует натуральное число — её <b>координата</b>.</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p class="font-medium text-white mb-1">Виды шкал</p>
                        <p class="text-sm">Линейка, термометр, спидометр, часы — примеры шкал. Цена деления — разность значений между соседними отметками.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Десятичные дроби</h3>
                <p>Десятичная дробь — это дробь, знаменатель которой равен степени числа 10: $10, 100, 1000, \\ldots$</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>$\\dfrac{3}{10} = 0{,}3$; &nbsp; $\\dfrac{27}{100} = 0{,}27$; &nbsp; $\\dfrac{1543}{1000} = 1{,}543$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Сравнение десятичных дробей</h3>
                <ul class="list-disc list-inside space-y-1 pl-2">
                    <li>Из двух десятичных дробей больше та, у которой целая часть больше</li>
                    <li>Если целые части равны, сравниваем поразрядно слева направо</li>
                    <li>К дроби можно приписывать нули справа: $0{,}5 = 0{,}50 = 0{,}500$</li>
                </ul>

                <h3 class="text-xl font-semibold text-white pt-4">Сложение и вычитание десятичных дробей</h3>
                <p>Дроби записывают «столбиком» так, чтобы запятая стояла под запятой, и выполняют поразрядное сложение/вычитание.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Сложение</p>
                        <p>$3{,}7 + 2{,}65 = 6{,}35$</p>
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Вычитание</p>
                        <p>$5{,}2 - 1{,}38 = 3{,}82$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Умножение десятичных дробей</h3>
                <p>Умножаем как натуральные числа, затем в результате отделяем запятой столько цифр справа, сколько их после запятой в обоих множителях вместе.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>$0{,}3 \\times 0{,}2 = 0{,}06$ &nbsp; (1 + 1 = 2 знака после запятой)</p>
                    <p>$1{,}25 \\times 0{,}4 = 0{,}500 = 0{,}5$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Деление десятичных дробей</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Деление на натуральное число</p>
                        <p>$7{,}2 : 3 = 2{,}4$</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Деление на десятичную дробь</p>
                        <p>Переносим запятую в делимом и делителе так, чтобы делитель стал натуральным числом:</p>
                        <p>$2{,}46 : 0{,}6 = 24{,}6 : 6 = 4{,}1$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Округление</h3>
                <p>Если первая отбрасываемая цифра $\\geq 5$, последнюю сохраняемую увеличиваем на 1; иначе оставляем без изменения.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p>$3{,}728 \\approx 3{,}73$ (до сотых)</p>
                    <p>$3{,}728 \\approx 3{,}7$ (до десятых)</p>
                    <p>$3{,}728 \\approx 4$ (до целых)</p>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
