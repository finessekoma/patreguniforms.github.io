    // Function to open the edit modal
    function openEditModal(productId) {
        // Get the modal element
        var editModal = document.getElementById('editProductModal');
        //make the editModalitem visible
        editModal.style.display="block";
        // Get the form elements
        var editForm = document.getElementById('editForm');
        var editProductCategory = document.getElementById('editProductCategory');
        var editProductColor = document.getElementById('editProductColor');
        var editProductSize = document.getElementById('editProductSize');
        var editProductQuantity = document.getElementById('editProductQuantity');
        var editProductPrice = document.getElementById('editProductPrice');
    
        // Get the product data from the database
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                product = JSON.parse(this.responseText);
    
                // Set the form values
                editProductCategory.value = product.category;
                editProductColor.value = product.color;
                editProductSize.value = product.size;
                editProductQuantity.value = product.quantity;
                editProductPrice.value = product.price;
    
                // Set the form action attribute
                editForm.action = 'process-form.php?productId=' + product.product_id;
    
                // Display the modal
                editModal.style.display = 'block';
            }
        };
        xhttp.open("GET", "get-product.php?productId=" + productId, true);
        xhttp.send();
    }
    // Close Edit Modal when close button is clicked or outside of it's area
    function closeEditModal() {
        var editModal = document.getElementById('editProductModal');
        editModal.style.display = 'none';
    }
    $(document).ready(function(){
        // Add event listener for the form submit
        $('#productForm').submit(function(e){
            // Prevent the form from submitting
            e.preventDefault();
    
            // Get the form data
            var formData = $(this).serialize();
    
            // Send the form data to process-form.php
            $.ajax({
                type: 'POST',
                url: 'process-form.php',
                data: formData,
                success: function(response){
                    // Display the success message
                    alert(response);
    
                    // Reload the page
                    location.reload();
                },
                error: function(){
                    // Display the error message
                    alert('There was an error while adding the product.');
                }
            });
        });
    });
    // Function to confirm product deletion
    function confirmDelete(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            // If the user confirms, delete the product
            deleteProduct(productId);
        }
    }
    // Delete a Product by ID using AJAX and reload the page after completion
    function deleteProduct(productId) {
        $.ajax({
            type: 'GET',
            url: 'delete-product.php?productId=' + productId,
            success: function(response){
                // Display the success message
                alert(response);
    
                // Reload the page
                location.reload();
            },
            error: function(){
                // Display the error message
                alert('There was an error while deleting the product.');
            }
        });
    }
    // Function to update the total quantity
    function updateTotalQuantity() {
        // Get the search input element
        var searchInput = document.getElementById('search');
    
        // Get the total quantity element
        var totalQuantity = document.getElementById('totalQuantity');
    
        // Get the table rows
        var rows = document.getElementsByTagName('tr');
    
        // Initialize the total quantity
        var total = 0;
    
        // Loop through the rows
        for (var i = 1; i < rows.length; i++) {
            // Get the product name from the 1st column
            var productName = rows[i].getElementsByTagName('td')[0].innerHTML;
    
            // Check if the product name contains the search input value
            if (productName.toLowerCase().includes(searchInput.value.toLowerCase())) {
                // Add the quantity to the total
                total += parseInt(rows[i].getElementsByTagName('td')[1].innerHTML);
            }
        }
    
        // Update the total quantity
        totalQuantity.innerHTML = total;
    }
    $(document).ready(function() {
        // Capture product ID when user clicks on edit button
        $('.edit-button').click(function() {
            var productId = $(this).data('product-id');
    
            // Send AJAX request to server
            $.ajax({
                url: 'get_product_details.php',
                type: 'POST',
                data: {productId: productId},
                success: function(response) {
                    // Populate form fields with data
                    $('#editProductCategory').val(response.category);
                    $('#editProductColor').val(response.color);
                    $('#editProductSize').val(response.size);
                    $('#editProductQuantity').val(response.quantity);
                    $('#editProductPrice').val(response.price);
    
                    // Show edit modal
                    $('#editProductModal').show();
                }
            });
        });
    });
   // Sample data for the chart
   var chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: 'Profits',
            data: [10, 20, 15, 25, 30, 18, 22],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            label: 'Losses',
            data: [2, 5, 3, 8, 4, 10, 5],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
};

// Get the canvas element
var ctx = document.getElementById('dashboardChart').getContext('2d');

// Create a bar chart
var myChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// Function to generate and display the profit and loss report
function generateProfitLossReport() {
var profitLossReportElement = document.getElementById('profitLossReport');
var profitLossChartCanvas = document.getElementById('profitLossChart').getContext('2d');

// Sample data for the chart (replace with your actual data)
var data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
        label: 'Profit and Loss',
        data: [5000, 7000, -2000, 4000, 6000],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
    }],
};

// Chart configuration
var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

// Create the profit and loss chart
var profitLossChart = new Chart(profitLossChartCanvas, {
    type: 'line', // You can use other types like bar, pie, etc.
    data: data,
    options: options,
});

profitLossReportElement.innerHTML = ''; // Clear any previous content
profitLossReportElement.appendChild(profitLossChartCanvas); // Append the chart canvas to the report element
}
