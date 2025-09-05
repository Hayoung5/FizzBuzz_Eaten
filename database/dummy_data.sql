-- 사용자 더미 데이터 (OAuth 사용자 포함)
INSERT INTO users (id, age, gender, activity, reco_calories, reco_carbs, reco_protein, reco_fat, reco_sugar, reco_sodium, reco_fiber, oauth_provider, oauth_id, email, name) VALUES
(1, 25, 'male', 'high', 2800, 360, 65, 75, 40, 2000, 25, 'kakao', '4431218711', null, '미연동 계정');

-- user_id 1의 더미 식사 기록 데이터

INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '김치찌개', 320.5, 18.2, 25.3, 15.8, 4.2, 1200.0, 8.5, false, false, '2025-09-05 12:30:00'),
(1, '현미밥', 218.0, 4.5, 44.8, 1.8, 3.5, 2.0, 0.8, false, false, '2025-09-05 12:30:00'),
(1, '바나나', 89.0, 1.1, 22.8, 0.3, 2.6, 1.0, 12.2, false, true, '2025-09-05 15:20:00'),
(1, '닭가슴살 샐러드', 185.5, 28.5, 8.2, 4.1, 3.8, 450.0, 5.2, false, false, '2025-09-05 19:15:00'),
(1, '아메리카노', 5.0, 0.3, 0.0, 0.0, 0.0, 5.0, 0.0, false, true, '2025-09-05 21:00:00');
