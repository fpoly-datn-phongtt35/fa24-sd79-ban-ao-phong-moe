CREATE TABLE customers (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    first_name varchar(25),
    last_name varchar(50),
    phone_number varchar(20),
    gender enum('MALE', 'FEMALE', 'OTHER'),
    date_of_birth date,
    image varchar(200),
    created_at datetime,
    updated_at datetime
);

CREATE TABLE customer_address (
    id bigint PRIMARY KEY AUTO_INCREMENT,
    customer_id bigint UNIQUE,
    street_name varchar(255),
    ward varchar(255),
    district varchar(255),
    city varchar(255),
    country varchar(255)
);

ALTER TABLE customer_address ADD CONSTRAINT fk_customer_address FOREIGN KEY (customer_id) REFERENCES customers(id);



INSERT INTO `customers` (`first_name`, `last_name`, `phone_number`, `gender`, `date_of_birth`, `image`, `created_at`, `updated_at`)
VALUES
    ('John', 'Doe', '123456789', 'MALE', '1985-05-15', 'john_doe.jpg', NOW(), NOW()),
    ('Jane', 'Smith', '987654321', 'FEMALE', '1990-08-25', 'jane_smith.jpg', NOW(), NOW()),
    ('Mike', 'Johnson', '555123456', 'MALE', '1979-11-30', 'mike_johnson.jpg', NOW(), NOW()),
    ('Emily', 'Davis', '444987654', 'FEMALE', '1995-03-10', 'emily_davis.jpg', NOW(), NOW()),
    ('Chris', 'Wilson', '333654789', 'OTHER', '1988-07-22', 'chris_wilson.jpg', NOW(), NOW());

INSERT INTO `customer_address` (`customer_id`, `street_name`, `ward`, `district`, `city`, `country`)
VALUES
    (1, '123 Elm Street', 'Ward 1', 'District 1', 'City A', 'Country A'),
    (2, '456 Oak Street', 'Ward 2', 'District 2', 'City B', 'Country A'),
    (3, '789 Pine Street', 'Ward 3', 'District 3', 'City C', 'Country B'),
    (4, '101 Maple Street', 'Ward 4', 'District 4', 'City D', 'Country B'),
    (5, '202 Birch Street', 'Ward 5', 'District 5', 'City E', 'Country C');