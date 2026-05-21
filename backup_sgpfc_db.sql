-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: sgpfc_db
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

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
-- Table structure for table `actividades_academica`
--

DROP TABLE IF EXISTS `actividades_academica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividades_academica` (
  `pk_actividades_academica` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_actividades_academica`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividades_academica`
--

LOCK TABLES `actividades_academica` WRITE;
/*!40000 ALTER TABLE `actividades_academica` DISABLE KEYS */;
INSERT INTO `actividades_academica` VALUES (1,'Trabalho de pesquisa','Descrição do trabalho de pesquisa'),(2,'Investigação científica','Descrição da investigação científica'),(3,'Extensão universitária','Descrição da extensão universitária');
/*!40000 ALTER TABLE `actividades_academica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ano_lectivo`
--

DROP TABLE IF EXISTS `ano_lectivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ano_lectivo` (
  `pk_ano_lectivo` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  PRIMARY KEY (`pk_ano_lectivo`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ano_lectivo`
--

LOCK TABLES `ano_lectivo` WRITE;
/*!40000 ALTER TABLE `ano_lectivo` DISABLE KEYS */;
INSERT INTO `ano_lectivo` VALUES (19,'2021-2022','2020-09-01','2021-07-31'),(20,'2024-2025','2024-09-01','2025-07-31');
/*!40000 ALTER TABLE `ano_lectivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area_conhecimento`
--

DROP TABLE IF EXISTS `area_conhecimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area_conhecimento` (
  `pk_area_conhecimento` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `fk_actividades_academica` int NOT NULL,
  PRIMARY KEY (`pk_area_conhecimento`),
  KEY `fk_actividades_academica` (`fk_actividades_academica`),
  CONSTRAINT `area_conhecimento_ibfk_1` FOREIGN KEY (`fk_actividades_academica`) REFERENCES `actividades_academica` (`pk_actividades_academica`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_conhecimento`
--

LOCK TABLES `area_conhecimento` WRITE;
/*!40000 ALTER TABLE `area_conhecimento` DISABLE KEYS */;
INSERT INTO `area_conhecimento` VALUES (1,'Desenvolvimento de Software','Descrição do Desenvolvimento de Software',1),(2,'Inteligência Artificial e Aprendizado de Máquina','Descrição do Inteligência Artificial e Aprendizado de Máquina',2),(3,'Ciência de Dados e Big Data','Descrição da Ciência de Dados e Big Data',2);
/*!40000 ALTER TABLE `area_conhecimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conta`
--

DROP TABLE IF EXISTS `conta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conta` (
  `pk_conta` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `fk_utilizador` int NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_actualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_exclusao` datetime DEFAULT NULL,
  PRIMARY KEY (`pk_conta`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_utilizador` (`fk_utilizador`),
  CONSTRAINT `conta_ibfk_1` FOREIGN KEY (`fk_utilizador`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conta`
--

LOCK TABLES `conta` WRITE;
/*!40000 ALTER TABLE `conta` DISABLE KEYS */;
INSERT INTO `conta` VALUES (1,'souto@gmail.com','$2a$10$P0Nx8Up0E5nrc4VkGAcvyedpP4R/cA4mlwjOVL1ygfU9yYGo0HzDK',1,'2024-07-22 00:00:00','2024-09-02 00:00:00',NULL),(2,'danielinocencia@gmail.com','$2a$10$FoQMPtoVzoe162Mor8OiTOsnwf2xWfl/OKeRlJEYHGtYShzms5dFK',2,'2024-07-22 00:00:00','2024-07-22 15:58:05',NULL),(3,'yasmin@ucan.edu','$2a$10$JiOvEnSiZbvytJPDZmCtQebKZixZ9C..EOBFLgOjV25lOLdUKrCuy',3,'2024-07-30 00:00:00','2025-01-26 00:00:00',NULL),(4,'rubem@gmail.com','$2a$10$nYnI9ZH6ZK8oNK.R6xEITufnZiRp/dO6LXJfDR8SeJh.VuYASKnYO',4,'2024-07-30 00:00:00','2024-08-26 00:00:00',NULL),(5,'nazilca@gmail.com','$2a$10$9NTooT/gtzV8iZVWKM3IpeQODQplXYuuRJpLSYXNAB5tKR5h4tAzC',5,'2024-07-30 00:00:00','2024-08-26 00:00:00',NULL),(6,'ricardo@gmail.com','$2a$10$Aqpc0Ze.mz4HsGo66E3LB.Bg6kO/K2uI0NeKCOqKohTEtDXkYwCRu',6,'2024-07-30 00:00:00','2024-07-30 15:59:59',NULL),(7,'ivandro@gmail.com','$2a$10$E2o1vbHJaXqVD7NGoe15cuVE3cC1G5H2kAz9DnJBI5fC1HqePzCu.',7,'2024-09-02 00:00:00','2024-09-02 00:00:00',NULL),(8,'paula@imknetwork.com','$2a$10$vkqs6ftGFa1Tr04nLz89Ee73bSfSY90EFspCW7yKoITVxguvwRJ5G',8,'2024-09-02 00:00:00','2025-01-26 00:00:00',NULL),(9,'carla@ucan.edu','$2a$10$9t54KGHz3J4vn0MRzAb0UeggTjuw0chL7rGQCzYPsJpd4eWzligjC',9,'2024-09-03 00:00:00','2025-02-06 00:00:00',NULL),(10,'maria@gmail.com','$2a$10$GoW7MM60NegbLjgRVnU1hemwSgu3YpdRZFEGQgDvRD6Qv/wttIF3q',10,'2024-09-03 00:00:00','2024-09-03 00:00:00',NULL),(11,'goncalves@gmail.com','$2a$10$ocHnykkCwd/q0rzC5aCJm.cSXV0BJS3ZeZ5tfkyb2Z8YD53Xge2JO',11,'2024-09-03 00:00:00','2024-09-03 00:00:00',NULL),(12,'luis@gmail.com','$2a$10$CzAEcIzVauYWpNUGZaiusuHgwK37gTHgAhc5SJ78CXv63Jzf3wCUK',12,'2024-09-04 00:00:00','2024-09-04 00:00:00',NULL),(13,'emilia@ucan.edu','$2a$10$v3atYfiAsps7Z9jNT7Ddje9bNlEmK8ynw54ivngopIRBJyclffDS6',13,'2024-09-04 00:00:00','2024-09-04 00:00:00',NULL),(14,'sara@ucan.edu','$2a$10$zA3n0ikVVUXWib8K56mJa.KQQsfX8X8zL7eDe0EL7b7IHTtTHrlZK',14,'2024-09-04 00:00:00','2024-09-04 00:00:00',NULL),(15,'alex@gmail.com','$2a$10$ju.cB41MHPpDhAhWjavsPOFjnaYUxVmnLB5epdUPHepToCVikZKx2',15,'2024-09-06 00:00:00','2024-09-06 00:00:00',NULL),(16,'marina@gmail.com','$2a$10$bW0EL9vJAmSRO4GnvVB3Z.SeKq63frQ0S.eSepDkVF.5mO137olSm',16,'2024-10-17 00:00:00','2024-10-17 00:00:00',NULL),(17,'beatriz@gmail.com','$2a$10$FMomPZS1HjwUtzNAS5GGV.eLWMd77/rL93Q9MVhTkKUitHYATsoAe',17,'2024-10-17 00:00:00','2024-12-29 00:00:00',NULL),(18,'carlos@gmail.com','$2a$10$GT3wbRit70zKcBx58bbYT.ArsX7OrOomHnusHKpU0cRsaN9G2fRM.',18,'2024-10-17 00:00:00','2024-10-17 00:00:00',NULL),(19,'josue@gmail.co','$2a$10$dRDAQpre4q5EHBqd6LsdXO9jeaEjV24FbtuEvYPn9ngnpY8WlmJhy',19,'2024-10-18 00:00:00','2024-10-18 00:00:00',NULL),(20,'sebastiao@ucan.edu','$2a$10$wZ7JGt7GFhyukS5xUnHK2.rAiN/4l8.3NRBZwX3sZcue3gaInXZB2',20,'2024-10-18 00:00:00','2024-10-23 00:00:00',NULL),(21,'pedro@ucan.edu','$2a$10$65Tsk0RFLSgjTU0/QuP1YuV12odbt8pk3WeavndPPgX08FMyjkJW2',21,'2024-10-18 00:00:00','2024-10-18 00:00:00',NULL),(22,'rosario@ucan.edu','$2a$10$ORATibg2eQmg3lNCbRgs5.EmuNl1CFvJ1VaHf97c.nqNIe3dK8eFC',22,'2024-10-23 00:00:00','2024-10-23 00:00:00',NULL),(23,'fernando@ucan.edu','$2a$10$e8eymnthtvW6A9UJfeerg.XQGxDrh5MtuEHAEgs4ooUquRduiLfAO',23,'2024-10-23 00:00:00','2024-10-23 00:00:00',NULL),(24,'edson@gmail.com','$2a$10$tHI1MMGfXCl/XLKyDDl4MefNnRUy6Lq0iefoqybBNz4rHxrCXtLfm',24,'2024-10-28 00:00:00','2024-10-28 00:00:00',NULL),(25,'basilio@gmail.com','$2a$10$xyaop.WfJLuBd1UrCUlLo.Q2q7JFigMK9wS/kqzJ4ekQzN6JJKYUK',25,'2024-10-30 00:00:00','2024-10-30 00:00:00',NULL),(26,'damian@ucan.edu','$2a$10$Ftetd5bpkazJqYlfsnxQsOzYcImwreRxNPggTNa.r/YCP0WKsXtom',26,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(27,'ivete@ucan.edu','$2a$10$5yQ01MMIcUdyXOeUVfKbVe/jRjvA.fdWvlTYV61V2cw2br077lWMe',27,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(28,'ester@ucan.edu','$2a$10$p.JrilHmHU4xGtwg1gvAWunExF2Md/Jr3PEZJ2vFijd0jDce3nQc2',28,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(29,'john@ucan.edu','$2a$10$8TmeFc70oNWwOdEjX/aX6u29WCxn5KFYJOHAJEmI01S3klMasRGoe',29,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(30,'viviane@ucan.edu','$2a$10$kZT8Quo6UnERxQqTI1JdiOrM6h8Xj3orgRFvS9pU0IieJinuIX4PK',30,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(31,'leonard@ucan.edu','$2a$10$wN2nwpDT474QuMyatVfdBerRZo5npkvXLVjIs9.t5FibKRawvZCeC',31,'2024-11-05 00:00:00','2024-11-05 00:00:00',NULL),(34,'luis11@gmail.com','$2a$10$LYW8mdyCozuRTMLFESm8WOFuweDZoj9FI8Ub45yEvSLDtOij3j/a2',32,'2024-11-06 00:00:00','2024-11-06 00:00:00',NULL),(35,'eduardo@ucan.edu','$2a$10$WWL4U/qkCKJYpWQQpoyA/OkLrsaTuOgOjG.U6aCG.93fIrGlecMk2',33,'2024-11-09 00:00:00','2024-11-09 00:00:00',NULL),(36,'tom@gmail.com','$2a$10$5Dq4.g44X5nscYsFfHIRYeNlyeWnYO2GOupNz.IwuBXjROoaqD0ri',34,'2024-11-09 00:00:00','2024-11-09 00:00:00',NULL),(37,'izzy@ucan.edu','$2a$10$B5XB7gG9.xIGqAu/yiYwtel/3hGTp/ZkBcGHTFkbHpV7/xo1ZBEDO',35,'2024-11-09 00:00:00','2024-11-09 00:00:00',NULL),(38,'dias@gmail.com','$2a$10$FIJtyKV.V0z2hg87Ud/MlejsJ.nVKvb7Gu6oW3CZiHFsCXA9M93fq',36,'2024-11-09 00:00:00','2024-11-09 00:00:00',NULL),(39,'candita@gmail.com','$2a$10$hSUh.qyYaTEI9XPL5dhAfOVWUnTY4BhmFRN4fFYOTXBDT2/Mv2QkK',37,'2024-11-10 00:00:00','2024-11-10 00:00:00',NULL),(40,'celma@gmail.com','$2a$10$eDoYktOzPWnrTuGb2Q4Il.rzdEf5TZHRPzxFAsBXA/IuHU.klvtz6',38,'2024-11-10 00:00:00','2024-11-10 00:00:00',NULL),(41,'jose@ucan.edu','$2a$10$E4cdEDEGy/uLtfTHyI2Za.5QvGPT1rfINf5Ro/m7NUZ4WGHZvPlXq',39,'2024-12-27 00:00:00','2024-12-27 00:00:00',NULL),(42,'ramos@ucan.edu','$2a$10$tUogaOEPTveCRMRCYbWLnOiWVwBcQuVBR.IuRIKjRK.fIQKZ0uekS',40,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(43,'domingos@gmail.com','$2a$10$oUOm4lIqhF9ri67uBOrA2OZ0ZBrWCjewCk.6LMEShjArEYcboAAGu',41,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(44,'mendes@ucan.edu','$2a$10$d.gJDrtHFu9JfQj1/w/DB.44xjMFof5oPmIdN7H6tqwlq8qhvWQPK',42,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(45,'mica@ucan.edu','$2a$10$ilt6eU9AMngl0XdRTKICn.uifxBHgatMj0b8WjFmUjtbspdWH5yqu',43,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(46,'nando_baptista@gmail.com','$2a$10$Hc1c7GmByVZVHavarOe5suGuRpIOdRn2Q0vwWJYvxqH5nvFwcVujO',44,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(47,'hsantos@hotmail.com','$2a$10$Qp12C4ypr/h9emcWErfm2OR3.K./1.Y6GFMFwdLH1KEDKSRXw2lX6',45,'2024-12-29 00:00:00','2024-12-29 00:00:00',NULL),(48,'airesveloso@gmail.com','$2a$10$/36ii9pLM2YZjjxZCeDh1e.N0N/HZQWAvCqap7mOQTkQ3BvuvImGO',46,'2024-12-30 00:00:00','2024-12-30 00:00:00',NULL),(49,'elineto@ucan.edu','$2a$10$yfpykr5uAbGtK3haglTlGuT9KuQsqZ5CEvtyzVBXp3hDU3QMcKvAi',47,'2024-12-30 00:00:00','2024-12-30 00:00:00',NULL),(50,'joao@ucan.edu','$2a$10$WcGGZRXEbynt3043R3UjpOlEz0n5IwP4Z4JuDXTXG5cYcb4Ir9dgu',48,'2025-01-18 00:00:00','2025-01-18 00:00:00',NULL),(51,'benedito_rosario@ucan.edu','$2a$10$XMokcvip8Nz7bUvGd2DE/ehnT7mn48vAvzrxiyWRf9NhNnUkl558e',49,'2025-01-18 00:00:00','2025-01-18 00:00:00',NULL),(52,'dimbu@ucan.edu','$2a$10$xu.0eoRLTQBJUDQlyT7qJebU2AnDvGU73JFZPT07aWYUjxcL0yLq.',50,'2025-01-21 00:00:00','2025-01-21 00:00:00',NULL),(53,'fabio@ucan.edu','$2a$10$.KrK43NsC4l3hRz0b5b.wuh/i0/H8wsNsGve2J3aZesSTJt/fO8HK',51,'2025-01-24 00:00:00','2025-01-24 00:00:00',NULL),(54,'vitoria@ucan.edu','$2a$10$Sc1ZuRLGC5RZQsQ2v7IHPOw3jWOcD0Lxs8TwAAbZGU6o.CcPbXo1K',52,'2025-01-24 00:00:00','2025-01-24 00:00:00',NULL);
/*!40000 ALTER TABLE `conta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convenio_cientifico`
--

DROP TABLE IF EXISTS `convenio_cientifico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convenio_cientifico` (
  `pk_convenio_cientifico` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `fk_actividades_academica` int NOT NULL,
  PRIMARY KEY (`pk_convenio_cientifico`),
  KEY `fk_actividades_academica` (`fk_actividades_academica`),
  CONSTRAINT `convenio_cientifico_ibfk_1` FOREIGN KEY (`fk_actividades_academica`) REFERENCES `actividades_academica` (`pk_actividades_academica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convenio_cientifico`
--

LOCK TABLES `convenio_cientifico` WRITE;
/*!40000 ALTER TABLE `convenio_cientifico` DISABLE KEYS */;
/*!40000 ALTER TABLE `convenio_cientifico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cronograma`
--

DROP TABLE IF EXISTS `cronograma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cronograma` (
  `pk_cronograma` int NOT NULL AUTO_INCREMENT,
  `fk_projecto` int NOT NULL,
  `descricao` text NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  PRIMARY KEY (`pk_cronograma`),
  KEY `fk_projecto` (`fk_projecto`),
  CONSTRAINT `cronograma_ibfk_1` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cronograma`
--

LOCK TABLES `cronograma` WRITE;
/*!40000 ALTER TABLE `cronograma` DISABLE KEYS */;
/*!40000 ALTER TABLE `cronograma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `pk_curso` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nivel_curso` enum('Graduação','Pós-graduação','Extensão','Técnico') NOT NULL,
  PRIMARY KEY (`pk_curso`),
  UNIQUE KEY `designacao` (`designacao`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Engenharia Informática','Licenciatura em Engenharia Informática','FEUCAN','Graduação'),(3,'Engenharia de Telecomunicações','Licenciatura em Engenharia de Telecomunicações','FETUCAN','Graduação'),(12,'Engenharia de Petróleo','Engenharia de Petróleo','FEUCANP','Graduação');
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disciplina`
--

DROP TABLE IF EXISTS `disciplina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disciplina` (
  `pk_disciplina` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `fk_curso` int NOT NULL,
  PRIMARY KEY (`pk_disciplina`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_curso` (`fk_curso`),
  CONSTRAINT `disciplina_ibfk_1` FOREIGN KEY (`fk_curso`) REFERENCES `curso` (`pk_curso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disciplina`
--

LOCK TABLES `disciplina` WRITE;
/*!40000 ALTER TABLE `disciplina` DISABLE KEYS */;
INSERT INTO `disciplina` VALUES (1,'Projecto I','Projecto Final I','PFI',1),(2,'Projecto II','Projecto Final II','PFII',1),(3,'Projecto II Extendido','Projecto Final II - Extendido','PFII-EX',1);
/*!40000 ALTER TABLE `disciplina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento_justificativa`
--

DROP TABLE IF EXISTS `documento_justificativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento_justificativa` (
  `pk_documento_justificativa` int NOT NULL AUTO_INCREMENT,
  `fk_justificativa_falta` int NOT NULL,
  `arquivo_url` varchar(255) NOT NULL,
  `data_upload` date NOT NULL,
  PRIMARY KEY (`pk_documento_justificativa`),
  KEY `fk_justificativa_falta` (`fk_justificativa_falta`),
  CONSTRAINT `documento_justificativa_ibfk_1` FOREIGN KEY (`fk_justificativa_falta`) REFERENCES `justificativa_falta` (`pk_justificativa_falta`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento_justificativa`
--

LOCK TABLES `documento_justificativa` WRITE;
/*!40000 ALTER TABLE `documento_justificativa` DISABLE KEYS */;
/*!40000 ALTER TABLE `documento_justificativa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ficheiros_tarefas_estudante`
--

DROP TABLE IF EXISTS `ficheiros_tarefas_estudante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ficheiros_tarefas_estudante` (
  `pk_ficheiro` int NOT NULL AUTO_INCREMENT,
  `arquivo_url` varchar(255) NOT NULL,
  `data_upload` date NOT NULL,
  `fk_tarefas_estudante` int DEFAULT NULL,
  PRIMARY KEY (`pk_ficheiro`),
  KEY `fk_tarefas_estudante` (`fk_tarefas_estudante`),
  CONSTRAINT `fk_tarefas_estudante` FOREIGN KEY (`fk_tarefas_estudante`) REFERENCES `tarefas_entregas_estudante` (`pk_tarefas_entregas_estudante`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ficheiros_tarefas_estudante`
--

LOCK TABLES `ficheiros_tarefas_estudante` WRITE;
/*!40000 ALTER TABLE `ficheiros_tarefas_estudante` DISABLE KEYS */;
INSERT INTO `ficheiros_tarefas_estudante` VALUES (118,'14_1739619716580_0Z66mdHo.docx','2025-02-15',166),(119,'14_1739623556011_Login.js','2025-02-15',162),(120,'14_1739625187013_0Z66mdHo.docx','2025-02-15',167),(121,'14_1739625187041_Captura de ecrã de 2025-02-10 08-08-20.png','2025-02-15',167),(122,'14_1739633736515_0Z66mdHo.docx','2025-02-15',161),(123,'14_1739692210247_Captura de ecrã de 2025-01-01 21-32-26.png','2025-02-16',169),(124,'14_1739692227386_localhost_3000_login.png','2025-02-16',170),(125,'14_1739692284285_Captura de ecrã de 2025-01-01 21-32-26.png','2025-02-16',171);
/*!40000 ALTER TABLE `ficheiros_tarefas_estudante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `irregularidade_projecto`
--

DROP TABLE IF EXISTS `irregularidade_projecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `irregularidade_projecto` (
  `pk_irregularidade_projecto` int NOT NULL AUTO_INCREMENT,
  `fk_projecto` int DEFAULT NULL,
  `irregularidade_verificada` text NOT NULL,
  `data_irregularidade_verificada` date NOT NULL,
  `estado` enum('comunicado','lido') NOT NULL,
  PRIMARY KEY (`pk_irregularidade_projecto`),
  KEY `fk_projecto` (`fk_projecto`),
  CONSTRAINT `irregularidade_projecto_ibfk_1` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `irregularidade_projecto`
--

LOCK TABLES `irregularidade_projecto` WRITE;
/*!40000 ALTER TABLE `irregularidade_projecto` DISABLE KEYS */;
INSERT INTO `irregularidade_projecto` VALUES (2,14,'A ferramenta de verificação de plágio não conseguiu identificar uma correspondência relevante entre o conteúdo de um trabalho e fontes externas, sugerindo que a detecção de plágio não está funcionando corretamente.','2025-02-08','comunicado');
/*!40000 ALTER TABLE `irregularidade_projecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificativa_falta`
--

DROP TABLE IF EXISTS `justificativa_falta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificativa_falta` (
  `pk_justificativa_falta` int NOT NULL AUTO_INCREMENT,
  `fk_presenca` int NOT NULL,
  `data` date NOT NULL,
  `descricao` text,
  PRIMARY KEY (`pk_justificativa_falta`),
  KEY `fk_presenca` (`fk_presenca`),
  CONSTRAINT `justificativa_falta_ibfk_1` FOREIGN KEY (`fk_presenca`) REFERENCES `presenca` (`pk_presenca`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificativa_falta`
--

LOCK TABLES `justificativa_falta` WRITE;
/*!40000 ALTER TABLE `justificativa_falta` DISABLE KEYS */;
/*!40000 ALTER TABLE `justificativa_falta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `justificativa_projecto`
--

DROP TABLE IF EXISTS `justificativa_projecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `justificativa_projecto` (
  `pk_justificativa_projecto` int NOT NULL AUTO_INCREMENT,
  `fk_projecto` int NOT NULL,
  `fk_desistido_reprovado_por` int DEFAULT NULL,
  `data` date NOT NULL,
  `justificativa` text,
  `relatorio` varchar(255) DEFAULT NULL,
  `fk_validado_por` int DEFAULT NULL,
  `data_validade` date DEFAULT NULL,
  `observacoes` text,
  `motivo` enum('Plagio','Irregularidades Verificadas','Faltas','Outro') DEFAULT NULL,
  PRIMARY KEY (`pk_justificativa_projecto`),
  KEY `fk_projecto` (`fk_projecto`),
  KEY `fk_validado_por` (`fk_validado_por`),
  KEY `fk_desistido_reprovado_por` (`fk_desistido_reprovado_por`),
  CONSTRAINT `fk_desistido_reprovado_por` FOREIGN KEY (`fk_desistido_reprovado_por`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `fk_projecto` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`),
  CONSTRAINT `fk_validado_por` FOREIGN KEY (`fk_validado_por`) REFERENCES `utilizador` (`pk_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `justificativa_projecto`
--

LOCK TABLES `justificativa_projecto` WRITE;
/*!40000 ALTER TABLE `justificativa_projecto` DISABLE KEYS */;
INSERT INTO `justificativa_projecto` VALUES (1,15,7,'2025-01-01','Após análise criteriosa, o projeto apresentado não atendeu aos requisitos mínimos estipulados para sua aprovação. ','15_1735734914478_justificativa reprovacao.docx',NULL,NULL,NULL,'Outro'),(2,17,18,'2025-01-27','Irregularidades Verificadas no projecto, projecto não concluido tarefas não entregues dentro do prazo estipulado.','17_1737991893914_justificativa reprovacao.docx',11,'2025-02-09',NULL,'Irregularidades Verificadas');
/*!40000 ALTER TABLE `justificativa_projecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linha_pesquisa`
--

DROP TABLE IF EXISTS `linha_pesquisa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linha_pesquisa` (
  `pk_linha_pesquisa` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_linha_pesquisa`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linha_pesquisa`
--

LOCK TABLES `linha_pesquisa` WRITE;
/*!40000 ALTER TABLE `linha_pesquisa` DISABLE KEYS */;
INSERT INTO `linha_pesquisa` VALUES (1,'Inteligência Artificial','Pesquisa em técnicas de IA e aprendizado de máquina.'),(2,'Segurança da Informação','Estudos sobre proteção de dados e segurança em redes.'),(3,'Desenvolvimento de Sistemas','Desenvolvimento de Sistemas e sistemas de gestão');
/*!40000 ALTER TABLE `linha_pesquisa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_realizacao`
--

DROP TABLE IF EXISTS `local_realizacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_realizacao` (
  `pk_local_realizacao` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `convenio_cientifico` enum('Ensino e Investigação','Pesquisa conjunta','Intercâmbio de estudantes e professores','Compartilhamento de infraestrutura e recursos','Publicações conjuntas','Desenvolvimento de novas tecnologias','Financiamento conjunto','Propriedade intelectual') DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pk_local_realizacao`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_realizacao`
--

LOCK TABLES `local_realizacao` WRITE;
/*!40000 ALTER TABLE `local_realizacao` DISABLE KEYS */;
INSERT INTO `local_realizacao` VALUES (1,'DEI','Departamentos de Ensino e Investigação','Ensino e Investigação',NULL),(2,'Hospital Divina Providencia','instituições externas a Faculdade','Desenvolvimento de novas tecnologias',NULL),(3,'CID','Centro de investigação','Intercâmbio de estudantes e professores',NULL),(4,'CEA','Centro de investigação','Publicações conjuntas',NULL),(5,'CDHC','Centro de investigação','Compartilhamento de infraestrutura e recursos',NULL);
/*!40000 ALTER TABLE `local_realizacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orientador_proposto`
--

DROP TABLE IF EXISTS `orientador_proposto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orientador_proposto` (
  `pk_orientador_proposto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fk_sexo` int NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grau_academico_orientador` enum('Professor Auxiliar','Mestre','Licenciado','Assistente') DEFAULT NULL,
  `fk_universidade_orientador` int NOT NULL,
  `fk_cadastrado_por` int DEFAULT NULL,
  `estado` enum('proposto','aprovado','rejeitado') DEFAULT NULL,
  PRIMARY KEY (`pk_orientador_proposto`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_sexo_orientador_proposto` (`fk_sexo`),
  KEY `fk_universidade_orientador_proposto` (`fk_universidade_orientador`),
  KEY `fk_cadastrado_por_orientador` (`fk_cadastrado_por`),
  CONSTRAINT `fk_cadastrado_por_orientador` FOREIGN KEY (`fk_cadastrado_por`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `fk_sexo_orientador_proposto` FOREIGN KEY (`fk_sexo`) REFERENCES `sexo` (`pk_sexo`),
  CONSTRAINT `fk_universidade_orientador_proposto` FOREIGN KEY (`fk_universidade_orientador`) REFERENCES `universidade` (`pk_universidade`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orientador_proposto`
--

LOCK TABLES `orientador_proposto` WRITE;
/*!40000 ALTER TABLE `orientador_proposto` DISABLE KEYS */;
INSERT INTO `orientador_proposto` VALUES (5,'Patricia Pires','patricia@gmail.com',2,'933470907','2024-11-10 00:00:00','Professor Auxiliar',3,14,'rejeitado'),(8,'Fernando Batista','fernando@gmail.com',1,'945678906','2024-11-12 00:00:00','Licenciado',3,7,'proposto'),(9,'Fabiana Dembo','fabiana@gmail.com',2,'945678906','2024-11-12 00:00:00','Licenciado',2,7,'rejeitado'),(10,'João de Deus','joao@gmail.com',1,'945678908','2024-11-13 00:00:00','Licenciado',4,7,'proposto'),(11,'Eduardo Paim','eduardo@gmil.com',1,'945678908','2024-11-13 00:00:00','Mestre',2,8,'rejeitado'),(12,'Rui Jorge','ruijorge@gmail.com',1,'927456770','2024-12-31 00:00:00','Licenciado',5,4,'proposto');
/*!40000 ALTER TABLE `orientador_proposto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissoes`
--

DROP TABLE IF EXISTS `permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissoes` (
  `pk_permissoes` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`pk_permissoes`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissoes`
--

LOCK TABLES `permissoes` WRITE;
/*!40000 ALTER TABLE `permissoes` DISABLE KEYS */;
INSERT INTO `permissoes` VALUES (1,'dasboard'),(2,'listar_users'),(3,'listar_turmas'),(4,'listar_temas'),(5,'listar_projectos'),(6,'listar_tarefas'),(7,'listar_presencas'),(8,'listar_orientadores');
/*!40000 ALTER TABLE `permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pre_requisito`
--

DROP TABLE IF EXISTS `pre_requisito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pre_requisito` (
  `pk_pre_requisito` int NOT NULL AUTO_INCREMENT,
  `descricao` text NOT NULL,
  PRIMARY KEY (`pk_pre_requisito`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pre_requisito`
--

LOCK TABLES `pre_requisito` WRITE;
/*!40000 ALTER TABLE `pre_requisito` DISABLE KEYS */;
INSERT INTO `pre_requisito` VALUES (1,'Conhecimento básico em programação.'),(2,'Experiência com projetos de software.');
/*!40000 ALTER TABLE `pre_requisito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presenca`
--

DROP TABLE IF EXISTS `presenca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presenca` (
  `pk_presenca` int NOT NULL AUTO_INCREMENT,
  `fk_estudante` int NOT NULL,
  `data` date NOT NULL,
  `estado` enum('Presente','Ausente','Justificada') NOT NULL,
  `fk_turma` int DEFAULT NULL,
  PRIMARY KEY (`pk_presenca`),
  KEY `fk_estudante` (`fk_estudante`),
  KEY `fk_presenca_turma` (`fk_turma`),
  CONSTRAINT `fk_presenca_turma` FOREIGN KEY (`fk_turma`) REFERENCES `turma` (`pk_turma`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `presenca_ibfk_1` FOREIGN KEY (`fk_estudante`) REFERENCES `utilizador` (`pk_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presenca`
--

LOCK TABLES `presenca` WRITE;
/*!40000 ALTER TABLE `presenca` DISABLE KEYS */;
INSERT INTO `presenca` VALUES (40,3,'2025-01-08','Ausente',22),(41,13,'2025-01-08','Presente',22),(42,3,'2024-12-01','Ausente',22),(43,13,'2024-12-01','Presente',22),(44,3,'2025-01-07','Presente',22),(45,13,'2025-01-07','Ausente',22),(46,3,'2025-01-05','Ausente',22),(47,13,'2025-01-05','Presente',22);
/*!40000 ALTER TABLE `presenca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projecto`
--

DROP TABLE IF EXISTS `projecto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projecto` (
  `pk_projecto` int NOT NULL AUTO_INCREMENT,
  `fk_tema` int NOT NULL,
  `fk_estudante` int NOT NULL,
  `fk_orientador` int NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `data_defesa` date DEFAULT NULL,
  `estado` enum('Reprovado','Desistido','Concluido','Em andamento') NOT NULL,
  `declaracao_aptidao_url` varchar(255) DEFAULT NULL,
  `projecto_zip_url` varchar(255) DEFAULT NULL,
  `relatorio_final_url` varchar(255) DEFAULT NULL,
  `data_actualizao_ficheiros_pf` date DEFAULT NULL,
  `fk_turma` int NOT NULL,
  `progresso` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `nota_avaliacao_continua` float DEFAULT '0',
  `privacidade` enum('Público','Privado') DEFAULT 'Público',
  PRIMARY KEY (`pk_projecto`),
  KEY `fk_tema` (`fk_tema`),
  KEY `fk_estudante` (`fk_estudante`),
  KEY `fk_orientador` (`fk_orientador`),
  KEY `fk_turma` (`fk_turma`),
  CONSTRAINT `fk_turma` FOREIGN KEY (`fk_turma`) REFERENCES `turma` (`pk_turma`),
  CONSTRAINT `projecto_ibfk_1` FOREIGN KEY (`fk_tema`) REFERENCES `tema` (`pk_tema`),
  CONSTRAINT `projecto_ibfk_2` FOREIGN KEY (`fk_estudante`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `projecto_ibfk_3` FOREIGN KEY (`fk_orientador`) REFERENCES `utilizador` (`pk_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projecto`
--

LOCK TABLES `projecto` WRITE;
/*!40000 ALTER TABLE `projecto` DISABLE KEYS */;
INSERT INTO `projecto` VALUES (14,23,3,1,'2024-12-31',NULL,NULL,'Em andamento',NULL,'14_relatorio_final_1737927059568_tarefas.zip','14_relatorio_final_1737927059568_8_relatorio_final_1735280357154_FR-Impressão-FRM 5CL2024_2.pdf','2025-01-26',22,2,'2024-12-31 19:52:16',1,'Público'),(15,24,8,7,'2025-01-01',NULL,NULL,'Reprovado',NULL,NULL,NULL,NULL,23,0,'2025-01-01 11:59:06',0,'Público'),(17,31,8,1,'2025-01-25',NULL,NULL,'Reprovado',NULL,NULL,NULL,NULL,22,0,'2025-01-25 11:39:49',0,'Público'),(18,32,5,17,'2025-02-17',NULL,NULL,'Concluido',NULL,'18_relatorio_final_1739818095855_Ebook  Informática Aplicada à Contabilidade.zip','18_relatorio_final_1739818095832_Ebook  Informática Aplicada à Contabilidade.pdf','2025-02-17',20,1,'2025-02-17 19:44:06',1,'Público'),(19,29,4,1,'2025-02-17',NULL,NULL,'Em andamento',NULL,NULL,NULL,NULL,20,0,'2025-02-17 20:14:29',0,NULL),(20,30,52,41,'2025-02-27',NULL,NULL,'Em andamento',NULL,NULL,NULL,NULL,23,0,'2025-02-27 21:11:08',0,NULL),(21,34,10,46,'2025-03-05','2025-03-11','2025-03-10','Concluido',NULL,NULL,NULL,NULL,23,100,'2025-03-11 19:46:26',14,'Público'),(22,35,8,46,'2025-03-02','2025-03-09','2025-03-10','Concluido',NULL,NULL,NULL,NULL,20,100,'2025-03-11 21:45:03',12,'Público');
/*!40000 ALTER TABLE `projecto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regulamento`
--

DROP TABLE IF EXISTS `regulamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regulamento` (
  `pk_regulamento` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `ficheiro` varchar(255) NOT NULL,
  `data_actualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ultrapassado','em vigor') NOT NULL DEFAULT 'em vigor',
  `fk_curso` int NOT NULL,
  PRIMARY KEY (`pk_regulamento`),
  KEY `fk_curso` (`fk_curso`),
  CONSTRAINT `regulamento_ibfk_1` FOREIGN KEY (`fk_curso`) REFERENCES `curso` (`pk_curso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regulamento`
--

LOCK TABLES `regulamento` WRITE;
/*!40000 ALTER TABLE `regulamento` DISABLE KEYS */;
INSERT INTO `regulamento` VALUES (1,'Regulamento de Avaliação','Este regulamento estabelece as normas para avaliação dos alunos.','regulamento.pdf','2024-10-17 14:50:16','em vigor',1);
/*!40000 ALTER TABLE `regulamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado_plagio`
--

DROP TABLE IF EXISTS `resultado_plagio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado_plagio` (
  `pk_resultado_plagio` int NOT NULL AUTO_INCREMENT,
  `fk_projecto` int NOT NULL,
  `estado` enum('sucesso','falhou') DEFAULT NULL,
  `percentagem_similaridade` decimal(5,2) DEFAULT NULL,
  `resultado` text,
  `tipo_similaridade` enum('Idênticos','Diferentes','Similaridade') DEFAULT NULL,
  `tipo_plagio` enum('ficheiro','texto') DEFAULT NULL,
  `detalhes` text,
  `ficheiro_comparado` text,
  `texto_comparado_1` text,
  `texto_comparado_2` text,
  PRIMARY KEY (`pk_resultado_plagio`),
  KEY `fk_projecto` (`fk_projecto`),
  CONSTRAINT `resultado_plagio_ibfk_1` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado_plagio`
--

LOCK TABLES `resultado_plagio` WRITE;
/*!40000 ALTER TABLE `resultado_plagio` DISABLE KEYS */;
/*!40000 ALTER TABLE `resultado_plagio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semestre`
--

DROP TABLE IF EXISTS `semestre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semestre` (
  `pk_semestre` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_semestre`),
  UNIQUE KEY `designacao` (`designacao`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semestre`
--

LOCK TABLES `semestre` WRITE;
/*!40000 ALTER TABLE `semestre` DISABLE KEYS */;
INSERT INTO `semestre` VALUES (1,'1º Semestre','Primeiro Semestre'),(2,'2º Semestre','Segundo Semestre'),(5,'Extendido','Semestre Extendido');
/*!40000 ALTER TABLE `semestre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sexo`
--

DROP TABLE IF EXISTS `sexo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sexo` (
  `pk_sexo` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_sexo`),
  UNIQUE KEY `designacao` (`designacao`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sexo`
--

LOCK TABLES `sexo` WRITE;
/*!40000 ALTER TABLE `sexo` DISABLE KEYS */;
INSERT INTO `sexo` VALUES (1,'Masculino','Sexo Masculino'),(2,'Feminino','Sexo feminino');
/*!40000 ALTER TABLE `sexo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarefa`
--

DROP TABLE IF EXISTS `tarefa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarefa` (
  `pk_tarefa` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `prazo` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` int DEFAULT NULL,
  `upload_obrigatorio` tinyint(1) DEFAULT '0',
  `peso` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_tarefa` enum('Avaliação dos seminário','Apresentação do relatório de progresso','Participação') NOT NULL DEFAULT 'Avaliação dos seminário',
  `created_by` int NOT NULL,
  `observacoes` text NOT NULL,
  `comecar_contar_quando` enum('Após a criação da tarefa','Depois do fim da tarefa anterior') DEFAULT NULL,
  `data_entrega` date DEFAULT NULL,
  `pontuacao` float DEFAULT NULL,
  PRIMARY KEY (`pk_tarefa`),
  KEY `fk_criado_por` (`created_by`),
  CONSTRAINT `tarefa_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `utilizador` (`pk_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefa`
--

LOCK TABLES `tarefa` WRITE;
/*!40000 ALTER TABLE `tarefa` DISABLE KEYS */;
INSERT INTO `tarefa` VALUES (55,'Implementar os diagramas de classes, de sequência, actividade e casos de uso do projecto','Os diagramas de classes, de sequência, de atividade e de casos de uso são importantes para o desenvolvimento de software, pois ajudam a compreender a lógica e a estrutura de um sistema.',15,NULL,NULL,1,5,'2025-01-18 00:00:00','Apresentação do relatório de progresso',1,'Preparar uma apresentação em PPT','Depois do fim da tarefa anterior',NULL,NULL),(56,'Fazer o Benchmarking do projecto, identificar vantagens e desvantagens do projecto','Benchmarking é uma análise estratégica das melhores práticas usadas por empresas do mesmo setor que o seu projecto.',7,NULL,NULL,1,5,'2025-01-18 00:00:00','Apresentação do relatório de progresso',1,'O principal objetivo do benchmarking é comparar seus processos e desempenho com os líderes do mercado para identificar oportunidades de  crescimento.','Depois do fim da tarefa anterior',NULL,NULL),(57,'Levantar requisitos funcionais e não funcionais','Levantar requisitos funcionais e não funcionais  do projecto',7,NULL,NULL,1,10,'2025-01-19 00:00:00','Apresentação do relatório de progresso',1,'','Depois do fim da tarefa anterior',NULL,NULL),(58,'Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento','Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento',5,NULL,NULL,1,10,'2025-01-19 00:00:00','Apresentação do relatório de progresso',1,'','Após a criação da tarefa',NULL,NULL),(80,'Criação de Identidade Visual ','Desenvolver a identidade visual de uma marca fictícia, incluindo logotipo, paleta de cores, tipografia e elementos gráficos adicionais. O projeto deverá demonstrar habilidades em design, criatividade e coerência na aplicação da identidade visual.',10,NULL,NULL,1,10,'2025-02-02 00:00:00','Apresentação do relatório de progresso',1,'Pesquisa e Definição da Marca:\n\n    Crie uma marca fictícia (por exemplo, uma startup de tecnologia, uma cafeteria, uma loja de roupas, etc.).\n    Defina a missão, visão e valores da marca.\n    Elabore um perfil de público-alvo (quem são seus clientes potenciais?).','Após a criação da tarefa',NULL,NULL),(82,'Actualizar o relatorio de progresso do projecto','Actualizar o relatorio de progresso do projecto',5,NULL,NULL,0,5,'2025-02-10 00:00:00','Apresentação do relatório de progresso',1,'Actualizar o relatório na sessão \"Actualizar relatório\"','Após a criação da tarefa',NULL,NULL);
/*!40000 ALTER TABLE `tarefa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarefas_atribuidas`
--

DROP TABLE IF EXISTS `tarefas_atribuidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarefas_atribuidas` (
  `pk_tarefas_atribuidas` int NOT NULL AUTO_INCREMENT,
  `fk_template_original` int DEFAULT NULL,
  `designacao_template_original` varchar(255) DEFAULT NULL,
  `estado_tarefa_atribuida` enum('Activa','Removida') DEFAULT 'Activa',
  `tarefa_atribuida_a` enum('Turma','Estudante') NOT NULL,
  `fk_turma` int DEFAULT NULL,
  `fk_estudante` int DEFAULT NULL,
  `fk_projecto` int DEFAULT NULL,
  `data_entrega_tarefa` datetime DEFAULT NULL,
  `fk_tarefa_original` int DEFAULT NULL,
  `designacao_tarefa` varchar(255) NOT NULL,
  `descricao_tarefa` text,
  `upload_obrigatorio_tarefa` tinyint(1) DEFAULT '1',
  `peso_tarefa` int DEFAULT '0',
  `tipo_tarefa` varchar(255) DEFAULT NULL,
  `observacoes_tarefa` text,
  `created_by` int NOT NULL,
  `data_actualizacao_tarefa_atribuida` datetime(6) DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  PRIMARY KEY (`pk_tarefas_atribuidas`),
  KEY `fk_projecto` (`fk_projecto`),
  KEY `fk_turma` (`fk_turma`),
  KEY `fk_estudante` (`fk_estudante`),
  KEY `fk_tarefa_original` (`fk_tarefa_original`),
  KEY `fk_template_original` (`fk_template_original`),
  KEY `created_by` (`created_by`),
  KEY `FKqdeh834l1tq8vl1aaoakd9a7i` (`updated_by`),
  CONSTRAINT `FKqdeh834l1tq8vl1aaoakd9a7i` FOREIGN KEY (`updated_by`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `tarefas_atribuidas_created_by` FOREIGN KEY (`created_by`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `tarefas_atribuidas_fk_estudante` FOREIGN KEY (`fk_estudante`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tarefas_atribuidas_fk_projecto` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tarefas_atribuidas_fk_tarefa` FOREIGN KEY (`fk_tarefa_original`) REFERENCES `tarefa` (`pk_tarefa`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tarefas_atribuidas_fk_template_original` FOREIGN KEY (`fk_template_original`) REFERENCES `template` (`pk_template`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `tarefas_atribuidas_fk_turma` FOREIGN KEY (`fk_turma`) REFERENCES `turma` (`pk_turma`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas_atribuidas`
--

LOCK TABLES `tarefas_atribuidas` WRITE;
/*!40000 ALTER TABLE `tarefas_atribuidas` DISABLE KEYS */;
INSERT INTO `tarefas_atribuidas` VALUES (13,NULL,'','Activa','Turma',22,NULL,NULL,'2025-02-12 00:00:00',55,'Implementar os diagramas de classes, de sequência, actividade e casos de uso do projecto.','Os diagramas de classes, de sequência, de atividade e de casos de uso são importantes para o desenvolvimento de software, pois ajudam a compreender a lógica e a estrutura de um sistema.',1,5,'Apresentação do relatório de progresso','Preparar uma apresentação em PPT',1,NULL,NULL),(14,NULL,'','Activa','Estudante',NULL,3,14,'2025-01-31 00:00:00',56,'Fazer o Benchmarking do projecto, identificar vantagens e desvantagens do projecto','Benchmarking é uma análise estratégica das melhores práticas usadas por empresas do mesmo setor que o seu projecto.',1,5,'Apresentação do relatório de progresso','O principal objetivo do benchmarking é comparar seus processos e desempenho com os líderes do mercado para identificar oportunidades de  crescimento.',1,NULL,NULL),(15,NULL,'','Activa','Turma',22,NULL,NULL,'2025-01-31 00:00:00',57,'Levantar requisitos funcionais e não funcionais ','Levantar requisitos funcionais e não funcionais  do projecto',1,10,'Apresentação do relatório de progresso','',1,NULL,NULL),(16,NULL,'','Activa','Turma',22,NULL,NULL,'2025-01-29 00:00:00',58,'Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento','Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento',0,10,'Apresentação do relatório de progresso','',1,NULL,NULL),(17,NULL,'','Activa','Turma',22,NULL,NULL,'2025-01-31 00:00:00',56,'Fazer o Benchmarking do projecto, identificar vantagens e desvantagens do projecto','Benchmarking é uma análise estratégica das melhores práticas usadas por empresas do mesmo setor que o seu projecto.',1,5,'Apresentação do relatório de progresso','O principal objetivo do benchmarking é comparar seus processos e desempenho com os líderes do mercado para identificar oportunidades de  crescimento.',1,NULL,1),(19,NULL,'','Activa','Estudante',NULL,3,14,'2025-01-31 00:00:00',57,'Levantar requisitos funcionais e não funcionais ','Levantar requisitos funcionais e não funcionais  do projecto',1,10,'Apresentação do relatório de progresso','',1,NULL,NULL),(20,NULL,'','Activa','Estudante',NULL,3,14,'2025-01-29 00:00:00',58,'Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento','Elaborar a arquitetura do sistema (backend, frontend, banco de dados, APIs) e configurar o ambiente de desenvolvimento',0,10,'Apresentação do relatório de progresso','',1,NULL,NULL),(21,NULL,'','Activa','Estudante',NULL,3,14,'2025-01-31 00:00:00',56,'Fazer o Benchmarking do projecto, identificar vantagens e desvantagens do projecto','Benchmarking é uma análise estratégica das melhores práticas usadas por empresas do mesmo setor que o seu projecto.',1,5,'Apresentação do relatório de progresso','O principal objetivo do benchmarking é comparar seus processos e desempenho com os líderes do mercado para identificar oportunidades de  crescimento.',1,NULL,NULL),(22,NULL,'','Activa','Estudante',NULL,4,14,'2025-02-12 00:00:00',55,'Implementar os diagramas de classes, de sequência, actividade e casos de uso do projecto.','Os diagramas de classes, de sequência, de atividade e de casos de uso são importantes para o desenvolvimento de software, pois ajudam a compreender a lógica e a estrutura de um sistema.',1,5,'Apresentação do relatório de progresso','Preparar uma apresentação em PPT',1,NULL,NULL),(23,NULL,'','Activa','Turma',23,NULL,NULL,'2025-02-14 00:00:00',55,'Implementar os diagramas de classes, de sequência, actividade e casos de uso do projecto','Os diagramas de classes, de sequência, de atividade e de casos de uso são importantes para o desenvolvimento de software, pois ajudam a compreender a lógica e a estrutura de um sistema.',1,5,'Apresentação do relatório de progresso','Preparar uma apresentação em PPT',1,NULL,NULL),(24,NULL,'','Activa','Estudante',NULL,8,17,'2025-02-14 00:00:00',55,'Implementar os diagramas de classes, de sequência, actividade e casos de uso do projecto','Os diagramas de classes, de sequência, de atividade e de casos de uso são importantes para o desenvolvimento de software, pois ajudam a compreender a lógica e a estrutura de um sistema.',1,5,'Apresentação do relatório de progresso','Preparar uma apresentação em PPT',1,NULL,NULL),(34,NULL,'','Activa','Estudante',NULL,3,14,'2025-02-17 00:00:00',82,'Actualizar o relatorio de progresso do projecto','Actualizar o relatorio de progresso do projecto',0,5,'Apresentação do relatório de progresso','Actualizar o relatório na sessão \"Actualizar relatório\"',1,NULL,NULL),(36,NULL,'','Activa','Estudante',NULL,5,18,'2025-02-24 00:00:00',82,'Actualizar o relatorio de progresso do projecto','Actualizar o relatorio de progresso do projecto',0,5,'Apresentação do relatório de progresso','Actualizar o relatório na sessão \"Actualizar relatório\"',17,NULL,NULL),(37,NULL,'','Activa','Estudante',NULL,3,14,'2025-03-06 00:00:00',82,'Actualizar o relatorio de progresso do projecto','Actualizar o relatorio de progresso do projecto',0,5,'Apresentação do relatório de progresso','Actualizar o relatório na sessão \"Actualizar relatório\"',1,NULL,NULL);
/*!40000 ALTER TABLE `tarefas_atribuidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarefas_entregas_estudante`
--

DROP TABLE IF EXISTS `tarefas_entregas_estudante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarefas_entregas_estudante` (
  `pk_tarefas_entregas_estudante` int NOT NULL AUTO_INCREMENT,
  `fk_tarefa_atribuida` int NOT NULL,
  `fk_projecto` int NOT NULL,
  `estado_tarefa_entrega_estudante` enum('Novo','Em Revisão','Alterações Solicitadas','Concluída') NOT NULL DEFAULT 'Novo',
  `data_entrega_tarefa_estudante` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_actualizacao_tarefa_entrega_estudante` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `observacoes_do_orientador` text,
  `pontuacao` double DEFAULT NULL,
  `data_avaliacao_feita` datetime DEFAULT NULL,
  `updated_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pk_tarefas_entregas_estudante`),
  KEY `fk_projecto_constraint_idx` (`fk_projecto`),
  KEY `fk_tarefas_atribuidas_constraint_idx1` (`fk_tarefa_atribuida`),
  CONSTRAINT `fk_projecto_constraint` FOREIGN KEY (`fk_projecto`) REFERENCES `projecto` (`pk_projecto`),
  CONSTRAINT `fk_tarefas_atribuids_constraint` FOREIGN KEY (`fk_tarefa_atribuida`) REFERENCES `tarefas_atribuidas` (`pk_tarefas_atribuidas`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas_entregas_estudante`
--

LOCK TABLES `tarefas_entregas_estudante` WRITE;
/*!40000 ALTER TABLE `tarefas_entregas_estudante` DISABLE KEYS */;
INSERT INTO `tarefas_entregas_estudante` VALUES (161,14,14,'Concluída','2025-02-15 16:35:37','2025-02-15 17:04:14','Perfeito',80,'2025-02-15 00:00:00',NULL),(162,19,14,'Concluída','2025-02-15 13:45:56','2025-02-15 17:04:14','okay - concluido',100,'2025-02-16 00:00:00',NULL),(166,20,14,'Em Revisão','2025-02-15 12:41:57','2025-02-15 12:41:57',NULL,NULL,NULL,NULL),(167,17,14,'Em Revisão','2025-02-15 14:13:07','2025-02-15 14:13:07',NULL,NULL,NULL,NULL),(168,34,14,'Em Revisão','2025-02-15 17:02:43',NULL,NULL,NULL,'2025-02-15 17:02:43',NULL),(169,21,14,'Em Revisão','2025-02-16 08:50:10','2025-02-16 08:50:10',NULL,NULL,NULL,NULL),(170,13,14,'Em Revisão','2025-02-16 08:50:27','2025-02-16 08:50:27',NULL,NULL,NULL,NULL),(171,15,14,'Em Revisão','2025-02-16 08:51:24','2025-02-16 08:51:24',NULL,NULL,NULL,NULL),(172,36,18,'Concluída','2025-02-17 19:52:57','2025-02-17 19:52:57','Okay',100,'2025-02-17 00:00:00',NULL);
/*!40000 ALTER TABLE `tarefas_entregas_estudante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tema`
--

DROP TABLE IF EXISTS `tema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tema` (
  `pk_tema` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `justificativa` text NOT NULL,
  `diferencial` text NOT NULL,
  `observacoes` text,
  `fk_orientador_proposto_email` varchar(255) NOT NULL,
  `fk_tema_proposto_por` int NOT NULL,
  `fk_linha_pesquisa` int NOT NULL,
  `homologado` tinyint(1) DEFAULT '0',
  `data_homologacao` date DEFAULT NULL,
  `data_tema_proposto` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('aguardando aprovacao','aprovado pelo orientador','aprovado pelo coordenador','aprovado pelo DEI','aprovado','reprovado') NOT NULL DEFAULT 'aguardando aprovacao',
  `fk_area_conhecimento` int DEFAULT NULL,
  `fk_local_realizacao` int DEFAULT NULL,
  `fk_estudante_proposto` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_tema`),
  KEY `fk_tema_proposto_por` (`fk_tema_proposto_por`),
  KEY `fk_linha_pesquisa` (`fk_linha_pesquisa`),
  KEY `tema_fk_area_conhecimento` (`fk_area_conhecimento`),
  KEY `tema_fk_local_realizacao` (`fk_local_realizacao`),
  KEY `fk_estudante_proposto` (`fk_estudante_proposto`),
  CONSTRAINT `fk_estudante_proposto` FOREIGN KEY (`fk_estudante_proposto`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `tema_fk_area_conhecimento` FOREIGN KEY (`fk_area_conhecimento`) REFERENCES `area_conhecimento` (`pk_area_conhecimento`),
  CONSTRAINT `tema_fk_local_realizacao` FOREIGN KEY (`fk_local_realizacao`) REFERENCES `local_realizacao` (`pk_local_realizacao`),
  CONSTRAINT `tema_ibfk_3` FOREIGN KEY (`fk_tema_proposto_por`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `tema_ibfk_4` FOREIGN KEY (`fk_linha_pesquisa`) REFERENCES `linha_pesquisa` (`pk_linha_pesquisa`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tema`
--

LOCK TABLES `tema` WRITE;
/*!40000 ALTER TABLE `tema` DISABLE KEYS */;
INSERT INTO `tema` VALUES (23,'SISTEMA DE GESTÃO DE TRABALHOS DE FIM DE CURSO','O desenvolvimento do SGPFC, vem para suprir a necessidade de um sistema que\narmazena todos os projectos de fim de curso elaborados na faculdade de engenharia. O SGPFC\nvisa melhorar significativamente a qualidade dos projetos desenvolvidos pelos estudantes,\ntransformando-se em uma ferramenta para o acompanhamento de cada fase de desenvolvimento\ndesde a fase inicial até a entrega final dos projectos.\nDurante a elaboração do SGPFC, é fundamental considerar a necessidade de uma\ninterface intuitiva que permita aos utilizadores acessar informações relevantes de forma clara e\norganizada. A implementação do SPFC na UCAN contribui para a excelência educacional dessa\ninstituição de ensino.','O desenvolvimento do SPFC, deve-se ao facto da UCAN não possuir um sistema que\ngerencia os projectos de fim de curso; e para melhorar a qualidade, a gestão e o processo de\nelaboração dos projectos.','A característica inovadora do SGPFC é a integração de um sistema de detecção de plágio.\nEssa funcionalidade permite que os orientadores dos projetos da Faculdade de Engenharia da\nUCAN verifiquem a originalidade e autenticidade dos trabalhos elaborados pelos estudantes.\nAlém disso, integrar essa funcionalidade ao SGPFC, demonstra que a Faculdade de Engenharia\nestá comprometida com a qualidade e a transparência dos PFC, garantindo a conformidade com\nnormas de qualidade de software, como a Norma ISO 9126 já mencionada.','','souto@gmail.com',7,3,NULL,NULL,'2024-12-30 00:00:00','aprovado',1,1,3,'2024-12-30 15:39:01'),(24,'Desenvolvimento de Aplicações Web para os assuntos academicos da ucan','Criação e desenvolvimento de aplicações web para os assuntos academinos da ucan.','Alta demanda por soluções web no mercado.','Uso de tecnologias emergentes.','','ivandro@gmail.com',8,3,NULL,NULL,'2024-12-31 00:00:00','aprovado',1,1,8,'2024-12-31 05:34:27'),(25,'Aplicação de Monitoramento de Dispositivos Físicos (Servidores)','A UCAN referiu que devemos considerar um ambiente em que existem vários servidores a operar, de igual modo pretende que os seus engenheiros consigam visualizar estas informações de forma intuitiva e assim elaborar relatórios técnicos sobre os estados dos dispositivos.','Aplicação que monitoriza os seus servidores existentes no Data Center.','A AMDF na apresentação dos seus indicadores traz um diferencial que as aplicações no\nmercado com o mesmo objectivo não possuem, que é, a apresentação da quantidade de energia que\ncada servidor que está a ser monitorado na aplicação está a consumir da instalação elétrica em que\nse encontra, de maneira a ajudar o cliente a economizar nos seus gastos com a energia.\nA AMDF proporciona um controle detalhado dos gastos financeiros associados ao consumo\nenergético dos servidores. Esta característica é bastante importante, pois permite aos clientes não\napenas identificar o desperdício de energia, mas também calcular com precisão os custos\nfinanceiros decorrentes. Dessa forma, a aplicação não só contribui para a sustentabilidade\nambiental, mas também para a otimização dos recursos financeiros, proporcionando uma gestão mais eficiente e econômica.','','josue@gmail.co',4,3,NULL,NULL,'2024-12-31 00:00:00','reprovado',1,1,4,'2024-12-31 06:21:29'),(27,'Desenvolvimento de uma plataforma de ensino adaptativo para alunos com necessidades especiais.','O projeto visa desenvolver uma plataforma de ensino digital personalizada e adaptativa, direcionada a alunos com necessidades especiais. Essa ferramenta utilizará tecnologias de inteligência artificial para oferecer um aprendizado individualizado, ajustando o conteúdo, a dificuldade e o ritmo das atividades de acordo com as características e progressos de cada estudante.','A educação inclusiva é um direito de todos os alunos, e a tecnologia pode ser um grande aliado nesse processo. ','O diferencial da plataforma está na sua capacidade de adaptar-se às necessidades específicas de cada aluno com necessidades especiais. Além disso, a plataforma será desenvolvida em colaboração com especialistas em educação especial, garantindo que as funcionalidades e os conteúdos sejam adequados e eficazes.','Ao desenvolver uma plataforma de ensino adaptativo para alunos com necessidades especiais, é fundamental considerar as suas necessidades específicas, as tecnologias disponíveis e as melhores práticas pedagógicas.','beatriz@gmail.com',17,3,NULL,NULL,'2024-12-31 00:00:00','reprovado',1,1,NULL,'2024-12-31 12:28:01'),(28,'Desenvolvimento de uma plataforma de ensino adaptativo para alunos com necessidades especiais, usando IA e Apredizado de máquina','Desenvolvimento de uma plataforma de ensino adaptativo para alunos com necessidades especiais, usando IA e Apredizado de máquina','Desenvolvimento de uma plataforma de ensino adaptativo para alunos com necessidades especiais, usando IA e Apredizado de máquina','Implementar IA e Aprendizado de máquina.','','souto@gmail.com',7,1,NULL,NULL,'2025-01-07 00:00:00','aprovado',2,1,13,'2025-01-08 00:46:31'),(29,'DESENVOLVIMENTO DE UMA PLATAFORMA DE AGENDAMENTOS ONLINE COM ANÁLISE E PREVISÃO DE DEMANDA','Este trabalho propõe o desenvolvimento de uma plataforma de agendamentos online\ncom análise e previsão de demanda, utilizando técnicas avançadas de Machine Learning. A\nplataforma busca não apenas proporcionar um sistema de agendamento eficiente, mas também\notimizar a alocação de recursos com base em previsões precisas de demanda. A aplicação\ndessa tecnologia se mostra particularmente relevante em Angola, onde a modernização dos\nserviços públicos e privados é crucial para o desenvolvimento social e econômico.','A escolha deste tema se justifica pela sua relevância para a comunidade académica e para a\nsociedade como um todo. Melhorar a eficiência dos serviços de agendamento não só reduz o\ntempo de espera e aumenta a satisfação dos utilizadores, mas também contribui para uma\ngestão mais eficaz dos recursos, promovendo um ambiente de atendimento mais organizado e eficiente.','Este trabalho propõe o desenvolvimento de uma plataforma de agendamentos online\ncom análise e previsão de demanda, utilizando técnicas avançadas de Machine Learning. A\nplataforma busca não apenas proporcionar um sistema de agendamento eficiente, mas também\notimizar a alocação de recursos com base em previsões precisas de demanda. A aplicação\ndessa tecnologia se mostra particularmente relevante em Angola, onde a modernização dos\nserviços públicos e privados é crucial para o desenvolvimento social e econômico.','','souto@gmail.com',4,3,NULL,NULL,'2025-01-17 00:00:00','aprovado',1,1,4,'2025-01-17 02:20:36'),(30,'IMPLEMENTAÇÃO DE UM APLICATIVO PARA AUMENTAR A SEGURANÇA AO ADERIR A UM TRANSPORTE PÚBLICO - TÁXI SEGURO DIÁRIO','A segurança no transporte público é uma preocupação crescente, especialmente\nem cidades com um número de habitantes considerável. Sequestros, assaltos e outras\nameaças afetam a confiança dos passageiros, tornando essencial a busca por soluções\nque garantam a segurança durante as viagens. Além disso, a falta de informação sobre o\ntrânsito e as condições das paragens de táxi pode afetar negativamente a vida do cidadão,\nresultando em viagens ineficientes e longos tempos de espera.','O aplicativo “Táxi Seguro Diário” busca preencher essa lacuna, oferecendo uma\nferramenta que não apenas melhora a segurança dos passageiros, mas também otimiza as\noperações dos taxistas. Este projeto é justificado pela necessidade de um sistema mais\nseguro e eficiente, alinhado às demandas dos usuários e às oportunidades proporcionadas\npelas tecnologias móveis. A possibilidade de compartilhar rotas, monitorar viagens em\ntempo real, reservar lugares no táxi e avaliar o serviço recebido contribui para a criação\nde um ambiente de transporte mais seguro e transparente.','A implementação do “Táxi Seguro Diário” é justificada pela necessidade de\nabordar problemas crônicos do transporte público em Angola, como a insegurança e\na ineficiência operacional. Ao integrar tecnologias de monitoramento e informações\nem tempo real, o aplicativo tem o potencial de transformar a experiência dos usuários,\noferecendo uma solução inovadora e eficaz. A longo prazo, espera-se que essa iniciativa\ncontribua para a melhoria da qualidade de vida urbana, promovendo um ambiente de\ntransporte público mais confiável e eficiente.','','domingos@gmail.com',52,3,NULL,NULL,'2025-02-06 00:00:00','aprovado',1,1,52,'2025-01-24 23:04:07'),(31,'Sistema de gestão de condominio','teste','teste','teste','teste','carlos@gmail.com',8,1,NULL,NULL,'2025-01-24 00:00:00','aprovado',2,2,8,'2025-01-25 00:46:34'),(32,'Informática aplicada à Contabilidade','Atualmente, a informática é fundamental em todos os segmentos da sociedade. Ademais, a contabilidade é um segmento que não vive sem a ajuda dos computadores e, hoje, percebe-se um investimento crescente pelas organizações em softwares e hardwares ligados à área contábil. As grandes empresas e os escritórios de contabilidade adotam fortemente a informática como ferramenta de trabalho e tais investimentos visam à oferta de um serviço mais ágil e de melhor qualidade. A informática permitiu uma mudança sensível na atuação do profissional contábil; antes, se perdia muito tempo com lançamentos, o que podia levar a erros inadmissíveis nos dias atuais.','Atualmente, a informática é fundamental em todos os segmentos da sociedade. Ademais, a contabilidade é um segmento que não vive sem a ajuda dos computadores e, hoje, percebe-se um investimento crescente pelas organizações em softwares e hardwares ligados à área contábil. As grandes empresas e os escritórios de contabilidade adotam fortemente a informática como ferramenta de trabalho e tais investimentos visam à oferta de um serviço mais ágil e de melhor qualidade. A informática permitiu uma mudança sensível na atuação do profissional contábil; antes, se perdia muito tempo com lançamentos, o que podia levar a erros inadmissíveis nos dias atuais.','Atualmente, a informática é fundamental em todos os segmentos da sociedade. Ademais, a contabilidade é um segmento que não vive sem a ajuda dos computadores e, hoje, percebe-se um investimento crescente pelas organizações em softwares e hardwares ligados à área contábil. As grandes empresas e os escritórios de contabilidade adotam fortemente a informática como ferramenta de trabalho e tais investimentos visam à oferta de um serviço mais ágil e de melhor qualidade. A informática permitiu uma mudança sensível na atuação do profissional contábil; antes, se perdia muito tempo com lançamentos, o que podia levar a erros inadmissíveis nos dias atuais.','','beatriz@gmail.com',1,3,NULL,NULL,'2025-02-17 00:00:00','aprovado',1,1,5,'2025-02-17 19:41:54'),(34,'INTELIGÊNCIA TERRITORIAL EM TURISMO: APLICAÇÃO DO SISTEMA DE CAPITAIS PARA ANÁLISE DE OBSERVATÓRIOS DE TURISMO DA EUROPA E DA AMÉRICA LATINA','O estudo analisa Observatórios de Turismo com foco territorial e atuação em escalas subnacionais de países da Europa e da América Latina por meio da abordagem do Sistema de Capitais e do suporte teórico de conceitos provenientes das áreas de Gestão do Turismo, Gestão do Conhecimento, Desenvolvimento Baseado em Conhecimento e Inteligência Territorial. A pesquisa é do tipo exploratório-descritiva, faz uso do método misto por meio de um projeto convergente que integra pesquisa qualitativa e quantitativa e contempla a execução de diferentes técnicas como a análise de conteúdo, entrevistas, aplicação de questionários por e-mail e survey. Entre os resultados apresentados está a contextualização histórica, conceitual e operacional dos Observatórios de Turismo em nível internacional; a proposição de categorias de análise para a sua caracterização e a descrição da situação dos Observatórios de Turismo em países da Europa e da América Latina. Por fim, o estudo propõe um modelo para análise dos Observatórios de Turismo a partir do Sistema de Capitais, o qual poderá subsidiar a constituição de novos observatórios de turismo com ênfase territorial, assim como apoiar à gestão dos observatórios em operação.\n','Para uma melhor compreensão da pesquisa são apresentados a seguir os conceitos e os pressuposto teóricos que a orientaram. Estes iniciam com a contextualização do setor de turismo e as características da gestão de destinos turísticos, avançam para a influência do conhecimento e da colaboração sobre a competitividade e a sustentabilidade dos destinos para em seguida discutir os aspectos relacionados a criação do conhecimento, sua gestão e seu papel no processo de desenvolvimento; o sistema de capitais e o capital de inteligência; a inteligência territorial, a observação territorial, os observatórios e, por fim, os observatórios de turismo, objeto de estudo desta pesquisa.\n','A pesquisa tem seu suporte teórico em conceitos provenientes das áreas de Gestão de Turismo, Inteligência Territorial e Gestão do Conhecimento. Dentre elas, ela se aprofunda, respectivamente, nos temas da Gestão de Destinos Turísticos, da Observação Territorial e do Desenvolvimento Baseado em Conhecimento.','A pesquisa tem seu suporte teórico em conceitos provenientes das áreas de Gestão de Turismo, Inteligência Territorial e Gestão do Conhecimento. Dentre elas, ela se aprofunda, respectivamente, nos temas da Gestão de Destinos Turísticos, da Observação Territorial e do Desenvolvimento Baseado em Conhecimento.','airesveloso@gmail.com',2,1,NULL,NULL,'2025-03-11 00:00:00','aprovado',2,1,NULL,'2025-03-11 19:46:25'),(35,'Plataforma de Gestão Remota de Visitas a Pontos de Interesse em Territórios de Baixa Densidade','O turismo é um sector económico importante, com particular importância para vários países e regiões. Para territórios rurais de baixa densidade, este sector pode ser um importante impulsionador de outros sectores que garantem empregos e pequenas e médias empresas locais. No entanto, nestas regiões, a maior parte dos pontos de interesse encontram-se dispersos, não dispõem de estrutura de apoio para receber os visitantes e, consequentemente, são difíceis de potenciar turisticamente e grande parte das aplicações informáticas existentes para apoio ao turismo não se adequam a estas situações. Este trabalho descreve uma plataforma que usa a tecnologia para alargar e potencializar as oportunidades de explorar atrações turísticas em territórios rurais de baixa densidade. Esta abordagem considera as particularidades desses territórios e as características dos pontos de interesse existentes. Proporciona mecanismos para que os operadores turísticos coloquem os seus pontos de interesse à disposição dos turistas, sem a necessidade de despender muitos recursos e sem a necessidade de apoio constante dos operadores turísticos responsáveis por esses pontos de interesse. Os resultados de uma avaliação preliminar ao nível de testes de aceitação permitiram obter algum feedback relevante para a identificação e implementação de melhorias na aplicação, mas também algumas indicações sobre o interesse e utilidade que a aplicação pode ter.','O sistema projetado e implementado tem como público-alvo turistas que pretendam visitar locais de interesse turístico em zonas de baixa densidade populacional, onde nem sempre os referidos locais são publicitados em outros meios, como redes sociais, rádio, televisão, etc. O sistema inclui uma aplicação web e uma aplicação para dispositivos móveis (Android e iOS). A aplicação web pretende permitir às diversas entidades turísticas publicitarem os seus locais de interesse, caracterizá-los e definirem as condições em que podem ser acedidos. A aplicação móvel tem como objetivo disponibilizar aos turistas informação sobre os pontos de interesse que podem visitar, permitir fazer reservas e permitir o acesso aos locais, de forma autónoma, sem ser necessário recorrer a outra pessoa. Existe ainda um dispositivo IoT que permite controlar o acesso a cada ponto de interesse mediante reservas pré-efetuada.','ambém é objetivo disponibilizar uma aplicação web que permita que as entidades se consigam candidatar para publicitar os seus locais.','ambém é objetivo disponibilizar uma aplicação web que permita que as entidades se consigam candidatar para publicitar os seus locais.','airesveloso@gmail.com',2,3,NULL,NULL,'2025-03-11 00:00:00','aprovado',1,1,8,'2025-03-11 21:45:03');
/*!40000 ALTER TABLE `tema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tema_historico_aprovacao`
--

DROP TABLE IF EXISTS `tema_historico_aprovacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tema_historico_aprovacao` (
  `pk_tema_historico_aprovacao` int NOT NULL AUTO_INCREMENT,
  `fk_tema` int NOT NULL,
  `estado_anterior` enum('aguardando aprovacao','aprovado pelo orientador','reprovado pelo orientador','aprovado pelo coordenador','reprovado pelo coordenador','aprovado pelo DEI','reprovado pelo DEI','aprovado') NOT NULL DEFAULT 'aguardando aprovacao',
  `estado_actual` enum('aprovado pelo orientador','reprovado pelo orientador','aprovado pelo coordenador','reprovado pelo coordenador','aprovado pelo DEI','reprovado pelo DEI','aprovado','reprovado') NOT NULL,
  `data_aprovacao` date NOT NULL,
  `fk_aprovado_por` int NOT NULL,
  PRIMARY KEY (`pk_tema_historico_aprovacao`),
  KEY `fk_tema` (`fk_tema`),
  KEY `fk_aprovado_por` (`fk_aprovado_por`),
  CONSTRAINT `tema_historico_aprovacao_ibfk_1` FOREIGN KEY (`fk_tema`) REFERENCES `tema` (`pk_tema`),
  CONSTRAINT `tema_historico_aprovacao_ibfk_2` FOREIGN KEY (`fk_aprovado_por`) REFERENCES `utilizador` (`pk_utilizador`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tema_historico_aprovacao`
--

LOCK TABLES `tema_historico_aprovacao` WRITE;
/*!40000 ALTER TABLE `tema_historico_aprovacao` DISABLE KEYS */;
INSERT INTO `tema_historico_aprovacao` VALUES (1,25,'aguardando aprovacao','reprovado','2024-12-31',46),(2,23,'aguardando aprovacao','aprovado pelo coordenador','2024-12-31',1),(3,23,'aprovado pelo coordenador','aprovado','2024-12-31',11),(4,24,'aguardando aprovacao','aprovado pelo coordenador','2025-01-01',1),(5,24,'aprovado pelo coordenador','aprovado','2025-01-01',11),(8,27,'aguardando aprovacao','aprovado pelo orientador','2025-01-01',17),(9,27,'aprovado pelo orientador','aprovado pelo coordenador','2025-01-01',46),(10,27,'aprovado pelo coordenador','reprovado','2025-01-01',11),(11,28,'aguardando aprovacao','aprovado pelo coordenador','2025-01-08',1),(12,28,'aprovado pelo coordenador','aprovado','2025-01-08',11),(13,31,'aguardando aprovacao','aprovado pelo coordenador','2025-01-25',1),(14,31,'aprovado pelo coordenador','aprovado','2025-01-25',11),(15,30,'aguardando aprovacao','aprovado pelo coordenador','2025-02-17',1),(16,32,'aguardando aprovacao','aprovado pelo orientador','2025-02-17',17),(17,32,'aprovado pelo orientador','aprovado pelo coordenador','2025-02-17',46),(18,32,'aprovado pelo coordenador','aprovado','2025-02-17',11),(19,29,'aguardando aprovacao','aprovado pelo coordenador','2025-02-17',46),(20,29,'aprovado pelo coordenador','aprovado','2025-02-17',11),(21,30,'aprovado pelo coordenador','aprovado','2025-02-27',11);
/*!40000 ALTER TABLE `tema_historico_aprovacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template` (
  `pk_template` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_template`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (3,'Template de Planejamento de Seminários'),(4,'Template para Relatório de Progresso'),(9,'Template de teste 1');
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template_tarefa`
--

DROP TABLE IF EXISTS `template_tarefa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_tarefa` (
  `pk_template_tarefa` int NOT NULL AUTO_INCREMENT,
  `fk_tarefa` int DEFAULT NULL,
  `fk_template` int DEFAULT NULL,
  `posicao_tarefa_template` int DEFAULT NULL,
  PRIMARY KEY (`pk_template_tarefa`),
  KEY `fk_template_tarefa_tarefa` (`fk_tarefa`),
  KEY `fk_template_tarefa_template` (`fk_template`),
  CONSTRAINT `fk_template_tarefa_tarefa` FOREIGN KEY (`fk_tarefa`) REFERENCES `tarefa` (`pk_tarefa`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `fk_template_tarefa_template` FOREIGN KEY (`fk_template`) REFERENCES `template` (`pk_template`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_tarefa`
--

LOCK TABLES `template_tarefa` WRITE;
/*!40000 ALTER TABLE `template_tarefa` DISABLE KEYS */;
INSERT INTO `template_tarefa` VALUES (1,57,4,1),(2,58,4,4),(3,56,4,3),(4,55,4,2),(34,55,9,1);
/*!40000 ALTER TABLE `template_tarefa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_conta`
--

DROP TABLE IF EXISTS `tipo_conta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_conta` (
  `pk_tipo_conta` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_tipo_conta`),
  UNIQUE KEY `designacao` (`designacao`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_conta`
--

LOCK TABLES `tipo_conta` WRITE;
/*!40000 ALTER TABLE `tipo_conta` DISABLE KEYS */;
INSERT INTO `tipo_conta` VALUES (1,'admin','Conta do administador'),(2,'Estudante','Conta de estudante'),(3,'Orientador','Conta de estudante'),(4,'Coordenador','Conta de estudante'),(5,'Funcionario DEI','Conta de estudante'),(6,'Conselho Científico','Conselho Científico');
/*!40000 ALTER TABLE `tipo_conta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_conta_permissoes`
--

DROP TABLE IF EXISTS `tipo_conta_permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_conta_permissoes` (
  `pk_tipo_conta_permissoes` int NOT NULL AUTO_INCREMENT,
  `fk_tipo_conta` int DEFAULT NULL,
  `fk_permissoes` int DEFAULT NULL,
  PRIMARY KEY (`pk_tipo_conta_permissoes`),
  KEY `fk_tipo_conta` (`fk_tipo_conta`),
  KEY `fk_permissoes` (`fk_permissoes`),
  CONSTRAINT `tipo_conta_permissoes_fk_permissoes` FOREIGN KEY (`fk_permissoes`) REFERENCES `permissoes` (`pk_permissoes`),
  CONSTRAINT `tipo_conta_permissoes_fk_tipo_conta` FOREIGN KEY (`fk_tipo_conta`) REFERENCES `tipo_conta` (`pk_tipo_conta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_conta_permissoes`
--

LOCK TABLES `tipo_conta_permissoes` WRITE;
/*!40000 ALTER TABLE `tipo_conta_permissoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_conta_permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma`
--

DROP TABLE IF EXISTS `turma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma` (
  `pk_turma` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `fk_ano_lectivo` int NOT NULL,
  `fk_semestre` int NOT NULL,
  `fk_disciplina` int NOT NULL,
  `fk_coodenador` int NOT NULL,
  `data_inicio_semestre` date DEFAULT NULL,
  `data_fim_semestre` date DEFAULT NULL,
  `deleted_by` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_turma`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_semestre` (`fk_semestre`),
  KEY `fk_disciplina` (`fk_disciplina`),
  KEY `fk_coodenador` (`fk_coodenador`),
  KEY `fk_ano_lectivo` (`fk_ano_lectivo`),
  KEY `fk_deleted_by` (`deleted_by`),
  CONSTRAINT `fk_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE SET NULL,
  CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`fk_semestre`) REFERENCES `semestre` (`pk_semestre`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `turma_ibfk_2` FOREIGN KEY (`fk_disciplina`) REFERENCES `disciplina` (`pk_disciplina`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `turma_ibfk_3` FOREIGN KEY (`fk_coodenador`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `turma_ibfk_4` FOREIGN KEY (`fk_ano_lectivo`) REFERENCES `ano_lectivo` (`pk_ano_lectivo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma`
--

LOCK TABLES `turma` WRITE;
/*!40000 ALTER TABLE `turma` DISABLE KEYS */;
INSERT INTO `turma` VALUES (20,'TURMA-001',19,1,1,46,'2020-09-05','2026-04-20',NULL,NULL,'2024-12-30 10:52:08'),(21,'TURMA-009',19,5,3,21,'2024-12-29','2024-12-30',2,'2025-01-01 00:00:00','2024-12-30 11:17:21'),(22,'TURMA-002',20,1,1,1,'2024-09-01','2025-03-22',NULL,NULL,'2024-12-30 16:12:38'),(23,'TURMA-003',20,2,2,1,'2025-02-01','2025-07-31',NULL,NULL,'2024-12-30 16:26:55'),(25,'TP2000',19,2,1,17,'2024-10-02','2025-01-31',2,'2025-01-25 00:00:00','2025-01-25 02:21:37');
/*!40000 ALTER TABLE `turma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma_estudante`
--

DROP TABLE IF EXISTS `turma_estudante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma_estudante` (
  `pk_turma_estudante` int NOT NULL AUTO_INCREMENT,
  `fk_estudante` int NOT NULL,
  `fk_turma` int NOT NULL,
  `estado` enum('Reprovado','Activo','Desactivo','Aprovado') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_projeto` int DEFAULT NULL,
  PRIMARY KEY (`pk_turma_estudante`),
  KEY `fk_estudante` (`fk_estudante`),
  KEY `fk_turma` (`fk_turma`),
  KEY `fk_turma_fk_projecto_idx` (`fk_projeto`),
  CONSTRAINT `fk_turma_fk_projecto` FOREIGN KEY (`fk_projeto`) REFERENCES `projecto` (`pk_projecto`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `turma_estudante_ibfk_1` FOREIGN KEY (`fk_estudante`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `turma_estudante_ibfk_2` FOREIGN KEY (`fk_turma`) REFERENCES `turma` (`pk_turma`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_estudante`
--

LOCK TABLES `turma_estudante` WRITE;
/*!40000 ALTER TABLE `turma_estudante` DISABLE KEYS */;
INSERT INTO `turma_estudante` VALUES (3,5,20,'Activo','2024-12-30 10:53:28',18),(6,4,20,'Activo','2024-12-30 10:53:28',19),(26,3,22,'Activo','2024-12-30 16:14:34',14),(27,8,23,'Reprovado','2024-12-31 05:31:31',NULL),(29,10,22,'Desactivo','2025-01-01 13:43:51',NULL),(31,8,22,'Desactivo','2025-01-01 13:44:56',17),(36,39,21,'Desactivo','2025-01-01 19:23:46',NULL),(37,35,21,'Desactivo','2025-01-01 19:23:46',NULL),(38,42,22,'Desactivo','2025-01-19 16:30:59',NULL),(40,40,22,'Desactivo','2025-01-19 16:32:36',NULL),(41,49,22,'Desactivo','2025-01-20 12:46:40',NULL),(47,50,22,'Desactivo','2025-01-21 23:16:40',NULL),(50,39,22,'Desactivo','2025-01-27 16:29:12',NULL),(51,52,23,'Activo','2025-02-05 18:46:45',20),(52,9,23,'Activo','2025-02-06 17:27:46',NULL),(53,10,20,'Desactivo','2025-02-12 17:57:09',NULL),(54,8,20,'Aprovado','2025-02-12 17:57:09',22),(59,10,23,'Aprovado','2025-02-12 20:47:35',21);
/*!40000 ALTER TABLE `turma_estudante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `universidade`
--

DROP TABLE IF EXISTS `universidade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `universidade` (
  `pk_universidade` int NOT NULL AUTO_INCREMENT,
  `designacao` varchar(255) NOT NULL,
  `descricao` text,
  `sigla` varchar(10) NOT NULL,
  PRIMARY KEY (`pk_universidade`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `universidade`
--

LOCK TABLES `universidade` WRITE;
/*!40000 ALTER TABLE `universidade` DISABLE KEYS */;
INSERT INTO `universidade` VALUES (1,'Universidade Católica de Angola','Uma das maiores universidades privadas em Angola.','UCAN'),(2,'Universidade Agostinho Neto','A principal universidade pública de Angola.','UAN'),(3,'Universidade Metodista de Angola','Instituição de ensino superior de base metodista.','UMA'),(4,'UNIBELAS','Universidade UNIBELAS','UNIBELAS'),(5,'UIA','Universidade Independente','UIA'),(6,'ISPITEC','ISPITEC','ISPITEC');
/*!40000 ALTER TABLE `universidade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilizador`
--

DROP TABLE IF EXISTS `utilizador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilizador` (
  `pk_utilizador` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `num_matricula_estudante` varchar(15) DEFAULT NULL,
  `fk_sexo` int NOT NULL,
  `fk_tipo_conta` int NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_actualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grau_academico_orientador` enum('Professor Auxiliar','Mestre','Licenciado','Assistente') DEFAULT NULL,
  `fk_universidade_orientador` int DEFAULT NULL,
  `fk_cadastrado_por` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pk_utilizador`),
  KEY `fk_sexo` (`fk_sexo`),
  KEY `fk_tipo_conta` (`fk_tipo_conta`),
  KEY `fk_universidade_orientador` (`fk_universidade_orientador`),
  KEY `fk_cadastrado_por` (`fk_cadastrado_por`),
  KEY `deleted_by` (`deleted_by`),
  CONSTRAINT `deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `utilizador` (`pk_utilizador`) ON DELETE SET NULL,
  CONSTRAINT `fk_cadastrado_por` FOREIGN KEY (`fk_cadastrado_por`) REFERENCES `utilizador` (`pk_utilizador`),
  CONSTRAINT `fk_universidade_orientador` FOREIGN KEY (`fk_universidade_orientador`) REFERENCES `universidade` (`pk_universidade`),
  CONSTRAINT `utilizador_ibfk_1` FOREIGN KEY (`fk_sexo`) REFERENCES `sexo` (`pk_sexo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `utilizador_ibfk_2` FOREIGN KEY (`fk_tipo_conta`) REFERENCES `tipo_conta` (`pk_tipo_conta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilizador`
--

LOCK TABLES `utilizador` WRITE;
/*!40000 ALTER TABLE `utilizador` DISABLE KEYS */;
INSERT INTO `utilizador` VALUES (1,'Irineu Souto',NULL,1,3,'934566566','2024-07-22 00:00:00','2024-09-02 00:00:00',NULL,1,2,NULL,NULL,'2024-12-30 10:54:24'),(2,'Inocencia Daniel','',2,1,'933470970','2024-07-22 00:00:00','2024-07-22 15:57:04',NULL,NULL,NULL,NULL,NULL,'2024-12-30 10:54:24'),(3,'Yasmin Esperança','1000015273',2,2,'927071693','2024-07-30 00:00:00','2025-01-26 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(4,'Rubem Dario','1000015378',1,2,'938233320','2024-07-30 00:00:00','2024-08-26 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(5,'Nazilca Nascimento','1000012345',2,2,'927233320','2024-07-30 00:00:00','2024-08-26 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(6,'Ricardo Miranda Jose','',1,5,'933233320','2024-07-30 00:00:00','2024-07-30 15:59:20',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(7,'Ivandro Sousa',NULL,1,3,'934566567','2024-09-02 00:00:00','2024-09-02 00:00:00',NULL,1,2,NULL,NULL,'2024-12-30 10:54:24'),(8,'Paula Mateus','1000015274',2,2,'914566569','2024-09-02 00:00:00','2025-01-26 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(9,'Carla Prata dos Santos','1000015273',2,2,'934566568','2024-09-03 00:00:00','2025-02-06 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL),(10,'Maria Jose Santiago','1000015273',2,2,'934234566','2024-09-03 00:00:00','2024-09-03 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(11,'Maria da Conceiçao Gonçalves',NULL,2,5,'927071693','2024-09-03 00:00:00','2024-09-03 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(12,'Luis Alberto Magalhãs','1000015277',1,2,'934566568','2024-09-04 00:00:00','2024-09-04 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(13,'Emilia Dias','1000015277',2,2,'927427563','2024-09-04 00:00:00','2024-09-04 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(14,'Sara Turma','1000016277',2,2,'927427564','2024-09-04 00:00:00','2024-09-04 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(15,'Alessandro Carvalho','1000016277',1,2,'938938620','2024-09-06 00:00:00','2024-09-06 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(16,'Marina Ribeiro','1000016273',2,2,'927071694','2024-10-17 00:00:00','2024-10-17 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(17,'Beatriz Frank',NULL,2,3,'927071698','2024-10-17 00:00:00','2024-12-29 00:00:00','Professor Auxiliar',1,20,NULL,NULL,'2024-12-30 10:54:24'),(18,'Carlos Rodrigo',NULL,1,3,'927071696','2024-10-17 00:00:00','2024-10-17 00:00:00','Licenciado',1,2,NULL,NULL,'2024-12-30 10:54:24'),(19,'Josue Belo',NULL,1,3,'927071694','2024-10-18 00:00:00','2024-10-18 00:00:00','Licenciado',1,2,NULL,NULL,'2024-12-30 10:54:24'),(20,'Sebastião Paulo',NULL,1,6,'927071694','2024-10-18 00:00:00','2024-10-23 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(21,'Pedro Antonio Paulino',NULL,1,3,'927071697','2024-10-18 00:00:00','2024-10-18 00:00:00','Licenciado',1,2,NULL,NULL,'2024-12-30 10:54:24'),(22,'Rosario Benedito','1000011111',1,2,'991233345','2024-10-23 00:00:00','2024-10-23 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(23,'Fernando Batista','1000011112',1,2,'923456789','2024-10-23 00:00:00','2024-10-23 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(24,'Edson da Gama','1000011113',1,2,'945678900','2024-10-28 00:00:00','2024-10-28 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(25,'Basilio Fernandes da Costa',NULL,1,5,'945678908','2024-10-30 00:00:00','2024-10-30 00:00:00',NULL,NULL,2,'2025-02-12 00:00:00',2,'2024-12-30 10:54:24'),(26,'Damian Francisco',NULL,1,3,'945678902','2024-11-05 00:00:00','2024-11-05 00:00:00','Licenciado',2,2,NULL,NULL,'2024-12-30 10:54:24'),(27,'Ivete Cuta',NULL,2,3,'945678903','2024-11-05 00:00:00','2024-11-05 00:00:00','Licenciado',3,2,NULL,NULL,'2024-12-30 10:54:24'),(28,'Ester Maria',NULL,2,3,'945678904','2024-11-05 00:00:00','2024-11-05 00:00:00','Professor Auxiliar',1,2,NULL,NULL,'2024-12-30 10:54:24'),(29,'John Bengui',NULL,1,3,'945678905','2024-11-05 00:00:00','2024-11-05 00:00:00','Licenciado',4,2,NULL,NULL,'2024-12-30 10:54:24'),(30,'Viviane Pedro',NULL,2,3,'945678906','2024-11-05 00:00:00','2024-11-05 00:00:00','Mestre',2,2,NULL,NULL,'2024-12-30 10:54:24'),(31,'Leonard Reis',NULL,1,3,'945678905','2024-11-05 00:00:00','2024-11-05 00:00:00','Licenciado',2,2,NULL,NULL,'2024-12-30 10:54:24'),(32,'Luuis',NULL,1,3,'945678919','2024-11-06 00:00:00','2024-11-06 00:00:00','Professor Auxiliar',6,2,NULL,NULL,'2024-12-30 10:54:24'),(33,'Eduardo Paim',NULL,1,3,'941678900','2024-11-09 00:00:00','2024-11-09 00:00:00','Professor Auxiliar',1,2,NULL,NULL,'2024-12-30 10:54:24'),(34,'Tom Renato Vidal',NULL,1,3,'915678900','2024-11-09 00:00:00','2024-11-09 00:00:00','Licenciado',3,2,NULL,NULL,'2024-12-30 10:54:24'),(35,'Izzy Duarte','1000011115',2,2,'945677900','2024-11-09 00:00:00','2024-11-09 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(36,'Dias Matias ',NULL,1,3,'945608900','2024-11-09 00:00:00','2024-11-09 00:00:00',NULL,4,20,NULL,NULL,'2024-12-30 10:54:24'),(37,'Candita Teixeira',NULL,2,3,'945678907','2024-11-10 00:00:00','2024-11-10 00:00:00',NULL,3,20,'2024-11-23 00:00:00',20,'2024-12-30 10:54:24'),(38,'Celma Ribas',NULL,2,3,'945678802','2024-11-10 00:00:00','2024-11-10 00:00:00','Professor Auxiliar',3,20,'2024-11-23 00:00:00',20,'2024-12-30 10:54:24'),(39,'Khalid José','1000011116',1,2,'945678801','2024-12-27 00:00:00','2024-12-27 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(40,'Anderson Ramos','1000011119',1,2,'945670900','2024-12-29 00:00:00','2024-12-29 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(41,'Mirian Domingos',NULL,2,3,'945678900','2024-12-29 00:00:00','2024-12-29 00:00:00','Professor Auxiliar',1,2,NULL,NULL,'2024-12-30 10:54:24'),(42,'Gabriela Mendes Matias',NULL,2,5,'923456770','2024-12-29 00:00:00','2024-12-29 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(43,'Micaela Fernando',NULL,2,3,'945618900','2024-12-29 00:00:00','2024-12-29 00:00:00','Licenciado',4,20,NULL,NULL,'2024-12-30 10:54:24'),(44,'Nando Baptista',NULL,1,3,'923456170','2024-12-29 00:00:00','2024-12-29 00:00:00','Mestre',5,20,NULL,NULL,'2024-12-30 10:54:24'),(45,'Hernani dos Santos','1000012111',1,2,'935678908','2024-12-29 00:00:00','2024-12-29 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 10:54:24'),(46,'Aires Veloso',NULL,1,3,'927427565','2024-12-30 00:00:00','2024-12-30 00:00:00','Mestre',1,2,NULL,NULL,'2024-12-30 10:54:24'),(47,'Eliana Marlene Feijó Neto','1000021694',2,2,'937492577','2024-12-30 00:00:00','2024-12-30 00:00:00',NULL,NULL,2,NULL,NULL,'2024-12-30 11:05:07'),(48,'João de Deus','1000021111',2,2,'923456771','2025-01-18 00:00:00','2025-01-18 00:00:00',NULL,NULL,2,NULL,NULL,NULL),(49,'Benedito do Rosario ','1000011110',1,2,'929456770','2025-01-18 00:00:00','2025-01-18 00:00:00',NULL,NULL,2,NULL,NULL,NULL),(50,'Dimbu Simão','1000019110',2,2,'929456770','2025-01-21 00:00:00','2025-01-21 00:00:00',NULL,NULL,2,NULL,NULL,NULL),(51,'Fábio Baziota','1000015129',1,2,'912345678','2025-01-24 00:00:00','2025-01-24 00:00:00',NULL,NULL,2,'2025-01-25 00:00:00',2,NULL),(52,'Vitoria Semedo Rodrigues','1000012220',2,2,'945678911','2025-01-24 00:00:00','2025-01-24 00:00:00',NULL,NULL,2,NULL,NULL,NULL);
/*!40000 ALTER TABLE `utilizador` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-23 20:01:46
