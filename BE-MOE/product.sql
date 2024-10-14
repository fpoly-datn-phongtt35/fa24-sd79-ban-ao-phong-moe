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
	
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE products ADD CONSTRAINT fk_products_material_id FOREIGN KEY (material_id) REFERENCES materials(id);

ALTER TABLE product_images ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_size_id FOREIGN KEY (size_id) REFERENCES sizes(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_color_id FOREIGN KEY (color_id) REFERENCES colors(id);

-- Insert data into categories
INSERT INTO categories (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo Thun', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Áo Khoác', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Quần', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Váy', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Giày', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

-- Insert data into brands
INSERT INTO brands (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Nike', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Adidas', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Puma', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Levi\'s', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Zara', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

-- Insert data into materials
INSERT INTO materials (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Cotton', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Polyester', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Denim', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Lụa', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Vải Len', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

-- Insert data into products
INSERT INTO products (name, description, status, category_id, brand_id, material_id, origin, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo Thun Nữ Nike', 'Áo thun nữ chất liệu cotton mềm mịn', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-01 09:30:00', '2023-10-01 09:30:00', 0),
('Áo Thun Nữ Adidas', 'Áo thun nữ Adidas thời trang, năng động', 'ACTIVE', 1, 2, 2, 'Vietnam', 1, 1, '2023-10-02 10:00:00', '2023-10-02 10:00:00', 0),
('Áo Thun Nữ Puma', 'Áo thun nữ Puma, chất liệu polyester', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-10-03 11:00:00', '2023-10-03 11:00:00', 0),
('Áo Khoác Levi\'s', 'Áo khoác Levi\'s phong cách, ấm áp', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-10-04 12:00:00', '2023-10-04 12:00:00', 0),
('Váy Zara', 'Váy Zara nữ tính, chất liệu lụa', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-10-05 13:00:00', '2023-10-05 13:00:00', 0);

-- Insert data into sizes
INSERT INTO sizes (name, length, width, sleeve, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('S', 65, 40, 20, 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('M', 70, 45, 22, 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('L', 75, 50, 24, 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('XL', 80, 55, 26, 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('XXL', 85, 60, 28, 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0);

-- Insert data into colors
INSERT INTO colors (name, hex_color_code, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Đỏ', '#FF0000', 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('Xanh Dương', '#0000FF', 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('Đen', '#000000', 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('Trắng', '#FFFFFF', 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('Vàng', '#FFFF00', 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0);

-- Insert data into product_images
INSERT INTO product_images (product_id, image_url, public_id)
VALUES
(1, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873702/jocjyfja3t4ll0ukxmc2.jpg', 'jocjyfja3t4ll0ukxmc2'),
(2, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873701/wuwifz1mwshehf6jh4cw.jpg', 'wuwifz1mwshehf6jh4cw'),
(3, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873700/mcgxktx0qw5zyhqf7j8p.jpg', 'mcgxktx0qw5zyhqf7j8p'),
(4, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873702/jocjyfja3t4ll0ukxmc2.jpg', 'jocjyfja3t4ll0ukxmc2'),
(5, 'https://res.cloudinary.com/dnvsezlqx/image/upload/v1728873701/wuwifz1mwshehf6jh4cw.jpg', 'wuwifz1mwshehf6jh4cw');

-- Insert data into product_details
INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status)
VALUES
(1, 500000, 1, 1, 10, 'ACTIVE'),
(2, 600000, 2, 2, 20, 'ACTIVE'),
(3, 550000, 3, 3, 1, 'ACTIVE'),
(4, 700000, 4, 4, 15, 'ACTIVE'),
(5, 800000, 5, 5, 30, 'ACTIVE');
