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

// Fetch unique product categories from the database
$stmtCategories = $conn->prepare("SELECT DISTINCT category FROM products");
$stmtCategories->execute();
$resultCategories = $stmtCategories->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delete Products</title>
</head>
<body>

<h2>Delete Products</h2>

<form method="post" action="">
    <label for="productCategory">Select Product Category:</label>
    <select id="productCategory" name="productCategory" required>
        <option value="">Select Category</option>
        <?php
        while ($rowCategory = $resultCategories->fetch_assoc()) {
            echo '<option value="' . $rowCategory['category'] . '">' . $rowCategory['category'] . '</option>';
        }
        ?>
    </select>
    <button type="submit" name="deleteProducts">Delete Products</button>
</form>

<?php
if (isset($_POST['deleteProducts'])) {
    // Get the selected product category
    $selectedCategory = $_POST['productCategory'];

    // Your delete logic goes here based on the selected category
    // Example: Delete all products in the selected category
    $stmtDelete = $conn->prepare("DELETE FROM products WHERE category = ?");
    $stmtDelete->bind_param("s", $selectedCategory);
    $stmtDelete->execute();

    echo "Products in the category '$selectedCategory' deleted successfully.";
}
?>

</body>
</html>

<?php
// Close the connection
$conn->close();
?>
