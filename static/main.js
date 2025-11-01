// static/main.js
import { models, roundGrade, calculateFairness } from './grading.js';

// Pagination state
let currentPage = 0;
const totalPages = 2;

// Initialize pagination
function initPagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    function updatePagination() {
        // Update pages visibility
        document.querySelectorAll('.page').forEach((page, index) => {
            page.classList.toggle('active', index === currentPage);
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        
        // Update buttons
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Generate visualizations for the newly active page
        setTimeout(() => {
            generateVisualizations();
        }, 50);
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePagination();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePagination();
        }
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentPage = index;
            updatePagination();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentPage > 0) {
            currentPage--;
            updatePagination();
        } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
            currentPage++;
            updatePagination();
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold && currentPage < totalPages - 1) {
            // Swipe left - next page
            currentPage++;
            updatePagination();
        }
        if (touchEndX > touchStartX + swipeThreshold && currentPage > 0) {
            // Swipe right - previous page
            currentPage--;
            updatePagination();
        }
    }
    
    updatePagination();
}

// Cookie management functions
function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Debounce function to limit how often we regenerate visualizations
let debounceTimer;
function debounce(func, delay = 300) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedGenerate = debounce(generateVisualizations, 300);

document.addEventListener('DOMContentLoaded', () => {
    const mpInput = document.getElementById('max-points');
    const pppInput = document.getElementById('passing-points');
    const granularityInput = document.getElementById('grade-granularity');
    const loggingCheckbox = document.getElementById('enable-logging');

    // Load saved values from cookies
    const savedMP = getCookie('mp');
    const savedPPP = getCookie('ppp');
    const savedGranularity = getCookie('granularity');
    const savedLogging = getCookie('logging');

    if (savedMP) mpInput.value = savedMP;
    if (savedPPP) pppInput.value = savedPPP;
    if (savedGranularity) granularityInput.value = savedGranularity;
    if (savedLogging === 'true') loggingCheckbox.checked = true;

    // Save values to cookies on change
    mpInput.addEventListener('input', () => {
        const mp = parseFloat(mpInput.value);
        const ppp = parseFloat(pppInput.value);
        
        // Auto-set PPP to 60% of MP, rounded to nearest 0.5
        const suggestedPPP = Math.round(mp * 0.6 * 2) / 2;
        pppInput.value = suggestedPPP;
        
        // Ensure PPP doesn't exceed MP
        if (ppp > mp) {
            pppInput.value = suggestedPPP;
        }
        
        setCookie('mp', mpInput.value);
        setCookie('ppp', pppInput.value);
        debouncedGenerate();
    });

    pppInput.addEventListener('input', () => {
        const mp = parseFloat(mpInput.value);
        const ppp = parseFloat(pppInput.value);
        
        // Ensure PPP doesn't exceed MP
        if (ppp > mp) {
            pppInput.value = mp;
        }
        
        setCookie('ppp', pppInput.value);
        debouncedGenerate();
    });

    granularityInput.addEventListener('change', () => {
        setCookie('granularity', granularityInput.value);
        generateVisualizations(); // Immediate for dropdown
    });

    loggingCheckbox.addEventListener('change', () => {
        setCookie('logging', loggingCheckbox.checked);
        generateVisualizations(); // Immediate for checkbox
    });

    // Initialize pagination
    initPagination();

    // Generate initial visualizations
    generateVisualizations();
});

function generateVisualizations() {
    const mpInput = document.getElementById('max-points');
    const pppInput = document.getElementById('passing-points');
    const granularityInput = document.getElementById('grade-granularity');
    const loggingCheckbox = document.getElementById('enable-logging');

    const mp = parseFloat(mpInput.value);
    const ppp = parseFloat(pppInput.value);
    const granularity = parseFloat(granularityInput.value);
    const loggingEnabled = loggingCheckbox.checked;

    if (loggingEnabled) {
        console.log('=== GENERATING VISUALIZATIONS ===');
        console.log(`Parameters: MP=${mp}, PPP=${ppp}, Granularity=${granularity}`);
    }

    // Generate points array with half-point increments (this is where the pain is felt!)
    const points = [];
    for (let i = 0; i <= mp; i += 0.5) {
        points.push(i);
    }
    
    if (loggingEnabled) {
        console.log(`Generated ${points.length} points from 0 to ${mp} (step: 0.5)`);
    }

    models.forEach((model, index) => {
        // Only render charts for the currently active page to avoid sizing issues
        const activePage = document.querySelector('.page.active');
        const activePageIndex = parseInt(activePage?.dataset.page || '0');
        
        // Skip rendering if this model's page is not active
        if (index !== activePageIndex) {
            return; // We'll render it when the user navigates to that page
        }
        
        if (loggingEnabled) {
            console.log(`\n--- Processing ${model.name} ---`);
        }
        
        try {
            const grades = points.map(p => model.calculate(p, mp, ppp));
            if (loggingEnabled) {
                console.log(`${model.name}: Calculated ${grades.length} grades`);
                console.log(`${model.name}: Sample grades - first: ${grades[0]}, last: ${grades[grades.length-1]}`);
            }
            
            // Use model's rounding mode (floor for Abrunden, nearest for others)
            const roundingMode = model.roundingMode || "nearest";
            const roundedGrades = grades.map(g => roundGrade(g, granularity, roundingMode));
            if (loggingEnabled) {
                console.log(`${model.name}: Rounded grades (mode: ${roundingMode}) - first: ${roundedGrades[0]}, last: ${roundedGrades[roundedGrades.length-1]}`);
            }

            // Calculate fairness: average delta between rounded and linear grades
            const gradesData = points.map((p, i) => ({
                points: p,
                linearGrade: grades[i],
                roundedGrade: roundedGrades[i]
            }));
            const fairness = calculateFairness(gradesData);
            if (loggingEnabled) {
                console.log(`${model.name}: Fairness (avg delta) = ${fairness.toFixed(4)}`);
            }

            // Calculate grade bands once for reuse in both chart and table
            const gradeBands = calculateGradeBands(points, grades, roundedGrades);

            createChart(model.name, points, grades, roundedGrades, mp, ppp, fairness, gradeBands);
            createGradeBandsTable(model.name, gradeBands);
            createTable(model.name, points, grades, roundedGrades);
            
            if (loggingEnabled) {
                console.log(`${model.name}: Chart and table created successfully`);
            }
        } catch (error) {
            console.error(`${model.name}: ERROR during calculation:`, error);
        }
    });
    
    if (loggingEnabled) {
        console.log('=== VISUALIZATION COMPLETE ===');
    }
}

function calculateGradeBands(points, grades, roundedGrades) {
    const mp = points[points.length - 1];
    const uniqueGrades = [...new Set(roundedGrades)].sort((a, b) => b - a);
    
    return uniqueGrades.map(grade => {
        const indices = roundedGrades.map((g, i) => g === grade ? i : -1).filter(i => i !== -1);
        
        if (indices.length === 0) return null;
        
        const minPointIndex = indices[0];
        const maxPointIndex = indices[indices.length - 1];
        
        const minPoints = points[minPointIndex];
        const maxPoints = points[maxPointIndex];
        const minLinear = grades[minPointIndex];
        const maxLinear = grades[maxPointIndex];
        
        // Calculate exact boundaries with proper precision
        let exactMin = minPoints;
        let exactMax = maxPoints;
        
        if (maxPointIndex < points.length - 1) {
            // The maximum is just before the next grade starts
            exactMax = maxPoints + 0.49;
        } else {
            // If this is the last point (grade 6 at MP), cap at MP
            exactMax = maxPoints;
        }
        
        const width = exactMax - exactMin;
        
        return {
            grade,
            exactMin: exactMin.toFixed(2),
            exactMax: exactMax.toFixed(2),
            minLinear: minLinear.toFixed(3),
            maxLinear: maxLinear.toFixed(3),
            width: width.toFixed(2),
            // Also keep numeric values for chart hover
            rangeMin: exactMin,
            rangeMax: exactMax
        };
    }).filter(b => b !== null);
}

function getGradeColor(grade) {
    // Below grade 4: red, Grade 4 and above: transition from yellow to green
    if (grade < 4) {
        // Pure red to orange for failing grades
        const r = 255;
        const g = Math.max(0, Math.min(150, 150 * grade / 4));
        return `rgb(${r},${g},0)`;
    } else {
        // Yellow to green for passing grades (4 to 6)
        const r = Math.max(0, Math.min(255, 255 * (6 - grade) / 2));
        const g = 200;
        return `rgb(${r},${g},0)`;
    }
}

function getGradeColorWithAlpha(grade, alpha = 0.15) {
    // Below grade 4: red, Grade 4 and above: transition from yellow to green
    if (grade < 4) {
        // Pure red to orange for failing grades
        const r = 255;
        const g = Math.max(0, Math.min(150, 150 * grade / 4));
        return `rgba(${r},${g},0,${alpha})`;
    } else {
        // Yellow to green for passing grades (4 to 6)
        const r = Math.max(0, Math.min(255, 255 * (6 - grade) / 2));
        const g = 200;
        return `rgba(${r},${g},0,${alpha})`;
    }
}

function createGradeBandsTable(modelName, gradeBands) {
    const tableId = `${modelName.toLowerCase().replace(/ /g, '-')}-bands`;
    const tableContainer = document.getElementById(tableId);
    if (!tableContainer) return;
    
    let tableHTML = `<h4>Grade Bands</h4>`;
    tableHTML += '<table><thead><tr>';
    tableHTML += '<th>Grade</th>';
    tableHTML += '<th colspan="2">Points Range</th>';
    tableHTML += '<th colspan="2">Linear Range</th>';
    tableHTML += '<th>Width</th>';
    tableHTML += '</tr>';
    tableHTML += '<tr style="font-size: 0.7rem; color: #666;">';
    tableHTML += '<th></th>';
    tableHTML += '<th>From</th>';
    tableHTML += '<th>To</th>';
    tableHTML += '<th>From</th>';
    tableHTML += '<th>To</th>';
    tableHTML += '<th></th>';
    tableHTML += '</tr></thead><tbody>';
    
    gradeBands.forEach(band => {
        const bgColor = getGradeColorWithAlpha(band.grade, 0.15);
        tableHTML += `<tr style="background-color: ${bgColor};" data-original-bg="${bgColor}">`;
        tableHTML += `<td class="grade-cell" style="font-size: 1rem; font-weight: 600;">${band.grade.toFixed(2)}</td>`;
        tableHTML += `<td style="font-size: 0.85rem;"><strong>${band.exactMin}</strong></td>`;
        tableHTML += `<td style="font-size: 0.85rem;"><strong>${band.exactMax}</strong></td>`;
        tableHTML += `<td style="font-size: 0.85rem;">${band.minLinear}</td>`;
        tableHTML += `<td style="font-size: 0.85rem;">${band.maxLinear}</td>`;
        tableHTML += `<td class="width-cell" style="font-size: 0.85rem;">${band.width}</td>`;
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

function createChart(modelName, points, grades, roundedGrades, mp, ppp, fairness, gradeBands) {
    const chartId = `${modelName.toLowerCase().replace(/ /g, '-')}-chart`;
    const chartContainer = document.getElementById(chartId);
    if (!chartContainer) return;

    const pppPercentage = ((ppp / mp) * 100).toFixed(1);
    const mpPercentage = "100";

    // Calculate dynamic chart height to fill container
    const containerHeight = chartContainer.closest('.model-viz')?.offsetHeight || 
                           window.innerHeight - 140;
    const chartHeight = containerHeight - 20; // Account for padding

    // Split points and grades into two segments: 0 to PPP and PPP to MP
    const segmentBefore = [];
    const segmentAfter = [];
    
    points.forEach((p, i) => {
        if (p <= ppp) {
            segmentBefore.push({ x: p, y: grades[i] });
        }
        if (p >= ppp) {
            segmentAfter.push({ x: p, y: grades[i] });
        }
    });

    // Create lighter colored lines for exact grades (background reference)
    const lineBeforePPP = {
        x: segmentBefore.map(s => s.x),
        y: segmentBefore.map(s => s.y),
        mode: 'lines',
        name: 'Exact 0 → PPP',
        line: {
            color: 'rgba(255, 100, 100, 0.6)',
            width: 1.5
        },
        hoverinfo: 'skip',
        showlegend: false
    };

    const lineAfterPPP = {
        x: segmentAfter.map(s => s.x),
        y: segmentAfter.map(s => s.y),
        mode: 'lines',
        name: 'Exact PPP → MP',
        line: {
            color: 'rgba(100, 200, 100, 0.6)',
            width: 1.5
        },
        hoverinfo: 'skip',
        showlegend: false
    };
    
    // Create the rounded grades line with comprehensive hover information
    const roundedLine = {
        x: points,
        y: roundedGrades,
        mode: 'lines+markers',
        name: 'Rounded Grades',
        line: {
            width: 2.5,
            color: 'rgba(128, 128, 128, 0)' // Invisible line, we'll show segments
        },
        marker: {
            color: roundedGrades.map(getGradeColor),
            size: 6,
            line: {
                color: 'white',
                width: 1
            }
        },
        customdata: points.map((p, i) => {
            // Find the grade band this point belongs to
            const grade = roundedGrades[i];
            const band = gradeBands.find(b => b.grade === grade);
            return [
                grade,
                p,
                band?.rangeMin || p,
                band?.rangeMax || p
            ];
        }),
        hoverlabel: {
            bgcolor: roundedGrades.map(g => getGradeColorWithAlpha(g, 0.9)),
            bordercolor: 'white',
            font: { size: 13, color: 'white', family: 'Arial' }
        },
        hovertemplate: '<b>Grade %{customdata[0]:.2f}</b><br>' +
                      'This Point: %{customdata[1]:.2f}<br>' +
                      'Grade Range: %{customdata[2]:.2f} - %{customdata[3]:.2f} pts<br>' +
                      '<extra></extra>'
    };

    // Create colored line segments for rounded grades
    const roundedSegments = [];
    for (let i = 0; i < points.length - 1; i++) {
        const avgGrade = (roundedGrades[i] + roundedGrades[i + 1]) / 2;
        roundedSegments.push({
            x: [points[i], points[i + 1]],
            y: [roundedGrades[i], roundedGrades[i + 1]],
            mode: 'lines',
            line: {
                color: getGradeColor(avgGrade),
                width: 2.5
            },
            hoverinfo: 'skip',
            showlegend: false
        });
    }

    // Create invisible hover points for each grade band
    const hoverPoints = gradeBands.map(band => ({
        x: [(band.rangeMin + band.rangeMax) / 2],
        y: [band.grade],
        mode: 'markers',
        marker: {
            size: 0.1,
            opacity: 0
        },
        hoverinfo: 'skip',  // Skip these since we handle hover on the main line
        customdata: [[band.grade]],
        showlegend: false
    }));

    const data = [lineBeforePPP, lineAfterPPP, ...roundedSegments, roundedLine];

    // Dynamic X-axis tick spacing based on MP value
    let xTickSpacing = 0.5;
    if (mp > 20) {
        xTickSpacing = 1; // Only show full points above 20
    } else if (mp > 50) {
        xTickSpacing = 5; // Show every 5 points above 50
    }

    const layout = {
        xaxis: {
            title: 'Points',
            range: [0, mp],
            tickmode: 'linear',
            tick0: 0,
            dtick: xTickSpacing,
            gridcolor: '#e0e0e0',
            showgrid: true,
            showline: true,
            linewidth: 2,
            linecolor: '#333',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: '#333'
        },
        yaxis: {
            title: 'Grade',
            range: [0.75, 6.25],
            tickmode: 'array',
            tickvals: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
            gridcolor: '#e0e0e0',
            showgrid: true,
            showline: true,
            linewidth: 2,
            linecolor: '#333',
            zeroline: false
        },
        height: chartHeight,
        margin: { l: 45, r: 10, t: 10, b: 45 },  // Space for axis labels
        shapes: [
            // PPP Line
            {
                type: 'line',
                x0: ppp,
                y0: 0,
                x1: ppp,
                y1: 6,
                line: {
                    color: 'rgba(0, 0, 255, 0.4)',
                    width: 2,
                    dash: 'dash'
                }
            }
        ],
        annotations: [
            // Title annotation in top-left
            {
                x: 0,
                y: 6.2,
                xref: 'x',
                yref: 'y',
                text: `<b>${modelName}</b> (Avg Δ: ${fairness >= 0 ? '+' : ''}${fairness.toFixed(4)})`,
                showarrow: false,
                xanchor: 'left',
                yanchor: 'top',
                font: { size: 13, color: '#333' },
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                borderpad: 4
            },
            // PPP Line annotation
            {
                x: ppp,
                y: 6.1,
                xref: 'x',
                yref: 'y',
                text: `PPP: ${ppp} (${pppPercentage}%)`,
                showarrow: false,
                xanchor: 'center',
                font: { size: 11 }
            },
            // MP Line annotation
            {
                x: mp,
                y: 6.1,
                xref: 'x',
                yref: 'y',
                text: `MP: ${mp} (${mpPercentage}%)`,
                showarrow: false,
                xanchor: 'right',
                font: { size: 11 }
            }
        ],
        showlegend: false,  // Hide legend to avoid overlap with title
        hovermode: 'closest',
        hoverlabel: {
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            bordercolor: '#666',
            font: { size: 13, color: '#333' },
            align: 'left',
            namelength: -1
        },
        modebar: {
            orientation: 'v',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            color: '#666',
            activecolor: '#000'
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,  // Always visible
        modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d', 'toImage', 'resetViews'],
        modeBarButtonsToAdd: [{
            name: 'Download PNG',
            icon: Plotly.Icons.camera,
            click: function(gd) {
                Plotly.downloadImage(gd, {
                    format: 'png',
                    width: 1200,
                    height: 600,
                    filename: `${modelName.replace(/ /g, '_')}_chart`
                });
            }
        }],
        displaylogo: false,
        modeBarButtons: [[{
            name: 'Download PNG',
            icon: Plotly.Icons.camera,
            click: function(gd) {
                Plotly.downloadImage(gd, {
                    format: 'png',
                    width: 1200,
                    height: 600,
                    filename: `${modelName.replace(/ /g, '_')}_chart`
                });
            }
        }]]
    };

    // Use react() instead of newPlot() for faster updates if chart already exists
    if (chartContainer.data) {
        Plotly.react(chartContainer, data, layout, config);
    } else {
        Plotly.newPlot(chartContainer, data, layout, config);
    }
    
    // Add hover event to highlight table rows
    const bandsTableId = `${modelName.toLowerCase().replace(/ /g, '-')}-bands`;
    chartContainer.on('plotly_hover', function(eventData) {
        const point = eventData.points[0];
        if (point && point.customdata && point.customdata[0] !== undefined) {
            const grade = point.customdata[0];
            highlightGradeBandRow(bandsTableId, grade);
        }
    });
    
    chartContainer.on('plotly_unhover', function() {
        unhighlightGradeBandRow(bandsTableId);
    });
}

function highlightGradeBandRow(tableId, grade) {
    const table = document.querySelector(`#${tableId} table`);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const gradeCell = row.querySelector('.grade-cell');
        if (gradeCell) {
            const rowGrade = parseFloat(gradeCell.textContent);
            if (Math.abs(rowGrade - grade) < 0.001) {
                row.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
                row.style.transition = 'background-color 0.2s';
            }
        }
    });
}

function unhighlightGradeBandRow(tableId) {
    const table = document.querySelector(`#${tableId} table`);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const originalColor = row.getAttribute('data-original-bg');
        if (originalColor) {
            row.style.backgroundColor = originalColor;
        }
    });
}

function createTable(modelName, points, grades, roundedGrades) {
    const tableId = `${modelName.toLowerCase().replace(/ /g, '-')}-table`;
    const tableContainer = document.getElementById(tableId);
    if (!tableContainer) return;

    const mp = points[points.length - 1];

    let tableHTML = `<h3>${modelName} Model</h3>`;
    tableHTML += '<table><thead><tr>';
    tableHTML += '<th>Points</th>';
    tableHTML += '<th>% of MP</th>';
    tableHTML += '<th>Exact Grade</th>';
    tableHTML += '<th>Rounded</th>';
    tableHTML += '<th>Pass?</th>';
    tableHTML += '</tr></thead><tbody>';

    // Collect rows and sort by points descending
    const rows = [];
    points.forEach((p, i) => {
        if (p % 0.5 === 0) {
            const percentage = ((p / mp) * 100).toFixed(1);
            const pass = roundedGrades[i] >= 4 ? '✓' : '✗';
            const passStyle = roundedGrades[i] >= 4 ? 'color: green;' : 'color: red;';
            
            rows.push({
                points: p,
                html: `<tr>
                    <td>${p.toFixed(1)}</td>
                    <td>${percentage}%</td>
                    <td>${grades[i].toFixed(3)}</td>
                    <td><strong>${roundedGrades[i].toFixed(2)}</strong></td>
                    <td style="${passStyle}"><strong>${pass}</strong></td>
                </tr>`
            });
        }
    });
    
    // Sort descending by points (highest first)
    rows.sort((a, b) => b.points - a.points);
    
    // Add sorted rows to table
    rows.forEach(row => {
        tableHTML += row.html;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}
