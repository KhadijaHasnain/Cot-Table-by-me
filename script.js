// Function to create arrow icons
function createArrowIcon(order) {
    const arrow = document.createElement('span');
    arrow.className = order === 'asc' ? 'arrow-up' : 'arrow-down';
    return arrow;
}

// Function to toggle sorting order and update the table
function toggleSortOrder(columnKey) {
    const sortOrder = columnKey === currentSortColumn ? (currentSortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    currentSortColumn = columnKey;
    currentSortOrder = sortOrder;

    loadCOTReport(); // Reload the table with updated sorting
}

function loadCOTReport() {
    // Fetch COT report data (replace this with your actual data fetching logic)
    const cotData = [
        { pair: 'BTC/USD', signal: 'Buy', cotSignal: 'Strong Buy', cotShift: 'Long', statement: 'Bullish', longPercent: 60, shortPercent: 40, breakdownPoints: 4, fiveDaysChange: 2.5, dailyPipRank: 1 },
        // Add more coin data as needed
    ];

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = cotData.filter(coin => coin.pair.toLowerCase().includes(searchInput));

    const cotTable = document.getElementById('cotTable');
    cotTable.innerHTML = ''; // Clear previous table content

    if (filteredData.length > 0) {
        const table = document.createElement('table');

        // Create table header
        const headerRow = table.insertRow(0);
        Object.keys(filteredData[0]).forEach(key => {
            const th = document.createElement('th');

            // Add sorting functionality to each column header
            if (key !== 'breakdownPoints' && key !== 'longPercent' && key !== 'shortPercent') {
                const headerText = document.createElement('div');
                headerText.appendChild(document.createTextNode(key));

                // Display arrow icon based on sorting order
                if (key === currentSortColumn) {
                    headerText.appendChild(createArrowIcon(currentSortOrder));
                }

                th.appendChild(headerText);
                th.addEventListener('click', () => toggleSortOrder(key));
                th.style.cursor = 'pointer';
            } else {
                th.textContent = key;
            }

            headerRow.appendChild(th);
        });

        // Create table rows
        filteredData.sort((a, b) => {
            const sortOrder = currentSortOrder === 'asc' ? 1 : -1;
            return String(a[currentSortColumn]).localeCompare(String(b[currentSortColumn])) * sortOrder;
        }).forEach(coin => {
            const row = table.insertRow();

            Object.entries(coin).forEach(([key, value]) => {
                const cell = row.insertCell();

                // Check if the key is 'longPercent' or 'shortPercent' to display percentage bars
                if (key === 'longPercent' || key === 'shortPercent') {
                    const progressBar = document.createElement('div');
                    progressBar.className = 'progress-bar';
                    const progressValue = document.createElement('span');
                    progressValue.style.width = `${value}%`;
                    progressValue.style.backgroundColor = key === 'longPercent' ? '#5cb85c' : '#d9534f'; // Green for long, Red for short
                    progressBar.appendChild(progressValue);
                    cell.appendChild(progressBar);
                } else if (key === 'breakdownPoints') {
                    // Display star rating for breakout points
                    const starRating = document.createElement('div');
                    starRating.className = 'star-rating';
                    for (let i = 0; i < 10; i++) {
                        const star = document.createElement('span');
                        star.innerHTML = '&#9733;'; // Unicode character for a filled star
                        if (i >= value) {
                            star.style.color = '#ccc'; // Color for unfilled stars
                        }
                        starRating.appendChild(star);
                    }
                    cell.appendChild(starRating);
                } else {
                    cell.textContent = value;
                }
            });
        });

        cotTable.appendChild(table);
    } else {
        cotTable.textContent = 'No matching coins found.';
    }
}

// Initial sorting state
let currentSortColumn = 'pair';
let currentSortOrder = 'asc';

// Load COT report on page load
window.onload = loadCOTReport;
