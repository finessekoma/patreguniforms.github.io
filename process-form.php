<?php
session_start();

// Input Validation and Sanitization
function sanitize_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

// Generate CSRF token
if (!isset($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}
$token = $_SESSION['token'];

// Validate inputs
$errors = []; // Array to store validation errors

// Validate shop numbers
if (!isset($_POST['shopNumber']) || !is_array($_POST['shopNumber'])) {
    $errors[] = "Shop numbers are required.";
} else {
    foreach ($_POST['shopNumber'] as $shopNumber) {
        // Check if each shop number is not empty and meets your validation criteria
        if (empty($shopNumber)) {
            $errors[] = "Shop number cannot be empty.";
        }
    }
}

// Validate product categories
if (!isset($_POST['productCategory']) || !is_array($_POST['productCategory'])) {
    $errors[] = "Product categories are required.";
} else {
    foreach ($_POST['productCategory'] as $category) {
        // Check if each category is not empty and meets your validation criteria
        if (empty($category)) {
            $errors[] = "Product category cannot be empty.";
        }
    }
}

// CSRF Protection
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['token']) || $_POST['token'] !== $token) {
        $errors[] = "Potential CSRF attack detected. Operation aborted.";
    }
}

// If there are validation errors, output them and halt further processing
if (!empty($errors)) {
    foreach ($errors as $error) {
        echo $error . "<br>";
    }
    exit;
}

// Database Connection (Replace with your credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pajoy";

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Start a transaction
  $conn->beginTransaction();

  // Prepared Statement for Data Insertion
  $stmt = $conn->prepare("INSERT INTO products (shopNumber, category, collar, color, size, stock, price) VALUES (?, ?, ?, ?, ?, ?, ?)");

  // Process form data
  $shopNumbers   = array_map('sanitize_input', $_POST['shopNumber']); 
  $categories    = array_map('sanitize_input', $_POST['productCategory']);
  $collars       = isset($_POST['collar']) ? array_map('sanitize_input', $_POST['collar']) : []; 
  $colors        = array_map('sanitize_input', $_POST['productColor']);
  $sizes         = array_map('sanitize_input', $_POST['productSize']);
  $quantities    = array_map('sanitize_input', $_POST['productQuantity']);
  $prices        = array_map('sanitize_input', $_POST['productPrice']);

  for ($i = 0; $i < count($shopNumbers); $i++) {
    $stmt->execute([
        $shopNumbers[$i],
        $categories[$i],
        isset($collars[$i]) ? $collars[$i] : null, // Only insert collar if it exists
        $colors[$i],
        $sizes[$i],
        $quantities[$i],
        $prices[$i]
    ]);
  }

  // Commit the transaction
  $conn->commit();

  // Success message
  echo "Products added successfully!";

} catch(PDOException $e) {
  // Rollback the transaction on error
  $conn->rollBack();
  echo "Error: " . $e->getMessage();
}

$conn = null; // Close the database connection
?>
