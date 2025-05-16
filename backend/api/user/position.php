<?php
require_once '../../config.php';

setCORSHeaders();

$user = getCurrentUser();

if (!$user) {
    sendResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

$db = getDB();

// Handle GET request - fetch reading position
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->prepare("SELECT current_surah, current_ayah FROM user_reading_position WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $position = $stmt->fetch();
        
        sendResponse([
            'success' => true,
            'position' => [
                'surah' => $position['current_surah'],
                'ayah' => $position['current_ayah']
            ]
        ]);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}

// Handle PUT request - update reading position
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['surah']) || !isset($data['ayah'])) {
        sendResponse(['success' => false, 'message' => 'Surah and ayah are required'], 400);
    }
    
    try {
        $stmt = $db->prepare("
            UPDATE user_reading_position 
            SET current_surah = ?, current_ayah = ?, updated_at = NOW()
            WHERE user_id = ?
        ");
        $stmt->execute([$data['surah'], $data['ayah'], $user['id']]);
        
        sendResponse(['success' => true, 'message' => 'Position updated']);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}
?>