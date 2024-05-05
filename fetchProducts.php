<?php
// 1. Database Connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pajoy";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit; // Stop the script and perhaps log the error
}

// 2. Get Filter Parameters (Sanitize!)
$category = isset($_GET['category']) ? filter_var($_GET['category'], FILTER_SANITIZE_STRING) : 'All';
$shop = isset($_GET['shop']) ? filter_var($_GET['shop'], FILTER_SANITIZE_STRING) : 'All';
$size = isset($_GET['size']) ? filter_var($_GET['size'], FILTER_SANITIZE_STRING) : ''; 
$color = isset($_GET['color']) ? filter_var($_GET['color'], FILTER_SANITIZE_STRING) : '';

// 3. Build Dynamic SQL Query
$sql = "SELECT * FROM your_products_table WHERE 1=1"; // Base query

if ($category !== 'All') {
    $sql .= " AND category = :category";
}
if ($shop !== 'All') {
    $sql .= " AND shopNo = :shop";
}
if (!empty($size)) {
    $sql .= " AND size LIKE :size"; 
}
if (!empty($color)) {
    $sql .= " AND color LIKE :color";
}

// 4. Prepare and Execute the Query
$stmt = $conn->prepare($sql);

if ($category !== 'All') {
    $stmt->bindParam(':category', $category);
}
if ($shop !== 'All') {
    $stmt->bindParam(':shop', $shop);
}
if (!empty($size)) {
    $stmt->bindParam('size', '%' . $size . '%'); // LIKE for partial matches
}
if (!empty($color)) {
    $stmt->bindParam('color', '%' . $color . '%');
}

$stmt->execute();

// 5. Fetch Results and Format as JSON
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
header('Content-Type: application/json');
echo json_encode($data);
?>
