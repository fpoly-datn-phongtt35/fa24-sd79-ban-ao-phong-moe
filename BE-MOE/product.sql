CREATE DATABASE sd79_db_moe;

USE sd79_db_moe;

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

INSERT INTO products (name, description, status, category_id, brand_id, material_id, origin, created_by, updated_by, create_at, update_at)
VALUES
('Áo thun nam cơ bản', 'Áo thun nam chất cotton, kiểu dáng đơn giản.', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-20 10:30:00', '2023-09-20 10:30:00'),
('Áo thun nữ cơ bản', 'Áo thun nữ chất cotton, kiểu dáng đơn giản.', 'ACTIVE', 1, 2, 1, 'Vietnam', 1, 1, '2023-09-21 10:30:00', '2023-09-21 10:30:00'),
('Áo thun nam in hình', 'Áo thun nam với họa tiết in độc đáo.', 'ACTIVE', 1, 3, 1, 'Japan', 2, 2, '2023-09-22 11:00:00', '2023-09-22 11:00:00'),
('Áo thun nữ in hình', 'Áo thun nữ với họa tiết in sáng tạo.', 'ACTIVE', 1, 4, 1, 'Taiwan', 3, 3, '2023-09-23 12:00:00', '2023-09-23 12:00:00'),
('Áo thun dài tay nam', 'Áo thun dài tay dành cho nam, giữ ấm tốt.', 'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-24 10:30:00', '2023-09-24 10:30:00'),
('Áo thun dài tay nữ', 'Áo thun dài tay dành cho nữ, phong cách hiện đại.', 'ACTIVE', 1, 2, 2, 'Japan', 2, 2, '2023-09-25 10:30:00', '2023-09-25 10:30:00'),
('Áo thun polo nam', 'Áo polo nam chất liệu cao cấp, lịch lãm.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-09-26 11:00:00', '2023-09-26 11:00:00'),
('Áo thun polo nữ', 'Áo polo nữ thời trang, phù hợp đi làm.', 'ACTIVE', 1, 4, 1, 'Vietnam', 1, 1, '2023-09-27 12:00:00', '2023-09-27 12:00:00'),
('Áo thun tay lỡ nam', 'Áo thun tay lỡ, trẻ trung và năng động.', 'ACTIVE', 1, 1, 2, 'Japan', 2, 2, '2023-09-28 10:30:00', '2023-09-28 10:30:00'),
('Áo thun tay lỡ nữ', 'Áo thun tay lỡ, phù hợp cho mùa hè.', 'ACTIVE', 1, 2, 2, 'Taiwan', 3, 3, '2023-09-29 11:00:00', '2023-09-29 11:00:00'),
('Áo thun họa tiết mùa hè', 'Áo thun với họa tiết mùa hè, chất liệu thoáng mát.', 'ACTIVE', 1, 3, 1, 'Vietnam', 1, 1, '2023-09-30 12:00:00', '2023-09-30 12:00:00'),
('Áo thun nam cổ tròn', 'Áo thun cổ tròn dành cho nam, kiểu dáng thể thao.', 'ACTIVE', 1, 1, 1, 'Japan', 2, 2, '2023-08-20 10:30:00', '2023-08-20 10:30:00'),
('Áo thun nữ cổ tròn', 'Áo thun cổ tròn dành cho nữ, thoải mái.', 'ACTIVE', 1, 2, 1, 'Taiwan', 3, 3, '2023-08-21 11:00:00', '2023-08-21 11:00:00'),
('Áo thun nam cổ bẻ', 'Áo thun cổ bẻ, thanh lịch cho nam.', 'ACTIVE', 1, 3, 1, 'Vietnam', 1, 1, '2023-08-22 12:00:00', '2023-08-22 12:00:00'),
('Áo thun nữ cổ bẻ', 'Áo thun cổ bẻ, hiện đại và quyến rũ.', 'ACTIVE', 1, 4, 1, 'Japan', 2, 2, '2023-08-23 10:30:00', '2023-08-23 10:30:00'),
('Áo thun nam thể thao', 'Áo thun thể thao, phù hợp cho vận động.', 'ACTIVE', 1, 1, 2, 'Taiwan', 3, 3, '2023-08-24 11:00:00', '2023-08-24 11:00:00'),
('Áo thun nữ thể thao', 'Áo thun thể thao, thoáng mát và thoải mái.', 'ACTIVE', 1, 2, 2, 'Vietnam', 1, 1, '2023-08-25 12:00:00', '2023-08-25 12:00:00'),
('Áo thun chống nắng nam', 'Áo thun chống nắng cho nam, chất liệu đặc biệt.', 'ACTIVE', 1, 3, 1, 'Japan', 2, 2, '2023-08-26 10:30:00', '2023-08-26 10:30:00'),
('Áo thun chống nắng nữ', 'Áo thun chống nắng cho nữ, thiết kế thời trang.', 'ACTIVE', 1, 4, 1, 'Taiwan', 3, 3, '2023-08-27 11:00:00', '2023-08-27 11:00:00'),
('Áo thun mùa đông nam', 'Áo thun mùa đông, giữ ấm tốt cho nam.', 'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-08-28 12:00:00', '2023-08-28 12:00:00'),
('Áo thun mùa đông nữ', 'Áo thun mùa đông, thiết kế đẹp cho nữ.', 'ACTIVE', 1, 2, 2, 'Japan', 2, 2, '2023-08-29 10:30:00', '2023-08-29 10:30:00'),
('Áo thun lót mỏng nam', 'Áo lót mỏng cho nam, thoáng mát vào mùa hè.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-08-30 11:00:00', '2023-08-30 11:00:00'),
('Áo thun lót mỏng nữ', 'Áo lót mỏng cho nữ, tiện lợi và dễ mặc.', 'ACTIVE', 1, 4, 1, 'Vietnam', 1, 1, '2023-08-31 12:00:00', '2023-08-31 12:00:00'),
('Áo thun đơn giản nam', 'Áo thun đơn giản, dễ phối đồ cho nam.', 'ACTIVE', 1, 1, 2, 'Japan', 2, 2, '2023-09-01 10:30:00', '2023-09-01 10:30:00'),
('Áo thun đơn giản nữ', 'Áo thun đơn giản, phù hợp với mọi phong cách.', 'ACTIVE', 1, 2, 2, 'Taiwan', 3, 3, '2023-09-02 11:00:00', '2023-09-02 11:00:00'),
('Áo thun oversized nam', 'Áo thun oversized dành cho nam, thời trang.', 'ACTIVE', 1, 3, 1, 'Vietnam', 1, 1, '2023-09-03 12:00:00', '2023-09-03 12:00:00'),
('Áo thun oversized nữ', 'Áo thun oversized dành cho nữ, trẻ trung.', 'ACTIVE', 1, 4, 1, 'Japan', 2, 2, '2023-09-04 10:30:00', '2023-09-04 10:30:00'),
('Áo thun màu sắc nam', 'Áo thun với nhiều màu sắc tươi sáng cho nam.', 'ACTIVE', 1, 1, 2, 'Taiwan', 3, 3, '2023-09-05 11:00:00', '2023-09-05 11:00:00'),
('Áo thun màu sắc nữ', 'Áo thun với nhiều màu sắc tươi sáng cho nữ.', 'ACTIVE', 1, 2, 2, 'Vietnam', 1, 1, '2023-09-06 12:00:00', '2023-09-06 12:00:00'),
('Áo thun chất lượng cao nam', 'Áo thun chất lượng cao, thoải mái cho nam.', 'ACTIVE', 1, 3, 1, 'Japan', 2, 2, '2023-09-07 10:30:00', '2023-09-07 10:30:00'),
('Áo thun chất lượng cao nữ', 'Áo thun chất lượng cao, thời trang cho nữ.', 'ACTIVE', 1, 4, 1, 'Taiwan', 3, 3, '2023-09-08 11:00:00', '2023-09-08 11:00:00'),
('Áo thun thiết kế riêng nam', 'Áo thun thiết kế riêng cho nam, độc đáo.', 'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-09 12:00:00', '2023-09-09 12:00:00'),
('Áo thun thiết kế riêng nữ', 'Áo thun thiết kế riêng cho nữ, nổi bật.', 'ACTIVE', 1, 2, 2, 'Japan', 2, 2, '2023-09-10 10:30:00', '2023-09-10 10:30:00'),
('Áo thun với màu sắc nổi bật', 'Áo thun với màu sắc nổi bật, thu hút mọi ánh nhìn.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-09-11 11:00:00', '2023-09-11 11:00:00'),
('Áo thun nhiều họa tiết', 'Áo thun với nhiều họa tiết độc đáo, sáng tạo.', 'ACTIVE', 1, 4, 1, 'Vietnam', 1, 1, '2023-09-12 12:00:00', '2023-09-12 12:00:00'),
('Áo thun trẻ em', 'Áo thun dành cho trẻ em, màu sắc tươi sáng.', 'ACTIVE', 1, 1, 2, 'Japan', 2, 2, '2023-09-13 10:30:00', '2023-09-13 10:30:00'),
('Áo thun cặp đôi', 'Áo thun dành cho cặp đôi, thiết kế dễ thương.', 'ACTIVE', 1, 2, 2, 'Taiwan', 3, 3, '2023-09-14 11:00:00', '2023-09-14 11:00:00'),
('Áo thun in chữ nổi', 'Áo thun với chữ in nổi, phong cách cá tính.', 'ACTIVE', 1, 3, 1, 'Vietnam', 1, 1, '2023-09-15 12:00:00', '2023-09-15 12:00:00'),
('Áo thun hoa văn', 'Áo thun với hoa văn trang trí, nhẹ nhàng.', 'ACTIVE', 1, 4, 1, 'Japan', 2, 2, '2023-09-16 10:30:00', '2023-09-16 10:30:00'),
('Áo thun chui đầu', 'Áo thun chui đầu, đơn giản và dễ mặc.', 'ACTIVE', 1, 1, 2, 'Taiwan', 3, 3, '2023-09-17 11:00:00', '2023-09-17 11:00:00'),
('Áo thun cổ lọ', 'Áo thun cổ lọ, giữ ấm cho mùa đông.', 'ACTIVE', 1, 2, 2, 'Vietnam', 1, 1, '2023-09-18 12:00:00', '2023-09-18 12:00:00'),
('Áo thun lưng dài', 'Áo thun lưng dài, phong cách trẻ trung.', 'ACTIVE', 1, 3, 1, 'Japan', 2, 2, '2023-09-19 10:30:00', '2023-09-19 10:30:00'),
('Áo thun nam kẻ sọc', 'Áo thun nam họa tiết kẻ sọc thời trang.', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-20 10:30:00', '2023-09-20 10:30:00'),
('Áo thun nữ kẻ sọc', 'Áo thun nữ họa tiết kẻ sọc hiện đại.', 'ACTIVE', 1, 2, 1, 'Japan', 2, 2, '2023-09-21 11:00:00', '2023-09-21 11:00:00'),
('Áo thun in logo', 'Áo thun với logo thương hiệu nổi bật.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-09-22 12:00:00', '2023-09-22 12:00:00'),
('Áo thun tay dài in chữ', 'Áo thun tay dài với chữ in phong cách.', 'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-23 10:30:00', '2023-09-23 10:30:00'),
('Áo thun cổ tròn tay dài', 'Áo thun cổ tròn tay dài cho nam.', 'ACTIVE', 1, 2, 2, 'Japan', 2, 2, '2023-09-24 11:00:00', '2023-09-24 11:00:00'),
('Áo thun lửng nữ', 'Áo thun lửng cho nữ, phong cách năng động.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-09-25 12:00:00', '2023-09-25 12:00:00'),
('Áo thun hình hoạt hình', 'Áo thun với hình hoạt hình vui nhộn.', 'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-26 10:30:00', '2023-09-26 10:30:00'),
('Áo thun oversize in hình', 'Áo thun oversize với họa tiết in cá tính.', 'ACTIVE', 1, 2, 2, 'Japan', 2, 2, '2023-09-27 11:00:00', '2023-09-27 11:00:00'),
('Áo thun chất liệu linen', 'Áo thun chất liệu linen, thoáng mát và dễ chịu.', 'ACTIVE', 1, 3, 1, 'Taiwan', 3, 3, '2023-09-28 12:00:00', '2023-09-28 12:00:00'),
('Áo thun phản quang', 'Áo thun với chi tiết phản quang, an toàn khi đi đêm.', 'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-29 10:30:00', '2023-09-29 10:30:00');

INSERT INTO product_images (product_id, image_url, public_id) VALUES
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(6, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(8, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(9, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(10, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(11, 'https://down-vn.img.susercontent.com/file/7bc6edacef61dc4d61d86914eeed6b99.webp', '7bc6edacef61dc4d61d86914eeed6b99'),
(12, 'https://down-vn.img.susercontent.com/file/15c1582279c507254d02b868d8369919.webp', '15c1582279c507254d02b868d8369919'),
(13, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qven-lkgdo1p2nf0cb9.webp', 'sg-11134202-7qven-lkgdo1p2nf0cb9'),
(14, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qvdt-lkgdo11hsybk88.webp', 'sg-11134202-7qvdt-lkgdo11hsybk88'),
(15, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rccw-lttgq6owgcir03.webp', 'sg-11134201-7rccw-lttgq6owgcir03'),
(16, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdm-lttgq7jf7ocnea.webp', 'sg-11134201-7rcdm-lttgq7jf7ocnea'),
(17, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdt-lttgq8y75dex6f.webp', 'sg-11134201-7rcdt-lttgq8y75dex6f'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(21, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(22, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(24, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(25, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(26, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(27, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(29, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(30, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(31, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(32, 'https://down-vn.img.susercontent.com/file/7bc6edacef61dc4d61d86914eeed6b99.webp', '7bc6edacef61dc4d61d86914eeed6b99'),
(33, 'https://down-vn.img.susercontent.com/file/15c1582279c507254d02b868d8369919.webp', '15c1582279c507254d02b868d8369919'),
(34, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qven-lkgdo1p2nf0cb9.webp', 'sg-11134202-7qven-lkgdo1p2nf0cb9'),
(35, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qvdt-lkgdo11hsybk88.webp', 'sg-11134202-7qvdt-lkgdo11hsybk88'),
(36, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rccw-lttgq6owgcir03.webp', 'sg-11134201-7rccw-lttgq6owgcir03'),
(37, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdm-lttgq7jf7ocnea.webp', 'sg-11134201-7rcdm-lttgq7jf7ocnea'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdt-lttgq8y75dex6f.webp', 'sg-11134201-7rcdt-lttgq8y75dex6f'),
(39, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(40, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(41, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(46, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(48, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(49, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(50, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(51, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(52, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(10, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(11, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(12, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(13, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(14, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(15, 'https://down-vn.img.susercontent.com/file/7bc6edacef61dc4d61d86914eeed6b99.webp', '7bc6edacef61dc4d61d86914eeed6b99'),
(16, 'https://down-vn.img.susercontent.com/file/15c1582279c507254d02b868d8369919.webp', '15c1582279c507254d02b868d8369919'),
(17, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qven-lkgdo1p2nf0cb9.webp', 'sg-11134202-7qven-lkgdo1p2nf0cb9'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qvdt-lkgdo11hsybk88.webp', 'sg-11134202-7qvdt-lkgdo11hsybk88'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rccw-lttgq6owgcir03.webp', 'sg-11134201-7rccw-lttgq6owgcir03'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdm-lttgq7jf7ocnea.webp', 'sg-11134201-7rcdm-lttgq7jf7ocnea'),
(21, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdt-lttgq8y75dex6f.webp', 'sg-11134201-7rcdt-lttgq8y75dex6f'),
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(10, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(11, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(12, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(13, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(14, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(15, 'https://down-vn.img.susercontent.com/file/7bc6edacef61dc4d61d86914eeed6b99.webp', '7bc6edacef61dc4d61d86914eeed6b99'),
(16, 'https://down-vn.img.susercontent.com/file/15c1582279c507254d02b868d8369919.webp', '15c1582279c507254d02b868d8369919'),
(17, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qven-lkgdo1p2nf0cb9.webp', 'sg-11134202-7qven-lkgdo1p2nf0cb9'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qvdt-lkgdo11hsybk88.webp', 'sg-11134202-7qvdt-lkgdo11hsybk88'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rccw-lttgq6owgcir03.webp', 'sg-11134201-7rccw-lttgq6owgcir03'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdm-lttgq7jf7ocnea.webp', 'sg-11134201-7rcdm-lttgq7jf7ocnea'),
(21, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdt-lttgq8y75dex6f.webp', 'sg-11134201-7rcdt-lttgq8y75dex6f'),
(22, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(24, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(25, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(26, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(27, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(29, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(30, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(31, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53'),
(32, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvet-ljfltsf9ujih92.webp', 'sg-11134201-7qvet-ljfltsf9ujih92'),
(33, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6ovsm5b4.webp', 'cn-11134207-7r98o-ln3y0n6ovsm5b4'),
(34, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyp3osde9.webp', 'cn-11134207-7r98o-lkkpvyyp3osde9'),
(35, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lkkpvyyf43b0e2.webp', 'cn-11134207-7r98o-lkkpvyyf43b0e2'),
(36, 'https://down-vn.img.susercontent.com/file/7bc6edacef61dc4d61d86914eeed6b99.webp', '7bc6edacef61dc4d61d86914eeed6b99'),
(37, 'https://down-vn.img.susercontent.com/file/15c1582279c507254d02b868d8369919.webp', '15c1582279c507254d02b868d8369919'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qven-lkgdo1p2nf0cb9.webp', 'sg-11134202-7qven-lkgdo1p2nf0cb9'),
(39, 'https://down-vn.img.susercontent.com/file/sg-11134202-7qvdt-lkgdo11hsybk88.webp', 'sg-11134202-7qvdt-lkgdo11hsybk88'),
(40, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rccw-lttgq6owgcir03.webp', 'sg-11134201-7rccw-lttgq6owgcir03'),
(41, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdm-lttgq7jf7ocnea.webp', 'sg-11134201-7rcdm-lttgq7jf7ocnea'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdt-lttgq8y75dex6f.webp', 'sg-11134201-7rcdt-lttgq8y75dex6f'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4z-lva2qtupkq0w0b.webp', 'sg-11134201-7rd4z-lva2qtupkq0w0b'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5f-lva2quz7xfsr60.webp', 'sg-11134201-7rd5f-lva2quz7xfsr60'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd40-lva2qvwskb5f91.webp', 'sg-11134201-7rd40-lva2qvwskb5f91'),
(46, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd68-lva2qy45c70g54.webp', 'sg-11134201-7rd68-lva2qy45c70g54'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd60-lva2qzx2p668b7.webp', 'sg-11134201-7rd60-lva2qzx2p668b7'),
(48, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4h-lva2r1uzuuir09.webp', 'sg-11134201-7rd4h-lva2r1uzuuir09'),
(49, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5b-lva2r49ubr4pa5.webp', 'sg-11134201-7rd5b-lva2r49ubr4pa5'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6n-lva2r6c7axxz34.webp', 'sg-11134201-7rd6n-lva2r6c7axxz34'),
(51, 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvdb-ljfltrmyzyibec.webp', 'sg-11134201-7qvdb-ljfltrmyzyibec'),
(52, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ln3y0n6oue1p53.webp', 'cn-11134207-7r98o-ln3y0n6oue1p53');

INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status)
VALUES
(1, 299000, 2, 1, 50, 'ACTIVE'),
(2, 399000, 3, 2, 30, 'ACTIVE'),
(3, 249000, 1, 3, 40, 'ACTIVE'),
(4, 599000, 4, 1, 20, 'ACTIVE'),
(5, 499000, 2, 2, 15, 'INACTIVE'),
(6, 350000, 1, 3, 25, 'ACTIVE'),
(7, 450000, 3, 4, 35, 'ACTIVE'),
(8, 290000, 1, 2, 60, 'ACTIVE'),
(9, 550000, 2, 1, 20, 'INACTIVE'),
(10, 720000, 4, 3, 10, 'ACTIVE'),
(11, 299000, 1, 4, 55, 'ACTIVE'),
(12, 399000, 2, 1, 30, 'ACTIVE'),
(13, 249000, 3, 2, 40, 'ACTIVE'),
(14, 599000, 4, 3, 22, 'ACTIVE'),
(15, 499000, 5, 4, 15, 'INACTIVE'),
(16, 350000, 1, 1, 20, 'ACTIVE'),
(17, 450000, 2, 2, 35, 'ACTIVE'),
(18, 290000, 3, 3, 45, 'ACTIVE'),
(19, 550000, 4, 4, 25, 'INACTIVE'),
(20, 720000, 5, 1, 18, 'ACTIVE'),
(21, 299000, 2, 1, 50, 'ACTIVE'),
(22, 399000, 3, 2, 30, 'ACTIVE'),
(23, 249000, 1, 3, 40, 'ACTIVE'),
(24, 599000, 4, 1, 20, 'ACTIVE'),
(25, 499000, 2, 2, 15, 'INACTIVE'),
(26, 350000, 1, 3, 25, 'ACTIVE'),
(27, 450000, 3, 4, 35, 'ACTIVE'),
(28, 290000, 1, 2, 60, 'ACTIVE'),
(29, 550000, 2, 1, 20, 'INACTIVE'),
(30, 720000, 4, 3, 10, 'ACTIVE'),
(31, 299000, 1, 4, 55, 'ACTIVE'),
(32, 399000, 2, 1, 30, 'ACTIVE'),
(33, 249000, 3, 2, 40, 'ACTIVE'),
(34, 599000, 4, 3, 22, 'ACTIVE'),
(35, 499000, 5, 4, 15, 'INACTIVE'),
(36, 350000, 1, 1, 20, 'ACTIVE'),
(37, 450000, 2, 2, 35, 'ACTIVE'),
(38, 290000, 3, 3, 45, 'ACTIVE'),
(39, 550000, 4, 4, 25, 'INACTIVE'),
(40, 720000, 5, 1, 18, 'ACTIVE'),
(41, 299000, 2, 1, 50, 'ACTIVE'),
(42, 399000, 3, 2, 30, 'ACTIVE'),
(43, 249000, 1, 3, 40, 'ACTIVE'),
(44, 599000, 4, 1, 20, 'ACTIVE'),
(45, 499000, 2, 2, 15, 'INACTIVE'),
(46, 350000, 1, 3, 25, 'ACTIVE'),
(47, 450000, 3, 4, 35, 'ACTIVE'),
(48, 290000, 1, 2, 60, 'ACTIVE'),
(49, 550000, 2, 1, 20, 'INACTIVE'),
(50, 720000, 4, 3, 10, 'ACTIVE'),
(51, 299000, 1, 4, 55, 'ACTIVE'),
(52, 399000, 2, 1, 30, 'ACTIVE'),
(1, 299000, 2, 1, 50, 'ACTIVE'),
(3, 399000, 3, 2, 30, 'ACTIVE'),
(5, 249000, 1, 3, 40, 'ACTIVE'),
(4, 599000, 4, 1, 20, 'ACTIVE'),
(2, 450000, 3, 4, 35, 'ACTIVE'),
(7, 290000, 1, 2, 60, 'ACTIVE'),
(9, 550000, 2, 1, 20, 'INACTIVE'),
(6, 720000, 4, 3, 10, 'ACTIVE'),
(12, 299000, 1, 4, 55, 'ACTIVE'),
(14, 399000, 2, 1, 30, 'ACTIVE'),
(15, 249000, 3, 2, 40, 'ACTIVE'),
(11, 599000, 4, 3, 22, 'ACTIVE'),
(13, 499000, 5, 4, 15, 'INACTIVE'),
(17, 350000, 1, 1, 20, 'ACTIVE'),
(19, 450000, 2, 2, 35, 'ACTIVE'),
(18, 290000, 3, 3, 45, 'ACTIVE'),
(16, 550000, 4, 4, 25, 'INACTIVE'),
(20, 720000, 5, 1, 18, 'ACTIVE'),
(21, 299000, 2, 1, 50, 'ACTIVE'),
(22, 399000, 3, 2, 30, 'ACTIVE'),
(23, 249000, 1, 3, 40, 'ACTIVE'),
(24, 599000, 4, 1, 20, 'ACTIVE'),
(25, 499000, 2, 2, 15, 'INACTIVE'),
(26, 350000, 1, 3, 25, 'ACTIVE'),
(27, 450000, 3, 4, 35, 'ACTIVE'),
(28, 290000, 1, 2, 60, 'ACTIVE'),
(29, 550000, 2, 1, 20, 'INACTIVE'),
(30, 720000, 4, 3, 10, 'ACTIVE'),
(31, 299000, 1, 4, 55, 'ACTIVE'),
(32, 399000, 2, 1, 30, 'ACTIVE'),
(33, 249000, 3, 2, 40, 'ACTIVE'),
(34, 599000, 4, 3, 22, 'ACTIVE'),
(35, 499000, 5, 4, 15, 'INACTIVE'),
(36, 350000, 1, 1, 20, 'ACTIVE'),
(37, 450000, 2, 2, 35, 'ACTIVE'),
(38, 290000, 3, 3, 45, 'ACTIVE'),
(39, 550000, 4, 4, 25, 'INACTIVE'),
(40, 720000, 5, 1, 18, 'ACTIVE'),
(41, 299000, 2, 1, 50, 'ACTIVE'),
(42, 399000, 3, 2, 30, 'ACTIVE'),
(43, 249000, 1, 3, 40, 'ACTIVE'),
(44, 599000, 4, 1, 20, 'ACTIVE'),
(45, 499000, 2, 2, 15, 'INACTIVE'),
(46, 350000, 1, 3, 25, 'ACTIVE'),
(47, 450000, 3, 4, 35, 'ACTIVE'),
(48, 290000, 1, 2, 60, 'ACTIVE'),
(49, 550000, 2, 1, 20, 'INACTIVE'),
(50, 720000, 4, 3, 10, 'ACTIVE'),
(51, 299000, 1, 4, 55, 'ACTIVE'),
(52, 399000, 2, 1, 30, 'ACTIVE');



