-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: alemdbv2
-- ------------------------------------------------------
-- Server version	5.7.10-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Datoteke`
--

DROP TABLE IF EXISTS `Datoteke`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Datoteke` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Naziv` varchar(255) DEFAULT NULL,
  `Host` varchar(255) DEFAULT NULL,
  `Datum` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datoteke`
--

LOCK TABLES `Datoteke` WRITE;
/*!40000 ALTER TABLE `Datoteke` DISABLE KEYS */;
/*!40000 ALTER TABLE `Datoteke` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Senzor`
--

DROP TABLE IF EXISTS `Senzor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Senzor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Kod_senzora` varchar(255) DEFAULT NULL,
  `StanicaId` int(11) DEFAULT NULL,
  `TipSenzoraId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `StanicaId` (`StanicaId`),
  KEY `TipSenzoraId` (`TipSenzoraId`),
  CONSTRAINT `senzor_ibfk_1` FOREIGN KEY (`StanicaId`) REFERENCES `Stanica` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `senzor_ibfk_2` FOREIGN KEY (`TipSenzoraId`) REFERENCES `Tip_senzora` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Senzor`
--

LOCK TABLES `Senzor` WRITE;
/*!40000 ALTER TABLE `Senzor` DISABLE KEYS */;
INSERT INTO `Senzor` VALUES (1,'000001',1,1),(2,'000002',1,2),(3,'000003',1,3),(4,'000004',2,1),(5,'000005',2,2),(6,'000006',2,3),(7,'000007',3,1),(8,'000008',3,2),(9,'000009',3,3),(10,'000010',4,1),(11,'000011',4,2),(12,'000012',4,3),(13,'000013',5,1),(14,'000014',5,2),(15,'000015',5,3),(17,'0001',1,5),(19,'0011',1,4),(21,'0001',2,5),(23,'0004',2,4),(24,'0010',11,3),(25,'0011',11,4),(26,'0001',12,3),(27,'0012',12,6),(28,'0013',12,7),(29,'0011',12,4),(30,'0010',14,3),(31,'0012',14,6),(32,'0011',14,4),(33,'0001',13,3),(34,'0002',13,7),(35,'0003',13,1),(36,'0004',13,5),(37,'0005',13,4),(38,'0010',15,3),(39,'0012',15,6),(40,'0013',15,7),(41,'0011',15,4),(42,'0010',16,3),(43,'0012',16,6),(44,'0011',16,4),(45,'0010',17,3),(46,'0012',17,6),(47,'0011',17,4),(48,'0010',18,3),(49,'0001',18,7),(50,'0011',18,4),(51,'0010',19,3),(52,'0012',19,6),(53,'0001',19,7),(54,'0002',19,8),(55,'0003',19,10),(56,'0004',19,9),(57,'0005',19,11),(58,'0006',19,12),(59,'0011',19,4),(60,'0010',20,3),(61,'0012',20,6),(62,'0011',20,4),(63,'0010',21,3),(64,'0012',21,6),(65,'0011',21,4),(66,'0010',22,3),(67,'0012',22,6),(68,'0001',22,7),(69,'0002',22,8),(70,'0003',22,10),(71,'0004',22,9),(72,'0005',22,11),(73,'0006',22,12),(74,'0011',22,4),(75,'0007',22,13),(76,'0010',23,3),(77,'0009',23,4),(78,'0001',24,3),(79,'0002',24,7),(80,'0003',24,4),(81,'0003',25,3),(82,'0004',25,6),(83,'0001',25,1),(84,'0002',25,5),(85,'0005',25,4),(86,'0001',26,3),(87,'0002',26,4),(88,'0010',27,3),(89,'0012',27,6),(90,'0002',27,1),(91,'0001',27,5),(92,'0003',27,2),(93,'0004',27,4),(94,'0002',28,1),(95,'0001',28,5),(96,'0003',28,2),(97,'0004',28,4),(98,'0001',29,1),(99,'0002',29,5),(100,'0003',29,2),(101,'0004',29,4),(102,'0002',30,1),(103,'0001',30,5),(104,'0003',30,2),(105,'0004',30,4),(106,'0002',31,1),(107,'0001',31,5),(108,'0003',31,2),(109,'0004',31,4),(110,'0002',32,1),(111,'0001',32,5),(112,'0003',32,2),(113,'0004',32,4),(126,'0002',33,1),(127,'0001',33,5),(128,'0003',33,2),(129,'0004',33,4),(130,'0002',34,1),(131,'0001',34,5),(132,'0003',34,2),(133,'0004',34,4),(134,'0002',35,1),(135,'0001',35,5),(136,'0003',35,2),(137,'0004',35,4),(138,'0001',36,1),(139,'0002',36,2),(140,'0003',36,3),(141,'0011',36,4);
/*!40000 ALTER TABLE `Senzor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stanica`
--

DROP TABLE IF EXISTS `Stanica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Stanica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Naziv` varchar(255) DEFAULT NULL,
  `Kod_stanice` varchar(255) DEFAULT NULL,
  `Geo_sirina` double DEFAULT NULL,
  `Geo_duzina` double DEFAULT NULL,
  `TipStaniceId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `TipStaniceId` (`TipStaniceId`),
  CONSTRAINT `stanica_ibfk_1` FOREIGN KEY (`TipStaniceId`) REFERENCES `Tip_stanice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stanica`
--

LOCK TABLES `Stanica` WRITE;
/*!40000 ALTER TABLE `Stanica` DISABLE KEYS */;
INSERT INTO `Stanica` VALUES (1,'Bihac','0000000528',44.807738888,15.866588888,3),(2,'Cazin','0001400070',44.9651416,15.933636111,3),(3,'Divljina','000003',44.9651416,17.933636111,1),(4,'Jug','000004',42.9651416,17.993636111,2),(5,'Sjever','000005',44.8308333,17.87103333,3),(11,'Bosanska Krupa','0000000020',44.8891944444,16.1589861111,1),(12,'Bosanska Otoka','0000000008',44.9592361111,16.1815555,1),(13,'Bihac','0000140513',44.8308333,15.87103333,1),(14,'Drvar','0014000701',44.380972222,16.3832138888,1),(15,'Hrustovo','0014000777',44.681275,16.733491666,1),(16,'Klokot','0000000012',44.823275,15.805669444,1),(17,'Kljuc','0000000011',44.525080555,16.796419444,1),(18,'Kostela','0000000010',44.8809805555,15.894575,1),(19,'Kralje','0000000016',44.83452777,15.8461777,1),(20,'Kulen Vakuf','0014000702',44.562186111,16.08904444,1),(21,'Martin Brod','0000000007',44.495663888,16.134752777,1),(22,'Sanski Most','0000000014',44.766425,16.6666583333,1),(23,'Tržac','0022062004',44.994938888,15.7877861111,1),(24,'Velika Kladuša','0020040623',45.180141666666664,15.82456111111111,1),(25,'Vodoprivreda','0000261213',44.85252222,18.393236111,1),(26,'Zavidovići','0000281215',44.440077777,18.143736111,1),(27,'Rmanj - Manastir','1000000100',44.49360555,16.14229166,3),(28,'Bosanska Krupa','0000000040',44.8891944444,16.1589861111,3),(29,'Bila','0000240615',44.259772222,17.743816666,3),(30,'Bosanski Petrovac','0001400500',44.5546944444,16.366744444,3),(31,'Drvar','0001400100',44.37786944444,16.376916666,3),(32,'Ključ','0001400100',44.52558055555,16.79490000002,3),(33,'Lušci Palanka','0027019750',44.764433333,16.4304722222,3),(34,'Sanski Most','0000000030',44.77095,16.676177777,3),(35,'Velika Kladuša','0023062004',45.179916666666664,15.810041666666667,3),(36,'FTP Stanica','0000000002',44.77095,16.9,2);
/*!40000 ALTER TABLE `Stanica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tip_senzora`
--

DROP TABLE IF EXISTS `Tip_senzora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tip_senzora` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Tip_Senzora` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tip_senzora`
--

LOCK TABLES `Tip_senzora` WRITE;
/*!40000 ALTER TABLE `Tip_senzora` DISABLE KEYS */;
INSERT INTO `Tip_senzora` VALUES (1,'Temperatura zraka'),(2,'Padavine'),(3,'Vodostaj'),(4,'Napon'),(5,'Vlažnost zraka'),(6,'Protok'),(7,'Temperatura vode'),(8,'Ph'),(9,'TDS'),(10,'Specifična provodljivost'),(11,'Zasićeni kiseonik'),(12,'Rastvoreni kiseonik'),(13,'ORP');
/*!40000 ALTER TABLE `Tip_senzora` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tip_stanice`
--

DROP TABLE IF EXISTS `Tip_stanice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tip_stanice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Tip_stanice` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tip_stanice`
--

LOCK TABLES `Tip_stanice` WRITE;
/*!40000 ALTER TABLE `Tip_stanice` DISABLE KEYS */;
INSERT INTO `Tip_stanice` VALUES (1,'Hidrološka Stanica'),(2,'Padavinska Stanica'),(3,'Meteorološka Stanica');
/*!40000 ALTER TABLE `Tip_stanice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ime_prezime` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `firma` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Admin Adminovic','admin','admin','admin@admin.ba','admin doo'),(2,'Velid Aljic','velid','velid','velid.aljic@gmail.com','velid doo');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_senzor`
--

DROP TABLE IF EXISTS `User_senzor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_senzor` (
  `Max` double DEFAULT NULL,
  `Min` double DEFAULT NULL,
  `UserId` int(11) NOT NULL,
  `SenzorId` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`SenzorId`),
  KEY `SenzorId` (`SenzorId`),
  CONSTRAINT `user_senzor_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_senzor_ibfk_2` FOREIGN KEY (`SenzorId`) REFERENCES `Senzor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_senzor`
--

LOCK TABLES `User_senzor` WRITE;
/*!40000 ALTER TABLE `User_senzor` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_senzor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_stanica`
--

DROP TABLE IF EXISTS `User_stanica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User_stanica` (
  `Dnevni` tinyint(1) NOT NULL DEFAULT '0',
  `Sedmicni` tinyint(1) NOT NULL DEFAULT '0',
  `Mjesecni` tinyint(1) NOT NULL DEFAULT '0',
  `UserId` int(11) NOT NULL,
  `StanicaId` int(11) NOT NULL,
  PRIMARY KEY (`UserId`,`StanicaId`),
  KEY `StanicaId` (`StanicaId`),
  CONSTRAINT `user_stanica_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_stanica_ibfk_2` FOREIGN KEY (`StanicaId`) REFERENCES `Stanica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_stanica`
--

LOCK TABLES `User_stanica` WRITE;
/*!40000 ALTER TABLE `User_stanica` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_stanica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vrijednost`
--

DROP TABLE IF EXISTS `Vrijednost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vrijednost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Datum` datetime DEFAULT NULL,
  `Vrijednost` double DEFAULT NULL,
  `SenzorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SenzorId` (`SenzorId`),
  CONSTRAINT `vrijednost_ibfk_1` FOREIGN KEY (`SenzorId`) REFERENCES `Senzor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=425 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vrijednost`
--

LOCK TABLES `Vrijednost` WRITE;
/*!40000 ALTER TABLE `Vrijednost` DISABLE KEYS */;
INSERT INTO `Vrijednost` VALUES (1,'2016-01-01 00:00:01',10,1),(2,'2016-01-01 00:00:01',12,2),(3,'2016-01-01 00:00:01',15,3),(4,'2016-01-01 00:00:01',17,4),(5,'2016-01-01 00:00:01',7,5),(6,'2016-01-01 00:00:01',5,6),(7,'2016-01-01 00:00:01',4,7),(8,'2016-01-01 00:00:01',20,8),(9,'2016-01-01 00:00:01',3.25,9),(10,'2016-01-01 00:00:01',6.5,10),(11,'2016-01-01 00:00:01',14.32,11),(12,'2016-01-01 00:00:01',8.85,12),(13,'2016-01-01 00:00:01',14.42,13),(14,'2016-01-01 00:00:01',2.65,14),(15,'2016-01-01 00:00:01',7.77,15),(16,'2016-01-01 00:15:02',10,15),(17,'2016-01-01 00:30:03',15,15),(18,'2016-01-01 00:15:02',5,14),(19,'2016-01-01 00:30:03',8,14),(20,'2016-01-01 00:15:02',15,13),(21,'2016-01-01 00:30:03',12,13),(22,'2016-01-01 00:45:04',11,13),(23,'2016-01-01 00:45:04',16,14),(24,'2016-01-01 00:45:04',20,15),(25,'2016-01-01 01:00:04',4,13),(26,'2016-01-01 01:00:04',7,14),(27,'2016-01-01 01:00:04',9,15),(28,'2016-01-01 01:15:04',11,13),(29,'2016-01-01 01:15:04',20,14),(30,'2016-01-01 01:15:04',5,15),(31,'2016-01-01 01:30:04',14,13),(32,'2016-01-01 01:30:04',5,14),(33,'2016-01-01 01:30:04',7,15),(34,'2016-01-01 01:45:04',8,13),(35,'2016-01-01 01:45:04',9,14),(36,'2016-01-01 01:45:04',10,15),(37,'2016-01-01 00:15:01',5,1),(38,'2016-01-01 00:15:01',8,2),(39,'2016-01-01 00:15:01',11,3),(40,'2016-01-01 00:30:01',13,1),(41,'2016-01-01 00:30:01',11,2),(42,'2016-01-01 00:30:01',8,3),(51,'2016-01-01 02:00:01',17,13),(52,'2016-01-01 02:00:01',10,14),(53,'2016-01-01 02:00:01',21,15),(55,'2016-01-01 02:15:01',18,13),(56,'2016-01-01 02:15:01',9,14),(57,'2016-01-01 02:15:01',19,15),(59,'2016-01-01 00:45:01',9,1),(60,'2016-01-01 00:45:01',12,2),(61,'2016-01-01 00:45:01',5,3),(62,'2016-01-01 01:00:01',14,1),(63,'2016-01-01 01:00:01',9,2),(64,'2016-01-01 01:00:01',2,3),(65,'2016-01-01 02:30:01',5,13),(66,'2016-01-01 02:30:01',7,14),(67,'2016-01-01 02:30:01',1,15),(69,'2016-01-01 02:45:01',5,13),(70,'2016-01-01 02:45:01',14,14),(71,'2016-01-01 02:45:01',9,15),(73,'2016-01-01 03:00:01',13,13),(74,'2016-01-01 03:00:01',19,14),(75,'2016-01-01 03:00:01',4,15),(77,'2016-01-01 03:15:01',11,13),(78,'2016-01-01 03:15:01',15,14),(79,'2016-01-01 03:15:01',7,15),(81,'2016-01-01 03:30:01',5,13),(82,'2016-01-01 03:30:01',3,14),(83,'2016-01-01 03:30:01',12,15),(85,'2016-01-01 03:45:01',12,13),(86,'2016-01-01 03:45:01',20,14),(87,'2016-01-01 03:45:01',7,15),(89,'2016-01-01 04:00:01',16,13),(90,'2016-01-01 04:00:01',11,14),(91,'2016-01-01 04:00:01',13,15),(93,'2016-01-01 04:15:01',15,13),(94,'2016-01-01 04:15:01',11,14),(95,'2016-01-01 04:15:01',14,15),(97,'2016-01-01 04:30:01',15,13),(98,'2016-01-01 04:30:01',10,14),(99,'2016-01-01 04:30:01',13,15),(101,'2016-01-01 04:45:01',7,13),(102,'2016-01-01 04:45:01',11,14),(103,'2016-01-01 04:45:01',14,15);
/*!40000 ALTER TABLE `Vrijednost` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-09 23:55:27
