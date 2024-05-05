
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
function updateTable() {
    // Get filter values
    var category = document.getElementById('category').value;
    var shopNumber = document.getElementById('shopNumber').value; // Use the user-selected value
    var size = document.getElementById('size').value.toLowerCase();
    var color = document.getElementById('color').value.toLowerCase();

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
    .then(response => response.json())
    .then(data => {
        // Clear existing rows
        tableBody.innerHTML = '';

        // Check if there are no products
        if (data.length === 0) {
            var noProductRow = document.createElement('tr');
            noProductRow.innerHTML = '<td colspan="8">No products available</td>';
            tableBody.appendChild(noProductRow);
        } else {
            // Sort the data based on the status property
            data.sort((a, b) => {
                if (a.status === 'Out of Stock' && b.status !== 'Out of Stock') {
                    return -1;
                } else if (a.status !== 'Out of Stock' && b.status === 'Out of Stock') {
                    return 1;
                }
                return 0;
            });

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
                `;
                tableBody.appendChild(newRow);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Check the console for details.');
    });
}
// Function to handle "Add to Cart" button click
let cartItems = [];
function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}
function displayCart() {
    const cartTableBody = document.getElementById('cartItemsTableBody');
    cartTableBody.innerHTML = '';

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>${item.shopNumber}</td>
            <td>${item.color}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartTableBody.appendChild(row);
    });

    updateCartTotal();
}

function addToCart() {
    const getCategoryValue = id => document.getElementById(id).value.trim();
    const category = getCategoryValue('category1');
    const shopNumber = getCategoryValue('shopNumber1');
    const color = getCategoryValue('color1');
    const size = getCategoryValue('size1');
    const quantity = getCategoryValue('quantity1');
    const price = getCategoryValue('price');

    if (!category || !shopNumber || !color || !size || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    const existingItem = findCartItem(category, size, shopNumber, color);

    if (existingItem) {
        const existingQuantity = parseInt(existingItem.cells[5].innerText);
        existingItem.cells[5].innerText = existingQuantity;
    } else {
        const cartItem = {
            category,
            shopNumber,
            color,
            size,
            quantity,
            price,
            total: quantity * price
        };

        cartItems.push(cartItem);
        updateCartItemsTable();
        updateCartTotal();
    }

    const cartData = JSON.stringify(cartItems);

    if (!isValidJson(cartData)) {
        alert('Invalid JSON data');
        return;
    }

    fetch('addToCart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItems),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Server response is not OK: ' + response.statusText);
        }
    })
    .then(data => {
        if (data.status === 'success') {
            updateCartUI(data.cartItems);
        } else if (data.status === 'error' && data.message.includes('Product is not available')) {
            alert('Sorry, the selected product is not available in the requested quantity.');
        } else {
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
    });
}


function findCartItem(category, size, shopNumber, color1) {
    const rows = document.getElementById('cartItemsTableBody').rows;
    for (let i = 0; i < rows.length; i++) {
        const [cat, siz, shop, col] = rows[i].cells;
        if (
            cat.innerText === category &&
            siz.innerText === size &&
            shop.innerText === shopNumber &&
            col.innerText === color1
        ) {
            return rows[i];
        }
    }
    return null;
}

function updateTotal() {
    const rows = document.getElementById('cartItemsTableBody').rows;
    const total = Array.from(rows).reduce((sum, row) => sum + parseFloat(row.cells[6].innerText), 0);
    document.getElementById('cartTotal').innerText = '$' + total.toFixed(2);
}

function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartItemsTable();
    updateTotal();
}

function updateCartItemsTable() {
    const tableBody = document.getElementById('cartItemsTableBody');
    tableBody.innerHTML = '';

    cartItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.size}</td>
            <td>${item.shopNumber}</td>
            <td>${item.color}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.total}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('cartTotal').innerText = '$' + total.toFixed(2);
}
function removeFromCart(index) {
    // Remove the item at the specified index
    cartItems.splice(index, 1);

    // Update the cart items table and total
    updateCartItemsTable();
    updateCartTotal();
}
async function filterSales() {
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var categoryFilter = document.getElementById('categoryFilter').value;

    // Get the user's ID from the session
    var userId = sessionStorage.getItem('userId');

    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('categoryFilter', categoryFilter);
    formData.append('userId', userId);

    try {
        const response = await fetch('sales.php', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();

            if (data.message) {
                // Display the message
                showNoSalesMessage();
            } else {
                // Display the filtered sales in the sales log
                hideNoSalesMessage();
                displaySalesLog(data);
            }
        } else {
            try {
                const errorData = await response.json();
                console.error(errorData.error);
                alert('Error fetching sales data: ' + errorData.error || 'Unexpected error');
            } catch (error) {
                console.error('Unexpected error format:', error);
                alert('Error fetching sales data');
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('Error fetching sales data');
    }
}
function displaySalesLog(data) {
    var salesLogTableBody = document.getElementById('salesLog');
    salesLogTableBody.innerHTML = '';

    if (Array.isArray(data) && data.length === 0) {
        var noSalesRow = document.createElement('tr');
        noSalesRow.innerHTML = '<td colspan="6">No sales found for the selected criteria. Please adjust your filters and try again.</td>';
        salesLogTableBody.appendChild(noSalesRow);
    } else if (Array.isArray(data)) {
        data.forEach(function (sale) {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(sale.date_added).toLocaleDateString()}</td>
                <td>${sale.category}</td>
                <td>${sale.color}</td>
                <td>${sale.size}</td>
                <td>${sale.quantity}</td>
                <td>$${Number(sale.total).toFixed(2)}</td>
            `;
            salesLogTableBody.appendChild(row);
        });
    } else {
        console.log(data.message);
    }
}
function hideNoSalesMessage() {
    var noSalesMessage = document.getElementById('noSalesMessage');
    if (noSalesMessage) {
        noSalesMessage.style.display = 'none';
    }
}
window.onload = function() {
    document.getElementById('completeTransactionBtn').addEventListener('click', function() {
        // Convert the cart items array to JSON
        let cartData = JSON.stringify(cartItems);
    
        // Set the value of the hidden input field
        document.getElementById('cartData').value = cartData;
    
        // Submit the form
        document.getElementById('checkoutForm').submit();
    });
    document.getElementById('addToCart').addEventListener('click', addToCart);
    document.getElementById('closeForm').addEventListener('click', function() {
        document.getElementById('settings').style.display = 'none';
    });
    document.getElementById('userPanel').addEventListener('click', function() {
        toggleUserOptions();
    });
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'logout.php';
    });
}