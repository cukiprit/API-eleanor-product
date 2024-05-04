-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.33 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for eleanor_product
CREATE DATABASE IF NOT EXISTS `eleanor_product` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `eleanor_product`;

-- Dumping structure for table eleanor_product.products
CREATE TABLE IF NOT EXISTS `products` (
  `id_product` char(36) COLLATE utf8mb4_bin NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `product_description` text COLLATE utf8mb4_bin NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_stock` int NOT NULL,
  PRIMARY KEY (`id_product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table eleanor_product.products: ~2 rows (approximately)
INSERT INTO `products` (`id_product`, `product_name`, `product_description`, `product_image`, `product_price`, `product_stock`) VALUES
	('b5cf43ab-ca6f-4f56-8191-a9c6aaa497bc', 'Obat kuat', 'Obat kuat dijamin kuat sampek amoh', 'product_image-1714793789830.jpeg', 30000.00, 10),
	('ef393066-0c36-4bdf-b41e-0e2d9d2efae2', 'Obat kuat', 'Obat kuat dijamin kuat sampek amoh', 'product_image-1714793741773.png', 30000.00, 10);

-- Dumping structure for table eleanor_product.users
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` char(36) COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL DEFAULT (now()),
  `updated_at` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table eleanor_product.users: ~1 rows (approximately)
INSERT INTO `users` (`id_user`, `username`, `password`, `created_at`, `updated_at`) VALUES
	('6adb3c64-1b1c-416f-b893-fa292cc9f36e', 'Supri', '$2b$10$rQVnOb5jtsf5ue74wm.2g.xVKVKpl5MeJyiyypXaCwgIspPpX9ivC', '2024-05-04 10:17:17', '2024-05-04 10:17:17');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
