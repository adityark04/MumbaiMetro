create database database_name;
use database_name;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    confirm_password VARCHAR(255)
);

INSERT INTO Users (username, password, confirm_password) 
VALUES 
('Aditya', '1234', '1234'),
('Maanya','2345','2345');