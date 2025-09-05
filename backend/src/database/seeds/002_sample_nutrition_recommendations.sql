-- 샘플 영양 권장량 데이터
-- 사용자별 개인화된 권장량 (나이, 성별, 활동량 기반)

INSERT INTO nutrition_recommendations (
    user_id, 
    recommended_calories, 
    recommended_carbohydrates, 
    recommended_protein, 
    recommended_fat, 
    recommended_sugar, 
    recommended_sodium, 
    recommended_fiber
) VALUES
(1, 2400, 300, 65, 50, 25, 2000, 25),  -- 25세 남성, 중간 활동량
(2, 2200, 275, 60, 45, 22, 1800, 22),  -- 30세 여성, 높은 활동량
(3, 2000, 250, 55, 40, 20, 1600, 20),  -- 35세 남성, 낮은 활동량
(4, 2100, 260, 58, 42, 21, 1700, 21),  -- 28세 여성, 중간 활동량
(5, 2600, 325, 70, 55, 28, 2200, 28);  -- 40세 남성, 높은 활동량
