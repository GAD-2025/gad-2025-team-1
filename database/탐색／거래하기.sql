USE myspace_db;

-- 1. 안전장치 잠시 해제 (이게 핵심입니다!)
SET FOREIGN_KEY_CHECKS = 0;

-- 2. 이제 에러 없이 테이블 삭제 가능
DROP TABLE IF EXISTS artworks;

-- 3. 그릇(테이블) 다시 만들기 (컬럼 추가 버전)
CREATE TABLE `artworks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `artist_name` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `price` int DEFAULT '0',
  `image_url` varchar(500) NOT NULL,
  `views` int DEFAULT '0',
  `description` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. 음식(데이터 8개) 담기
INSERT INTO `artworks` (title, artist_name, category, price, image_url, views, created_at) 
VALUES 
('Cosmic Art #1', 'Creator_1', '이미지 생성', 1500, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80', 120, '2024-11-01 10:00:00'),
('Modern App UI', 'Designer_Kim', '어플 디자인', 3000, 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80', 450, '2024-11-05 14:30:00'),
('Marketing Banner A', 'Ad_Master', '마케팅 배너', 500, 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', 890, '2024-11-10 09:15:00'),
('Fantasy Illustration', 'Art_Lover', '일러스트', 4500, 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80', 55, '2024-11-20 18:20:00'),
('Neon City Vibes', 'Cyber_Punk', '이미지 생성', 0, 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80', 1200, '2024-11-25 11:00:00'),
('Abstract Waves', 'Wave_Maker', '일러스트', 200, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80', 330, '2024-11-26 15:45:00'),
('Tech Startup Logo', 'Logo_Genius', '어플 디자인', 5000, 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80', 67, '2024-11-27 10:10:00'),
('Space Travel', 'Star_Walker', '이미지 생성', 1200, 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=600&q=80', 900, '2024-11-28 08:00:00');

-- 5. 안전장치 다시 켜기 & 확인
SET FOREIGN_KEY_CHECKS = 1;
SELECT * FROM artworks;