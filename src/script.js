var currentUser = null;
var tableData = [];

// Function to authenticate the user
function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "admin" && password === "password") {
        currentUser = username;
        loadDashboard();
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

// Function to load the dashboard page
function loadDashboard() {
    if (currentUser !== null) {
        window.location.href = "dashboard.html";
    } else {
        alert("Please login to access the dashboard.");
    }
}

// Function to logout the user
function logout() {
    currentUser = null;
    window.location.href = "index.html";
}

// Function to read data from a CSV file and populate the table
window.onload = function () {
    if (window.location.pathname.includes("dashboard.html")) {
        showProgressCircle();
        // Read the CSV file and process the data

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "data.csv", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = xhr.responseText;
                processData(data);
                populateTable();
                hideProgressCircle();
            }
        };
        xhr.send();
    }
};

// Function to process the CSV data
function processData(csvData) {
    var lines = csvData.split("\n");
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var cells = lines[i].split(",");
        var rowData = {
            // salesOrg: cells[0],
            // deliveryDate: cells[1],
            // deliveryNo: cells[2],
            // deliverySatus: cells[4]
        };

        for (var j = 0; j < headers.length; j++) {
            rowData[headers[j]] = cells[j];
        }

        tableData.push(rowData);
    }
}

// Function to populate the table with data
function populateTable() {
    var table = document.getElementById("data-table");
    var headers = Object.keys(tableData[0]);

    // Create table header row
    var headerRow = document.createElement("tr");
    for (var i = 0; i < headers.length; i++) {
        var headerCell = document.createElement("th");
        headerCell.innerHTML = headers[i];
        headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Create table body rows
    for (var i = 0; i < tableData.length; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < headers.length; j++) {
            var cell = document.createElement("td");
            cell.innerHTML = tableData[i][headers[j]];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Function to filter the table based on user input
function filterTable() {
    var filterInput = document.getElementById("filterDropdown");
    var filterValue = filterInput.value.toUpperCase();
    var table = document.getElementById("data-table");
    var rows = table.getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var searchCell = rows[i].getElementsByTagName("td")[4];
        if (searchCell) {
            var searchValue = searchCell.innerHTML.toUpperCase();
            if (searchValue.indexOf(filterValue) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Function to download the table data as an Excel sheet
function downloadExcel() {
    var table = document.getElementById("data-table");
    var filteredData = [];

    for (var i = 1; i < table.rows.length; i++) {
        if (table.rows[i].style.display !== "none") {
            var rowData = [];
            for (var j = 0; j < table.rows[i].cells.length; j++) {
                rowData.push(table.rows[i].cells[j].innerText);
            }
            filteredData.push(rowData);
        }
    }

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet([Array.from(table.rows[0].cells).map(cell => cell.innerText), ...filteredData]);
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
    XLSX.writeFile(wb, "data.xlsx");
}

// Function to save the Excel file
function saveExcelFile(buffer, filename) {
    var blob = new Blob([buffer], { type: "application/octet-stream" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Function to filter the table based on user input
function filterDelDate() {
    var filterFromInput = document.getElementById("filterFromInput");
    var filterToInput = document.getElementById("filterToInput");
    var filterFromValue = filterFromInput.value;
    var filterToValue = filterToInput.value;

    var table = document.getElementById("data-table");
    var rows = table.getElementsByTagName("tr");

    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName("td");
        var deliveryDateCell = cells[1];

        if (deliveryDateCell) {
            var deliveryDateValue = deliveryDateCell.innerHTML;

            if (isDateInRange(deliveryDateValue, filterFromValue, filterToValue)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// Function to check if a date is within the given range
function isDateInRange(dateString, fromDate, toDate) {
    // var date = new Date(dateString);
    // var fromDateObj = new Date(fromDate);
    // var toDateObj = new Date(toDate);

    if (!isNaN(dateString) && !isNaN(fromDate) && !isNaN(toDate)) {
        return dateString >= fromDate && dateString <= toDate;
    }

    return false;
}

// Function to show the progress circle
function showProgressCircle() {
    var progressCircle = document.getElementById("progress-circle");
    progressCircle.style.display = "block";
}

// Function to hide the progress circle
function hideProgressCircle() {
    var progressCircle = document.getElementById("progress-circle");
    progressCircle.style.display = "none";
}