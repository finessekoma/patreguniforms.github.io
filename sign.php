<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <meta name="google-signin-client_id" content="417382000687-6adplqf0l4b75m11cfcsg5c2m5jsl5c6.apps.googleusercontent.com">
</head>
<body>
    <div class="signup-container">
        <img src="j.png" alt="Logo">
        <h1>Create an Account</h1>
        <form id="signup-form" action="register.php" method="post" enctype="multipart/form-data" onsubmit="return validateForm()">            <div class="signup-form">
                <div class="wrapper">
                    <input type="text" placeholder="UserName" id="username" name="username" required>
                    <input type="email" placeholder="Email" id="email" name="email" required>
                    <div class="password-input">
                        <input type="password" placeholder="Password" id="password" name="password" required>
                        <i class="fas fa-eye-slash show-btn" onclick="togglePasswordVisibility('password')"></i>
                    </div>
                    <div class="password-input">
                        <input type="password" placeholder="Confirm Password" id="confirm-password" name="confirmPassword" required>
                        <i class="fas fa-eye-slash show-btn" onclick="togglePasswordVisibility('confirm-password')"></i>
                    </div>
                </div>
                <script>
                    function togglePasswordVisibility(inputId) {
                        var passwordInput = document.getElementById(inputId);
                        var showBtn = document.querySelector('.show-btn');
                        if (passwordInput.type === 'password') {
                            passwordInput.setAttribute('type', 'text');
                            showBtn.classList.add('fa-eye');
                            showBtn.classList.remove('fa-eye-slash');
                        } else {
                            passwordInput.setAttribute('type', 'password');
                            showBtn.classList.remove('fa-eye');
                            showBtn.classList.add('fa-eye-slash');
                        }
                    }
                </script>
                <p style="color:red; font-size: 25px;" id="error-message"></p>
                <input type="file" placeholder="profileImage" id="profileImage" name="profileImage" required>
                <select name="role" id="role">
    <option value="Admin">Admin</option>
    <option value="supplier">Supplier</option>
    <option value="seller">Seller</option>
    </select>

                <div class="g-recaptcha" id="recaptcha-container" data-sitekey="6Lf7MrQnAAAAAOlUDKTkkqEOI9-qJZOh3zR1Cv1E"></div>
                <div id="recaptcha-error" class="error-message"></div>
                <div class="terms-policy">
                    <input type="checkbox" id="agreeCheckbox" onclick="validateAgree()" required>I agree to the <a href="terms.html">Terms of Service</a> and <a href="privacy.html">Privacy Policy</a>.
                </div>
                <button type="submit" id="sign-up-button" onclick="return validateForm()">Sign Up</button>
                <div id="g_id_signin"></div>
                <p class="login-link">Already have an account? <a href="login.php">Log in here</a></p>
            </div>
        </form>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script src="https://www.google.com/recaptcha/enterprise.js?render=6Lc_dLMnAAAAADy2tYe0TpXyDudiTLMECj_teb7c"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <script>
        window.onload = function() {
            initGoogleSignIn();
        }
    </script>
</body>
</html>

