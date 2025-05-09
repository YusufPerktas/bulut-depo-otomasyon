-- Veritabanı oluşturma
CREATE DATABASE depo_otomasyonu;
USE depo_otomasyonu;
-- Ürün Tablosu
CREATE TABLE Urun (
    Urun_id INT AUTO_INCREMENT PRIMARY KEY,
    Urun_Adi VARCHAR(255) NOT NULL,
    Tarih DATE NOT NULL
);
-- Demirbaş Tablosu
CREATE TABLE Demirbas (
    Demirbas_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_Adi VARCHAR(255) NOT NULL,
    Tarih DATE NOT NULL
);
-- Ürün Beden/Özellik Tablosu
CREATE TABLE Urun_BedenOzellik (
    BedenOzellik_id INT AUTO_INCREMENT PRIMARY KEY,
    Urun_id INT NOT NULL,
    BedenOzellik VARCHAR(255) NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Urun_id) REFERENCES Urun(Urun_id)
);
-- Demirbaş Beden/Özellik Tablosu
CREATE TABLE Demirbas_BedenOzellik (
    BedenOzellik_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_id INT NOT NULL,
    BedenOzellik VARCHAR(255) NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Demirbas_id) REFERENCES Demirbas(Demirbas_id)
);
-- Ürün Stok Tablosu (Beden bazlı stok tutuluyor)
CREATE TABLE Urun_Stok (
    Stok_id INT AUTO_INCREMENT PRIMARY KEY,
    Urun_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Stok_Miktar INT NOT NULL,
    FOREIGN KEY (Urun_id) REFERENCES Urun(Urun_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Urun_BedenOzellik(BedenOzellik_id)
);
-- Demirbaş Stok Tablosu (Beden bazlı stok tutuluyor)
CREATE TABLE Demirbas_Stok (
    Stok_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Stok_Miktar INT NOT NULL,
    FOREIGN KEY (Demirbas_id) REFERENCES Demirbas(Demirbas_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Demirbas_BedenOzellik(BedenOzellik_id)
);
-- Ürün Satış Tablosu
CREATE TABLE Urun_Satis (
    Satis_id INT AUTO_INCREMENT PRIMARY KEY,
    Urun_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Urun_Miktar INT NOT NULL,
    Satis_Fiyati DECIMAL(10, 2) NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Urun_id) REFERENCES Urun(Urun_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Urun_BedenOzellik(BedenOzellik_id)
);
-- Demirbaş Hurda/Çıkış Tablosu
CREATE TABLE Demirbas_Hurda (
    Cikis_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Demirbas_Miktar INT NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Demirbas_id) REFERENCES Demirbas(Demirbas_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Demirbas_BedenOzellik(BedenOzellik_id)
);
-- Ürün Maliyet Tablosu
CREATE TABLE Urun_Maliyet (
    Maliyet_id INT AUTO_INCREMENT PRIMARY KEY,
    Urun_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Miktar INT NOT NULL,
    Maliyet_Fiyati DECIMAL(10, 2) NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Urun_id) REFERENCES Urun(Urun_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Urun_BedenOzellik(BedenOzellik_id)
);
-- Demirbaş Maliyet Tablosu (Demirbaşların satışı olmadığı için sadece maliyet tablosu var)
CREATE TABLE Demirbas_Maliyet (
    Maliyet_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Miktar INT NOT NULL,
    Maliyet_Fiyati DECIMAL(10, 2) NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Demirbas_id) REFERENCES Demirbas(Demirbas_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Demirbas_BedenOzellik(BedenOzellik_id)
);
-- Kullanıcı Tablosu
CREATE TABLE Kullanici (
    Kullanici_id INT AUTO_INCREMENT PRIMARY KEY,
    Kullanici_Adi VARCHAR(255) NOT NULL,
    Iletisim_No VARCHAR(15),
    Meslek VARCHAR(255),
    E_Posta VARCHAR(255),
    Tarih DATE NOT NULL
);
-- Demirbaş Zimmetleme Tablosu
CREATE TABLE Demirbas_Zimmetleme (
    Zimmet_id INT AUTO_INCREMENT PRIMARY KEY,
    Demirbas_id INT NOT NULL,
    Kullanici_id INT NOT NULL,
    BedenOzellik_id INT NOT NULL,
    Stok_Miktari INT NOT NULL,
    Tarih DATE NOT NULL,
    FOREIGN KEY (Demirbas_id) REFERENCES Demirbas(Demirbas_id),
    FOREIGN KEY (Kullanici_id) REFERENCES Kullanici(Kullanici_id),
    FOREIGN KEY (BedenOzellik_id) REFERENCES Demirbas_BedenOzellik(BedenOzellik_id)
);
-- İşlem Kayıtları Tablosu 
CREATE TABLE IslemKayitlari (
    Islem_id INT AUTO_INCREMENT PRIMARY KEY,
    Entity_Type ENUM('Urun', 'Demirbas') NOT NULL,
    Entity_id INT NOT NULL,
    Stok_Miktar INT NOT NULL,
    Islem_Turu VARCHAR(255) NOT NULL,
    Tarih DATE NOT NULL
);
-- Admin Tablosu
CREATE TABLE Admin (
    Admin_id INT AUTO_INCREMENT PRIMARY KEY,
    Admin_Adi VARCHAR(255) NOT NULL,
    Admin_Sifre VARCHAR(500) NOT NULL,
    Email VARCHAR(255),
    Tarih DATE NOT NULL
);
-- İndeksler
CREATE INDEX idx_urun_adi ON Urun (Urun_Adi);
CREATE INDEX idx_demirbas_adi ON Demirbas (Demirbas_Adi);
CREATE INDEX idx_urun_stok ON Urun_Stok (Urun_id, BedenOzellik_id);
CREATE INDEX idx_demirbas_stok ON Demirbas_Stok (Demirbas_id, BedenOzellik_id);
CREATE INDEX idx_islem_kayit ON IslemKayitlari (Entity_Type, Entity_id);