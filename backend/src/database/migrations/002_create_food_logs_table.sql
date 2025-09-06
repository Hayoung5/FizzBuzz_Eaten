-- 음식 로그 테이블 생성
-- 사용자별 음식 섭취 기록 및 영양정보 저장

CREATE TABLE IF NOT EXISTS food_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '사용자 ID',
    food_name VARCHAR(255) NOT NULL COMMENT '음식명',
    portion_size VARCHAR(100) NOT NULL COMMENT '분량',
    meal_time TIMESTAMP NOT NULL COMMENT '섭취 시간',
    
    -- 영양정보
    calories DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '칼로리(kcal)',
    carbohydrates DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '탄수화물(g)',
    protein DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '단백질(g)',
    fat DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '지방(g)',
    sugar DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '당류(g)',
    sodium DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '나트륨(mg)',
    fiber DECIMAL(8,2) NOT NULL DEFAULT 0 COMMENT '식이섬유(g)',
    
    -- 분류 정보
    is_processed BOOLEAN DEFAULT FALSE COMMENT '가공식품 여부',
    is_snack BOOLEAN DEFAULT FALSE COMMENT '간식 여부',
    
    -- 이미지 정보
    image_path VARCHAR(500) COMMENT '업로드된 이미지 경로',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_meal_time (user_id, meal_time),
    INDEX idx_meal_time (meal_time),
    INDEX idx_food_name (food_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='음식 섭취 로그 테이블';
