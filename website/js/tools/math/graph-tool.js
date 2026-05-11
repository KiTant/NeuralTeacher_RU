function renderToolGraph(main) {
    main.innerHTML = `
        <div class="page-fade p-6 overflow-y-auto">
            <button onclick="renderDashboard()" class="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 w-fit text-sm">
                <i class="fas fa-arrow-left"></i> Назад к списку
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Холст графика -->
                <div class="lg:col-span-3 glass-card rounded-2xl p-4 flex flex-col">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-lg font-bold flex items-center gap-2">
                            <i class="fas fa-chart-area text-emerald-400"></i> График функций
                        </h3>
                        <div class="flex items-center gap-2">
                            <button onclick="graphZoomIn()" class="graph-zoom-btn" title="Приблизить">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button onclick="graphZoomOut()" class="graph-zoom-btn" title="Отдалить">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button onclick="graphResetView()" class="graph-zoom-btn" title="Сбросить вид">
                                <i class="fas fa-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                    <div id="graphContainer" class="bg-slate-950 rounded-xl relative border border-slate-800 overflow-hidden" style="height:600px;">
                        <canvas id="graphCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;"></canvas>
                    </div>
                </div>

                <!-- Панель функций -->
                <div class="glass-card rounded-2xl p-5">
                    <h3 class="text-base font-bold flex items-center gap-2 mb-4">
                        <i class="fas fa-function text-blue-400"></i> Функции
                    </h3>

                    <div id="functionList" class="space-y-3 mb-4">
                    </div>

                    <button onclick="graphAddFunction()" class="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-sm font-medium transition flex items-center justify-center gap-2">
                        <i class="fas fa-plus"></i> Добавить функцию
                    </button>

                    <div class="mt-3 flex gap-2">
                        <button onclick="graphExportFunctions()" class="flex-1 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/25 text-emerald-400 text-xs font-medium transition flex items-center justify-center gap-1.5">
                            <i class="fas fa-download"></i> Экспорт
                        </button>
                        <button onclick="graphImportFunctions()" class="flex-1 py-2 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 border border-amber-500/25 text-amber-400 text-xs font-medium transition flex items-center justify-center gap-1.5">
                            <i class="fas fa-upload"></i> Импорт
                        </button>
                    </div>

                    <!-- Панель символов -->
                    <div class="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <p class="text-xs text-slate-500 mb-2">Быстрый ввод:</p>
                        <div class="flex flex-wrap gap-1.5">
                            <button onclick="insertSymbol('^')" class="sym-btn" title="Степень">x<sup>n</sup></button>
                            <button onclick="insertSymbol('sqrt(')" class="sym-btn" title="Корень">√</button>
                            <button onclick="insertSymbol('abs(')" class="sym-btn" title="Модуль">|x|</button>
                            <button onclick="insertSymbol('sin(')" class="sym-btn" title="Синус">sin</button>
                            <button onclick="insertSymbol('cos(')" class="sym-btn" title="Косинус">cos</button>
                            <button onclick="insertSymbol('tan(')" class="sym-btn" title="Тангенс">tan</button>
                            <button onclick="insertSymbol('log(')" class="sym-btn" title="Логарифм base 10">log</button>
                            <button onclick="insertSymbol('ln(')" class="sym-btn" title="Нат. логарифм">ln</button>
                            <button onclick="insertSymbol('pi')" class="sym-btn" title="Пи">π</button>
                            <button onclick="insertSymbol('e')" class="sym-btn" title="Число Эйлера">e</button>
                        </div>
                    </div>

                    <div class="mt-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                        <p class="text-[11px] text-emerald-400/70 leading-relaxed">
                            <b>Примеры:</b> x^2, 2x+1, sqrt(x), sin(x), x^3-2x, abs(x), ln(x)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    setTimeout(initGraph, 10);
}
