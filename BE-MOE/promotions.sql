CREATE TABLE promotions(
  id INT PRIMARY KEY,
  name VARCHAR(255),
  promotion_type VARCHAR(50),
  promotion_value DECIMAL(10,2),
  start_date DATE,
  end_date DATE,	
  description TEXT
);

CREATE TABLE product_promotion(
    id              INT PRIMARY KEY,
    product_id      INT,
    promotion_id    INT,
    applied_date    DATE,
    promotion_price DECIMAL(10, 2)
);

CREATE TABLE products(
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(200),
   description VARCHAR(255),
   status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'),
   category_id INT,
   brand_id INT,
   origin VARCHAR(30),
   created_by BIGINT,
   updated_by BIGINT,
   create_at DATETIME,
   update_at DATETIME,
   is_deleted BIT DEFAULT 0
);

ALTER TABLE product_promotion 
ADD CONSTRAINT fk_product_promotion_product_id 
FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_promotion 
ADD CONSTRAINT fk_product_promotion_promotion_id 
FOREIGN KEY (promotion_id) REFERENCES promotions(id);

ALTER TABLE product_promotion MODIFY COLUMN product_id INT;

INSERT INTO promotions (id, name, promotion_type, promotion_value, start_date, end_date, description)
VALUES
(1, 'Summer Sale', 'Discount', 15.00, '2024-06-01', '2024-06-30', 'Get 15% off on all summer collection shirts.'),
(2, 'Buy 1 Get 1 Free', 'BOGO', 50.00, '2024-07-01', '2024-07-15', 'Buy one shirt and get another shirt of equal or lesser value for free.'),
(3, 'Flash Sale', 'Discount', 25.00, '2024-08-10', '2024-08-10', '25% off on selected shirts for 24 hours.'),
(4, 'Holiday Special', 'Discount', 20.00, '2024-12-20', '2024-12-31', 'Celebrate the holidays with 20% off on all shirts.');

INSERT INTO product_promotion (id, product_id, promotion_id, applied_date, promotion_price)
VALUES
(1, 1, 1, '2024-06-01', 85.00);