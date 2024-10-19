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




INSERT INTO customer_address (street_name, ward, district, city)
VALUES
    ('123 Baker Street', 'Marylebone', 'Central London', 'London'),
    ('1600 Pennsylvania Avenue', 'Northwest', 'Washington D.C.', 'Washington'),
    ('Champs-Élysées', '8th arrondissement', 'Paris', 'Île-de-France'),
    ('Friedrichstraße', 'Mitte', 'Berlin', 'Berlin'),
    ('Shibuya Crossing', 'Shibuya', 'Tokyo', 'Tokyo Metropolis'),
    ('Queen Street', 'CBD', 'Auckland', 'Auckland');




INSERT INTO customers (first_name, last_name, phone_number, gender, date_of_birth, image, address_id, created_at, updated_at)
VALUES
    ('John', 'Doe', '07123456789', 'MALE', '1980-04-15', 'johndoe.jpg', 1, NOW(), NOW()),
    ('Jane', 'Smith', '12025550123', 'FEMALE', '1985-08-20', 'janesmith.jpg', 2, NOW(), NOW()),
    ('Pierre', 'Dubois', '0601234567', 'MALE', '1990-11-05', 'pierredubois.jpg', 3, NOW(), NOW()),
    ('Anna', 'Schmidt', '03012345678', 'FEMALE', '1983-02-18', 'annaschmidt.jpg', 4, NOW(), NOW()),
    ('Kenji', 'Tanaka', '09012345678', 'MALE', '1995-06-30', 'kenjitanaka.jpg', 5, NOW(), NOW()),
    ('Liam', 'Brown', '0210123456', 'MALE', '1992-12-12', 'liambrown.jpg', 6, NOW(), NOW());


