<?php
require_once '../../config.php';

setCORSHeaders();

$user = getCurrentUser();

if (!$user) {
    sendResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

$db = getDB();

// Handle GET request - fetch settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->prepare("SELECT * FROM user_settings WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $settings = $stmt->fetch();
        
        sendResponse([
            'success' => true,
            'settings' => [
                'fontSize' => $settings['font_size'],
                'darkMode' => (bool)$settings['dark_mode'],
                'selectedTranslation' => $settings['selected_translation'],
                'selectedReciter' => $settings['selected_reciter']
            ]
        ]);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}

// Handle PUT request - update settings
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $updates = [];
        $params = [];
        
        if (isset($data['fontSize'])) {
            $updates[] = "font_size = ?";
            $params[] = $data['fontSize'];
        }
        
        if (isset($data['darkMode'])) {
            $updates[] = "dark_mode = ?";
            $params[] = $data['darkMode'] ? 1 : 0;
        }
        
        if (isset($data['selectedTranslation'])) {
            $updates[] = "selected_translation = ?";
            $params[] = $data['selectedTranslation'];
        }
        
        if (isset($data['selectedReciter'])) {
            $updates[] = "selected_reciter = ?";
            $params[] = $data['selectedReciter'];
        }
        
        if (!empty($updates)) {
            $updates[] = "updated_at = NOW()";
            $params[] = $user['id'];
            
            $sql = "UPDATE user_settings SET " . implode(", ", $updates) . " WHERE user_id = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
        }
        
        sendResponse(['success' => true, 'message' => 'Settings updated']);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}
?>