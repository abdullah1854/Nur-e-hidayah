<?php
require_once '../../config.php';

setCORSHeaders();

$user = getCurrentUser();

if (!$user) {
    sendResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

$db = getDB();

// Handle GET request - fetch bookmarks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->prepare("SELECT surah, ayah FROM user_bookmarks WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user['id']]);
        $bookmarks = $stmt->fetchAll();
        
        sendResponse([
            'success' => true,
            'bookmarks' => $bookmarks
        ]);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}

// Handle POST request - add bookmark
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['surah']) || !isset($data['ayah'])) {
        sendResponse(['success' => false, 'message' => 'Surah and ayah are required'], 400);
    }
    
    try {
        $stmt = $db->prepare("
            INSERT INTO user_bookmarks (user_id, surah, ayah) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE created_at = NOW()
        ");
        $stmt->execute([$user['id'], $data['surah'], $data['ayah']]);
        
        sendResponse(['success' => true, 'message' => 'Bookmark added']);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}

// Handle DELETE request - remove bookmark
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['surah']) || !isset($data['ayah'])) {
        sendResponse(['success' => false, 'message' => 'Surah and ayah are required'], 400);
    }
    
    try {
        $stmt = $db->prepare("
            DELETE FROM user_bookmarks 
            WHERE user_id = ? AND surah = ? AND ayah = ?
        ");
        $stmt->execute([$user['id'], $data['surah'], $data['ayah']]);
        
        sendResponse(['success' => true, 'message' => 'Bookmark removed']);
    } catch (Exception $e) {
        sendResponse(['success' => false, 'message' => 'Server error'], 500);
    }
}
?>