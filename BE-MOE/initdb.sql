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

CREATE TABLE employee_address(
		id INT AUTO_INCREMENT PRIMARY KEY,
		street_name VARCHAR (50),
		ward VARCHAR(50),
		district VARCHAR(50),
		city VARCHAR(50),
		country VARCHAR(50)
);

CREATE TABLE employees(
		id INT AUTO_INCREMENT PRIMARY KEY,
		first_name VARCHAR(25),
		last_name  VARCHAR(50),
		address_id INT,
		phone_number VARCHAR (20),
		gender enum('MALE','FEMALE','OTHER'),
		date_of_birth DATE ,
		avatar VARCHAR(255),
		position_id INT,
		salary_id INT,
		created_at DATETIME,
		updated_at DATETIME
);
CREATE TABLE positions(
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		created_at DATETIME,
		updated_at DATETIME
);
CREATE TABLE salary (
		id INT AUTO_INCREMENT PRIMARY KEY,
		amount DECIMAL(15,0),
		created_at DATETIME,
		updated_at DATETIME
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
	material_id INT,
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
	width FLOAT,
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
	is_deleted BIT DEFAULT 0
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

-- coupons
CREATE TABLE coupons (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100) NOT NULL,
  discount_type ENUM('FIXED_AMOUNT', 'PERCENTAGE'),
  discount_value DECIMAL(15,0),
  max_value DECIMAL(15,0),
  conditions DECIMAL(15,0),
  quantity INT,
  type ENUM('PUBLIC', 'PERSONAL'),
  start_date DATETIME,
  end_date DATETIME,
  description TEXT,
  created_by BIGINT,
  updated_by BIGINT,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BIT DEFAULT 0
);


-- Employee
ALTER TABLE employees ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES employee_address(id);

ALTER TABLE employees ADD CONSTRAINT fk_position_id FOREIGN KEY (position_id) REFERENCES positions(id);

ALTER TABLE employees ADD CONSTRAINT fk_salary_id FOREIGN KEY (salary_id) REFERENCES salary(id);

-- Product
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE products ADD CONSTRAINT fk_products_material_id FOREIGN KEY (material_id) REFERENCES materials(id);

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

INSERT INTO materials (name, created_by, updated_by, create_at, update_at)
VALUES ('Fine cotton', 2, 1, NOW(), NOW()), ('Fine cotton', 1, 1, NOW(), NOW()), ('Twill', 2, 1, NOW(), NOW());

INSERT INTO sizes (name, length, width, sleeve, created_by, updated_by, create_at, update_at)
VALUES ('S', 10.0, 5.0, 3.0, 1, 1, NOW(), NOW()), ('L', 10.0, 5.0, 3.0, 1, 1, NOW(), NOW());

INSERT INTO colors (name, hex_color_code, created_by, updated_by, create_at, update_at)
VALUES ('Đỏ', '#FF0000', 1, 1, NOW(), NOW()), ('Trắng', '#FFFF', 1, 1, NOW(), NOW());

INSERT INTO product_images (image_url)
VALUES ('http://example.com/1.jpg'), ('http://example.com/2.jpg');

INSERT INTO products (name, description, status, category_id, brand_id, origin, created_by, updated_by, create_at, update_at)
VALUES ('Áo hình con thỏ', 'Mô tả sản phẩm', 'ACTIVE', 1, 1, 'Việt Nam', 1, 1, NOW(), NOW());

INSERT INTO product_details (product_id, retail_price, size_id, color_image_id, quantity, status)
VALUES (1, 50000, 1, 1, 100, 'ACTIVE');

INSERT INTO employee_address (street_name, ward, district, city, country)
VALUES
('123 Main St', 'Ward 1', 'District 1', 'Hanoi', 'Vietnam'),
('456 Oak Ave', 'Ward 2', 'District 3', 'Ho Chi Minh City', 'Vietnam'),
('789 Pine St', 'Ward 5', 'District 7', 'Da Nang', 'Vietnam');

INSERT INTO positions (name, created_at, updated_at)
VALUES
('Manager', NOW(), NOW()),
('Developer', NOW(), NOW()),
('Designer', NOW(), NOW());

INSERT INTO salary (amount, created_at, updated_at)
VALUES
(50000000, NOW(), NOW()),
(30000000, NOW(), NOW()),
(20000000, NOW(), NOW());

INSERT INTO employees (first_name, last_name, address_id, phone_number, gender, date_of_birth, avatar, position_id, salary_id, created_at, updated_at)
VALUES
('John', 'Doe', 1, '0123456789', 'MALE', '1990-01-01', 'john_avatar.jpg', 1, 1, NOW(), NOW()),
('Jane', 'Smith', 2, '0987654321', 'FEMALE', '1992-02-02', 'jane_avatar.jpg', 2, 2, NOW(), NOW()),
('Alex', 'Johnson', 3, '0112233445', 'OTHER', '1985-05-15', 'alex_avatar.jpg', 3, 3, NOW(), NOW());

-- coupons
-- Insert 5 sample records
INSERT INTO `coupons` (`code`, `name`, `discount_type`, `discount_value`, `max_value`, `conditions`, `quantity`, `type`, `start_date`, `end_date`, `description`, `created_by`, `updated_by`, `create_at`, `update_at`, `is_deleted`)
VALUES
('SAVE10', '10% off above 5000', 'PERCENTAGE', 10, NULL, 5000, 1, 'PUBLIC', '2024-01-01 00:00:00', '2024-12-31 23:59:59', '10% off on orders above 5000', 1, 1, NOW(), NOW(), 0),
('FLAT500', 'Flat 500 off above 3000', 'FIXED_AMOUNT', 500, NULL, 3000, 2, 'PERSONAL', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'Flat 500 off on orders above 3000', 2, 2, NOW(), NOW(), 0),
('WELCOME', '15% off for new users', 'PERCENTAGE', 15, NULL, 4000, 3, 'PUBLIC', '2024-01-01 00:00:00', '2024-06-30 23:59:59', '15% discount for new users', 3, 3, NOW(), NOW(), 0),
('FIRSTBUY', '1000 off first purchase', 'FIXED_AMOUNT', 1000, NULL, 6000, 1, 'PERSONAL', '2024-01-01 00:00:00', '2024-06-30 23:59:59', '1000 off on first purchase', 4, 4, NOW(), NOW(), 0),
('HOLIDAY', '20% holiday season discount', 'PERCENTAGE', 20, NULL, 7000, 1, 'PUBLIC', '2024-12-01 00:00:00', '2024-12-31 23:59:59', '20% holiday season discount', 5, 5, NOW(), NOW(), 0);






