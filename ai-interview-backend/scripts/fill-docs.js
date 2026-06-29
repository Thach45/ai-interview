const fs = require('fs');
const content = fs.readFileSync('API_DOCS.md', 'utf-8');

const descriptions = {
  // Auth
  'POST /api/v1/auth/login': 'Đăng nhập vào hệ thống bằng email và password.',
  'POST /api/v1/auth/logout': 'Đăng xuất người dùng hiện tại.',
  'POST /api/v1/auth/refresh': 'Lấy Access Token mới bằng Refresh Token.',
  'POST /api/v1/auth/register': 'Đăng ký tài khoản mới (Ứng viên/Nhà tuyển dụng).',
  'POST /api/v1/auth/send-otp': 'Gửi mã OTP xác thực qua email.',
  'POST /api/v1/auth/verify-otp': 'Xác thực mã OTP mà người dùng nhập vào.',
  'POST /api/v1/auth/resend-otp': 'Gửi lại mã OTP qua email.',
  'POST /api/v1/auth/forgot-password': 'Yêu cầu đặt lại mật khẩu, gửi link/OTP qua email.',
  'POST /api/v1/auth/reset-password': 'Đặt lại mật khẩu mới bằng token/OTP hợp lệ.',
  
  // User
  'GET /api/v1/user': 'Lấy thông tin profile của người dùng đang đăng nhập.',
  'GET /api/v1/user/dashboard': 'Lấy dữ liệu thống kê tổng quan cho trang chủ của User.',
  'PUT /api/v1/user/me': 'Cập nhật thông tin cá nhân (Tên, Avatar, v.v).',
  
  // CV
  'POST /api/v1/cvs/upload': 'Upload file CV (PDF/Word) lên hệ thống (Dùng multipart/form-data).',
  'GET /api/v1/cvs/my-cvs': 'Lấy danh sách các CV mà user đã upload/tạo.',
  'POST /api/v1/analysis-cv/analyze': 'Dùng AI để phân tích điểm mạnh, điểm yếu của CV.',
  'POST /api/v1/analysis-cv/optimize': 'Dùng AI để tối ưu hóa và viết lại nội dung CV.',
  'POST /api/v1/analysis-cv/export-pdf': 'Xuất CV đã tối ưu ra định dạng PDF.',
  
  // Job
  'GET /api/v1/job-templates': 'Lấy danh sách các mẫu công việc (Job Templates) mẫu.',
  'GET /api/v1/job-templates/:id': 'Xem chi tiết một Job Template cụ thể.',
  'GET /api/v1/categories': 'Lấy danh sách danh mục nghề nghiệp (Cấu trúc phân cấp).',
  'GET /api/v1/categories/flat': 'Lấy danh sách danh mục nghề nghiệp (Dạng phẳng - 1 cấp).',
  'GET /api/v1/categories/:id': 'Xem chi tiết một danh mục nghề nghiệp.',
  
  // Interview
  'POST /api/v1/interview-ai/setup': 'Khởi tạo cấu hình ban đầu cho phiên phỏng vấn AI.',
  'GET /api/v1/interview-ai/:id': 'Lấy thông tin chi tiết của một phòng phỏng vấn.',
  'GET /api/v1/interview-ai/:id/messages': 'Lấy lịch sử chat/tin nhắn trong phiên phỏng vấn.',
  'GET /api/v1/interview-ai/:id/stream': 'Kết nối Server-Sent Events (SSE) để nhận tin nhắn AI trả về realtime.',
  'POST /api/v1/interview-ai/:id/start': 'Bắt đầu phiên phỏng vấn chính thức.',
  'POST /api/v1/interview-ai/:id/chat': 'Gửi câu trả lời bằng Text cho AI.',
  'POST /api/v1/interview-ai/:id/chat-audio': 'Gửi file ghi âm giọng nói (Audio) cho AI xử lý.',
  'POST /api/v1/interview-ai/:id/submit': 'Nộp bài và kết thúc phiên phỏng vấn.',
  'GET /api/v1/interview-ai/:id/result': 'Lấy kết quả đánh giá, nhận xét từ AI sau khi phỏng vấn.',
  
  // Subscription
  'GET /api/v1/subscriptions/packages': 'Lấy danh sách các gói cước (Packages) có thể mua.',
  'POST /api/v1/subscriptions/purchase': 'Tạo giao dịch thanh toán mua gói cước.',
  'GET /api/v1/subscriptions/transactions/:id/status': 'Kiểm tra trạng thái của một giao dịch thanh toán.',
  
  // Notification
  'GET /api/v1/notifications': 'Lấy danh sách thông báo của người dùng.',
  'GET /api/v1/notifications/stream': 'Kết nối Server-Sent Events (SSE) để nhận thông báo realtime.',
  'PATCH /api/v1/notifications/read-all': 'Đánh dấu tất cả thông báo là đã đọc.',
  'PATCH /api/v1/notifications/:id/read': 'Đánh dấu một thông báo cụ thể là đã đọc.',
  
  // Admin
  'GET /api/v1/admin/categories': 'Lấy danh sách danh mục (Admin view).',
  'POST /api/v1/admin/categories': 'Thêm mới một danh mục công việc.',
  'GET /api/v1/admin/categories/flat': 'Lấy danh sách danh mục (Flat array).',
  'GET /api/v1/admin/categories/:id': 'Lấy thông tin 1 danh mục.',
  'PUT /api/v1/admin/categories/:id': 'Cập nhật thông tin danh mục.',
  'DELETE /api/v1/admin/categories/:id': 'Xóa danh mục.',
  
  'GET /api/v1/admin/job-templates': 'Lấy danh sách Job Templates.',
  'POST /api/v1/admin/job-templates': 'Thêm mới một Job Template.',
  'GET /api/v1/admin/job-templates/:id': 'Xem chi tiết Job Template.',
  'PUT /api/v1/admin/job-templates/:id': 'Cập nhật Job Template.',
  'DELETE /api/v1/admin/job-templates/:id': 'Xóa Job Template.',
  
  'GET /api/v1/admin/users': 'Lấy danh sách tài khoản người dùng.',
  'POST /api/v1/admin/users': 'Admin tự tạo tài khoản mới.',
  'GET /api/v1/admin/users/:id': 'Xem chi tiết một người dùng.',
  'PATCH /api/v1/admin/users/:id': 'Khóa, mở khóa, hoặc đổi quyền người dùng.',
  'DELETE /api/v1/admin/users/:id': 'Xóa người dùng khỏi hệ thống.',
  
  'GET /api/v1/admin/packages': 'Lấy danh sách các gói cước (Subscription packages).',
  'POST /api/v1/admin/packages': 'Tạo gói cước mới.',
  'GET /api/v1/admin/packages/:id': 'Xem chi tiết gói cước.',
  'PATCH /api/v1/admin/packages/:id': 'Cập nhật thông tin/giá gói cước.',
  'DELETE /api/v1/admin/packages/:id': 'Xóa gói cước (hoặc ẩn).',
  
  'GET /api/v1/admin/transactions': 'Lấy lịch sử giao dịch toàn hệ thống.',
  'GET /api/v1/admin/transactions/stats': 'Lấy thống kê doanh thu, giao dịch theo thời gian.',
  'POST /api/v1/admin/transactions/manual': 'Cộng/trừ tiền hoặc gán gói cước thủ công cho user.',
  'PATCH /api/v1/admin/transactions/:id/status': 'Đổi trạng thái của một giao dịch (Pending -> Success).',
  'DELETE /api/v1/admin/transactions/:id': 'Xóa bản ghi giao dịch (Hiếm dùng).',
  
  'GET /api/v1/admin/dashboard': 'Lấy các chỉ số thống kê tổng quát cho Admin Dashboard.',
  
  'GET /api/v1/admin/cv-templates': 'Lấy danh sách các mẫu CV (CV Templates).',
  'POST /api/v1/admin/cv-templates': 'Tạo CV Template mới.',
  'GET /api/v1/admin/cv-templates/:id': 'Chi tiết CV Template.',
  'PUT /api/v1/admin/cv-templates/:id': 'Cập nhật CV Template.',
  'DELETE /api/v1/admin/cv-templates/:id': 'Xóa CV Template.',
  
  'GET /api/v1/admin/notifications': 'Lấy danh sách các thông báo hệ thống đã gửi.',
  'POST /api/v1/admin/notifications/send': 'Phát một thông báo mới tới User hoặc toàn hệ thống.',
  'DELETE /api/v1/admin/notifications/:id': 'Thu hồi/Xóa thông báo đã gửi.',
  
  // Other
  'POST /api/v1/tts': 'Chuyển đổi Text sang Speech (Audio).',
  'GET /api/v1/tts': 'Lấy stream âm thanh TTS đã tạo.'
};

let lines = content.split('\n');
let newLines = [];
let currentMethodPath = '';

for (let line of lines) {
  const match = line.match(/### `\[(.*?)\]` (.*)/);
  if (match) {
    currentMethodPath = `${match[1]} ${match[2]}`.trim();
  }
  
  if (line.includes('- **Mô tả:** [Cần bổ sung]')) {
    if (descriptions[currentMethodPath]) {
      line = `- **Mô tả:** ${descriptions[currentMethodPath]}`;
    } else {
      line = `- **Mô tả:** API phục vụ cho ${currentMethodPath.split(' ')[1]}`;
    }
  }
  newLines.push(line);
}

fs.writeFileSync('API_DOCS.md', newLines.join('\n'));
console.log('Descriptions filled!');
