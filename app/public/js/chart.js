for (const [campaignId, points] of Object.entries(seriesByCampaign)) {
  const el = document.getElementById(`chart-${campaignId}`);
  if (!el) continue;
  const labels = points.map(p => p.day);
  const data = points.map(p => p.signups);
  new Chart(el, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Sign-ups',
        data,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } }
      }
    }
  });
}