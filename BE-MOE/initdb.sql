CREATE DATABASE sd79_db_moe;

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

-- ROLE --
INSERT INTO roles (name, created_at, updated_at) 
VALUES 
('ADMIN', NOW(), NOW()),
('USER', NOW(), NOW()),
('GUEST', NOW(), NOW());

INSERT INTO users (username, email, password, role_id, is_locked, is_enabled, created_at, updated_at, is_deleted)
VALUES 
('sysadmin', 'admin@moe.vn', '$2a$12$ypc6KO9e7Re1GxDI3gfLf.mrSSma89BjKBm9GH96falWrIO56cxI.', 1, 0, 0, NOW(), NOW(), 0),
('user', 'user@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0);
