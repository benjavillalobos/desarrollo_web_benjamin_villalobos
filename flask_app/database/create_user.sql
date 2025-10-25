-- Active: 1761345375797@@127.0.0.1@3306@mysql
-- Si ya existe el usuario o base de datos, las eliminamos (opcional)
DROP DATABASE IF EXISTS tarea2;
DROP USER IF EXISTS 'cc5002'@'localhost';

-- Crear base de datos
CREATE DATABASE tarea2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario con los permisos indicados
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';

-- Darle todos los permisos sobre la base de datos tarea2
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost';
FLUSH PRIVILEGES;

-- Usar la base de datos
USE tarea2;
