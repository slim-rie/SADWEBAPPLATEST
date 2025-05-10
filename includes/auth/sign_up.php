<?php

session_start();
require_once '../../config/database.php';
require_once '../../config/google_config.php'; // Ensure this path is correct
require_once '../../vendor/autoload.php';


// Initialize variables
$errors = [];
$successMessage = "";

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $firstname = trim($_POST['firstname'] ?? '');
    $lastname = trim($_POST['lastname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirmPassword'] ?? '');

    // Validate input
    if (empty($firstname)) $errors[] = 'First name is required.';
    if (empty($lastname)) $errors[] = 'Last name is required.';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'A valid email is required.';
    if (empty($password)) $errors[] = 'Password is required.';
    if ($password !== $confirmPassword) $errors[] = 'Passwords do not match.';
    if (strlen($password) < 8) $errors[] = 'Password must be at least 8 characters long.';

    // If no errors, proceed to save the user
    if (empty($errors)) {
        try {
            // Check if the email already exists
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $errors[] = 'An account with this email already exists.';
            } else {
                // Hash the password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Insert the user into the database
                $stmt = $conn->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (:firstname, :lastname, :email, :password)");
                $stmt->bindParam(':firstname', $firstname);
                $stmt->bindParam(':lastname', $lastname);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $hashedPassword);
                $stmt->execute();

                // Set success message
                $successMessage = 'Account created successfully! You can now log in.';
                // Redirect to login page
                header('Location: login.php');
                exit;
            }
        } catch (PDOException $e) {
            $errors[] = 'Database error: ' . $e->getMessage();
        }
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - JBR Tanching C.O</title>
    <link rel="stylesheet" href="../../assets/css/sign_up.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <?php $cssPath = (strpos($_SERVER['PHP_SELF'], 'includes/auth/') !== false) ? '../../assets/css/style.css' : 'assets/css/style.css'; ?>
    <link rel="stylesheet" href="<?php echo $cssPath; ?>">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-left">
                <a href="index.php" class="nav-logo">
                    <img src="../../assets/images/logo.ico" alt="Logo" class="logo-image">
                    <h2 class="logo-text">JBR Tanching C.O</h2>

                </a>
            </div>

                <div class="user-dropdown">
                    <img src="../../assets/images/user.png" alt="User" class="icon-img" id="user-icon">
                    <div class="dropdown-container" id="dropdownMenu">
                        <button class="login-btn" id="loginBtn">LOGIN</button>
                        <button class="signup-btn" onclick="window.location.href='sign_up.php'">SIGN UP</button>
                    </div>
                </div>
            </div> 
        </nav>
    </header>

    <section class="signup-container container">
        <div class="signup-header">
            <h2>Welcome!</h2>
            <p>Add a few details to create an account</p>
        </div>
        
        <form class="signup-form" id="signupForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="firstname">First Name</label>
                    <input type="text" id="firstname" placeholder="Enter your first name" required>
                </div>
                <div class="form-group">
                    <label for="lastname">Last Name</label>
                    <input type="text" id="lastname" placeholder="Enter your last name" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email address" required>
            </div>
            
            <div class="form-group">
                <label for="new-password">New Password</label>
                <input type="password" id="new-password" placeholder="Create a password" required>
            </div>
            
            <div class="password-requirements">
                <h4>Your password must contain:</h4>
                <ul>
                    <li id="length">8 characters minimum</li>
                    <li id="lowercase">One lowercase character</li>
                    <li id="uppercase">One uppercase character</li>
                    <li id="number">One number</li>
                    <li id="special">At least 1 special character(s) - ($%/()[]{}=?!.,-_*|+~#)</li>
                </ul>
            </div>
            
            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" placeholder="Confirm your password" required>
                <p class="password-match" id="password-match-message">Passwords do not match</p>
            </div>
            
            <button type="submit" class="create-account-btn" id="createAccountBtn">CREATE ACCOUNT</button>
            
            <p class="login-link">Have an account? <a href="#" id="signInLink">Sign in</a></p>
        </form>
        
        <?php if (!empty($successMessage)): ?>
            <div class="success-message">
                <?php echo htmlspecialchars($successMessage); ?>
            </div>
        <?php endif; ?>

        <div class="or-divider">
            <span>OR</span>
        </div>

        <!-- Google Sign-In Button -->
        <button class="google-btn" onclick="window.location.href='../../includes/auth/google_login.php'">
            <i class="fab fa-google"></i> Continue with Google
        </button>
</section>

    <script src="../../assets/js/sign_up.js"></script>

</body>
</html>

<?php
require_once '../../includes/common/footer.php';
?>
