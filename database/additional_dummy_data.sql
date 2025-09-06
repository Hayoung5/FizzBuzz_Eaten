-- user_id 1의 7일간 추가 더미 식사 기록

-- 9월 4일 (어제)
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '토스트', 180.0, 6.2, 28.5, 4.8, 2.1, 320.0, 3.2, true, false, '2025-09-04 08:30:00'),
(1, '샐러드', 95.0, 3.5, 12.8, 2.1, 4.5, 180.0, 8.2, false, false, '2025-09-04 13:20:00');

-- 9월 3일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '계란후라이', 155.0, 12.6, 1.2, 11.2, 0.0, 248.0, 0.4, false, false, '2025-09-03 07:45:00'),
(1, '치킨버거', 520.0, 28.5, 42.8, 25.2, 3.2, 980.0, 6.8, true, false, '2025-09-03 12:45:00'),
(1, '아이스크림', 180.0, 3.2, 22.5, 8.5, 0.5, 65.0, 18.2, true, true, '2025-09-03 20:15:00');

-- 9월 2일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '오트밀', 150.0, 5.3, 27.0, 3.0, 4.0, 2.0, 1.1, false, false, '2025-09-02 08:00:00'),
(1, '라면', 380.0, 8.5, 58.2, 14.2, 2.8, 1680.0, 4.5, true, false, '2025-09-02 19:30:00');

-- 9월 1일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '요거트', 120.0, 8.5, 15.2, 2.8, 0.0, 85.0, 12.5, false, true, '2025-09-01 10:20:00'),
(1, '스테이크', 450.0, 42.5, 2.8, 28.5, 0.0, 420.0, 0.5, false, false, '2025-09-01 18:45:00'),
(1, '감자튀김', 320.0, 4.2, 42.8, 15.2, 3.8, 480.0, 0.8, true, true, '2025-09-01 18:50:00');

-- 8월 31일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '김밥', 280.0, 8.5, 48.2, 6.8, 2.5, 650.0, 4.2, false, false, '2025-08-31 12:15:00');

-- 8월 30일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '시리얼', 220.0, 6.8, 42.5, 3.2, 5.2, 180.0, 12.8, true, false, '2025-08-30 08:45:00'),
(1, '피자 외 1개', 680.0, 28.5, 65.2, 32.8, 4.2, 1250.0, 8.5, true, false, '2025-08-30 19:20:00');

-- 8월 29일
INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, fiber, sodium, sugar, is_processed, is_snack, logged_at) VALUES
(1, '샌드위치', 350.0, 18.2, 38.5, 15.2, 3.8, 720.0, 5.2, true, false, '2025-08-29 13:30:00'),
(1, '과일주스', 140.0, 1.2, 35.8, 0.5, 1.2, 8.0, 28.5, false, true, '2025-08-29 16:00:00');
