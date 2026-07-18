# Tài liệu Đặc tả Hệ thống (System Specification) - Nền tảng AI Interview

## 1. Giới thiệu Tổng quan (Project Overview)
Hệ thống **AI Interview** là một nền tảng hỗ trợ tuyển dụng và ứng tuyển dựa trên công nghệ AI (AI-First Approach). Hệ thống tập trung tối ưu hóa trải nghiệm của ứng viên thông qua việc đánh giá, đối chiếu và tối ưu hóa CV dựa trên mô tả công việc (Job Description - JD), đồng thời cung cấp môi trường luyện tập phỏng vấn giả lập sát với thực tế dưới sự dẫn dắt, tương tác và đánh giá chi tiết của AI.

### Kiến trúc Hybrid-LLM (Mô hình AI Lai)
Hệ thống áp dụng kiến trúc Hybrid-LLM nhằm tận dụng tối đa thế mạnh của các mô hình ngôn ngữ lớn hàng đầu hiện nay:
*   **Google Gemini (2.5-Flash):** Đóng vai trò xử lý các tác vụ đa phương thức (Multimodal) như trích xuất văn bản từ tệp tin CV (PDF/DOCX), chuyển đổi giọng nói ứng viên thành văn bản (Speech-to-Text - STT) trong phòng phỏng vấn thoại, và xử lý các tác vụ yêu cầu tốc độ phản hồi nhanh.
*   **DeepSeek (V3 & Pro/Reasoning):** Đóng vai trò là "bộ não suy luận" chịu trách nhiệm sinh bộ câu hỏi phỏng vấn cốt lõi dựa trên hồ sơ ứng viên, duy trì mạch hội thoại phỏng vấn (tự động phân tích câu trả lời để đưa ra câu hỏi phụ xoáy sâu - Follow-up), và thực hiện chấm điểm, đánh giá chi tiết câu trả lời theo các tiêu chí Rubric định sẵn.

---

## 2. Các nhóm Người dùng (Actors)
1.  **Ứng viên (Candidate):** Người dùng chính của hệ thống. Thực hiện tải lên và quản lý CV, phân tích mức độ phù hợp của CV với tin tuyển dụng (JD), tối ưu hóa nội dung CV và tham gia các phiên phỏng vấn thử (Văn bản/Giọng nói) để nhận báo cáo năng lực.
2.  **Nhà tuyển dụng (HR/Recruiter):** Nhóm người dùng mục tiêu trong tương lai (đã thiết kế schema dữ liệu nhưng chưa xây dựng API & UI). Cho phép tạo các chiến dịch tuyển dụng, thiết lập phòng phỏng vấn ảo (`RecruiterRoom`) kèm bộ tiêu chí tuyển dụng chuyên biệt, mời ứng viên tham gia phỏng vấn và lọc ứng viên tự động qua bảng xếp hạng điểm số AI.
3.  **Quản trị viên (Admin):** Quản lý hệ thống, quản lý người dùng, cấu hình danh mục nghề nghiệp (`JobCategory`), tạo tin tuyển dụng mẫu (`JobTemplate`), quản lý gói dịch vụ (`SubscriptionPackage`), theo dõi lịch sử giao dịch nạp tiền (`Transaction`), thiết lập mẫu CV (`CvTemplate`) và gửi thông báo toàn hệ thống.

---

## 3. Chức năng chi tiết hiện có (Existing Features)

### 3.1. Phân hệ Ứng viên (Candidate Module)

#### A. Đăng ký/Đăng nhập & Xác thực tài khoản
*   Hỗ trợ đăng ký và đăng nhập tài khoản bằng email/mật khẩu truyền thống.
*   Hệ thống xác thực hai lớp và kích hoạt tài khoản thông qua mã OTP gửi về email (`VerificationCode`).
*   Bảo mật phiên đăng nhập bằng JWT Token (Access Token lưu trong bộ nhớ tạm/Cookie và hỗ trợ cơ chế Refresh Token).

#### B. Dashboard Ứng viên (Trang chủ)
*   **Thống kê tổng quan:** Hiển thị số liệu trực quan về quá trình luyện tập gồm: Tổng số phiên phỏng vấn, số phiên đã hoàn thành, số lượng CV đã tải lên/phân tích, và điểm số trung bình cộng của các lần phỏng vấn.
*   **Biểu đồ hiệu suất (Performance Trend Chart):** Biểu đồ thể hiện xu hướng điểm số của 7 phiên phỏng vấn gần nhất giúp ứng viên theo dõi tiến trình cải thiện kỹ năng.
*   **Hoạt động gần đây (Recent Activities):** Liệt kê lịch sử hoạt động mới nhất của người dùng (tải CV, bắt đầu hoặc hoàn thành phỏng vấn).
*   **Gợi ý việc làm (Suggested Jobs):** Gợi ý các vị trí tuyển dụng mẫu (Hot Jobs) phù hợp để ứng viên nhanh chóng click phân tích hoặc phỏng vấn thử.
*   **Nhẩm lại kiến thức (Practice Mode Widget):** Giao diện ôn tập nhanh giúp ứng viên luyện nói/luyện phát âm cơ bản trước khi bước vào phòng phỏng vấn chính thức.

#### C. Quản lý hồ sơ CV (My CVs)
*   **Tải lên CV:** Hỗ trợ tải tệp CV (định dạng PDF/DOCX) lên hệ thống. Tệp được lưu trữ trên Cloudinary.
*   **Trích xuất văn bản:** Backend sử dụng thư viện `pdf-parse` để tự động đọc và trích xuất nội dung văn bản thô từ tệp CV phục vụ làm ngữ cảnh cho AI.

#### D. Trợ lý Phân tích & Tối ưu hóa CV (CV Analysis & Optimization)
*   **So khớp CV với JD (CV Matching):** Người dùng chọn một CV đã tải lên và đối chiếu với một tin tuyển dụng mẫu (Hot Jobs) hoặc dán thủ công một mô tả công việc bên ngoài (Custom JD). AI sẽ trả về:
    *   Điểm số tương hợp (Match Score % từ 0-100).
    *   Nhận xét tổng quan, danh sách Điểm mạnh (Strengths) và Điểm yếu (Weaknesses) của CV so với yêu cầu công việc.
    *   **Phân tích khoảng cách năng lực (Skills Gap Analysis):** So sánh trực quan mức độ đáp ứng của ứng viên đối với các kỹ năng yêu cầu (Required vs. User Level).
    *   Từ khóa kỹ năng được tìm thấy và từ khóa kỹ năng bị thiếu hụt.
    *   Danh sách gợi ý cải thiện CV được phân loại theo mức độ ưu tiên (HIGH, MEDIUM, LOW).
*   **Tối ưu hóa nội dung CV (CV AI-Rewrite):** Từ kết quả phân tích khoảng trống, AI tự động tạo ra một bản CV mới (`OptimizedCv`) đã được bổ sung từ khóa thiếu, viết lại các phần kinh nghiệm/dự án chuẩn ATS và làm nổi bật năng lực bám sát JD.
*   **Chỉnh sửa CV trực quan:** Cung cấp giao diện biểu mẫu hiển thị song song nội dung cũ và nội dung AI đề xuất thay đổi (ADD_KEYWORD, REWRITE, EXPAND) ở từng đề mục (Kinh nghiệm, Dự án, Kỹ năng, Học vấn...).
*   **Xuất bản CV PDF:** Backend sử dụng trình duyệt không đầu **Puppeteer** để kết xuất (render) cấu trúc HTML CV được tối ưu thành tệp PDF A4 tiêu chuẩn, cho phép ứng viên tải về máy.

#### E. Trung tâm Phỏng vấn Giả lập (Smart Interview Hub)
*   **Thiết lập phiên phỏng vấn (Interview Setup):** Cho phép ứng viên thiết lập tùy chỉnh:
    *   Chọn CV và chọn JD (từ Hot Jobs hoặc Custom JD).
    *   Chọn chế độ phỏng vấn: Chế độ Văn bản (Text Chat) hoặc Chế độ Video/Giọng nói (Video/Voice Room).
    *   Thiết lập Cấp độ (Intern, Fresher, Junior, Middle, Senior, Manager...), Ngôn ngữ phỏng vấn (Tiếng Việt, Tiếng Anh, Song ngữ), Phong cách phỏng vấn viên (Chuyên nghiệp, Thân thiện, Nghiêm khắc, Vui vẻ), Độ khó (1-5), Thời lượng và danh sách kỹ năng trọng tâm cần hỏi.
*   **Tạo câu hỏi cốt lõi theo Rubric (Core Questions & Rubrics):** Trước khi bắt đầu, AI phân tích CV và JD để sinh ra một bộ câu hỏi cốt lõi (từ 3-5 câu tùy cấu hình) kèm theo bộ tiêu chí chấm điểm chi tiết (Rubrics) cho từng câu. Mỗi câu hỏi cốt lõi sẽ có lý do hỏi và danh sách các tiêu chí đánh giá (Rubric Criterion) chứa điểm số tối đa.
*   **Phòng phỏng vấn Chat (Text Room):**
    *   Ứng viên chat trực tiếp bằng văn bản với AI.
    *   AI đặt câu hỏi cốt lõi, lắng nghe câu trả lời và tự động quyết định đưa ra các câu hỏi phụ xoáy sâu (Follow-up questions) nhằm làm rõ ý của ứng viên trước khi chuyển sang chủ đề tiếp theo.
    *   Tích hợp công nghệ **SSE Stream (Server-Sent Events)** giúp truyền tải câu trả lời của AI dưới dạng gõ chữ thời gian thực (Typing effect), giảm thời gian chờ đợi.
*   **Phòng phỏng vấn Video/Thoại (Video/Voice Room):**
    *   Giao diện giả lập phòng gọi video với Avatar phỏng vấn viên ảo có chuyển động mô phỏng.
    *   Ứng viên trả lời bằng giọng nói thông qua việc ghi âm trực tiếp trên trình duyệt.
    *   Hệ thống sử dụng **Gemini 2.5-Flash** làm bộ chuyển đổi giọng nói thành văn bản (Speech-to-Text).
    *   Câu trả lời của AI được sinh ra và đồng thời chuyển đổi thành âm thanh bằng dịch vụ **Google Cloud Text-to-Speech (TTS)**, phát lại cho ứng viên nghe với giọng đọc cá nhân hóa theo Persona đã chọn.
*   **Báo cáo kết quả đánh giá (Interview Report):** Sau khi hoàn thành và nộp bài, AI sẽ chấm điểm dựa trên lịch sử chat và bộ tiêu chí Rubrics đã tạo ở đầu phiên. Ứng viên nhận được báo cáo bao gồm:
    *   Điểm số tổng quan (Overall Score %) và Quyết định đề xuất (Pass, Fail, Consider).
    *   Đánh giá năng lực theo 5 khía cạnh dạng biểu đồ Radar: Chuyên môn (Domain), Giải quyết vấn đề (Problem Solving), Mức độ rõ ràng (Clarity), Sự tự tin (Confidence) và Độ bám sát (Relevance).
    *   Phân tích Điểm mạnh, Điểm yếu và Lộ trình học tập cải thiện (Learning Path).
    *   **Báo cáo chi tiết từng câu hỏi:** Điểm số cụ thể cho từng câu, nhận xét chi tiết (Feedback) và bảng đối chiếu tiêu chí Rubric (Chỉ rõ tiêu chí nào đạt/chưa đạt kèm bằng chứng trích xuất từ câu trả lời của ứng viên).

#### F. Hệ thống nạp tiền và mua gói Credit
*   Hệ thống áp dụng mô hình Pay-as-you-go hoặc mua gói dịch vụ. Mỗi lần chạy Phân tích CV, Tối ưu CV hoặc tạo phiên Phỏng vấn sẽ tiêu tốn một số lượng Credit nhất định.
*   **Nạp tiền tự động qua Sepay Polling:**
    *   Người dùng chọn gói dịch vụ (`SubscriptionPackage`). Hệ thống tạo giao dịch (`Transaction`) trạng thái `PENDING` và sinh mã đối soát duy nhất có dạng `XINT XXXXXX`.
    *   Hiển thị mã QR thanh toán VietQR (chuyển khoản ngân hàng) chứa số tài khoản, ngân hàng thụ hưởng, số tiền chính xác và nội dung chuyển khoản là mã đối soát.
    *   Khi người dùng thực hiện chuyển khoản, hệ thống áp dụng cơ chế Polling (truy vấn định kỳ) đến API danh sách giao dịch của Sepay. Khi phát hiện giao dịch khớp mã đối soát và số tiền, hệ thống sử dụng cơ sở dữ liệu Transaction để tự động chuyển trạng thái giao dịch sang `SUCCESS` và cộng số dư Credit tức thì cho tài khoản của ứng viên.

#### G. Hệ thống Thông báo (Notification)
*   Nhận thông báo thời gian thực về tiến trình xử lý AI (Báo cáo phỏng vấn đã sẵn sàng, CV đã tối ưu hoàn tất).
*   Thông báo về giao dịch (Nạp tiền thành công, cảnh báo tài khoản hết credit).
*   Nhắc nhở học tập và các cập nhật từ quản trị viên.

---

### 3.2. Phân hệ Quản trị hệ thống (Admin Module - Dashboard & Management)
*   **Admin Dashboard:** Thống kê các chỉ số tăng trưởng của nền tảng: Tổng số người dùng, tổng số tin tuyển dụng, doanh thu từ các giao dịch nạp tiền, số lượng phiên phỏng vấn được tạo theo thời gian thực.
*   **Quản lý người dùng (Users):** Xem thông tin danh sách tài khoản, số dư credit, trạng thái tài khoản (Active/Inactive), cho phép khóa hoặc mở khóa tài khoản người dùng.
*   **Quản lý danh mục & Tin tuyển dụng (Categories & Job Templates):** Thêm, sửa, xóa các nhóm ngành nghề và các mẫu tin tuyển dụng (JD) có sẵn phục vụ ứng viên phỏng vấn nhanh.
*   **Quản lý gói dịch vụ (Packages):** Cấu hình các gói nạp credit (tên gói, giá tiền, số credit đi kèm, tính năng nổi bật).
*   **Quản lý giao dịch (Transactions):** Xem toàn bộ lịch sử giao dịch nạp tiền của hệ thống để quản lý dòng tiền và đối soát thủ công nếu cần.
*   **Quản lý mẫu CV (CV Templates):** Cấu hình các mẫu HTML/CSS của CV phục vụ tính năng xuất PDF.
*   **Quản lý thông báo (Notifications Admin):** Gửi thông báo hệ thống hàng loạt tới tất cả người dùng hoặc gửi thông báo cá nhân hóa.

---



## 6. Yêu cầu Phi chức năng (Non-Functional Requirements)
*   **UI/UX (Notion Design Aesthetic):** Giao diện phải tuân thủ nghiêm ngặt quy chuẩn thiết kế Notion được ghi nhận tại `DESIGN.md` (Tone màu trắng/navy, các gam màu pastel nhẹ nhàng, nút bấm chữ nhật bo góc 8px, các khối thẻ bo góc 12px, font chữ Notion-Sans, hiệu ứng chuyển cảnh mượt mà). Giao diện tối ưu hóa cho hiển thị responsive trên các thiết bị Mobile, Tablet, Desktop.
*   **Tối ưu độ trễ (Latency Control):** Do tích hợp mô hình AI kết hợp và luồng giọng nói (STT -> LLM -> TTS), độ trễ phản hồi của hệ thống cần được kiểm soát chặt chẽ. Hệ thống bắt buộc sử dụng cơ chế streaming text (SSE) để hiển thị câu hỏi của AI ngay lập tức mà không đợi AI sinh hết toàn bộ câu trả lời.
*   **Tính toàn vẹn giao dịch (Transaction Integrity):** Quá trình trừ credit khi phân tích/phỏng vấn và cộng credit khi nạp tiền phải được bọc trong database transaction để đảm bảo không xảy ra hiện tượng thất thoát hoặc sai lệch số dư.
*   **Bảo mật dữ liệu (Data Privacy):** Hồ sơ ứng viên (CV) trích xuất chứa nhiều thông tin nhạy cảm. Toàn bộ tệp tin CV phải được lưu trữ trên hạ tầng an toàn, thông tin truyền tải qua giao thức HTTPS bảo mật.

---


