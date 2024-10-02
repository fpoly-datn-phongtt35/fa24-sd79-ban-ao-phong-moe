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
)
ALTER TABLE employees ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES employee_address(id);
ALTER TABLE employees ADD CONSTRAINT fk_position_id FOREIGN KEY (position_id) REFERENCES positions(id);
ALTER TABLE employees ADD CONSTRAINT fk_salary_id FOREIGN KEY (salary_id) REFERENCES salary(id);

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



