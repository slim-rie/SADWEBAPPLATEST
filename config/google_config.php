<?php
// Check if composer autoload exists
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    die('Please run "composer install" to install dependencies');
}

require_once $autoloadPath;

// Import Google Client classes
use Google\Client as GoogleClient;
use Google\Service\Oauth2 as GoogleServiceOauth2;

// Google OAuth Configuration
define('GOOGLE_CLIENT_ID', 'your-google-client-id.apps.googleusercontent.com');
define('GOOGLE_CLIENT_SECRET', 'your-google-client-secret');
define('GOOGLE_REDIRECT_URI', 'http://localhost/redirect.php'); // Match this with Google Cloud Console

// Initialize Google Client
function getGoogleClient() {
    $client = new GoogleClient();
    $client->setClientId(GOOGLE_CLIENT_ID);
    $client->setClientSecret(GOOGLE_CLIENT_SECRET);
    $client->setRedirectUri(GOOGLE_REDIRECT_URI);
    $client->addScope("email");
    $client->addScope("profile");
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');
    
    return $client;
}

// Function to get user info from Google
function getGoogleUserInfo($access_token) {
    $client = getGoogleClient();
    $client->setAccessToken($access_token);
    
    $google_oauth = new GoogleServiceOauth2($client);
    return $google_oauth->userinfo->get();
}

// Function to handle Google login
function handleGoogleLogin() {
    $client = getGoogleClient();
    
    if (isset($_GET['code'])) {
        try {
            // Get token
            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($token);
            
            // Get user info
            $google_user = getGoogleUserInfo($token);
            
            return [
                'success' => true,
                'email' => $google_user->email,
                'name' => $google_user->name,
                'picture' => $google_user->picture
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    return [
        'success' => false,
        'error' => 'No authorization code received'
    ];
}
?>