<?php
session_start();
$db = new mysqli('localhost', 'root', '', 'pajoy');

if ($db->connect_error) {
    die('Connect Error (' . $db->connect_errno . ') ' . $db->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the form data
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];
    $image = $_FILES['image'];

    // Validate the form data here...
    if ($image['error'] === 0) {
        $targetDir = "uploads/";
        $fileName = basename($image["name"]);
        $imageFileType = strtolower(pathinfo($fileName,PATHINFO_EXTENSION));
        
        // Create a unique name for the file
        $uniqueName = uniqid() . '.' . $imageFileType;
        $targetFile = $targetDir . $uniqueName;

        // Check if image file is a actual image or fake image
        if(getimagesize($image["tmp_name"]) !== false) {
            // Check if file already exists
            if (!file_exists($targetFile)) {
                // Check file size
                if ($image["size"] <= 2000000) {
                    // Allow certain file formats
                    if($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg" || $imageFileType == "gif" ) {
                        // if everything is ok, try to upload file
                        if (move_uploaded_file($image["tmp_name"], $targetFile)) {
                            echo "The file ". basename( $image["name"]). " has been uploaded.";
                        } else {
                            echo "Sorry, there was an error uploading your file.";
                        }
                    } else {
                        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                    }
                } else {
                    echo "Sorry, your file is too large.";
                }
            } else {
                echo "Sorry, file already exists.";
            }
        } else {
            echo "File is not an image.";
        }
    } else {
        // Handle the error
        echo "Error: " . $image['error'];
    }

    // If the password fields match, hash the password
    if ($password === $confirmPassword) {
        $password = password_hash($password, PASSWORD_DEFAULT);
    } else {
        // Handle the case where the password fields do not match
        echo "Passwords do not match.";
        exit;
    }

    // Handle the uploaded image file here...

    // Update the user's information in the database
    echo "Username: $username<br>";
echo "Email: $email<br>";
echo "Password: $password<br>";
echo "Target File: $targetFile<br>";
echo "Session Username: " . $_SESSION['username'] . "<br>";
    $sql = "UPDATE users SET username = ?, email = ?, password = ?, image = ? WHERE username = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("sssss", $username, $email, $password, $targetFile, $_SESSION['username']);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "Settings saved.";
            header("Location:inventory.php");
        } else {
            echo "Failed to save settings. No rows were affected.";
        }
    } else {
        echo "Failed to execute SQL statement: " . $stmt->error;
    }
}
?>