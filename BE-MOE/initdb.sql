CREATE DATABASE sd79_db_moe

USE sd79_db_moe

CREATE TABLE roles(
                      id INT AUTO_INCREMENT PRIMARY KEY,
                      name ENUM('ADMIN', 'USER', 'GUEST'),
                      created_at DATETIME,
                      updated_at DATETIME
);

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50),
                       email VARCHAR(100),
                       password VARCHAR(255),
                       role_id INT,
                       is_locked BIT DEFAULT 0,
                       is_enabled BIT DEFAULT 1,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       is_deleted BIT DEFAULT 0
);
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);