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

