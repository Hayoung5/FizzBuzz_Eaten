/**
 * 파일 업로드 미들웨어
 * - multer를 사용한 이미지 파일 업로드 처리
 * - 파일 저장 경로 및 이름 설정
 * 
 * TODO: 실제 구현시 추가할 기능들
 * - 파일 형식 제한 (jpg, png만 허용)
 * - 파일 크기 제한 (예: 5MB)
 * - 이미지 리사이징
 * - AWS S3 업로드 연동
 */

const multer = require('multer');
const path = require('path');

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const uploadDir = 'uploads/';
    
    // uploads 폴더가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명: 타임스탬프 + 원본 확장자
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// TODO: 파일 필터링 추가
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed'), false);
//   }
// };

// TODO: 파일 크기 제한
// const limits = {
//   fileSize: 5 * 1024 * 1024 // 5MB
// };

const upload = multer({ 
  storage 
  // fileFilter,
  // limits
});

module.exports = upload;
