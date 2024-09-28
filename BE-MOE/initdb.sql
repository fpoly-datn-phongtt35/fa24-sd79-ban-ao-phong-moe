CREATE DATABASE sd79_db_moe;

USE sd79_db_moe;

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

CREATE TABLE categories(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE brands(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE materials(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE products(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(200),
	description VARCHAR(255),
	status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'),
	category_id INT,
	brand_id INT,
	origin VARCHAR(30),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE sizes(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(10),
	length FLOAT,
	withd FLOAT,
	sleeve FLOAT,
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE colors(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(10),
	hex_color_code VARCHAR(100),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_delete BIT DEFAULT 0
);

CREATE TABLE product_images(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	image_url VARCHAR(255)
);

CREATE TABLE product_color_images(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	color_id INT,
	image_id BIGINT
);

CREATE TABLE product_details(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	product_id BIGINT,
	retail_price DECIMAL(15, 0),
	size_id INT,
	color_image_id BIGINT,
	quantity INT,
	status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK')
);


ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_size_id FOREIGN KEY (size_id) REFERENCES sizes(id);

ALTER TABLE product_color_images ADD CONSTRAINT fk_product_color_images_color_id FOREIGN KEY (color_id) REFERENCES colors(id);

ALTER TABLE product_color_images ADD CONSTRAINT fk_product_color_images_image_id FOREIGN KEY (image_id) REFERENCES product_images(id);

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

INSERT INTO categories (name, created_by, updated_by, create_at, update_at)
VALUES ('Áo cộc tay', 1, 1, NOW(), NOW()),('Áo dài tay', 1, 1, NOW(), NOW());

INSERT INTO brands (name, created_by, updated_by, create_at, update_at)
VALUES ('Adidas', 1, 1, NOW(), NOW()), ('Nike', 1, 1, NOW(), NOW()), ('Fila', 1, 1, NOW(), NOW());

INSERT INTO sizes (name, length, withd, sleeve, created_by, updated_by, create_at, update_at)
VALUES ('S', 10.0, 5.0, 3.0, 1, 1, NOW(), NOW()), ('L', 10.0, 5.0, 3.0, 1, 1, NOW(), NOW());

INSERT INTO colors (name, hex_color_code, created_by, updated_by, create_at, update_at)
VALUES ('Đỏ', '#FF0000', 1, 1, NOW(), NOW()), ('Trắng', '#FFFF', 1, 1, NOW(), NOW());

INSERT INTO product_images (image_url)
VALUES ('http://example.com/1.jpg'), ('http://example.com/2.jpg');

INSERT INTO products (name, description, status, category_id, brand_id, origin, created_by, updated_by, create_at, update_at)
VALUES ('Áo hình con thỏ', 'Mô tả sản phẩm', 'ACTIVE', 1, 1, 'Việt Nam', 1, 1, NOW(), NOW());

INSERT INTO product_details (product_id, retail_price, size_id, color_image_id, quantity, status)
VALUES (1, 50000, 1, 1, 100, 'ACTIVE');



