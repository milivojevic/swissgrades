// static/main.ts
import { models, roundGrade, calculateFairness } from './grading.js';

declare const Plotly: any;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('grading-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateVisualizations();
    });

    // Initial generation
    generateVisualizations();
});

function generateVisualizations() {
    const mpInput = document.getElementById('max-points') as HTMLInputElement;
    const pppInput = document.getElementById('passing-points') as HTMLInputElement;
    const granularityInput = document.getElementById('grade-granularity') as HTMLSelectElement;

    const mp = parseInt(mpInput.value, 10);
    const ppp = parseInt(pppInput.value, 10);
    const granularity = parseFloat(granularityInput.value);

    models.forEach(model => {
        const points = Array.from({ length: mp + 1 }, (_, i) => i);
        const grades = points.map(p => model.calculate(p, mp, ppp));
        const roundedGrades = grades.map(g => roundGrade(g, granularity));

        const fairness = calculateFairness(points.map((p, i) => ({ points: p, grade: grades[i] })));

        createChart(model.name, points, grades, roundedGrades, mp, ppp, fairness);
        createTable(model.name, points, grades, roundedGrades);
    });
}

function getGradeColor(grade: number): string {
    const r = Math.max(0, Math.min(255, 255 * (4 - grade) / 3));
    const g = Math.max(0, Math.min(255, 255 * (grade - 1) / 5));
    return `rgb(${r},${g},0)`;
}

function createChart(modelName: string, points: number[], grades: number[], roundedGrades: number[], mp: number, ppp: number, fairness: number) {
    const chartId = `${modelName.toLowerCase().replace(/ /g, '-')}-chart`;
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;

    const pppPercentage = ((ppp / mp) * 100).toFixed(1);
    const mpPercentage = "100";

    const mainLine = {
        x: points,
        y: grades,
        mode: 'lines',
        name: 'Exact Grade',
        line: {
            color: 'grey',
            width: 2
        },
        hoverinfo: 'x+y'
    };
    
    const roundedLine = {
        x: points,
        y: roundedGrades,
        mode: 'markers',
        name: 'Rounded Grade',
        marker: {
            color: roundedGrades.map(getGradeColor),
            size: 4
        },
        hoverinfo: 'x+y'
    };

    const layout = {
        title: `${modelName} Model (Fairness: ${fairness.toFixed(2)}%)`,
        xaxis: {
            title: 'Points',
            range: [0, mp],
            tickmode: 'linear',
            tick0: 0,
            dtick: 5,
            minor: {
                tick0: 0,
                dtick: 1,
                gridcolor: '#f0f0f0'
            }
        },
        yaxis: {
            title: 'Grade',
            range: [0, 6.25],
            tickmode: 'linear',
            tick0: 0,
            dtick: 1,
            minor: {
                tick0: 0,
                dtick: 0.25,
                gridcolor: '#f0f0f0'
            }
        },
        height: 800,
        shapes: [
            // PPP Line
            {
                type: 'line',
                x0: ppp,
                y0: 0,
                x1: ppp,
                y1: 6,
                line: {
                    color: 'blue',
                    width: 2,
                    dash: 'dash'
                }
            }
        ],
        annotations: [
            {
                x: ppp,
                y: 6.1,
                xref: 'x',
                yref: 'y',
                text: `PPP: ${ppp} (${pppPercentage}%)`,
                showarrow: false,
                xanchor: 'center'
            },
            {
                x: mp,
                y: 6.1,
                xref: 'x',
                yref: 'y',
                text: `MP: ${mp} (${mpPercentage}%)`,
                showarrow: false,
                xanchor: 'right'
            }
        ],
        showlegend: true
    };

    Plotly.newPlot(chartContainer, [mainLine, roundedLine], layout);
}

function createTable(modelName: string, points: number[], grades: number[], roundedGrades: number[]) {
    const tableId = `${modelName.toLowerCase().replace(/ /g, '-')}-table`;
    const tableContainer = document.getElementById(tableId);
    if (!tableContainer) return;

    let tableHTML = `<h3>${modelName} Model</h3>`;
    tableHTML += '<table><thead><tr><th>Points</th><th>Exact Grade</th><th>Rounded Grade</th></tr></thead><tbody>';

    points.forEach((p, i) => {
        tableHTML += `<tr><td>${p}</td><td>${grades[i].toFixed(3)}</td><td>${roundedGrades[i].toFixed(2)}</td></tr>`;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}
