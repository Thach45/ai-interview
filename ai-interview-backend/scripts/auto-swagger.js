const fs = require('fs');
const path = require('path');

const indexContent = fs.readFileSync(path.join(__dirname, '../src/routes/v1/index.ts'), 'utf-8');
const routesDir = path.join(__dirname, '../src/routes/v1');

const routeMapping = [];
const lines = indexContent.split('\n');
const importMap = {};

for (let line of lines) {
  const importMatch = line.match(/import\s+(\w+)\s+from\s+['"]\.\/(.*?)['"]/);
  if (importMatch) {
    importMap[importMatch[1]] = importMatch[2]; // e.g., authRoute -> auth/auth.route
  }
}

for (let line of lines) {
  const useMatch = line.match(/router\.use\(['"](.*?)['"],\s*(\w+)\)/);
  if (useMatch) {
    const basePath = `/api/v1${useMatch[1]}`;
    const varName = useMatch[2];
    if (importMap[varName]) {
      routeMapping.push({
        basePath,
        file: importMap[varName] + (importMap[varName].endsWith('.route') || importMap[varName].endsWith('.routes') ? '.ts' : '')
      });
    }
  }
}

console.log("Route Mapping:", routeMapping);

const descriptions = {
  // Auth
  'POST /api/v1/auth/login': 'Đăng nhập vào hệ thống bằng email và password.',
  'POST /api/v1/auth/logout': 'Đăng xuất người dùng hiện tại.',
  'POST /api/v1/auth/refresh': 'Lấy Access Token mới bằng Refresh Token.',
  'POST /api/v1/auth/register': 'Đăng ký tài khoản mới.',
  'POST /api/v1/auth/send-otp': 'Gửi mã OTP xác thực qua email.',
  'POST /api/v1/auth/verify-otp': 'Xác thực mã OTP.',
  'POST /api/v1/auth/resend-otp': 'Gửi lại mã OTP.',
  'POST /api/v1/auth/forgot-password': 'Yêu cầu đặt lại mật khẩu.',
  'POST /api/v1/auth/reset-password': 'Đặt lại mật khẩu mới.',
  // User
  'GET /api/v1/user': 'Lấy thông tin profile.',
  'GET /api/v1/user/dashboard': 'Lấy dữ liệu thống kê tổng quan.',
  'PUT /api/v1/user/me': 'Cập nhật thông tin cá nhân.',
  // CV
  'POST /api/v1/cvs/upload': 'Upload file CV.',
  'GET /api/v1/cvs/my-cvs': 'Lấy danh sách các CV.',
  'POST /api/v1/analysis-cv/analyze': 'Phân tích điểm mạnh, yếu của CV.',
  'POST /api/v1/analysis-cv/optimize': 'Tối ưu hóa nội dung CV.',
  'POST /api/v1/analysis-cv/export-pdf': 'Xuất CV ra định dạng PDF.',
  // Job
  'GET /api/v1/job-templates': 'Lấy danh sách các mẫu công việc.',
  'GET /api/v1/job-templates/:id': 'Xem chi tiết một Job Template.',
  'GET /api/v1/categories': 'Lấy danh sách danh mục nghề nghiệp.',
  'GET /api/v1/categories/flat': 'Lấy danh sách danh mục nghề nghiệp dạng phẳng.',
  'GET /api/v1/categories/:id': 'Xem chi tiết một danh mục nghề nghiệp.',
  // Interview
  'POST /api/v1/interview-ai/setup': 'Khởi tạo cấu hình ban đầu.',
  'GET /api/v1/interview-ai/:id': 'Lấy thông tin chi tiết phòng phỏng vấn.',
  'GET /api/v1/interview-ai/:id/messages': 'Lấy lịch sử chat.',
  'GET /api/v1/interview-ai/:id/stream': 'Nhận tin nhắn AI realtime (SSE).',
  'POST /api/v1/interview-ai/:id/start': 'Bắt đầu phiên phỏng vấn.',
  'POST /api/v1/interview-ai/:id/chat': 'Gửi câu trả lời Text.',
  'POST /api/v1/interview-ai/:id/chat-audio': 'Gửi file Audio.',
  'POST /api/v1/interview-ai/:id/submit': 'Nộp bài kết thúc.',
  'GET /api/v1/interview-ai/:id/result': 'Lấy kết quả đánh giá.',
  // Subscription
  'GET /api/v1/subscriptions/packages': 'Lấy danh sách các gói cước.',
  'POST /api/v1/subscriptions/purchase': 'Tạo giao dịch thanh toán.',
  'GET /api/v1/subscriptions/transactions/:id/status': 'Kiểm tra trạng thái giao dịch.',
  // Notification
  'GET /api/v1/notifications': 'Lấy danh sách thông báo.',
  'GET /api/v1/notifications/stream': 'Nhận thông báo realtime (SSE).',
  'PATCH /api/v1/notifications/read-all': 'Đánh dấu tất cả đã đọc.',
  'PATCH /api/v1/notifications/:id/read': 'Đánh dấu đã đọc.',
  // Admin
  'GET /api/v1/admin/categories': 'Lấy danh sách danh mục.',
  'POST /api/v1/admin/categories': 'Thêm mới danh mục.',
  'GET /api/v1/admin/categories/flat': 'Lấy danh sách danh mục (Flat).',
  'GET /api/v1/admin/categories/:id': 'Lấy thông tin danh mục.',
  'PUT /api/v1/admin/categories/:id': 'Cập nhật danh mục.',
  'DELETE /api/v1/admin/categories/:id': 'Xóa danh mục.',
  'GET /api/v1/admin/job-templates': 'Lấy danh sách Job Templates.',
  'POST /api/v1/admin/job-templates': 'Thêm mới Job Template.',
  'GET /api/v1/admin/job-templates/:id': 'Xem chi tiết Job Template.',
  'PUT /api/v1/admin/job-templates/:id': 'Cập nhật Job Template.',
  'DELETE /api/v1/admin/job-templates/:id': 'Xóa Job Template.',
  'GET /api/v1/admin/users': 'Lấy danh sách tài khoản.',
  'POST /api/v1/admin/users': 'Tạo tài khoản mới.',
  'GET /api/v1/admin/users/:id': 'Xem chi tiết người dùng.',
  'PATCH /api/v1/admin/users/:id': 'Khóa/mở khóa người dùng.',
  'DELETE /api/v1/admin/users/:id': 'Xóa người dùng.',
  'GET /api/v1/admin/packages': 'Lấy danh sách gói cước.',
  'POST /api/v1/admin/packages': 'Tạo gói cước mới.',
  'GET /api/v1/admin/packages/:id': 'Xem chi tiết gói cước.',
  'PATCH /api/v1/admin/packages/:id': 'Cập nhật gói cước.',
  'DELETE /api/v1/admin/packages/:id': 'Xóa gói cước.',
  'GET /api/v1/admin/transactions': 'Lấy lịch sử giao dịch.',
  'GET /api/v1/admin/transactions/stats': 'Lấy thống kê doanh thu.',
  'POST /api/v1/admin/transactions/manual': 'Cộng/trừ tiền thủ công.',
  'PATCH /api/v1/admin/transactions/:id/status': 'Đổi trạng thái giao dịch.',
  'DELETE /api/v1/admin/transactions/:id': 'Xóa bản ghi giao dịch.',
  'GET /api/v1/admin/dashboard': 'Lấy thống kê Admin Dashboard.',
  'GET /api/v1/admin/cv-templates': 'Lấy danh sách mẫu CV.',
  'POST /api/v1/admin/cv-templates': 'Tạo CV Template mới.',
  'GET /api/v1/admin/cv-templates/:id': 'Chi tiết CV Template.',
  'PUT /api/v1/admin/cv-templates/:id': 'Cập nhật CV Template.',
  'DELETE /api/v1/admin/cv-templates/:id': 'Xóa CV Template.',
  'GET /api/v1/admin/notifications': 'Lấy danh sách thông báo đã gửi.',
  'POST /api/v1/admin/notifications/send': 'Phát thông báo hệ thống.',
  'DELETE /api/v1/admin/notifications/:id': 'Thu hồi thông báo.',
  // Other
  'POST /api/v1/tts': 'Chuyển đổi Text sang Audio.',
  'GET /api/v1/tts': 'Lấy stream âm thanh TTS.'
};

routeMapping.forEach(mapping => {
  let fileExt = mapping.file;
  if (!fileExt.endsWith('.ts')) fileExt += '.ts';
  const filePath = path.join(routesDir, fileExt);
  
  if (!fs.existsSync(filePath)) return;
  if (filePath.includes('auth.route.ts')) return; // Already perfect

  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  
  // Clean up the previously injected dummy JSDoc blocks
  const cleanedLines = [];
  let skip = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '/**' && lines[i+1] && lines[i+1].includes('# Thêm đường dẫn thực tế')) {
      skip = true;
    }
    if (skip) {
      if (lines[i].trim() === '*/') skip = false;
      continue;
    }
    cleanedLines.push(lines[i]);
  }
  
  lines.length = 0;
  lines.push(...cleanedLines);
  
  let newLines = [];
  const baseName = path.basename(filePath).split('.')[0];
  const tag = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let match = line.match(/^router\.(get|post|put|patch|delete)\(\s*['"](.*?)['"]/);
    
    if (match) {
      const method = match[1];
      const subPath = match[2] === '/' ? '' : match[2];
      const fullPath = mapping.basePath + subPath;
      
      const key = `${method.toUpperCase()} ${fullPath}`;
      const desc = descriptions[key] || `API cho ${key}`;
      
      // Build Swagger JSDoc
      // Example fullPath: /api/v1/interview-ai/:id
      // Swagger expects path parameters in brackets: /api/v1/interview-ai/{id}
      let swaggerPath = fullPath.replace(/:(\w+)/g, '{$1}');
      
      let params = [];
      const paramMatches = fullPath.match(/:(\w+)/g);
      if (paramMatches) {
        paramMatches.forEach(p => {
          params.push(` *       - in: path`);
          params.push(` *         name: ${p.substring(1)}`);
          params.push(` *         required: true`);
          params.push(` *         schema:`);
          params.push(` *           type: string`);
        });
      }

      newLines.push('/**');
      newLines.push(' * @swagger');
      newLines.push(` * ${swaggerPath}:`);
      newLines.push(` *   ${method}:`);
      newLines.push(` *     summary: ${desc}`);
      newLines.push(` *     tags: [${tag}]`);
      if (fullPath.includes('/admin') || !fullPath.includes('/auth')) {
        newLines.push(` *     security:`);
        newLines.push(` *       - bearerAuth: []`);
      }
      if (params.length > 0) {
        newLines.push(` *     parameters:`);
        newLines.push(...params);
      }
      newLines.push(` *     responses:`);
      newLines.push(` *       200:`);
      newLines.push(` *         description: OK`);
      newLines.push(' */');
    }
    newLines.push(line);
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`Applied Real JSDoc to ${path.basename(filePath)}`);
});
