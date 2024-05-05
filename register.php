<?php
session_start();

// Include database connection
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'pajoy');

// Attempt to connect to MySQL database
$mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
    exit();
}

// Define variables and initialize with empty values
$username = $email = $password = $confirmPassword = $role = "";
$username_err = $email_err = $password_err = $confirmPassword_err = $role_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validate username
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter a username.";
    } else {
        // Prepare a select statement
        $sql = "SELECT user_id FROM users WHERE username = ?";

        if ($stmt = $mysqli->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("s", $param_username);

            // Set parameters
            $param_username = trim($_POST["username"]);

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Store result
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    $username_err = "This username is already taken.";
                } else {
                    $username = trim($_POST["username"]);
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }

    // Validate email
    if (empty(trim($_POST["email"]))) {
        $email_err = "Please enter your email.";
    } else {
        $email = trim($_POST["email"]);
    }

    // Validate password
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter a password.";
    } elseif (strlen(trim($_POST["password"])) < 6) {
        $password_err = "Password must have at least 6 characters.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validate confirm password
    if (empty(trim($_POST["confirmPassword"]))) {
        $confirmPassword_err = "Please confirm password.";
    } else {
        $confirmPassword = trim($_POST["confirmPassword"]);
        if (empty($password_err) && ($password != $confirmPassword)) {
            $confirmPassword_err = "Password did not match.";
        }
    }

    // Validate role
    if (empty(trim($_POST["role"]))) {
        $role_err = "Please select a role.";
    } else {
        $role = trim($_POST["role"]);
    }
    if ($_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
        $imageDir = "uploads/"; // Directory where images will be stored
        $imageName = $_FILES['profileImage']['name'];
        $imageTmpName = $_FILES['profileImage']['tmp_name'];
        $imageType = $_FILES['profileImage']['type'];

        // Check if the uploaded file is an image
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($imageType, $allowedTypes)) {
            $image_err = "Only JPG, JPEG, PNG, and GIF files are allowed.";
        } else {
            // Move uploaded file to destination directory
            $imagePath = $imageDir . $imageName;
            move_uploaded_file($imageTmpName, $imagePath);
        }
    } else {
        $image_err = "Error uploading image.";
    }
    // Check input errors before inserting into database
    if (empty($username_err) && empty($email_err) && empty($password_err) && empty($confirmPassword_err) && empty($role_err)) {

        // Prepare an insert statement
        $sql = "INSERT INTO users (username, email, password, role,profileImage) VALUES (?, ?, ?, ?,?)";

        if ($stmt = $mysqli->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("sssss", $param_username, $param_email, $param_password, $param_role, $param_profileImage);

            // Set parameters
            $param_username = $username;
            $param_email = $email;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
            $param_role = $role;
            $param_profileImage = $imagePath;

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Redirect to login page
                header("location: inventory.php");
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }

    // Close connection
    $mysqli->close();
}
?>