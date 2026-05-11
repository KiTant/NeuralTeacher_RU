function renderMath(el) {
    renderMathInElement(el, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ]
    });
}

const data = {
    math: {
        title: 'Математика',
        sidebarIcon: 'fa-square-root-variable',
        theory: [
            { id: 'natural-numbers', name: 'Натуральные числа и десятичные дроби', desc: 'Шкалы, сравнение, арифметика, округление', icon: 'fa-hashtag' },
            { id: 'geometry-basics', name: 'Основы геометрии', desc: 'Углы, площади, линия, плоскость', icon: 'fa-shapes' },
            { id: 'divisibility', name: 'Делимость чисел', desc: 'НОД, НОК, признаки делимости, простые числа', icon: 'fa-divide' },
            { id: 'fractions-proportions', name: 'Дроби, отрицательные числа, пропорции', desc: 'Обыкновенные дроби, модуль, прямая и обратная пропорциональность', icon: 'fa-percent' },
            { id: 'coordinates-logic', name: 'Координаты и основы логики', desc: 'Координатная плоскость, логические операции, таблицы истинности', icon: 'fa-border-all' },
            { id: 'expressions-identities', name: 'Выражения и тождества', desc: 'Преобразования, раскрытие скобок, линейные уравнения', icon: 'fa-equals' },
            { id: 'linear-function', name: 'Линейная функция', desc: 'y = kx + b, график, взаимное расположение прямых', icon: 'fa-chart-line' },
            { id: 'powers-fsu', name: 'Степени и ФСУ', desc: 'Свойства степеней, формулы сокращённого умножения', icon: 'fa-superscript' },
            { id: 'rational-fractions', name: 'Рациональные дроби', desc: 'Сокращение, сложение, умножение, тождественные преобразования', icon: 'fa-divide' },
            { id: 'inequalities', name: 'Неравенства', desc: 'Линейные и квадратные неравенства, метод интервалов', icon: 'fa-not-equal' },
            { id: 'statistics-basics', name: 'Основы статистики', desc: 'Среднее, мода, медиана, дисперсия, диаграммы', icon: 'fa-chart-bar' },
            { id: 'quadratic-function', name: 'Квадратичная функция', desc: 'Парабола, вершина, ось симметрии, построение', icon: 'fa-bezier-curve' },
            { id: 'progressions', name: 'Прогрессии', desc: 'Арифметическая и геометрическая прогрессии, формулы', icon: 'fa-list-ol' },
            { id: 'combinatorics-probability', name: 'Комбинаторика и вероятность', desc: 'Перестановки, сочетания, классическая вероятность, Бернулли', icon: 'fa-dice' },
            { id: 'quad-eq', name: 'Квадратные уравнения', desc: 'Методы решения через дискриминант и Виета', icon: 'fa-superscript' },
            { id: 'trig', name: 'Тригонометрия', desc: 'Круг, синусы, косинусы и тождества', icon: 'fa-wave-square' }
        ],
        tools: [
            { id: 'graph-tool', name: 'График функций', desc: 'Визуализация парабол и прямых', icon: 'fa-chart-area', color: 'text-emerald-400' },
            { id: 'expression-calc', name: 'Калькулятор выражений', desc: 'Вычисление с пошаговым решением', icon: 'fa-calculator', color: 'text-blue-400' },
            { id: 'systems-calc', name: 'Системы уравнений', desc: 'Решение 2×2 и 3×3 методом Крамера', icon: 'fa-superscript', color: 'text-purple-400' }
        ]
    },
    it: {
        title: 'Информатика',
        sidebarIcon: 'fa-code',
        theory: [
            { id: 'algo', name: 'Алгоритмы поиска', desc: 'Бинарный и линейный поиск на Python', icon: 'fa-search' }
        ],
        tools: [
            { id: 'python-shell', name: 'Песочница Python', desc: 'Выполнение кода в браузере', icon: 'fa-terminal', color: 'text-orange-400' }
        ]
    }
};
