<?php
session_start();
require_once '../../config/database.php'; // Ensure this path is correct
require_once '../../config/google_config.php'; // Ensure this path is correct
require_once '../../vendor/autoload.php'; // Ensure the Google API PHP Client library is loaded

// Google OAuth Configuration
$client = new Google_Client();
$client->setClientId(GOOGLE_CLIENT_ID);
$client->setClientSecret(GOOGLE_CLIENT_SECRET);
$client->setRedirectUri(GOOGLE_REDIRECT_URI); // This must match the Google Cloud Console
$client->addScope("email");
$client->addScope("profile");

if (isset($_GET['google_login'])) {
    // Redirect to Google's OAuth 2.0 server
    $authUrl = $client->createAuthUrl();
    header('Location: ' . $authUrl);
    exit();
}

if (isset($_GET['code'])) {
    try {
        // Fetch the access token using the authorization code
        $token = $client->fetchAccessTokenWithAuthCode($_GET["code"]);
        if (isset($token['error'])) {
            throw new Exception('Error fetching access token: ' . $token['error']);
        }

        // Set the access token
        $client->setAccessToken($token["access_token"]);

        // Get user info from Google
        $oauth = new Google_Service_Oauth2($client);
        $userinfo = $oauth->userinfo->get();

        // Check if the user exists in your database
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$userinfo->email]);
        $user = $stmt->fetch();

        if ($user) {
            // User exists, set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];

            // Redirect to the homepage
            header('Location: ../../index.php');
            exit();
        } else {
            // User does not exist, show an error message
            $_SESSION['login_error'] = "No account found for this Google account.";
            header('Location: ../../index.php');
            exit();
        }
    } catch (Exception $e) {
        // Handle errors
        $_SESSION['login_error'] = "Google login failed: " . $e->getMessage();
        header('Location: ../../index.php');
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
        exit();
    }

    try {
        // Check if the user exists in the database
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username OR email = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Login successful
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];

            echo json_encode(['success' => true, 'username' => $user['username']]);
        } else {
            // Login failed
            echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    // If no valid request, redirect to the homepage
    header('Location: ../../index.php');
    exit();
}
?>