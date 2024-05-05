<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "pajoy";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Update the order's status
        $stmt = $conn->prepare("UPDATE orders SET status = 'Shipped' WHERE order_id = :id");
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }

    $conn = null;
?>