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

-- Customer
CREATE TABLE customers (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    first_name varchar(25),
    last_name varchar(50),
    phone_number varchar(20),
    gender enum('MALE', 'FEMALE', 'OTHER'),
    date_of_birth date,
    image varchar(200),
    address_id bigint UNIQUE,
    created_at datetime,
    updated_at datetime
);

CREATE TABLE customer_address (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    street_name varchar(255),
    ward varchar(255),
    district varchar(255),
    city varchar(255),
    country varchar(255)
);

-- Product
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
	status ENUM('ACTIVE', 'INACTIVE'),
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
	product_id BIGINT,
	image_url VARCHAR(255),
	public_id VARCHAR(100)
);

CREATE TABLE product_details(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	product_id BIGINT,
	retail_price DECIMAL(15, 0),
	size_id INT,
	color_id INT,
	quantity INT,
	status ENUM('ACTIVE', 'INACTIVE')
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
  image VARCHAR(255) NULL,
  created_by BIGINT,
  updated_by BIGINT,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BIT DEFAULT 0
);

-- promotions
CREATE TABLE promotions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  promotion_type VARCHAR(50),
  promotion_value DECIMAL(10,2),
  start_date DATE,
  end_date DATE,	
  description TEXT
);

CREATE TABLE product_promotion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    promotion_id INT,
    applied_date DATE,
    promotion_price DECIMAL(10, 2)
);

-- Employee
ALTER TABLE employees ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES employee_address(id);

ALTER TABLE employees ADD CONSTRAINT fk_position_id FOREIGN KEY (position_id) REFERENCES positions(id);

ALTER TABLE employees ADD CONSTRAINT fk_salary_id FOREIGN KEY (salary_id) REFERENCES salary(id);

-- Customer
ALTER TABLE customers ADD CONSTRAINT fk_customer_address FOREIGN KEY (address_id) REFERENCES customer_address(id);

-- Product
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE products ADD CONSTRAINT fk_products_material_id FOREIGN KEY (material_id) REFERENCES materials(id);

ALTER TABLE product_images ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_size_id FOREIGN KEY (size_id) REFERENCES sizes(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_color_id FOREIGN KEY (color_id) REFERENCES colors(id);

-- promotions
ALTER TABLE product_promotion ADD CONSTRAINT fk_product_promotion_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_promotion ADD CONSTRAINT fk_product_promotion_promotion_id FOREIGN KEY (promotion_id) REFERENCES promotions(id);

-- ROLE --
INSERT INTO roles (name, created_at, updated_at) 
VALUES 
('ADMIN', NOW(), NOW()),
('USER', NOW(), NOW()),
('GUEST', NOW(), NOW());

INSERT INTO users (username, email, password, role_id, is_locked, is_enabled, created_at, updated_at, is_deleted)
VALUES 
('sysadmin', 'admin@moe.vn', '$2a$12$ypc6KO9e7Re1GxDI3gfLf.mrSSma89BjKBm9GH96falWrIO56cxI.', 1, 0, 0, NOW(), NOW(), 0),
('vunh2004', 'vunh2004@moe.vn', '$2a$12$NRGWUFouB4owNvLiEhZaX.gQu8oQjHU7rqpdCAW9/5Em2o8wgePtW', 1, 0, 0, NOW(), NOW(), 0),
('user', 'user@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0);

INSERT INTO categories (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo Thun', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Áo Khoác', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Quần', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Váy', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Giày', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

INSERT INTO brands (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Nike', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Adidas', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Puma', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Levi\'s', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Zara', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

INSERT INTO materials (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Cotton', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Polyester', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Denim', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Lụa', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Vải Len', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

INSERT INTO products (name, description, status, category_id, brand_id, material_id, origin, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo Thun Nữ Nike', 'Áo thun nữ chất liệu cotton mềm mịn', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-01 09:30:00', '2023-10-01 09:30:00', 0),
('Áo Thun Nữ Adidas', 'Áo thun nữ Adidas thời trang, năng động', 'ACTIVE', 1, 2, 2, 'Vietnam', 1, 1, '2023-10-02 10:00:00', '2023-10-02 10:00:00', 0),
('Áo Thun Nữ Puma', 'Áo thun nữ Puma, chất liệu polyester', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-10-03 11:00:00', '2023-10-03 11:00:00', 0),
('Áo Khoác Levi\'s', 'Áo khoác Levi\'s phong cách, ấm áp', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-10-04 12:00:00', '2023-10-04 12:00:00', 0),
('Váy Zara', 'Váy Zara nữ tính, chất liệu lụa', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-10-05 13:00:00', '2023-10-05 13:00:00', 0);

INSERT INTO sizes (name, length, width, sleeve, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('S', 65, 40, 20, 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('M', 70, 45, 22, 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('L', 75, 50, 24, 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('XL', 80, 55, 26, 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('XXL', 85, 60, 28, 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0);

INSERT INTO colors (name, hex_color_code, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Đỏ', '#FF0000', 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('Xanh Dương', '#0000FF', 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('Đen', '#000000', 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('Trắng', '#FFFFFF', 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('Vàng', '#FFFF00', 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0);

INSERT INTO product_images (product_id, image_url, public_id)
VALUES
(1, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873702/jocjyfja3t4ll0ukxmc2.jpg', 'jocjyfja3t4ll0ukxmc2'),
(2, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873701/wuwifz1mwshehf6jh4cw.jpg', 'wuwifz1mwshehf6jh4cw'),
(3, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873700/mcgxktx0qw5zyhqf7j8p.jpg', 'mcgxktx0qw5zyhqf7j8p'),
(4, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873702/jocjyfja3t4ll0ukxmc2.jpg', 'jocjyfja3t4ll0ukxmc2'),
(5, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873701/wuwifz1mwshehf6jh4cw.jpg', 'wuwifz1mwshehf6jh4cw');

INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status)
VALUES
(1, 500000, 1, 1, 10, 'ACTIVE'),
(2, 600000, 2, 2, 20, 'ACTIVE'),
(3, 550000, 3, 3, 1, 'ACTIVE'),
(4, 700000, 4, 4, 15, 'ACTIVE'),
(5, 800000, 5, 5, 30, 'ACTIVE');

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

-- Customer
INSERT INTO `customer_address` (`street_name`, `ward`, `district`, `city`, `country`)
VALUES
    ('123 Elm Street', 'Ward 1', 'District 1', 'City A', 'Country A'),
    ('456 Oak Street', 'Ward 2', 'District 2', 'City B', 'Country A'),
    ('789 Pine Street', 'Ward 3', 'District 3', 'City C', 'Country B'),
    ('101 Maple Street', 'Ward 4', 'District 4', 'City D', 'Country B'),
    ('202 Birch Street', 'Ward 5', 'District 5', 'City E', 'Country C');


INSERT INTO `customers` (`first_name`, `last_name`, `phone_number`, `gender`, `date_of_birth`, `image`, `address_id`, `created_at`, `updated_at`)
VALUES
    ('John', 'Doe', '123456789', 'MALE', '1985-05-15', 'john_doe.jpg', 1, NOW(), NOW()),
    ('Jane', 'Smith', '987654321', 'FEMALE', '1990-08-25', 'jane_smith.jpg', 2, NOW(), NOW()),
    ('Mike', 'Johnson', '555123456', 'MALE', '1979-11-30', 'mike_johnson.jpg', 3, NOW(), NOW()),
    ('Emily', 'Davis', '444987654', 'FEMALE', '1995-03-10', 'emily_davis.jpg', 4, NOW(), NOW()),
    ('Chris', 'Wilson', '333654789', 'OTHER', '1988-07-22', 'chris_wilson.jpg', 5, NOW(), NOW());
	
-- promotions
INSERT INTO promotions (name, promotion_type, promotion_value, start_date, end_date, description)
VALUES
('Summer Sale', 'Discount', 15.00, '2024-06-01', '2024-06-30', 'Get 15% off on all summer collection shirts.'),
('Buy 1 Get 1 Free', 'BOGO', 50.00, '2024-07-01', '2024-07-15', 'Buy one shirt and get another shirt of equal or lesser value for free.'),
('Flash Sale', 'Discount', 25.00, '2024-08-10', '2024-08-10', '25% off on selected shirts for 24 hours.'),
('Holiday Special', 'Discount', 20.00, '2024-12-20', '2024-12-31', 'Celebrate the holidays with 20% off on all shirts.');

INSERT INTO product_promotion (product_id, promotion_id, applied_date, promotion_price)
VALUES
(1, 1, '2024-06-01', 85.00);

-- Coupons
INSERT INTO `coupons` (`code`, `name`, `discount_type`, `discount_value`, `max_value`, `conditions`, `quantity`, `type`, `start_date`, `end_date`, `description`, image, `created_by`, `updated_by`, `create_at`, `update_at`, `is_deleted`)
VALUES
('CODE5892', 'Coupon 1', 'FIXED_AMOUNT', 57.95, 489.77, 123.04, 38, 'PUBLIC', '2024-10-03 06:42:47', '2024-12-03 06:42:47', 'This is description for Coupon 1', 'image_1.png', 9, 3, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE7309', 'Coupon 2', 'FIXED_AMOUNT', 85.12, 106.05, 14.56, 24, 'PUBLIC', '2024-10-03 06:42:47', '2025-07-09 06:42:47', 'This is description for Coupon 2', 'image_2.png', 1, 7, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 0),
('CODE9879', 'Coupon 3', 'PERCENTAGE', 21.37, 69.60, 116.24, 3, 'PERSONAL', '2024-10-03 06:42:47', '2025-01-27 06:42:47', 'This is description for Coupon 3', 'image_3.png', 8, 6, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE6860', 'Coupon 4', 'FIXED_AMOUNT', 58.65, 134.11, 57.17, 66, 'PUBLIC', '2024-10-03 06:42:47', '2024-12-10 06:42:47', 'This is description for Coupon 4', 'image_4.png', 5, 6, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE3542', 'Coupon 5', 'PERCENTAGE', 43.87, 395.30, 197.18, 60, 'PUBLIC', '2024-10-03 06:42:47', '2025-02-04 06:42:47', 'This is description for Coupon 5', 'image_5.png', 9, 2, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE7612', 'Coupon 6', 'PERCENTAGE', 55.79, 370.94, 105.59, 4, 'PERSONAL', '2024-10-03 06:42:47', '2025-03-30 06:42:47', 'This is description for Coupon 6', 'image_6.png', 2, 9, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE3354', 'Coupon 7', 'FIXED_AMOUNT', 68.56, 104.59, 17.24, 74, 'PERSONAL', '2024-10-03 06:42:47', '2025-05-03 06:42:47', 'This is description for Coupon 7', 'image_7.png', 7, 8, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 0),
('CODE1771', 'Coupon 8', 'PERCENTAGE', 79.81, 485.91, 168.22, 97, 'PERSONAL', '2024-10-03 06:42:47', '2025-08-16 06:42:47', 'This is description for Coupon 8', 'image_8.png', 1, 8, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE1117', 'Coupon 9', 'FIXED_AMOUNT', 64.88, 331.88, 72.62, 99, 'PERSONAL', '2024-10-03 06:42:47', '2025-03-02 06:42:47', 'This is description for Coupon 9', 'image_9.png', 9, 7, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1),
('CODE5308', 'Coupon 10', 'FIXED_AMOUNT', 53.34, 449.04, 113.73, 56, 'PERSONAL', '2024-10-03 06:42:47', '2025-02-28 06:42:47', 'This is description for Coupon 10', 'image_10.png', 7, 10, '2024-10-03 06:42:47', '2024-10-03 06:42:47', 1);
