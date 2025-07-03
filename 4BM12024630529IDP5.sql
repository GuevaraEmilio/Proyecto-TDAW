DROP DATABASE login_db;
CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  USERNAME VARCHAR(255) NOT NULL UNIQUE,
  PASSWORD VARCHAR(255) NOT NULL,
  EMAIL VARCHAR(255) NOT NULL,
  TYPE_USER VARCHAR(50) NOT NULL DEFAULT 'user'
);

CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  SCORE INT NOT NULL,
  USER_ID INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (USER_ID) REFERENCES users(id)
);


INSERT INTO users (USERNAME, PASSWORD, EMAIL, TYPE_USER) VALUES
('daniela', '1234', 'daniela@mail.com', 'admin'),
('emilio', 'abcd', 'emilio@mail.com', 'user'),
('shareni', 'qwerty', 'shareni@mail.com', 'user'),
('invitado1', 'invitado', 'invitado1@mail.com', 'user'),
('gamer_x', 'password1', 'gamerx@mail.com', 'user');

INSERT INTO scores (SCORE, USER_ID) VALUES
(120, 1),  -- daniela
(250, 2),  -- emilio
(180, 3),  -- shareni
(90, 4),   -- invitado1
(300, 5),  -- gamer_x
(160, 1),  -- daniela
(270, 2),  -- emilio
(100, 3),  -- shareni
(110, 4),  -- invitado1
(320, 5);  -- gamer_x
/*--INSERT INTO users (username, password, email, type_user) VALUES ('admin', '1234', 'admin@mail.com', 'admin');
INSERT INTO highScores(user, score) VALUES ('mil', '30');
INSERT INTO highScores(user, score) VALUES ('dan', '50');
INSERT INTO highScores(user, score) VALUES ('cha', '40');
*/