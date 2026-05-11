function renderToolExpressionCalc(main) {
    main.innerHTML = `
        <div class="page-fade p-6 overflow-y-auto">
            <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 w-fit text-sm">
                <i class="fas fa-arrow-left"></i> Назад к списку
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Панель ввода -->
                <div class="lg:col-span-2 glass-card rounded-2xl p-6">
                    <h3 class="text-lg font-bold flex items-center gap-2 mb-4">
                        <i class="fas fa-calculator text-blue-400"></i> Калькулятор выражений
                    </h3>

                    <div class="space-y-4">
                        <div>
                            <label class="text-sm text-slate-400 mb-2 block">Введите выражение</label>
                            <div class="flex gap-2">
                                <input id="exprInput" type="text" placeholder="Пример: (2+3)*4 - 10/2 + sqrt(16)" 
                                    class="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    onkeydown="if(event.key==='Enter')exprCalcEvaluate()">
                                <button onclick="exprCalcEvaluate()" class="px-5 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-sm font-medium transition">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Быстрый ввод -->
                        <div class="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <p class="text-xs text-slate-500 mb-2">Быстрый ввод:</p>
                            <div class="flex flex-wrap gap-1.5">
                                <button onclick="exprInsert('(')" class="sym-btn">(</button>
                                <button onclick="exprInsert(')')" class="sym-btn">)</button>
                                <button onclick="exprInsert('+')" class="sym-btn">+</button>
                                <button onclick="exprInsert('-')" class="sym-btn">−</button>
                                <button onclick="exprInsert('*')" class="sym-btn">×</button>
                                <button onclick="exprInsert('/')" class="sym-btn">÷</button>
                                <button onclick="exprInsert('^')" class="sym-btn">x<sup>n</sup></button>
                                <button onclick="exprInsert('sqrt(')" class="sym-btn">√</button>
                                <button onclick="exprInsert('abs(')" class="sym-btn">|x|</button>
                                <button onclick="exprInsert('sin(')" class="sym-btn">sin</button>
                                <button onclick="exprInsert('cos(')" class="sym-btn">cos</button>
                                <button onclick="exprInsert('tan(')" class="sym-btn">tan</button>
                                <button onclick="exprInsert('log(')" class="sym-btn">log</button>
                                <button onclick="exprInsert('ln(')" class="sym-btn">ln</button>
                                <button onclick="exprInsert('pi')" class="sym-btn">π</button>
                                <button onclick="exprInsert('e')" class="sym-btn">e</button>
                            </div>
                        </div>

                        <!-- Результат -->
                        <div id="exprResult" class="hidden">
                            <div class="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                <p class="text-sm text-slate-400 mb-1">Результат</p>
                                <p id="exprResultValue" class="text-2xl font-bold text-white font-mono"></p>
                            </div>
                        </div>

                        <!-- Пошаговое решение -->
                        <div id="exprSteps" class="hidden space-y-2">
                            <p class="text-sm text-slate-400 font-medium">Пошаговое решение</p>
                            <div id="exprStepsContent" class="space-y-2"></div>
                        </div>
                    </div>
                </div>

                <!-- Справка -->
                <div class="glass-card rounded-2xl p-5">
                    <h3 class="text-base font-bold flex items-center gap-2 mb-4">
                        <i class="fas fa-circle-info text-slate-400"></i> Справка
                    </h3>
                    <div class="space-y-3 text-sm text-slate-400">
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Операторы</p>
                            <p><code class="text-emerald-400">+</code> сложение, <code class="text-emerald-400">-</code> вычитание</p>
                            <p><code class="text-emerald-400">*</code> умножение, <code class="text-emerald-400">/</code> деление</p>
                            <p><code class="text-emerald-400">^</code> степень</p>
                        </div>
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Функции</p>
                            <p><code class="text-emerald-400">sqrt(x)</code> — корень</p>
                            <p><code class="text-emerald-400">abs(x)</code> — модуль</p>
                            <p><code class="text-emerald-400">sin cos tan</code></p>
                            <p><code class="text-emerald-400">log(x)</code> — lg, <code class="text-emerald-400">ln(x)</code></p>
                        </div>
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Константы</p>
                            <p><code class="text-emerald-400">pi</code> ≈ 3.14159</p>
                            <p><code class="text-emerald-400">e</code> ≈ 2.71828</p>
                        </div>
                        <div class="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                            <p class="text-emerald-400/70 text-xs leading-relaxed">
                                <b>Примеры:</b><br>
                                2+3*4, (5-2)^3, sqrt(144), sin(pi/4), 2^10, abs(-7)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function exprInsert(sym) {
    const input = document.getElementById('exprInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.slice(0, start) + sym + val.slice(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + sym.length;
}

function exprCalcEvaluate() {
    const input = document.getElementById('exprInput');
    const rawExpr = input.value.trim();
    if (!rawExpr) return;

    const resultDiv = document.getElementById('exprResult');
    const resultValue = document.getElementById('exprResultValue');
    const stepsDiv = document.getElementById('exprSteps');
    const stepsContent = document.getElementById('exprStepsContent');

    try {
        const { value, steps } = exprCalcParseAndEval(rawExpr);
        resultDiv.classList.remove('hidden');
        resultValue.textContent = exprFormatNum(value);

        if (steps.length > 0) {
            stepsDiv.classList.remove('hidden');
            stepsContent.innerHTML = steps.map((s, i) => `
                <div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
                    <span class="text-blue-400 font-bold text-xs mt-0.5 shrink-0">${i + 1}.</span>
                    <div>
                        <p class="text-slate-300 text-sm font-mono">${s.desc}</p>
                        <p class="text-white font-mono">${s.expr}</p>
                    </div>
                </div>
            `).join('');
        } else {
            stepsDiv.classList.add('hidden');
        }
    } catch (err) {
        resultDiv.classList.remove('hidden');
        resultValue.textContent = 'Ошибка: ' + err.message;
        resultValue.classList.add('text-red-400');
        setTimeout(() => resultValue.classList.remove('text-red-400'), 2000);
        stepsDiv.classList.add('hidden');
    }
}

function exprFormatNum(n) {
    if (typeof n !== 'number' || !isFinite(n)) return String(n);
    if (Number.isInteger(n)) return n.toString();
    const rounded = Math.round(n * 1e10) / 1e10;
    if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return Math.round(rounded).toString();
    return rounded.toString();
}

function exprCalcParseAndEval(raw) {
    const steps = [];
    let expr = raw.trim();

    steps.push({ desc: 'Исходное выражение', expr: expr });

    // Step 1: Substitute constants
    const constMap = { 'pi': { val: Math.PI, display: 'π', numDisplay: exprFormatNum(Math.PI) }, 'e': { val: Math.E, display: 'e', numDisplay: exprFormatNum(Math.E) } };
    for (const [k, v] of Object.entries(constMap)) {
        const re = new RegExp('\\b' + k + '\\b', 'g');
        if (re.test(expr)) {
            expr = expr.replace(re, '(' + v.numDisplay + ')');
            steps.push({ desc: 'Подставляем ' + v.display, expr: expr });
        }
    }

    // Step 2: Add implicit multiplication
    let prev = expr;
    expr = expr.replace(/(\d)\(/g, '$1*(');
    expr = expr.replace(/\)\(/g, ')*(');
    expr = expr.replace(/\)(\d)/g, ')*$1');
    expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    if (expr !== prev) {
        steps.push({ desc: 'Добавляем знаки умножения', expr: expr });
    }

    // Step 3: Evaluate functions (innermost first)
    const funcMap = {
        'sqrt': { fn: Math.sqrt, name: '√' },
        'abs': { fn: Math.abs, name: '|' },
        'sin': { fn: Math.sin, name: 'sin' },
        'cos': { fn: Math.cos, name: 'cos' },
        'tan': { fn: Math.tan, name: 'tan' },
        'asin': { fn: Math.asin, name: 'arcsin' },
        'acos': { fn: Math.acos, name: 'arccos' },
        'atan': { fn: Math.atan, name: 'arctan' },
        'log': { fn: Math.log10, name: 'lg' },
        'ln': { fn: Math.log, name: 'ln' },
    };

    // Repeatedly find and evaluate innermost function calls
    let maxIter = 50;
    while (maxIter-- > 0) {
        let found = false;
        for (const [k, v] of Object.entries(funcMap)) {
            // Find innermost: funcName(number)
            const re = new RegExp('\\b' + k + '\\(([^()]+)\\)', 'g');
            let m;
            while ((m = re.exec(expr)) !== null) {
                const inner = m[1];
                try {
                    const innerVal = Function('"use strict"; return (' + inner + ')')();
                    if (typeof innerVal !== 'number' || !isFinite(innerVal)) throw new Error();
                    const result = v.fn(innerVal);
                    const before = expr;
                    expr = expr.replace(m[0], exprFormatNum(result));
                    steps.push({ desc: v.name + '(' + exprFormatNum(innerVal) + ') = ' + exprFormatNum(result), expr: expr });
                    found = true;
                    break;
                } catch (e) { /* skip if inner can't be evaluated yet */ }
            }
            if (found) break;
        }
        if (!found) break;
    }

    // Step 4: Evaluate parentheses (innermost first)
    maxIter = 50;
    while (maxIter-- > 0) {
        const re = /\(([^()]+)\)/;
        const m = re.exec(expr);
        if (!m) break;
        try {
            const innerVal = Function('"use strict"; return (' + m[1] + ')')();
            if (typeof innerVal !== 'number' || !isFinite(innerVal)) throw new Error();
            const before = expr;
            expr = expr.replace(m[0], exprFormatNum(innerVal));
            steps.push({ desc: '(' + m[1] + ') = ' + exprFormatNum(innerVal), expr: expr });
        } catch (e) {
            break;
        }
    }

    // Step 5: Evaluate powers (^ or **)
    if (/\^|\*\*/.test(expr)) {
        maxIter = 20;
        while (maxIter-- > 0) {
            const re = /(-?[\d.]+)\s*(\^|\*\*)\s*(-?[\d.]+)/;
            const m = re.exec(expr);
            if (!m) break;
            const base = parseFloat(m[1]);
            const exp = parseFloat(m[3]);
            const result = Math.pow(base, exp);
            expr = expr.replace(m[0], exprFormatNum(result));
            steps.push({ desc: exprFormatNum(base) + '^' + exprFormatNum(exp) + ' = ' + exprFormatNum(result), expr: expr });
        }
    }

    // Step 6: Evaluate * and /
    if (/[*/]/.test(expr)) {
        maxIter = 20;
        while (maxIter-- > 0) {
            const re = /(-?[\d.]+)\s*([*/])\s*(-?[\d.]+)/;
            const m = re.exec(expr);
            if (!m) break;
            const a = parseFloat(m[1]);
            const b = parseFloat(m[3]);
            const result = m[2] === '*' ? a * b : a / b;
            const opName = m[2] === '*' ? '×' : '÷';
            expr = expr.replace(m[0], exprFormatNum(result));
            steps.push({ desc: exprFormatNum(a) + ' ' + opName + ' ' + exprFormatNum(b) + ' = ' + exprFormatNum(result), expr: expr });
        }
    }

    // Step 7: Evaluate + and - (left to right)
    if (/[+\-]/.test(expr) && !/^[\d.-]+$/.test(expr)) {
        maxIter = 20;
        while (maxIter-- > 0) {
            // Match: number +/- number, but not a leading minus
            const re = /(-?[\d.]+)\s*([+\-])\s*(-?[\d.]+)/;
            const m = re.exec(expr);
            if (!m) break;
            // Don't combine if the result is just a number with no more operators
            const remaining = expr.replace(m[0], '__REPL__');
            if (!/__REPL__/.test(remaining) && !/[+\-*/^]/.test(remaining.replace(/__REPL__/, ''))) break;
            const a = parseFloat(m[1]);
            const b = parseFloat(m[3]);
            const result = m[2] === '+' ? a + b : a - b;
            const opName = m[2] === '+' ? '+' : '−';
            expr = expr.replace(m[0], exprFormatNum(result));
            steps.push({ desc: exprFormatNum(a) + ' ' + opName + ' ' + exprFormatNum(b) + ' = ' + exprFormatNum(result), expr: expr });
        }
    }

    // Final evaluation
    const value = Function('"use strict"; return (' + expr + ')')();
    if (typeof value !== 'number' || !isFinite(value)) {
        throw new Error('Результат не является конечным числом');
    }

    // Only add final step if it's different from last shown
    const lastStepExpr = steps.length > 0 ? steps[steps.length - 1].expr : '';
    if (exprFormatNum(value) !== lastStepExpr) {
        steps.push({ desc: 'Результат', expr: exprFormatNum(value) });
    }

    return { value, steps };
}
