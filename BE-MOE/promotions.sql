CREATE TABLE promotions(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
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


ALTER TABLE product_promotion 
ADD CONSTRAINT fk_product_promotion_product_id 
FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE product_promotion 
ADD CONSTRAINT fk_product_promotion_promotion_id 
FOREIGN KEY (promotion_id) REFERENCES promotions(id);


INSERT INTO promotions (id, name, promotion_value, start_date, end_date, description)
VALUES
    (1, 'Summer Sale', 15.00, '2024-06-01', '2024-06-30', 'Get 15% off on all summer collection shirts.'),
    (2, 'Buy 1 Get 1 Free', 50.00, '2024-07-01', '2024-07-15', 'Buy one shirt and get another shirt of equal or lesser value for free.'),
    (3, 'Flash Sale', 25.00, '2024-08-10', '2024-08-10', '25% off on selected shirts for 24 hours.'),
    (4, 'Holiday Special', 20.00, '2024-12-20', '2024-12-31', 'Celebrate the holidays with 20% off on all shirts.'),
    (5,'Black Friday', 50.00, '2024-11-29', '2024-11-29', 'One-day massive discount event.'),
    (6,'Cyber Monday', 40.00, '2024-12-02', '2024-12-02', 'Online sales for electronics and more.'),
    (7,'Christmas Sale', 25.00, '2024-12-20', '2024-12-25', 'Holiday season discounts.'),
    (8,'New Year Sale', 15.00, '2024-01-01', '2024-01-05', 'Celebrate the new year with discounts.'),
    (9,'Easter Promotion', 18.00, '2024-04-10', '2024-04-14', 'Limited-time offer for Easter celebration.'),
    (10,'Back to School', 12.50, '2024-08-15', '2024-08-30', 'School supplies and clothing discounts.'),
    (11,'Flash Sale', 30.00, '2024-05-01', '2024-05-01', 'One-day flash sale on selected items.'),
    (12,'Clearance Sale', 35.00, '2024-09-01', '2024-09-15', 'End of season clearance discounts.'),
    (13,'Halloween Sale', 22.00, '2024-10-28', '2024-10-31', 'Discounts on Halloween costumes and treats.'),
    (14,'Labor Day Sale', 18.00, '2024-09-01', '2024-09-03', 'Promotions for Labor Day weekend.'),
    (15,'Sale', 11.00, '2024-08-02', '2024-09-05', 'Promotions for weekend.');

INSERT INTO product_promotion (id, product_id, promotion_id, applied_date, promotion_price)
VALUES
    (1, 1, 1, '2024-06-01', 85.00),
    (2, 2, 2, '2024-07-01', 100.00);