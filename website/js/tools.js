function openTool(id) {
    const main = document.getElementById('main-content');
    const renderers = {
        'graph-tool': renderToolGraph,
        'expression-calc': renderToolExpressionCalc,
        'systems-calc': renderToolSystemsCalc,
    };
    if (renderers[id]) {
        renderers[id](main);
    } else {
        main.innerHTML = '<div class="p-8"><button onclick="renderDashboard()" class="text-blue-400 mb-4 inline-block">← Назад</button><h2 class="text-2xl">Инструмент "' + id + '" в разработке</h2></div>';
    }
}
