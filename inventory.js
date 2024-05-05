function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'block';
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'none';
}
function toggleUserOptions() {
    var userOptions = document.getElementById('userOptions');
    if (userOptions.style.display === "none") {
        userOptions.style.display = "block";
    } else {
        userOptions.style.display = "none";
    }
}

function toggleSettings() {
    var settings = document.getElementById('settings');
    if (settings.style.display === "none") {
        settings.style.display = "block";
    } else {
        settings.style.display = "none";
    }
}
function previewFile() {
    var preview = document.querySelector('#preview');
    var file    = document.querySelector('#image').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}
function toggleUserOptions() {
    var userOptions = document.getElementById('userOptions');
    if (userOptions.style.display === "none") {
        userOptions.style.display = "block";
    } else {
        userOptions.style.display = "none";
    }
}
function toggleSettings() {
    var settings = document.getElementById('settings');
    if (settings.style.display === "none") {
        settings.style.display = "block";
    } else {
        settings.style.display = "none";
    }
}
var apiEndpoint = "/pajoy/getProductCount.php";

        console.log("Before fetch");

        fetch(apiEndpoint)
            .then(response => {
                console.log("Response received");
                return response.json();
            })
            .then(data => {
                console.log("Data received:", data);

                const productCount = parseInt(data.productCount, 10);

                if (!isNaN(productCount)) {
                    document.getElementById("productCount").textContent = productCount;
                } else {
                    console.error("Error parsing productCount:", data.productCount);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                console.log("After fetch");
            });
            function updateTotalQuantity() {
                fetch('getData.php')
                    .then(response => response.text())
                    .then(quantity => {
                        document.getElementById('topSellingProducts').textContent = quantity;
                    })
                    .catch(error => console.error('Error:', error));
            }
               // Update the paths based on your directory structure


    var revenueEndpoint = "/pajoy/pajoy/getRevenue.php";

    var lowStockAlertsEndpoint = "/pajoy/pajoy/getLowStockAlerts.php";
    var pendingOrdersEndpoint = "/pajoy/pajoy/getPendingOrders.php";
    var recentlyAddedProductsEndpoint = "/pajoy/pajoy/getRecentlyAddedProducts.php";

    console.log("Before fetch");


    // Fetch data for Revenue
    fetch(revenueEndpoint)
        .then(response => response.json())
        .then(data => {
            console.log("Revenue data received:", data);
            document.getElementById("revenue").textContent = "$" + data.revenue;
        })
        .catch(error => console.error("Error fetching Revenue data:", error));

    // Fetch data for Top Selling Products

    // Fetch data for Low Stock Alerts
    fetch(lowStockAlertsEndpoint)
        .then(response => response.json())
        .then(data => {
            console.log("Low Stock Alerts data received:", data);
            document.getElementById("lowStockAlerts").textContent = data.lowStockAlerts;
        })
        .catch(error => console.error("Error fetching Low Stock Alerts data:", error));

    // Fetch data for Pending Orders
    fetch(pendingOrdersEndpoint)
        .then(response => response.json())
        .then(data => {
            console.log("Pending Orders data received:", data);
            document.getElementById("pendingOrders").textContent = data.pendingOrders;
        })
        .catch(error => console.error("Error fetching Pending Orders data:", error));

    // Fetch data for Recently Added Products
    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(response)
            return response.json();
        })
        .then(data => {
            // Log the entire data structure to the console
            console.log("Data received:", data);

            // Display the category of the first recently added product
            var recentlyAddedProductCategoryElement = document.getElementById("recentlyAddedProductCategory");
            if (data.recentlyAddedProducts.length > 0) {
                // Adjust property name based on your actual data structure
                recentlyAddedProductCategoryElement.textContent = data.recentlyAddedProducts[0].category;
            } else {
                recentlyAddedProductCategoryElement.textContent = "No recently added products.";
            }
        })
        .catch(error => {
            console.error("Error fetching or processing data:", error);
        })
        .finally(() => {
            console.log("After fetch");
        });
        
        var idCounter = 0;
// Function to set up the event listeners
function updateElements() {
    // Get all input and button elements
    var elements = document.querySelectorAll('input, button');

    // Add keydown event listener to each element
    elements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            // Check if the down or right arrow key was pressed
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                // Prevent the default action
                e.preventDefault();

                // Check if there's a next element
                if (index < elements.length - 1) {
                    // Move focus to the next element
                    elements[index + 1].focus();
                }
            }
            // Check if the up or left arrow key was pressed
            else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                // Prevent the default action
                e.preventDefault();

                // Check if there's a previous element
                if (index > 0) {
                    // Move focus to the previous element
                    elements[index - 1].focus();
                }
            }
        });
    });
}
function updateTable() {
    // Get filter values
    var category = document.getElementById('category').value;
    var shopNumber = document.getElementById('shopNumber').value;
    var size = document.getElementById('size').value.toLowerCase();
    var color = document.getElementById('color').value.toLowerCase();
    var tableBody = document.getElementById('tableBody');
    // Log filter values
    console.log('Filter Values:', { category, shopNumber, size, color });

    // Fetch data from the server (PHP script in this case)
    fetch('getData.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, shopNumber, size, color }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Clear existing rows
        tableBody.innerHTML = '';

        if (data.length === 0) {
            displayNoProductsRow();
        } else {
            displayProducts(data);
        }
    })
    .catch(handleError);
}

function displayNoProductsRow() {
    var noProductRow = document.createElement('tr');
    noProductRow.innerHTML = '<td colspan="8">No products available</td>';
    tableBody.appendChild(noProductRow);
}

function displayProducts(data) {
    // Sort the data based on the status property
    data.sort((a, b) => (a.status === 'Out of Stock') ? -1 : (b.status === 'Out of Stock') ? 1 : 0);

    // Loop through the products and display them
    data.forEach(function (product) {
        var newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${product.shopNumber}</td>
            <td>${product.product_id}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>${product.color}</td>
            <td>${product.size}</td>
            <td>${product.status}</td>
            <td>${product.price}</td>
            <td>${product.last_updated}</td>
        `;
        tableBody.appendChild(newRow);
    });
}

function handleError(error) {
    console.error('Error fetching or processing data:', error);
    alert('An error occurred while updating the table. Check the console for more details.');
}
let startDateInput, endDateInput;

window.onload = function() {
    startDateInput = document.getElementById('startDate');
    endDateInput = document.getElementById('endDate');
}
function updateOrders() {
    // Get selected dates
   
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Fetch orders from server
    fetch(`getOrders.php?startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(orders => {
            // Clear table
            ordersTableBody.innerHTML = '';

            // Add orders to table
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.customerName}</td>
                    <td>${order.category}</td>
                    <td>${order.quantity}</td>
                    <td>${order.size}</td>
                    <td>${order.color}</td>
                    <td>${order.price}</td>
                    <td>${order.status}</td>
                `;
                ordersTableBody.appendChild(row);
            });

            // Update total orders
            totalOrdersSpan.textContent = orders.length;
        });
        
        fetch(`getOrders.php?startDate=${startDate}&endDate=${endDate}`)
    .then(response => response.json())
    .then(orders => {
        // Update total orders
        document.getElementById('totalOrders').textContent = orders.length;

        // ... rest of the code ...
        
    });
}

function updateReport() {
    console.clear();
    //select the elements in the form that has the data elements
    let reportForm=document.getElementById("dateForm");
    let startDate=reportForm.querySelector("#startDate").value;
    let endDate=reportForm.querySelector('#endDate').value;
    let category=reportForm.querySelector('#category').value;
    let color =reportForm.querySelector('#color').value;
    let size= reportForm.querySelector('#size').value;
    //To validate the form
    if(startDate==="" || endDate===""){
        alert("Please select a start and end date");
        return;
    }
    //Check if the start date is greater than the end date
    if(startDate>endDate){
        alert("Start date cannot be greater than the end date");
        return;
    }
    //check if size and color are selected
    if((size==="" || isNaN(size)) && size!=="all"){
        alert("Please select a size");
        return;
    }
    if(color==="" && color!=="all"){
        alert("Please select a color");
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            handleServerResponse(xhr.responseText);
        }
    };
    xhr.open('POST', 'reports.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`startDate=${startDate}&endDate=${endDate}&category=${category}&color=${color}&size=${size}`);
}


// Function to handle the server response
function handleServerResponse(responseText) {
    //log the response
    console.log(responseText);
    try {
        const data = JSON.parse(responseText);
        if (data.error) {
            console.error('Server Error:', data.error);
        } else {
            // Update report data based on the response
            updateReportData(data);

            // Update the chart with the data from the response
            updateChart(data.salesData);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}

// Function to update report data on the webpage
function updateReportData(data) {
    //console.log each data as its own row
    let dataRow=data[0];
    document.getElementById('totalSales').textContent = dataRow.total;
    document.getElementById('profitLoss').textContent = dataRow.profit;
    //document.getElementById('mostSoldItem').textContent = data.mostSoldItem;
}


let chart; // Keep a reference to the chart

function updateChart(data) {
    // Get the chart element
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Destroy the old chart if it exists
    if (chart) {
        chart.destroy();
    }

    // Create the new chart
    if (data && data.length > 0) {
        // Create the new chart
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales',
                    backgroundColor: '#3498db',
                    borderColor: '#3498db',
                    data: data.values,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: { // Changed from 'xAxes'
                        display: true,
                        grid: {
                            display: false,
                        },
                    },
                    y: { // Changed from 'yAxes'
                        display: true,
                        grid: {
                            display: false,
                        },
                    }
                }
            }
        });
    }
}
window.onload = function(){
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'logout.php';
    });
    document.getElementById('closeForm').addEventListener('click', function() {
        document.getElementById('settings').style.display = 'none';
    });
    document.getElementById('userPanel').addEventListener('click', function() {
        toggleUserOptions();
    });
    document.addEventListener('DOMContentLoaded', updateElements);
document.querySelectorAll('.markAsShipped').forEach(function(button) {
    button.addEventListener('click', function() {
        var orderId = this.dataset.id;

        // Send a request to the server to update the order's status
        fetch('update_order_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id=' + orderId,
        })
        .then(function(response) {
            if (response.ok) {
                // If the request was successful, update the status in the table
                var statusCell = button.parentElement.previousElementSibling;
                statusCell.textContent = 'Shipped';
            } else {
                console.error('Error:', response.statusText);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    });
});
document.querySelectorAll('.deleteButton').forEach(function(button) {
    button.addEventListener('click', function() {
        var itemId = this.dataset.id;

        // Send a request to the server to delete the item
        fetch('delete_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id=' + itemId,
        })
        .then(function(response) {
            if (response.ok) {
                // If the request was successful, remove the item from the table
                button.parentElement.parentElement.remove();
            } else {
                console.error('Error:', response.statusText);
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
    });
});
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const ordersTableBody = document.getElementById('ordersTable').tBodies[0];
const totalOrdersSpan = document.getElementById('totalOrders');

// Add event listeners
startDateInput.addEventListener('change', updateOrders);
endDateInput.addEventListener('change', updateOrders);
// JavaScript
document.getElementById('removeButton').innerHTML = '<i class="fas fa-trash-alt"></i>';
document.getElementById('addButton').innerHTML = '<i class="fas fa-plus-circle"></i>';
}