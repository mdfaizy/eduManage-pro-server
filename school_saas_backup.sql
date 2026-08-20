-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: school_saas
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('18a561fb-48ba-4e3c-a989-fb710f4a0a58','655e90322134593dc57ce39af7d5b3004f38e69bfc04c78440bfc61389b53772','2026-02-08 12:44:00.634','20260208124358_init_schema',NULL,NULL,'2026-02-08 12:43:58.339',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academicyear`
--

DROP TABLE IF EXISTS `academicyear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academicyear` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `AcademicYear_schoolId_fkey` (`schoolId`),
  CONSTRAINT `AcademicYear_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academicyear`
--

LOCK TABLES `academicyear` WRITE;
/*!40000 ALTER TABLE `academicyear` DISABLE KEYS */;
INSERT INTO `academicyear` VALUES (1,1,'2026-26','2026-02-01 00:00:00.000','2027-03-31 00:00:00.000',0,'2026-02-13 17:49:38.443','2026-02-14 16:52:34.373'),(2,1,'2027-28','2027-03-10 00:00:00.000','2028-03-10 00:00:00.000',1,'2026-02-14 16:47:59.110','2026-02-14 16:52:34.390');
/*!40000 ALTER TABLE `academicyear` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission`
--

DROP TABLE IF EXISTS `admission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` int DEFAULT NULL,
  `studentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int DEFAULT NULL,
  `status` enum('PENDING','APPROVED','ACTIVE','CANCELLED','TRANSFERRED','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `admissionNo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rollNumber` int DEFAULT NULL,
  `academicYearId` int NOT NULL,
  `dob` datetime(3) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admissionDate` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `admissionType` enum('NEW','TRANSFER','READMISSION') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `approvedAt` datetime(3) DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medium` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previousBoard` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previousClass` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previousPercentage` double DEFAULT NULL,
  `previousSchool` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tcNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aadharNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bloodGroup` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caste` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherOccupation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianRelation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherOccupation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Admission_classId_fkey` (`classId`),
  KEY `Admission_sectionId_fkey` (`sectionId`),
  KEY `Admission_academicYearId_fkey` (`academicYearId`),
  KEY `Admission_studentId_fkey` (`studentId`),
  KEY `Admission_schoolId_idx` (`schoolId`),
  CONSTRAINT `Admission_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academicyear` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Admission_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Admission_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Admission_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Admission_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission`
--

LOCK TABLES `admission` WRITE;
/*!40000 ALTER TABLE `admission` DISABLE KEYS */;
INSERT INTO `admission` VALUES (3,9,'Rahul Kumar',1,1,1,'ACTIVE','2026-03-01 10:09:09.290','ADM-2026-0002',1,1,NULL,'MALE','Delhi','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,10,'Md Arsh',1,2,1,'ACTIVE','2026-03-01 10:13:25.104','ADM-2026-0003',1,1,NULL,'MALE','Delhi','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,11,'Md Hashmi',1,3,3,'ACTIVE','2026-03-01 10:46:07.076','ADM-2026-0004',1,1,'2005-02-03 00:00:00.000','MALE','Bihar','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,19,'Md Hashmi',1,4,2,'ACTIVE','2026-03-16 05:35:28.449','ADM-2026-0008',2,1,'2026-03-12 00:00:00.000','MALE','nhjhg, Begusarai, Bihar - 848204','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,18,'Arsh',1,4,2,'ACTIVE','2026-03-16 05:43:51.401','ADM-2026-0008',1,1,'2025-01-13 00:00:00.000','MALE','Aijam ,, Begusarai, Bihar - 848204','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,17,'Md Ali',1,2,1,'ACTIVE','2026-05-08 00:47:03.538','ADM-2026-0007',1,1,'2015-05-10 00:00:00.000','MALE','New Delhi','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,23,'Whaid',1,3,3,'ACTIVE','2026-05-08 07:19:39.051','ADM-2026-0013',1,2,'2010-11-01 00:00:00.000','MALE','\n    ,\n    ,\n    \n    - \n  ','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,20,'Md Hashmi',1,4,2,'ACTIVE','2026-05-08 18:23:12.958','ADM-2026-0009',1,2,'2222-12-12 00:00:00.000','MALE','\n    ,\n    ,\n    \n    - \n  ','2026-05-09 14:52:53.908','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,NULL,'Md Hashmi',1,4,2,'PENDING','2026-05-09 09:32:19.744',NULL,NULL,2,'2020-01-01 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-09 09:32:19.744','NEW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,27,'Md Ziyaul',1,4,2,'ACTIVE','2026-05-09 10:01:16.146','ADM-2026-0014',1,2,'2020-11-01 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-09 10:01:16.146','NEW',NULL,'',NULL,'07319987422',NULL,'1',87,'sjhiudasdquh',NULL,'272217806891','A+','Getg','','Md Alam','Farmar','8298686473',NULL,'Md Alam','','Father','gmfaizy2002@gmail.com','SAWQE','House Wife','','','Muslim'),(15,21,'Ashad',1,3,4,'ACTIVE','2026-05-18 17:14:51.638','ADM-2026-0013',1,1,'2026-05-18 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-18 17:14:51.638','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'07319987422',NULL,'',NULL,'sjhiudasdquh',NULL,'','AB-','Sh','','Alams','Farmar','8298686473',NULL,'Md Alam','','Father','','Shabnam Praween','House Wife','','Indian','Muslim'),(16,22,'Whaid Ali',1,4,2,'ACTIVE','2026-05-18 17:31:19.448','ADM-2026-0013',2,1,'2026-05-18 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-18 17:31:19.448','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'07319987422',NULL,'',NULL,'sjhiudasdquh',NULL,'','','','','Md Alam','Farmar','8298686473',NULL,'Md Alam','','','','Shabnam Praween','House Wife','','',''),(17,26,'Zila',1,4,2,'ACTIVE','2026-05-20 17:05:10.282','ADM-2026-0014',3,1,'2007-06-07 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-20 17:05:10.282','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'07319987422',NULL,'',NULL,'sjhiudasdquh',NULL,'','','','','Alams','Farmar','8298686473',NULL,'Md Alam','','','','Shabnam Praween','House Wife','','Indian',''),(18,28,'frtyryre',1,4,2,'ACTIVE','2026-05-20 18:42:47.584','ADM-2026-0015',4,1,'2020-11-11 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-05-20 18:42:47.584','NEW',NULL,'',NULL,'07319987422',NULL,'',NULL,'',NULL,'','','','','Md Alam','','',NULL,'','','','','','','','Indian',''),(19,29,'Md Kalim',1,18,4,'ACTIVE','2026-06-22 06:46:52.967','ADM-2026-0016',1,2,'2026-05-01 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-06-22 06:46:52.967','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'7254065338',NULL,'',NULL,'',NULL,'272217806891','A+','General','','Md Talib Hussan','Farmar','',NULL,'Md Alam','','Father','','Hamida Khatoon','','','Indian','Muslim'),(20,30,'Md Ruk',1,4,2,'ACTIVE','2026-06-22 09:41:15.617','ADM-2026-0017',2,2,'2005-03-01 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-06-22 09:41:15.617','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'07319987422',NULL,'',NULL,'',NULL,'','A+','Getg','','lama','Farmar','',NULL,'','','','','Shabnam Praween','House Wife','','Indian','Muslim'),(21,31,'Md Zishan Ali',1,4,2,'ACTIVE','2026-07-03 05:51:18.238','ADM-2026-0018',3,2,'2007-01-10 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-07-03 05:51:18.238','NEW',NULL,'mdgmfaizyalam@gmail.com',NULL,'07319987422',NULL,'',NULL,'',NULL,'','','Gen','','Md Mustafa','Farmar','8298686473',NULL,'Md Alam','','','','Shabnam Praween','House Wife','','Indian','Muslim'),(22,33,'Md Mustashan',1,4,2,'ACTIVE','2026-07-03 06:05:21.353','ADM-2026-0019',6,1,'2008-10-04 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-07-03 06:05:21.353','NEW',NULL,'moajjms@gmail.com',NULL,'07319987422',NULL,'',NULL,'sjhiudasdquh',NULL,'','A+','Getg','','Dr Tanveer Alam','Farmar','8298686473',NULL,'Md Alam','','','','SAWQE','House Wife','','Indian','Muslim'),(23,34,'Gaurav',1,18,4,'ACTIVE','2026-08-18 18:37:29.840','ADM-2026-0020',2,2,'2002-12-01 00:00:00.000','MALE','nhjhg, Begusarai, Bihar, 848204','2026-08-18 18:37:29.840','NEW',NULL,'gmfaizy2002@gmail.com',NULL,'07319987422',NULL,'',NULL,'',NULL,'123456789009','A-','Obc','','Mohan','Farmar','',NULL,'Mohan','','','','Phulo DEv','House Wife','','Indian','Hindu');
/*!40000 ALTER TABLE `admission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `action` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlog`
--

LOCK TABLES `auditlog` WRITE;
/*!40000 ALTER TABLE `auditlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookpackage`
--

DROP TABLE IF EXISTS `bookpackage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookpackage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `classId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BookPackage_schoolId_fkey` (`schoolId`),
  KEY `BookPackage_classId_fkey` (`classId`),
  CONSTRAINT `BookPackage_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `BookPackage_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookpackage`
--

LOCK TABLES `bookpackage` WRITE;
/*!40000 ALTER TABLE `bookpackage` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookpackage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `maxStudents` int DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Class_name_schoolId_key` (`name`,`schoolId`),
  KEY `Class_schoolId_idx` (`schoolId`),
  KEY `Class_isActive_idx` (`isActive`),
  KEY `Class_isDeleted_idx` (`isDeleted`),
  CONSTRAINT `Class_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,'Class 5',1,NULL,40,1,0,'2026-02-08 16:31:11.942','2026-02-08 16:31:11.942'),(2,'Class 1',1,NULL,50,1,0,'2026-02-08 18:08:35.594','2026-04-11 18:32:25.770'),(3,'Class 2',1,'',140,1,0,'2026-02-08 18:13:23.409','2026-05-13 08:39:31.692'),(4,'Class 4',1,NULL,150,1,0,'2026-02-11 16:57:16.884','2026-04-11 18:32:23.018'),(18,'Class 6',1,'',NULL,1,0,'2026-05-13 09:33:42.211','2026-05-13 09:33:51.506'),(19,'Class 7',1,NULL,NULL,1,0,'2026-05-13 09:35:34.162','2026-05-13 09:35:34.162');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classteacher`
--

DROP TABLE IF EXISTS `classteacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classteacher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ClassTeacher_classId_sectionId_key` (`classId`,`sectionId`),
  KEY `ClassTeacher_teacherId_fkey` (`teacherId`),
  KEY `ClassTeacher_sectionId_fkey` (`sectionId`),
  CONSTRAINT `ClassTeacher_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ClassTeacher_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ClassTeacher_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classteacher`
--

LOCK TABLES `classteacher` WRITE;
/*!40000 ALTER TABLE `classteacher` DISABLE KEYS */;
INSERT INTO `classteacher` VALUES (1,1,3,1,'2026-02-10 17:40:59.000'),(2,1,4,2,'2026-02-11 16:58:30.000');
/*!40000 ALTER TABLE `classteacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `day`
--

DROP TABLE IF EXISTS `day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `day` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `maxPeriods` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isHalfDay` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Day_schoolId_name_key` (`schoolId`,`name`),
  CONSTRAINT `Day_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `day`
--

LOCK TABLES `day` WRITE;
/*!40000 ALTER TABLE `day` DISABLE KEYS */;
INSERT INTO `day` VALUES (1,1,'Monday','Mon',1,8,1,0,'2026-02-13 17:59:21.393','2026-02-13 17:59:21.393'),(2,1,'Tuesday','Tue',2,8,1,0,'2026-02-13 18:01:20.765','2026-02-13 18:01:20.765'),(3,1,'Sunday','Sun',7,4,1,1,'2026-02-14 17:11:56.622','2026-02-14 17:11:56.622'),(4,1,'Friday','Fri',5,8,1,0,'2026-02-16 10:47:02.905','2026-02-16 10:47:02.905'),(5,1,'Wednesday','Web',3,8,1,0,'2026-02-17 09:21:14.564','2026-02-17 09:21:14.564'),(6,1,'Thursday','Thu',4,8,1,0,'2026-02-17 09:21:47.256','2026-02-17 09:21:47.256');
/*!40000 ALTER TABLE `day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation`
--

LOCK TABLES `designation` WRITE;
/*!40000 ALTER TABLE `designation` DISABLE KEYS */;
/*!40000 ALTER TABLE `designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employeeattendance`
--

DROP TABLE IF EXISTS `employeeattendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employeeattendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `employeeId` int NOT NULL,
  `attendanceDate` date NOT NULL,
  `checkInTime` datetime(3) DEFAULT NULL,
  `checkOutTime` datetime(3) DEFAULT NULL,
  `status` enum('PRESENT','ABSENT','LATE','HALF_DAY','LEAVE','HOLIDAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EmployeeAttendance_employeeId_attendanceDate_key` (`employeeId`,`attendanceDate`),
  KEY `EmployeeAttendance_schoolId_attendanceDate_idx` (`schoolId`,`attendanceDate`),
  CONSTRAINT `EmployeeAttendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `EmployeeAttendance_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employeeattendance`
--

LOCK TABLES `employeeattendance` WRITE;
/*!40000 ALTER TABLE `employeeattendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `employeeattendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `classId` int NOT NULL,
  `academicYearId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `endDate` datetime(3) NOT NULL,
  `examType` enum('UNIT_TEST','MID_TERM','FINAL_EXAM','PRACTICAL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isPublished` tinyint(1) NOT NULL DEFAULT '0',
  `schoolId` int NOT NULL,
  `sectionId` int DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Exam_schoolId_fkey` (`schoolId`),
  KEY `Exam_academicYearId_fkey` (`academicYearId`),
  KEY `Exam_classId_fkey` (`classId`),
  KEY `Exam_sectionId_fkey` (`sectionId`),
  CONSTRAINT `Exam_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academicyear` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Exam_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Exam_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Exam_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
INSERT INTO `exam` VALUES (1,'',4,2,'2026-05-12 17:51:44.358','2026-05-22 00:00:00.000','UNIT_TEST',0,1,2,'2026-05-20 00:00:00.000','2026-05-12 17:51:44.358'),(2,'',3,2,'2026-05-12 17:52:17.103','2026-05-22 00:00:00.000','UNIT_TEST',0,1,2,'2026-05-20 00:00:00.000','2026-05-12 17:52:17.103');
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exammark`
--

DROP TABLE IF EXISTS `exammark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exammark` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examSubjectId` int NOT NULL,
  `studentId` int NOT NULL,
  `obtainedMarks` double NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ExamMark_examSubjectId_studentId_key` (`examSubjectId`,`studentId`),
  KEY `ExamMark_studentId_fkey` (`studentId`),
  CONSTRAINT `ExamMark_examSubjectId_fkey` FOREIGN KEY (`examSubjectId`) REFERENCES `examsubject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamMark_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exammark`
--

LOCK TABLES `exammark` WRITE;
/*!40000 ALTER TABLE `exammark` DISABLE KEYS */;
/*!40000 ALTER TABLE `exammark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examsubject`
--

DROP TABLE IF EXISTS `examsubject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examsubject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examId` int NOT NULL,
  `subjectId` int NOT NULL,
  `examDate` datetime(3) NOT NULL,
  `totalMarks` double NOT NULL,
  `passingMarks` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ExamSubject_examId_subjectId_key` (`examId`,`subjectId`),
  KEY `ExamSubject_subjectId_fkey` (`subjectId`),
  CONSTRAINT `ExamSubject_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exam` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ExamSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examsubject`
--

LOCK TABLES `examsubject` WRITE;
/*!40000 ALTER TABLE `examsubject` DISABLE KEYS */;
/*!40000 ALTER TABLE `examsubject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feehead`
--

DROP TABLE IF EXISTS `feehead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feehead` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isOptional` tinyint(1) NOT NULL DEFAULT '0',
  `frequency` enum('ONE_TIME','MONTHLY','YEARLY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MONTHLY',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FeeHead_schoolId_name_key` (`schoolId`,`name`),
  CONSTRAINT `FeeHead_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feehead`
--

LOCK TABLES `feehead` WRITE;
/*!40000 ALTER TABLE `feehead` DISABLE KEYS */;
INSERT INTO `feehead` VALUES (1,1,'Tuition Fee','Monthly tuition',0,'MONTHLY',1,'2026-05-13 18:18:57.440','2026-05-13 18:18:57.440'),(2,1,'Admission Fee','One time admission fee',0,'ONE_TIME',1,'2026-05-13 18:21:27.894','2026-05-13 18:21:27.894'),(3,1,'Books Fee','Books and study materials',1,'ONE_TIME',1,'2026-05-13 18:21:56.644','2026-05-13 18:21:56.644'),(4,1,'Transport Fee','School transport fee',1,'MONTHLY',1,'2026-05-13 18:22:07.878','2026-05-13 18:22:07.878'),(5,1,'Annual Fee','Yearly school fee',0,'YEARLY',1,'2026-05-13 18:22:18.800','2026-05-13 18:22:18.800'),(6,1,'Smart Class Fee','Digital classroom fee',1,'MONTHLY',1,'2026-05-13 18:22:27.193','2026-05-13 18:22:27.193'),(7,1,'Computer Lab Fee','Computer lab usage fee',1,'MONTHLY',1,'2026-05-13 18:22:37.743','2026-05-13 18:22:37.743'),(8,1,'Sports Fee','Sports activities fee',1,'YEARLY',1,'2026-05-13 18:22:46.680','2026-05-13 18:22:46.680'),(9,1,'Hostel Fee','Hostel accommodation fee',1,'MONTHLY',1,'2026-05-13 18:22:54.610','2026-05-13 18:22:54.610');
/*!40000 ALTER TABLE `feehead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feestructure`
--

DROP TABLE IF EXISTS `feestructure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feestructure` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `academicYearId` int NOT NULL,
  `classId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dueDay` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `monthlyFee` double NOT NULL DEFAULT '0',
  `yearlyFee` double NOT NULL DEFAULT '0',
  `oneTimeFee` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `FeeStructure_schoolId_academicYearId_classId_key` (`schoolId`,`academicYearId`,`classId`),
  KEY `FeeStructure_schoolId_idx` (`schoolId`),
  KEY `FeeStructure_classId_idx` (`classId`),
  KEY `FeeStructure_academicYearId_fkey` (`academicYearId`),
  CONSTRAINT `FeeStructure_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academicyear` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FeeStructure_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FeeStructure_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feestructure`
--

LOCK TABLES `feestructure` WRITE;
/*!40000 ALTER TABLE `feestructure` DISABLE KEYS */;
INSERT INTO `feestructure` VALUES (1,1,1,1,'Class 1 Fee Structure',5,1,'2026-05-13 19:00:04.357','2026-05-13 19:00:04.357',0,0,0),(6,1,1,2,'Class 1 Fee Structure',10,1,'2026-05-15 12:03:02.635','2026-08-18 06:43:23.764',1200,500,0),(7,1,1,4,'Class 4 Fee Structure',10,1,'2026-05-20 18:22:16.100','2026-05-20 18:22:16.100',1200,450,0),(8,1,2,18,'Class 6 Fee Structure',10,1,'2026-06-22 08:41:05.130','2026-06-22 08:41:05.130',3700,2500,0);
/*!40000 ALTER TABLE `feestructure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feestructureitem`
--

DROP TABLE IF EXISTS `feestructureitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feestructureitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feeStructureId` int NOT NULL,
  `feeHeadId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `frequency` enum('MONTHLY','QUARTERLY','HALF_YEARLY','YEARLY','ONE_TIME') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FeeStructureItem_feeStructureId_feeHeadId_key` (`feeStructureId`,`feeHeadId`),
  KEY `FeeStructureItem_feeHeadId_fkey` (`feeHeadId`),
  CONSTRAINT `FeeStructureItem_feeHeadId_fkey` FOREIGN KEY (`feeHeadId`) REFERENCES `feehead` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FeeStructureItem_feeStructureId_fkey` FOREIGN KEY (`feeStructureId`) REFERENCES `feestructure` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feestructureitem`
--

LOCK TABLES `feestructureitem` WRITE;
/*!40000 ALTER TABLE `feestructureitem` DISABLE KEYS */;
INSERT INTO `feestructureitem` VALUES (1,1,1,3000.00,'2026-05-13 19:00:04.357','2026-05-13 19:00:04.357','MONTHLY'),(2,1,2,2000.00,'2026-05-13 19:00:04.357','2026-05-13 19:00:04.357','MONTHLY'),(3,1,3,500.00,'2026-05-13 19:00:04.357','2026-05-13 19:00:04.357','MONTHLY'),(8,7,2,450.00,'2026-05-20 18:22:16.100','2026-05-20 18:22:16.100','YEARLY'),(9,7,1,1200.00,'2026-05-20 18:22:16.100','2026-05-20 18:22:16.100','MONTHLY'),(10,8,2,2500.00,'2026-06-22 08:41:05.130','2026-06-22 08:41:05.130','YEARLY'),(11,8,1,1200.00,'2026-06-22 08:41:05.130','2026-06-22 08:41:05.130','MONTHLY'),(12,8,3,2500.00,'2026-06-22 08:41:05.130','2026-06-22 08:41:05.130','MONTHLY'),(13,6,6,1200.00,'2026-08-18 06:43:23.764','2026-08-18 06:43:23.764','MONTHLY'),(14,6,5,500.00,'2026-08-18 06:43:23.764','2026-08-18 06:43:23.764','YEARLY');
/*!40000 ALTER TABLE `feestructureitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolId` int NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Grade_name_schoolId_key` (`name`,`schoolId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (1,'Class 10',1,'Secondary class',1,0,'2026-02-09 13:16:20.000','2026-02-09 08:10:25.000'),(2,'Nursery',1,'This grade mai under 6 year old student',1,0,'2026-02-09 13:16:20.000','2026-02-09 13:16:20.000');
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `schoolId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `fatherEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherOccupation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatherPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guardianRelation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherOccupation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motherPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Parent_userId_key` (`userId`),
  KEY `Parent_schoolId_idx` (`schoolId`),
  CONSTRAINT `Parent_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Parent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
INSERT INTO `parent` VALUES (1,2,1,'2026-02-25 07:17:14.369','2026-02-25 07:17:14.369',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,7,1,'2026-05-08 02:18:20.480','2026-05-08 02:18:20.480',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `studentFeeId` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `paymentMethod` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUCCESS',
  `transactionId` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referenceNo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `collectedBy` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Payment_schoolId_idx` (`schoolId`),
  KEY `Payment_studentId_idx` (`studentId`),
  KEY `Payment_studentFeeId_idx` (`studentFeeId`),
  KEY `Payment_transactionId_idx` (`transactionId`),
  KEY `Payment_paymentDate_idx` (`paymentDate`),
  KEY `Payment_status_idx` (`status`),
  KEY `Payment_collectedBy_fkey` (`collectedBy`),
  CONSTRAINT `Payment_collectedBy_fkey` FOREIGN KEY (`collectedBy`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Payment_studentFeeId_fkey` FOREIGN KEY (`studentFeeId`) REFERENCES `studentfee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Payment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,33,5,799.00,'UPI','SUCCESS',NULL,NULL,'2026-08-19 08:46:55.388',NULL,NULL,'2026-08-19 08:46:55.407','2026-08-19 08:46:55.407'),(3,1,34,6,104.00,'UPI','SUCCESS',NULL,NULL,'2026-08-19 12:53:10.107',NULL,2,'2026-08-19 12:53:10.155','2026-08-19 12:53:10.155'),(4,1,33,5,121.00,'CASH','SUCCESS',NULL,NULL,'2026-08-19 18:37:19.848',NULL,2,'2026-08-19 18:37:19.888','2026-08-19 18:37:19.888'),(5,1,33,5,109.00,'CASH','REFUNDED',NULL,NULL,'2026-08-19 19:15:18.783',NULL,2,'2026-08-19 19:15:18.806','2026-08-19 19:16:23.439'),(6,1,34,6,31.00,'CASH','PARTIALLY_REFUNDED',NULL,NULL,'2026-08-19 19:19:40.677',NULL,2,'2026-08-19 19:19:40.680','2026-08-19 19:20:17.373'),(7,1,34,6,30.00,'CASH','CANCELLED',NULL,NULL,'2026-08-19 19:24:23.358',NULL,2,'2026-08-19 19:24:23.363','2026-08-19 19:25:18.959');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paymentreceipt`
--

DROP TABLE IF EXISTS `paymentreceipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentreceipt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int DEFAULT NULL,
  `studentFeeId` int NOT NULL,
  `paymentId` int DEFAULT NULL,
  `receiptNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `issuedAt` datetime(3) DEFAULT NULL,
  `paymentMethod` enum('CASH','ONLINE','UPI','CARD','BANK_TRANSFER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transactionId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receivedById` int DEFAULT NULL,
  `status` enum('SUCCESS','FAILED','PENDING') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SUCCESS',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PaymentReceipt_receiptNo_key` (`receiptNo`),
  KEY `PaymentReceipt_schoolId_fkey` (`schoolId`),
  KEY `PaymentReceipt_studentFeeId_fkey` (`studentFeeId`),
  KEY `PaymentReceipt_receivedById_fkey` (`receivedById`),
  CONSTRAINT `PaymentReceipt_receivedById_fkey` FOREIGN KEY (`receivedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `PaymentReceipt_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `PaymentReceipt_studentFeeId_fkey` FOREIGN KEY (`studentFeeId`) REFERENCES `studentfee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paymentreceipt`
--

LOCK TABLES `paymentreceipt` WRITE;
/*!40000 ALTER TABLE `paymentreceipt` DISABLE KEYS */;
INSERT INTO `paymentreceipt` VALUES (1,1,NULL,2,NULL,'REC-1778699262444',2000,'2026-05-13 19:07:42.444',NULL,'CASH',NULL,NULL,NULL,'SUCCESS','2026-05-13 19:07:42.473',NULL),(2,1,NULL,3,NULL,'REC-1779475288622',200,'2026-05-22 18:41:28.622',NULL,'CASH','','',NULL,'SUCCESS','2026-05-22 18:41:28.651',NULL),(3,1,NULL,4,NULL,'REC-1779475299503',100,'2026-05-22 18:41:39.503',NULL,'CASH','','',NULL,'SUCCESS','2026-05-22 18:41:39.504',NULL),(4,1,NULL,4,NULL,'REC-1779475330945',30,'2026-05-22 18:42:10.945',NULL,'CASH','','',NULL,'SUCCESS','2026-05-22 18:42:10.947',NULL),(5,1,NULL,5,NULL,'REC-1786536987079',650,'2026-08-12 12:16:27.079',NULL,'UPI',NULL,NULL,NULL,'SUCCESS','2026-08-12 12:16:27.084',NULL),(6,1,NULL,5,NULL,'REC-1786537343526',100,'2026-08-12 12:22:23.526',NULL,'UPI',NULL,NULL,NULL,'SUCCESS','2026-08-12 12:22:23.527',NULL),(7,1,NULL,5,NULL,'REC-1786970736427',40,'2026-08-17 12:45:36.427',NULL,'UPI',NULL,NULL,NULL,'SUCCESS','2026-08-17 12:45:36.433',NULL),(8,1,NULL,5,NULL,'REC-1787129215388',799,'2026-08-19 08:46:55.388',NULL,'UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 08:46:55.407',NULL),(9,1,NULL,5,NULL,'REC-1787138521108',120,'2026-08-19 11:22:01.108','2026-08-19 11:22:01.114','UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 11:22:01.114','2026-08-19 11:22:01.114'),(10,1,NULL,6,NULL,'REC-1787139603798',150,'2026-08-19 11:40:03.798','2026-08-19 11:40:03.809','UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 11:40:03.809','2026-08-19 11:40:03.809'),(11,1,NULL,6,NULL,'REC-1787140122584',130,'2026-08-19 11:48:42.584','2026-08-19 11:48:42.612','UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 11:48:42.612','2026-08-19 11:48:42.612'),(12,1,NULL,5,NULL,'REC-1787141662252',110,'2026-08-19 12:14:22.252','2026-08-19 12:14:22.267','UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 12:14:22.267','2026-08-19 12:14:22.267'),(13,1,NULL,6,NULL,'REC-1787142751041',135,'2026-08-19 12:32:31.041','2026-08-19 12:32:31.068','UPI',NULL,NULL,NULL,'SUCCESS','2026-08-19 12:32:31.068','2026-08-19 12:32:31.068'),(14,1,34,6,3,'RCP2608190001',104,'2026-08-19 12:53:10.174','2026-08-19 12:53:10.169','UPI',NULL,NULL,2,'SUCCESS','2026-08-19 12:53:10.174','2026-08-19 12:53:10.174'),(15,1,33,5,4,'RCP2608200001',121,'2026-08-19 18:37:19.914','2026-08-19 18:37:19.911','CASH',NULL,NULL,2,'SUCCESS','2026-08-19 18:37:19.914','2026-08-19 18:37:19.914'),(16,1,33,5,5,'RCP2608200002',109,'2026-08-19 19:15:18.822','2026-08-19 19:15:18.817','CASH',NULL,NULL,2,'SUCCESS','2026-08-19 19:15:18.822','2026-08-19 19:15:18.822'),(17,1,34,6,6,'RCP2608200003',31,'2026-08-19 19:19:40.689','2026-08-19 19:19:40.687','CASH',NULL,NULL,2,'SUCCESS','2026-08-19 19:19:40.689','2026-08-19 19:19:40.689'),(18,1,34,6,7,'RCP2608200004',30,'2026-08-19 19:24:23.369','2026-08-19 19:24:23.368','CASH',NULL,NULL,2,'SUCCESS','2026-08-19 19:24:23.369','2026-08-19 19:24:23.369');
/*!40000 ALTER TABLE `paymentreceipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `id` int NOT NULL AUTO_INCREMENT,
  `staffId` int NOT NULL,
  `salary` double NOT NULL,
  `month` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `period`
--

DROP TABLE IF EXISTS `period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `period` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `dayId` int NOT NULL,
  `periodNumber` int NOT NULL,
  `startTime` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isBreak` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `academicYearId` int NOT NULL,
  `timingType` enum('REGULAR','WINTER','RAMADAN','EXAM') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REGULAR',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Period_schoolId_academicYearId_dayId_periodNumber_key` (`schoolId`,`academicYearId`,`dayId`,`periodNumber`),
  KEY `Period_dayId_idx` (`dayId`),
  KEY `Period_schoolId_academicYearId_idx` (`schoolId`,`academicYearId`),
  CONSTRAINT `Period_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `day` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Period_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `period`
--

LOCK TABLES `period` WRITE;
/*!40000 ALTER TABLE `period` DISABLE KEYS */;
INSERT INTO `period` VALUES (19,1,1,1,'09:00','09:45',0,1,'2026-02-16 12:28:30.022','2026-02-16 12:28:30.022',1,'REGULAR'),(20,1,1,2,'10:00','10:45',0,1,'2026-02-16 12:28:49.741','2026-02-16 12:28:49.741',1,'REGULAR'),(21,1,1,3,'11:00','11:45',0,1,'2026-02-16 12:29:03.825','2026-02-16 12:29:03.825',1,'REGULAR'),(22,1,1,4,'12:00','12:45',1,1,'2026-02-16 12:29:16.974','2026-02-16 12:29:16.974',1,'REGULAR'),(23,1,4,1,'09:00','09:45',0,1,'2026-02-16 12:30:01.195','2026-02-16 12:30:01.195',1,'REGULAR'),(24,1,4,2,'10:00','10:45',0,1,'2026-02-16 12:30:16.974','2026-02-16 12:30:16.974',1,'REGULAR'),(25,1,4,3,'11:00','11:45',0,1,'2026-02-16 12:30:29.758','2026-02-16 12:30:29.758',1,'REGULAR'),(26,1,4,4,'12:00','12:45',1,1,'2026-02-16 12:30:44.686','2026-02-16 12:30:44.686',1,'REGULAR'),(27,1,2,1,'09:00','09:45',0,1,'2026-02-16 12:59:39.242','2026-02-16 12:59:39.242',1,'REGULAR'),(28,1,2,2,'10:00','10:45',0,1,'2026-02-16 12:59:51.784','2026-02-16 12:59:51.784',1,'REGULAR'),(29,1,3,1,'09:00','09:45',0,1,'2026-02-16 13:00:18.399','2026-02-16 13:00:18.399',1,'REGULAR');
/*!40000 ALTER TABLE `period` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `duration` int NOT NULL,
  `features` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Plan_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund`
--

DROP TABLE IF EXISTS `refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `studentFeeId` int NOT NULL,
  `paymentId` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `refundMethod` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `transactionId` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refundedBy` int DEFAULT NULL,
  `refundDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Refund_schoolId_idx` (`schoolId`),
  KEY `Refund_studentId_idx` (`studentId`),
  KEY `Refund_studentFeeId_idx` (`studentFeeId`),
  KEY `Refund_paymentId_idx` (`paymentId`),
  KEY `Refund_status_idx` (`status`),
  KEY `Refund_refundDate_idx` (`refundDate`),
  KEY `Refund_refundedBy_fkey` (`refundedBy`),
  CONSTRAINT `Refund_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payment` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Refund_refundedBy_fkey` FOREIGN KEY (`refundedBy`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Refund_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Refund_studentFeeId_fkey` FOREIGN KEY (`studentFeeId`) REFERENCES `studentfee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Refund_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund`
--

LOCK TABLES `refund` WRITE;
/*!40000 ALTER TABLE `refund` DISABLE KEYS */;
INSERT INTO `refund` VALUES (1,1,33,5,1,799.00,'Payment refund','UPI','COMPLETED',NULL,2,'2026-08-19 10:59:24.276','2026-08-19 10:59:24.281','2026-08-19 10:59:24.281'),(2,1,33,5,4,121.00,'Payment refund testing','UPI','COMPLETED',NULL,2,'2026-08-19 18:59:47.470','2026-08-19 18:59:47.564','2026-08-19 18:59:47.564'),(3,1,33,5,5,109.00,'Refund status testing','CASH','COMPLETED',NULL,2,'2026-08-19 19:16:23.385','2026-08-19 19:16:23.430','2026-08-19 19:16:23.430'),(4,1,34,6,6,20.00,'Partial refund testing','CASH','COMPLETED',NULL,2,'2026-08-19 19:20:17.356','2026-08-19 19:20:17.364','2026-08-19 19:20:17.364');
/*!40000 ALTER TABLE `refund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `schoolId` int DEFAULT NULL,
  `profileType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_schoolId_key` (`name`,`schoolId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'SUPER_ADMIN',NULL,NULL,'2026-02-08 18:14:42.480','2026-02-08 18:14:42.000'),(2,'SCHOOL_ADMIN',1,NULL,'2026-02-08 16:03:00.699','2026-02-08 16:03:00.699'),(3,'TEACHER',1,NULL,'2026-02-09 09:56:09.012','2026-02-09 09:56:09.012'),(4,'STUDENT',1,NULL,'2026-02-24 11:11:39.151','2026-02-24 11:11:39.151'),(5,'PARENT',1,NULL,'2026-02-24 11:12:26.506','2026-02-24 11:12:26.506'),(6,'Manager',1,NULL,'2026-02-28 08:23:56.142','2026-02-28 08:23:56.142'),(7,'Clurck',1,NULL,'2026-02-28 08:47:08.071','2026-02-28 08:47:08.071');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rolepermission`
--

DROP TABLE IF EXISTS `rolepermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rolepermission` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`),
  KEY `RolePermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rolepermission`
--

LOCK TABLES `rolepermission` WRITE;
/*!40000 ALTER TABLE `rolepermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `rolepermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scholarship`
--

DROP TABLE IF EXISTS `scholarship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scholarship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('FIXED','PERCENTAGE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Scholarship_schoolId_fkey` (`schoolId`),
  CONSTRAINT `Scholarship_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scholarship`
--

LOCK TABLES `scholarship` WRITE;
/*!40000 ALTER TABLE `scholarship` DISABLE KEYS */;
INSERT INTO `scholarship` VALUES (1,1,'Merit Scholarship','PERCENTAGE',10,1,'2026-05-16 17:19:49.031','2026-05-16 17:19:49.031',NULL),(2,1,'EWS Scholarship','FIXED',500,1,'2026-07-02 10:01:29.249','2026-07-02 10:01:29.249','Toper');
/*!40000 ALTER TABLE `scholarship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','BLOCKED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `School_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,'Faizy Public School Xyz','schoolfaizy@gmail.com',NULL,'ACTIVE','2026-02-08 16:03:00.500','2026-02-08 16:03:24.073');
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schoolrequest`
--

DROP TABLE IF EXISTS `schoolrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schoolrequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolName` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schoolrequest`
--

LOCK TABLES `schoolrequest` WRITE;
/*!40000 ALTER TABLE `schoolrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `schoolrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schoolsubscription`
--

DROP TABLE IF EXISTS `schoolsubscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schoolsubscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `planId` int NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `status` enum('ACTIVE','EXPIRED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SchoolSubscription_planId_fkey` (`planId`),
  KEY `SchoolSubscription_schoolId_fkey` (`schoolId`),
  CONSTRAINT `SchoolSubscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `SchoolSubscription_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schoolsubscription`
--

LOCK TABLES `schoolsubscription` WRITE;
/*!40000 ALTER TABLE `schoolsubscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `schoolsubscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schooltiming`
--

DROP TABLE IF EXISTS `schooltiming`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schooltiming` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `academicYear` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REGULAR','WINTER','RAMADAN','EXAM') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REGULAR',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SchoolTiming_schoolId_academicYear_type_key` (`schoolId`,`academicYear`,`type`),
  CONSTRAINT `SchoolTiming_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schooltiming`
--

LOCK TABLES `schooltiming` WRITE;
/*!40000 ALTER TABLE `schooltiming` DISABLE KEYS */;
/*!40000 ALTER TABLE `schooltiming` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `classId` int NOT NULL,
  `schoolId` int NOT NULL,
  `capacity` int DEFAULT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Section_schoolId_name_classId_key` (`schoolId`,`name`,`classId`),
  KEY `Section_classId_fkey` (`classId`),
  CONSTRAINT `Section_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Section_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (1,'A',1,1,40,NULL,1,'2026-02-08 16:43:05.470','2026-05-13 11:24:40.125'),(2,'A',4,1,40,NULL,1,'2026-02-11 16:58:12.357','2026-05-13 11:15:33.354'),(3,'B',3,1,20,NULL,1,'2026-02-17 05:53:07.073','2026-02-17 05:53:07.073'),(4,'A',18,1,NULL,NULL,1,'2026-05-13 10:49:33.877','2026-05-13 10:49:33.877');
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `schoolId` int NOT NULL,
  `designationId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `schoolId` int NOT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dob` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profilePhoto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Student_studentCode_key` (`studentCode`),
  UNIQUE KEY `Student_userId_key` (`userId`),
  KEY `Student_schoolId_idx` (`schoolId`),
  CONSTRAINT `Student_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (9,1,1,'Delhi','2026-03-01 10:09:53.159',NULL,'2026-03-02 08:36:30.197',1,0,'Rahul Kumar','STU-00001',NULL,NULL,NULL,NULL),(10,NULL,1,'Delhi','2026-03-01 10:16:37.614',NULL,'2026-03-01 10:16:37.614',1,0,'Md Arsh','STU-00002',NULL,NULL,NULL,NULL),(11,NULL,1,'Bihar','2026-03-01 10:47:42.547','2005-02-03 00:00:00.000','2026-03-02 09:42:24.878',0,0,'Md Hashmi','STU-00003',NULL,NULL,NULL,NULL),(17,6,1,'New Delhi','2026-05-08 01:55:31.021','2015-05-10 00:00:00.000','2026-05-08 02:07:13.579',1,0,'Md Ali','STU-00004',NULL,NULL,NULL,NULL),(18,NULL,1,'Aijam ,, Begusarai, Bihar - 848204','2026-05-08 07:42:55.356','2025-01-13 00:00:00.000','2026-05-08 07:42:55.356',1,0,'Arsh','STU-00005',NULL,NULL,NULL,NULL),(19,NULL,1,'nhjhg, Begusarai, Bihar - 848204','2026-05-08 08:30:23.011','2026-03-12 00:00:00.000','2026-05-09 16:24:26.529',0,0,'Md Hashmi','STU-00006',NULL,NULL,NULL,NULL),(20,NULL,1,'\n    ,\n    ,\n    \n    - \n  ','2026-05-08 18:25:30.529','2222-12-12 00:00:00.000','2026-05-09 16:24:20.476',1,0,'Md Hashmi','STU-00007',NULL,NULL,NULL,NULL),(21,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-05-18 18:24:22.713','2026-05-18 00:00:00.000','2026-05-18 18:24:22.713',1,0,'Ashad','STU-00008','MALE','gmfaizy2002@gmail.com','07319987422',NULL),(22,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-05-19 16:38:52.540','2026-05-18 00:00:00.000','2026-05-19 16:38:52.540',1,0,'Whaid Ali','STU-00009','MALE','gmfaizy2002@gmail.com','07319987422',NULL),(23,NULL,1,'\n    ,\n    ,\n    \n    - \n  ','2026-05-19 16:43:50.937','2010-11-01 00:00:00.000','2026-05-19 16:43:50.937',1,0,'Whaid','STU-00010','MALE',NULL,NULL,NULL),(26,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-05-20 18:00:48.509','2007-06-07 00:00:00.000','2026-05-20 18:00:48.509',1,0,'Zila','STU-00011','MALE','gmfaizy2002@gmail.com','07319987422',NULL),(27,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-05-20 18:23:57.960','2020-11-01 00:00:00.000','2026-05-20 18:23:57.960',1,0,'Md Ziyaul','STU-00012','MALE','','07319987422',NULL),(28,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-05-20 18:43:00.152','2020-11-11 00:00:00.000','2026-05-20 18:43:00.152',1,0,'frtyryre','STU-00013','MALE','','07319987422',NULL),(29,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-06-22 06:47:51.804','2026-05-01 00:00:00.000','2026-06-22 06:47:51.804',1,0,'Md Kalim','STU-00014','MALE','gmfaizy2002@gmail.com','7254065338',NULL),(30,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-06-22 09:41:23.066','2005-03-01 00:00:00.000','2026-06-22 09:41:23.066',1,0,'Md Ruk','STU-00015','MALE','gmfaizy2002@gmail.com','07319987422',NULL),(31,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-07-03 05:51:39.258','2007-01-10 00:00:00.000','2026-07-03 05:51:39.258',1,0,'Md Zishan Ali','STU-00016','MALE','mdgmfaizyalam@gmail.com','07319987422',NULL),(32,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-07-03 06:05:38.318','2008-10-04 00:00:00.000','2026-07-03 06:05:38.318',1,0,'Md Mustashan','STU-00017','MALE','moajjms@gmail.com','07319987422',NULL),(33,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-07-03 06:20:28.234','2008-10-04 00:00:00.000','2026-07-03 06:20:28.234',1,0,'Md Mustashan','STU-00018','MALE','moajjms@gmail.com','07319987422',NULL),(34,NULL,1,'nhjhg, Begusarai, Bihar, 848204','2026-08-18 18:37:48.067','2002-12-01 00:00:00.000','2026-08-18 18:37:48.067',1,0,'Gaurav','STU-00019','MALE','gmfaizy2002@gmail.com','07319987422',NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentacademicrecord`
--

DROP TABLE IF EXISTS `studentacademicrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentacademicrecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `academicYearId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int DEFAULT NULL,
  `rollNumber` int NOT NULL,
  `admissionNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCurrent` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('ACTIVE','PROMOTED','REVERTED','TRANSFERRED','COMPLETED','DROPPED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `promotedFromId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `transportRouteId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `StudentAcademicRecord_schoolId_idx` (`schoolId`),
  KEY `StudentAcademicRecord_studentId_idx` (`studentId`),
  KEY `StudentAcademicRecord_academicYearId_idx` (`academicYearId`),
  KEY `StudentAcademicRecord_classId_fkey` (`classId`),
  KEY `StudentAcademicRecord_sectionId_fkey` (`sectionId`),
  KEY `StudentAcademicRecord_promotedFromId_fkey` (`promotedFromId`),
  KEY `StudentAcademicRecord_transportRouteId_fkey` (`transportRouteId`),
  CONSTRAINT `StudentAcademicRecord_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academicyear` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_promotedFromId_fkey` FOREIGN KEY (`promotedFromId`) REFERENCES `studentacademicrecord` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAcademicRecord_transportRouteId_fkey` FOREIGN KEY (`transportRouteId`) REFERENCES `transportroute` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentacademicrecord`
--

LOCK TABLES `studentacademicrecord` WRITE;
/*!40000 ALTER TABLE `studentacademicrecord` DISABLE KEYS */;
INSERT INTO `studentacademicrecord` VALUES (1,1,17,1,2,1,1,'ADM-2026-0007',1,'ACTIVE',NULL,'2026-05-08 01:55:31.040','2026-05-10 11:19:59.541',NULL),(2,1,17,2,3,2,1,'ADM-2026-0007',0,'REVERTED',1,'2026-05-08 02:25:10.786','2026-05-10 11:19:59.532',NULL),(3,1,18,1,4,2,1,'ADM-2026-0008',0,'PROMOTED',NULL,'2026-05-08 07:42:55.372','2026-05-10 11:32:17.992',NULL),(4,1,19,1,4,2,2,'ADM-2026-0008',1,'ACTIVE',NULL,'2026-05-08 08:30:23.021','2026-05-10 12:35:52.923',NULL),(5,1,19,2,1,1,1,'ADM-2026-0008',0,'REVERTED',4,'2026-05-08 12:00:02.771','2026-05-10 12:35:52.912',NULL),(6,1,20,2,4,2,1,'ADM-2026-0009',0,'PROMOTED',NULL,'2026-05-08 18:25:30.548','2026-05-10 12:35:36.358',NULL),(7,1,18,2,1,1,2,'ADM-2026-0008',1,'ACTIVE',3,'2026-05-10 11:32:18.019','2026-05-10 11:32:18.019',NULL),(8,1,20,1,1,1,1,'ADM-2026-0009',1,'ACTIVE',6,'2026-05-10 12:35:36.435','2026-05-10 12:35:36.435',NULL),(9,1,21,1,3,4,1,'ADM-2026-0013',1,'ACTIVE',NULL,'2026-05-18 18:24:22.750','2026-05-18 18:24:22.750',NULL),(10,1,22,1,4,2,2,'ADM-2026-0013',1,'ACTIVE',NULL,'2026-05-19 16:38:52.579','2026-05-19 16:38:52.579',NULL),(11,1,23,2,3,3,1,'ADM-2026-0013',1,'ACTIVE',NULL,'2026-05-19 16:43:50.960','2026-05-19 16:43:50.960',NULL),(14,1,26,1,4,2,3,'ADM-2026-0014',1,'ACTIVE',NULL,'2026-05-20 18:00:48.523','2026-05-20 18:00:48.523',NULL),(15,1,27,2,4,2,1,'ADM-2026-0014',1,'ACTIVE',NULL,'2026-05-20 18:23:57.985','2026-05-20 18:23:57.985',NULL),(16,1,28,1,4,2,4,'ADM-2026-0015',1,'ACTIVE',NULL,'2026-05-20 18:43:00.167','2026-05-20 18:43:00.167',NULL),(17,1,29,2,18,4,1,'ADM-2026-0016',1,'ACTIVE',NULL,'2026-06-22 06:47:51.817','2026-06-22 06:47:51.817',NULL),(18,1,30,2,4,2,2,'ADM-2026-0017',1,'ACTIVE',NULL,'2026-06-22 09:41:23.083','2026-06-22 09:41:23.083',NULL),(19,1,31,2,4,2,3,'ADM-2026-0018',1,'ACTIVE',NULL,'2026-07-03 05:51:39.291','2026-07-03 05:51:39.291',NULL),(20,1,32,1,4,2,4,'ADM-2026-0019',1,'ACTIVE',NULL,'2026-07-03 06:05:38.341','2026-07-03 06:05:38.341',NULL),(21,1,33,1,4,2,6,'ADM-2026-0019',1,'ACTIVE',NULL,'2026-07-03 06:20:28.253','2026-07-03 06:20:28.253',NULL),(22,1,34,2,18,4,2,'ADM-2026-0020',1,'ACTIVE',NULL,'2026-08-18 18:37:48.080','2026-08-18 18:37:48.080',NULL);
/*!40000 ALTER TABLE `studentacademicrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentattendancerecord`
--

DROP TABLE IF EXISTS `studentattendancerecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentattendancerecord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sessionId` int NOT NULL,
  `studentId` int NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE','HALF_DAY','LEAVE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentAttendanceRecord_sessionId_studentId_key` (`sessionId`,`studentId`),
  KEY `StudentAttendanceRecord_studentId_idx` (`studentId`),
  CONSTRAINT `StudentAttendanceRecord_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `studentattendancesession` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StudentAttendanceRecord_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentattendancerecord`
--

LOCK TABLES `studentattendancerecord` WRITE;
/*!40000 ALTER TABLE `studentattendancerecord` DISABLE KEYS */;
INSERT INTO `studentattendancerecord` VALUES (1,1,17,'PRESENT','','2026-05-10 17:23:39.334','2026-05-10 17:23:39.334'),(2,1,18,'ABSENT','Sick leave','2026-05-10 17:23:39.334','2026-05-10 17:23:39.334'),(3,1,19,'LATE','Bus delay','2026-05-10 17:23:39.334','2026-05-10 17:23:39.334'),(4,2,20,'ABSENT','','2026-05-10 18:22:48.131','2026-05-10 18:22:48.131'),(5,2,18,'PRESENT','','2026-05-10 18:22:48.131','2026-05-10 18:22:48.131'),(7,4,19,'PRESENT','','2026-05-13 12:21:01.809','2026-05-13 12:21:01.809'),(8,5,23,'HALF_DAY','','2026-05-29 18:08:45.294','2026-05-29 18:08:45.294'),(9,6,27,'PRESENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(10,6,19,'PRESENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(11,6,22,'ABSENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(12,6,30,'PRESENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(13,6,26,'PRESENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(14,6,28,'ABSENT','','2026-06-30 07:26:35.075','2026-06-30 07:26:35.075'),(15,7,23,'PRESENT','','2026-07-01 06:36:21.854','2026-07-01 06:36:21.854'),(16,8,20,'PRESENT','','2026-07-01 06:37:25.212','2026-07-01 06:37:25.212'),(17,8,18,'PRESENT','','2026-07-01 06:37:25.212','2026-07-01 06:37:25.212');
/*!40000 ALTER TABLE `studentattendancerecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentattendancesession`
--

DROP TABLE IF EXISTS `studentattendancesession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentattendancesession` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int DEFAULT NULL,
  `attendanceDate` date NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `markedById` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentAttendanceSession_schoolId_classId_sectionId_attendan_key` (`schoolId`,`classId`,`sectionId`,`attendanceDate`),
  KEY `StudentAttendanceSession_schoolId_attendanceDate_idx` (`schoolId`,`attendanceDate`),
  KEY `StudentAttendanceSession_classId_fkey` (`classId`),
  KEY `StudentAttendanceSession_sectionId_fkey` (`sectionId`),
  KEY `StudentAttendanceSession_markedById_fkey` (`markedById`),
  CONSTRAINT `StudentAttendanceSession_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAttendanceSession_markedById_fkey` FOREIGN KEY (`markedById`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAttendanceSession_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentAttendanceSession_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentattendancesession`
--

LOCK TABLES `studentattendancesession` WRITE;
/*!40000 ALTER TABLE `studentattendancesession` DISABLE KEYS */;
INSERT INTO `studentattendancesession` VALUES (1,1,1,1,'2026-05-10','2026-05-10 17:23:39.282','2026-05-10 17:23:39.282',2),(2,1,1,1,'2026-10-06','2026-05-10 18:22:48.106','2026-05-10 18:22:48.106',2),(3,1,4,2,'2026-05-13','2026-05-13 12:18:37.169','2026-05-13 12:18:37.169',2),(4,1,4,2,'2026-05-14','2026-05-13 12:21:01.799','2026-05-13 12:21:01.799',2),(5,1,3,3,'2026-05-29','2026-05-29 18:08:45.276','2026-05-29 18:08:45.276',2),(6,1,4,2,'2026-06-30','2026-06-30 07:26:35.050','2026-06-30 07:26:35.050',2),(7,1,3,3,'2026-07-01','2026-07-01 06:36:21.822','2026-07-01 06:36:21.822',2),(8,1,1,1,'2026-07-01','2026-07-01 06:37:25.196','2026-07-01 06:37:25.196',2);
/*!40000 ALTER TABLE `studentattendancesession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentdiscount`
--

DROP TABLE IF EXISTS `studentdiscount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentdiscount` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `feeHeadId` int NOT NULL,
  `type` enum('FIXED','PERCENTAGE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `applyType` enum('ONE_TIME','MONTHLY','YEARLY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `appliedOn` datetime(3) DEFAULT NULL,
  `startMonth` int DEFAULT NULL,
  `endMonth` int DEFAULT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `StudentDiscount_schoolId_idx` (`schoolId`),
  KEY `StudentDiscount_studentId_idx` (`studentId`),
  KEY `StudentDiscount_feeHeadId_idx` (`feeHeadId`),
  CONSTRAINT `StudentDiscount_feeHeadId_fkey` FOREIGN KEY (`feeHeadId`) REFERENCES `feehead` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentDiscount_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentDiscount_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentdiscount`
--

LOCK TABLES `studentdiscount` WRITE;
/*!40000 ALTER TABLE `studentdiscount` DISABLE KEYS */;
INSERT INTO `studentdiscount` VALUES (50,1,34,3,'FIXED',900.00,'ONE_TIME','2026-08-19 07:11:34.685',NULL,NULL,'hyut yty iouiou ryt',1,'2026-08-18 18:38:36.542','2026-08-19 07:11:34.693'),(51,1,34,1,'FIXED',500.00,'MONTHLY',NULL,8,11,'uiy iuyuiyu oo88',1,'2026-08-18 18:42:03.117','2026-08-19 07:11:34.626'),(52,1,34,2,'FIXED',900.00,'ONE_TIME','2026-08-19 07:11:34.704',NULL,NULL,'uyuyt uytutuy iuy y',1,'2026-08-18 18:44:01.153','2026-08-19 07:11:34.708');
/*!40000 ALTER TABLE `studentdiscount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentfee`
--

DROP TABLE IF EXISTS `studentfee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentfee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoiceNo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `feeStructureId` int NOT NULL,
  `month` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `paidAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dueAmount` decimal(10,2) NOT NULL,
  `lateFee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `isAdmissionFee` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('PAID','PARTIAL','PENDING','OVERDUE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `dueDate` datetime(3) NOT NULL,
  `remarks` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentFee_invoiceNo_key` (`invoiceNo`),
  UNIQUE KEY `StudentFee_studentId_feeStructureId_month_year_key` (`studentId`,`feeStructureId`,`month`,`year`),
  KEY `StudentFee_studentId_idx` (`studentId`),
  KEY `StudentFee_schoolId_idx` (`schoolId`),
  KEY `StudentFee_status_idx` (`status`),
  KEY `StudentFee_feeStructureId_fkey` (`feeStructureId`),
  CONSTRAINT `StudentFee_feeStructureId_fkey` FOREIGN KEY (`feeStructureId`) REFERENCES `feestructure` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentFee_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentFee_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentfee`
--

LOCK TABLES `studentfee` WRITE;
/*!40000 ALTER TABLE `studentfee` DISABLE KEYS */;
INSERT INTO `studentfee` VALUES (2,'INV-1778699064845',1,17,1,5,2026,5500.00,2000.00,3500.00,0.00,0.00,0,'PARTIAL','2026-05-05 00:00:00.000',NULL,'2026-05-13 19:04:24.859','2026-08-18 18:03:08.839'),(3,'INV-1779018893272',1,17,6,4,2026,1200.00,200.00,1000.00,0.00,0.00,0,'PARTIAL','2026-04-10 00:00:00.000',NULL,'2026-05-17 11:54:53.302','2026-08-18 18:03:12.801'),(4,'INV-1779302580199',1,28,7,5,2026,1650.00,130.00,1020.00,0.00,500.00,0,'PARTIAL','2026-05-20 18:43:00.177',NULL,'2026-05-20 18:43:00.208','2026-08-18 18:28:16.722'),(5,'INV-1783059628325',1,33,7,7,2026,1650.00,1020.00,630.00,0.00,0.00,0,'PARTIAL','2026-07-03 06:20:28.267',NULL,'2026-07-03 06:20:28.394','2026-08-19 19:16:23.460'),(6,'INV-1787078268103',1,34,8,8,2026,6200.00,530.00,5670.00,0.00,2300.00,0,'PARTIAL','2026-08-18 18:37:48.088',NULL,'2026-08-18 18:37:48.109','2026-08-19 19:25:18.943');
/*!40000 ALTER TABLE `studentfee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentfeeitem`
--

DROP TABLE IF EXISTS `studentfeeitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentfeeitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentFeeId` int NOT NULL,
  `feeHeadId` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `frequency` enum('MONTHLY','QUARTERLY','HALF_YEARLY','YEARLY','ONE_TIME') NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `StudentFeeItem_studentFeeId_idx` (`studentFeeId`),
  KEY `StudentFeeItem_feeHeadId_idx` (`feeHeadId`),
  CONSTRAINT `StudentFeeItem_feeHeadId_fkey` FOREIGN KEY (`feeHeadId`) REFERENCES `feehead` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentFeeItem_studentFeeId_fkey` FOREIGN KEY (`studentFeeId`) REFERENCES `studentfee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentfeeitem`
--

LOCK TABLES `studentfeeitem` WRITE;
/*!40000 ALTER TABLE `studentfeeitem` DISABLE KEYS */;
INSERT INTO `studentfeeitem` VALUES (1,4,1,1200.00,'MONTHLY','2026-05-20 18:43:00.000'),(2,4,2,450.00,'YEARLY','2026-05-20 18:43:00.000'),(3,5,1,1200.00,'MONTHLY','2026-07-03 06:20:28.394'),(4,5,2,450.00,'YEARLY','2026-07-03 06:20:28.394'),(5,6,1,1200.00,'MONTHLY','2026-08-18 18:37:48.109'),(6,6,2,2500.00,'YEARLY','2026-08-18 18:37:48.109'),(7,6,3,2500.00,'MONTHLY','2026-08-18 18:37:48.109');
/*!40000 ALTER TABLE `studentfeeitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentparent`
--

DROP TABLE IF EXISTS `studentparent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentparent` (
  `studentId` int NOT NULL,
  `parentId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`studentId`,`parentId`),
  KEY `StudentParent_parentId_idx` (`parentId`),
  CONSTRAINT `StudentParent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `parent` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StudentParent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentparent`
--

LOCK TABLES `studentparent` WRITE;
/*!40000 ALTER TABLE `studentparent` DISABLE KEYS */;
INSERT INTO `studentparent` VALUES (17,2,'2026-05-08 02:18:20.492');
/*!40000 ALTER TABLE `studentparent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentscholarship`
--

DROP TABLE IF EXISTS `studentscholarship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentscholarship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `studentId` int NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `scholarshipId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StudentScholarship_studentId_scholarshipId_key` (`studentId`,`scholarshipId`),
  KEY `StudentScholarship_schoolId_fkey` (`schoolId`),
  KEY `StudentScholarship_scholarshipId_fkey` (`scholarshipId`),
  CONSTRAINT `StudentScholarship_scholarshipId_fkey` FOREIGN KEY (`scholarshipId`) REFERENCES `scholarship` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentScholarship_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `StudentScholarship_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentscholarship`
--

LOCK TABLES `studentscholarship` WRITE;
/*!40000 ALTER TABLE `studentscholarship` DISABLE KEYS */;
INSERT INTO `studentscholarship` VALUES (1,1,18,1,'2026-05-16 19:08:23.580','2026-05-16 19:08:23.580',1),(4,1,11,1,'2026-05-16 19:09:09.884','2026-05-16 19:09:09.884',1),(5,1,17,1,'2026-05-17 11:34:04.646','2026-05-17 11:34:04.646',1),(6,1,30,1,'2026-07-02 11:00:55.470','2026-07-02 11:00:55.470',2),(7,1,28,1,'2026-07-02 11:32:59.119','2026-07-02 11:32:59.119',2),(8,1,27,1,'2026-07-02 11:34:05.826','2026-07-02 11:34:05.826',2),(9,1,29,1,'2026-07-02 12:03:42.886','2026-07-02 12:03:42.886',2);
/*!40000 ALTER TABLE `studentscholarship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `schoolId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `maxMarks` int DEFAULT NULL,
  `passMarks` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Subject_code_schoolId_key` (`code`,`schoolId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,'Computer Science','COM-1-235','CS basics',1,1,'2026-02-08 16:11:28.051','2026-02-08 16:20:09.152',NULL,NULL),(2,'EVS','EVS-1-127','jkhjkdjkq jkqwh eoqe qwj',1,1,'2026-02-08 18:14:44.414','2026-05-01 18:35:15.743',100,30),(3,'Robotics','ROB-1-576',NULL,1,1,'2026-02-08 18:27:30.121','2026-02-08 18:27:30.121',NULL,NULL),(4,'Hindi','HIN-1-758','Hiuef urueyr ew fj',1,1,'2026-05-01 17:52:43.691','2026-05-01 17:52:43.691',100,30),(5,'Biology','BIO-1-505','Science subject',1,1,'2026-05-13 12:01:39.034','2026-05-13 12:02:23.517',NULL,NULL);
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `syllabus`
--

DROP TABLE IF EXISTS `syllabus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `syllabus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subjectId` int NOT NULL,
  `gradeId` int DEFAULT NULL,
  `classId` int DEFAULT NULL,
  `schoolId` int NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('CORE','EXTRA','THEORY','PRACTICAL','BOTH') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CORE',
  `chapters` json NOT NULL,
  `maxMarks` int DEFAULT NULL,
  `passMarks` int DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Syllabus_subjectId_gradeId_classId_schoolId_key` (`subjectId`,`gradeId`,`classId`,`schoolId`),
  KEY `Syllabus_gradeId_fkey` (`gradeId`),
  KEY `Syllabus_classId_fkey` (`classId`),
  CONSTRAINT `Syllabus_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Syllabus_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `grade` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Syllabus_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `syllabus`
--

LOCK TABLES `syllabus` WRITE;
/*!40000 ALTER TABLE `syllabus` DISABLE KEYS */;
INSERT INTO `syllabus` VALUES (1,1,1,1,1,NULL,'CORE','[{\"title\": \"Introduction to Computer\", \"topics\": [\"Hardware\", \"Software\"]}, {\"title\": \"MS Word\", \"topics\": [\"Formatting\", \"Tables\"]}]',100,33,1,0,'2026-02-08 16:57:22.468','2026-02-08 16:57:22.468'),(2,1,2,NULL,1,NULL,'EXTRA','[{\"title\": \"Speed, Accuracy, Diligence, Reliability, Memory, Logical, Versatility, Automation, Consistency and Storage\", \"topics\": []}]',100,33,1,0,'2026-02-08 17:52:38.133','2026-02-08 17:52:38.133');
/*!40000 ALTER TABLE `syllabus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `schoolId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `teacherCode` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `joiningDate` datetime(3) DEFAULT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qualification` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Teacher_userId_key` (`userId`),
  UNIQUE KEY `Teacher_teacherCode_key` (`teacherCode`),
  KEY `Teacher_schoolId_fkey` (`schoolId`),
  CONSTRAINT `Teacher_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,2,1,'2026-02-09 17:13:21.841','2026-02-09 18:33:35.284','SCH1-2024-TCH-001','07319987422',NULL,'MALE','B tech'),(2,3,1,'2026-02-17 12:46:07.000','2026-04-11 18:19:43.038','TCH-003',NULL,NULL,'MALE',NULL),(3,4,1,'2026-04-11 18:21:29.275','2026-04-11 18:21:29.275','SCH1-2026-TCH-003',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachersubject`
--

DROP TABLE IF EXISTS `teachersubject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachersubject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherId` int NOT NULL,
  `subjectId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TeacherSubject_subjectId_fkey` (`subjectId`),
  KEY `TeacherSubject_classId_fkey` (`classId`),
  KEY `TeacherSubject_sectionId_fkey` (`sectionId`),
  KEY `TeacherSubject_teacherId_fkey` (`teacherId`),
  CONSTRAINT `TeacherSubject_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `TeacherSubject_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `TeacherSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `TeacherSubject_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachersubject`
--

LOCK TABLES `teachersubject` WRITE;
/*!40000 ALTER TABLE `teachersubject` DISABLE KEYS */;
INSERT INTO `teachersubject` VALUES (1,1,2,3,1),(2,1,1,4,2),(3,1,2,3,3),(4,2,3,4,2),(5,2,3,3,3),(6,2,2,4,2);
/*!40000 ALTER TABLE `teachersubject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `classId` int NOT NULL,
  `sectionId` int NOT NULL,
  `subjectId` int NOT NULL,
  `teacherId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `periodId` int NOT NULL,
  `academicYearId` int NOT NULL,
  `dayId` int NOT NULL,
  `endTime` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Timetable_sectionId_dayId_periodId_academicYearId_key` (`sectionId`,`dayId`,`periodId`,`academicYearId`),
  UNIQUE KEY `Timetable_teacherId_dayId_periodId_academicYearId_key` (`teacherId`,`dayId`,`periodId`,`academicYearId`),
  KEY `Timetable_classId_fkey` (`classId`),
  KEY `Timetable_subjectId_fkey` (`subjectId`),
  KEY `Timetable_schoolId_academicYearId_idx` (`schoolId`,`academicYearId`),
  KEY `Timetable_periodId_fkey` (`periodId`),
  KEY `Timetable_dayId_fkey` (`dayId`),
  CONSTRAINT `Timetable_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_dayId_fkey` FOREIGN KEY (`dayId`) REFERENCES `day` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_periodId_fkey` FOREIGN KEY (`periodId`) REFERENCES `period` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `section` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Timetable_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
INSERT INTO `timetable` VALUES (79,1,4,2,1,1,'2026-02-17 08:05:09.914','2026-02-17 08:05:09.914',19,1,1,'09:45','09:00'),(80,1,4,2,3,2,'2026-02-17 08:05:09.925','2026-02-17 08:05:09.925',27,1,2,'09:45','09:00'),(81,1,4,2,3,2,'2026-02-17 08:05:09.933','2026-02-17 08:05:09.933',20,1,1,'10:45','10:00'),(82,1,4,2,1,1,'2026-02-17 08:05:09.941','2026-02-17 08:05:09.941',28,1,2,'10:45','10:00'),(83,1,3,3,3,2,'2026-02-17 08:05:50.171','2026-02-17 08:05:50.171',19,1,1,'09:45','09:00'),(84,1,3,3,2,1,'2026-02-17 08:05:50.181','2026-02-17 08:05:50.181',27,1,2,'09:45','09:00'),(85,1,3,3,2,1,'2026-02-17 08:05:50.190','2026-02-17 08:05:50.190',20,1,1,'10:45','10:00'),(86,1,3,3,3,2,'2026-02-17 08:05:50.201','2026-02-17 08:05:50.201',28,1,2,'10:45','10:00');
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `tokenHash` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('ACCESS','REFRESH','RESET_PASSWORD','VERIFY_EMAIL','SET_PASSWORD') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `isUsed` tinyint(1) NOT NULL DEFAULT '0',
  `isRevoked` tinyint(1) NOT NULL DEFAULT '0',
  `userAgent` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ipAddress` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Token_tokenHash_key` (`tokenHash`),
  KEY `Token_userId_type_idx` (`userId`,`type`),
  CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (325,2,'61a1bcb77b14c540d32877595bd045af2a326205575857a16671dec4fd735199','REFRESH','2026-08-20 09:07:26.183',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 09:07:26.199'),(326,2,'67361e477e4a187b0dbe4823637008361d153345f6ae3908692997f32dd63166','REFRESH','2026-08-20 09:07:26.254',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 09:07:26.254'),(327,2,'41db511eb4609363835ba153afd87566f76341bc9823649fe0c225e8ec86fe86','REFRESH','2026-08-20 09:07:26.292',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 09:07:26.292'),(328,2,'f48db9cb635d7e1e4a7ab6ca9afc1ed7108b8adc662d590dc54b8e24222aa500','REFRESH','2026-08-20 09:07:26.343',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 09:07:26.343'),(330,2,'f0c6c31f597c15eac1b286331120ba66ffff9f5ebbb350dc7442540494bea80a','REFRESH','2026-08-20 11:17:09.226',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 11:17:09.239'),(331,2,'d4fef74f7294004598863f74fb7e02ec84dae07bf3d6c28586b81ee04a4520c8','REFRESH','2026-08-20 11:17:09.272',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 11:17:09.273'),(332,2,'2a191de3af07ca2dc4956d0654d10ddadd8d5ecfbfedc4f5ac57e4533388bee0','REFRESH','2026-08-20 11:17:09.304',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 11:17:09.306'),(333,2,'7aab0dd846895c2750fb9069bc2368ca8db163ff5e2c5b7e40772113bbdc4e73','REFRESH','2026-08-20 11:17:09.329',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 11:17:09.329'),(335,2,'3545879af3eb21e960a8a1a8fcd00b70028c297d2e3e59915953a5866d36ad6f','REFRESH','2026-08-20 11:17:09.642',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-13 11:17:09.643'),(338,2,'60a195bb16735a1bce6cb37c7c8525883dcd1a668c4a34851398af13dda538d7','REFRESH','2026-08-21 11:36:37.951',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-14 11:36:37.981'),(339,2,'da66197e37d6f23f514bb109cf6665e59d8283beb3e3a54ffc2a79019b6eb339','REFRESH','2026-08-21 11:36:38.062',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-14 11:36:38.063'),(340,2,'c8132dc386e96473a192aec77362b7820424ec9d580bb05096089a766c7f35ae','REFRESH','2026-08-21 11:36:38.109',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-14 11:36:38.113'),(341,2,'81ba1b72f129f846fd1fca7f124689ffab8f4f782f207603eac1a94495eb197b','REFRESH','2026-08-21 11:36:38.141',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-14 11:36:38.143'),(342,2,'fa9354e7a4f5186a78822ee5690e2e6e3f260132f9840e79324f262e3d90b678','REFRESH','2026-08-21 11:36:38.199',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-14 11:36:38.199'),(344,2,'9b90ad245190f2ead86c5d615cb1dcefae13d9e6da17cbc0c6304ca387a68196','REFRESH','2026-08-24 09:36:08.541',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 09:36:08.588'),(345,2,'cae48a2e7a89fe443d8da7bb41f501af17bdde687432fa140f4ae68a51bbd364','REFRESH','2026-08-24 09:36:08.659',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 09:36:08.660'),(346,2,'0bdc1bcb3035c7dfa0a004b7a7e04db536cf364efea3d8646b2a00553223a4ea','REFRESH','2026-08-24 09:36:08.700',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 09:36:08.700'),(347,2,'43145739c39b9923182def73dec20b7ecd63abadf92b51fbd98db25166b4452a','REFRESH','2026-08-24 09:36:08.780',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 09:36:08.781'),(349,2,'aff60d3f836da0498c9cbad42c28fc362c457f656b6ee9e90b5cd606469f9107','REFRESH','2026-08-24 11:42:21.588',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 11:42:21.598'),(350,2,'76710a408251811ceb3896742e4865da3217e7c61d06fb17c13ba54d810ee4d9','REFRESH','2026-08-24 11:42:21.829',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 11:42:21.837'),(351,2,'90126775eb476fb06349cd71f1d0a48e5c7546d2203923cd508692b59e68508e','REFRESH','2026-08-24 11:42:22.019',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 11:42:22.020'),(352,2,'b2e49ecd5bafa549fde922b1aa23651292ee7a97f85300cd75c0ecdd67224322','REFRESH','2026-08-24 11:42:22.256',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 11:42:22.257'),(353,2,'7af223de3020ed708d33ea6427e021a345430b647de44e1eea6532885b7ebbfd','REFRESH','2026-08-24 17:48:12.289',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-17 17:48:12.344'),(355,2,'1afad018dc6fdab1a84f79f94a7b8609e3088c737bd97efab7720b4935705d44','REFRESH','2026-08-25 08:33:20.512',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 08:33:20.514'),(357,2,'22c925620c0951b469cb44f12ea56f9afd78b572297412cea04f6528156d0e9c','REFRESH','2026-08-25 10:35:19.294',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 10:35:19.296'),(359,2,'f40f3ab38de6cac28ce3a75e86d9f505188fd37b0f63b63da64b92714033a824','REFRESH','2026-08-25 12:36:29.904',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 12:36:29.907'),(360,2,'6b41b5a1a35dd8bb3228c2201441a03cc77da6f078c120a31cd2f5cca145e2c9','REFRESH','2026-08-25 12:36:29.969',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 12:36:29.969'),(361,2,'dcceb2e246b7ef647a6c5481217cb7cc6a5a14ccf669f173617c7ee9f7b499e9','REFRESH','2026-08-25 12:36:29.992',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 12:36:29.992'),(362,2,'4d59acba607ff90b7a4fdeb30652782e5f7c833e74a1aa4cd6be7a320d5b7bfe','REFRESH','2026-08-25 12:36:30.024',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 12:36:30.026'),(363,2,'6cd146293c99adf972113bef99e393b47e32c35b983c3e48ea762b2c861702f2','REFRESH','2026-08-25 12:36:30.049',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 12:36:30.050'),(364,2,'77fb41c0bc6de87a2972bfc7cb66f963225dfbe5329a1f48914f95a7b3a1c1e0','REFRESH','2026-08-25 18:01:51.339',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-18 18:01:51.367'),(366,2,'e60e442806a53a005722e950f83467c8ffb24d6959b9b847928b856da8f1a40d','REFRESH','2026-08-26 08:57:30.755',0,0,'PostmanRuntime/7.54.0','::1','2026-08-19 08:57:30.778'),(368,2,'8ecd252cff350110e03a10a54767f89136e33d5423659803051415ba68d6dc60','REFRESH','2026-08-26 10:59:04.000',0,0,'PostmanRuntime/7.54.0','::1','2026-08-19 10:59:04.028'),(369,2,'2ce42e96618d1fc59277f8700a73941aa812990ed8735f444395138ea72fc9b7','REFRESH','2026-08-26 10:59:36.912',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 10:59:36.913'),(370,2,'9bd81f4451ac5a596de3a707942f34925a60fb5a125778278e215fb4417f58bf','REFRESH','2026-08-26 10:59:36.937',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 10:59:36.938'),(371,2,'5708f12774ff51f6848dfca395d8de6f8a30749799f1c69beb3062daefe8c3b0','REFRESH','2026-08-26 10:59:36.958',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 10:59:36.958'),(372,2,'e8e0675ce2a1a26d00b64499e3044c2057d7da0483feee5e0ef0f61db2bfd213','REFRESH','2026-08-26 10:59:36.989',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 10:59:36.990'),(374,2,'178899425d8d30b036c2aafe2480b8d9a9dd87023b69d64dd0d4c0214b3ab597','REFRESH','2026-08-26 12:01:35.643',0,0,'PostmanRuntime/7.54.0','::1','2026-08-19 12:01:35.654'),(378,2,'e2564fecb4644cbb34c54c1464efe5c8ecfab2cd4797f27ab963595aca86595f','REFRESH','2026-08-26 12:48:54.725',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 12:48:54.753'),(379,2,'aa7d6d78c396ecdc01a1697d39c32caa4b47e37c6749c91d4f55fe6ec8d8c675','REFRESH','2026-08-26 18:13:55.514',0,0,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36','::1','2026-08-19 18:13:55.564'),(380,2,'5cafe36f3174a0b0cebcddee4f305144b47524ba30544cf7ace620a446988dbd','REFRESH','2026-08-26 18:46:49.355',0,0,'PostmanRuntime/7.56.1','::1','2026-08-19 18:46:49.377'),(381,2,'2b314fd2ebd8bc9b9cc6b0a86f45aae2f7e3b05f5aefa91345e4f6da82dd7759','REFRESH','2026-08-26 18:55:11.702',0,0,'PostmanRuntime/7.56.1','::1','2026-08-19 18:55:11.727'),(382,2,'7d9a737bbe11f8baf043dc7168ac1175539ef12bcd2847b42f27cea95cb373ca','REFRESH','2026-08-26 20:15:29.289',0,0,'PostmanRuntime/7.56.1','::1','2026-08-19 20:15:29.319'),(383,2,'3f0297a84f682a72d10f3e5c1b11b00adcb10bf0430152d298cc000029c489a6','REFRESH','2026-08-27 05:35:07.686',0,0,'PostmanRuntime/7.56.1','::1','2026-08-20 05:35:07.729');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `amount` double NOT NULL,
  `gateway` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('SUCCESS','FAILED','PENDING') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportroute`
--

DROP TABLE IF EXISTS `transportroute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transportroute` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schoolId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickupPoint` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TransportRoute_schoolId_name_key` (`schoolId`,`name`),
  CONSTRAINT `TransportRoute_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportroute`
--

LOCK TABLES `transportroute` WRITE;
/*!40000 ALTER TABLE `transportroute` DISABLE KEYS */;
INSERT INTO `transportroute` VALUES (1,1,'North Route','Main Chowk',1600,1,'2026-05-16 10:55:52.496','2026-05-16 12:01:12.410'),(2,1,'','',0,1,'2026-05-16 12:01:28.461','2026-05-16 12:07:33.017');
/*!40000 ALTER TABLE `transportroute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `emailVerified` tinyint(1) NOT NULL DEFAULT '0',
  `schoolId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_schoolId_fkey` (`schoolId`),
  CONSTRAINT `User_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Md Faizy','gmfaizy2002@gmail.com','$2b$10$b827WO0yxjgzwoDPI2E2GetYrmM8vgLRyBMt5CHEVrruANOXJgD5y',1,1,1,'2026-02-08 16:03:00.683','2026-02-28 03:11:09.476',0),(2,'Md Nishat','mdgmfaizy@gmail.com','$2b$10$GVPEKtbvocjUjyVczs7s4OXsou20tb9px/AMOh6XM/w6jB6FmELee',1,1,1,'2026-02-09 09:56:40.317','2026-02-28 09:32:18.518',0),(3,'Mr Sharma','sharma@test.com','hashedpass',1,1,1,'2026-02-17 12:42:54.000','2026-04-11 18:19:43.030',0),(4,'Md Ali','ali@gmail.com','$2b$10$R4qGT5x7m8hRG68Hsh6GcOFG8n7coJbU6KHq2pNLJqLqp9yoqCPxO',1,0,1,'2026-02-24 11:06:16.047','2026-04-11 18:12:00.984',0),(5,'Md Ali Alam','ali123@gmail.com','$2b$10$26IqWWyNY6.o62cKT8YqgeE0qxeaJ/SjtMtpcVA.3ouIEunuNYRwO',1,0,1,'2026-02-24 11:19:33.585','2026-02-28 07:15:50.193',0),(6,'Md Ali','student17@gmail.com','123456',1,0,1,'2026-05-08 02:07:13.552','2026-05-08 02:07:13.552',0),(7,'Md Rahman','rahman@gmail.com','123456',1,0,1,'2026-05-08 02:18:20.446','2026-05-08 02:18:20.446',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpermission`
--

DROP TABLE IF EXISTS `userpermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpermission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `permissionId` int NOT NULL,
  `granted` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserPermission_userId_permissionId_key` (`userId`,`permissionId`),
  KEY `UserPermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpermission`
--

LOCK TABLES `userpermission` WRITE;
/*!40000 ALTER TABLE `userpermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `userpermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userrole` (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `UserRole_roleId_fkey` (`roleId`),
  CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES (1,2),(2,3),(3,3),(4,3),(4,4),(5,4),(6,4),(2,5),(7,5);
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-20 12:14:21
