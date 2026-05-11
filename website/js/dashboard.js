function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = `
        <p class="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Предметы</p>
        ${Object.entries(data).map(([key, subject]) => `
            <button onclick="switchSubject('${key}')" id="btn-${key}" class="sidebar-item ${key === App.currentSubject ? 'active' : ''} w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left">
                <i class="fas ${subject.sidebarIcon} w-5"></i>
                <span>${subject.title}</span>
            </button>
        `).join('')}
    `;
}

const PAGE_SIZE = 6;
const visibleCounts = {};

function getVisibleCount(section) {
    const key = `${App.currentSubject}-${section}`;
    if (!(key in visibleCounts)) visibleCounts[key] = PAGE_SIZE;
    return visibleCounts[key];
}

function showMore(section) {
    const key = `${App.currentSubject}-${section}`;
    visibleCounts[key] = (visibleCounts[key] || PAGE_SIZE) + PAGE_SIZE;
    renderDashboard();
}

function showAll(section) {
    const key = `${App.currentSubject}-${section}`;
    const items = section === 'theory' ? data[App.currentSubject].theory : data[App.currentSubject].tools;
    visibleCounts[key] = items.length;
    renderDashboard();
}

function renderCardGrid(items, section, openFn, borderClass, hoverClass, iconColorFn) {
    const visible = getVisibleCount(section);
    const shown = items.slice(0, visible);
    const remaining = items.length - visible;

    let html = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
    html += shown.map(item => `
        <div onclick="${openFn}('${item.id}')" class="glass-card p-6 rounded-2xl border-l-4 ${borderClass} ${hoverClass} transition-all cursor-pointer group">
            <div class="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <i class="fas ${item.icon} ${iconColorFn(item)} text-lg"></i>
            </div>
            <h4 class="text-lg font-bold mb-2">${item.name}</h4>
            <p class="text-sm text-slate-400 leading-relaxed">${item.desc}</p>
        </div>
    `).join('');
    html += `</div>`;

    if (remaining > 0) {
        const moreCount = Math.min(PAGE_SIZE, remaining);
        html += `
            <div class="flex items-center gap-3 mt-6">
                <button onclick="showMore('${section}')" class="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">
                    Показать ещё ${moreCount}
                </button>
                <button onclick="showAll('${section}')" class="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">
                    Показать все (${items.length})
                </button>
                <span class="text-sm text-slate-500">Осталось: ${remaining}</span>
            </div>`;
    }

    return html;
}

function renderDashboard() {
    const subject = data[App.currentSubject];
    const main = document.getElementById('main-content');

    const theoryHtml = renderCardGrid(
        subject.theory, 'theory', 'openTheory',
        'border-blue-500', 'hover:border-blue-500/50', () => 'text-blue-400'
    );

    const toolsHtml = renderCardGrid(
        subject.tools, 'tools', 'openTool',
        'border-emerald-500', 'hover:border-emerald-500/50', (item) => item.color || 'text-emerald-400'
    );

    main.innerHTML = `
        <div class="page-fade">
            <header class="p-8">
                <h2 class="text-4xl font-extrabold text-white mb-2">${subject.title}</h2>
                <p class="text-slate-400">Выберите раздел для изучения</p>
            </header>
            <section class="p-8 space-y-12">
                <div>
                    <div class="flex items-center gap-3 mb-6">
                        <i class="fas fa-book-open text-blue-400 text-xl"></i>
                        <h3 class="text-2xl font-bold">Теоретический материал</h3>
                    </div>
                    ${theoryHtml}
                </div>
                <div>
                    <div class="flex items-center gap-3 mb-6">
                        <i class="fas fa-screwdriver-wrench text-emerald-400 text-xl"></i>
                        <h3 class="text-2xl font-bold text-white">Инструменты</h3>
                    </div>
                    ${toolsHtml}
                </div>
            </section>
        </div>
    `;
}
