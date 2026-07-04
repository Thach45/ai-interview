# Tài liệu Đặc tả Hệ thống (System Specification) - AI Interview

## 1. Giới thiệu Tổng quan (Overview)
Hệ thống **AI Interview** là một nền tảng hỗ trợ tuyển dụng và ứng tuyển dựa trên công nghệ AI (AI-First Approach). Hệ thống tập trung tối ưu hóa trải nghiệm của ứng viên thông qua việc đánh giá và tối ưu hóa CV dựa trên Job Description (JD), đồng thời cung cấp môi trường luyện tập phỏng vấn mô phỏng sát với thực tế nhất dưới sự dẫn dắt và đánh giá của AI.

Mục tiêu cốt lõi:
- Giúp ứng viên chuẩn bị CV hoàn hảo, tăng tỷ lệ qua vòng lọc hồ sơ.
- Cung cấp môi trường luyện tập phỏng vấn 1-1 với AI linh hoạt (Text/Voice), nhận phản hồi chi tiết để cải thiện.
- Mở rộng hỗ trợ nhà tuyển dụng (HR) trong việc sàng lọc tự động qua phỏng vấn AI.

---

## 2. Các nhóm Người dùng (Actors)
1. **Ứng viên (Candidate):** Người dùng chính của hệ thống, tìm kiếm việc làm, tối ưu CV và luyện tập phỏng vấn.
2. **Nhà tuyển dụng (HR/Recruiter):** Mở rộng trong tương lai, tạo chiến dịch tuyển dụng, phỏng vấn sơ loại tự động.
3. **Quản trị viên (Admin):** Quản lý hệ thống, quản lý Job Template, user, thanh toán.

---

## 3. Chức năng chi tiết (Detailed Features)

### 3.1. Phân hệ Ứng viên (Candidate Module)

#### A. Dashboard (Trang chủ)
- **Thống kê:** Hiển thị tổng quan số liệu về quá trình luyện tập (số phiên đã tham gia, điểm số trung bình).
- **Lịch sử hoạt động:** Liệt kê các phiên phỏng vấn và phân tích CV gần đây.
- **Gợi ý cải thiện:** AI tổng hợp dữ liệu từ các lần phỏng vấn trước để đưa ra lời khuyên cải thiện kỹ năng.

#### B. Trợ lý Ứng tuyển (Job Board & CV Matching)
- **Danh sách Việc làm (Hot Jobs):** Hiển thị các tin tuyển dụng thực tế (Job Templates) được cập nhật liên tục.
- **Phân tích CV (CV Analysis):** AI so sánh CV của người dùng với một JD cụ thể, đưa ra độ tương quan (Match Score %).
- **Phân tích khoảng trống (Gap Analysis):** Chỉ ra các kỹ năng, kinh nghiệm hoặc từ khóa quan trọng mà CV đang thiếu hụt so với JD.
- **Tối ưu hóa CV (CV Optimization):** AI đề xuất cách viết lại/bổ sung nội dung CV chi tiết để vượt qua các hệ thống ATS.
- **Tích hợp liền mạch:** Từ màn hình phân tích CV, user có thể chuyển ngay sang chế độ Luyện tập phỏng vấn với JD tương ứng chỉ bằng 1 click.

#### C. Trung tâm Phỏng vấn (Smart Interview Hub)
- **Thiết lập Phiên phỏng vấn:** 
  - Chọn từ **Hot Jobs Templates** (hệ thống tự trích xuất ngữ cảnh).
  - Hoặc **Custom Simulation:** Người dùng tự upload CV và JD riêng lẻ để tạo bộ câu hỏi "may đo".
- **Chế độ Phỏng vấn:**
  - Hỗ trợ cả hai chế độ: Trò chuyện văn bản (Text-chat) và Giao tiếp bằng giọng nói (Voice-to-Voice).
- **Đánh giá Phiên phỏng vấn (Interview Feedback):**
  - AI cung cấp kết quả phỏng vấn bao gồm: Điểm tổng quan, Điểm rõ ràng (Clarity), Điểm tự tin (Confidence), Điểm bám sát chuyên môn (Relevance).
  - Nhận xét chi tiết cho từng câu trả lời và hướng dẫn cách trả lời tốt hơn.

<!-- ### 3.2. Phân hệ Nhà tuyển dụng (Recruiter Mode)
- **Phòng phỏng vấn ảo (Recruiter Room):** Thiết lập thông tin JD, ngữ cảnh và tiêu chí chấm điểm tự động.
- **Quản lý Ứng viên:** Mời ứng viên bằng link.
- **Bảng xếp hạng:** Hệ thống tổng hợp kết quả phỏng vấn của các ứng viên tham gia, xếp hạng dựa trên điểm AI đánh giá. -->

### 3.3. Phân hệ Quản trị hệ thống (System & Admin)
- Quản lý Credit & Thanh toán.
- Quản lý dữ liệu Hot Jobs.

---

## 4. Kiến trúc Dữ liệu (Data Entities)

Hệ thống sử dụng cơ sở dữ liệu NoSQL (MongoDB) qua Prisma ORM.

- **User:** Lưu thông tin tài khoản, vai trò (CANDIDATE, HR, ADMIN), số dư Credit, liên kết với các tài nguyên khác.
- **UserCv:** Quản lý các CV được người dùng upload (nội dung text được trích xuất).
- **JobTemplate:** Quản lý danh sách các mẫu công việc có sẵn (tin tuyển dụng mẫu), bao gồm yêu cầu, quyền lợi và ngữ cảnh được AI trích xuất.
- **CvAnalysis:** Lưu kết quả mỗi lần AI phân tích và so sánh giữa CV và JobTemplate.
- **InterviewSession:** Đại diện cho một lần người dùng luyện tập phỏng vấn, liên kết với CV, JD/JobTemplate và trạng thái (PENDING, IN_PROGRESS, EVALUATING, COMPLETED).
- **InterviewMessage:** Lịch sử hội thoại (AI & User) trong một phiên phỏng vấn.
- **InterviewResult:** Kết quả đánh giá cuối cùng của phiên phỏng vấn với các chỉ số điểm số cụ thể.
- **Transaction:** Quản lý lịch sử nạp/trừ Credit của người dùng.
- **RecruiterRoom:** Quản lý chiến dịch tuyển dụng (dành cho HR).

---

## 5. Luồng xử lý chính (Core Workflows)

### Luồng Tối ưu CV & Phỏng vấn
1. Người dùng upload CV lên hệ thống.
2. Người dùng truy cập danh sách việc làm (Hot Jobs) hoặc cung cấp JD của công ty mục tiêu.
3. Hệ thống chạy `CvAnalysis`: Trả về điểm phù hợp, từ khóa thiếu và gợi ý sửa đổi.
4. Người dùng bấm "Luyện tập Phỏng vấn":
   - Tạo `InterviewSession`.
   - AI đóng vai trò HR, đặt câu hỏi dựa trên lỗ hổng giữa CV và JD.
   - Ứng viên trả lời qua text/voice (`InterviewMessage`).
5. Kết thúc phỏng vấn, AI tính toán và lưu `InterviewResult`.

---

## 6. Yêu cầu Phi chức năng (Non-Functional Requirements)
- **UI/UX:** Thiết kế hiện đại, sử dụng xu hướng Glassmorphism, các tương tác mượt mà và trực quan (Đã đề cập tại lộ trình phát triển Premium UI).
- **Hiệu suất & Độ trễ (Latency):** Việc tích hợp AI (đặc biệt là Voice-to-Voice) cần tối ưu độ trễ phản hồi của LLM để cuộc phỏng vấn diễn ra tự nhiên.
- **Bảo mật & Quyền riêng tư:** Đảm bảo dữ liệu cá nhân trong CV và các nội dung phỏng vấn được bảo mật tuyệt đối, không chia sẻ cho bên thứ ba.

---

## 7. Lộ trình Phát triển (Roadmap)
- **Phase 1 (Foundation):** Xây dựng Core API, Authentication, tính năng Job Board, CV Matching, CV Optimization.
- **Phase 2 (Core Feature):** Hoàn thiện AI Interview Simulation qua Text-chat, tạo hệ thống chấm điểm và feedback.
- **Phase 3 (Premium Experience):** Tích hợp Voice-to-Voice (STT/TTS), hoàn thiện giao diện đồ họa cao cấp, thống kê nâng cao. (đã hoàn thành cần tối ưu)
- **Phase 4 (B2B Expansion):** Phát hành Recruiter Mode cho doanh nghiệp.
