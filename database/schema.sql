-- FizzBuzz_Eaten Database Schema

-- 사용자 정보 테이블
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    age INT NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    activity ENUM('low', 'moderate', 'high') NOT NULL,
    reco_calories INT,
    reco_carbs INT,
    reco_protein INT,
    reco_fat INT,
    reco_sugar INT,
    reco_sodium INT,
    reco_fiber INT,
    oauth_provider VARCHAR(20),
    oauth_id VARCHAR(100),
    email VARCHAR(255),
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 음식 로그 테이블
CREATE TABLE food_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) NOT NULL,
    carbs DECIMAL(8,2) NOT NULL,
    fat DECIMAL(8,2) NOT NULL,
    fiber DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    sugar DECIMAL(8,2) DEFAULT 0,
    is_processed BOOLEAN DEFAULT FALSE,
    is_snack BOOLEAN DEFAULT FALSE,
    image_path VARCHAR(500),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_logged_at ON food_logs(logged_at);
