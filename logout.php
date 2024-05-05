<?php
// Start the session
session_start();

// Replace the following with your database connection code
$servername = "localhost";
$username_db = "root";
$password_db = "";
$database = "pajoy";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username_db, $password_db);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update last logout time
    $stmt = $conn->prepare("UPDATE users SET last_logout = NOW() WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $_SESSION['user_id']);
    $stmt->execute();
}
catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit();
}

// Unset all of the session variables
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie.
// Note: This will destroy the session, and not just the session data!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session.
session_destroy();

// Redirect to the login page
header("Location: login.php");
exit;
?>