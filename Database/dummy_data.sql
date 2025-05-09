-- Ürünler
INSERT INTO Urun (Urun_Adi, Tarih)
VALUES ('Forma 1', '2025-02-15'),
    ('Forma 2', '2025-02-15'),
    ('Forma 3', '2025-02-15');
-- Demirbaşlar
INSERT INTO Demirbas (Demirbas_Adi, Tarih)
VALUES ('Futbol Topu', '2025-02-15'),
    ('Basketbol Topu', '2025-02-15');
-- Ürün Beden/Özellikler
INSERT INTO Urun_BedenOzellik (Urun_id, BedenOzellik, Tarih)
VALUES (1, 'S', '2025-02-15'),
    (1, 'M', '2025-02-15'),
    (1, 'L', '2025-02-15'),
    (1, 'XL', '2025-02-15'),
    (2, 'S', '2025-02-15'),
    (2, 'M', '2025-02-15'),
    (2, 'L', '2025-02-15'),
    (2, 'XL', '2025-02-15'),
    (3, 'S', '2025-02-15'),
    (3, 'M', '2025-02-15'),
    (3, 'L', '2025-02-15'),
    (3, 'XL', '2025-02-15');
-- Demirbaş Beden/Özellikler
INSERT INTO Demirbas_BedenOzellik (Demirbas_id, BedenOzellik, Tarih)
VALUES (1, '13', '2025-02-15'),
    (1, '14', '2025-02-15'),
    (1, '15', '2025-02-15'),
    (2, '13', '2025-02-15'),
    (2, '14', '2025-02-15'),
    (2, '15', '2025-02-15');
-- Ürün Stok
INSERT INTO Urun_Stok (Urun_id, BedenOzellik_id, Stok_Miktar)
VALUES (1, 1, 50),
    (1, 2, 40),
    (1, 3, 30),
    (1, 4, 20),
    (2, 5, 40),
    (2, 6, 30),
    (2, 7, 20),
    (2, 8, 10),
    (3, 9, 40),
    (3, 10, 30),
    (3, 11, 20),
    (3, 12, 10);
-- Demirbaş Stok
INSERT INTO Demirbas_Stok (Demirbas_id, BedenOzellik_id, Stok_Miktar)
VALUES (1, 1, 5),
    (1, 2, 4),
    (1, 3, 3),
    (2, 1, 3),
    (2, 2, 2),
    (2, 3, 1);
/*
 -- Ürün Satış
 INSERT INTO Urun_Satis (Urun_id, BedenOzellik_id, Urun_Miktar, Satis_Fiyati, Toplam_Fiyat, Tarih) VALUES 
 (1, 1, 10, 100.00, 1000.00, '2025-02-15'),
 (2, 2, 5, 120.00, 600.00, '2025-02-15');
 
 -- Ürün Maliyet
 INSERT INTO Urun_Maliyet (Urun_id, BedenOzellik_id, Miktar, Maliyet_Fiyati, Tarih) VALUES 
 (1, 1, 20, 50.00, '2025-02-15'),
 (2, 2, 10, 60.00, '2025-02-15');
 
 -- Demirbaş Maliyet
 INSERT INTO Demirbas_Maliyet (Demirbas_id, BedenOzellik_id, Miktar, Maliyet_Fiyati, Tarih) VALUES 
 (1, 1, 2, 5000.00, '2025-02-15'),
 (2, 2, 1, 7000.00, '2025-02-15');
 
 -- Kullanıcılar
 INSERT INTO Kullanici (Kullanici_Adi, Iletisim_No, Meslek, E_Posta, Tarih) VALUES 
 ('Ahmet Yılmaz', '5551234567', 'Antrenör', 'ahmet@mail.com', '2025-05-09'),
 ('Mehmet Demir', '5559876543', 'Sporcu', 'mehmet@mail.com', '2025-05-09'),
 ('Ayşe Kaya', '5554567890', 'Yönetici', 'ayse@mail.com', '2025-05-09'),
 ('Fatma Çelik', '5556543210', 'Sporcu', 'fatma@mail.com', '2025-05-09'),
 ('Ali Can', '5553216548', 'Antrenör', 'ali@mail.com', '2025-05-09'),
 ('Zeynep Arslan', '5557891234', 'Sporcu', 'zeynep@mail.com', '2025-05-09');
 
 -- Ürün Zimmetleme
 INSERT INTO Urun_Zimmetleme (Urun_id, Kullanici_id, BedenOzellik_id, Stok_Miktari, Tarih) VALUES 
 (1, 1, 1, 1, '2025-02-15');
 
 -- Demirbaş Zimmetleme
 INSERT INTO Demirbas_Zimmetleme (Demirbas_id, Kullanici_id, BedenOzellik_id, Stok_Miktari, Tarih) VALUES 
 (1, 2, 1, 1, '2025-02-15');
 
 -- İşlem Kayıtları
 INSERT INTO IslemKayitlari (Entity_Type, Entity_id, Stok_Miktar, Islem_Turu, Tarih) VALUES 
 ('Urun', 1, 10, 'Satış', '2025-02-15'),
 ('Demirbas', 2, 1, 'Zimmetleme', '2025-02-15');
 
 -- Admin Kullanıcıları
 INSERT INTO Admin (Admin_Adi, Admin_Sifre, Email, Tarih) VALUES 
 ('Admin', '$2a$10$Vz7bC6kpKbNkd8O8J6UvhOcUXW8AGKhkmHT/nMuFf6eYKPjj0r2uG', 'admin@mail.com', '2025-02-15');
 
 */