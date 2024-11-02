-- promotions
CREATE TABLE product_promotion(
                                  id INT AUTO_INCREMENT PRIMARY KEY,
                                  product_id BIGINT,
                                  applied_date DATE,
                                  promotion_price DECIMAL(10, 2)
);

CREATE TABLE promotions(
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(255),
                           promotion_type VARCHAR(50),
                           promotion_value DECIMAL(10,2),
                           start_date DATE,
                           end_date DATE,
                           description TEXT,
                           product_promotion_id INT
);

-- promotions
ALTER TABLE product_promotion ADD CONSTRAINT fk_product_promotion_product_id FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE promotions ADD CONSTRAINT fk_product_promotion FOREIGN KEY (product_promotion_id) REFERENCES product_promotion(id);



INSERT INTO product_promotion (id, product_id, applied_date, promotion_price)
VALUES
    (1, 1, '2024-06-01', 85.00),         -- Liên kết với "Summer Sale" (promotion_id = 1)
    (2, 2, '2024-07-01', 100.00),        -- Liên kết với "Buy 1 Get 1 Free" (promotion_id = 2)
    (3, 3, '2024-08-10', 75.00),         -- Liên kết với "Flash Sale" (promotion_id = 3)
    (4, 4, '2024-12-20', 80.00),         -- Liên kết với "Holiday Special" (promotion_id = 4)
    (5, 5, '2024-11-29', 50.00),         -- Liên kết với "Black Friday" (promotion_id = 5)
    (6, 6, '2024-12-02', 60.00),         -- Liên kết với "Cyber Monday" (promotion_id = 6)
    (7, 7, '2024-12-20', 75.00),         -- Liên kết với "Christmas Sale" (promotion_id = 7)
    (8, 8, '2024-01-01', 85.00),         -- Liên kết với "New Year Sale" (promotion_id = 8)
    (9, 9, '2024-04-10', 82.00),         -- Liên kết với "Easter Promotion" (promotion_id = 9)
    (10, 10, '2024-08-15', 87.50),        -- Liên kết với "Back to School" (promotion_id = 10)
    (11, 11, '2024-05-01', 70.00),        -- Liên kết với "Flash Sale" (promotion_id = 11)
    (12, 12, '2024-09-01', 65.00),        -- Liên kết với "Clearance Sale" (promotion_id = 12)
    (13, 13, '2024-10-28', 78.00),        -- Liên kết với "Halloween Sale" (promotion_id = 13)
    (14, 14, '2024-09-01', 82.00),        -- Liên kết với "Labor Day Sale" (promotion_id = 14)
    (15, 15, '2024-08-02', 88.50);

INSERT INTO promotions (id, name, promotion_value, start_date, end_date, description, product_promotion_id)
VALUES
    (1, 'Summer Sale', 15.00, '2024-06-01', '2024-06-30', 'Get 15% off on all summer collection shirts.', 1),
    (2, 'Buy 1 Get 1 Free', 50.00, '2024-07-01', '2024-07-15', 'Buy one shirt and get another shirt of equal or lesser value for free.', 2),
    (3, 'Flash Sale', 25.00, '2024-08-10', '2024-08-10', '25% off on selected shirts for 24 hours.', 3),
    (4, 'Holiday Special', 20.00, '2024-12-20', '2024-12-31', 'Celebrate the holidays with 20% off on all shirts.', 4),
    (5,'Black Friday', 50.00, '2024-11-29', '2024-11-29', 'One-day massive discount event.', 5),
    (6,'Cyber Monday', 40.00, '2024-12-02', '2024-12-02', 'Online sales for electronics and more.', 6),
    (7,'Christmas Sale', 25.00, '2024-12-20', '2024-12-25', 'Holiday season discounts.', 7),
    (8,'New Year Sale', 15.00, '2024-01-01', '2024-01-05', 'Celebrate the new year with discounts.', 8),
    (9,'Easter Promotion', 18.00, '2024-04-10', '2024-04-14', 'Limited-time offer for Easter celebration.', 9),
    (10,'Back to School', 12.50, '2024-08-15', '2024-08-30', 'School supplies and clothing discounts.', 10),
    (11,'Flash Sale', 30.00, '2024-05-01', '2024-05-01', 'One-day flash sale on selected items.', 11),
    (12,'Clearance Sale', 35.00, '2024-09-01', '2024-09-15', 'End of season clearance discounts.', 12),
    (13,'Halloween Sale', 22.00, '2024-10-28', '2024-10-31', 'Discounts on Halloween costumes and treats.', 13),
    (14,'Labor Day Sale', 18.00, '2024-09-01', '2024-09-03', 'Promotions for Labor Day weekend.', 14),
    (15,'Sale', 11.00, '2024-08-02', '2024-09-05', 'Promotions for weekend.', 15);
