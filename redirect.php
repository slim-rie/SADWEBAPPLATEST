<?php
session_start();
require_once '../../config/database.php'; // Corrected path
require_once '../../config/google_config.php'; // Corrected path
require_once '../../vendor/autoload.php';// Make sure to include the Google API PHP Client library

// Google OAuth Configuration
$client = new Google_Client();
$client->setClientId('286344493014-95n7mo7q86dn7v0pf75fcq15ok4dg2ue.apps.googleusercontent.com');
$client->setClientSecret('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');
$client->setRedirectUri('https://localhost/redirect.php');

if (isset($_GET['code'])) {
    try {
        // Fetch the access token using the authorization code
        $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
        if (isset($token['error'])) {
            throw new Exception('Error fetching access token: ' . $token['error']);
        }

        // Set the access token
        $client->setAccessToken($token['access_token']);

        // Get user info from Google
        $oauth = new Google_Service_Oauth2($client);
        $userinfo = $oauth->userinfo->get();

        // Check if the user exists in your database
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$userinfo->email]);
        $user = $stmt->fetch();

        if (!$user) {
            // Create a new user if they don't exist
            $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'customer')");
            $username = explode('@', $userinfo->email)[0];
            $password = password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
            $stmt->execute([$username, $userinfo->email, $password]);
            $user_id = $conn->lastInsertId();
        } else {
            $user_id = $user['id'];
        }

        // Set session variables
        $_SESSION['user_id'] = $user_id;
        $_SESSION['username'] = $user ? $user['username'] : $username;
        $_SESSION['email'] = $userinfo->email;
        $_SESSION['role'] = $user ? $user['role'] : 'customer';

        // Redirect to the homepage
        header('Location: index.php');
        exit();
    } catch (Exception $e) {
        // Handle errors
        $_SESSION['login_error'] = "Google login failed: " . $e->getMessage();
        header('Location: index.php');
        exit();
    }
} else {
    // If no code is provided, redirect to the homepage
    header('Location: index.php');
    exit();
}
?>