<?php
/**
 * Kullanıcı Giriş Formu ve Mantığı
 */
session_start();
require_once 'database.php';

$error = '';
$success = isset($_GET['registered']) ? 'Hesabınız Başarıyla Aktifleştirildi.' : '';
$ip_adresi = $_SERVER['REMOTE_ADDR'];

$db = Database::getInstance()->getConnection();

// IP Engelleme Kontrolü (PDF 5.4 - 3 deneme sonrası blok)
$stmt = $db->prepare("
    SELECT COUNT(*) as count FROM users_logs 
    WHERE ip_adresi = ? 
    AND islem_tipi = 'giris_basarisiz' 
    AND created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
");
$stmt->execute([$ip_adresi]);
$failures = $stmt->fetch();

if ($failures['count'] >= 3) {
    die("<body style='background:black;color:red;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;'>
        <div>
            <h1 style='font-weight:900;'>ERİŞİM REDDEDİLDİ</h1>
            <p>Güvenlik protokolü gereği IP adresiniz 30 dakika kısıtlanmıştır.</p>
        </div>
    </body>");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $sifre = $_POST['sifre'];

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($sifre, $user['sifre_hash'])) {
        // Başarılı giriş
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['ad'] . ' ' . $user['soyad'];
        
        $stmt = $db->prepare("INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) VALUES (?, ?, 'giris_basarili', 'Sisteme güvenli erişim sağlandı.')");
        $stmt->execute([$user['id'], $ip_adresi]);
        
        session_regenerate_id(true);
        header("Location: dashboard.php");
        exit;
    } else {
        // Hatalı giriş
        $user_id = $user ? $user['id'] : null;
        $stmt = $db->prepare("INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) VALUES (?, ?, 'giris_basarisiz', 'Kimlik doğrulama başarısız.')");
        $stmt->execute([$user_id, $ip_adresi]);
        
        $error = 'Kimlik Bilgileri Doğrulanamadı.';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Giriş - Kapadokya Auth</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at 50% -20%, #1e1b4b 0%, #000000 100%);
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(24, 24, 27, 0.6);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7);
        }
        .premium-input {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        .premium-input:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
            outline: none;
        }
    </style>
</head>
<body class="flex items-center justify-center p-6 text-zinc-100">
    <!-- Dev Info Badge -->
    <div class="fixed top-8 right-8 text-right hidden lg:block">
        <span class="text-zinc-700 text-[9px] font-black uppercase tracking-[0.3em] block mb-1">Developer Credentials</span>
        <div class="bg-white/5 border border-white/5 px-4 py-2 rounded-full backdrop-blur-md">
            <span class="text-zinc-300 text-[10px] font-black uppercase tracking-widest leading-none">
                Semih Berke Kolatan <span class="text-indigo-500 ml-2">24097002</span>
            </span>
        </div>
    </div>

    <div class="max-w-[480px] w-full relative">
        <div class="absolute -inset-10 bg-indigo-500/10 rounded-[5rem] blur-[80px] -z-10"></div>
        
        <div class="glass-card p-10 md:p-20 rounded-[4rem]">
            <div class="text-center mb-12">
                <div class="inline-flex p-4 bg-indigo-500/15 rounded-2xl mb-6">
                    <svg class="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h1 class="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                    GİRİŞ <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">YAP</span>
                </h1>
                <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
                    Digital Security V2.1
                </p>
            </div>
            
            <?php if ($error): ?>
                <div class="bg-red-500/5 text-red-500 p-4 border border-red-500/10 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div class="bg-emerald-500/5 text-emerald-500 p-4 border border-emerald-500/10 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                    <?php echo htmlspecialchars($success); ?>
                </div>
            <?php endif; ?>

            <form action="login.php" method="POST" class="space-y-6">
                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Kimlik Kimliği</label>
                    <input type="email" name="email" required placeholder="ID@KAPADOKYA.EDU.TR" 
                           class="premium-input w-full px-6 py-5 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                </div>
                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Eriş Anahtarı</label>
                    <input type="password" name="sifre" required placeholder="••••••••" 
                           class="premium-input w-full px-6 py-5 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                </div>
                
                <div class="pt-6">
                    <button type="submit" class="w-full relative group overflow-hidden rounded-2xl cursor-pointer">
                        <div class="absolute inset-0 bg-indigo-600 group-hover:bg-indigo-500 transition-colors"></div>
                        <div class="relative flex justify-center items-center py-5 px-6 text-white text-[11px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all">
                            Sisteme Eriş
                        </div>
                    </button>
                </div>
            </form>

            <div class="mt-14 text-center border-t border-white/5 pt-8">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Henüz Kayıtlı Değil Misiniz? <a href="register.php" class="text-white underline underline-offset-8 decoration-indigo-500/30 hover:text-indigo-400 transition-all">Üyelik Oluştur</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
