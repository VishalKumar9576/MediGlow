-- Seed data matching src/assets/data/homeData.js — run after schema.sql on database e_commerce_db
-- MySQL Workbench: select schema, then run this script.

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE order_history;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE carts;
TRUNCATE TABLE concern_products;
TRUNCATE TABLE home_section_products;
TRUNCATE TABLE product_better_results;
TRUNCATE TABLE product_questions;
TRUNCATE TABLE product_trust_points;
TRUNCATE TABLE product_faqs;
TRUNCATE TABLE product_reviews;
TRUNCATE TABLE product_benefits;
TRUNCATE TABLE product_features;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE banners;
TRUNCATE TABLE features;
TRUNCATE TABLE press_logos;
TRUNCATE TABLE concerns;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;

SET FOREIGN_KEY_CHECKS = 1;

-- Categories
INSERT INTO categories (id, title, image) VALUES
(1, 'Facewash', '/src/assets/images/blogs/1._Facewash_c53367d7-5f0b-451c-84c6-cf3f28b225bc.webp'),
(2, 'Serum', '/src/assets/images/blogs/2._Serum.webp'),
(3, 'Moisturiser', '/src/assets/images/blogs/3._Moisturiser.webp'),
(4, 'Sunscreen', '/src/assets/images/blogs/4._Sunscreen.webp'),
(5, 'Hair Care', '/src/assets/images/blogs/5._Luxe.webp'),
(6, 'Supplements', '/src/assets/images/blogs/1._Facewash_c53367d7-5f0b-451c-84c6-cf3f28b225bc.webp');

-- Brands (9 rows — same as frontend)
INSERT INTO brands (id, name, image) VALUES
(1, 'Minimalist', '/src/assets/images/brands/Cerave_f7f51413-9410-4a8b-b9a7-a97c922dd822.webp'),
(2, 'Cipla', '/src/assets/images/brands/Cetaphil_a4e5a2e4-6877-4146-95a8-966c5e6263b1.webp'),
(3, 'ISDIN', '/src/assets/images/brands/Minimalist_b05ee061-8e9e-4885-93a2-5726bf7f80f8.webp'),
(4, 'Bioderma', '/src/assets/images/brands/Scalpe_c7a08144-3965-4d7c-9c45-050bf71314c6.webp'),
(5, 'Fixderma', '/src/assets/images/brands/Sesderma_5ae1614b-883a-4fe2-8702-95644e36f995.webp'),
(6, 'Cetaphil', '/src/assets/images/brands/Skin-1004_2.webp'),
(7, 'Bioderma', '/src/assets/images/brands/Scalpe_c7a08144-3965-4d7c-9c45-050bf71314c6.webp'),
(8, 'Fixderma', '/src/assets/images/brands/Sesderma_5ae1614b-883a-4fe2-8702-95644e36f995.webp'),
(9, 'Cetaphil', '/src/assets/images/brands/Skin-1004_2.webp');

-- Products (1–52 sections + 53 detail page)
INSERT INTO products (id, name, slug, price, old_price, save_percent, rating, review_count, size, quantity, recently_in_carts, hurry_text, delivery_text, offers_title, tax_text, description, display_category, show_buy_now, category_id, brand_id, badge, badge_type, is_doctor_choice, is_sold_out, collection_sort) VALUES
(1, 'New Follihair Tablet (Bottle)', 'new-follihair-tablet-bottle', 639.00, 782.00, NULL, 4.80, 366, '1 Unit', 1, 1600, 'Hurry, Few Left!', 'Get it By tomorrow', 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 6, 2, NULL, NULL, FALSE, FALSE, NULL),
(2, 'IPCA Regulating Moisturizer', 'ipca-regulating-moisturizer', 489.00, 618.00, NULL, 4.60, 166, '50 gm', 1, 800, NULL, 'Get it By Mar. 31', 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 2, NULL, NULL, TRUE, FALSE, NULL),
(3, 'Saslic DS Foaming Face Wash', 'saslic-ds-foaming-face-wash', 389.00, 495.00, NULL, 4.70, 240, '60 ml', 1, 1200, 'Few Left!', 'Get it today', 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 2, 'BEST SELLER', 'save', FALSE, FALSE, NULL),
(4, 'Scalpe Plus Dandruff Shampoo', 'scalpe-plus-dandruff-shampoo', 259.00, 335.00, NULL, 4.90, 409, '100 ml', 1, 500, NULL, 'Get it By tomorrow', 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 5, 4, NULL, NULL, FALSE, FALSE, NULL),
(5, 'Clinikally Anti-Dandruff Shampoo', 'clinikally-anti-dandruff-shampoo', 319.00, 399.00, NULL, 4.80, 120, '200 ml', 1, 400, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 5, 1, 'SAVE 20%', 'save', FALSE, FALSE, NULL),
(6, 'Clinikally Gentle Skin Cleanser', 'clinikally-gentle-skin-cleanser', 439.00, 549.00, NULL, 4.86, 88, '125 ml', 1, 300, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 1, 'SAVE 20%', 'save', FALSE, FALSE, NULL),
(7, 'Clinikally HydraSoothe Moisturiser', 'clinikally-hydrasoothe-moisturiser', 919.00, 999.00, NULL, 4.61, 210, '50 gm', 1, 600, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 1, 'SAVE 8%', 'save', TRUE, FALSE, NULL),
(8, 'Clinikally Sunscreen SPF 50/PA+++', 'clinikally-sunscreen-spf-50', 809.00, 899.00, NULL, 4.88, 340, '50 gm', 1, 900, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 1, 'SAVE 10%', 'save', TRUE, FALSE, NULL),
(9, 'Clinikally Sunscreen SPF 50/PA+++ (2)', 'clinikally-sunscreen-spf-50-2', 809.00, 899.00, NULL, 4.88, 200, '50 gm', 1, 700, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 1, 'SAVE 10%', 'save', TRUE, FALSE, NULL),
(10, 'Clinikally Sunscreen SPF 50/PA+++ (3)', 'clinikally-sunscreen-spf-50-3', 809.00, 899.00, NULL, 4.88, 150, '50 gm', 1, 500, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 1, 'SAVE 10%', 'save', TRUE, FALSE, NULL),
(11, 'IPCA Acne-UV Gel Sunscreen SPF 50', 'ipca-acne-uv-gel-sunscreen-spf-50', 639.00, 782.00, NULL, 4.80, 366, '50 gm', 1, 1100, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 2, NULL, NULL, FALSE, FALSE, NULL),
(12, 'Acne-OC Sebum Regulating Moisturizer', 'acne-oc-sebum-regulating-moisturizer', 489.00, 618.00, NULL, 4.60, 166, '50 gm', 1, 400, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 2, NULL, NULL, FALSE, FALSE, NULL),
(13, 'Saslic DS Foaming Face Wash (Concern)', 'saslic-ds-foaming-face-wash-concern', 389.00, 495.00, NULL, 4.70, 240, '60 ml', 1, 800, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 2, NULL, NULL, FALSE, FALSE, NULL),
(14, 'Scalpe Plus Expert Anti Dandruff Shampoo', 'scalpe-plus-expert-anti-dandruff-shampoo', 259.00, 335.00, NULL, 4.90, 409, '100 ml', 1, 600, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 5, 4, NULL, NULL, FALSE, FALSE, NULL),
(15, 'Brightening Repair Serum', 'brightening-repair-serum', 599.00, 749.00, NULL, 4.80, 190, '30 ml', 1, 300, NULL, NULL, 'Offer', '(incl. of all taxes.)', NULL, NULL, FALSE, 2, 1, 'BEST', 'save', FALSE, FALSE, NULL),
(16, 'Pigmentation Correcting Cream', 'pigmentation-correcting-cream', 479.00, 599.00, NULL, 4.40, 76, '50 gm', 1, 150, NULL, NULL, 'Offer', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 3, NULL, NULL, FALSE, FALSE, NULL),
(17, 'Glow Face Cleanser', 'glow-face-cleanser', 349.00, 449.00, NULL, 4.60, 144, '100 ml', 1, 200, NULL, NULL, 'Offer', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 1, NULL, NULL, FALSE, FALSE, NULL),
(18, 'Radiance Day Moisturizer', 'radiance-day-moisturizer', 629.00, 799.00, NULL, 4.70, 132, '50 gm', 1, 180, NULL, NULL, 'Offer', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 1, NULL, NULL, FALSE, FALSE, NULL),
(19, 'Hydra Intense Moisturiser', 'hydra-intense-moisturiser', 699.00, 849.00, NULL, 4.90, 221, '50 gm', 1, 250, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 1, NULL, NULL, FALSE, FALSE, NULL),
(20, 'Barrier Repair Cream', 'barrier-repair-cream', 559.00, 699.00, NULL, 4.70, 140, '50 gm', 1, 160, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 2, NULL, NULL, FALSE, FALSE, NULL),
(21, 'Creamy Hydrating Cleanser', 'creamy-hydrating-cleanser', 379.00, 459.00, NULL, 4.60, 109, '100 ml', 1, 140, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 1, NULL, NULL, FALSE, FALSE, NULL),
(22, 'Nourishing Skin Lotion', 'nourishing-skin-lotion', 499.00, 649.00, NULL, 4.80, 160, '200 ml', 1, 190, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 1, NULL, NULL, FALSE, FALSE, NULL),
(23, 'Hair Growth Supplement', 'hair-growth-supplement', 799.00, 949.00, NULL, 4.80, 260, '30 tabs', 1, 320, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 6, 2, NULL, NULL, FALSE, FALSE, NULL),
(24, 'Anti Hair Fall Solution', 'anti-hair-fall-solution', 399.00, 499.00, NULL, 4.50, 145, '60 ml', 1, 210, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 5, 4, NULL, NULL, FALSE, FALSE, NULL),
(25, 'Hair Regrowth Serum', 'hair-regrowth-serum', 699.00, 839.00, NULL, 4.70, 117, '30 ml', 1, 175, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 2, 1, NULL, NULL, FALSE, FALSE, NULL),
(26, 'Anti Dandruff Hair Shampoo', 'anti-dandruff-hair-shampoo', 549.00, 699.00, NULL, 4.60, 208, '100 ml', 1, 240, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 5, 4, NULL, NULL, FALSE, FALSE, NULL),
(27, 'Avene Cleanance Cleansing Gel', 'avene-cleanance-cleansing-gel', 1119.00, 1250.00, NULL, 4.50, 27, '200 ml', 1, 90, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 3, NULL, NULL, FALSE, FALSE, NULL),
(28, 'Uriage Creme Lavante Cleansing Cream', 'uriage-creme-lavante-cleansing-cream', 899.00, 900.00, NULL, 4.40, 38, '200 ml', 1, 75, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 3, NULL, NULL, FALSE, FALSE, NULL),
(29, 'IPCA Acne-UV Advanced Light Protection Silicone', 'ipca-acne-uv-advanced-light-protection-silicone', 799.00, 975.00, NULL, 4.60, 222, '50 gm', 1, 400, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 2, NULL, NULL, FALSE, FALSE, NULL),
(30, 'Excela Moisturiser for Oily & Acne Prone Skin', 'excela-moisturiser-oily-acne', 469.00, 555.00, NULL, 4.50, 271, '50 gm', 1, 310, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 2, NULL, NULL, FALSE, FALSE, NULL),
(31, 'Ethiglo Face Wash', 'ethiglo-face-wash', 219.00, 260.00, NULL, 4.30, 218, '70 gm', 1, 280, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 2, NULL, NULL, FALSE, FALSE, NULL),
(32, 'IPCA Acne-UV Advanced Light Protection Silicone (2)', 'ipca-acne-uv-advanced-2', 799.00, 975.00, NULL, 4.60, 222, '50 gm', 1, 350, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 2, NULL, NULL, FALSE, FALSE, NULL),
(33, 'Excela Moisturiser for Oily & Acne Prone Skin (2)', 'excela-moisturiser-2', 469.00, 555.00, NULL, 4.50, 271, '50 gm', 1, 290, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 3, 2, NULL, NULL, FALSE, FALSE, NULL),
(34, 'Ethiglo Face Wash (2)', 'ethiglo-face-wash-2', 219.00, 260.00, NULL, 4.30, 218, '70 gm', 1, 265, NULL, NULL, 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 1, 2, NULL, NULL, FALSE, FALSE, NULL),
(35, 'Clinikally HydraSoft Gentle', 'clinikally-hydrasoft-gentle', 399.00, 499.00, NULL, 4.52, 156, '250 ml', 1, 420, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Clinikally HydraSoft Gentle Skin Cleanse.', 'Skin Cleanser', FALSE, 1, 1, 'SAVE 20%', 'save', FALSE, FALSE, 1),
(36, 'Clinikally Foaming Face Wash', 'clinikally-foaming-face-wash', 919.00, 999.00, NULL, 4.90, 412, '100 ml', 1, 510, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Clinikally Foaming Face Wash is crafted with a blend of Dermawhite.', 'Skin Cleanser', FALSE, 1, 1, 'SAVE 8%', 'save', TRUE, FALSE, 2),
(37, 'Accare Foaming Face Wash', 'accare-foaming-face-wash-c1', 379.00, 425.00, NULL, 4.60, 198, '100 ml', 1, 360, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Accare Foaming Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 11%', 'save', FALSE, FALSE, 3),
(38, 'Achigun Face Wash', 'achigun-face-wash', 499.00, 575.00, NULL, 4.41, 167, '100 ml', 1, 220, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Achigun Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 13%', 'save', FALSE, FALSE, 4),
(39, 'Acjuve Skin Rejuvenating Face Wash', 'acjuve-skin-rejuvenating-face-wash', 449.00, 475.00, NULL, 4.86, 289, '100 ml', 1, 180, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acjuve Skin Rejuvenating Face Wash is enriched with powerful.', 'Skin Cleanser', FALSE, 1, 1, 'SOLD OUT', 'soldout', FALSE, TRUE, 5),
(40, 'Acmed Gentle Pimple Care Face Wash', 'acmed-gentle-pimple-care-face-wash', 209.00, 220.00, NULL, 4.75, 134, '70 gm', 1, 290, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acmed Gentle Pimple Care Face Wash is specially formulated for oily.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 5%', 'save', FALSE, FALSE, 6),
(41, 'Accare Foaming Face Wash (2)', 'accare-foaming-face-wash-2', 379.00, 425.00, NULL, 4.60, 198, '100 ml', 1, 340, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Accare Foaming Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 11%', 'save', TRUE, FALSE, 7),
(42, 'Achigun Face Wash (2)', 'achigun-face-wash-2', 499.00, 575.00, NULL, 4.41, 167, '100 ml', 1, 210, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Achigun Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 13%', 'save', FALSE, FALSE, 8),
(43, 'Acjuve Skin Rejuvenating Face Wash (2)', 'acjuve-skin-rejuvenating-face-wash-2', 449.00, 475.00, NULL, 4.86, 289, '100 ml', 1, 170, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acjuve Skin Rejuvenating Face Wash is enriched with powerful.', 'Skin Cleanser', FALSE, 1, 1, 'SOLD OUT', 'soldout', TRUE, TRUE, 9),
(44, 'Acmed Gentle Pimple Care Face Wash (2)', 'acmed-gentle-pimple-care-face-wash-2', 209.00, 220.00, NULL, 4.75, 134, '70 gm', 1, 275, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acmed Gentle Pimple Care Face Wash is specially formulated.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 5%', 'save', FALSE, FALSE, 10),
(45, 'Accare Foaming Face Wash (3)', 'accare-foaming-face-wash-3', 379.00, 425.00, NULL, 4.60, 198, '100 ml', 1, 330, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Accare Foaming Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 11%', 'save', FALSE, FALSE, 11),
(46, 'Achigun Face Wash (3)', 'achigun-face-wash-3', 499.00, NULL, NULL, 4.41, 167, '100 ml', 1, 200, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Achigun Face Wash is specially formulated to fight acne.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 13%', 'save', FALSE, FALSE, 12),
(47, 'Acjuve Skin Rejuvenating Face Wash (3)', 'acjuve-skin-rejuvenating-face-wash-3', 449.00, 475.00, NULL, 4.86, 289, '100 ml', 1, 165, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acjuve Skin Rejuvenating Face Wash is enriched with powerful.', 'Skin Cleanser', FALSE, 1, 1, 'SOLD OUT', 'soldout', FALSE, TRUE, 13),
(48, 'Acmed Gentle Pimple Care Face Wash (3)', 'acmed-gentle-pimple-care-face-wash-3', 209.00, 220.00, NULL, 4.75, 134, '70 gm', 1, 260, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acmed Gentle Pimple Care Face Wash is specially formulated for oily.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 5%', 'save', FALSE, FALSE, 14),
(49, 'Acjuve Skin Rejuvenating Face Wash (4)', 'acjuve-skin-rejuvenating-face-wash-4', 449.00, 475.00, NULL, 4.86, 289, '100 ml', 1, 155, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acjuve Skin Rejuvenating Face Wash is enriched with powerful.', 'Skin Cleanser', FALSE, 1, 1, 'SOLD OUT', 'soldout', FALSE, TRUE, 15),
(50, 'Acmed Gentle Pimple Care Face Wash (4)', 'acmed-gentle-pimple-care-face-wash-4', 209.00, 220.00, NULL, 4.75, 134, '70 gm', 1, 250, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acmed Gentle Pimple Care Face Wash is specially formulated for oily.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 5%', 'save', FALSE, FALSE, 16),
(51, 'Acjuve Skin Rejuvenating Face Wash (5)', 'acjuve-skin-rejuvenating-face-wash-5', 449.00, 475.00, NULL, 4.86, 289, '100 ml', 1, 145, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acjuve Skin Rejuvenating Face Wash is enriched with powerful.', 'Skin Cleanser', FALSE, 1, 1, 'SOLD OUT', 'soldout', FALSE, TRUE, 17),
(52, 'Acmed Gentle Pimple Care Face Wash (5)', 'acmed-gentle-pimple-care-face-wash-5', 209.00, 220.00, NULL, 4.75, 134, '70 gm', 1, 240, NULL, NULL, 'Available offers', '(incl. of all taxes.)', 'Acmed Gentle Pimple Care Face Wash is specially formulated for oily.', 'Skin Cleanser', FALSE, 1, 2, 'SAVE 5%', 'save', FALSE, FALSE, 18),
(53, 'IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++', 'accare-foaming-face-wash', 379.00, 425.00, 11, 4.60, 25, '100 ml', 1, 1676, 'Hurry, Few Left!', 'Get it By Mar. 28*', 'Available offers', '(incl. of all taxes.)', NULL, NULL, FALSE, 4, 2, NULL, NULL, FALSE, FALSE, NULL);

-- Product images (main/card image = first row per product)
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, '/src/assets/images/products/IPCAAcne-UVGelSunscreenSPF50PA_50gm1_27d591d5-6c42-49fe-8f73-b09e1b2d23e3_400x400.webp', 0),
(2, '/src/assets/images/products/Mintop5_60ML-1_400x400.webp', 0),
(3, '/src/assets/images/products/MorrF5_400x400.webp', 0),
(4, '/src/assets/images/products/ScalpePlusExpertAntiDandruffShampoo_900_w_x675_h_-01_400x400.webp', 0),
(5, '/src/assets/images/products/SunsScalpShampoo-6.webp', 0),
(6, '/src/assets/images/products/hydra.webp', 0),
(7, '/src/assets/images/products/unhideSunProtectSPF50_PA__900_w_x675_h_-01_1.webp', 0),
(8, '/src/assets/images/products/Hydrasoothe-3.webp', 0),
(9, '/src/assets/images/products/hydra.webp', 0),
(10, '/src/assets/images/products/hydra.webp', 0),
(11, '/src/assets/images/products/IPCAAcne-UVGelSunscreenSPF50PA_50gm1_27d591d5-6c42-49fe-8f73-b09e1b2d23e3_400x400.webp', 0),
(12, '/src/assets/images/products/Mintop5_60ML-1_400x400.webp', 0),
(13, '/src/assets/images/products/MorrF5_400x400.webp', 0),
(14, '/src/assets/images/products/ScalpePlusExpertAntiDandruffShampoo_900_w_x675_h_-01_400x400.webp', 0),
(15, '/src/assets/images/products/Mintop5_60ML-1_400x400.webp', 0),
(16, '/src/assets/images/products/MorrF5_400x400.webp', 0),
(17, '/src/assets/images/products/IPCAAcne-UVGelSunscreenSPF50PA_50gm1_27d591d5-6c42-49fe-8f73-b09e1b2d23e3_400x400.webp', 0),
(18, '/src/assets/images/products/ScalpePlusExpertAntiDandruffShampoo_900_w_x675_h_-01_400x400.webp', 0),
(19, '/src/assets/images/products/MorrF5_400x400.webp', 0),
(20, '/src/assets/images/products/ScalpePlusExpertAntiDandruffShampoo_900_w_x675_h_-01_400x400.webp', 0),
(21, '/src/assets/images/products/Mintop5_60ML-1_400x400.webp', 0),
(22, '/src/assets/images/products/IPCAAcne-UVGelSunscreenSPF50PA_50gm1_27d591d5-6c42-49fe-8f73-b09e1b2d23e3_400x400.webp', 0),
(23, '/src/assets/images/products/IPCAAcne-UVGelSunscreenSPF50PA_50gm1_27d591d5-6c42-49fe-8f73-b09e1b2d23e3_400x400.webp', 0),
(24, '/src/assets/images/products/Mintop5_60ML-1_400x400.webp', 0),
(25, '/src/assets/images/products/MorrF5_400x400.webp', 0),
(26, '/src/assets/images/products/ScalpePlusExpertAntiDandruffShampoo_900_w_x675_h_-01_400x400.webp', 0),
(27, '/src/assets/images/products/SunsScalpShampoo-6.webp', 0),
(28, '/src/assets/images/products/hydra.webp', 0),
(29, '/src/assets/images/products/Hydrasoothe-3.webp', 0),
(30, '/src/assets/images/products/Hydrasoothe-3.webp', 0),
(31, '/src/assets/images/products/hydra.webp', 0),
(32, '/src/assets/images/products/Hydrasoothe-3.webp', 0),
(33, '/src/assets/images/products/Hydrasoothe-3.webp', 0),
(34, '/src/assets/images/products/hydra.webp', 0),
(35, '/src/assets/images/collections/Acmed250ml03.webp', 0),
(36, '/src/assets/images/collections/AcnechioFW_eb474b7c-2981-4f46-9d00-100139c89956.webp', 0),
(37, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(38, '/src/assets/images/collections/ClinikallyHydraSoftCleanser_Front_1.webp', 0),
(39, '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 0),
(40, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(41, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(42, '/src/assets/images/collections/ClinikallyHydraSoftCleanser_Front_1.webp', 0),
(43, '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 0),
(44, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(45, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(46, '/src/assets/images/collections/ClinikallyHydraSoftCleanser_Front_1.webp', 0),
(47, '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 0),
(48, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(49, '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 0),
(50, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(51, '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 0),
(52, '/src/assets/images/collections/actame-men-face-wash1.webp', 0),
(53, '/src/assets/images/details/AccareFaceWash1_e3cdaa40-35db-421e-bc11-5b1ae7ec1c6e.webp', 0);

INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(53, '/src/assets/images/details/AccareFaceWash2_c57774b5-57f8-4720-841e-cc8371912580.webp', 1),
(53, '/src/assets/images/details/AccareFaceWash3_58016833-31ca-4e01-823b-0ca5d43d5531.webp', 2),
(53, '/src/assets/images/details/AccareFaceWash4.webp', 3),
(53, '/src/assets/images/details/Updated-Authenticity-Certificate_e7522be4-d8a3-4470-81b3-7b02eb0f3139.webp', 4);

-- Detail product (53) extras
INSERT INTO product_benefits (product_id, benefit_text) VALUES
(53, 'Clears Acne'), (53, 'Reduces Oil'), (53, 'Soothes Skin');

INSERT INTO product_trust_points (product_id, title, icon_url, sort_order) VALUES
(53, '100% Original', '/src/assets/images/details/shield.webp', 0),
(53, 'Lowest Price', '/src/assets/images/details/Lowest_price_Icon_fddb029e-c955-49c5-9edc-4dd5cffdf0c0.avif', 1),
(53, 'Ships Free > ₹599', '/src/assets/images/details/FreeShipping_icon_51f0da0c-8848-48c3-acf6-2ae61cd93177.png', 2);

INSERT INTO product_faqs (product_id, question, answer) VALUES
(53, 'What skin types is IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++ suitable for?', 'It is generally suitable for oily, acne-prone, and combination skin types because of its lightweight silicone gel texture.'),
(53, 'Does IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++ clog pores?', 'No, it is designed to be lightweight and non-greasy, which helps reduce the chances of clogged pores when used properly.'),
(53, 'How often should I apply IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++?', 'You should apply it 15–20 minutes before sun exposure and reapply every 2–3 hours, especially after sweating or washing your face.'),
(53, 'Can IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++ be used under makeup?', 'Yes, its smooth gel-based texture works well under makeup and can act as a lightweight base.'),
(53, 'Is IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++ effective against both UVA and UVB rays?', 'Yes, the PA++++ and SPF 50+ protection indicates broad-spectrum coverage against both UVA and UVB rays.'),
(53, 'Can I use IPCA Acne-UV Advanced Light Protection Silicone Sunscreen Gel SPF 50+ PA++++ on my entire body?', 'It can be used on exposed areas, but it is most commonly used on the face, neck, and other sun-exposed skin.');

INSERT INTO product_questions (product_id, initial_char, name, question, answer, sort_order) VALUES
(53, 'T', 'Tasmia', 'Is this sunscreen suitable for oily sensitive allergic prone skin??', 'Yes, IPCA Acne-UV Advanced Sunscreen Gel SPF 50+ PA++++ is generally suitable for oily and sensitive skin, as it is oil-free and non-comedogenic. However, for allergy-prone skin, it is advisable to perform a patch test before regular use to ensure compatibility.', 0),
(53, 'S', 'Sakshi', 'What is the expiry date ?', 'Expiry Date will be mentioned on the received box, but be assured you’ll receive the latest batch product with a expiry date of atleast 6 months.', 1),
(53, 'P', 'Piyush', 'Is this sunscreen suitable for oily sensitive allergic prone skin??', 'Yes, IPCA Acne-UV Advanced Sunscreen Gel SPF 50+ PA++++ is generally suitable for oily and sensitive skin, as it is oil-free and non-comedogenic. However, for allergy-prone skin, it is advisable to perform a patch test before regular use to ensure compatibility.', 2),
(53, 'R', 'Rishu Kumar', 'What is the expiry date ?', 'Expiry Date will be mentioned on the received box, but be assured you’ll receive the latest batch product with a expiry date of atleast 6 months.', 3);

INSERT INTO product_reviews (product_id, user_id, reviewer_initial, reviewer_name, is_verified, review_title, rating, comment) VALUES
(53, NULL, 'A', 'Aarthi', FALSE, 'Old formula is good', 4, 'I have been using this product for the past year and really liked it .However, the new version is disappointing. Kindly bring back the old formula.'),
(53, NULL, 'A', 'Arti Devi', TRUE, '', 5, 'This acne prone really works very well good for acne prone skin'),
(53, NULL, 'A', 'Anchal', TRUE, 'Amazing', 5, 'All products are great quality'),
(53, NULL, 'S', 'Sinchana Achinth Achinth', TRUE, '', 5, 'Very nice product and useful for daily skincare routine.');

INSERT INTO product_better_results (parent_product_id, name, image_url, rating, reviews, price, old_price, sort_order) VALUES
(53, 'Hexilak Acne Plus Scar Serum 2 in 1 ', '/src/assets/images/collections/ClinikallyHydraSoftCleanser_Front_1.webp', 4.00, 222, 739.00, 880.00, 0),
(53, 'Acnechio-OD Tablet 2 in 1 Face Wash', '/src/assets/images/products/SunsScalpShampoo-6.webp', 5.00, 35, 289.00, 329.00, 1),
(53, 'Yuderma Sebalex 2 in 1 Face Wash', '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 5.00, 78, 529.00, 540.00, 2),
(53, 'Ridacne SA Foaming Face Wash', '/src/assets/images/products/SunsScalpShampoo-6.webp', 4.00, 125, 549.00, NULL, 3),
(53, 'Depiclear Skin Rejuvenating Face Wash Gel', '/src/assets/images/collections/unhide_ClinikallyFoamingFaceWash_900_w_x675_h_-02_1.webp', 4.00, 170, 289.00, 320.00, 4);

INSERT INTO press_logos (name, image_url, sort_order) VALUES
('India Today', '/src/assets/images/brands/India_Today.webp', 0),
('Crunchbase News', '/src/assets/images/brands/Crunchbase_News_8a75e558-409b-42dc-af6d-498a7b8cd7f7.avif', 1),
('Mint', '/src/assets/images/brands/Mint_a1d2b2d2-fb5d-4b51-aaff-67ca5e9e9cb2.webp', 2),
('Elle', '/src/assets/images/brands/Elle.webp', 3),
('Hindustan Times', '/src/assets/images/brands/India_Today.webp', 4),
('Elle', '/src/assets/images/brands/NEWS_18.webp', 5),
('Hindustan Times', '/src/assets/images/brands/Sesderma_5ae1614b-883a-4fe2-8702-95644e36f995.webp', 6),
('India Today', '/src/assets/images/brands/India_Today.webp', 7),
('Crunchbase News', '/src/assets/images/brands/Crunchbase_News_8a75e558-409b-42dc-af6d-498a7b8cd7f7.avif', 8),
('Mint', '/src/assets/images/brands/Mint_a1d2b2d2-fb5d-4b51-aaff-67ca5e9e9cb2.webp', 9);

INSERT INTO concerns (id, name) VALUES
(1, 'Acne & Acne Scars'),
(2, 'Pigmentation'),
(3, 'Dandruff'),
(4, 'Hair Fall & Hair Loss');

INSERT INTO concern_products (concern_id, product_id) VALUES
(1, 11), (1, 12), (1, 13), (1, 14),
(2, 15), (2, 16), (2, 17), (2, 18),
(3, 19), (3, 20), (3, 21), (3, 22),
(4, 23), (4, 24), (4, 25), (4, 26);

INSERT INTO home_section_products (section, product_id, sort_order) VALUES
('top_seller', 1, 0),
('top_seller', 2, 1),
('top_seller', 3, 2),
('top_seller', 4, 3),
('top_seller', 3, 4),
('top_seller', 4, 5),
('essentials', 5, 0),
('essentials', 6, 1),
('essentials', 7, 2),
('essentials', 8, 3),
('essentials', 9, 4),
('essentials', 10, 5),
('trending', 27, 0),
('trending', 28, 1),
('trending', 29, 2),
('trending', 30, 3),
('trending', 31, 4),
('trending', 32, 5),
('trending', 33, 6),
('trending', 34, 7);

INSERT INTO banners (image_url, alt_text, type, sort_order) VALUES
('/src/assets/images/home/ban1.jpg', 'Sun protection banner 1', 'promo', 0),
('/src/assets/images/home/ban2.jpg', 'Sun protection banner 2', 'promo', 1),
('/src/assets/images/home/ban2.jpg', 'Sun protection banner 3', 'promo', 2),
('/src/assets/images/home/ban3.jpg', 'Sun protection banner 4', 'promo', 3),
('/src/assets/images/home/ban1.jpg', 'Sun protection banner 5', 'promo', 4),
('/src/assets/images/home/ban2.jpg', 'Dual promo banner 1', 'dual', 0),
('/src/assets/images/home/ban3.jpg', 'Dual promo banner 2', 'dual', 1);

INSERT INTO features (title, subtitle, image_url) VALUES
('COD Available', 'Pan-India', '/src/assets/images/collections/cod.avif'),
('Free Delivery', 'Above ₹599', '/src/assets/images/collections/free.avif'),
('100% Real', 'Products', '/src/assets/images/collections/certified.avif'),
('Dermatologist', 'Written', '/src/assets/images/collections/dermatologist.avif');

ALTER TABLE products AUTO_INCREMENT = 54;
