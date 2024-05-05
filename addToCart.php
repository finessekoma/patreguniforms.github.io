<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(400); // Bad Request
    exit(json_encode(["status" => "error", "message" => "User not logged in"]));
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pajoy";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    exit(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $cartData = json_decode($_POST['cartData'], true);

    // Check for JSON decoding errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400); // Bad Request
        exit(json_encode(["status" => "error", "message" => "Invalid JSON data: " . json_last_error_msg()]));
    }

    if (!is_null($cartData)) {
        error_log("Received Cart Data: " . print_r($cartData, true)); // Log the received data
        handleCartData($conn, $cartData);
    } else {
        http_response_code(400); // Bad Request
        exit(json_encode(["status" => "error", "message" => "Cart data is null"]));
    }
} else {
    http_response_code(400); // Bad Request
    exit(json_encode(["status" => "error", "message" => "Invalid request method"]));
}

function handleCartData($conn, $cartData) {
    $userId = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    foreach ($cartData as $item) {
        $category = $conn->real_escape_string($item["category"]);
        $shopNumber = $conn->real_escape_string($item["shopNumber"]);
        $size = $conn->real_escape_string($item["size"]);
        $color = $conn->real_escape_string($item["color"]);
        $quantity = $conn->real_escape_string($item["quantity"]);
        $price = $conn->real_escape_string($item["price"]);
        $total = $conn->real_escape_string($item["total"]);

        $availabilityCheckQuery = "SELECT * FROM products WHERE category = '$category' AND size = '$size' AND color = '$color' AND stock >= $quantity";
        $availabilityCheckResult = $conn->query($availabilityCheckQuery);

        if ($availabilityCheckResult->num_rows > 0) {
            $row = $availabilityCheckResult->fetch_assoc();

            $unitCost = $row["price"];
            $totalCost = $unitCost * $quantity;
            $profitOrLoss = $total - $totalCost;

            $updateProductQuantityQuery = "UPDATE products SET stock = stock - $quantity, updated_by_username = '$username', quantity_updated = quantity_updated - $quantity WHERE category = '$category' AND size = '$size' AND color = '$color'";
        $conn->query($updateProductQuantityQuery);

            $insertIntoCartQuery = "INSERT INTO cart (user_id, sold_by, category, shopNumber, size, color, quantity, price, total, profit_or_loss) VALUES ('$userId', '$username', '$category', '$shopNumber', '$size', '$color', $quantity, $price, $total, $profitOrLoss)";
            $conn->query($insertIntoCartQuery);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Product $category is not available in the requested quantity. Category: $category, Size: $size, Color: $color, Requested Quantity: $quantity"
            ]);
            exit;
        }
        
    }
    $result = [
        "status" => "success",
        "message" => "Cart data received and processed successfully"
    ];
    echo json_encode($result);
    exit;
}
?>
