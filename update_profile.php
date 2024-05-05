<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die("Error: User not logged in");
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Connect to your database (replace these with your actual database credentials)
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

    // Get form data
    $username = $_POST["username"];
    $email = $_POST["email"];
    $newPassword = $_POST["newPassword"];
    $userId = $_SESSION['user_id'];
    
    // Update username and email
    $updateUserQuery = "UPDATE users SET username = '$username', email = '$email' WHERE user_id = $userId";
    if ($conn->query($updateUserQuery) === TRUE) {
        echo "Username and Email updated successfully!";
    } else {
        echo "Error updating Username and Email: " . $conn->error;
    }

    // Update password if a new password is provided
    if (!empty($newPassword)) {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $updatePasswordQuery = "UPDATE users SET password = '$hashedPassword' WHERE user_id = $userId";

        if ($conn->query($updatePasswordQuery) === TRUE) {
            header("Location:inventory.php");
            echo "Password updated successfully!";
        } else {
            echo "Error updating Password: " . $conn->error;
        }
    }

    // Update image if a new image is uploaded
    if (!empty($_FILES["profileImage"]["name"])) {
        $targetDir = "uploads/"; // Specify the directory where you want to store uploaded images
        $targetFile = $targetDir . basename($_FILES["profileImage"]["name"]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Check if the image file is a actual image or fake image
        $check = getimagesize($_FILES["profileImage"]["tmp_name"]);
        if ($check !== false) {
            $uploadOk = 1;
        } else {
            echo "File is not an image.";
            $uploadOk = 0;
        }

        // Check file size
        if ($_FILES["profileImage"]["size"] > 5000000) {
            echo "Sorry, your file is too large.";
            $uploadOk = 0;
        }

        // Allow certain file formats
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($imageFileType, $allowedTypes)) {
            echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            echo "Sorry, your file was not uploaded.";
        } else {
            // if everything is ok, try to upload file
            if (move_uploaded_file($_FILES["profileImage"]["tmp_name"], $targetFile)) {
                // Update the database with the new image path
                $updateImageQuery = "UPDATE users SET profileImage = '$targetFile' WHERE user_id = $userId";
                if ($conn->query($updateImageQuery) === TRUE) {
                    echo "Image updated successfully!";
                    header("Location: inventory.php");
                } else {
                    echo "Error updating Image: " . $conn->error;
                }
            } else {
                echo "Sorry, there was an error uploading your file.";
            }
        }
    }
    // Close the connection
    $conn->close();
}
?>
