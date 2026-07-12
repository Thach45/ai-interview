import rateLimit from 'express-rate-limit';

/**
 * Giới hạn chung cho toàn bộ hệ thống API
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 1500, // Tối đa 1500 request từ mỗi IP trong 15 phút (cho phép Polling QR Code thoải mái)
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true, // Trả về thông tin giới hạn trong headers `RateLimit-*`
  legacyHeaders: false, // Tắt header `X-RateLimit-*` cũ
});

/**
 * Giới hạn khắt khe cho các API nhạy cảm (Login, Register, OTP)
 * Chống brute-force và spam mail
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 15, // Tối đa 15 lần thử trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập/đăng ký không thành công. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Giới hạn gửi OTP: 3 phút mới được gửi lại 1 lần
 */
export const otpLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 phút
  max: 1, // Chỉ cho phép 1 lần gửi trong 3 phút
  message: {
    success: false,
    message: 'Vui lòng đợi 3 phút trước khi yêu cầu mã OTP mới.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Tính cả request thành công
});

export const chatRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 giây
  max: 3,
  message: {
    success: false,
    error: 'Bạn đang gửi tin nhắn quá nhanh. Vui lòng chờ một chút!',
  },
  standardHeaders: true,
});

export const analysisCVRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 2, // Tối đa 2 lần thử trong 1 phút
  message: {
    success: false,
    message: 'Hệ thống quá tải do có quá nhiều CV đang được xử lý. Vui lòng thử lại sau 1 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Tính cả request thành công
});
