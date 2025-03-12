function initCharts(data) {
    // Graphique de progression
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    new Chart(progressCtx, {
        type: 'doughnut',
        data: {
            labels: ['Complété', 'Restant'],
            datasets: [{
                data: [data.completionRate, 100 - data.completionRate],
                backgroundColor: ['#2ecc71', '#ecf0f1']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Taux de complétion'
                }
            }
        }
    });

    // Graphique des tags
    const tagsCtx = document.getElementById('tagsChart').getContext('2d');
    new Chart(tagsCtx, {
        type: 'radar',
        data: {
            labels: data.tagLabels,
            datasets: [{
                label: 'Actions quotidiennes',
                data: data.tagValues,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
} 