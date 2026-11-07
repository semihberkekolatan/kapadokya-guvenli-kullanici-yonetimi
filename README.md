# 🔐 Kapadokya Güvenli Kullanıcı Yönetim Sistemi

Kullanıcı kaydı, güvenli kimlik doğrulama, oturum yönetimi, işlem loglama (audit log) ve **IP tabanlı kaba kuvvet (brute-force) engelleme** özelliklerini barındıran kullanıcı yönetim uygulamasıdır.

Proje hem **modern tam yığın (React + TypeScript + Express + SQLite)** hem de **klasik sunucu taraflı (PHP + MySQL)** mimariyle uygulanmıştır.

## ✨ Temel Özellikler

- 🛡️ **IP Bazlı Giriş Kısıtlama:** Arka arkaya 3 başarısız giriş denemesinde ilgili IP adresini 15 dakika süreyle otomatik engeller.
- 🔑 **Güvenli Parola Saklama:** Parolalar düz metin yerine `bcrypt` / `password_hash` ile özetlenerek (hash) saklanır.
- 📋 **Denetim Kayıtları (Audit Logs):** Başarılı giriş, başarısız deneme, engellenen giriş ve çıkış işlemleri IP adresi ve zaman damgasıyla `users_logs` tablosuna kaydedilir.
- 📊 **Yönetim Paneli (Dashboard):** Oturum bilgileri ve son güvenlik kayıtlarının anlık takibi.

## 🛠️ Kullanılan Teknolojiler

- **Modern Sürüm (`src/` & `server.ts`):** React 19, TypeScript, Tailwind CSS, Node.js, Express, `better-sqlite3`, `bcrypt`
- **PHP Sürümü (`php_project/`):** PHP 8+, MySQL / MariaDB (PDO Prepared Statements), HTML5, CSS3

## 🚀 Çalıştırma

### React + Express Sürümü
```bash
npm install
npm run dev
```

### PHP + MySQL Sürümü
1. `ogrenci_no_system_db.sql` dosyasını MySQL / phpMyAdmin üzerinden içe aktarın.
2. `php_project/` klasörünü `htdocs` altına kopyalayıp tarayıcıdan açın.

## 👤 Geliştirici

**Semih Berke Kolatan** — Kapadokya Üniversitesi, Bilişim Sistemleri ve Teknolojileri  
[GitHub](https://github.com/semihberkekolatan) · [LinkedIn](https://www.linkedin.com/in/semihberkekolatan)
