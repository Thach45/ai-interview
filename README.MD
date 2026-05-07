# AI Interview Backend (Node.js + Express + TypeScript)

Hệ thống Backend chuẩn cho dự án AI Interview, được xây dựng trên kiến trúc Layered Architecture (Phân tầng) và tuân thủ các quy tắc lập trình nghiêm ngặt.

## 🚀 Tech Stack
- **Runtime:** Node.js v24.15.0 (LTS)
- **Framework:** ExpressJS
- **Language:** TypeScript
- **Database:** MongoDB (via Prisma ORM)
- **Development Tools:** tsx, ESLint, Prettier, Husky, Commitlint

---

## 🛠 Quy tắc phát triển (Development Rules)

Mọi thành viên trong team **bắt buộc** tuân thủ các quy tắc sau:

### 1. Quy tắc đặt tên File (File Naming)
- Sử dụng **Số ít (Singular)** và **kebab-case** với file và **số nhiều (Plural)** với thư mục.
- Luôn đi kèm hậu tố (Suffix) theo nhiệm vụ của file.
- Ví dụ: `user.controller.ts`, `auth.service.ts`, `jwt.middleware.ts`.
- **KHÔNG** dùng số nhiều (tránh `users.controller.ts`).

### 2. Quy tắc Commit Git (Conventional Commits)
Hệ thống sẽ tự động chặn commit nếu bạn không đặt tên đúng chuẩn:
- `feat:` Thêm tính năng mới.
- `fix:` Sửa lỗi.
- `docs:` Thay đổi tài liệu.
- `style:` Thay đổi format code (không đổi logic).
- `refactor:` Tái cấu trúc code.
- `chore:` Cập nhật thư viện, cấu hình hệ thống.
- **Ví dụ:** `feat: add login validation with zod`

### 3. Kiểm soát chất lượng (Linting & Formatting)
- Code sẽ được tự động kiểm tra bằng **ESLint** và định dạng bằng **Prettier** trước mỗi lần commit thông qua **Husky**.
- Nếu code có lỗi (Errors), bạn sẽ **không thể commit**. Hãy chạy `npm run lint:fix` để tự động sửa lỗi.

---

## 📂 Cấu trúc thư mục (Folder Structure)
```text
src/
├── config/             # Cấu hình Database, Prisma
├── controllers/v1/     # Xử lý Request/Response (API v1)
├── services/           # Chứa Logic nghiệp vụ chính (Business Logic)
├── routes/v1/          # Định tuyến API (API v1)
├── middlewares/        # Các hàm trung gian (Auth, Error, Validate)
├── utils/              # Các hàm bổ trợ (JWT, Bcrypt, Helper)
├── types/              # Định nghĩa TypeScript Types/Interfaces
└── validations/        # Định nghĩa Zod Schemas
```

---

## ⚙️ Cài đặt & Chạy dự án

### 1. Thiết lập biến môi trường
Tạo file `.env` tại thư mục gốc và cấu hình:
```env
DATABASE_URL="mongodb+srv://..."
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Khởi tạo dữ liệu (Seeding)
Tự động tạo tài khoản Admin mặc định:
```bash
npx prisma db seed
```

### 4. Chạy môi trường Development
```bash
npm run dev
```

---

## 📜 Các lệnh quan trọng
- `npm run dev`: Chạy server với chế độ hot-reload (tsx).
- `npm run lint`: Kiểm tra lỗi code theo chuẩn ESLint.
- `npm run lint:fix`: Tự động sửa lỗi trình bày code.
- `npm run format`: Định dạng toàn bộ code bằng Prettier.
- `npm run build`: Biên dịch sang JavaScript thuần trong thư mục `dist`.