<?php
require_once '../../config.php';

setCORSHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$user = getCurrentUser();

if (!$user) {
    sendResponse(['success' => false, 'message' => 'Invalid token'], 401);
}

try {
    $db = getDB();
    
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