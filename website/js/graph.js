// === График функций ===

const GRAPH_COLORS = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

let graphState = null;

// --- Парсер математических выражений ---
const MATH_FUNCS = ['asin','acos','atan','sqrt','abs','log','ln','sin','cos','tan','ceil','floor','round'];
const FUNC_TOKENS = {};
MATH_FUNCS.forEach((f, i) => FUNC_TOKENS[f] = `\u00AB${i}\u00BB`);
const TOKEN_MATH = {};
MATH_FUNCS.forEach((f, i) => TOKEN_MATH[`\u00AB${i}\u00BB`] = f === 'ln' ? 'Math.log' : f === 'log' ? 'Math.log10' : `Math.${f}`);

function parseMathExpr(expr) {
    let s = expr.trim().toLowerCase();
    if (!s) return null;

    // Замена символов
    s = s.replace(/π/g, 'pi');
    s = s.replace(/×/g, '*');
    s = s.replace(/÷/g, '/');
    s = s.replace(/\|([^|]+)\|/g, 'abs($1)');

    // Замена имён функций на токены (длинные сначала, чтобы asin не стал a+sin)
    const sortedFuncs = [...MATH_FUNCS].sort((a, b) => b.length - a.length);
    sortedFuncs.forEach(f => {
        s = s.replace(new RegExp('\\b' + f + '\\b', 'g'), FUNC_TOKENS[f]);
    });

    // Замена pi и e на токены
    s = s.replace(/\bpi\b/g, '\u00ABPI\u00BB');
    s = s.replace(/\be\b/g, '\u00ABE\u00BB');

    // Неявное умножение
    s = s.replace(/(\d)([a-z\u00AB])/g, '$1*$2');   // 2x, 2sin, 2(
    s = s.replace(/(\d)(\()/g, '$1*$2');               // 2(
    s = s.replace(/(\))(\()/g, '$1*$2');               // )(
    s = s.replace(/(\))([a-z\u00AB])/g, '$1*$2');      // )x, )sin
    s = s.replace(/([a-z])(\()/g, '$1*$2');            // x( -> x*(
    s = s.replace(/(\u00BB)(\()/g, '$1$2');             // func( — NO star (function call)
    s = s.replace(/(\u00BB)(\d)/g, '$1*$2');            // func)2 -> func)*2
    s = s.replace(/(\u00BB)([a-z])/g, '$1*$2');         // func)x -> func)*x
    s = s.replace(/(\u00BB)(\u00AB)/g, '$1*$2');        // func)(func -> func)*(func

    // x2 -> x^2
    s = s.replace(/([a-z])(\d)/g, '$1^$2');

    // Восстановление токенов -> Math.*
    for (const [token, mathFn] of Object.entries(TOKEN_MATH)) {
        s = s.split(token).join(mathFn);
    }
    s = s.replace(/\u00ABPI\u00BB/g, 'Math.PI');
    s = s.replace(/\u00ABE\u00BB/g, 'Math.E');

    // Степень
    s = s.replace(/\^/g, '**');

    try {
        const fn = new Function('x', `"use strict"; return (${s});`);
        const testVal = fn(1);
        if (typeof testVal !== 'number') return null;
        return fn;
    } catch (e) {
        return null;
    }
}

// --- Красивое отображение выражения ---
function formatExpr(expr) {
    let s = expr.trim();
    s = s.replace(/\*{2}/g, '^');
    s = s.replace(/\*/g, '·');
    s = s.replace(/pi/g, 'π');
    s = s.replace(/sqrt\(/g, '√(');
    s = s.replace(/abs\(/g, '|');
    return s;
}

// --- Основная инициализация ---
function initGraph() {
    const canvas = document.getElementById('graphCanvas');
    const container = document.getElementById('graphContainer');
    const ctx = canvas.getContext('2d');

    graphState = {
        canvas,
        ctx,
        container,
        centerX: 0,
        centerY: 0,
        scale: 50,
        functions: [],
        nextId: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        dragCenterX: 0,
        dragCenterY: 0,
        lastFocusedInput: null,
        mouseMathX: null,
        mouseMathY: null,
        mouseOnCanvas: false
    };

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w <= 0 || h <= 0) return;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawGraph();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const mathX = (mx - rect.width / 2) / graphState.scale + graphState.centerX;
        const mathY = -(my - rect.height / 2) / graphState.scale + graphState.centerY;

        const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        graphState.scale *= factor;
        graphState.scale = Math.max(2, Math.min(5000, graphState.scale));

        graphState.centerX = mathX - (mx - rect.width / 2) / graphState.scale;
        graphState.centerY = mathY + (my - rect.height / 2) / graphState.scale;

        drawGraph();
    }, { passive: false });

    canvas.addEventListener('mousedown', (e) => {
        graphState.isDragging = true;
        graphState.dragStartX = e.clientX;
        graphState.dragStartY = e.clientY;
        graphState.dragCenterX = graphState.centerX;
        graphState.dragCenterY = graphState.centerY;
        canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (graphState.isDragging) {
            const dx = e.clientX - graphState.dragStartX;
            const dy = e.clientY - graphState.dragStartY;
            graphState.centerX = graphState.dragCenterX - dx / graphState.scale;
            graphState.centerY = graphState.dragCenterY + dy / graphState.scale;
            drawGraph();
        }
    });

    window.addEventListener('mouseup', () => {
        graphState.isDragging = false;
        canvas.style.cursor = 'crosshair';
    });

    let rafId = null;
    canvas.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        graphState.mouseMathX = (mx - rect.width / 2) / graphState.scale + graphState.centerX;
        graphState.mouseMathY = -(my - rect.height / 2) / graphState.scale + graphState.centerY;
        graphState.mouseOnCanvas = true;
        if (!rafId) {
            rafId = requestAnimationFrame(() => { rafId = null; drawGraph(); });
        }
    });

    canvas.addEventListener('mouseleave', () => {
        graphState.mouseOnCanvas = false;
        if (!rafId) {
            rafId = requestAnimationFrame(() => { rafId = null; drawGraph(); });
        }
    });

    canvas.style.cursor = 'crosshair';

    let touchStartDist = 0;
    let touchStartScale = 0;
    let touchStartCenter = null;

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            graphState.isDragging = true;
            graphState.dragStartX = e.touches[0].clientX;
            graphState.dragStartY = e.touches[0].clientY;
            graphState.dragCenterX = graphState.centerX;
            graphState.dragCenterY = graphState.centerY;
        } else if (e.touches.length === 2) {
            graphState.isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDist = Math.sqrt(dx * dx + dy * dy);
            touchStartScale = graphState.scale;
            touchStartCenter = { x: graphState.centerX, y: graphState.centerY };
        }
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && graphState.isDragging) {
            const dx = e.touches[0].clientX - graphState.dragStartX;
            const dy = e.touches[0].clientY - graphState.dragStartY;
            graphState.centerX = graphState.dragCenterX - dx / graphState.scale;
            graphState.centerY = graphState.dragCenterY + dy / graphState.scale;
            drawGraph();
        } else if (e.touches.length === 2 && touchStartDist > 0) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            graphState.scale = touchStartScale * (dist / touchStartDist);
            graphState.scale = Math.max(2, Math.min(5000, graphState.scale));
            drawGraph();
        }
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        graphState.isDragging = false;
        touchStartDist = 0;
    });

    graphAddFunction('x^2');
}

function drawGraph() {
    if (!graphState) return;
    const { ctx, canvas, container, scale, centerX, centerY, functions } = graphState;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w <= 0 || h <= 0) return;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, w, h);

    const ox = w / 2 - centerX * scale;
    const oy = h / 2 + centerY * scale;

    drawGrid(ctx, w, h, ox, oy, scale);

    drawAxes(ctx, w, h, ox, oy, scale);

    functions.forEach(f => {
        if (f.fn && f.visible !== false) {
            drawFunction(ctx, f, w, h, ox, oy, scale);
        }
    });

    if (graphState.mouseOnCanvas && graphState.mouseMathX !== null) {
        const mx = graphState.mouseMathX;
        const my = graphState.mouseMathY;
        const text = `x: ${mx.toFixed(2)}, y: ${my.toFixed(2)}`;
        ctx.font = '12px monospace';
        const metrics = ctx.measureText(text);
        const pad = 8;
        const boxW = metrics.width + pad * 2;
        const boxH = 22;
        const bx = 10;
        const by = 10;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bx + pad, by + boxH / 2);
    }
}

function drawGrid(ctx, w, h, ox, oy, scale) {
    const minPixelGap = 40;
    const rawStep = minPixelGap / scale;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let step;
    if (residual <= 1) step = magnitude;
    else if (residual <= 2) step = 2 * magnitude;
    else if (residual <= 5) step = 5 * magnitude;
    else step = 10 * magnitude;

    const pixelStep = step * scale;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const startX = ox % pixelStep;
    for (let px = startX; px < w; px += pixelStep) {
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
    }
    const startY = oy % pixelStep;
    for (let py = startY; py < h; py += pixelStep) {
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xStart = Math.ceil((-ox) / pixelStep);
    const xEnd = Math.floor((w - ox) / pixelStep);
    for (let i = xStart; i <= xEnd; i++) {
        if (i === 0) continue;
        const val = i * step;
        const px = ox + i * pixelStep;
        const labelY = Math.min(Math.max(oy + 6, 2), h - 14);
        ctx.fillText(formatNumber(val), px, labelY);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const yStart = Math.ceil((-oy) / pixelStep);
    const yEnd = Math.floor((h - oy) / pixelStep);
    for (let i = yStart; i <= yEnd; i++) {
        if (i === 0) continue;
        const val = -i * step;
        const py = oy + i * pixelStep;
        const labelX = Math.min(Math.max(ox - 6, 30), w - 4);
        ctx.fillText(formatNumber(val), labelX, py);
    }

    if (ox > 20 && ox < w - 20 && oy > 10 && oy < h - 10) {
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('0', ox - 6, oy + 6);
    }
}

function formatNumber(val) {
    if (Math.abs(val) >= 1e6 || (Math.abs(val) < 0.001 && val !== 0)) {
        return val.toExponential(1);
    }
    const s = val.toPrecision(6);
    return parseFloat(s).toString();
}

function drawAxes(ctx, w, h, ox, oy, scale) {
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;

    if (oy >= 0 && oy <= h) {
        ctx.beginPath();
        ctx.moveTo(0, oy);
        ctx.lineTo(w, oy);
        ctx.stroke();
    }

    if (ox >= 0 && ox <= w) {
        ctx.beginPath();
        ctx.moveTo(ox, 0);
        ctx.lineTo(ox, h);
        ctx.stroke();
    }

    ctx.fillStyle = '#334155';
    if (oy >= 0 && oy <= h) {
        ctx.beginPath();
        ctx.moveTo(w - 2, oy);
        ctx.lineTo(w - 10, oy - 5);
        ctx.lineTo(w - 10, oy + 5);
        ctx.fill();
    }
    if (ox >= 0 && ox <= w) {
        ctx.beginPath();
        ctx.moveTo(ox, 2);
        ctx.lineTo(ox - 5, 10);
        ctx.lineTo(ox + 5, 10);
        ctx.fill();
    }
}

function drawFunction(ctx, funcObj, w, h, ox, oy, scale) {
    const fn = funcObj.fn;
    if (!fn) return;

    ctx.strokeStyle = funcObj.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    let isDrawing = false;
    let prevPy = null;
    const step = 1;

    for (let px = -2; px <= w + 2; px += step) {
        const mathX = (px - ox) / scale;
        let mathY;
        try {
            mathY = fn(mathX);
        } catch (e) {
            isDrawing = false;
            continue;
        }

        if (!isFinite(mathY) || isNaN(mathY)) {
            isDrawing = false;
            continue;
        }

        const py = oy - mathY * scale;

        // Break line if jump is too big (discontinuity like tan)
        if (isDrawing && prevPy !== null && Math.abs(py - prevPy) > h * 2) {
            isDrawing = false;
        }

        if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
        } else {
            ctx.lineTo(px, py);
        }
        prevPy = py;
    }
    ctx.stroke();
}

function graphAddFunction(defaultExpr) {
    if (!graphState) return;
    const id = graphState.nextId++;
    const colorIndex = graphState.functions.length % GRAPH_COLORS.length;
    const color = GRAPH_COLORS[colorIndex];
    const expr = defaultExpr || '';

    const funcObj = {
        id,
        expr,
        color,
        fn: expr ? parseMathExpr(expr) : null,
        visible: true
    };

    graphState.functions.push(funcObj);
    renderFunctionList();
    drawGraph();
}

function graphRemoveFunction(id) {
    if (!graphState) return;
    graphState.functions = graphState.functions.filter(f => f.id !== id);
    renderFunctionList();
    drawGraph();
}

function graphToggleFunction(id) {
    if (!graphState) return;
    const f = graphState.functions.find(f => f.id === id);
    if (f) {
        f.visible = !f.visible;
        renderFunctionList();
        drawGraph();
    }
}

function graphUpdateFunction(id, expr) {
    if (!graphState) return;
    const f = graphState.functions.find(f => f.id === id);
    if (f) {
        f.expr = expr;
        f.fn = parseMathExpr(expr);
        const input = document.getElementById('func-input-' + id);
        if (input) {
            if (expr && !f.fn) {
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        }
        drawGraph();
    }
}

function renderFunctionList() {
    if (!graphState) return;
    const list = document.getElementById('functionList');
    if (!list) return;

    list.innerHTML = graphState.functions.map(f => `
        <div class="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30" data-func-id="${f.id}">
            <div class="func-color-dot" style="background:${f.color};opacity:${f.visible ? 1 : 0.3}"></div>
            <span class="text-slate-500 text-xs font-mono shrink-0">y=</span>
            <input
                type="text"
                id="func-input-${f.id}"
                class="func-input ${f.expr && !f.fn ? 'error' : ''}"
                value="${escapeHtml(f.expr)}"
                placeholder="x^2"
                oninput="graphUpdateFunction(${f.id}, this.value)"
                onfocus="graphState.lastFocusedInput = this"
            >
            <button class="func-remove-btn" onclick="graphToggleFunction(${f.id})" title="${f.visible ? 'Скрыть' : 'Показать'}">
                <i class="fas ${f.visible ? 'fa-eye' : 'fa-eye-slash'}"></i>
            </button>
            <button class="func-remove-btn" onclick="graphRemoveFunction(${f.id})" title="Удалить">
                <i class="fas fa-xmark"></i>
            </button>
        </div>
    `).join('');
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function graphZoomIn() {
    if (!graphState) return;
    graphState.scale *= 1.3;
    graphState.scale = Math.min(5000, graphState.scale);
    drawGraph();
}

function graphZoomOut() {
    if (!graphState) return;
    graphState.scale /= 1.3;
    graphState.scale = Math.max(2, graphState.scale);
    drawGraph();
}

function graphResetView() {
    if (!graphState) return;
    graphState.centerX = 0;
    graphState.centerY = 0;
    graphState.scale = 50;
    drawGraph();
}

function insertSymbol(sym) {
    if (!graphState || !graphState.lastFocusedInput) {
        const inputs = document.querySelectorAll('.func-input');
        if (inputs.length > 0) {
            graphState.lastFocusedInput = inputs[inputs.length - 1];
        } else return;
    }
    const input = graphState.lastFocusedInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const val = input.value;
    input.value = val.substring(0, start) + sym + val.substring(end);
    const newPos = start + sym.length;
    input.selectionStart = input.selectionEnd = newPos;
    input.focus();

    const id = parseInt(input.id.replace('func-input-', ''));
    graphUpdateFunction(id, input.value);
}

function graphExportFunctions() {
    if (!graphState || graphState.functions.length === 0) return;
    const data = {
        version: 1,
        functions: graphState.functions.map(f => ({ expr: f.expr, color: f.color, visible: f.visible }))
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph_functions.json';
    a.click();
    URL.revokeObjectURL(url);
}

function graphImportFunctions() {
    if (!graphState) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!data.functions || !Array.isArray(data.functions)) return;
                graphState.functions = [];
                graphState.nextId = 0;
                data.functions.forEach(f => {
                    const id = graphState.nextId++;
                    graphState.functions.push({
                        id,
                        expr: f.expr || '',
                        color: f.color || GRAPH_COLORS[graphState.functions.length % GRAPH_COLORS.length],
                        fn: f.expr ? parseMathExpr(f.expr) : null,
                        visible: f.visible !== false
                    });
                });
                renderFunctionList();
                drawGraph();
            } catch (err) {
                // ignore invalid files
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
