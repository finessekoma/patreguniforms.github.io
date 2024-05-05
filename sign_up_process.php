<?php
// Database connection
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

// Select all products
$stmt = $conn->prepare("SELECT * FROM products");
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $key = $row['shopNumber'].$row['category'].$row['color'].$row['size'];
    if (!isset($products[$key])) {
        $products[$key] = $row;
    } else {
        // Merge products
        $products[$key]['quantity'] += $row['quantity'];
        $products[$key]['status'] = $products[$key]['quantity'] > 0 ? 'In Stock' : 'Out of Stock';
    }
}

// Clear products table
$stmt = $conn->prepare("TRUNCATE TABLE products");
$stmt->execute();

// Insert merged products
$stmt = $conn->prepare("INSERT INTO products (shopNumber, category, color, size, quantity, price, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($products as $product) {
    $stmt->bind_param("ssssiis", $product['shopNumber'], $product['category'], $product['color'], $product['size'], $product['quantity'], $product['price'], $product['status']);
    $stmt->execute();
}

echo "Products merged successfully";

// Close the statement and the connection
$stmt->close();
$conn->close();
?>