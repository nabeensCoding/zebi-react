# 제비: 제휴의 비밀 - Backend

> 내가 누릴 수 있는 제휴만 지도에 띄워주는 앱서비스

## 🛠 Tech Stack
- **Node.js** + **Express.js**
- **PostgreSQL**
- **JWT Authentication**
- **Multer** (파일 업로드)

## 📂 프로젝트 구조
```
src/
├── routes/
│   ├── apiRoutes.js          # 사용자 앱 API
│   └── dashboardRoutes.js    # 관리자 대시보드 API
├── middlewares/
│   ├── auth_middleware.js    # JWT 인증
│   └── multer_middleware.js  # 파일 업로드
└── services/
    └── mapService.js          # 지도 생성 로직
```

## 📱 API 기능

### apiRoutes.js - 사용자 앱
| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 인증 | `/api/login`, `/api/refresh` | JWT 기반 로그인/토큰 갱신 |
| 대학 인증 | `/api/college-auth/request` | 학생증 이미지로 단과대 인증 |
| 프로필 | `/api/me`, `/api/getUserCollege` | 사용자 정보 및 인증 상태 조회 |
| 지도 | `/api/map` | 사용자 맞춤 제휴 매장 지도 HTML 생성 |
| 로그 | `/api/logUserClick` | 사용자 매장 클릭 이벤트 추적 |

### dashboardRoutes.js - 관리자
| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 관리자 인증 | `/dashboard/login` | bcrypt 기반 관리자 로그인 |
| 대시보드 | `/dashboard/main` | 전체 데이터 조회 (users, stores, partners 등) |
| 대학 인증 관리 | `/dashboard/college_auths/:id` | 학생 인증 요청 승인/거절 |
| 매장 관리 | `/dashboard/stores` | 제휴 매장 CRUD |
| 제휴업체 관리 | `/dashboard/partners` | 단과대 정보 및 이미지 CRUD |
| 제휴 관계 관리 | `/dashboard/partnerships` | 매장-단과대 제휴 혜택 CRUD |

## 🔑 핵심 기능

### 1. JWT 기반 이중 토큰 인증
- **Access Token**: 5일 (사용자), 2시간 (관리자)
- **Refresh Token**: 150일

### 2. 대학 인증 시스템
- 학생증 이미지 업로드
- 관리자 승인/거절 프로세스
- 승인 시 사용자의 단과대 정보 자동 업데이트

### 3. 맞춤형 지도 서비스
- 사용자의 인증된 단과대 기반 필터링
- 제휴 매장만 표시되는 HTML 지도 생성

### 4. 관리자 대시보드
- 사용자/매장/제휴 통합 관리
- 실시간 인증 요청 처리

## 📦 주요 의존성
```json
{
  "express": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcrypt": "^5.x",
  "multer": "^1.x",
  "pg": "^8.x"
}
```
