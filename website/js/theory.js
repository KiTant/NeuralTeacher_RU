function openTheory(id) {
    const main = document.getElementById('main-content');
    const renderers = {
        'natural-numbers': renderTheoryNaturalNumbers,
        'geometry-basics': renderTheoryGeometryBasics,
        'divisibility': renderTheoryDivisibility,
        'fractions-proportions': renderTheoryFractionsProportions,
        'coordinates-logic': renderTheoryCoordinatesLogic,
        'expressions-identities': renderTheoryExpressionsIdentities,
        'linear-function': renderTheoryLinearFunction,
        'powers-fsu': renderTheoryPowersFsu,
        'rational-fractions': renderTheoryRationalFractions,
        'inequalities': renderTheoryInequalities,
        'statistics-basics': renderTheoryStatisticsBasics,
        'quadratic-function': renderTheoryQuadraticFunction,
        'progressions': renderTheoryProgressions,
        'combinatorics-probability': renderTheoryCombinatoricsProbability,
        'quad-eq': renderTheoryQuadEq,
        'trig': renderTheoryTrig,
    };
    if (renderers[id]) {
        renderers[id](main);
    } else {
        main.innerHTML = '<div class="p-8"><button onclick="renderDashboard()" class="text-blue-400 mb-4 inline-block">← Назад</button><h2 class="text-2xl">Раздел "' + id + '" в разработке</h2></div>';
    }
}
