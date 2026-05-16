-- Database: e_commerce_db
-- Run: CREATE DATABASE IF NOT EXISTS e_commerce_db; USE e_commerce_db; then execute this file.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    save_percent INT,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    size VARCHAR(50),
    quantity INT DEFAULT 1,
    recently_in_carts INT DEFAULT 0,
    hurry_text VARCHAR(100),
    delivery_text VARCHAR(100),
    offers_title VARCHAR(100),
    tax_text VARCHAR(120),
    description TEXT,
    display_category VARCHAR(120),
    show_buy_now BOOLEAN DEFAULT FALSE,
    category_id INT,
    brand_id INT,
    badge VARCHAR(50),
    badge_type VARCHAR(50),
    is_doctor_choice BOOLEAN DEFAULT FALSE,
    is_sold_out BOOLEAN DEFAULT FALSE,
    collection_sort INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    benefit_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    feature_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_trust_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    icon_url VARCHAR(512) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    initial_char CHAR(1) NOT NULL,
    name VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NULL,
    reviewer_initial CHAR(1),
    reviewer_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    review_title VARCHAR(255),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_better_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (parent_product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS press_logos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS concerns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS concern_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concern_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (concern_id) REFERENCES concerns(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS home_section_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    product_id INT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uq_section_order (section, sort_order)
);

CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(512) NOT NULL,
    alt_text VARCHAR(255),
    type ENUM('promo', 'dual') DEFAULT 'promo',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    action VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    status ENUM('draft', 'published', 'scheduled') DEFAULT 'draft',
    image_url VARCHAR(512),
    author VARCHAR(100) DEFAULT 'Admin',
    tags JSON,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
