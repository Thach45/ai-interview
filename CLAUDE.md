# CLAUDE.md — Arion Platform

## Tổng quan

Arion là nền tảng hỗ trợ ứng viên và tuyển dụng với các khả năng:

- Phân tích, tối ưu và xây dựng CV dựa trên JD.
- Phỏng vấn giả lập với AI qua văn bản hoặc video/giọng nói, sau đó tạo báo cáo đánh giá.
- Quản lý job template, người dùng, gói credit, giao dịch và thông báo cho phía quản trị.
- Chuyển văn bản thành giọng nói (Google Cloud TTS) và xử lý các tác vụ nền qua queue.

## Kiến trúc hiện tại

Đây là repository gồm hai ứng dụng độc lập:

```
ai-interview/
├── ai-interview-backend/   # NestJS API + Prisma/MongoDB + Redis/BullMQ
├── ai-interview-frontend/  # Next.js App Router
├── docker-compose.yml      # Redis + backend (production-oriented)
└── docker-compose.dev.yml  # Cấu hình development cũ, cần đồng bộ trước khi dùng
```

### Backend — `ai-interview-backend/`

- Node.js, TypeScript và NestJS 11.
- REST API có global prefix `/api/v1`; endpoint `/health` được loại trừ khỏi prefix.
- Prisma 5 kết nối MongoDB (`DATABASE_URL`). Schema là nguồn chuẩn cho model/enums.
- Redis + BullMQ xử lý các tác vụ bất đồng bộ như CV analysis/optimization, email, notification và interview analysis/timer.
- AI dùng `@google/genai`, OpenAI SDK/DeepSeek; speech-to-text qua Groq và TTS qua Google Cloud Text-to-Speech.
- Xác thực JWT: access token gửi qua `Authorization: Bearer …`, refresh token qua cookie. API được bảo vệ mặc định bằng global `JwtAuthGuard` và `RolesGuard`; endpoint công khai phải gắn `@IsPublic()`.
- Mọi response được bọc theo dạng `{ success, message, data }`; validation toàn cục dùng `ValidationPipe` với `whitelist` và `forbidNonWhitelisted`.

Điểm vào chính:

- `src/main.ts`: bootstrap Nest, CORS, global prefix, cookie parser, validation, exception filter và response interceptor.
- `src/app.module.ts`: đăng ký module, rate-limit, guards toàn cục.
- `prisma/schema.prisma`: MongoDB models, enums và composite types.

Các feature backend nằm ở `src/modules/`:

- `auth`, `user`, `dashboard`, `notification`, `subscription`, `transaction`, `tts`, `credits`.
- `job-category`, `job-template`.
- `cv-management/{uploads,builder,templates,analysis}`.
- `interview`.

Quy ước NestJS: `Controller → Service → Repository/Prisma hoặc provider ngoài`. DTO dùng `class-validator`/`class-transformer`; authorization dùng decorators và guards. Không áp dụng các quy ước Express, Zod middleware hoặc singleton service được mô tả trong tài liệu cũ.

### Frontend — `ai-interview-frontend/`

- Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- Dùng App Router; các route ở `src/app/`, chia theo route groups `(client)`, `(admin)` và `(auth)`.
- UI logic theo feature tại `src/features/<feature>/{api,hooks,components,types,validations}`.
- TanStack React Query quản lý server state; Zustand (`src/store/`) lưu auth/background jobs; React Hook Form + Zod xử lý form.
- Axios instance ở `src/shared/services/apiClient.ts`: tự thêm bearer token, refresh token sau 401 và retry các request đang chờ.
- `src/middleware.ts` bảo vệ đường dẫn và kiểm tra role `ADMIN` từ JWT cookie. Zustand auth store đồng bộ token vào `localStorage` và cookie `token` để middleware đọc được.

Điểm vào chính:

- `src/app/layout.tsx`: root layout và metadata.
- `src/providers/Providers.tsx`: QueryClient, Sonner toaster và Helmet provider.
- `src/shared/services/apiClient.ts`: cấu hình API client.
- `src/middleware.ts`: middleware route protection.

Các luồng UI chính: landing/auth, dashboard, jobs, CV upload/analysis/builder/templates, interview setup/chat/video/report, profile/subscription và admin dashboard/users/jobs/categories/CV templates/packages/transactions/notifications.

## API modules chính

Với prefix `/api/v1`, các controller hiện có gồm:

- `auth`, `user`, `cvs`, `cv-builder`, `analysis-cv`, `interview-ai`, `tts`.
- `categories`, `job-templates`, `notifications`, `subscriptions`.
- Nhánh quản trị: `admin/dashboard`, `admin/users`, `admin/categories`, `admin/job-templates`, `admin/cv-templates`, `admin/packages`, `admin/transactions`, `admin/notifications`.

## Chạy dự án

Backend:

```bash
cd ai-interview-backend
npm install
npx prisma generate
npm run start:dev
```

Frontend:

```bash
cd ai-interview-frontend
npm install
npm run dev
```

Mặc định backend chạy `http://localhost:3000`, frontend dev chạy `http://localhost:3001`, và frontend gọi `http://localhost:3000/api/v1` nếu `NEXT_PUBLIC_API_URL` chưa được đặt.

Docker Compose production hiện chỉ khởi tạo Redis và backend. `docker-compose.dev.yml` vẫn chứa lệnh/cổng Vite cũ (`npm run dev`, port `5173`) nên không phù hợp với frontend Next.js hiện tại nếu chưa được cập nhật.

## Quy ước khi thay đổi code

- Ưu tiên mở rộng feature/module hiện có thay vì đặt code nghiệp vụ vào shared/root.
- Giữ API response theo response interceptor hiện tại; đừng tự tạo response format khác.
- Thêm endpoint protected mặc định; chỉ dùng `@IsPublic()` khi endpoint thực sự công khai.
- Với thay đổi schema Prisma: cập nhật `prisma/schema.prisma`, chạy `npx prisma generate` và kiểm tra ảnh hưởng tới DTO/service/repository.
- Các tác vụ AI hoặc tác vụ nặng nên đi qua BullMQ thay vì chặn request HTTP lâu.
- Trên frontend, gọi backend qua `apiClient`, đóng gói request trong feature API và dùng React Query hooks cho server state.
- Tái sử dụng `cn()` cho class conditional và các component/layout/shared utilities hiện có.
- Không chỉnh sửa token/session/refresh flow nếu chưa kiểm tra cả `authStore`, `apiClient`, middleware và backend auth module.

## Kiểm tra

```bash
# Frontend
cd ai-interview-frontend && npm run lint && npm run build

# Backend
cd ai-interview-backend && npm run lint && npm run build && npm test
```
