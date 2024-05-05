<?php
// Assuming you have a database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pajoy";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get the data
$query = "SELECT COUNT(*) as products FROM products;
          SELECT COUNT(*) as orders FROM orders;
          SELECT COUNT(*) as customers FROM customers;
          SELECT SUM(revenue) as revenue FROM orders;
          SELECT GROUP_CONCAT(product_name) as topSellingProducts FROM products ORDER BY sales DESC LIMIT 5;
          SELECT GROUP_CONCAT(product_name) as lowStockAlerts FROM products WHERE stock < 10 LIMIT 5;
          SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'Pending';
          SELECT GROUP_CONCAT(product_name) as recentlyAddedProducts FROM products ORDER BY date_added DESC LIMIT 5;";

if ($conn->multi_query($query)) {
    do {
        if ($result = $conn->store_result()) {
            $row = $result->fetch_assoc();
            echo json_encode($row);
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
} else {
    echo "Error in query: " . $conn->error;
}

$conn->close();
?>
