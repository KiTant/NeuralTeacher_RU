function renderToolSystemsCalc(main) {
    main.innerHTML = `
        <div class="page-fade p-6 overflow-y-auto">
            <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 w-fit text-sm">
                <i class="fas fa-arrow-left"></i> Назад к списку
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Панель ввода -->
                <div class="lg:col-span-2 glass-card rounded-2xl p-6">
                    <h3 class="text-lg font-bold flex items-center gap-2 mb-4">
                        <i class="fas fa-superscript text-purple-400"></i> Решатель систем уравнений
                    </h3>

                    <!-- Переключатель размерности -->
                    <div class="flex gap-2 mb-4">
                        <button id="sysBtn2x2" onclick="sysSetSize(2)" class="px-4 py-2 rounded-xl text-sm font-medium transition border">2×2</button>
                        <button id="sysBtn3x3" onclick="sysSetSize(3)" class="px-4 py-2 rounded-xl text-sm font-medium transition border">3×3</button>
                    </div>

                    <!-- Ввод системы -->
                    <div id="sysInputArea" class="space-y-3 mb-4"></div>

                    <!-- Метод решения -->
                    <div class="mb-4">
                        <label class="text-sm text-slate-400 mb-2 block">Метод решения</label>
                        <div class="flex gap-2 flex-wrap">
                            <button id="sysMethodCramer" onclick="sysSetMethod('cramer')" class="px-4 py-2 rounded-xl text-sm font-medium transition border">Крамер</button>
                            <button id="sysMethodSub" onclick="sysSetMethod('substitution')" class="px-4 py-2 rounded-xl text-sm font-medium transition border">Подстановка</button>
                            <button id="sysMethodGauss" onclick="sysSetMethod('gauss')" class="px-4 py-2 rounded-xl text-sm font-medium transition border">Гаусс</button>
                        </div>
                    </div>

                    <button onclick="sysSolve()" class="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 text-sm font-medium transition flex items-center justify-center gap-2">
                        <i class="fas fa-play"></i> Решить
                    </button>

                    <!-- Результат -->
                    <div id="sysResult" class="hidden mt-4 space-y-3"></div>
                </div>

                <!-- Справка -->
                <div class="glass-card rounded-2xl p-5">
                    <h3 class="text-base font-bold flex items-center gap-2 mb-4">
                        <i class="fas fa-circle-info text-slate-400"></i> Справка
                    </h3>
                    <div class="space-y-3 text-sm text-slate-400">
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Формат ввода</p>
                            <p>Пишите уравнения в свободной форме:</p>
                            <p class="font-mono text-slate-300 mt-1">2x + 3y = 5</p>
                            <p class="font-mono text-slate-300">x - y = 1</p>
                            <p class="text-xs mt-1">Поддерживаются: x, y, z, числа, +, -, пробелы</p>
                        </div>
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Методы</p>
                            <p><span class="text-purple-400">Крамер</span> — через определители</p>
                            <p><span class="text-purple-400">Подстановка</span> — выражение одной переменной через другую</p>
                            <p><span class="text-purple-400">Гаусс</span> — приведение к треугольному виду</p>
                        </div>
                        <div class="bg-slate-800/30 p-3 rounded-lg">
                            <p class="text-white font-medium mb-1">Случаи</p>
                            <p><span class="text-emerald-400">Δ ≠ 0</span> — единственное решение</p>
                            <p><span class="text-amber-400">Δ = 0, Δx ≠ 0</span> — нет решений</p>
                            <p><span class="text-blue-400">Δ = Δx = Δy = 0</span> — бесконечно много</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    sysSetSize(2);
    sysSetMethod('cramer');
}

let sysSize = 2;
let sysMethod = 'cramer';

function sysSetSize(n) {
    sysSize = n;
    const btn2 = document.getElementById('sysBtn2x2');
    const btn3 = document.getElementById('sysBtn3x3');
    btn2.className = n === 2
        ? 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-purple-600/20 border-purple-500/30 text-purple-400'
        : 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/30';
    btn3.className = n === 3
        ? 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-purple-600/20 border-purple-500/30 text-purple-400'
        : 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/30';

    const area = document.getElementById('sysInputArea');
    const defaults2 = ['2x + 3y = 5', 'x - y = 1'];
    const defaults3 = ['2x + y - z = 3', 'x - y + 2z = 1', '3x + 2y + z = 7'];
    const defaults = n === 2 ? defaults2 : defaults3;
    let html = '';
    for (let i = 0; i < n; i++) {
        html += `<div class="flex items-center gap-2">`;
        html += `<span class="text-slate-500 text-xs shrink-0">${i+1}.</span>`;
        html += `<input id="sys_eq${i}" type="text" value="${defaults[i]}" class="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-purple-500">`;
        html += `</div>`;
    }
    area.innerHTML = html;
}

function sysSetMethod(m) {
    sysMethod = m;
    const btns = { cramer: 'sysMethodCramer', substitution: 'sysMethodSub', gauss: 'sysMethodGauss' };
    for (const [k, id] of Object.entries(btns)) {
        const el = document.getElementById(id);
        el.className = k === m
            ? 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-purple-600/20 border-purple-500/30 text-purple-400'
            : 'px-4 py-2 rounded-xl text-sm font-medium transition border bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/30';
    }
}

// Parse equation text like "2x + 3y = 5" or "-x - y = 0" into coefficients
function sysParseEquation(text, varNames) {
    // Normalize: remove spaces around =, ensure spaces around + and -
    let eq = text.replace(/\s+/g, ' ').trim();
    const parts = eq.split('=');
    if (parts.length !== 2) throw new Error('Уравнение должно содержать ровно один знак "="');

    const left = parts[0].trim();
    const right = parts[1].trim();

    // Parse a side into { varName: coefficient }
    function parseSide(s) {
        const coeffs = {};
        varNames.forEach(v => coeffs[v] = 0);

        // Add + at start if not negative
        if (s[0] !== '-') s = '+ ' + s;
        // Normalize: ensure spaces around + and -
        s = s.replace(/([+-])/g, ' $1 ').replace(/\s+/g, ' ').trim();

        // Split into terms by + or -
        const terms = [];
        let current = '';
        for (let i = 0; i < s.length; i++) {
            if ((s[i] === '+' || s[i] === '-') && i > 0 && s[i-1] === ' ') {
                if (current.trim()) terms.push(current.trim());
                current = s[i];
            } else {
                current += s[i];
            }
        }
        if (current.trim()) terms.push(current.trim());

        let freeTerm = 0;
        for (const term of terms) {
            let t = term.trim().replace(/\s+/g, '');
            if (!t) continue;

            // Check if term contains a variable
            let matched = false;
            for (const v of varNames) {
                if (t.includes(v)) {
                    let coefStr = t.replace(v, '');
                    if (coefStr === '' || coefStr === '+') coefStr = '1';
                    else if (coefStr === '-') coefStr = '-1';
                    const coef = parseFloat(coefStr);
                    if (isNaN(coef)) throw new Error('Не удалось разобрать: ' + term);
                    coeffs[v] += coef;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                const val = parseFloat(t);
                if (isNaN(val)) throw new Error('Не удалось разобрать: ' + term);
                freeTerm += val;
            }
        }
        return { coeffs, freeTerm };
    }

    const leftParsed = parseSide(left);
    const rightParsed = parseSide(right);

    // Move everything to left side: left - right = 0
    const result = {};
    for (const v of varNames) {
        result[v] = leftParsed.coeffs[v] - rightParsed.coeffs[v];
    }
    const b = -(leftParsed.freeTerm - rightParsed.freeTerm);

    return { coeffs: result, b };
}

function sysParseAll() {
    const varNames = sysSize === 2 ? ['x', 'y'] : ['x', 'y', 'z'];
    const equations = [];
    for (let i = 0; i < sysSize; i++) {
        const text = document.getElementById(`sys_eq${i}`).value;
        const parsed = sysParseEquation(text, varNames);
        equations.push(parsed);
    }

    // Build matrix
    const mat = equations.map(eq => varNames.map(v => eq.coeffs[v]));
    const b = equations.map(eq => eq.b);
    return { mat, b, varNames, equations };
}

function sysDet(m) {
    const n = m.length;
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    if (n === 3) {
        return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])
             - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])
             + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
    }
    return 0;
}

function sysReplaceCol(mat, b, col) {
    const m = mat.map(row => [...row]);
    for (let i = 0; i < m.length; i++) m[i][col] = b[i];
    return m;
}

function sysFormatNum(n) {
    if (Number.isInteger(n)) return n.toString();
    const r = Math.round(n * 1e10) / 1e10;
    if (Math.abs(r - Math.round(r)) < 1e-9) return Math.round(r).toString();
    return r.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
}

function sysFormatEq(coeffs, varNames, b) {
    let eq = '';
    let first = true;
    for (const v of varNames) {
        const c = coeffs[v];
        if (c === 0) continue;
        if (first) {
            eq += c < 0 ? '−' : '';
            const abs = Math.abs(c);
            if (abs !== 1) eq += sysFormatNum(abs);
            eq += v;
            first = false;
        } else {
            eq += c > 0 ? ' + ' : ' − ';
            const abs = Math.abs(c);
            if (abs !== 1) eq += sysFormatNum(abs);
            eq += v;
        }
    }
    if (first) eq = '0';
    eq += ' = ' + sysFormatNum(b);
    return eq;
}

function sysStepHtml(desc, expr) {
    return `<div class="bg-slate-800/30 p-3 rounded-lg flex items-start gap-3">
        <span class="text-purple-400 font-bold text-xs mt-0.5 shrink-0">▸</span>
        <div><p class="text-slate-300 text-sm">${desc}</p><p class="text-white font-mono text-sm">${expr}</p></div>
    </div>`;
}

function sysSolveCramer(mat, b, varNames) {
    let html = '';
    const delta = sysDet(mat);

    html += sysStepHtml('Вычисляем определитель системы Δ', 'Δ = ' + sysFormatNum(delta));

    if (Math.abs(delta) < 1e-10) {
        let allZero = true;
        for (let j = 0; j < sysSize; j++) {
            if (Math.abs(sysDet(sysReplaceCol(mat, b, j))) > 1e-10) allZero = false;
        }
        if (allZero) {
            html += `<div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">`;
            html += `<p class="text-blue-400 font-bold">Бесконечно много решений</p>`;
            html += `<p class="text-sm text-slate-400">Δ = 0, все дополнительные определители равны 0 — система неопределённая</p>`;
            html += `</div>`;
        } else {
            html += `<div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center">`;
            html += `<p class="text-amber-400 font-bold">Решений нет</p>`;
            html += `<p class="text-sm text-slate-400">Δ = 0, но не все дополнительные определители равны 0 — система несовместна</p>`;
            html += `</div>`;
        }
        return { html, solution: null };
    }

    const solution = [];
    for (let j = 0; j < sysSize; j++) {
        const dj = sysDet(sysReplaceCol(mat, b, j));
        const val = dj / delta;
        solution.push(val);
        html += sysStepHtml(`Δ<sub>${varNames[j]}</sub> = ${sysFormatNum(dj)}`,
            `${varNames[j]} = Δ<sub>${varNames[j]}</sub> / Δ = ${sysFormatNum(dj)} / ${sysFormatNum(delta)} = <b class="text-emerald-400">${sysFormatNum(val)}</b>`);
    }

    html += `<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">`;
    html += `<p class="text-emerald-400 font-bold text-lg mb-1">Ответ</p>`;
    html += `<p class="text-white font-mono">(${solution.map((v, i) => varNames[i] + ' = ' + sysFormatNum(v)).join(', ')})</p>`;
    html += `</div>`;

    return { html, solution };
}

function sysSolveSubstitution(mat, b, varNames) {
    let html = '';
    const n = varNames.length;

    if (n === 2) {
        const [a1, b1] = mat[0];
        const [a2, b2] = mat[1];
        const [c1, c2] = b;

        // From eq1: a1*x + b1*y = c1
        // Express x from eq1 (or y, depending on which coefficient is non-zero)
        if (Math.abs(a1) < 1e-10 && Math.abs(b1) < 1e-10) {
            html += `<div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center"><p class="text-amber-400 font-bold">Первое уравнение вырождено</p></div>`;
            return { html, solution: null };
        }

        let exprVar, exprIdx, exprCoef, otherVar, otherIdx, otherCoef;
        if (Math.abs(a1) >= Math.abs(b1)) {
            exprVar = 'x'; exprIdx = 0; exprCoef = a1;
            otherVar = 'y'; otherIdx = 1; otherCoef = b1;
        } else {
            exprVar = 'y'; exprIdx = 1; exprCoef = b1;
            otherVar = 'x'; otherIdx = 0; otherCoef = a1;
        }

        // exprVar = (c1 - otherCoef * otherVar) / exprCoef
        html += sysStepHtml(`Выражаем ${exprVar} из первого уравнения`,
            `${exprVar} = (${sysFormatNum(c1)} − ${sysFormatNum(otherCoef)}·${otherVar}) / ${sysFormatNum(exprCoef)}`);

        const exprConstPart = c1 / exprCoef;
        const exprOtherCoef = -otherCoef / exprCoef;
        html += sysStepHtml(`Упрощаем`,
            `${exprVar} = ${sysFormatNum(exprConstPart)} ${exprOtherCoef >= 0 ? '+' : '−'} ${sysFormatNum(Math.abs(exprOtherCoef))}·${otherVar}`);

        // Substitute into eq2: a2*x + b2*y = c2
        // If exprVar is x: a2*(exprConstPart + exprOtherCoef*y) + b2*y = c2
        // If exprVar is y: b2*(exprConstPart + exprOtherCoef*x) + a2*x = c2
        const subCoef = mat[1][exprIdx]; // coefficient of exprVar in eq2
        const otherCoefEq2 = mat[1][otherIdx]; // coefficient of otherVar in eq2

        html += sysStepHtml(`Подставляем во второе уравнение`,
            `${sysFormatNum(subCoef)}·(${sysFormatNum(exprConstPart)} ${exprOtherCoef >= 0 ? '+' : '−'} ${sysFormatNum(Math.abs(exprOtherCoef))}·${otherVar}) ${otherCoefEq2 >= 0 ? '+' : '−'} ${sysFormatNum(Math.abs(otherCoefEq2))}·${otherVar} = ${sysFormatNum(c2)}`);

        const totalOtherCoef = subCoef * exprOtherCoef + otherCoefEq2;
        const totalConst = subCoef * exprConstPart;

        html += sysStepHtml(`Раскрываем скобки и приводим подобные`,
            `${sysFormatNum(totalConst)} ${totalOtherCoef >= 0 ? '+' : '−'} ${sysFormatNum(Math.abs(totalOtherCoef))}·${otherVar} = ${sysFormatNum(c2)}`);

        if (Math.abs(totalOtherCoef) < 1e-10) {
            if (Math.abs(totalConst - c2) < 1e-10) {
                html += `<div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center"><p class="text-blue-400 font-bold">Бесконечно много решений</p></div>`;
            } else {
                html += `<div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center"><p class="text-amber-400 font-bold">Решений нет</p></div>`;
            }
            return { html, solution: null };
        }

        const otherVal = (c2 - totalConst) / totalOtherCoef;
        html += sysStepHtml(`Находим ${otherVar}`,
            `${otherVar} = (${sysFormatNum(c2)} − ${sysFormatNum(totalConst)}) / ${sysFormatNum(totalOtherCoef)} = <b class="text-emerald-400">${sysFormatNum(otherVal)}</b>`);

        const exprVal = exprConstPart + exprOtherCoef * otherVal;
        html += sysStepHtml(`Находим ${exprVar}`,
            `${exprVar} = ${sysFormatNum(exprConstPart)} ${exprOtherCoef >= 0 ? '+' : '−'} ${sysFormatNum(Math.abs(exprOtherCoef))}·${sysFormatNum(otherVal)} = <b class="text-emerald-400">${sysFormatNum(exprVal)}</b>`);

        const solution = [0, 0];
        solution[exprIdx] = exprVal;
        solution[otherIdx] = otherVal;

        html += `<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">`;
        html += `<p class="text-emerald-400 font-bold text-lg mb-1">Ответ</p>`;
        html += `<p class="text-white font-mono">(${varNames.map((v, i) => v + ' = ' + sysFormatNum(solution[i])).join(', ')})</p>`;
        html += `</div>`;
        return { html, solution };
    }

    // 3x3: express one variable from eq1, substitute into eq2 and eq3, solve 2x2
    const [a1, b1, c1c] = mat[0];
    const d1 = b[0];

    // Find non-zero coefficient in first equation
    let pivotIdx = -1, pivotCoef = 0;
    for (let j = 0; j < 3; j++) {
        if (Math.abs(mat[0][j]) > 1e-10) { pivotIdx = j; pivotCoef = mat[0][j]; break; }
    }
    if (pivotIdx === -1) {
        html += `<div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center"><p class="text-amber-400 font-bold">Первое уравнение вырождено</p></div>`;
        return { html, solution: null };
    }

    const pivotVar = varNames[pivotIdx];
    html += sysStepHtml(`Выражаем ${pivotVar} из первого уравнения`,
        `${pivotVar} = (${sysFormatNum(d1)} − ${varNames.filter((_, i) => i !== pivotIdx).map((v, i) => sysFormatNum(Math.abs(mat[0][i === 0 ? (pivotIdx === 0 ? 1 : 0) : (pivotIdx === 2 ? 1 : 2)])) + '·' + v).join(' ')}) / ${sysFormatNum(pivotCoef)}`);

    // Substitute into eq2 and eq3 to get 2x2 system
    const reducedMat = [];
    const reducedB = [];
    const reducedVars = varNames.filter((_, i) => i !== pivotIdx);

    for (let i = 1; i < 3; i++) {
        const row = [];
        const pivotContrib = mat[i][pivotIdx] * d1 / pivotCoef;
        const newB = b[i] - pivotContrib;
        for (let j = 0; j < 3; j++) {
            if (j === pivotIdx) continue;
            const newCoef = mat[i][j] - mat[i][pivotIdx] * mat[0][j] / pivotCoef;
            row.push(newCoef);
        }
        reducedMat.push(row);
        reducedB.push(newB);
    }

    html += sysStepHtml(`Подставляем в уравнения 2 и 3, получаем систему 2×2`,
        `${sysFormatEq({[reducedVars[0]]: reducedMat[0][0], [reducedVars[1]]: reducedMat[0][1]}, reducedVars, reducedB[0])}<br>${sysFormatEq({[reducedVars[0]]: reducedMat[1][0], [reducedVars[1]]: reducedMat[1][1]}, reducedVars, reducedB[1])}`);

    // Solve the 2x2 system
    const sub2 = sysSolveSubstitution(reducedMat, reducedB, reducedVars);
    html += sub2.html;

    if (!sub2.solution) return { html, solution: null };

    // Find the pivot variable
    const pivotVal = (d1 - varNames.reduce((sum, v, i) => i !== pivotIdx ? sum + mat[0][i] * sub2.solution[i < pivotIdx ? i : i - 1] : sum, 0)) / pivotCoef;

    const solution = [];
    let subIdx = 0;
    for (let i = 0; i < 3; i++) {
        if (i === pivotIdx) solution.push(pivotVal);
        else solution.push(sub2.solution[subIdx++]);
    }

    html += sysStepHtml(`Находим ${pivotVar}`,
        `${pivotVar} = <b class="text-emerald-400">${sysFormatNum(pivotVal)}</b>`);

    html += `<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">`;
    html += `<p class="text-emerald-400 font-bold text-lg mb-1">Ответ</p>`;
    html += `<p class="text-white font-mono">(${varNames.map((v, i) => v + ' = ' + sysFormatNum(solution[i])).join(', ')})</p>`;
    html += `</div>`;

    return { html, solution };
}

function sysSolveGauss(mat, b, varNames) {
    let html = '';
    const n = varNames.length;

    // Create augmented matrix
    const aug = mat.map((row, i) => [...row, b[i]]);

    html += sysStepHtml('Расширенная матрица системы',
        aug.map(row => row.map(v => sysFormatNum(v)).join('  ')).join('<br>'));

    // Forward elimination
    for (let col = 0; col < n; col++) {
        // Find pivot
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        if (maxRow !== col) {
            [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
            html += sysStepHtml(`Меняем строки ${col+1} и ${maxRow+1}`,
                aug.map(row => row.map(v => sysFormatNum(v)).join('  ')).join('<br>'));
        }

        if (Math.abs(aug[col][col]) < 1e-10) continue;

        // Eliminate below
        for (let row = col + 1; row < n; row++) {
            const factor = aug[row][col] / aug[col][col];
            for (let j = col; j <= n; j++) {
                aug[row][j] -= factor * aug[col][j];
            }
            html += sysStepHtml(`R${row+1} = R${row+1} − (${sysFormatNum(factor)})·R${col+1}`,
                aug.map(row => row.map(v => sysFormatNum(v)).join('  ')).join('<br>'));
        }
    }

    // Check for inconsistency
    for (let row = 0; row < n; row++) {
        let allZero = true;
        for (let col = 0; col < n; col++) {
            if (Math.abs(aug[row][col]) > 1e-10) { allZero = false; break; }
        }
        if (allZero && Math.abs(aug[row][n]) > 1e-10) {
            html += `<div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg text-center"><p class="text-amber-400 font-bold">Решений нет (система несовместна)</p></div>`;
            return { html, solution: null };
        }
    }

    // Check for infinite solutions
    let rank = 0;
    for (let row = 0; row < n; row++) {
        let hasNonZero = false;
        for (let col = 0; col < n; col++) {
            if (Math.abs(aug[row][col]) > 1e-10) { hasNonZero = true; break; }
        }
        if (hasNonZero) rank++;
    }
    if (rank < n) {
        html += `<div class="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center"><p class="text-blue-400 font-bold">Бесконечно много решений (ранг < размерности)</p></div>`;
        return { html, solution: null };
    }

    // Back substitution
    const solution = new Array(n);
    for (let row = n - 1; row >= 0; row--) {
        let sum = aug[row][n];
        for (let col = row + 1; col < n; col++) {
            sum -= aug[row][col] * solution[col];
        }
        solution[row] = sum / aug[row][row];
        html += sysStepHtml(`Обратный ход: находим ${varNames[row]}`,
            `${varNames[row]} = ${sysFormatNum(solution[row])}`);
    }

    html += `<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg text-center">`;
    html += `<p class="text-emerald-400 font-bold text-lg mb-1">Ответ</p>`;
    html += `<p class="text-white font-mono">(${varNames.map((v, i) => v + ' = ' + sysFormatNum(solution[i])).join(', ')})</p>`;
    html += `</div>`;

    return { html, solution };
}

function sysSolve() {
    const resultDiv = document.getElementById('sysResult');
    try {
        const { mat, b, varNames, equations } = sysParseAll();

        let html = '';

        // Show parsed system
        html += `<div class="bg-slate-800/30 p-4 rounded-lg">`;
        html += `<p class="text-sm text-slate-400 mb-2">Распознанная система</p>`;
        for (let i = 0; i < sysSize; i++) {
            html += `<p class="font-mono text-slate-300">${sysFormatEq(equations[i].coeffs, varNames, equations[i].b)}</p>`;
        }
        html += `</div>`;

        // Show method
        const methodNames = { cramer: 'Метод Крамера', substitution: 'Метод подстановки', gauss: 'Метод Гаусса' };
        html += `<div class="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-500">`;
        html += `<p class="text-sm text-slate-400">Метод: <span class="text-purple-400 font-medium">${methodNames[sysMethod]}</span></p>`;
        html += `</div>`;

        let result;
        if (sysMethod === 'cramer') result = sysSolveCramer(mat, b, varNames);
        else if (sysMethod === 'substitution') result = sysSolveSubstitution(mat, b, varNames);
        else result = sysSolveGauss(mat, b, varNames);

        html += result.html;

        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
        renderMath(resultDiv);
    } catch (err) {
        resultDiv.innerHTML = `<div class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-center"><p class="text-red-400">${err.message}</p></div>`;
        resultDiv.classList.remove('hidden');
    }
}
