<?php
require_once '../../config.php';

setCORSHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);
$googleToken = $data['token'] ?? '';

if (!$googleToken) {
    sendResponse(['success' => false, 'message' => 'Token is required'], 400);
}

// Verify the Google token
$googleUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . $googleToken;
$response = file_get_contents($googleUrl);

if (!$response) {
    sendResponse(['success' => false, 'message' => 'Invalid token'], 401);
}

$googleData = json_decode($response, true);

// Verify the token is for our app
if ($googleData['aud'] !== GOOGLE_CLIENT_ID) {
    sendResponse(['success' => false, 'message' => 'Invalid token audience'], 401);
}

// Extract user information
$googleId = $googleData['sub'];
$email = $googleData['email'];
$name = $googleData['name'];
$picture = $googleData['picture'] ?? null;

try {
    $db = getDB();
    
    // Check if user exists
    $stmt = $db->prepare("SELECT * FROM users WHERE google_id = ?");
    $stmt->execute([$googleId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        // Create new user
        $stmt = $db->prepare("
            INSERT INTO users (google_id, email, name, picture) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$googleId, $email, $name, $picture]);
        $userId = $db->lastInsertId();
        
        // Create default settings
        $stmt = $db->prepare("INSERT INTO user_settings (user_id) VALUES (?)");
        $stmt->execute([$userId]);
        
        // Create default reading position
        $stmt = $db->prepare("INSERT INTO user_reading_position (user_id) VALUES (?)");
        $stmt->execute([$userId]);
        
        // Fetch the newly created user
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
    } else {
        // Update user information
        $stmt = $db->prepare("
            UPDATE users 
            SET name = ?, picture = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$name, $picture, $user['id']]);
    }
    
    // Generate JWT token
    $token = generateJWT($user['id']);
    
    // Store session
    $stmt = $db->prepare("
        INSERT INTO user_sessions (user_id, token, expires_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    ");
    $stmt->execute([$user['id'], $token]);
    
    // Load user settings
    $stmt = $db->prepare("SELECT * FROM user_settings WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $settings = $stmt->fetch();
    
    // Load user bookmarks
    $stmt = $db->prepare("SELECT surah, ayah FROM user_bookmarks WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $bookmarks = $stmt->fetchAll();
    
    // Load reading position
    $stmt = $db->prepare("SELECT current_surah, current_ayah FROM user_reading_position WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $position = $stmt->fetch();
    
    sendResponse([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'picture' => $user['picture']
        ],
        'token' => $token,
        'settings' => [
            'fontSize' => $settings['font_size'],
            'darkMode' => (bool)$settings['dark_mode'],
            'selectedTranslation' => $settings['selected_translation'],
            'selectedReciter' => $settings['selected_reciter']
        ],
        'bookmarks' => $bookmarks,
        'position' => [
            'surah' => $position['current_surah'],
            'ayah' => $position['current_ayah']
        ]
    ]);
    
} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Server error'], 500);
}
?>