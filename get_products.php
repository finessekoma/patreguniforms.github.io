<?php
// Database
$host = 'localhost';
$db   = 'pajoy';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $opt);

$category = $_POST['category'];
$shopNumber = $_POST['shopNumber'];
$size = $_POST['size'];
$color = $_POST['color'];

$stmt = $pdo->prepare('SELECT * FROM products WHERE category = ? AND shop_number = ? AND size = ? AND color = ?');
$stmt->execute([$category, $shopNumber, $size, $color]);

while ($row = $stmt->fetch()) {
    echo '<tr>';
    echo '<td>' . htmlspecialchars($row['shop_number'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['product_id'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['category'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['quantity'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['color'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['size'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['status'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['price'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '<td>' . htmlspecialchars($row['last_updated'], ENT_QUOTES, 'UTF-8') . '</td>';
    echo '</tr>';
}
?>