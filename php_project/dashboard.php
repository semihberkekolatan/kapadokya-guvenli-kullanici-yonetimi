<?php
/**
 * Kullanıcı Paneli (Dashboard)
 */
session_start();
require_once 'database.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = $_SESSION['user_id'];
$db = Database::getInstance()->getConnection();

// Kullanıcı bilgilerini çek (PDF 5.6)
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch();

// Giriş loglarını çek (PDF 5.6)
$stmt_logs = $db->prepare("SELECT * FROM users_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10");
$stmt_logs->execute([$user_id]);
$logs = $stmt_logs->fetchAll();

// Hatalı giriş loglarını çek
$stmt_failed = $db->prepare("SELECT * FROM users_logs WHERE user_id = ? AND islem_tipi = 'giris_basarisiz' ORDER BY created_at DESC LIMIT 5");
$stmt_failed->execute([$user_id]);
$failed_logs = $stmt_failed->fetchAll();

?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel - Kapadokya Auth</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: #000;
            color: #fff;
            background: radial-gradient(circle at 50% -20%, #1e1b4b 0%, #000000 100%);
        }
        .glass-card {
            background: rgba(24, 24, 27, 0.6);
            backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.8);
        }
        .log-entry {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .log-entry:hover {
            background: rgba(255, 255, 255, 0.03);
            transform: translateX(8px);
        }
    </style>
</head>
<body class="min-h-screen text-zinc-100 flex flex-col">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
            <div>
                <div class="flex items-center gap-4 mb-6">
                    <div class="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span class="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Developer Profile: Semih Berke Kolatan (24097002)</span>
                </div>
                <h1 class="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">
                    Hoş Geldin, <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-500 font-black"><?php echo htmlspecialchars($user['ad']); ?></span>
                </h1>
            </div>
            
            <div class="flex flex-col items-end">
               <div class="flex items-center gap-3 mb-4 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                  <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">System Developer Active</span>
               </div>
               <div class="flex gap-4">
                 <div class="px-7 py-4 bg-zinc-950 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 shadow-xl">
                   BGY206 PROJESİ
                 </div>
                 <a href="logout.php" class="px-7 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5">
                   Güvenli Çıkış
                 </a>
               </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
            <!-- Left Side: Activity Logs -->
            <div class="lg:col-span-2 space-y-10">
                <div class="glass-card p-10 md:p-14 rounded-[4.5rem] relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none">
                        <svg class="h-64 w-64" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>

                    <div class="flex items-center justify-between mb-14">
                        <div class="flex items-center gap-5">
                            <div class="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                <svg class="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            </div>
                            <h3 class="text-2xl font-black text-white uppercase tracking-tight">Erişim Kayıt Defteri</h3>
                        </div>
                        <span class="text-[9px] font-black bg-indigo-500/15 text-indigo-400 px-4 py-2 rounded-full uppercase tracking-widest border border-indigo-500/10">Canlı İzleme</span>
                    </div>

                    <div class="space-y-4">
                        <?php if (count($logs) > 0): ?>
                            <?php foreach ($logs as $log): ?>
                                <div class="log-entry p-6 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div class="flex items-start gap-6">
                                        <div class="mt-1 w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)] <?php echo $log['islem_tipi'] === 'giris_basarili' ? 'bg-emerald-500' : ($log['islem_tipi'] === 'cikis' ? 'bg-zinc-600' : 'bg-red-500'); ?>"></div>
                                        <div>
                                            <p class="text-[11px] font-black uppercase tracking-[0.2em] mb-2 <?php echo $log['islem_tipi'] === 'giris_basarili' ? 'text-emerald-500' : ($log['islem_tipi'] === 'cikis' ? 'text-zinc-500' : 'text-red-500'); ?>">
                                                <?php echo strtoupper(str_replace('_', ' ', $log['islem_tipi'])); ?>
                                            </p>
                                            <p class="text-zinc-300 text-sm font-medium mb-4"><?php echo htmlspecialchars($log['aciklama']); ?></p>
                                            <div class="flex items-center gap-4">
                                                <span class="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Protocol: <span class="text-zinc-400 font-mono tracking-normal"><?php echo $log['ip_adresi']; ?></span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-zinc-600 text-[10px] font-black font-mono tracking-widest mb-1"><?php echo substr($log['created_at'], 0, 10); ?></p>
                                        <p class="text-zinc-800 text-[9px] font-black uppercase tracking-[0.2em]"><?php echo substr($log['created_at'], 11); ?></p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <div class="py-20 text-center">
                                <p class="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Log Havuzu Boş</p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Right Side: Developer & User Cards -->
            <div class="flex flex-col gap-10">
                <!-- Developer Card -->
                <div class="glass-card p-10 rounded-[3.5rem] border-indigo-500/20 relative overflow-hidden group shadow-2xl shadow-indigo-500/5">
                    <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-1000"></div>
                    
                    <h4 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-indigo-500/10">Developer Identity</h4>
                    
                    <div class="space-y-10">
                        <div class="flex items-center gap-5">
                            <div class="p-4 bg-zinc-950 rounded-2xl text-indigo-500 border border-white/5">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Developer</p>
                                <p class="text-base font-black text-white tracking-tight">Semih Berke Kolatan</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-5">
                            <div class="p-4 bg-zinc-950 rounded-2xl text-indigo-400 border border-white/5">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Student Number</p>
                                <p class="text-base font-black text-white tracking-tight">24097002</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-5">
                            <div class="p-4 bg-zinc-950 rounded-2xl text-indigo-500 border border-white/5">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Affiliation</p>
                                <p class="text-xs font-black text-zinc-400">UNIVERSITY OF KAPADOKYA</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Session User Card -->
                <div class="glass-card p-10 rounded-[3.5rem] border-white/5 bg-zinc-900/40">
                    <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-10 pb-4 border-b border-white/5">Active User Session</h4>
                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                           <div class="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                              <span class="text-base font-black text-indigo-500"><?php echo strtoupper(substr($user['ad'], 0, 1)); ?></span>
                           </div>
                           <div>
                              <p class="text-sm font-black text-zinc-200"><?php echo htmlspecialchars($user['ad'] . ' ' . $user['soyad']); ?></p>
                              <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Authorized Access</p>
                           </div>
                        </div>
                        <div class="p-5 bg-black/40 rounded-[1.5rem] border border-white/5">
                           <p class="text-[9px] font-black uppercase tracking-widest text-zinc-700 mb-2">Protocol Entry</p>
                           <p class="text-xs font-mono text-zinc-500 break-all"><?php echo htmlspecialchars($user['email']); ?></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="py-16 px-6 border-t border-white/5 bg-zinc-950/20 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div class="flex flex-col items-center md:items-start gap-4">
                <div class="flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">System Developer Active</span>
                </div>
                <span class="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">&copy; 2026 UNIVERSITY OF KAPADOKYA</span>
            </div>
            <div class="flex gap-12">
                <div class="flex flex-col items-center md:items-end gap-2 text-zinc-800">
                   <span class="text-[9px] font-black uppercase tracking-widest">Security: AES-256</span>
                   <span class="text-[9px] font-black uppercase tracking-widest">Protocol: V2.1 Beta</span>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
