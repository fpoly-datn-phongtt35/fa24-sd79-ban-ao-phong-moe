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
    id bigint PRIMARY KEY AUTO_INCREMENT,
    street_name varchar(255),
    ward varchar(255),
    district varchar(255),
    district_id INT,
    city varchar(255),
    city_id INT
);

CREATE TABLE employees(
		id BIGINT AUTO_INCREMENT PRIMARY KEY,
		first_name VARCHAR(25),
		last_name  VARCHAR(50),
		address_id bigint,
		phone_number VARCHAR (20),
		gender enum('MALE','FEMALE','OTHER'),
		date_of_birth DATE ,
		image varchar(200),
    publicId varchar(200),
		position_id INT,
		salary_id INT,
		user_id BIGINT,
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
    publicId varchar(200),
    address_id bigint UNIQUE,
    user_id BIGINT,
    created_at datetime,
    updated_at datetime
);

CREATE TABLE customer_address (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    street_name varchar(255),
    ward varchar(255),
    district varchar(255),
	  district_id INT,
    city varchar(255),
	  city_id INT
);

-- Product
CREATE TABLE categories(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100),
	created_by BIGINT,
	updated_by BIGINT,
	create_at DATETIME,
	update_at DATETIME,
	is_deleted BIT DEFAULT 0
);

CREATE TABLE brands(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100),
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
	name VARCHAR(100),
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
	name VARCHAR(100),
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

-- Coupons
CREATE TABLE coupons (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE,
  name VARCHAR(100) NOT NULL,
  discount_type ENUM('FIXED_AMOUNT', 'PERCENTAGE'),
  discount_value DECIMAL(15,0),
  max_value DECIMAL(15,0),
  conditions DECIMAL(15,0),
  quantity INT,
  usage_count INT,
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

CREATE TABLE coupon_images(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  coupon_id BIGINT,
  image_url VARCHAR(255),
  public_id VARCHAR(100),
  CONSTRAINT fk_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

CREATE TABLE coupon_share(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  coupon_id BIGINT,
  customer_id BIGINT,
  is_deleted BIT DEFAULT 0,
  CONSTRAINT fk_coupon_share FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  CONSTRAINT fk_customer_share FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- promotions
CREATE TABLE promotions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  code VARCHAR(20) UNIQUE,
  percent INT,
  start_date DATE,
  end_date DATE,
  note VARCHAR(255),
  created_by BIGINT,
  updated_by BIGINT,
  create_at DATETIME,
  update_at DATETIME,
  is_deleted BIT DEFAULT 0
);

CREATE TABLE promotion_details(
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT,
  promotion_id INT
);

-- bill
CREATE TABLE bill_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(55),
	status ENUM(
    'PENDING',
    'PENDING_CONFIRMATION',
		'CONFIRMED', 
    'SHIPPED', 
    'DELIVERED', 
    'DELIVERY_FAILED',
    'CANCELED',
		'COMPLETED',
    'OTHER'
	),
  description TEXT
);

CREATE TABLE bill (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10),
  bank_code VARCHAR(255),
  customer_id BIGINT,
  coupon_id BIGINT,
  bill_status_id INT,
  shipping DECIMAL(15, 0),
  subtotal DECIMAL(15,0),
  seller_discount DECIMAL(15,0),
  total DECIMAL(15, 0),
  payment_method ENUM('CASH','BANK','CASH_ON_DELIVERY'),
  message VARCHAR(255),
  note VARCHAR(255),
  payment_time DATETIME,
  created_by BIGINT,
  updated_by BIGINT,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BIT DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (bill_status_id) REFERENCES bill_status(id)
);

CREATE TABLE bill_detail (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_detail_id BIGINT,
  bill_id BIGINT,
  quantity INT,
  retail_price DECIMAL(15, 0),  
  discount_amount DECIMAL(15, 0), 
  total_amount_product DECIMAL(15, 0), 
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_detail_id) REFERENCES product_details(id),
  FOREIGN KEY (bill_id) REFERENCES bill(id) ON DELETE CASCADE
);

CREATE TABLE bill_status_detail (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  bill_id BIGINT,
  bill_status_id INT,
  note TEXT,
  created_by BIGINT,
  updated_by BIGINT,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted BIT DEFAULT 0,
  FOREIGN KEY (bill_id) REFERENCES bill(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_status_id) REFERENCES bill_status(id)
);

CREATE TABLE support (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	hoTen VARCHAR(50),
	email VARCHAR(50),
	sdt VARCHAR(15),
	issue_description TEXT,
	status INT,
	created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	resolved_date TIMESTAMP
);




-- Employee
ALTER TABLE employees ADD CONSTRAINT fk_employee_address_id FOREIGN KEY (address_id) REFERENCES employee_address(id);

ALTER TABLE employees ADD CONSTRAINT fk_position_id FOREIGN KEY (position_id) REFERENCES positions(id);

ALTER TABLE employees ADD CONSTRAINT fk_salary_id FOREIGN KEY (salary_id) REFERENCES salary(id);

ALTER TABLE employees ADD CONSTRAINT fk_employees_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- Customer
ALTER TABLE customers ADD CONSTRAINT fk_customer_address FOREIGN KEY (address_id) REFERENCES customer_address(id);

ALTER TABLE customers ADD CONSTRAINT fk_customers_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- Product
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES categories(id);

ALTER TABLE products ADD CONSTRAINT fk_products_brand_id FOREIGN KEY (brand_id) REFERENCES brands(id);

ALTER TABLE products ADD CONSTRAINT fk_products_material_id FOREIGN KEY (material_id) REFERENCES materials(id);

ALTER TABLE product_images ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_size_id FOREIGN KEY (size_id) REFERENCES sizes(id);

ALTER TABLE product_details ADD CONSTRAINT fk_product_details_color_id FOREIGN KEY (color_id) REFERENCES colors(id);

ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- promotions
ALTER TABLE promotion_details ADD CONSTRAINT fk_promotion_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE promotion_details ADD CONSTRAINT fk_promotion_id FOREIGN KEY (promotion_id) REFERENCES promotions(id);

-- ROLE --
INSERT INTO roles (name, created_at, updated_at)
VALUES
('ADMIN', NOW(), NOW()),
('USER', NOW(), NOW()),
('GUEST', NOW(), NOW());

-- User System
INSERT INTO users (username, email, password, role_id, is_locked, is_enabled, created_at, updated_at, is_deleted)
VALUES
('...', 'admin@moe.vn', '$2a$12$ypc6KO9e7Re1GxDI3gfLf.mrSSma89BjKBm9GH96falWrIO56cxI.', 1, 0, 0, NOW(), NOW(), 0);

-- Support
INSERT INTO support (hoTen, email, sdt, issue_description, status)
VALUES 
('Nguyen Van A', 'nguyenvana@example.com', '0123456789', 'Vấn đề với đơn hàng', 0),
('Tran Thi B', 'tranthib@example.com', '0987654321', 'Lỗi hệ thống khi thanh toán', 0),
('Le Minh C', 'leminhc@example.com', '0912345678', 'Yêu cầu hỗ trợ về sản phẩm', 1);

-- Insert data into employee
INSERT INTO positions (name, created_at, updated_at)
VALUES
('Quản lý', NOW(), NOW()),
('Nhân viên', NOW(), NOW());

INSERT INTO employee_address (street_name, ward, district, district_id, city, city_id)
VALUES
('81 Trung Kính', 'Phường Trung Hoà', 'Quận Cầu Giấy', 5, 'Thành phố Hà Nội', 1);

INSERT INTO salary (amount, created_at, updated_at)
VALUES
(1000000, NOW(), NOW()),
(1000000, NOW(), NOW());

INSERT INTO employees (first_name, last_name, address_id, phone_number, gender, date_of_birth, image, publicId, position_id, salary_id, user_id, created_at, updated_at)
VALUES
('system', 'admin', 1, '0123456789', 'OTHER', '2004-12-01', 'https://th.bing.com/th/id/OIP.O2j8k6g1NTAM0t_mIqOBtQHaE7?rs=1&pid=ImgDetMain', 'publicIdNotFound', 1, 1, 1, NOW(), NOW());

-- Insert data into categories
INSERT INTO categories (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Áo thun', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Áo khoác', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Áo phông', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Áo ba lỗ', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
('Áo sơ mi', 1, 1, '2023-09-29 16:00:00', '2023-09-29 16:00:00', 0);

-- Insert data into brands
INSERT INTO brands (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Nike', 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('Adidas', 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('Gucci', 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('Louis Vuitton', 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('Chanel', 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0),
('Prada', 1, 1, '2023-09-30 14:00:00', '2023-09-30 14:00:00', 0),
('Versace', 1, 1, '2023-10-01 15:00:00', '2023-10-01 15:00:00', 0),
('Burberry', 1, 1, '2023-10-02 16:00:00', '2023-10-02 16:00:00', 0),
('H&M', 1, 1, '2023-10-03 17:00:00', '2023-10-03 17:00:00', 0),
('Zara', 1, 1, '2023-10-04 18:00:00', '2023-10-04 18:00:00', 0);

-- Insert data into materials
INSERT INTO materials (name, created_by, updated_by, create_at, update_at, is_deleted)
VALUES
('Vải Cotton', 1, 1, '2023-09-25 10:30:00', '2023-09-25 10:30:00', 0),
('Vải Polyester', 1, 1, '2023-09-26 11:00:00', '2023-09-26 11:00:00', 0),
('Vải Denim', 1, 1, '2023-09-27 14:00:00', '2023-09-27 14:00:00', 0),
('Vải Lụa', 1, 1, '2023-09-28 15:00:00', '2023-09-28 15:00:00', 0),
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
('Màu Đỏ', '#FF0000', 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00', 0),
('Xanh Dương', '#0000FF', 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00', 0),
('Màu Đen', '#000000', 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00', 0),
('Màu Trắng', '#FFFFFF', 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00', 0),
('Màu Vàng', '#FFFF00', 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00', 0);

INSERT INTO products (name, description, status, category_id, brand_id, material_id, origin, created_by, updated_by, create_at, update_at)
VALUES
('Áo Thun Nam Nữ Unisex Cổ Tròn Form Rộng Chất Liệu Cotton Thoáng Mát Phù Hợp Cho Mọi Hoạt Động Hàng Ngày, Phối Đồ Dễ Dàng Với Quần Jeans Hoặc Quần Kaki, Màu Sắc Tươi Sáng', 
'🌞 Áo thun nam nữ unisex với thiết kế cổ tròn, form rộng thoải mái, chất liệu cotton thấm hút mồ hôi, phù hợp với mọi hoạt động như đi chơi, đi làm, hoặc đi gym. 💪\n✔️ Chất liệu cotton 100% mềm mại, thoáng mát.\n✔️ Dễ dàng phối đồ với quần jeans, quần kaki. 👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-25 09:30:00', '2023-09-25 09:30:00'),
('Áo Thun Cổ Tròn Phong Cách Thời Trang Mới Cho Nam Nữ Chất Liệu Cotton 100%, Màu Sắc Đơn Giản Dễ Phối, Phù Hợp Cho Mọi Dịp Hàng Ngày, Sản Phẩm Có Độ Bền Cao', 
'🎨 Áo thun cổ tròn nam nữ với thiết kế đơn giản, màu sắc trung tính dễ phối hợp với bất kỳ trang phục nào. 🌿\n🧵 Chất liệu cotton 100% giúp thoáng mát, dễ chịu.\n💡 Thích hợp cho mọi dịp từ đi học đến dạo phố, tạo phong cách trẻ trung, năng động.', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-26 10:00:00', '2023-09-26 10:00:00'),
('Áo Thun Nữ Cổ V Không Tay Chất Liệu Cotton Mềm Mại, Thiết Kế Cổ V Thời Trang, Phù Hợp Với Nhiều Phong Cách, Chất Liệu Co Giãn Tốt, Dễ Dàng Phối Với Quần Jeans Hoặc Chân Váy', 
'✨ Áo thun nữ cổ V không tay, thiết kế hiện đại giúp bạn dễ dàng phối với quần jeans hoặc chân váy. 👗\n👌 Chất liệu cotton co giãn, thoải mái trong mọi hoạt động.\n🌺 Thiết kế tôn dáng, thích hợp cho các buổi dạo phố, đi chơi hoặc đi làm.', 
'ACTIVE', 1, 1, 3, 'Vietnam', 1, 1, '2023-09-27 11:00:00', '2023-09-27 11:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Phối Màu, Chất Liệu Cotton Cao Cấp, Thiết Kế Trẻ Trung, Phù Hợp Cho Mọi Lứa Tuổi, Được Thiết Kế Đơn Giản Nhưng Cực Kỳ Thời Trang', 
'🎨 Áo thun nam nữ cổ tròn với thiết kế phối màu sáng tạo, chất liệu cotton cao cấp, mềm mại.\n⚡ Phù hợp với nhiều lứa tuổi, dễ dàng kết hợp với các trang phục khác.\n🌟 Phong cách trẻ trung, hiện đại, rất thích hợp cho các buổi đi dạo, đi học, đi làm.', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-28 12:00:00', '2023-09-28 12:00:00'),
('Áo Thun Nữ Cổ Tròn Phong Cách Đơn Giản, Chất Liệu Cotton Thoáng Mát, Dễ Dàng Kết Hợp Với Quần Jeans, Váy Hay Quần Short, Thích Hợp Cho Mọi Hoạt Động Hàng Ngày', 
'🌸 Áo thun nữ cổ tròn đơn giản, dễ dàng phối với quần jeans, váy hay quần short.\n✅ Chất liệu cotton thoáng mát, tạo cảm giác dễ chịu suốt cả ngày dài.\n🔝 Phù hợp cho mọi hoạt động từ đi học, đi làm đến đi chơi cùng bạn bè. 🏞️', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-09-29 13:00:00', '2023-09-29 13:00:00'),
('Áo Thun Nam In Hình Thời Trang Hàn Quốc, Thiết Kế Cổ Tròn, Chất Liệu Cotton Co Giãn Tốt, Dễ Dàng Phối Với Quần Jeans Hoặc Quần Kaki, Phù Hợp Với Những Ngày Dạo Phố', 
'🌆 Áo thun nam in hình phong cách Hàn Quốc, cổ tròn thời trang, chất liệu cotton co giãn.\n🔥 Phù hợp với phong cách đường phố, dễ dàng phối với quần jeans hoặc quần kaki.\n⚡ Thích hợp cho các ngày dạo phố, gặp gỡ bạn bè hoặc đi học.', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-09-30 14:00:00', '2023-09-30 14:00:00'),
('Áo Thun Oversize Nữ Trơn, Chất Liệu Cotton Mềm Mại, Dễ Dàng Phối Với Quần Jeans Hoặc Quần Short, Phù Hợp Với Mọi Hoạt Động Hàng Ngày, Màu Sắc Tươi Tắn', 
'💖 Áo thun oversize nữ trơn với chất liệu cotton mềm mại, thoáng mát.\n⚡ Dễ dàng phối với quần jeans, quần short, tạo phong cách trẻ trung, năng động.\n🌟 Phù hợp cho mọi hoạt động từ đi học, đi chơi đến các buổi gặp gỡ bạn bè. 👯', 
'ACTIVE', 1, 1, 3, 'Vietnam', 1, 1, '2023-10-01 15:00:00', '2023-10-01 15:00:00'),
('Áo Thun Nam Nữ Basic Phong Cách Minimalist, Chất Liệu Cotton Cao Cấp, Thiết Kế Đơn Giản Nhưng Vẫn Thời Trang, Dễ Dàng Kết Hợp Với Quần Jeans, Chân Váy', 
'👚 Áo thun nam nữ basic, thiết kế minimalist, chất liệu cotton cao cấp mềm mại.\n✔️ Phù hợp cho những bạn yêu thích sự đơn giản, dễ dàng phối với quần jeans hoặc chân váy.\n🎯 Lựa chọn hoàn hảo cho phong cách trẻ trung, thanh lịch. 🌼', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-02 16:00:00', '2023-10-02 16:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Form Rộng, Chất Liệu Cotton Co Giãn, Thiết Kế Thoải Mái, Phù Hợp Cho Mọi Dịp, Từ Đi Chơi Đến Đi Làm, Có Nhiều Màu Sắc Tươi Sáng Để Lựa Chọn', 
'🌟 Áo thun nam nữ cổ tròn form rộng, chất liệu cotton co giãn, thoải mái.\n🧑‍🦱 Thiết kế thoải mái, dễ dàng kết hợp với nhiều trang phục khác nhau.\n🌈 Nhiều màu sắc cho bạn thoải mái lựa chọn, phù hợp cho mọi dịp từ đi chơi đến đi làm. 🏙️', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-03 17:00:00', '2023-10-03 17:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Phong Cách Thể Thao, Chất Liệu Cotton Mềm Mại, Dễ Dàng Kết Hợp Với Quần Jeans Hoặc Quần Short, Phù Hợp Với Mọi Hoạt Động Ngoài Trời', 
'🏃‍♂️ Áo thun nam nữ cổ tròn, thiết kế thể thao năng động, chất liệu cotton mềm mại, thấm hút mồ hôi tốt.\n🌞 Phù hợp cho các hoạt động thể thao hoặc dạo phố.\n💯 Có thể phối với quần jeans hoặc quần short tùy thích. 👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-04 18:00:00', '2023-10-04 18:00:00'),
('Áo Thun Nữ Cổ Tròn Basic Phong Cách Minimalist, Chất Liệu Cotton Mát Mẻ, Dễ Dàng Phối Với Quần Jeans, Váy Hoặc Quần Short', 
'🌿 Áo thun nữ cổ tròn basic, phong cách minimalist với chất liệu cotton mát mẻ, thoải mái.\n👗 Phù hợp với nhiều phong cách, có thể kết hợp với quần jeans, váy hay quần short.\n🌟 Thiết kế đơn giản nhưng vẫn tạo nên phong cách trẻ trung, hiện đại.', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-05 19:00:00', '2023-10-05 19:00:00'),
('Áo Thun Nam Nữ Cổ Tròn In Hình Thời Trang, Chất Liệu Cotton Mềm Mại, Phù Hợp Với Mọi Hoạt Động Hàng Ngày, Đặc Biệt Là Dạo Phố', 
'🎨 Áo thun nam nữ cổ tròn với thiết kế in hình nổi bật, chất liệu cotton mềm mại, thoáng mát.\n🔝 Phù hợp cho mọi hoạt động ngoài trời như dạo phố, gặp gỡ bạn bè.\n🌈 Màu sắc tươi sáng, dễ dàng kết hợp với nhiều loại trang phục khác nhau. 👚', 
'ACTIVE', 1, 1, 3, 'Vietnam', 1, 1, '2023-10-06 20:00:00', '2023-10-06 20:00:00'),
('Áo Thun Nữ Cổ Tròn Họa Tiết Dáng Rộng, Chất Liệu Cotton Co Giãn, Phù Hợp Cho Mọi Dịp, Từ Đi Chơi Đến Đi Làm, Màu Sắc Tươi Sáng', 
'🌸 Áo thun nữ cổ tròn với họa tiết đặc biệt, chất liệu cotton co giãn dễ chịu.\n🎉 Thiết kế dáng rộng thoải mái, dễ dàng phối với quần jeans, quần short.\n💥 Phù hợp cho các dịp đi chơi, đi làm, hoặc đi dạo phố. 💃', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-07 21:00:00', '2023-10-07 21:00:00'),
('Áo Thun Nam In Hình Phong Cách Đường Phố, Chất Liệu Cotton Co Giãn Tốt, Phù Hợp Với Quần Jeans, Quần Kaki Hoặc Quần Short', 
'🌆 Áo thun nam in hình phong cách đường phố, thiết kế trẻ trung, chất liệu cotton co giãn.\n🎨 Dễ dàng kết hợp với quần jeans, quần kaki hoặc quần short.\n🔥 Phù hợp cho các buổi đi chơi, đi học, hoặc dạo phố cùng bạn bè. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-08 22:00:00', '2023-10-08 22:00:00'),
('Áo Thun Nữ Trơn, Cổ Tròn Đơn Giản, Chất Liệu Cotton Mềm Mại, Phù Hợp Cho Mọi Lứa Tuổi, Màu Sắc Tươi Sáng, Dễ Dàng Kết Hợp Với Quần Short Hoặc Chân Váy', 
'💖 Áo thun nữ trơn cổ tròn, chất liệu cotton mềm mại, tạo cảm giác thoải mái suốt cả ngày.\n✨ Thiết kế đơn giản nhưng vẫn rất thời trang, dễ dàng kết hợp với quần short hoặc chân váy.\n🌞 Màu sắc tươi sáng, dễ dàng phối đồ cho mọi lứa tuổi. 👗', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-09 23:00:00', '2023-10-09 23:00:00'),
('Áo Thun Nam Nữ Cổ Tròn, Chất Liệu Cotton 100%, Dễ Dàng Phối Với Quần Kaki Hoặc Quần Jeans, Thiết Kế Tinh Tế Và Thoải Mái', 
'👚 Áo thun nam nữ cổ tròn, chất liệu cotton 100%, thoải mái và dễ chịu.\n✨ Thiết kế đơn giản, phù hợp với mọi lứa tuổi và dễ dàng phối với quần kaki hoặc quần jeans.\n🎯 Thích hợp cho nhiều dịp, từ đi học, đi làm đến dạo phố. 🏙️', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-10 00:00:00', '2023-10-10 00:00:00'),
('Áo Thun Nam Nữ Oversize, Cổ Tròn, Chất Liệu Cotton Co Giãn, Phù Hợp Với Nhiều Phong Cách Thời Trang, Từ Đi Chơi Đến Đi Làm', 
'🎯 Áo thun nam nữ oversize, cổ tròn, chất liệu cotton co giãn.\n💫 Thiết kế thoải mái, phù hợp với nhiều phong cách thời trang, dễ dàng phối với quần jeans, quần kaki.\n🌞 Phù hợp cho mọi dịp từ đi chơi, dạo phố đến đi làm. 🌟', 
'ACTIVE', 1, 1, 3, 'Vietnam', 1, 1, '2023-10-11 01:00:00', '2023-10-11 01:00:00'),
('Áo Thun Nữ In Hình Thời Trang, Cổ Tròn, Chất Liệu Cotton Mềm Mại, Dễ Dàng Phối Với Quần Jeans Hoặc Chân Váy, Tạo Phong Cách Trẻ Trung, Năng Động', 
'✨ Áo thun nữ in hình thời trang, cổ tròn, chất liệu cotton mềm mại, thoáng mát.\n🔥 Phù hợp cho phong cách trẻ trung, dễ dàng kết hợp với quần jeans hoặc chân váy.\n🌿 Thích hợp cho các dịp đi chơi, dạo phố, hoặc gặp gỡ bạn bè. 💃', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-12 02:00:00', '2023-10-12 02:00:00'),
('Áo Thun Nam Cổ Tròn, Chất Liệu Cotton, Màu Sắc Đơn Giản, Phù Hợp Cho Phong Cách Thời Trang Nam Tính, Dễ Dàng Kết Hợp Với Quần Jeans Hoặc Quần Kaki', 
'🧥 Áo thun nam cổ tròn, chất liệu cotton thoải mái, dễ chịu.\n👕 Màu sắc đơn giản, dễ dàng kết hợp với quần jeans hoặc quần kaki.\n🎯 Phù hợp cho phong cách thời trang nam tính, thích hợp cho đi học, đi làm hoặc dạo phố. 🏙️', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-13 03:00:00', '2023-10-13 03:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Họa Tiết Đơn Giản, Chất Liệu Cotton Thoáng Mát, Dễ Dàng Kết Hợp Với Quần Jean, Quần Kaki Hoặc Chân Váy', 
'💯 Áo thun nam nữ cổ tròn, thiết kế họa tiết đơn giản, chất liệu cotton thoáng mát.\n🌞 Phù hợp với mọi phong cách thời trang, dễ dàng kết hợp với quần jean, quần kaki hoặc chân váy.\n🎉 Tạo nên sự thoải mái, dễ chịu suốt cả ngày. 👖👗', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-14 04:00:00', '2023-10-14 04:00:00'),
('Áo Thun Nữ Oversize Phong Cách Minimalist, Chất Liệu Cotton Mềm Mại, Dễ Dàng Kết Hợp Với Quần Short Hoặc Chân Váy', 
'🌿 Áo thun nữ oversize phong cách minimalist, chất liệu cotton mềm mại.\n👚 Dễ dàng phối hợp với quần short hoặc chân váy để tạo nên phong cách trẻ trung, năng động.\n💥 Phù hợp cho các buổi dạo phố, đi chơi, hoặc thậm chí đi làm. 💃', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-15 05:00:00', '2023-10-15 05:00:00'),
('Áo Thun Nam Cổ Tròn Họa Tiết Graphic, Chất Liệu Cotton Thoáng Mát, Phù Hợp Với Mọi Phong Cách, Dễ Dàng Kết Hợp Với Quần Jeans Hoặc Quần Kaki', 
'🎨 Áo thun nam cổ tròn họa tiết graphic, chất liệu cotton thoáng mát.\n🔥 Phù hợp cho các phong cách thể thao, dạo phố, dễ dàng kết hợp với quần jeans hoặc quần kaki.\n🌟 Thiết kế độc đáo, giúp bạn nổi bật giữa đám đông. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-16 06:00:00', '2023-10-16 06:00:00'),
('Áo Thun Nữ In Hình Thời Trang, Cổ Tròn, Chất Liệu Cotton, Dễ Dàng Phối Với Quần Jean, Váy, Hoặc Quần Short', 
'💖 Áo thun nữ in hình thời trang, cổ tròn, chất liệu cotton mềm mại, dễ chịu.\n🎯 Phù hợp cho phong cách năng động, có thể phối với quần jean, váy hoặc quần short.\n✨ Màu sắc tươi sáng, thích hợp cho các buổi dạo phố, gặp gỡ bạn bè. 💃', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-17 07:00:00', '2023-10-17 07:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Basic, Chất Liệu Cotton Mát Mẻ, Phù Hợp Với Mọi Dịp, Từ Đi Làm Đến Dạo Phố', 
'🌞 Áo thun nam nữ cổ tròn basic, chất liệu cotton mát mẻ, thoải mái.\n💥 Thiết kế đơn giản, dễ dàng kết hợp với nhiều loại trang phục khác nhau như quần kaki, quần jeans.\n🎉 Thích hợp cho nhiều dịp từ đi làm đến dạo phố. 👗', 
'ACTIVE', 1, 1, 3, 'Vietnam', 1, 1, '2023-10-18 08:00:00', '2023-10-18 08:00:00'),
('Áo Thun Nam Cổ Tròn Dáng Rộng, Chất Liệu Cotton Co Giãn, Phù Hợp Cho Phong Cách Thời Trang Năng Động', 
'🌿 Áo thun nam cổ tròn dáng rộng, chất liệu cotton co giãn, dễ chịu.\n🌞 Phù hợp với phong cách năng động, có thể kết hợp với quần jeans, quần short, quần kaki.\n🎯 Thiết kế thời trang, giúp bạn tự tin trong mọi hoạt động ngoài trời. 👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-19 09:00:00', '2023-10-19 09:00:00'),
('Áo Thun Nữ In Hình Cổ Tròn, Chất Liệu Cotton Mềm Mại, Phù Hợp Cho Phong Cách Thời Trang Nữ Tính, Dễ Dàng Phối Với Quần Short', 
'🌟 Áo thun nữ in hình cổ tròn, chất liệu cotton mềm mại, thoáng mát.\n🔥 Thiết kế trẻ trung, dễ dàng phối với quần short, quần jeans hoặc chân váy.\n🎯 Phù hợp cho phong cách thời trang nữ tính, dạo phố hay đi chơi cùng bạn bè. 💃', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-20 10:00:00', '2023-10-20 10:00:00'),
('Áo Thun Nam In Hình Phong Cách Thể Thao, Cổ Tròn, Chất Liệu Cotton, Dễ Dàng Phối Với Quần Jeans, Kaki, Phù Hợp Cho Mọi Dịp', 
'⚽ Áo thun nam in hình phong cách thể thao, cổ tròn, chất liệu cotton co giãn.\n🔥 Phù hợp cho phong cách thể thao hoặc dạo phố, dễ dàng kết hợp với quần jeans, quần kaki.\n🎉 Thiết kế năng động, phù hợp cho mọi hoạt động ngoài trời. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-21 11:00:00', '2023-10-21 11:00:00'),
('Áo Thun Nữ Trơn, Cổ Tròn Đơn Giản, Chất Liệu Cotton Mềm Mại, Phù Hợp Với Quần Short, Váy Hoặc Quần Jeans', 
'💖 Áo thun nữ trơn cổ tròn, chất liệu cotton mềm mại, tạo cảm giác dễ chịu suốt cả ngày.\n🌿 Thiết kế đơn giản nhưng tinh tế, dễ dàng kết hợp với quần short, váy hoặc quần jeans.\n🎯 Thích hợp cho phong cách năng động và trẻ trung. 👗', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-22 12:00:00', '2023-10-22 12:00:00'),
('Áo Thun Nam Cổ Tròn Chất Liệu Cotton, Màu Trơn, Dễ Dàng Phối Với Quần Jeans, Quần Kaki, Tạo Phong Cách Nam Tính', 
'👕 Áo thun nam cổ tròn, chất liệu cotton co giãn, dễ chịu.\n🔥 Màu sắc đơn giản, dễ dàng kết hợp với quần jeans, quần kaki để tạo nên phong cách nam tính.\n🌟 Phù hợp cho mọi dịp, từ đi làm đến dạo phố. 🎯', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-23 13:00:00', '2023-10-23 13:00:00'),
('Áo Thun Nam Nữ Cổ Tròn Chất Liệu Cotton Mềm Mại, Phù Hợp Với Quần Jean, Quần Kaki, Chân Váy, Thời Trang Hàng Ngày', 
'💥 Áo thun nam nữ cổ tròn, chất liệu cotton mềm mại, thoải mái.\n🌞 Dễ dàng kết hợp với quần jean, quần kaki, chân váy, tạo phong cách thời trang hàng ngày.\n✨ Phù hợp cho nhiều dịp, từ đi làm, đi chơi đến dạo phố. 👗👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-24 14:00:00', '2023-10-24 14:00:00'),
('Áo Thun Nam In Hình, Phong Cách Thể Thao, Chất Liệu Cotton, Phù Hợp Với Phong Cách Dạo Phố, Quần Jeans, Quần Kaki', 
'⚽ Áo thun nam in hình thể thao, chất liệu cotton co giãn, thoải mái.\n🔥 Phù hợp với phong cách thể thao hoặc dạo phố, dễ dàng phối với quần jeans, quần kaki.\n🎯 Thiết kế năng động, giúp bạn nổi bật trong các hoạt động ngoài trời. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-25 15:00:00', '2023-10-25 15:00:00'),
('Áo Thun Nữ Oversize, Cổ Tròn Đơn Giản, Chất Liệu Cotton Mềm Mại, Dễ Dàng Kết Hợp Với Quần Jean, Quần Kaki', 
'🌿 Áo thun nữ oversize, cổ tròn đơn giản, chất liệu cotton mềm mại.\n🎯 Phù hợp cho các phong cách thời trang tối giản, dễ dàng kết hợp với quần jean, quần kaki.\n💖 Tạo sự thoải mái suốt cả ngày. 👚', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-26 16:00:00', '2023-10-26 16:00:00'),
('Áo Thun Nam Cổ Tròn Basic, Chất Liệu Cotton, Màu Trơn, Phù Hợp Với Phong Cách Thời Trang Nam Tính', 
'💥 Áo thun nam cổ tròn basic, chất liệu cotton co giãn, dễ chịu.\n🌟 Màu sắc trơn, dễ dàng kết hợp với các trang phục khác như quần kaki, quần jeans.\n🎯 Tạo phong cách nam tính, trẻ trung, năng động. 👖👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-27 17:00:00', '2023-10-27 17:00:00'),
('Áo Thun Nữ Chất Liệu Cotton, Cổ Tròn, Màu Sắc Tươi Sáng, Thích Hợp Cho Phong Cách Thời Trang Nữ Tính', 
'💖 Áo thun nữ cổ tròn, chất liệu cotton mềm mại, thoáng mát.\n🌿 Màu sắc tươi sáng, dễ dàng kết hợp với quần jeans, váy hoặc quần short.\n🎯 Phù hợp với phong cách nữ tính, dễ thương. 👗', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-28 18:00:00', '2023-10-28 18:00:00'),
('Áo Thun Nam Cổ Tròn, In Hình Phong Cách, Chất Liệu Cotton, Dễ Dàng Kết Hợp Với Quần Jeans, Quần Kaki, Phù Hợp Cho Mọi Dịp', 
'🎨 Áo thun nam cổ tròn, in hình phong cách, chất liệu cotton co giãn.\n💥 Dễ dàng kết hợp với quần jeans, quần kaki để tạo phong cách thể thao hoặc dạo phố.\n🌟 Thích hợp cho mọi dịp từ đi làm đến đi chơi cùng bạn bè. 👟👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-29 19:00:00', '2023-10-29 19:00:00'),
('Áo Thun Nữ Basic, Cổ Tròn, Chất Liệu Cotton Mềm Mại, Dễ Dàng Kết Hợp Với Quần Short, Váy, Quần Jeans', 
'💯 Áo thun nữ basic, cổ tròn, chất liệu cotton mềm mại, dễ chịu.\n🎯 Dễ dàng kết hợp với quần short, váy hoặc quần jeans để tạo phong cách thời trang nữ tính, thoải mái.\n✨ Thích hợp cho mọi dịp, từ đi làm đến dạo phố. 👗', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-10-30 20:00:00', '2023-10-30 20:00:00'),
('Áo Thun Nam In Hình Cổ Tròn, Phong Cách Thể Thao, Chất Liệu Cotton Mát Mẻ, Dễ Dàng Phối Với Quần Jeans', 
'🔥 Áo thun nam in hình thể thao, cổ tròn, chất liệu cotton mát mẻ.\n💥 Phù hợp với phong cách thể thao, dễ dàng kết hợp với quần jeans hoặc quần kaki.\n🎯 Thiết kế năng động, giúp bạn nổi bật trong mọi hoạt động ngoài trời. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-10-31 21:00:00', '2023-10-31 21:00:00'),
('Áo Thun Nữ Cổ Tròn, In Hình Độc Đáo, Chất Liệu Cotton, Phù Hợp Với Phong Cách Dạo Phố, Quần Short, Váy', 
'🎨 Áo thun nữ cổ tròn, in hình độc đáo, chất liệu cotton co giãn.\n🌿 Phù hợp cho phong cách dạo phố, dễ dàng kết hợp với quần short, quần jeans hoặc váy.\n💖 Thiết kế trẻ trung, giúp bạn nổi bật giữa đám đông. 👗', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-01 22:00:00', '2023-11-01 22:00:00'),
('Áo Thun Nam Cổ Tròn Họa Tiết Thể Thao, Chất Liệu Cotton, Dễ Dàng Kết Hợp Với Quần Jeans, Quần Kaki, Tạo Phong Cách Mạnh Mẽ', 
'🔥 Áo thun nam cổ tròn, họa tiết thể thao, chất liệu cotton co giãn.\n🌟 Tạo phong cách mạnh mẽ, dễ dàng kết hợp với quần jeans hoặc quần kaki.\n💥 Phù hợp cho các hoạt động thể thao, dạo phố hoặc đi chơi. 👟👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-02 23:00:00', '2023-11-02 23:00:00'),
('Áo Thun Nam Cổ Tròn Màu Đen Trơn, Chất Liệu Cotton Mềm Mại, Phù Hợp Với Quần Jeans, Quần Kaki, Phong Cách Lịch Lãm', 
'🖤 Áo thun nam cổ tròn, màu đen trơn, chất liệu cotton mềm mại.\n🎯 Dễ dàng kết hợp với quần jeans hoặc quần kaki, tạo phong cách lịch lãm, sang trọng.\n✨ Thích hợp cho mọi dịp, từ đi làm đến đi chơi. 👖👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-03 10:00:00', '2023-11-03 10:00:00'),
('Áo Thun Nữ Cổ Tròn Trơn Màu Trắng, Chất Liệu Cotton, Dễ Dàng Kết Hợp Với Quần Jean, Váy, Phong Cách Nữ Tính', 
'💖 Áo thun nữ cổ tròn trơn màu trắng, chất liệu cotton mềm mại.\n🌿 Phù hợp với phong cách nữ tính, dễ dàng kết hợp với quần jean, váy hoặc quần short.\n🎯 Tạo sự thoải mái suốt cả ngày. 👗👖', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-04 11:00:00', '2023-11-04 11:00:00'),
('Áo Thun Nam Phong Cách Thể Thao, Chất Liệu Cotton, Cổ Tròn, In Hình Phong Cách, Dễ Dàng Kết Hợp Với Quần Jeans', 
'🔥 Áo thun nam cổ tròn, chất liệu cotton co giãn.\n🎨 In hình phong cách thể thao nổi bật, dễ dàng kết hợp với quần jeans.\n💥 Phù hợp với các hoạt động thể thao hoặc đi dạo phố. 👟👖', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-05 12:00:00', '2023-11-05 12:00:00'),
('Áo Thun Nữ Họa Tiết Cổ Tròn, Chất Liệu Cotton, Thích Hợp Với Phong Cách Thời Trang Nữ Tính, Quần Jeans', 
'🌸 Áo thun nữ cổ tròn, họa tiết dễ thương, chất liệu cotton thoáng mát.\n🌿 Phù hợp với phong cách thời trang nữ tính, dễ dàng kết hợp với quần jeans hoặc váy.\n✨ Thích hợp cho nhiều dịp từ đi làm đến đi chơi. 👗👖', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-06 13:00:00', '2023-11-06 13:00:00'),
('Áo Thun Nam Basic Cổ Tròn, Chất Liệu Cotton Mềm Mại, Màu Sắc Trơn, Phù Hợp Với Phong Cách Thời Trang Nam Tính', 
'💥 Áo thun nam cổ tròn, chất liệu cotton mềm mại, thoải mái.\n🌟 Màu sắc trơn dễ dàng kết hợp với các trang phục khác.\n🎯 Phù hợp với phong cách nam tính, năng động, dễ dàng sử dụng cho mọi dịp. 👖👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-07 14:00:00', '2023-11-07 14:00:00'),
('Áo Thun Nữ Cổ Tròn, Chất Liệu Cotton Mềm Mại, Màu Trắng Sáng, Phù Hợp Với Quần Jeans, Váy, Phong Cách Nữ Tính', 
'🎯 Áo thun nữ cổ tròn, chất liệu cotton mềm mại, màu trắng sáng.\n🌸 Phù hợp với phong cách nữ tính, dễ dàng kết hợp với quần jeans hoặc váy.\n✨ Thích hợp cho mọi dịp từ đi làm đến đi chơi. 👗👖', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-08 15:00:00', '2023-11-08 15:00:00'),
('Áo Thun Nam Phong Cách Thể Thao, In Hình Độc Đáo, Chất Liệu Cotton, Phù Hợp Với Quần Jean, Quần Kaki', 
'⚽ Áo thun nam phong cách thể thao, in hình độc đáo, chất liệu cotton co giãn.\n🎯 Dễ dàng kết hợp với quần jean, quần kaki, tạo phong cách thể thao năng động.\n✨ Phù hợp với các hoạt động ngoài trời hoặc dạo phố. 👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-09 16:00:00', '2023-11-09 16:00:00'),
('Áo Thun Nữ Cổ Tròn, Chất Liệu Cotton Mềm Mại, Màu Đen Trơn, Phù Hợp Với Phong Cách Thời Trang Tối Giản', 
'💖 Áo thun nữ cổ tròn, chất liệu cotton mềm mại, màu đen trơn.\n🌟 Phù hợp với phong cách thời trang tối giản, dễ dàng kết hợp với quần jeans, váy.\n🎯 Thích hợp cho nhiều dịp từ đi làm đến đi chơi. 👗👖', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-10 17:00:00', '2023-11-10 17:00:00'),
('Áo Thun Nam Cổ Tròn Màu Xám Trơn, Chất Liệu Cotton Mềm Mại, Phù Hợp Với Quần Kaki, Quần Jeans', 
'🌿 Áo thun nam cổ tròn màu xám trơn, chất liệu cotton mềm mại.\n🎯 Dễ dàng kết hợp với quần kaki hoặc quần jeans.\n✨ Phù hợp với phong cách thời trang nam tính, năng động. 👖👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-11 18:00:00', '2023-11-11 18:00:00'),
('Áo Thun Nữ Cổ Tròn, Họa Tiết Thời Trang, Chất Liệu Cotton, Phù Hợp Với Quần Jeans, Quần Short', 
'💖 Áo thun nữ cổ tròn, họa tiết thời trang, chất liệu cotton mềm mại.\n🎨 Phù hợp với quần jeans, quần short, tạo phong cách thời trang nữ tính.\n🌟 Thích hợp cho các dịp từ đi chơi đến đi làm. 👗👖', 
'ACTIVE', 1, 1, 2, 'Vietnam', 1, 1, '2023-11-12 19:00:00', '2023-11-12 19:00:00'),
('Áo Thun Nam Cổ Tròn, Chất Liệu Cotton Mềm Mại, Màu Trắng Trơn, Phù Hợp Với Phong Cách Thời Trang Tối Giản, Dễ Dàng Kết Hợp Với Quần Kaki, Quần Jeans', 
'🌟 Áo thun nam cổ tròn, chất liệu cotton mềm mại, màu trắng trơn.\n✨ Phù hợp với phong cách thời trang tối giản, dễ dàng kết hợp với quần kaki, quần jeans.\n🎯 Thích hợp cho các dịp từ đi làm đến đi chơi. 👖👟', 
'ACTIVE', 1, 1, 1, 'Vietnam', 1, 1, '2023-11-13 20:00:00', '2023-11-13 20:00:00');

INSERT INTO product_images (product_id, image_url, public_id) VALUES
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcd2-ltuzfu2w2rkj03.webp', 'sg-11134201-7rcd2-ltuzfu2w2rkj03'),
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rce8-ltuzfqg7e0d4ef.webp', 'sg-11134201-7rce8-ltuzfqg7e0d4ef'),
(1, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcfd-ltuzfa9j2oy63b.webp', 'sg-11134201-7rcfd-ltuzfa9j2oy63b'),
(1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvrngin007ve72.webp', 'vn-11134207-7r98o-lvrngin007ve72'),
(1, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvrngin1akm286.webp', 'vn-11134207-7r98o-lvrngin1akm286'),
(2, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvrngimzkr5lad.webp', 'vn-11134207-7r98o-lvrngimzkr5lad'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw4-m0e6tlzk4u82ca.webp', 'sg-11134201-7rdw4-m0e6tlzk4u82ca'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwr-m0e6tnj1vmo44e.webp', 'sg-11134201-7rdwr-m0e6tnj1vmo44e'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvh-m0e6tp1pnn9620.webp', 'sg-11134201-7rdvh-m0e6tp1pnn9620'),
(2, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxl-m0e6trshpwhcf7.webp', 'sg-11134201-7rdxl-m0e6trshpwhcf7'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwr-m0e6tnj1vmo44e.webp', 'sg-11134201-7rdwr-m0e6tnj1vmo44e'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7repj-m2242g21yjjz1a.webp', 'sg-11134201-7repj-m2242g21yjjz1a'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rept-m2242h60aolcfe.webp', 'sg-11134201-7rept-m2242h60aolcfe'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7req4-m2242ivbsycdea.webp', 'sg-11134201-7req4-m2242ivbsycdea'),
(3, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rep5-m2242kpn3wqd43.webp', 'sg-11134201-7rep5-m2242kpn3wqd43'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reof-m2242mf8n5w0dc.webp', 'sg-11134201-7reof-m2242mf8n5w0dc'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqc-m27sdra80vr084.webp', 'sg-11134201-7reqc-m27sdra80vr084'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqb-m27sdrqlfql22f.webp', 'sg-11134201-7reqb-m27sdrqlfql22f'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reni-m27sds3cvnme43.webp', 'sg-11134201-7reni-m27sds3cvnme43'),
(4, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reo1-m27sdsfacskjbd.webp', 'sg-11134201-7reo1-m27sdsfacskjbd'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reod-m27sdssvx3vue6.webp', 'sg-11134201-7reod-m27sdssvx3vue6'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqj-m27sdt7l8s16bc.webp', 'sg-11134201-7reqj-m27sdt7l8s16bc'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rept-m27sdtkwpajnb1.webp', 'sg-11134201-7rept-m27sdtkwpajnb1'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reo8-m27sdtw07ner03.webp', 'sg-11134201-7reo8-m27sdtw07ner03'),
(5, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxg-m0mf0qu0pia13b.webp', 'sg-11134201-7rdxg-m0mf0qu0pia13b'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdww-m0mf0r4ub2rt48.webp', 'sg-11134201-7rdww-m0mf0r4ub2rt48'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxh-m0mf0rmljovkcf.webp', 'sg-11134201-7rdxh-m0mf0rmljovkcf'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxm-m0mf0rtj9jia7e.webp', 'sg-11134201-7rdxm-m0mf0rtj9jia7e'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvz-m0mf0s0gze2m33.webp', 'sg-11134201-7rdvz-m0mf0s0gze2m33'),
(6, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw4-m0e6tlzk4u82ca.webp', 'sg-11134201-7rdw4-m0e6tlzk4u82ca'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdww-m0mf0r4ub2rt48.webp', 'sg-11134201-7rdww-m0mf0r4ub2rt48'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxh-m0mf0rmljovkcf.webp', 'sg-11134201-7rdxh-m0mf0rmljovkcf'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxm-m0mf0rtj9jia7e.webp', 'sg-11134201-7rdxm-m0mf0rtj9jia7e'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvz-m0mf0s0gze2m33.webp', 'sg-11134201-7rdvz-m0mf0s0gze2m33'),
(7, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw4-m0e6tlzk4u82ca.webp', 'sg-11134201-7rdw4-m0e6tlzk4u82ca'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reof-m2242mf8n5w0dc.webp', 'sg-11134201-7reof-m2242mf8n5w0dc'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqc-m27sdra80vr084.webp', 'sg-11134201-7reqc-m27sdra80vr084'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqb-m27sdrqlfql22f.webp', 'sg-11134201-7reqb-m27sdrqlfql22f'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reni-m27sds3cvnme43.webp', 'sg-11134201-7reni-m27sds3cvnme43'),
(8, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reo1-m27sdsfacskjbd.webp', 'sg-11134201-7reo1-m27sdsfacskjbd'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reod-m27sdssvx3vue6.webp', 'sg-11134201-7reod-m27sdssvx3vue6'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqj-m27sdt7l8s16bc.webp', 'sg-11134201-7reqj-m27sdt7l8s16bc'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rept-m27sdtkwpajnb1.webp', 'sg-11134201-7rept-m27sdtkwpajnb1'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reo8-m27sdtw07ner03.webp', 'sg-11134201-7reo8-m27sdtw07ner03'),
(9, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxg-m0mf0qu0pia13b.webp', 'sg-11134201-7rdxg-m0mf0qu0pia13b'),
(10, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdww-m0mf0r4ub2rt48.webp', 'sg-11134201-7rdww-m0mf0r4ub2rt48'),
(10, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxh-m0mf0rmljovkcf.webp', 'sg-11134201-7rdxh-m0mf0rmljovkcf'),
(10, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxm-m0mf0rtj9jia7e.webp', 'sg-11134201-7rdxm-m0mf0rtj9jia7e'),
(10, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvz-m0mf0s0gze2m33.webp', 'sg-11134201-7rdvz-m0mf0s0gze2m33'),
(10, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw4-m0e6tlzk4u82ca.webp', 'sg-11134201-7rdw4-m0e6tlzk4u82ca'),
(11, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wss5wyjef339.webp', 'vn-11134207-7ras8-m1wss5wyjef339'),
(11, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wssl4o9vmb11.webp', 'vn-11134207-7ras8-m1wssl4o9vmb11'),
(11, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wss805hcur2e.webp', 'vn-11134207-7ras8-m1wss805hcur2e'),
(11, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wssj0ddjnj8b.webp', 'vn-11134207-7ras8-m1wssj0ddjnj8b'),
(11, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wssvb7ewr735.webp', 'vn-11134207-7ras8-m1wssvb7ewr735'),
(12, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wssxdad3nj3b.webp', 'vn-11134207-7ras8-m1wssxdad3nj3b'),
(12, 'https://down-vn.img.susercontent.com/file/4a853ce5cad76ce56e97acfba78d5da7.webp', '4a853ce5cad76ce56e97acfba78d5da7'),
(12, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llj12um143hy96.webp', 'vn-11134207-7r98o-llj12um143hy96'),
(12, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llj12um11ad243.webp', 'vn-11134207-7r98o-llj12um11ad243'),
(12, 'https://down-vn.img.susercontent.com/file/ac538da6bf77b64d884c4486030757bf.webp', 'ac538da6bf77b64d884c4486030757bf'),
(13, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llj12um12oxi9a.webp', 'vn-11134207-7r98o-llj12um12oxi9a'),
(13, 'https://down-vn.img.susercontent.com/file/4c52a391cc76c30f4417d6ad2406d6d2.webp', '4c52a391cc76c30f4417d6ad2406d6d2'),
(13, 'https://down-vn.img.susercontent.com/file/424ca5d0246965ab35f3ebe532f61f3b.webp', '424ca5d0246965ab35f3ebe532f61f3b'),
(13, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llj12um0zvsm09.webp', 'vn-11134207-7r98o-llj12um0zvsm09'),
(13, 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-ie262e92xjkvce.webp', 'sg-11134201-22120-ie262e92xjkvce'),
(14, 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-51740g92xjkv46.webp', 'sg-11134201-22120-51740g92xjkv46'),
(14, 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-51740g92xjkv46.webp', 'sg-11134201-22120-51740g92xjkv46'),
(14, 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-51740g92xjkv46.webp', 'sg-11134201-22120-51740g92xjkv46'),
(14, 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-51740g92xjkv46.webp', 'sg-11134201-22120-51740g92xjkv46'),
(15, 'https://down-vn.img.susercontent.com/file/sg-11134201-23010-ssjpfb16nxmv5a.webp', 'sg-11134201-23010-ssjpfb16nxmv5a'),
(15, 'https://down-vn.img.susercontent.com/file/sg-11134201-23010-ssjpfb16nxmv5a.webp', 'sg-11134201-23010-ssjpfb16nxmv5a'),
(15, 'https://down-vn.img.susercontent.com/file/sg-11134201-23010-ssjpfb16nxmv5a.webp', 'sg-11134201-23010-ssjpfb16nxmv5a'),
(16, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrtpx4n8dre4.webp', 'vn-11134207-7ras8-m0wrtpx4n8dre4'),
(16, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrut18jp678a.webp', 'vn-11134207-7ras8-m0wrut18jp678a'),
(16, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrut18jorx6b.webp', 'vn-11134207-7ras8-m0wrut18jorx6b'),
(16, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrut18ialrc0.webp', 'vn-11134207-7ras8-m0wrut18ialrc0'),
(16, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrx022y0bx39.webp', 'vn-11134207-7ras8-m0wrx022y0bx39'),
(17, 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0wrx022v7lb7e.webp', 'vn-11134207-7ras8-m0wrx022v7lb7e'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxg-m0mf0qu0pia13b.webp', 'sg-11134201-7rdxg-m0mf0qu0pia13b'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdww-m0mf0r4ub2rt48.webp', 'sg-11134201-7rdww-m0mf0r4ub2rt48'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxh-m0mf0rmljovkcf.webp', 'sg-11134201-7rdxh-m0mf0rmljovkcf'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxm-m0mf0rtj9jia7e.webp', 'sg-11134201-7rdxm-m0mf0rtj9jia7e'),
(18, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvz-m0mf0s0gze2m33.webp', 'sg-11134201-7rdvz-m0mf0s0gze2m33'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwr-m0e6tnj1vmo44e.webp', 'sg-11134201-7rdwr-m0e6tnj1vmo44e'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7repj-m2242g21yjjz1a.webp', 'sg-11134201-7repj-m2242g21yjjz1a'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rept-m2242h60aolcfe.webp', 'sg-11134201-7rept-m2242h60aolcfe'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7req4-m2242ivbsycdea.webp', 'sg-11134201-7req4-m2242ivbsycdea'),
(19, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rep5-m2242kpn3wqd43.webp', 'sg-11134201-7rep5-m2242kpn3wqd43'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reof-m2242mf8n5w0dc.webp', 'sg-11134201-7reof-m2242mf8n5w0dc'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqc-m27sdra80vr084.webp', 'sg-11134201-7reqc-m27sdra80vr084'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reqb-m27sdrqlfql22f.webp', 'sg-11134201-7reqb-m27sdrqlfql22f'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reni-m27sds3cvnme43.webp', 'sg-11134201-7reni-m27sds3cvnme43'),
(20, 'https://down-vn.img.susercontent.com/file/sg-11134201-7reo1-m27sdsfacskjbd.webp', 'sg-11134201-7reo1-m27sdsfacskjbd'),

(21, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-kq8pb052cqov32.webp', 'vn-11134201-23030-kq8pb052cqov32'),
(21, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-o0kofa62cqovbc.webp', 'vn-11134201-23030-o0kofa62cqovbc'),
(21, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-sgxx2452cqov3c.webp', 'vn-11134201-23030-sgxx2452cqov3c'),
(21, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-wvzo6052cqovbc.webp', 'vn-11134201-23030-wvzo6052cqovbc'),
(21, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-jtymjb62cqovaa.webp', 'vn-11134201-23030-jtymjb62cqovaa'),
(22, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-br8pb052cqov10.webp', 'vn-11134201-23030-br8pb052cqov10'),
(22, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-9kfrh952cqova5.webp', 'vn-11134201-23030-9kfrh952cqova5'),
(22, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4j-lwb1ywtkac397f.webp', 'sg-11134201-7rd4j-lwb1ywtkac397f'),
(22, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd50-lwb1yxjx7r2g44.webp', 'sg-11134201-7rd50-lwb1yxjx7r2g44'),
(22, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd63-lwbb7de1qgqja8.webp', 'sg-11134201-7rd63-lwbb7de1qgqja8'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4x-lwbb7dyawu9ba8.webp', 'sg-11134201-7rd4x-lwbb7dyawu9ba8'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6w-lwbaokm6425873.webp', 'sg-11134201-7rd6w-lwbaokm6425873'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5y-lv8jcjnnor87b2.webp', 'sg-11134201-7rd5y-lv8jcjnnor87b2'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6r-lv8jchx8848737.webp', 'sg-11134201-7rd6r-lv8jchx8848737'),
(23, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5m-lv8jcf52ap367a.webp', 'sg-11134201-7rd5m-lv8jcf52ap367a'),
(24, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd56-lv8jchc52z6ff4.webp', 'sg-11134201-7rd56-lv8jchc52z6ff4'),
(24, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarj4j599.webp', 'cn-11134207-7r98o-lvicaoarj4j599'),
(24, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarhpyp82.webp', 'cn-11134207-7r98o-lvicaoarhpyp82'),
(24, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarhpyp82.webp', 'cn-11134207-7r98o-lvicaoarhpyp82'),
(24, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lnqms0rzj8ug02.webp', 'cn-11134207-7r98o-lnqms0rzj8ug02'),
(25, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ll7hq9ai5wyc3b.webp', 'cn-11134207-7r98o-ll7hq9ai5wyc3b'),
(25, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ll7hq9ai7bis9b.webp', 'cn-11134207-7r98o-ll7hq9ai7bis9b'),
(26, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-kq8pb052cqov32.webp', 'vn-11134201-23030-kq8pb052cqov32'),
(26, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-o0kofa62cqovbc.webp', 'vn-11134201-23030-o0kofa62cqovbc'),
(26, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-sgxx2452cqov3c.webp', 'vn-11134201-23030-sgxx2452cqov3c'),
(26, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-wvzo6052cqovbc.webp', 'vn-11134201-23030-wvzo6052cqovbc'),
(26, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-jtymjb62cqovaa.webp', 'vn-11134201-23030-jtymjb62cqovaa'),
(27, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-br8pb052cqov10.webp', 'vn-11134201-23030-br8pb052cqov10'),
(27, 'https://down-vn.img.susercontent.com/file/vn-11134201-23030-9kfrh952cqova5.webp', 'vn-11134201-23030-9kfrh952cqova5'),
(27, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4j-lwb1ywtkac397f.webp', 'sg-11134201-7rd4j-lwb1ywtkac397f'),
(27, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd50-lwb1yxjx7r2g44.webp', 'sg-11134201-7rd50-lwb1yxjx7r2g44'),
(27, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd63-lwbb7de1qgqja8.webp', 'sg-11134201-7rd63-lwbb7de1qgqja8'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4x-lwbb7dyawu9ba8.webp', 'sg-11134201-7rd4x-lwbb7dyawu9ba8'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6w-lwbaokm6425873.webp', 'sg-11134201-7rd6w-lwbaokm6425873'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5y-lv8jcjnnor87b2.webp', 'sg-11134201-7rd5y-lv8jcjnnor87b2'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6r-lv8jchx8848737.webp', 'sg-11134201-7rd6r-lv8jchx8848737'),
(28, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5m-lv8jcf52ap367a.webp', 'sg-11134201-7rd5m-lv8jcf52ap367a'),
(29, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd56-lv8jchc52z6ff4.webp', 'sg-11134201-7rd56-lv8jchc52z6ff4'),
(29, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarj4j599.webp', 'cn-11134207-7r98o-lvicaoarj4j599'),
(29, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarhpyp82.webp', 'cn-11134207-7r98o-lvicaoarhpyp82'),
(29, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lvicaoarhpyp82.webp', 'cn-11134207-7r98o-lvicaoarhpyp82'),
(29, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lnqms0rzj8ug02.webp', 'cn-11134207-7r98o-lnqms0rzj8ug02'),
(30, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ll7hq9ai5wyc3b.webp', 'cn-11134207-7r98o-ll7hq9ai5wyc3b'),
(30, 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-ll7hq9ai7bis9b.webp', 'cn-11134207-7r98o-ll7hq9ai7bis9b'),

(31, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxx-lzr10geb5sc760.webp', 'sg-11134201-7rdxx-lzr10geb5sc760'),
(31, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwp-lzr10hs963q245.webp', 'sg-11134201-7rdwp-lzr10hs963q245'),
(31, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyb-lzr10kg987ba14.webp', 'sg-11134201-7rdyb-lzr10kg987ba14'),
(31, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxq-lz9yvertw31ea4.webp', 'sg-11134201-7rdxq-lz9yvertw31ea4'),
(31, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvt-lydf7v6lh81y4e.webp', 'sg-11134201-7rdvt-lydf7v6lh81y4e'),
(32, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotpv0yy1jkg6f.webp', 'vn-11134207-7r98o-lotpv0yy1jkg6f'),
(32, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotqp5m8fw23d1.webp', 'vn-11134207-7r98o-lotqp5m8fw23d1'),
(32, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotqp5ogcn4b5b.webp', 'vn-11134207-7r98o-lotqp5ogcn4b5b'),
(32, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotpv0yy0500e7.webp', 'vn-11134207-7r98o-lotpv0yy0500e7'),
(32, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp088wmadie302.webp', 'vn-11134207-7r98o-lp088wmadie302'),
(33, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k3ggy9b4xf2.webp', 'vn-11134207-7r98o-lz6k3ggy9b4xf2'),
(33, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k3ggy9b4xf2.webp', 'vn-11134207-7r98o-lz6k3ggy9b4xf2'),
(33, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k4i8izqg1d6.webp', 'vn-11134207-7r98o-lz6k4i8izqg1d6'),
(33, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k6iqmw5e5d4.webp', 'vn-11134207-7r98o-lz6k6iqmw5e5d4'),
(33, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k6tbbf2qp11.webp', 'vn-11134207-7r98o-lz6k6tbbf2qp11'),
(34, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkj0e9jysnfs77.webp', 'vn-11134207-7qukw-lkj0e9jysnfs77'),
(34, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkj0e9l2r0ywcf.webp', 'vn-11134207-7qukw-lkj0e9l2r0ywcf'),
(34, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkj0e9ookcdkc3.webp', 'vn-11134207-7qukw-lkj0e9ookcdkc3'),
(35, 'https://down-vn.img.susercontent.com/file/cn-11134211-7r98o-ly0cbhfehykl0f.webp', 'cn-11134211-7r98o-ly0cbhfehykl0f'),
(35, 'https://down-vn.img.susercontent.com/file/cn-11134211-7r98o-ly0cbhfd4sp186.webp', 'cn-11134211-7r98o-ly0cbhfd4sp186'),
(35, 'https://down-vn.img.susercontent.com/file/cn-11134211-7r98o-ly0cbhfeytdxfd.webp', 'cn-11134211-7r98o-ly0cbhfeytdxfd'),
(36, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbkj-llls67qwbnjuef.webp', 'sg-11134201-7rbkj-llls67qwbnjuef'),
(36, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbmd-llls67qwbnbue8.webp', 'sg-11134201-7rbmd-llls67qwbnbue8'),
(37, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llpzcrytegv391.webp', 'vn-11134207-7r98o-llpzcrytegv391'),
(37, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llpzcrytd2an87.webp', 'vn-11134207-7r98o-llpzcrytd2an87'),
(37, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llpzcrytiokf6b.webp', 'vn-11134207-7r98o-llpzcrytiokf6b'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxx-lzr10geb5sc760.webp', 'sg-11134201-7rdxx-lzr10geb5sc760'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwp-lzr10hs963q245.webp', 'sg-11134201-7rdwp-lzr10hs963q245'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyb-lzr10kg987ba14.webp', 'sg-11134201-7rdyb-lzr10kg987ba14'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxq-lz9yvertw31ea4.webp', 'sg-11134201-7rdxq-lz9yvertw31ea4'),
(38, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvt-lydf7v6lh81y4e.webp', 'sg-11134201-7rdvt-lydf7v6lh81y4e'),
(39, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotpv0yy1jkg6f.webp', 'vn-11134207-7r98o-lotpv0yy1jkg6f'),
(39, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotqp5m8fw23d1.webp', 'vn-11134207-7r98o-lotqp5m8fw23d1'),
(39, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotqp5ogcn4b5b.webp', 'vn-11134207-7r98o-lotqp5ogcn4b5b'),
(39, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lotpv0yy0500e7.webp', 'vn-11134207-7r98o-lotpv0yy0500e7'),
(39, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lp088wmadie302.webp', 'vn-11134207-7r98o-lp088wmadie302'),
(40, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k3ggy9b4xf2.webp', 'vn-11134207-7r98o-lz6k3ggy9b4xf2'),
(40, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k3ggy9b4xf2.webp', 'vn-11134207-7r98o-lz6k3ggy9b4xf2'),
(40, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k4i8izqg1d6.webp', 'vn-11134207-7r98o-lz6k4i8izqg1d6'),
(40, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k6iqmw5e5d4.webp', 'vn-11134207-7r98o-lz6k6iqmw5e5d4'),
(40, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lz6k6tbbf2qp11.webp', 'vn-11134207-7r98o-lz6k6tbbf2qp11'),
(41, 'https://down-vn.img.susercontent.com/file/76cf9cda78647c3ccea2a881d48233db.webp', '76cf9cda78647c3ccea2a881d48233db'),
(41, 'https://down-vn.img.susercontent.com/file/e14cda051dea5ac5248eb1926f7c2392.webp', 'e14cda051dea5ac5248eb1926f7c2392'),
(41, 'https://down-vn.img.susercontent.com/file/2369d5a2edabec5007d6a70c535474a5.webp', '2369d5a2edabec5007d6a70c535474a5'),
(41, 'https://down-vn.img.susercontent.com/file/9354203519c928c7f481f9396c24aeed.webp', '9354203519c928c7f481f9396c24aeed'),
(41, 'https://down-vn.img.susercontent.com/file/32b5e62f23a648bb3f90831f5d974c97.webp', '32b5e62f23a648bb3f90831f5d974c97'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd5o-lu14yl4b3t2a72.webp', 'sg-11134201-7rd5o-lu14yl4b3t2a72'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd72-lu14ylk4go1b7d.webp', 'sg-11134201-7rd72-lu14ylk4go1b7d'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd73-lu14ymfh6sk73c.webp', 'sg-11134201-7rd73-lu14ymfh6sk73c'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd73-lu14ymfh6sk73c.webp', 'sg-11134201-7rd73-lu14ymfh6sk73c'),
(42, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd73-lu14ymfh6sk73c.webp', 'sg-11134201-7rd73-lu14ymfh6sk73c'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw2-m0g3lo9t4kax1a.webp', 'sg-11134201-7rdw2-m0g3lo9t4kax1a'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw2-m0g3lo9t4kax1a.webp', 'sg-11134201-7rdw2-m0g3lo9t4kax1a'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdy1-m0g3lpuesc567c.webp', 'sg-11134201-7rdy1-m0g3lpuesc567c'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvw-m0g3lsi4uum23e.webp', 'sg-11134201-7rdvw-m0g3lsi4uum23e'),
(43, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxl-m0g3ltafpfk22f.webp', 'sg-11134201-7rdxl-m0g3ltafpfk22f'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6y-lx9lz038wqdi5b.webp', 'sg-11134201-7rd6y-lx9lz038wqdi5b'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd4p-lx9lz0yboo9635.webp', 'sg-11134201-7rd4p-lx9lz0yboo9635'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd74-lx9lz1j4sswc1f.webp', 'sg-11134201-7rd74-lx9lz1j4sswc1f'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd64-lx9lz21q1m16fb.webp', 'sg-11134201-7rd64-lx9lz21q1m16fb'),
(44, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rd6g-lx9lz34ki67dae.webp', 'sg-11134201-7rd6g-lx9lz34ki67dae'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw5-lxwdsplcbvbcc1.webp', 'sg-11134201-7rdw5-lxwdsplcbvbcc1'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyt-lxwdsqygc02u3a.webp', 'sg-11134201-7rdyt-lxwdsqygc02u3a'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvs-lxwdss9mez8pcc.webp', 'sg-11134201-7rdvs-lxwdss9mez8pcc'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvi-lxwdsth6omlc37.webp', 'sg-11134201-7rdvi-lxwdsth6omlc37'),
(45, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwy-lxwdssrxpkli3b.webp', 'sg-11134201-7rdwy-lxwdssrxpkli3b'),
(46, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrs8uwy6b5w900.webp', 'vn-11134207-7r98o-lrs8uwy6b5w900'),
(46, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrs8uwy69rbte2.webp', 'vn-11134207-7r98o-lrs8uwy69rbte2'),
(46, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrs8uwy6fdllb5.webp', 'vn-11134207-7r98o-lrs8uwy6fdllb5'),
(46, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrs8uwy6dz157a.webp', 'vn-11134207-7r98o-lrs8uwy6dz157a'),
(46, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrs8uwy6gs61f5.webp', 'vn-11134207-7r98o-lrs8uwy6gs61f5'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvd-lzbmyh205ulk80.webp', 'sg-11134201-7rdvd-lzbmyh205ulk80'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw7-lzbmyi5yjdik04.webp', 'sg-11134201-7rdw7-lzbmyi5yjdik04'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvu-lzbmyjyvwdd63f.webp', 'sg-11134201-7rdvu-lzbmyjyvwdd63f'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdxc-lzbmykq2tzlg07.webp', 'sg-11134201-7rdxc-lzbmykq2tzlg07'),
(47, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyv-lzbmyll5nblg4d.webp', 'sg-11134201-7rdyv-lzbmyll5nblg4d'),
(48, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyv-lzbmyll5nblg4d.webp', 'sg-11134201-7rdyv-lzbmyll5nblg4d'),
(48, 'https://down-vn.img.susercontent.com/file/3bcd644997a4aeff39b2ebad6b39ee0e.webp', '3bcd644997a4aeff39b2ebad6b39ee0e'),
(48, 'https://down-vn.img.susercontent.com/file/8f3aaa551a7f64cc51edddebfbe2a6c4.webp', '8f3aaa551a7f64cc51edddebfbe2a6c4'),
(48, 'https://down-vn.img.susercontent.com/file/b016c2d4668061c7f538bf6c39b4efa5.webp', 'b016c2d4668061c7f538bf6c39b4efa5'),
(48, 'https://down-vn.img.susercontent.com/file/a0e7aab1858740a63073fa3fc7e3213c.webp', 'a0e7aab1858740a63073fa3fc7e3213c'),
(49, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lk52pa8cvjxw62.webp', 'vn-11134207-7qukw-lk52pa8cvjxw62'),
(49, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lk52pa8cvjxw62.webp', 'vn-11134207-7qukw-lk52pa8cvjxw62'),
(49, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltp03ksjs9aic3.webp', 'vn-11134207-7r98o-ltp03ksjs9aic3'),
(49, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltp03ksjtnuy7b.webp', 'vn-11134207-7r98o-ltp03ksjtnuy7b'),
(49, 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-ljdypb0bv4k2e8.webp', 'vn-11134207-7qukw-ljdypb0bv4k2e8'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdw2-lxqqjkoz2a9265.webp', 'sg-11134201-7rdw2-lxqqjkoz2a9265'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdyi-lxqqjnyw9pho04.webp', 'sg-11134201-7rdyi-lxqqjnyw9pho04'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvt-lxqqjq414udme2.webp', 'sg-11134201-7rdvt-lxqqjq414udme2'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdx9-lxqqjr2pq38p63.webp', 'sg-11134201-7rdx9-lxqqjr2pq38p63'),
(50, 'https://down-vn.img.susercontent.com/file/sg-11134201-7rdvs-lxqqjpck917kc0.webp', 'sg-11134201-7rdvs-lxqqjpck917kc0');

INSERT INTO product_details (product_id, retail_price, size_id, color_id, quantity, status) VALUES
(1, 299000, 2, 1, 50, 'ACTIVE'),
(1, 299000, 3, 2, 50, 'ACTIVE'),
(1, 299000, 4, 3, 50, 'ACTIVE'),
(1, 299000, 5, 4, 50, 'ACTIVE'),
(2, 319000, 2, 2, 40, 'ACTIVE'),
(2, 319000, 3, 3, 40, 'ACTIVE'),
(2, 319000, 4, 4, 40, 'ACTIVE'),
(2, 319000, 5, 5, 40, 'ACTIVE'),
(3, 259000, 2, 3, 30, 'ACTIVE'),
(3, 259000, 3, 4, 30, 'ACTIVE'),
(3, 259000, 4, 5, 30, 'ACTIVE'),
(3, 259000, 5, 1, 30, 'ACTIVE'),
(4, 279000, 2, 4, 25, 'ACTIVE'),
(4, 279000, 3, 5, 25, 'ACTIVE'),
(4, 279000, 4, 1, 25, 'ACTIVE'),
(4, 279000, 5, 2, 25, 'ACTIVE'),
(5, 289000, 2, 5, 45, 'ACTIVE'),
(5, 289000, 3, 1, 45, 'ACTIVE'),
(5, 289000, 4, 2, 45, 'ACTIVE'),
(5, 289000, 5, 3, 45, 'ACTIVE'),
(6, 269000, 2, 3, 50, 'ACTIVE'),
(6, 269000, 3, 4, 50, 'ACTIVE'),
(6, 269000, 4, 5, 50, 'ACTIVE'),
(6, 269000, 5, 1, 50, 'ACTIVE'),
(7, 249000, 2, 4, 35, 'ACTIVE'),
(7, 249000, 3, 5, 35, 'ACTIVE'),
(7, 249000, 4, 1, 35, 'ACTIVE'),
(7, 249000, 5, 2, 35, 'ACTIVE'),
(8, 319000, 2, 1, 60, 'ACTIVE'),
(8, 319000, 3, 2, 60, 'ACTIVE'),
(8, 319000, 4, 3, 60, 'ACTIVE'),
(8, 319000, 5, 4, 60, 'ACTIVE'),
(9, 289000, 2, 3, 30, 'ACTIVE'),
(9, 289000, 3, 4, 30, 'ACTIVE'),
(9, 289000, 4, 5, 30, 'ACTIVE'),
(9, 289000, 5, 1, 30, 'ACTIVE'),
(10, 259000, 2, 5, 40, 'ACTIVE'),
(10, 259000, 3, 1, 40, 'ACTIVE'),
(10, 259000, 4, 2, 40, 'ACTIVE'),
(10, 259000, 5, 3, 40, 'ACTIVE'),
(11, 279000, 2, 2, 50, 'ACTIVE'),
(11, 279000, 3, 3, 50, 'ACTIVE'),
(11, 279000, 4, 4, 50, 'ACTIVE'),
(11, 279000, 5, 5, 50, 'ACTIVE'),
(12, 299000, 2, 4, 45, 'ACTIVE'),
(12, 299000, 3, 5, 45, 'ACTIVE'),
(12, 299000, 4, 1, 45, 'ACTIVE'),
(12, 299000, 5, 2, 45, 'ACTIVE'),
(13, 319000, 2, 5, 35, 'ACTIVE'),
(13, 319000, 3, 1, 35, 'ACTIVE'),
(13, 319000, 4, 2, 35, 'ACTIVE'),
(13, 319000, 5, 3, 35, 'ACTIVE'),
(14, 259000, 2, 1, 30, 'ACTIVE'),
(14, 259000, 3, 2, 30, 'ACTIVE'),
(14, 259000, 4, 3, 30, 'ACTIVE'),
(14, 259000, 5, 4, 30, 'ACTIVE'),
(15, 269000, 2, 4, 40, 'ACTIVE'),
(15, 269000, 3, 5, 40, 'ACTIVE'),
(15, 269000, 4, 1, 40, 'ACTIVE'),
(15, 269000, 5, 2, 40, 'ACTIVE'),
(16, 249000, 2, 3, 50, 'ACTIVE'),
(16, 249000, 3, 4, 50, 'ACTIVE'),
(16, 249000, 4, 5, 50, 'ACTIVE'),
(16, 249000, 5, 1, 50, 'ACTIVE'),
(17, 279000, 2, 2, 45, 'ACTIVE'),
(17, 279000, 3, 3, 45, 'ACTIVE'),
(17, 279000, 4, 4, 45, 'ACTIVE'),
(17, 279000, 5, 5, 45, 'ACTIVE'),
(18, 289000, 2, 1, 60, 'ACTIVE'),
(18, 289000, 3, 2, 60, 'ACTIVE'),
(18, 289000, 4, 3, 60, 'ACTIVE'),
(18, 289000, 5, 4, 60, 'ACTIVE'),
(19, 259000, 2, 5, 50, 'ACTIVE'),
(19, 259000, 3, 1, 50, 'ACTIVE'),
(19, 259000, 4, 2, 50, 'ACTIVE'),
(19, 259000, 5, 3, 50, 'ACTIVE'),
(20, 249000, 2, 3, 40, 'ACTIVE'),
(20, 249000, 3, 4, 40, 'ACTIVE'),
(20, 249000, 4, 5, 40, 'ACTIVE'),
(20, 249000, 5, 1, 40, 'ACTIVE'),
(21, 299000, 2, 1, 50, 'ACTIVE'),
(21, 299000, 3, 2, 50, 'ACTIVE'),
(21, 299000, 4, 3, 50, 'ACTIVE'),
(21, 299000, 5, 4, 50, 'ACTIVE'),
(22, 319000, 2, 2, 40, 'ACTIVE'),
(22, 319000, 3, 3, 40, 'ACTIVE'),
(22, 319000, 4, 4, 40, 'ACTIVE'),
(22, 319000, 5, 5, 40, 'ACTIVE'),
(23, 259000, 2, 3, 30, 'ACTIVE'),
(23, 259000, 3, 4, 30, 'ACTIVE'),
(23, 259000, 4, 5, 30, 'ACTIVE'),
(23, 259000, 5, 1, 30, 'ACTIVE'),
(24, 279000, 2, 4, 25, 'ACTIVE'),
(24, 279000, 3, 5, 25, 'ACTIVE'),
(24, 279000, 4, 1, 25, 'ACTIVE'),
(24, 279000, 5, 2, 25, 'ACTIVE'),
(25, 289000, 2, 5, 45, 'ACTIVE'),
(25, 289000, 3, 1, 45, 'ACTIVE'),
(25, 289000, 4, 2, 45, 'ACTIVE'),
(25, 289000, 5, 3, 45, 'ACTIVE'),
(26, 269000, 2, 3, 50, 'ACTIVE'),
(26, 269000, 3, 4, 50, 'ACTIVE'),
(26, 269000, 4, 5, 50, 'ACTIVE'),
(26, 269000, 5, 1, 50, 'ACTIVE'),
(27, 249000, 2, 4, 35, 'ACTIVE'),
(27, 249000, 3, 5, 35, 'ACTIVE'),
(27, 249000, 4, 1, 35, 'ACTIVE'),
(27, 249000, 5, 2, 35, 'ACTIVE'),
(28, 319000, 2, 1, 60, 'ACTIVE'),
(28, 319000, 3, 2, 60, 'ACTIVE'),
(28, 319000, 4, 3, 60, 'ACTIVE'),
(28, 319000, 5, 4, 60, 'ACTIVE'),
(29, 289000, 2, 3, 30, 'ACTIVE'),
(29, 289000, 3, 4, 30, 'ACTIVE'),
(29, 289000, 4, 5, 30, 'ACTIVE'),
(29, 289000, 5, 1, 30, 'ACTIVE'),
(30, 259000, 2, 5, 40, 'ACTIVE'),
(30, 259000, 3, 1, 40, 'ACTIVE'),
(30, 259000, 4, 2, 40, 'ACTIVE'),
(30, 259000, 5, 3, 40, 'ACTIVE'),
(31, 279000, 2, 2, 50, 'ACTIVE'),
(31, 279000, 3, 3, 50, 'ACTIVE'),
(31, 279000, 4, 4, 50, 'ACTIVE'),
(31, 279000, 5, 5, 50, 'ACTIVE'),
(32, 299000, 2, 4, 45, 'ACTIVE'),
(32, 299000, 3, 5, 45, 'ACTIVE'),
(32, 299000, 4, 1, 45, 'ACTIVE'),
(32, 299000, 5, 2, 45, 'ACTIVE'),
(33, 319000, 2, 5, 35, 'ACTIVE'),
(33, 319000, 3, 1, 35, 'ACTIVE'),
(33, 319000, 4, 2, 35, 'ACTIVE'),
(33, 319000, 5, 3, 35, 'ACTIVE'),
(34, 259000, 2, 1, 30, 'ACTIVE'),
(34, 259000, 3, 2, 30, 'ACTIVE'),
(34, 259000, 4, 3, 30, 'ACTIVE'),
(34, 259000, 5, 4, 30, 'ACTIVE'),
(35, 269000, 2, 4, 40, 'ACTIVE'),
(35, 269000, 3, 5, 40, 'ACTIVE'),
(35, 269000, 4, 1, 40, 'ACTIVE'),
(35, 269000, 5, 2, 40, 'ACTIVE'),
(36, 249000, 2, 3, 50, 'ACTIVE'),
(36, 249000, 3, 4, 50, 'ACTIVE'),
(36, 249000, 4, 5, 50, 'ACTIVE'),
(36, 249000, 5, 1, 50, 'ACTIVE'),
(37, 279000, 2, 2, 45, 'ACTIVE'),
(37, 279000, 3, 3, 45, 'ACTIVE'),
(37, 279000, 4, 4, 45, 'ACTIVE'),
(37, 279000, 5, 5, 45, 'ACTIVE'),
(38, 289000, 2, 1, 60, 'ACTIVE'),
(38, 289000, 3, 2, 60, 'ACTIVE'),
(38, 289000, 4, 3, 60, 'ACTIVE'),
(38, 289000, 5, 4, 60, 'ACTIVE'),
(39, 259000, 2, 5, 50, 'ACTIVE'),
(39, 259000, 3, 1, 50, 'ACTIVE'),
(39, 259000, 4, 2, 50, 'ACTIVE'),
(39, 259000, 5, 3, 50, 'ACTIVE'),
(40, 249000, 2, 3, 40, 'ACTIVE'),
(40, 249000, 3, 4, 40, 'ACTIVE'),
(40, 249000, 4, 5, 40, 'ACTIVE'),
(40, 249000, 5, 1, 40, 'ACTIVE'),
(41, 319000, 2, 1, 60, 'ACTIVE'),
(41, 319000, 3, 2, 60, 'ACTIVE'),
(41, 319000, 4, 3, 60, 'ACTIVE'),
(41, 319000, 5, 4, 60, 'ACTIVE'),
(42, 289000, 2, 5, 45, 'ACTIVE'),
(42, 289000, 3, 1, 45, 'ACTIVE'),
(42, 289000, 4, 2, 45, 'ACTIVE'),
(42, 289000, 5, 3, 45, 'ACTIVE'),
(43, 269000, 2, 3, 50, 'ACTIVE'),
(43, 269000, 3, 4, 50, 'ACTIVE'),
(43, 269000, 4, 5, 50, 'ACTIVE'),
(43, 269000, 5, 1, 50, 'ACTIVE'),
(44, 249000, 2, 1, 40, 'ACTIVE'),
(44, 249000, 3, 2, 40, 'ACTIVE'),
(44, 249000, 4, 3, 40, 'ACTIVE'),
(44, 249000, 5, 4, 40, 'ACTIVE'),
(45, 279000, 2, 4, 55, 'ACTIVE'),
(45, 279000, 3, 5, 55, 'ACTIVE'),
(45, 279000, 4, 1, 55, 'ACTIVE'),
(45, 279000, 5, 2, 55, 'ACTIVE'),
(46, 289000, 2, 2, 60, 'ACTIVE'),
(46, 289000, 3, 3, 60, 'ACTIVE'),
(46, 289000, 4, 4, 60, 'ACTIVE'),
(46, 289000, 5, 5, 60, 'ACTIVE'),
(47, 259000, 2, 1, 30, 'ACTIVE'),
(47, 259000, 3, 2, 30, 'ACTIVE'),
(47, 259000, 4, 3, 30, 'ACTIVE'),
(47, 259000, 5, 4, 30, 'ACTIVE'),
(48, 269000, 2, 5, 50, 'ACTIVE'),
(48, 269000, 3, 1, 50, 'ACTIVE'),
(48, 269000, 4, 2, 50, 'ACTIVE'),
(48, 269000, 5, 3, 50, 'ACTIVE'),
(49, 319000, 2, 3, 40, 'ACTIVE'),
(49, 319000, 3, 4, 40, 'ACTIVE'),
(49, 319000, 4, 5, 40, 'ACTIVE'),
(49, 319000, 5, 1, 40, 'ACTIVE'),
(50, 249000, 2, 2, 45, 'ACTIVE'),
(50, 249000, 3, 3, 45, 'ACTIVE'),
(50, 249000, 4, 4, 45, 'ACTIVE'),
(50, 249000, 5, 5, 45, 'ACTIVE');

-- promotions
INSERT INTO promotions (name, code, percent, start_date, end_date, note, created_by, updated_by, create_at, update_at, is_deleted)
VALUES 
('Khuyến mãi Tết Nguyên Đán', 'TET2024', 15, '2024-02-01', '2024-02-15', 'Giảm giá cho Tết Nguyên Đán', 1, 1, '2023-10-01 08:00:00', '2023-10-01 08:00:00', 0),
('Khuyến mãi 8/3', 'QUOCTEPN', 20, '2024-03-01', '2024-03-08', 'Khuyến mãi nhân ngày Quốc tế Phụ nữ', 1, 1, '2023-10-05 09:00:00', '2023-10-05 09:00:00', 0),
('Sale cuối năm', 'CUOINAM2024', 30, '2024-12-15', '2024-12-31', 'Giảm giá đặc biệt cuối năm', 1, 1, '2023-10-10 10:30:00', '2023-10-10 10:30:00', 0),
('Mừng Ngày Nhà giáo', 'NGAYNHA23', 10, '2024-11-10', '2024-11-20', 'Khuyến mãi nhân ngày Nhà giáo Việt Nam', 1, 1, '2023-10-15 11:45:00', '2023-10-15 11:45:00', 0),
('Giảm giá mùa hè', 'SUMMER2024', 25, '2024-06-01', '2024-06-30', 'Khuyến mãi mùa hè', 2, 2, '2023-10-20 13:20:00', '2023-10-20 13:20:00', 0),
('Khuyến mãi Giáng sinh', 'NOEL2024', 35, '2024-12-20', '2024-12-25', 'Ưu đãi đặc biệt nhân dịp Giáng sinh', 1, 1, '2023-10-25 15:00:00', '2023-10-25 15:00:00', 0),
('Ưu đãi mùa thu', 'AUTUMN23', 10, '2024-09-01', '2024-09-30', 'Giảm giá mùa thu', 1, 1, '2023-10-28 16:45:00', '2023-10-28 16:45:00', 0),
('Giảm giá dịp lễ 30/4', 'LE304', 20, '2024-04-25', '2024-05-01', 'Ưu đãi đặc biệt dịp lễ 30/4', 1, 1, '2023-10-30 17:30:00', '2023-10-30 17:30:00', 0),
('Khuyến mãi Thứ 6 Đen', 'BLACKFRI2024', 50, '2024-11-25', '2024-11-29', 'Khuyến mãi Black Friday', 1, 1, '2023-11-01 08:15:00', '2023-11-01 08:15:00', 0),
('Ưu đãi Valentine', 'VALENTINE', 15, '2024-02-10', '2024-02-14', 'Ưu đãi dành cho ngày Valentine', 1, 1, '2023-11-05 09:45:00', '2023-11-05 09:45:00', 0);

INSERT INTO promotion_details (promotion_id, product_id)
VALUES 
(1, 1), (1, 5), (1, 10),
(2, 2), (2, 15), (2, 18),
(3, 20), (3, 25), (3, 30),
(4, 4), (4, 8), (4, 12),
(5, 3), (5, 22), (5, 27),
(6, 19), (6, 26), (6, 34),
(7, 16), (7, 7), (7, 21),
(8, 31), (8, 9), (8, 13),
(9, 14), (9, 17), (9, 33),
(10, 6), (10, 11), (10, 29);

-- Coupons
INSERT INTO coupons (code, name, discount_type, discount_value, max_value, conditions, quantity, usage_count, type, start_date, end_date, description, created_by, updated_by) VALUES
('VNCOUP001', 'Giảm giá mùa hè', 'PERCENTAGE', 10, 2000000, 500000, 100, 0, 'PUBLIC', '2024-06-01 00:00:00', '2024-06-30 23:59:59', 'Giảm 10% cho mùa hè', 1, 1),
('VNCOUP002', 'Ưu đãi mùa đông', 'FIXED_AMOUNT', 100000, 1000000, 300000, 50, 0, 'PUBLIC', '2024-12-01 00:00:00', '2024-12-31 23:59:59', 'Giảm ngay 100.000 VNĐ mùa đông', 2, 2),
('VNCOUP003', 'Black Friday', 'PERCENTAGE', 25, 5000000, 1000000, 200, 0, 'PUBLIC', '2024-11-25 00:00:00', '2024-11-30 23:59:59', 'Giảm 25% Black Friday', 3, 3),
('VNCOUP004', 'Khuyến mãi Tết Nguyên Đán', 'FIXED_AMOUNT', 500000, 2000000, 0, 200, 0, 'PUBLIC', '2024-12-31 00:00:00', '2025-01-01 23:59:59', 'Giảm 500.000 VNĐ dịp Tết', 4, 4),
('VNCOUP005', 'Flash Sale 24h', 'PERCENTAGE', 15, 3000000, 1000000, 500, 0, 'PUBLIC', '2024-10-15 00:00:00', '2024-10-15 23:59:59', 'Giảm 15% trong 24 giờ', 5, 5),
('VNCOUP006', 'Ưu đãi lễ 30/4', 'FIXED_AMOUNT', 200000, 1000000, 500000, 300, 0, 'PUBLIC', '2024-04-28 00:00:00', '2024-05-01 23:59:59', 'Giảm 200.000 VNĐ dịp lễ', 6, 6),
('VNCOUP007', 'Giảm giá đặc biệt', 'PERCENTAGE', 5, 1500000, 300000, 50, 0, 'PUBLIC', '2024-11-01 00:00:00', '2024-11-05 23:59:59', 'Giảm 5% đơn hàng', 7, 7),
('VNCOUP008', 'Ưu đãi giới hạn', 'FIXED_AMOUNT', 700000, 3000000, 1500000, 100, 0, 'PUBLIC', '2024-10-20 00:00:00', '2024-10-25 23:59:59', 'Giảm 700.000 VNĐ giới hạn', 8, 8),
('VNCOUP009', 'Ưu đãi sinh nhật', 'PERCENTAGE', 20, 2000000, 800000, 50, 0, 'PUBLIC', '2024-11-20 00:00:00', '2024-11-22 23:59:59', 'Giảm 20% mừng sinh nhật', 9, 9),
('VNCOUP010', 'Deal kỷ niệm', 'FIXED_AMOUNT', 300000, 1500000, 500000, 50, 0, 'PUBLIC', '2024-10-01 00:00:00', '2024-10-05 23:59:59', 'Giảm 300.000 VNĐ nhân dịp kỷ niệm', 10, 10);
    
INSERT INTO bill_status (name, status) VALUES
('Đang chờ xử lý', 'PENDING'),
('Đang chờ xác nhận', 'PENDING_CONFIRMATION'),
('Đã xác nhận', 'CONFIRMED'),
('Đã bàn giao cho đơn vị vận chuyển', 'SHIPPED'),
('Đã giao thành công', 'DELIVERED'),
('Giao hàng thất bại', 'DELIVERY_FAILED'),
('Đã hủy đơn hàng', 'CANCELED'),
('Đơn hàng hoàn tất', 'COMPLETED'),
('Khác', 'OTHER');