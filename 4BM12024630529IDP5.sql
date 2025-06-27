DROP DATABASE login_db;
CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

--CREATE TABLE IF NOT EXISTS users (
    --id INT AUTO_INCREMENT PRIMARY KEY, 
   --username VARCHAR(50) NOT NULL UNIQUE,
    --password VARCHAR(50) NOT NULL, 
    --email VARCHAR(100) NOT NULL UNIQUE,
    --type_user VARCHAR(50) NOT NULL);

CREATE TABLE IF NOT EXISTS highScores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(10) NOT NULL,
    score INT NOT NULL
);

--INSERT INTO users (username, password, email, type_user) VALUES ('admin', '1234', 'admin@mail.com', 'admin');
INSERT INTO highScores(user, score) VALUES ('mil', '30');
INSERT INTO highScores(user, score) VALUES ('dan', '50');
INSERT INTO highScores(user, score) VALUES ('cha', '40');
