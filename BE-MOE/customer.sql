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
);

-- ALTER TABLE customer_address ADD CONSTRAINT fk_customer_address FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE customers
    ADD CONSTRAINT fk_customer_address
        FOREIGN KEY (address_id) REFERENCES customer_address(id);




-- User customer
INSERT INTO users (username, email, password, role_id, is_locked, is_enabled, created_at, updated_at, is_deleted)
VALUES
    ('user', 'user@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vantan', 'vantan@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thibich', 'thibich@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('minhtuan', 'minhtuan@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('ngochaph', 'ngochaph@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vannam', 'vannam@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('quanghai', 'quanghai@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thimai', 'thimai@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thanhtung', 'thanhtung@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vanduc', 'vanduc@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thilan', 'thilan@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thihuong', 'thihuong@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thihong', 'thihong@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('huuhoang', 'huuhoang@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vanlong', 'vanlong@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thiyen', 'thiyen@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vanhung', 'vanhung@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thithuy', 'thithuy@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('minhchau', 'minhchau@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('vancuong', 'vancuong@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0),
    ('thihong2', 'thihong2@moe.vn', '$2a$12$DuLq/PsMIVqwvN.63fi23.SODxII67rmoJ/xWoUJI94Anc0Vk9Vbu', 2, 0, 0, NOW(), NOW(), 0);
    ('Liam', 'Brown', '0210123456', 'MALE', '1992-12-12', 'liambrown.jpg', 6, NOW(), NOW());

INSERT INTO customer_address (street_name, ward, district, city)
VALUES
    ('81 Trung Kinh', 'Trung Kinh', 'Cau Giay', 'Hà Nội'),
    ('Lê Duẩn', 'Cửa Nam', 'Hoàn Kiếm', 'Hà Nội'),
    ('Kim Mã', 'Ngọc Khánh', 'Ba Đình', 'Hà Nội'),
    ('Nguyễn Trãi', 'Thượng Đình', 'Thanh Xuân', 'Hà Nội'),
    ('Trần Duy Hưng', 'Trung Hòa', 'Cầu Giấy', 'Hà Nội'),
    ('Tôn Đức Thắng', 'Hàng Bột', 'Đống Đa', 'Hà Nội'),
    ('Phạm Văn Đồng', 'Xuân Đỉnh', 'Bắc Từ Liêm', 'Hà Nội'),
    ('Hoàng Quốc Việt', 'Nghĩa Đô', 'Cầu Giấy', 'Hà Nội'),
    ('Đội Cấn', 'Cống Vị', 'Ba Đình', 'Hà Nội'),
    ('Nguyễn Văn Cừ', 'Bồ Đề', 'Long Biên', 'Hà Nội'),
    ('Lạc Long Quân', 'Xuân La', 'Tây Hồ', 'Hà Nội');

INSERT INTO customers (first_name, last_name, phone_number, gender, date_of_birth, image, address_id, user_id, created_at, updated_at)
VALUES
    ('User', 'System', '0123456789', 'Male', '2004-01-12', NULL, 1, 3, NOW(), NOW()),
    ('Van', 'Tan', '0123456789', 'Male', '1990-05-12', NULL, 2, 4, NOW(), NOW()),
    ('Thi', 'Bich', '0123456790', 'Female', '1988-07-15', NULL, 11, 5, NOW(), NOW()),
    ('Minh', 'Tuan', '0123456791', 'Male', '1992-09-20', NULL, 3, 6, NOW(), NOW()),
    ('Ngo', 'Chaph', '0123456792', 'Female', '1991-12-11', NULL, 4, 7, NOW(), NOW()),
    ('Van', 'Nam', '0123456793', 'Male', '1993-03-22', NULL, 5, 8, NOW(), NOW()),
    ('Quang', 'Hai', '0123456794', 'Male', '1987-01-25', NULL, 6, 9, NOW(), NOW()),
    ('Thi', 'Mai', '0123456795', 'Female', '1995-11-30', NULL, 7, 10, NOW(), NOW()),
    ('Thanh', 'Tung', '0123456796', 'Male', '1994-08-14', NULL, 8, 11, NOW(), NOW()),
    ('Van', 'Duc', '0123456797', 'Male', '1989-06-18', NULL, 9, 12, NOW(), NOW()),
    ('Thi', 'Lan', '0123456798', 'Female', '1997-02-10', NULL, 10, 13, NOW(), NOW());


