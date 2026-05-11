const App = {
    currentSubject: 'math'
};

function switchSubject(subjectKey) {
    App.currentSubject = subjectKey;
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${subjectKey}`).classList.add('active');
    renderDashboard();
}

function showDashboard() {
    renderDashboard();
}

window.onload = function() {
    renderSidebar();
    renderDashboard();
};
