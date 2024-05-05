<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="login.css">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
   
</head>
<body>
    <div class="container">
        <img src="j.png">
        <h2>Login</h2>
        <form method="post" action="login_process.php">
            <div>
                <label for="username">Username/Email:</label>
                <?php
                if (isset($_GET['error']) && $_GET['error'] == 'Invalid username') {
                    echo '<p class="error">' . htmlspecialchars($_GET['error']) . '</p>';
                }
                ?>
                <input type="text" id="username" name="username" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <?php
                if (isset($_GET['error']) && $_GET['error'] == 'Invalid password') {
                    echo '<p class="error">' . htmlspecialchars($_GET['error']) . '</p>';
                }
                ?>
                <input type="password" name="password" required>
            </div>
            <label>
                <input type="checkbox" name="remember"> Remember Me
            </label>

            <button type="submit">Login</button>
        </form>
                <div class="forgot-password">
                <a href="#" onclick="forgotPassword()">Forgot Password?</a>
        </div>
        <!-- Other sections here -->
        <div>
    </div>
            </body>
            <script>
function forgotPassword() {
    alert("Please contact the admin at kennedymaina302@gmail.com");
}
</script>
</html>
