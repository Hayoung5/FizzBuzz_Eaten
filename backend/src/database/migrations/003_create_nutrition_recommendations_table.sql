-- 영양 권장량 테이블 생성
-- 사용자별 개인화된 영양소 권장량 저장

CREATE TABLE IF NOT EXISTS nutrition_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT '사용자 ID',
    
    -- 일일 권장량
    recommended_calories DECIMAL(8,2) NOT NULL COMMENT '권장 칼로리(kcal)',
    recommended_carbohydrates DECIMAL(8,2) NOT NULL COMMENT '권장 탄수화물(g)',
    recommended_protein DECIMAL(8,2) NOT NULL COMMENT '권장 단백질(g)',
    recommended_fat DECIMAL(8,2) NOT NULL COMMENT '권장 지방(g)',
    recommended_sugar DECIMAL(8,2) NOT NULL COMMENT '권장 당류(g)',
    recommended_sodium DECIMAL(8,2) NOT NULL COMMENT '권장 나트륨(mg)',
    recommended_fiber DECIMAL(8,2) NOT NULL COMMENT '권장 식이섬유(g)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recommendation (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자별 영양 권장량 테이블';
