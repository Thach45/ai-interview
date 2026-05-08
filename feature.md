# Phân tích chức năng hệ thống AI Interview (AI-First Approach)

Dựa trên việc phân tích đối thủ và định hướng dự án tập trung hoàn toàn vào AI, dưới đây là chi tiết các chức năng, thiết kế hệ thống và lộ trình phát triển.

## 1. Danh sách Chức năng (Features)

### Hệ thống phía User
*   **Trang chủ (Dashboard):** 
    *   Thống kê tiến độ luyện tập.
    *   Lịch sử các phiên phỏng vấn gần đây.
    *   Gợi ý các kỹ năng cần cải thiện dựa trên AI feedback.
*   **Smart Interview Hub (Trung tâm Phỏng vấn):** 
    *   Giao diện hợp nhất cho phép người dùng chọn nhanh từ danh sách **Hot Jobs** đang tuyển hoặc **Tự tạo phiên mới** bằng cách upload CV & JD riêng.
    *   **Hot Jobs Templates:** AI tự động trích xuất ngữ cảnh từ các tin tuyển dụng thực tế để user luyện tập ngay.
    *   **Custom Simulation:** Phân tích sâu sự tương quan giữa CV cá nhân và JD bất kỳ để đưa ra bộ câu hỏi "may đo" riêng cho từng người.
    *   **Chế độ phỏng vấn:** Hỗ trợ cả Voice-to-Voice (Phản hồi bằng giọng nói) và Text-chat (Phản hồi bằng văn bản).
*   **Job Board & CV Matching (Trợ lý Ứng tuyển):**
    *   **Danh sách việc làm:** Hiển thị các tin tuyển dụng thực tế (được cập nhật liên tục).
    *   **CV Analysis:** AI phân tích độ tương quan (%) giữa CV của user và JD của công việc đó.
    *   **Gap Analysis:** Chỉ ra các kỹ năng, từ khóa hoặc kinh nghiệm còn thiếu để vượt qua vòng lọc hồ sơ.
    *   **CV Optimization:** AI gợi ý cách chỉnh sửa/bổ sung nội dung CV để tối ưu hóa khả năng được gọi phỏng vấn.
    *   **Nút chuyển đổi:** Một cú click để chuyển ngay sang chế độ "Luyện tập phỏng vấn" cho chính công việc đó.
*   **Recruiter Mode (Dành cho Nhà tuyển dụng - Giai đoạn mở rộng):**
    *   **Phòng phỏng vấn ảo:** HR tạo các chiến dịch tuyển dụng, thiết lập JD và tiêu chí chấm điểm.
    *   **Mời ứng viên:** Hệ thống sinh link mời ứng viên tham gia phỏng vấn sơ loại.
    *   **Bảng xếp hạng ứng viên:** Hiển thị danh sách ứng viên đã tham gia kèm điểm số AI chấm và nhận xét tổng quát.

---

## 2. Thiết kế Database (Prisma Schema - MongoDB)

Hệ thống sử dụng MongoDB để linh hoạt trong việc lưu trữ dữ liệu hội thoại và kết quả phân tích AI.

```prisma
// ================= ENUMS =================
enum Role {
  CANDIDATE 
  HR        
  ADMIN     
}

enum SessionStatus {
  PENDING       
  IN_PROGRESS   
  EVALUATING    
  COMPLETED     
  FAILED        
}

enum MessageRole {
  AI
  USER
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
}

// ================= CORE MODELS =================

model User {
  id               String           @id @default(auto()) @map("_id") @db.ObjectId
  email            String           @unique
  fullName         String
  avatarUrl        String?          
  role             Role             @default(CANDIDATE)
  creditsBalance   Int              @default(3)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  cvs              UserCv[]
  sessions         InterviewSession[]
  cvAnalyses       CvAnalysis[]
  recruiterRooms   RecruiterRoom[]  
  transactions     Transaction[]
}

model UserCv {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  userId           String   @db.ObjectId
  title            String   
  fileUrl          String   
  contentExtracted String   
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions         InterviewSession[]
  analyses         CvAnalysis[]
}

model JobTemplate {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  title              String
  companyName        String
  companyLogo        String?
  location           String?  
  salaryRange        String?  
  employmentType     String?  
  responsibilities   String   
  requirements       String   
  benefits           String   
  aiExtractedContext String   
  isHotJob           Boolean  @default(false) 
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  sessions           InterviewSession[]
  cvAnalyses         CvAnalysis[]
}

model InterviewSession {
  id               String        @id @default(auto()) @map("_id") @db.ObjectId
  userId           String        @db.ObjectId
  status           SessionStatus @default(PENDING)
  jobTemplateId    String?       @db.ObjectId
  customJdText     String?       
  cvId             String?       @db.ObjectId
  recruiterRoomId  String?       @db.ObjectId
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  cv               UserCv?        @relation(fields: [cvId], references: [id])
  jobTemplate      JobTemplate?   @relation(fields: [jobTemplateId], references: [id])
  recruiterRoom    RecruiterRoom? @relation(fields: [recruiterRoomId], references: [id])
  messages         InterviewMessage[]
  result           InterviewResult?   
}

model InterviewMessage {
  id               String      @id @default(auto()) @map("_id") @db.ObjectId
  sessionId        String      @db.ObjectId
  role             MessageRole 
  content          String      
  audioUrl         String?     
  createdAt        DateTime    @default(now())
  session          InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  @@index([sessionId]) 
}

model InterviewResult {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionId        String   @unique @db.ObjectId
  overallScore     Int
  clarityScore     Int      
  confidenceScore  Int      
  relevanceScore   Int      
  feedbackJson     Json
  createdAt        DateTime @default(now())
  session          InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}

model Transaction {
  id            String        @id @default(auto()) @map("_id") @db.ObjectId
  userId        String        @db.ObjectId
  amount        Int           
  creditsAdded  Int           
  status        PaymentStatus @default(PENDING) 
  paymentRefId  String?       @unique 
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CvAnalysis {
  id                     String   @id @default(auto()) @map("_id") @db.ObjectId
  userId                 String   @db.ObjectId
  cvId                   String   @db.ObjectId
  jobTemplateId          String   @db.ObjectId
  matchScore             Int      
  missingKeywords        Json     
  improvementSuggestions Json     
  createdAt              DateTime @default(now())
  user                   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  cv                     UserCv      @relation(fields: [cvId], references: [id], onDelete: Cascade)
  jobTemplate            JobTemplate @relation(fields: [jobTemplateId], references: [id], onDelete: Cascade)
}

model RecruiterRoom {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  hrId             String   @db.ObjectId
  roomName         String   
  jdContext        String   
  invitationToken  String   @unique @default(uuid()) 
  isActive         Boolean  @default(true)
  expiresAt        DateTime? 
  createdAt        DateTime @default(now())
  hr               User               @relation(fields: [hrId], references: [id], onDelete: Cascade)
  sessions         InterviewSession[] 
}
```

---

## 3. Lộ trình phát triển (Implementation Roadmap)

Lộ trình tập trung hoàn toàn vào trải nghiệm của ứng viên: Từ việc tìm Job, tối ưu hồ sơ đến luyện tập phỏng vấn AI.

### Giai đoạn 1: Job Portal & CV Optimizer (Foundation)
*Mục tiêu: Giúp người dùng có hồ sơ hoàn hảo cho từng công việc.*
*   **Hệ thống:** Setup ExpressJS, Prisma, Auth (JWT).
*   **Job Board:** Danh sách công việc thực tế để người dùng lựa chọn.
*   **CV Matching AI:** Chấm điểm độ phù hợp (%) của CV với JD.
*   **CV Suggester AI:** Gợi ý chi tiết cách sửa CV để tối ưu hóa khả năng trúng tuyển.

### Giai đoạn 2: AI Interview Simulation (Core Feature)
*Mục tiêu: Luyện tập kỹ năng phỏng vấn dựa trên CV và JD đã tối ưu.*
*   **AI Engine:** Xây dựng Prompt phỏng vấn thông minh (dạng Chat).
*   **Interview Session:** Quản lý các phiên phỏng vấn và lịch sử hội thoại.
*   **AI Feedback:** Đánh giá chi tiết câu trả lời của ứng viên sau mỗi phiên.

### Giai đoạn 3: Voice Integration & Premium UI
*Mục tiêu: Nâng tầm trải nghiệm chuyên nghiệp.*
*   **Voice phỏng vấn:** Tích hợp công nghệ chuyển đổi giọng nói (STT/TTS).
*   **Premium UI:** Hoàn thiện thiết kế Glassmorphism và các hiệu ứng tương tác.
*   **Advanced Analytics:** Báo cáo chuyên sâu về sự tự tin và kỹ năng của ứng viên.

---
