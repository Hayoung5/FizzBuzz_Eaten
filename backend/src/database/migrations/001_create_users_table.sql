-- 사용자 테이블 생성
-- 사용자 기본 정보 및 개인 설정 저장

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    age INT NOT NULL COMMENT '나이',
    gender ENUM('male', 'female') NOT NULL COMMENT '성별',
    activity ENUM('low', 'medium', 'high') NOT NULL COMMENT '활동량',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    
    INDEX idx_created_at (created_at),
    INDEX idx_age_gender (age, gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보 테이블';
