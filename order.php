<?php
$servername="localhost";
$username="root";
$password="";
$database="pajoy";
try{
$conn = new PDO("mysql: host=$servername;  dbname=$database",$username, $password,);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e){
    echo "Connection failed: " . $e->getMessage();
    exit;
}
$CustomerName = isset($_POST['CustomerName']) ? filter_var($_POST['CustomerName'], FILTER_SANITIZE_STRING) : '';
$category = isset($_GET['category']) ? filter_var($_GET['category'], FILTER_SANITIZE_STRING) : 'All';
$size = isset($_GET['size']) ? filter_var($_GET['size'], FILTER_SANITIZE_STRING) : '';
$color = isset($_GET['color']) ? filter_var($_GET['color'], FILTER_SANITIZE_STRING) : '';
$quantity = isset($GET['quantity']) ? filter_var($_GET['quantity'], FILTER_SANITIZE_STRING) : '';
$price = isset($GET['price']) ? filter_var($_GET['price'], FILTER_SANITIZE_STRING) : '';

$sql = "INSERT INTO orders (category, size, color, quantity, price) VALUES (?, ?, ?, ?, ?)";

?>