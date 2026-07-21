# CLAUDE.md - AI Interview Platform

## Tổng quan dự án

AI Interview là nền tảng hỗ trợ tuyển dụng và ứng tuyển dựa trên AI, tập trung vào:
- Phân tích và tối ưu CV dựa trên JD (Job Description)
- Phỏng vấn giả lập đa chế độ (Text Chat & Video/Voice) với AI
- Quản lý thanh toán credit Pay-as-you-go qua Sepay

**Kiến trúc AI Hybrid:** DeepSeek (suy luận, tạo câu hỏi, chấm điểm) + Gemini 2.5-Flash (đa phương thức, STT, fallback)

---

## Tech Stack

### Backend (`ai-interview-backend/`)
| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js 24 + TypeScript 5.7 |
| Framework | Express.js 4 |
| Database | MongoDB (qua Prisma ORM 5) |
| Cache/Queue | Redis (BullMQ 5) |
| AI | Google Gemini (`@google/genai`), DeepSeek (qua OpenAI SDK) |
| Auth | JWT (Access + Refresh Token qua Cookie) |
| Validation | Zod 4 |
| File upload | Multer + Cloudinary |
| PDF generation | Puppeteer |
| Email | Custom MailService |
| TTS | Google Cloud Text-to-Speech |
| Lint/Format | ESLint 10 + Prettier 3 |

### Frontend (`ai-interview-frontend/`)
| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| State management | Zustand 5 (persist) |
| Server state | TanStack React Query 5 |
| Routing | React Router DOM 7 |
| Forms | React Hook Form 7 + Zod 4 |
| Animation | Framer Motion 12 |
| UI Icons | Lucide React |
| Notifications | Sonner (toast) |
| PDF viewer | @react-pdf-viewer, pdfjs-dist |
| Template engine | Handlebars |
| XSS protection | DOMPurify |
| Lint | ESLint 10 |

### DevOps
- **Dev:** Docker Compose (Redis + Backend hot-reload + Frontend hot-reload)
- **Prod:** Docker Compose (build Dockerfile riêng, Frontend port 80)
- **Deploy:** Vercel (cả backend + frontend)

---

## Cấu trúc thư mục

```
ai-interview/
├── ai-interview-backend/
│   ├── prisma/               # Schema MongoDB + seeds
│   │   └── schema.prisma     # Tất cả models, enums, types
│   ├── src/
│   │   ├── index.ts          # Entry point (Express + Workers + Graceful Shutdown)
│   │   ├── config/           # prisma, redis, ai, multer
│   │   ├── const/            # Constants (persona TTS config)
│   │   ├── controllers/v1/
│   │   │   ├── client/       # Ứng viên: auth, user, cv analysis, optimization, interview, builder-cv, notification, subscription
│   │   │   └── admin/        # Admin: dashboard, user, job-category, job-template, packages, transactions, cv-template, notification
│   │   ├── enum/             # dashboard, notification enums
│   │   ├── exceptions/       # AppException, BadRequest, Unauthorized, Forbidden, NotFound
│   │   ├── mappers/          # Data transformers (user, persona, job-category)
│   │   ├── middlewares/      # auth (JWT), error handler, rate-limit, validate (Zod)
│   │   ├── prompts/          # AI prompts: CV analysis, CV optimization, CV extraction, interview chat, create questions, submit result, personas
│   │   ├── queues/           # BullMQ queues: analysis-cv, email, interview-analysis, interview-timer, notification, optimize-cv
│   │   ├── routes/v1/        # Route definitions (client, admin, auth, shared)
│   │   ├── services/
│   │   │   ├── client/       # Business logic cho từng feature
│   │   │   ├── admin/        # Business logic cho admin features
│   │   │   └── core/         # AI service, Google TTS
│   │   ├── shared/           # Shared: TTS controller, credits service, mail service, upload service
│   │   ├── types/            # TypeScript types (interview-ai, jwt, user, job-category)
│   │   ├── utils/            # apiResponse, asyncHandler, jwt, eventEmitter, stream, scoring, mail template, generate-template
│   │   ├── validations/      # Zod schemas
│   │   └── workers/          # BullMQ workers (consumer cho từng queue)
│   ├── Dockerfile
│   ├── vercel.json
│   └── package.json
│
├── ai-interview-frontend/
│   ├── src/
│   │   ├── main.tsx          # Entry point
│   │   ├── App.tsx           # Root component (QueryClientProvider + Toaster)
│   │   ├── components/layout/# Shared layout: Header, Footer, AdminSidebar
│   │   ├── features/         # Feature-based module structure
│   │   │   ├── auth/         # api, hooks (useAuth), types, validations
│   │   │   ├── cvs/          # api, hooks, components (CvCard, modals, charts), types, utils
│   │   │   ├── dashboard/    # api, hooks, components (Stats, Charts), types
│   │   │   ├── interviews/   # api, hooks (useInterviewAI, useTTSPlayer), components (Chat, Input, Header), types
│   │   │   ├── jobs/         # api, hooks, components (JobCard, Filters, Modals), types, validations
│   │   │   ├── landing-page/ # Components cho landing page
│   │   │   ├── notifications/# api, hooks, components, types
│   │   │   ├── profile/      # api, hooks, components, types, validations
│   │   │   ├── subscription/ # api, hooks, components (PricingCard, PaymentModal), data
│   │   │   └── user/         # api, hooks, components (UserModal, CreditModal, Stats), types
│   │   ├── layouts/          # MainLayout, AuthLayout, AdminLayout
│   │   ├── pages/            # Page components (mỗi route 1 page)
│   │   ├── routes/           # AppRoutes.tsx (tất cả route definition)
│   │   ├── shared/           # apiClient (axios + interceptors), auth service, components (LoadingIndicator, ProtectedRoute, BackgroundJobWidget), constants, types, utils (cn helper)
│   │   └── store/            # Zustand stores (authStore, backgroundJobStore)
│   ├── Dockerfile
│   ├── vercel.json
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml        # Production Docker
├── docker-compose.dev.yml    # Development Docker (hot reload)
├── system_specification.md   # Đặc tả hệ thống chi tiết (tiếng Việt)
├── implementation_plan.md    # Kế hoạch triển khai CV Builder
├── security_audit.md         # Báo cáo kiểm thử bảo mật
└── skills-lock.json
```

---

## Quy tắc viết code

### Backend

#### Cấu trúc module
Mỗi feature tuân theo flow: **Route → Validation → Controller → Service → Database/External**

```typescript
// Route: định nghĩa endpoint + middleware
router.post('/analyze/template', auth, validate(schema), controller.method);

// Controller: chỉ xử lý HTTP, gọi service, trả response
class XController {
  constructor(private readonly xService: XService) {}
  method = asyncHandler(async (req, res) => {
    const result = await this.xService.doSomething(req.body);
    return sendResponse(res, 200, 'Success', result);
  });
}
export const xController = new XController(xService);

// Service: business logic, gọi Prisma/AI
export class XService {
  async doSomething(data: any) { ... }
}
export const xService = new XService();
```

#### Quy ước
- **Controller pattern:** Class-based, nhận service qua constructor, export singleton instance
- **Service pattern:** Class-based, export singleton instance ở cuối file
- **Async error handling:** Luôn bọc controller method trong `asyncHandler()` (tự động catch và forward lỗi cho error middleware)
- **API Response:** Luôn dùng `sendResponse(res, statusCode, message, data)` - response format `{ success, message, data }`
- **Validation:** Zod schemas trong `validations/`, format `{ body, query, params }`. Dùng `validate(schema)` middleware
- **Auth:** Middleware `auth` (bắt buộc) + `authorize(...roles)` (optional, cho admin routes)
- **Naming:** camelCase cho biến/hàm, PascalCase cho class/interface, kebab-case cho file
- **Exception handling:** Dùng custom exceptions từ `exceptions/` (AppException, BadRequestException, v.v.)
- **Lint:** ESLint với Prettier plugin, `@typescript-eslint/no-explicit-any: off`
- **Format:** Prettier (cấu hình mặc định)
- **Commit:** Conventional commits (commitlint)

#### AI Integration
- Primary AI: DeepSeek (qua OpenAI SDK, model `deepseek-chat` hoặc `deepseek-v4-pro`)
- Fallback: Gemini 2.5-Flash khi DeepSeek fail
- Tất cả AI prompts nằm trong `src/prompts/` - tách system prompt, user prompt, response schema
- AI response schema được định nghĩa dạng JSON schema và truyền vào `response_format: { type: 'json_object' }`

#### Queue (BullMQ)
- Tác vụ nặng (CV analysis, CV optimization, interview analysis) được đẩy vào queue
- Mỗi queue có 1 file trong `queues/` (producer) và 1 file trong `workers/` (consumer)
- Workers khởi động cùng Express server trong `index.ts`
- Có graceful shutdown để đóng workers khi tắt server

### Frontend

#### Cấu trúc module (Feature-based)
Mỗi feature có cấu trúc: **api → hooks → components → types → validations**

```typescript
// api: gọi API qua apiClient
export const xApi = {
  getList: async (): Promise<X[]> => {
    const response = await apiClient.get('/endpoint');
    return response.data;
  },
};

// hooks: React Query hooks
export const useX = () => {
  return useQuery({ queryKey: ['x'], queryFn: xApi.getList });
};
```

#### Quy ước
- **API client:** `shared/services/apiClient.ts` - axios instance với interceptor tự động attach JWT token, refresh token khi 401, queue failed requests
- **State management:** Zustand với persist middleware cho auth state
- **Server state:** TanStack React Query cho mọi API data
- **Forms:** React Hook Form + Zod resolver
- **Toast notifications:** Sonner (`toast.success()`, `toast.error()`)
- **ClassName merge:** Dùng `cn()` helper từ `shared/utils/cn.ts` (clsx + tailwind-merge) cho mọi conditional className
- **Naming conventions:**
  - Interface: prefix `I` (e.g., `IUser`)
  - camelCase: biến, hàm
  - PascalCase: component, class, type alias
  - Single quotes cho string
  - 2 spaces indent
  - Always semicolons
- **File naming:** PascalCase cho component files, camelCase cho utils/hooks/api
- **Route protection:** `<ProtectedRoute>` component, hỗ trợ `allowedRoles` cho admin routes
- **Design system:** Tuân thủ Notion Design Aesthetic (xem `DESIGN.md`):
  - Primary color: `#5645d4` (purple)
  - Background: white/navy (`#0a1530`)
  - Card: rounded 12px, border `1px solid #e5e3df`
  - Button: rounded 8px (KHÔNG dùng pill)
  - Font: Notion-Sans (Inter-based)
  - Pastel card tints cho feature cards
  - Responsive: mobile < 480px → wide desktop ≥ 1280px

---

## Các feature hiện có

### Ứng viên (Candidate)
| Feature | API Route | Mô tả |
|---|---|---|
| Auth | `/auth/*` | Đăng ký, đăng nhập, OTP, quên mật khẩu |
| Dashboard | `/user/dashboard` | Thống kê, biểu đồ performance, hot jobs |
| Quản lý CV | `/cvs/*` | Upload CV (PDF/DOCX), trích xuất text, lưu Cloudinary |
| Phân tích CV | `/analysis-cv/*` | So khớp CV-JD, skills gap, điểm mạnh/yếu, gợi ý cải thiện |
| Tối ưu CV | `/analysis-cv/optimize` | AI viết lại CV, xuất PDF qua Puppeteer |
| CV Builder | `/cv-builder/*` | Soạn CV với template + preview real-time (Handlebars) |
| Phỏng vấn Text | `/interview-ai/*` | Chat với AI, SSE streaming, câu hỏi follow-up |
| Phỏng vấn Video | `/interview-ai/*` | Ghi âm → STT → AI trả lời → TTS |
| Kết quả phỏng vấn | `/interview-ai/result` | Chấm điểm, radar chart, rubric criteria, learning path |
| Gói dịch vụ | `/subscriptions/*` | Mua credit, thanh toán qua Sepay QR code |
| Thông báo | `/notifications/*` | Real-time notifications |
| Profile | `/user/profile` | Chỉnh sửa thông tin, đổi mật khẩu |

### Admin
| Feature | API Route | Mô tả |
|---|---|---|
| Dashboard | `/admin/dashboard` | Thống kê users, revenue, sessions |
| Users | `/admin/users` | CRUD users, khóa/mở khóa |
| Job Categories | `/admin/categories` | Quản lý danh mục ngành nghề 3 cấp |
| Job Templates | `/admin/job-templates` | Quản lý JD mẫu (Hot Jobs) |
| Packages | `/admin/packages` | Quản lý gói credit |
| Transactions | `/admin/transactions` | Xem lịch sử giao dịch |
| CV Templates | `/admin/cv-templates` | Quản lý mẫu CV HTML/CSS |
| Notifications | `/admin/notifications` | Gửi thông báo hệ thống |

### AI Features chi tiết
- **CV Analysis:** Phân tích độ khớp CV với JD, chấm điểm 0-100, phân tích kỹ năng (user vs required), tìm keywords thiếu, gợi ý cải thiện (HIGH/MEDIUM/LOW)
- **CV Optimization:** AI viết lại CV, thêm keywords thiếu (ADD_KEYWORD), viết lại kinh nghiệm (REWRITE), mở rộng mô tả (EXPAND)
- **Interview Chat:** AI tạo câu hỏi cốt lõi (3-5 câu) kèm rubric criteria, chat real-time với SSE streaming, tự động follow-up
- **Interview Video:** STT qua Gemini, TTS qua Google Cloud, avatar ảo
- **Interview Result:** Chấm điểm 5 khía cạnh (Domain, Problem Solving, Clarity, Confidence, Relevance) qua radar chart, report chi tiết từng câu

---

## Cách chạy

### Development (Docker - khuyên dùng)
```bash
docker compose -f docker-compose.dev.yml up -d
```
- Backend: http://localhost:3000 (hot reload)
- Frontend: http://localhost:5173 (hot reload)
- Redis: localhost:6379

### Development (không Docker)
```bash
# Backend
cd ai-interview-backend
npm install
npx prisma generate
npm run dev

# Frontend
cd ai-interview-frontend
npm install
npm run dev
```
Yêu cầu: Node.js 24, MongoDB, Redis

### Production
```bash
docker compose up -d
```
Frontend port 80, Backend port 3000

---

## Database (MongoDB + Prisma)

- Provider: MongoDB
- Tất cả models, enums, composite types định nghĩa trong `prisma/schema.prisma`
- Composite types: `CvDataStructure`, `CoreQuestion`, `RubricCriterion`, `AiModification`, `SkillAnalysis`, `ImprovementSuggestion`, `ScoreDetail`, `GeneralEvaluation`, v.v.
- Migration: Prisma MongoDB không dùng `prisma migrate`, dùng `prisma db push`
- Seed: `npm run seed:template` (seed CV templates)

---

## Ghi chú khác

- **Credit system:** Mỗi user mới được tặng 3 credits. Mỗi tác vụ AI (phân tích CV, tối ưu CV, tạo phiên phỏng vấn) tiêu tốn credit.
- **Sepay Polling:** Backend poll Sepay API để xác nhận thanh toán, tự động cộng credit khi khớp mã đối soát `XINT XXXXXX`.
- **Puppeteer:** Dùng để render HTML CV thành PDF, cần cài đặt Chromium.
- **SSE (Server-Sent Events):** Dùng cho streaming text trong phỏng vấn chat, token truyền qua query param.
- **Recruiter Room (tương lai):** Schema đã thiết kế nhưng API & UI chưa xây dựng.
