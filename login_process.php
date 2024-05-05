<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate inputs
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

    // Additional validation
    if (empty($username) || empty($password)) {
        // Empty fields
        header('Location: login.php?error=Please enter both username and password');
        exit();
    }

    // Replace the following with your database connection code
    $servername = "localhost";
    $username_db = "root";
    $password_db = "";
    $database = "pajoy";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database", $username_db, $password_db);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check credentials
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username OR email = :email");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Successful login
            $_SESSION['username'] = $user['username']; 
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['role'] = $user['role']; // Store role in session

            // Update last login time
            $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = :user_id");
            $stmt->bindParam(':user_id', $user['user_id']);
            $stmt->execute();

            // Redirect based on role
            if ($user['role'] == 'Admin') {
                header('Location: inventory.php');
            } elseif ($user['role'] == 'supplier') {
                header('Location: supplier.php');
            } else {
                // Redirect to a default page for other roles
                header('Location: selling.php');
            }
            exit();
        } else {
            // Failed login
            error_log('Login failed for user: ' . $username); // Log the error
            header('Location: login.php?error=Invalid username or password'); // Redirect back to login with error message
            exit();
        }
    }
    catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
        exit();
    }
} else {
    header('Location: login.php');
    exit();
}
?>