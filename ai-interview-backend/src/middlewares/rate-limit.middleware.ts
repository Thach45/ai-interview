import rateLimit from 'express-rate-limit';

/**
 * Giới hạn chung cho toàn bộ hệ thống API
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tối đa 100 request từ mỗi IP trong 15 phút
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
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // Tối đa 10 lần thử trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập/đăng ký không thành công. Vui lòng thử lại sau 1 giờ.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Giới hạn gửi OTP: 10 phút mới được gửi lại 1 lần
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 1, // Chỉ cho phép 1 lần gửi trong 10 phút
  message: {
    success: false,
    message: 'Vui lòng đợi 10 phút trước khi yêu cầu mã OTP mới.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Tính cả request thành công
});
