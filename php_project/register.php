<?php
/**
 * Kullanıcı Kayıt Sayfası
 */
require_once 'database.php';

$error = '';
$db = Database::getInstance()->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ad = trim($_POST['ad']);
    $soyad = trim($_POST['soyad']);
    $email = trim($_POST['email']);
    $sifre = $_POST['sifre'];
    $sifre_tekrar = $_POST['sifre_tekrar'];

    if ($sifre !== $sifre_tekrar) {
        $error = 'Şifreler birbiriyle eşleşmiyor.';
    } elseif (strlen($sifre) < 8) {
        $error = 'Şifre en az 8 karakter olmalıdır.';
    } else {
        // E-posta kontrolü
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'Bu e-posta adresi sistemde zaten kayıtlı.';
        } else {
            $sifre_hash = password_hash($sifre, PASSWORD_DEFAULT);
            $stmt = $db->prepare("INSERT INTO users (ad, soyad, email, sifre_hash) VALUES (?, ?, ?, ?)");
            if ($stmt->execute([$ad, $soyad, $email, $sifre_hash])) {
                header("Location: login.php?registered=true");
                exit;
            } else {
                $error = 'Kayıt sırasında teknik bir hata oluştu.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kayıt Ol - Kapadokya Auth</title>
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

    <div class="max-w-[620px] w-full relative">
        <div class="absolute -inset-10 bg-indigo-500/10 rounded-[5rem] blur-[80px] -z-10"></div>
        
        <div class="glass-card p-10 md:p-16 rounded-[4.5rem]">
            <div class="text-center mb-12">
                <div class="inline-flex p-4 bg-indigo-500/15 rounded-2xl mb-6">
                    <svg class="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                </div>
                <h1 class="text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                    SİSTEME <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 text-6xl">KATIL</span>
                </h1>
                <p class="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
                    Security Register V2.1
                </p>
            </div>
            
            <?php if ($error): ?>
                <div class="bg-red-500/5 text-red-500 p-4 border border-red-500/10 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form action="register.php" method="POST" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">İsim</label>
                        <input type="text" name="ad" required placeholder="AHMET" 
                               class="premium-input w-full px-6 py-4 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                    </div>
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Soyisim</label>
                        <input type="text" name="soyad" required placeholder="YILMAZ" 
                               class="premium-input w-full px-6 py-4 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Kurumsal E-Posta</label>
                    <input type="email" name="email" required placeholder="ID@KAPADOKYA.EDU.TR" 
                           class="premium-input w-full px-6 py-4 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Güvenli Şifre</label>
                        <input type="password" name="sifre" required placeholder="••••••••" 
                               class="premium-input w-full px-6 py-4 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                    </div>
                    <div class="space-y-3">
                        <label class="block text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Onay Anahtarı</label>
                        <input type="password" name="sifre_tekrar" required placeholder="••••••••" 
                               class="premium-input w-full px-6 py-4 text-white rounded-2xl placeholder:text-zinc-800 text-sm font-bold">
                    </div>
                </div>
                
                <div class="pt-8">
                    <button type="submit" class="w-full relative group overflow-hidden rounded-[1.5rem] bg-white text-black py-5 px-8 text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-white/5">
                        Kaydı Onayla ve Katıl
                    </button>
                </div>
            </form>

            <div class="mt-14 text-center border-t border-white/5 pt-8">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Zaten Üye Misiniz? <a href="login.php" class="text-white underline underline-offset-8 decoration-indigo-500/30 hover:text-indigo-400 transition-all">Oturum Açın</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
