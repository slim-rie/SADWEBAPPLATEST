<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (basename($_SERVER['PHP_SELF']) !== 'sign_up.php') {
    include_once __DIR__ . '/../../includes/common/chat_modal.php';
    // If you have a login modal include, add it here as well
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charsets="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JBR Tanching C.O</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <base href="/SADWEBAPPLITEST/SADWEBAPPLATEST/">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-left">
                <a href="#" class="nav-logo">
                    <img src="assets/images/logo.ico" alt="Logo" class="logo-image">
                    <h2 class="logo-text">JBR Tanching C.O</h2>
                </a>
            </div>

            <div class="search-bar">
                <select class="search-dropdown">
                    <option>All</option>
                    <option>Fabrics</option>
                    <option>Sewing Machines</option>
                    <option>Sewing Parts</option>
                </select>
                <input type="text" class="search-input" placeholder="What can we help you find?">
                <button class="search-btn">
                    <img src="assets/images/search.png" alt="Search" class="icon-img">
                </button>
            </div>

            <div class="nav-icons">
                <span class="phone-info">
                    <img src="assets/images/contact.png" alt="Contact" class="icon-img non-clickable"> 
                    <span class="phone-text">+63 912-3456-789</span>
                </span>

                <a href="#" class="chat-link" id="chatLink">
                    <img src="assets/images/chat.png" alt="Chat" class="icon-img">
                </a>
                <a href="#" class="cart-link">
                    <img src="assets/images/cart.png" alt="Cart" class="icon-img">
                </a>

                <div class="user-dropdown">
                    <div class="user-info">
                        <img src="assets/images/user.png" alt="User" class="icon-img" id="user-icon">
                        <span class="username" id="usernameDisplay">
                            <?php echo isset($_SESSION['username']) ? $_SESSION['username'] : ''; ?>
                        </span>
                    </div>
                    <div class="dropdown-container" id="dropdownMenu">
                        <?php if(isset($_SESSION['username'])): ?>
                            <a href="includes/auth/logout.php">Logout</a>
                        <?php else: ?>
                            <a href="#" id="loginLink">Login</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div> 
        </nav>
    </header>
    </div>