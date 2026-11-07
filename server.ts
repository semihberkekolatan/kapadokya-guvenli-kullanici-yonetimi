import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import Database from "better-sqlite3";
import bcrypt from "bcrypt";

// Veritabanı başlatma (SQLite, ödevdeki MySQL mantığına paralel)
const db = new Database("system.db");

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    sifre_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    ip_adresi TEXT NOT NULL,
    islem_tipi TEXT CHECK(islem_tipi IN ('giris_basarili', 'giris_basarisiz', 'giris_engellendi', 'cikis')) NOT NULL,
    aciklama TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );
`);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * IP Bazlı Kısıtlama Mantığı (PDF 5.4)
 * 3 kez hatalı giriş yapıldığında IP bazlı engelleme yapılır.
 */
const BAN_TIME = 15 * 60 * 1000; // 15 dakika
const MAX_ATTEMPTS = 3;

app.post("/api/auth/check-ip", (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || "127.0.0.1";
  
  const recentFailures = db.prepare(`
    SELECT COUNT(*) as count FROM users_logs 
    WHERE ip_adresi = ? 
    AND islem_tipi = 'giris_basarisiz' 
    AND created_at > datetime('now', '-15 minutes')
  `).get(ip) as { count: number };

  if (recentFailures.count >= MAX_ATTEMPTS) {
    return res.status(403).json({ 
      blocked: true, 
      message: "Güvenlik nedeniyle 3 hatalı denemeden sonra IP adresiniz kısıtlanmıştır (15 dk)." 
    });
  }
  
  res.json({ blocked: false });
});

// Kayıt Olma (register.php mantığı)
app.post("/api/auth/register", async (req, res) => {
  const { ad, soyad, email, sifre } = req.body;

  try {
    const sifre_hash = await bcrypt.hash(sifre, 10);
    const result = db.prepare(`
      INSERT INTO users (ad, soyad, email, sifre_hash) VALUES (?, ?, ?, ?)
    `).run(ad, soyad, email, sifre_hash);

    res.json({ success: true, userId: result.lastInsertRowid });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: "Bu e-posta zaten kullanımda." });
    } else {
      res.status(500).json({ error: "Sunucu hatası." });
    }
  }
});

// Giriş Yapma (login.php mantığı)
app.post("/api/auth/login", async (req, res) => {
  const { email, sifre } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || "127.0.0.1";

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

  if (user && await bcrypt.compare(sifre, user.sifre_hash)) {
    // Başarılı giriş logu
    db.prepare(`
      INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) 
      VALUES (?, ?, 'giris_basarili', 'Yönetim paneline giriş yapıldı.')
    `).run(user.id, ip);

    // Oturum verisini dön
    const { sifre_hash, ...userData } = user;
    res.json({ success: true, user: userData });
  } else {
    // Hatalı giriş logu
    const potentialUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as any;
    db.prepare(`
      INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) 
      VALUES (?, ?, 'giris_basarisiz', 'Hatalı şifre denemesi.')
    `).run(potentialUser?.id || null, ip);

    res.status(401).json({ error: "E-posta veya şifre hatalı." });
  }
});

// Kullanıcı Paneli Bilgileri (dashboard.php mantığı)
app.get("/api/dashboard/:userId", (req, res) => {
  const { userId } = req.params;
  
  const user = db.prepare("SELECT ad, soyad, email, created_at FROM users WHERE id = ?").get(userId);
  const logs = db.prepare(`
    SELECT * FROM users_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
  `).all(userId);
  
  const failedLogs = db.prepare(`
    SELECT * FROM users_logs 
    WHERE user_id = ? AND islem_tipi = 'giris_basarisiz' 
    ORDER BY created_at DESC LIMIT 5
  `).all(userId);

  if (!user) return res.status(404).send();

  res.json({ user, logs, failedLogs });
});

// Çıkış (logout.php mantığı)
app.post("/api/auth/logout", (req, res) => {
  const { userId } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || "127.0.0.1";

  db.prepare(`
    INSERT INTO users_logs (user_id, ip_adresi, islem_tipi, aciklama) 
    VALUES (?, ?, 'cikis', 'Oturum sonlandırıldı.')
  `).run(userId, ip);

  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

