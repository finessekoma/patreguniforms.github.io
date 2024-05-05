<?php
// Assuming you have a database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pajoy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to get order count
function getOrderCount($conn) {
    $sql = "SELECT COUNT(*) AS orderCount FROM orders";
    $result = $conn->query($sql);

    if ($result === false) {
        return 0;
    }

    $row = $result->fetch_assoc();
    return $row["orderCount"];
}

// Function to get customer count
function getCustomerCount($conn) {
    $sql = "SELECT COUNT(*) AS customerCount FROM customers";
    $result = $conn->query($sql);

    if ($result === false) {
        return 0;
    }

    $row = $result->fetch_assoc();
    return $row["customerCount"];
}

// Function to get total revenue
function getRevenue($conn) {
    $sql = "SELECT SUM(total_amount) AS totalRevenue FROM orders";
    $result = $conn->query($sql);

    if ($result === false) {
        return 0;
    }

    $row = $result->fetch_assoc();
    return $row["totalRevenue"];
}

// Function to get low stock alerts count
function getLowStockAlerts($conn) {
    $sql = "SELECT COUNT(*) AS lowStockCount FROM products WHERE stock_quantity < 10";
    $result = $conn->query($sql);

    if ($result === false) {
        return 0;
    }

    $row = $result->fetch_assoc();
    return $row["lowStockCount"];
}

// Function to get pending orders count
function getPendingOrders($conn) {
    $sql = "SELECT COUNT(*) AS pendingOrdersCount FROM orders WHERE status = 'Pending'";
    $result = $conn->query($sql);

    if ($result === false) {
        return 0;
    }

    $row = $result->fetch_assoc();
    return $row["pendingOrdersCount"];
}

// Function to get recently added products
function getRecentlyAddedProducts($conn) {
    $sql = "SELECT * FROM products ORDER BY date_added DESC LIMIT 5";
    $result = $conn->query($sql);

    if ($result === false) {
        return [];
    }

    $recentlyAddedProducts = [];
    while ($row = $result->fetch_assoc()) {
        $recentlyAddedProducts[] = $row;
    }

    return $recentlyAddedProducts;
}

// Close the database connection
$conn->close();

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode([
    'orderCount' => getOrderCount($conn),
    'customerCount' => getCustomerCount($conn),
    'revenue' => getRevenue($conn),
    'lowStockAlerts' => getLowStockAlerts($conn),
    'pendingOrders' => getPendingOrders($conn),
    'recentlyAddedProducts' => getRecentlyAddedProducts($conn),
]);
?>
