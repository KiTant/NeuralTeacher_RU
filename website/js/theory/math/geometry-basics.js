function renderTheoryGeometryBasics(main) {
    const backBtn = `
        <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors">
            <i class="fas fa-arrow-left"></i> Назад к списку
        </button>`;

    main.innerHTML = `
        <div class="page-fade p-8 overflow-y-auto">
            ${backBtn}
            <h2 class="text-3xl font-bold mb-6 text-white">Основы геометрии: углы, площади, линия и плоскость</h2>

            <div class="glass-card p-8 rounded-2xl space-y-6 text-slate-300 leading-relaxed">
                <h3 class="text-xl font-semibold text-white">Линия и плоскость</h3>
                <div class="space-y-3">
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Точка</p>
                        <p>Самый простой объект геометрии. Не имеет размеров. Обозначается заглавными буквами: $A$, $B$, $C$.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Прямая (линия)</p>
                        <p>Линия без начала и конца, бесконечная в обе стороны. Обозначается $a$, $b$, $c$ или $AB$ (через две точки). Через любые две точки можно провести единственную прямую.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Луч</p>
                        <p>Часть прямой, имеющая начало, но не имеющая конца. Обозначается $OA$, где $O$ — начало луча.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Отрезок</p>
                        <p>Часть прямой, ограниченная двумя точками. Имеет длину. Обозначается $AB$. Длина отрезка — расстояние между его концами.</p>
                    </div>
                    <div class="bg-slate-800/30 p-4 rounded-lg">
                        <p class="font-medium text-white mb-1">Плоскость</p>
                        <p>Поверхность, не имеющая краёв. Бесконечна во всех направлениях. Через любые три точки, не лежащие на одной прямой, проходит единственная плоскость.</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Угол</h3>
                <p><b>Угол</b> — фигура, образованная двумя лучами с общим началом. Лучи называются <b>сторонами</b> угла, общее начало — <b>вершиной</b>.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p>Угол обозначается: $\\angle AOB$, где $O$ — вершина, $OA$ и $OB$ — стороны.</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Виды углов</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">
                        <p class="text-emerald-400 font-bold mb-1">Острый</p>
                        <p>$0° < \\alpha < 90°$</p>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">
                        <p class="text-blue-400 font-bold mb-1">Прямой</p>
                        <p>$\\alpha = 90°$</p>
                    </div>
                    <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">
                        <p class="text-amber-400 font-bold mb-1">Тупой</p>
                        <p>$90° < \\alpha < 180°$</p>
                    </div>
                    <div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center">
                        <p class="text-red-400 font-bold mb-1">Развёрнутый</p>
                        <p>$\\alpha = 180°$</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Измерение углов</h3>
                <p>Углы измеряются в <b>градусах</b>. Разделить развёрнутый угол на 180 равных углов — получить угол в $1°$.</p>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>$1° = 60'$ (минут), &nbsp; $1' = 60''$ (секунд)</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>Смежные углы: $\\alpha + \\beta = 180°$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p>Вертикальные углы равны</p>
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Биссектриса угла</h3>
                <p><b>Биссектриса</b> — луч, исходящий из вершины угла и делящий его на два равных угла.</p>
                <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                    <p>Если $OC$ — биссектриса $\\angle AOB$, то $\\angle AOC = \\angle COB = \\dfrac{\\angle AOB}{2}$</p>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Периметр и площадь прямоугольника</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">Периметр</p>
                        $$P = 2(a + b)$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Площадь</p>
                        $$S = a \\cdot b$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Квадрат</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p class="text-sm text-slate-400 mb-1">Периметр</p>
                        $$P = 4a$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-500">
                        <p class="text-sm text-slate-400 mb-1">Площадь</p>
                        $$S = a^2$$
                    </div>
                </div>

                <h3 class="text-xl font-semibold text-white pt-4">Треугольник</h3>
                <p><b>Треугольник</b> — фигура, образованная тремя точками, не лежащими на одной прямой, и тремя отрезками, попарно соединяющими эти точки.</p>
                <div class="space-y-3">
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p class="text-sm text-slate-400 mb-1">Периметр</p>
                        $$P = a + b + c$$
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p class="text-sm text-slate-400 mb-1">Площадь (основная формула)</p>
                        $$S = \\frac{1}{2} a \\cdot h$$
                        <p class="text-sm text-slate-400">где $a$ — основание, $h$ — высота</p>
                    </div>
                </div>
                <p class="text-sm text-slate-400 mt-2">Сумма углов треугольника равна $180°$.</p>

                <h3 class="text-xl font-semibold text-white pt-4">Единицы измерения</h3>
                <div class="space-y-2">
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p class="font-medium text-white mb-1">Длина</p>
                        <p>$1 \\text{ км} = 1000 \\text{ м}$, &nbsp; $1 \\text{ м} = 100 \\text{ см} = 1000 \\text{ мм}$</p>
                    </div>
                    <div class="bg-slate-800/30 p-3 rounded-lg">
                        <p class="font-medium text-white mb-1">Площадь</p>
                        <p>$1 \\text{ км}^2 = 100 \\text{ га} = 10^6 \\text{ м}^2$</p>
                        <p>$1 \\text{ га} = 100 \\text{ а} = 10^4 \\text{ м}^2$</p>
                        <p>$1 \\text{ а (сотка)} = 100 \\text{ м}^2$</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    renderMath(main);
}
