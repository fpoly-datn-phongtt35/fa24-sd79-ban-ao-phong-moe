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
	origin VARCHAR(100),
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

ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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


-- More data
-- Insert additional data into products
INSERT INTO products (name, description, status, category_id, brand_id, material_id, origin, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo Thun Nữ Nike 01', 'Áo thun nữ Nike, chất liệu cotton', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-30 10:00:00', '2023-09-30 10:00:00', 0),
('Áo Thun Nữ Adidas 01', 'Áo thun nữ Adidas, thoáng mát', 'ACTIVE', 1, 2, 1, 'Vietnam', 1, 1, '2023-09-30 11:00:00', '2023-09-30 11:00:00', 0),
('Áo Thun Nữ Puma 01', 'Áo thun nữ Puma, năng động', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-09-30 12:00:00', '2023-09-30 12:00:00', 0),
('Áo Khoác Levi\'s 01', 'Áo khoác Levi\'s thời trang', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-09-30 13:00:00', '2023-09-30 13:00:00', 0),
('Váy Zara 01', 'Váy Zara nữ tính', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-09-30 14:00:00', '2023-09-30 14:00:00', 0),
('Áo Thun Nữ Nike 02', 'Áo thun nữ Nike chất lượng cao', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-01 10:00:00', '2023-10-01 10:00:00', 0),
('Áo Thun Nữ Adidas 02', 'Áo thun nữ Adidas thiết kế đẹp', 'ACTIVE', 1, 2, 1, 'Vietnam', 1, 1, '2023-10-01 11:00:00', '2023-10-01 11:00:00', 0),
('Áo Thun Nữ Puma 02', 'Áo thun nữ Puma thể thao', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-10-01 12:00:00', '2023-10-01 12:00:00', 0),
('Áo Khoác Levi\'s 02', 'Áo khoác Levi\'s dày dặn', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-10-01 13:00:00', '2023-10-01 13:00:00', 0),
('Váy Zara 02', 'Váy Zara phong cách sang trọng', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-10-01 14:00:00', '2023-10-01 14:00:00', 0),
('Áo Thun Nữ Nike 03', 'Áo thun nữ Nike form rộng', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-02 10:00:00', '2023-10-02 10:00:00', 0),
('Áo Thun Nữ Adidas 03', 'Áo thun nữ Adidas form ôm', 'ACTIVE', 1, 2, 1, 'Vietnam', 1, 1, '2023-10-02 11:00:00', '2023-10-02 11:00:00', 0),
('Áo Thun Nữ Puma 03', 'Áo thun nữ Puma siêu nhẹ', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-10-02 12:00:00', '2023-10-02 12:00:00', 0),
('Áo Khoác Levi\'s 03', 'Áo khoác Levi\'s không thấm nước', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-10-02 13:00:00', '2023-10-02 13:00:00', 0),
('Váy Zara 03', 'Váy Zara chất liệu mềm mại', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-10-02 14:00:00', '2023-10-02 14:00:00', 0),
('Áo Thun Nữ Nike 04', 'Áo thun nữ Nike phối màu đẹp', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-03 10:00:00', '2023-10-03 10:00:00', 0),
('Áo Thun Nữ Adidas 04', 'Áo thun nữ Adidas co giãn', 'ACTIVE', 1, 2, 1, 'Vietnam', 1, 1, '2023-10-03 11:00:00', '2023-10-03 11:00:00', 0),
('Áo Thun Nữ Puma 04', 'Áo thun nữ Puma với logo nổi bật', 'ACTIVE', 1, 3, 2, 'Vietnam', 1, 1, '2023-10-03 12:00:00', '2023-10-03 12:00:00', 0),
('Áo Khoác Levi\'s 04', 'Áo khoác Levi\'s ấm áp', 'INACTIVE', 2, 4, 3, 'Vietnam', 1, 1, '2023-10-03 13:00:00', '2023-10-03 13:00:00', 0),
('Váy Zara 04', 'Váy Zara thiết kế thanh lịch', 'ACTIVE', 4, 5, 4, 'Vietnam', 1, 1, '2023-10-03 14:00:00', '2023-10-03 14:00:00', 0);

-- Insert additional data into product_details
INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status)
VALUES
(6, 550000, 1, 2, 10, 'ACTIVE'),
(7, 600000, 2, 1, 20, 'ACTIVE'),
(8, 620000, 3, 3, 15, 'ACTIVE'),
(9, 750000, 4, 4, 18, 'INACTIVE'),
(10, 800000, 5, 5, 12, 'ACTIVE'),
(11, 550000, 1, 2, 30, 'ACTIVE'),
(12, 600000, 2, 1, 25, 'ACTIVE'),
(13, 620000, 3, 3, 18, 'ACTIVE'),
(14, 750000, 4, 4, 10, 'INACTIVE'),
(15, 800000, 5, 5, 22, 'ACTIVE'),
(16, 550000, 1, 2, 17, 'ACTIVE'),
(17, 600000, 2, 1, 20, 'ACTIVE'),
(18, 620000, 3, 3, 10, 'ACTIVE'),
(19, 750000, 4, 4, 15, 'INACTIVE'),
(20, 800000, 5, 5, 18, 'ACTIVE'),
(21, 550000, 1, 2, 20, 'ACTIVE'),
(22, 600000, 2, 1, 25, 'ACTIVE'),
(23, 620000, 3, 3, 22, 'ACTIVE'),
(24, 750000, 4, 4, 18, 'INACTIVE'),
(25, 800000, 5, 5, 30, 'ACTIVE');

INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status)
VALUES
(6, 550000, 1, 2, 50, 'ACTIVE'),
(7, 600000, 2, 3, 40, 'ACTIVE'),
(8, 650000, 3, 1, 30, 'ACTIVE'),
(9, 700000, 4, 4, 20, 'ACTIVE'),
(10, 750000, 5, 5, 15, 'ACTIVE'),
(11, 800000, 1, 2, 10, 'INACTIVE'),
(12, 850000, 2, 3, 25, 'ACTIVE'),
(13, 900000, 3, 1, 35, 'ACTIVE'),
(14, 950000, 4, 4, 45, 'INACTIVE'),
(15, 1000000, 5, 5, 50, 'ACTIVE'),
(16, 550000, 1, 2, 60, 'ACTIVE'),
(17, 600000, 2, 3, 70, 'ACTIVE'),
(18, 650000, 3, 1, 80, 'ACTIVE'),
(19, 700000, 4, 4, 90, 'INACTIVE'),
(20, 750000, 5, 5, 100, 'ACTIVE'),
(21, 800000, 1, 2, 55, 'ACTIVE'),
(22, 850000, 2, 3, 65, 'ACTIVE'),
(23, 900000, 3, 1, 75, 'ACTIVE'),
(24, 950000, 4, 4, 85, 'INACTIVE'),
(25, 1000000, 5, 5, 95, 'ACTIVE');
