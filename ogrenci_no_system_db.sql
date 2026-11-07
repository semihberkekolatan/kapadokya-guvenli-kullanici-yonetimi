-- Kapadokya Üniversitesi - BGY206 Web Programlama-I Projesi
-- Veritabanı Şeması (MySQL/XAMPP uyumlu)

CREATE DATABASE IF NOT EXISTS ogrenci_no_system_db;
USE ogrenci_no_system_db;

-- 1. Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(50) NOT NULL,
    soyad VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    sifre_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Giriş/Çıkış İşlem Logları Tablosu
CREATE TABLE IF NOT EXISTS users_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NULL,
    ip_adresi VARCHAR(45) NOT NULL,
    islem_tipi ENUM('giris_basarili', 'giris_basarisiz', 'giris_engellendi', 'cikisi') NOT NULL,
    aciklama VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_logs FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
