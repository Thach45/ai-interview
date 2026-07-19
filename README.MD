# AI Interview - Nền tảng Phỏng vấn & Đánh giá CV thông minh

Website chính thức: [Đang cập nhật](#)

---

## Mục lục

- [Giới thiệu về dự án](#giới-thiệu-về-dự-án)
- [Hình ảnh minh họa (Screenshots)](#hình-ảnh-minh-họa-screenshots)
- [Công nghệ sử dụng (Tech Stack)](#công-nghệ-sử-dụng-tech-stack)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cấu hình và cài đặt chi tiết](#hướng-dẫn-cấu-hình-và-cài-đặt-chi-tiết)
- [Hướng dẫn khởi chạy ứng dụng](#hướng-dẫn-khởi-chạy-ứng-dụng)
- [Tài liệu API](#tài-liệu-api-đầy-đủ-ai-interview)

---

## Giới thiệu về dự án

Hệ thống AI Interview hỗ trợ ứng viên chuẩn bị cho các buổi phỏng vấn một cách tự tin và chuyên nghiệp nhất thông qua sức mạnh của Trí tuệ Nhân tạo.

- **Phân tích CV thông minh:** Tải lên CV (PDF) và nhận đánh giá chi tiết, gợi ý cải thiện và chấm điểm mức độ phù hợp.
- **Mô phỏng phỏng vấn bằng AI:** Luyện tập phỏng vấn với AI dựa trên ngữ cảnh thực tế của CV và vị trí ứng tuyển.
- **Trải nghiệm chân thực:** Hỗ trợ Text-to-Speech (Google Cloud TTS) giúp buổi phỏng vấn mô phỏng giống thật hơn.
- **Quản lý dữ liệu mạnh mẽ:** Lưu trữ an toàn hồ sơ và lịch sử phỏng vấn với MongoDB và Prisma ORM.

---

## Hình ảnh minh họa (Screenshots)

Dưới đây là toàn bộ giao diện của hệ thống:

### Authentication
**Đăng nhập (Login)**
![Login](./data_preview/img/Login-Page.png)

**Đăng ký (Register)**
![Register](./data_preview/img/Register-Page.png)

### User App
**Trang chủ (Dashboard)**
![Dashboard](./data_preview/img/Dashboard-Page.png)

**Trang cá nhân (Profile)**
![Profile](./data_preview/img/Profile-Page.png)

**Tìm việc làm (Jobs)**
![Jobs](./data_preview/img/Jobs-Page.png)

**Gói cước (Subscription)**
![Subscription](./data_preview/img/Subcription-Page.png)

### Quản lý và Phân tích CV
**Danh sách CV (My CV)**
![My CV](./data_preview/img/My-CV-Page.png)

**Tối ưu CV (Optimize CV)**
![Optimize CV](./data_preview/img/Optimize-CV-Page.png)

**Đánh giá CV (Report CV)**
![Report CV](./data_preview/img/Report-CV-Page.png)

### Phỏng vấn Trí tuệ Nhân tạo
**Thiết lập phòng phỏng vấn (Setup)**
![Setup](./data_preview/img/Setup-Page.png)

**Phỏng vấn Video (Interview Video)**
![Interview Video](./data_preview/img/Interview-Video-Page.png)

**Phỏng vấn Chat (Interview Chat)**
![Interview Chat](./data_preview/img/Interview-Chat-Page.png)

**Kết quả phỏng vấn (Interview Report)**
![Interview Report](./data_preview/img/Interview-Report-Page.png)

### Quản trị hệ thống (Admin)
**Trang chủ Admin (Admin Dashboard)**
![Admin Dashboard](./data_preview/img/Admin-Dashboard-Page.png)

**Quản lý Danh mục (Admin Categories)**
![Admin Categories](./data_preview/img/Admin-Categories-Page.png)

**Quản lý Công việc (Admin Jobs)**
![Admin Jobs](./data_preview/img/Admin-Jobs-Page.png)

**Quản lý Mẫu CV (Admin CV-template)**
![Admin CV-template](./data_preview/img/Admin-CV-template-Page.png)

**Quản lý Người dùng (Admin Users)**
![Admin Users](./data_preview/img/Admin-Users-Page.png)

**Quản lý Gói cước (Admin Packages)**
![Admin Packages](./data_preview/img/Admin-Packages-Page.png)

**Quản lý Giao dịch (Admin Transaction)**
![Admin Transaction](./data_preview/img/Admin-Transaction-Page.png)

---

## Công nghệ sử dụng (Tech Stack)

**Frontend:**
- **Framework:** React 19, Vite
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management & Fetching:** Zustand, React Query
- **Routing:** React Router DOM

**Backend:**
- **Runtime & Framework:** Node.js, ExpressJS
- **Ngôn ngữ:** TypeScript
- **Database & ORM:** MongoDB, Prisma ORM
- **AI Integration:** Google Gemini, OpenAI, Google Cloud Text-to-Speech
- **Khác:** JWT (Authentication), Zod (Validation)

---

## Cấu trúc dự án

Dự án được cấu trúc theo mô hình Client-Server chia làm hai phần chính: backend và frontend.

```text
ai-interview/
├── ai-interview-backend/   # Mã nguồn phía máy chủ (Server-side)
│   ├── src/                # Mã nguồn chính của server
│   │   ├── config/         # Cấu hình Database, Prisma
│   │   ├── controllers/    # Xử lý Request/Response 
│   │   ├── services/       # Chứa Logic nghiệp vụ (AI, Phân tích CV, v.v.)
│   │   ├── routes/         # Định tuyến API
│   │   ├── middlewares/    # Các middleware xử lý log, kiểm tra quyền và bắt lỗi
│   │   ├── utils/          # Các hàm tiện ích hỗ trợ (JWT, Hash...)
│   │   └── validations/    # Định nghĩa Zod Schemas để validate dữ liệu
│   ├── prisma/             # Schema cho database Prisma (MongoDB)
│   ├── .env.example        # Mẫu file cấu hình môi trường của backend
│   └── package.json        # Định nghĩa các thư viện (Express, Prisma, Gemini, OpenAI)
│
├── ai-interview-frontend/  # Mã nguồn phía giao diện người dùng (Client-side)
│   ├── src/                # Mã nguồn chính của ứng dụng React
│   │   ├── components/     # Các thành phần giao diện tái sử dụng
│   │   ├── pages/          # Các trang chính (Dashboard, CV Analysis, Interview AI)
│   │   ├── services/       # Các hàm gọi API giao tiếp với Backend
│   │   ├── App.tsx         # Thành phần gốc định tuyến các trang
│   │   └── main.tsx        # Điểm khởi chạy của ứng dụng React (Vite)
│   ├── vite.config.js      # File cấu hình công cụ xây dựng Vite
│   └── package.json        # Định nghĩa thư viện (React, Tailwind CSS, Zustand, React Query)
```

---

## Hướng dẫn cấu hình và cài đặt chi tiết

### Yêu cầu hệ thống trước khi cài đặt
Để khởi chạy dự án, máy tính của bạn cần được cài đặt sẵn:
- Node.js (khuyến nghị phiên bản LTS từ 20 trở lên)
- Cơ sở dữ liệu MongoDB (chạy cục bộ hoặc MongoDB Atlas)
- Công cụ dòng lệnh git

### Bước 1: Clone mã nguồn dự án
Sử dụng terminal để tải dự án về máy:
```bash
git clone https://github.com/Thach45/ai-interview.git
cd ai-interview
```

### Bước 2: Hướng dẫn cấu hình môi trường (Config) chi tiết

#### 1. Cấu hình Backend
Di chuyển vào thư mục backend:
```bash
cd ai-interview-backend
```
Tạo file cấu hình môi trường `.env` từ file mẫu:
```bash
cp .env.example .env
```
*(Đối với hệ điều hành Windows sử dụng CMD hoặc PowerShell, bạn có thể copy thủ công hoặc sử dụng lệnh `copy .env.example .env`)*

Mở file `.env` vừa tạo và cập nhật chi tiết các tham số sau:

- **Cơ sở dữ liệu (Database):**
  - `DATABASE_URL`: Địa chỉ kết nối MongoDB của bạn (ví dụ: `mongodb+srv://...`).

- **Bảo mật & Token:**
  - `JWT_ACCESS_SECRET`: Chuỗi khóa bí mật dùng để mã hóa Access Token.
  - `JWT_REFRESH_SECRET`: Chuỗi khóa bí mật dùng để mã hóa Refresh Token.

- **Tích hợp trí tuệ nhân tạo (AI) và các dịch vụ khác:**
  - Cấu hình các API Key cho Gemini, OpenAI, Google Cloud Text-to-Speech (nếu có sử dụng).
  - Cấu hình API Key của Cloudinary để lưu trữ ảnh/file PDF.

#### 2. Cấu hình Frontend
Di chuyển vào thư mục frontend:
```bash
cd ../ai-interview-frontend
```
Tạo file cấu hình môi trường `.env` từ file mẫu (nếu có):
```bash
cp .env.example .env
```
Mở file `.env` và thiết lập các biến sau:
- `VITE_API_URL`: Đường dẫn API của backend. Khi chạy local mặc định là: `http://localhost:5000/api/v1` (tùy thuộc vào port đang cấu hình).

---

## Hướng dẫn khởi chạy ứng dụng

### 1. Cài đặt các thư viện phụ thuộc (Dependencies)

Bạn cần thực hiện cài đặt thư viện ở cả thư mục `backend` và `frontend`:

- **Tại thư mục backend:**
  ```bash
  cd ai-interview-backend
  npm install
  ```

- **Tại thư mục frontend:**
  ```bash
  cd ../ai-interview-frontend
  npm install
  ```

### 2. Khởi tạo Database (Prisma)
Di chuyển vào thư mục backend và chạy lệnh tạo schema cho MongoDB cũng như seed dữ liệu ban đầu:
```bash
cd ai-interview-backend
npx prisma generate
npx prisma db seed
```

### 3. Khởi chạy dự án

#### Chạy Backend Server
1. Mở một terminal mới và di chuyển vào thư mục backend:
   ```bash
   cd ai-interview-backend
   ```
2. Khởi động server ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   Server backend sẽ hoạt động và tự động reload khi có thay đổi (thông qua `nodemon` + `tsx`).

#### Chạy Frontend Client
1. Mở một terminal song song khác và di chuyển vào thư mục frontend:
   ```bash
   cd ai-interview-frontend
   ```
2. Khởi chạy ứng dụng React (Vite):
   ```bash
   npm run dev
   ```
   Ứng dụng frontend sẽ chạy tại địa chỉ mặc định của Vite (thường là `http://localhost:5173`).

Mở trình duyệt truy cập vào URL hiển thị trên terminal frontend để bắt đầu sử dụng.

---

# Tài liệu API Đầy Đủ (AI Interview)

Tài liệu này liệt kê toàn bộ API của dự án, được tự động phân tích và gom nhóm.

## THÔNG TIN CHUNG
- **Base URL:** `http://localhost:3000/api/v1`
- **Auth:** `Authorization: Bearer <token>`

## 📌 Nhóm: Auth

### `[POST]` /api/v1/auth/login
- **Mô tả:** Đăng nhập vào hệ thống bằng email và password.
- **Auth Required:** No

### `[POST]` /api/v1/auth/logout
- **Mô tả:** Đăng xuất người dùng hiện tại.
- **Auth Required:** No

### `[POST]` /api/v1/auth/refresh
- **Mô tả:** Lấy Access Token mới bằng Refresh Token.
- **Auth Required:** No

### `[POST]` /api/v1/auth/register
- **Mô tả:** Đăng ký tài khoản mới (Ứng viên/Nhà tuyển dụng).
- **Auth Required:** No

### `[POST]` /api/v1/auth/send-otp
- **Mô tả:** Gửi mã OTP xác thực qua email.
- **Auth Required:** No

### `[POST]` /api/v1/auth/verify-otp
- **Mô tả:** Xác thực mã OTP mà người dùng nhập vào.
- **Auth Required:** No

### `[POST]` /api/v1/auth/resend-otp
- **Mô tả:** Gửi lại mã OTP qua email.
- **Auth Required:** No

### `[POST]` /api/v1/auth/forgot-password
- **Mô tả:** Yêu cầu đặt lại mật khẩu, gửi link/OTP qua email.
- **Auth Required:** No

### `[POST]` /api/v1/auth/reset-password
- **Mô tả:** Đặt lại mật khẩu mới bằng token/OTP hợp lệ.
- **Auth Required:** No

## 📌 Nhóm: User

### `[GET]` /api/v1/user
- **Mô tả:** Lấy thông tin profile của người dùng đang đăng nhập.
- **Auth Required:** Yes

### `[GET]` /api/v1/user/dashboard
- **Mô tả:** Lấy dữ liệu thống kê tổng quan cho trang chủ của User.
- **Auth Required:** Yes

### `[PUT]` /api/v1/user/me
- **Mô tả:** Cập nhật thông tin cá nhân (Tên, Avatar, v.v).
- **Auth Required:** Yes

## 📌 Nhóm: CV

### `[POST]` /api/v1/cvs/upload
- **Mô tả:** Upload file CV (PDF/Word) lên hệ thống (Dùng multipart/form-data).
- **Auth Required:** Yes

### `[GET]` /api/v1/cvs/my-cvs
- **Mô tả:** Lấy danh sách các CV mà user đã upload/tạo.
- **Auth Required:** Yes

### `[POST]` /api/v1/analysis-cv/analyze
- **Mô tả:** Dùng AI để phân tích điểm mạnh, điểm yếu của CV.
- **Auth Required:** Yes

### `[POST]` /api/v1/analysis-cv/optimize
- **Mô tả:** Dùng AI để tối ưu hóa và viết lại nội dung CV.
- **Auth Required:** Yes

### `[POST]` /api/v1/analysis-cv/export-pdf
- **Mô tả:** Xuất CV đã tối ưu ra định dạng PDF.
- **Auth Required:** Yes

## 📌 Nhóm: Job

### `[GET]` /api/v1/job-templates
- **Mô tả:** Lấy danh sách các mẫu công việc (Job Templates) mẫu.
- **Auth Required:** Yes

### `[GET]` /api/v1/job-templates/:id
- **Mô tả:** Xem chi tiết một Job Template cụ thể.
- **Auth Required:** Yes

### `[GET]` /api/v1/categories
- **Mô tả:** Lấy danh sách danh mục nghề nghiệp (Cấu trúc phân cấp).
- **Auth Required:** Yes

### `[GET]` /api/v1/categories/flat
- **Mô tả:** Lấy danh sách danh mục nghề nghiệp (Dạng phẳng - 1 cấp).
- **Auth Required:** Yes

### `[GET]` /api/v1/categories/:id
- **Mô tả:** Xem chi tiết một danh mục nghề nghiệp.
- **Auth Required:** Yes

## 📌 Nhóm: Interview

### `[POST]` /api/v1/interview-ai/setup
- **Mô tả:** Khởi tạo cấu hình ban đầu cho phiên phỏng vấn AI.
- **Auth Required:** Yes

### `[GET]` /api/v1/interview-ai/:id
- **Mô tả:** Lấy thông tin chi tiết của một phòng phỏng vấn.
- **Auth Required:** Yes

### `[GET]` /api/v1/interview-ai/:id/messages
- **Mô tả:** Lấy lịch sử chat/tin nhắn trong phiên phỏng vấn.
- **Auth Required:** Yes

### `[GET]` /api/v1/interview-ai/:id/stream
- **Mô tả:** Kết nối Server-Sent Events (SSE) để nhận tin nhắn AI trả về realtime.
- **Auth Required:** Yes

### `[POST]` /api/v1/interview-ai/:id/start
- **Mô tả:** Bắt đầu phiên phỏng vấn chính thức.
- **Auth Required:** Yes

### `[POST]` /api/v1/interview-ai/:id/chat
- **Mô tả:** Gửi câu trả lời bằng Text cho AI.
- **Auth Required:** Yes

### `[POST]` /api/v1/interview-ai/:id/chat-audio
- **Mô tả:** Gửi file ghi âm giọng nói (Audio) cho AI xử lý.
- **Auth Required:** Yes

### `[POST]` /api/v1/interview-ai/:id/submit
- **Mô tả:** Nộp bài và kết thúc phiên phỏng vấn.
- **Auth Required:** Yes

### `[GET]` /api/v1/interview-ai/:id/result
- **Mô tả:** Lấy kết quả đánh giá, nhận xét từ AI sau khi phỏng vấn.
- **Auth Required:** Yes

## 📌 Nhóm: Subscription

### `[GET]` /api/v1/subscriptions/packages
- **Mô tả:** Lấy danh sách các gói cước (Packages) có thể mua.
- **Auth Required:** No

### `[POST]` /api/v1/subscriptions/purchase
- **Mô tả:** Tạo giao dịch thanh toán mua gói cước.
- **Auth Required:** No

### `[GET]` /api/v1/subscriptions/transactions/:id/status
- **Mô tả:** Kiểm tra trạng thái của một giao dịch thanh toán.
- **Auth Required:** No

## 📌 Nhóm: Notification

### `[GET]` /api/v1/notifications
- **Mô tả:** Lấy danh sách thông báo của người dùng.
- **Auth Required:** No

### `[GET]` /api/v1/notifications/stream
- **Mô tả:** Kết nối Server-Sent Events (SSE) để nhận thông báo realtime.
- **Auth Required:** No

### `[PATCH]` /api/v1/notifications/read-all
- **Mô tả:** Đánh dấu tất cả thông báo là đã đọc.
- **Auth Required:** No

### `[PATCH]` /api/v1/notifications/:id/read
- **Mô tả:** Đánh dấu một thông báo cụ thể là đã đọc.
- **Auth Required:** No

## 📌 Nhóm: Admin

### `[GET]` /api/v1/admin/categories
- **Mô tả:** Lấy danh sách danh mục (Admin view).
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/categories
- **Mô tả:** Thêm mới một danh mục công việc.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/categories/flat
- **Mô tả:** Lấy danh sách danh mục (Flat array).
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/categories/:id
- **Mô tả:** Lấy thông tin 1 danh mục.
- **Auth Required:** Yes

### `[PUT]` /api/v1/admin/categories/:id
- **Mô tả:** Cập nhật thông tin danh mục.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/categories/:id
- **Mô tả:** Xóa danh mục.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/job-templates
- **Mô tả:** Lấy danh sách Job Templates.
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/job-templates
- **Mô tả:** Thêm mới một Job Template.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/job-templates/:id
- **Mô tả:** Xem chi tiết Job Template.
- **Auth Required:** Yes

### `[PUT]` /api/v1/admin/job-templates/:id
- **Mô tả:** Cập nhật Job Template.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/job-templates/:id
- **Mô tả:** Xóa Job Template.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/users
- **Mô tả:** Lấy danh sách tài khoản người dùng.
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/users
- **Mô tả:** Admin tự tạo tài khoản mới.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/users/:id
- **Mô tả:** Xem chi tiết một người dùng.
- **Auth Required:** Yes

### `[PATCH]` /api/v1/admin/users/:id
- **Mô tả:** Khóa, mở khóa, hoặc đổi quyền người dùng.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/users/:id
- **Mô tả:** Xóa người dùng khỏi hệ thống.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/packages
- **Mô tả:** Lấy danh sách các gói cước (Subscription packages).
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/packages
- **Mô tả:** Tạo gói cước mới.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/packages/:id
- **Mô tả:** Xem chi tiết gói cước.
- **Auth Required:** Yes

### `[PATCH]` /api/v1/admin/packages/:id
- **Mô tả:** Cập nhật thông tin/giá gói cước.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/packages/:id
- **Mô tả:** Xóa gói cước (hoặc ẩn).
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/transactions
- **Mô tả:** Lấy lịch sử giao dịch toàn hệ thống.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/transactions/stats
- **Mô tả:** Lấy thống kê doanh thu, giao dịch theo thời gian.
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/transactions/manual
- **Mô tả:** Cộng/trừ tiền hoặc gán gói cước thủ công cho user.
- **Auth Required:** Yes

### `[PATCH]` /api/v1/admin/transactions/:id/status
- **Mô tả:** Đổi trạng thái của một giao dịch (Pending -> Success).
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/transactions/:id
- **Mô tả:** Xóa bản ghi giao dịch (Hiếm dùng).
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/dashboard
- **Mô tả:** Lấy các chỉ số thống kê tổng quát cho Admin Dashboard.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/cv-templates
- **Mô tả:** Lấy danh sách các mẫu CV (CV Templates).
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/cv-templates
- **Mô tả:** Tạo CV Template mới.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/cv-templates/:id
- **Mô tả:** Chi tiết CV Template.
- **Auth Required:** Yes

### `[PUT]` /api/v1/admin/cv-templates/:id
- **Mô tả:** Cập nhật CV Template.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/cv-templates/:id
- **Mô tả:** Xóa CV Template.
- **Auth Required:** Yes

### `[GET]` /api/v1/admin/notifications
- **Mô tả:** Lấy danh sách các thông báo hệ thống đã gửi.
- **Auth Required:** Yes

### `[POST]` /api/v1/admin/notifications/send
- **Mô tả:** Phát một thông báo mới tới User hoặc toàn hệ thống.
- **Auth Required:** Yes

### `[DELETE]` /api/v1/admin/notifications/:id
- **Mô tả:** Thu hồi/Xóa thông báo đã gửi.
- **Auth Required:** Yes

## 📌 Nhóm: Other

### `[POST]` /api/v1/tts
- **Mô tả:** Chuyển đổi Text sang Speech (Audio).
- **Auth Required:** Yes

### `[GET]` /api/v1/tts
- **Mô tả:** Lấy stream âm thanh TTS đã tạo.
- **Auth Required:** Yes
