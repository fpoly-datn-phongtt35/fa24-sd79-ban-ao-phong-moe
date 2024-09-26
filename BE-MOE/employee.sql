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
  employee_id INT ,
  created_at DATETIME,
  updated_at DATETIME
)
ALTER TABLE employees ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES employee_address(id);
ALTER TABLE employees ADD CONSTRAINT fk_position_id FOREIGN KEY (position_id) REFERENCES positions(id);
ALTER TABLE salary ADD CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employees(id);

-- Thêm dữ liệu cho bảng employee_address
INSERT INTO employee_address (street_name, ward, district, city, country)
VALUES
('123 Main St', 'Ward 1', 'District 1', 'Ha Noi', 'Vietnam'),
('456 Maple Ave', 'Ward 5', 'District 3', 'Ho Chi Minh City', 'Vietnam'),
('789 Oak Blvd', 'Ward 10', 'District 7', 'Da Nang', 'Vietnam');

-- Thêm dữ liệu cho bảng positions
INSERT INTO positions (name, created_at, updated_at)
VALUES
('Software Engineer', NOW(), NOW()),
('Project Manager', NOW(), NOW()),
('HR Specialist', NOW(), NOW());

-- Thêm dữ liệu cho bảng employees
INSERT INTO employees (first_name, last_name, address_id, phone_number, gender, date_of_birth, avatar, position_id, created_at, updated_at)
VALUES
('John', 'Doe', 1, '0123456789', 'MALE', '1990-01-15', 'john_avatar.png', 1, NOW(), NOW()),
('Jane', 'Smith', 2, '0987654321', 'FEMALE', '1985-05-22', 'jane_avatar.png', 2, NOW(), NOW()),
('Alex', 'Brown', 3, '0123456780', 'OTHER', '1993-08-10', 'alex_avatar.png', 3, NOW(), NOW());

-- Thêm dữ liệu cho bảng salary
INSERT INTO salary (amount, employee_id, created_at, updated_at)
VALUES
(15000000, 1, NOW(), NOW()),
(20000000, 2, NOW(), NOW()),
(18000000, 3, NOW(), NOW());
