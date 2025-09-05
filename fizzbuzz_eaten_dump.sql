-- MySQL dump 10.13  Distrib 9.4.0, for macos13.7 (arm64)
--
-- Host: localhost    Database: fizzbuzz_eaten
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `food_logs`
--

DROP TABLE IF EXISTS `food_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `calories` decimal(8,2) NOT NULL,
  `protein` decimal(8,2) NOT NULL,
  `carbs` decimal(8,2) NOT NULL,
  `fat` decimal(8,2) NOT NULL,
  `fiber` decimal(8,2) DEFAULT '0.00',
  `sodium` decimal(8,2) DEFAULT '0.00',
  `sugar` decimal(8,2) DEFAULT '0.00',
  `is_processed` tinyint(1) DEFAULT '0',
  `is_snack` tinyint(1) DEFAULT '0',
  `image_path` varchar(500) DEFAULT NULL,
  `logged_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_food_logs_user_id` (`user_id`),
  KEY `idx_food_logs_logged_at` (`logged_at`),
  CONSTRAINT `food_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_logs`
--

LOCK TABLES `food_logs` WRITE;
/*!40000 ALTER TABLE `food_logs` DISABLE KEYS */;
INSERT INTO `food_logs` VALUES (6,1,'김치찌개',320.50,18.20,25.30,15.80,4.20,1200.00,8.50,0,0,NULL,'2025-09-05 03:30:00'),(7,1,'현미밥',218.00,4.50,44.80,1.80,3.50,2.00,0.80,0,0,NULL,'2025-09-05 03:30:00'),(8,1,'바나나',89.00,1.10,22.80,0.30,2.60,1.00,12.20,0,1,NULL,'2025-09-05 06:20:00'),(9,1,'닭가슴살 샐러드',185.50,28.50,8.20,4.10,3.80,450.00,5.20,0,0,NULL,'2025-09-05 10:15:00'),(10,1,'아메리카노',5.00,0.30,0.00,0.00,0.00,5.00,0.00,0,1,NULL,'2025-09-05 12:00:00'),(11,1,'토스트',180.00,6.20,28.50,4.80,2.10,320.00,3.20,1,0,NULL,'2025-09-03 23:30:00'),(12,1,'샐러드',95.00,3.50,12.80,2.10,4.50,180.00,8.20,0,0,NULL,'2025-09-04 04:20:00'),(13,1,'계란후라이',155.00,12.60,1.20,11.20,0.00,248.00,0.40,0,0,NULL,'2025-09-02 22:45:00'),(14,1,'치킨버거',520.00,28.50,42.80,25.20,3.20,980.00,6.80,1,0,NULL,'2025-09-03 03:45:00'),(15,1,'아이스크림',180.00,3.20,22.50,8.50,0.50,65.00,18.20,1,1,NULL,'2025-09-03 11:15:00'),(16,1,'오트밀',150.00,5.30,27.00,3.00,4.00,2.00,1.10,0,0,NULL,'2025-09-01 23:00:00'),(17,1,'라면',380.00,8.50,58.20,14.20,2.80,1680.00,4.50,1,0,NULL,'2025-09-02 10:30:00'),(18,1,'요거트',120.00,8.50,15.20,2.80,0.00,85.00,12.50,0,1,NULL,'2025-09-01 01:20:00'),(19,1,'스테이크',450.00,42.50,2.80,28.50,0.00,420.00,0.50,0,0,NULL,'2025-09-01 09:45:00'),(20,1,'감자튀김',320.00,4.20,42.80,15.20,3.80,480.00,0.80,1,1,NULL,'2025-09-01 09:50:00'),(21,1,'김밥',280.00,8.50,48.20,6.80,2.50,650.00,4.20,0,0,NULL,'2025-08-31 03:15:00'),(22,1,'시리얼',220.00,6.80,42.50,3.20,5.20,180.00,12.80,1,0,NULL,'2025-08-29 23:45:00'),(23,1,'피자 외 1개',680.00,28.50,65.20,32.80,4.20,1250.00,8.50,1,0,NULL,'2025-08-30 10:20:00'),(24,1,'샌드위치',350.00,18.20,38.50,15.20,3.80,720.00,5.20,1,0,NULL,'2025-08-29 04:30:00'),(25,1,'과일주스',140.00,1.20,35.80,0.50,1.20,8.00,28.50,0,1,NULL,'2025-08-29 07:00:00'),(26,1,'햄버거',218.00,4.50,44.80,1.80,3.50,2.00,0.80,1,1,'uploads/1757079615177.jpg','2025-09-05 12:06:00'),(27,1,'치즈 피자 외 2개',600.00,24.00,90.00,18.00,6.00,1200.00,6.00,1,1,'uploads/1757079968447.jpg','2025-09-05 12:06:00');
/*!40000 ALTER TABLE `food_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `age` int NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `activity` enum('low','moderate','high') NOT NULL,
  `reco_calories` int DEFAULT NULL,
  `reco_carbs` int DEFAULT NULL,
  `reco_protein` int DEFAULT NULL,
  `reco_fat` int DEFAULT NULL,
  `reco_sugar` int DEFAULT NULL,
  `reco_sodium` int DEFAULT NULL,
  `reco_fiber` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oauth_provider` varchar(20) DEFAULT NULL,
  `oauth_id` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,25,'male','high',2800,360,65,75,40,2000,25,'2025-09-05 08:03:04','2025-09-05 15:54:41','kakao','4431218711',NULL,'미연동 계정'),(2,30,'female','high',2100,280,50,60,32,1700,20,'2025-09-05 09:41:14','2025-09-05 09:44:23',NULL,NULL,NULL,NULL),(3,30,'female','high',2100,280,50,60,32,1700,20,'2025-09-05 09:42:23','2025-09-05 09:42:23',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-06  0:56:04
