<?php
/**
 * Oturumu sonlandırma ve loglama mantığı
 */
session_start();
require_once 'database.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $ip_adresi = $_SERVER['REMOTE_ADDR'];
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) VALUES (?, ?, 'cikis', 'Kullanıcı güvenli çıkış yaptı.')");
    $stmt->execute([$user_id, $ip_adresi]);
}

session_destroy();
header("Location: login.php");
exit;
?>
