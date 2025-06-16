CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

CREATE TABLE IF NOT EXISTS users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    type_user VARCHAR(50) NOT NULL
);
INSERT INTO users (username, password, type_user) VALUES ('admin', '1234', 'admin');