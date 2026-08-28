# Extra Feature: AI Coaching

## 1. Định nghĩa feature

AI Coaching là vòng lặp cải thiện năng lực theo **một vị trí công việc cụ thể**. Feature bắt đầu từ kết quả AI Interview và kết thúc khi người dùng đạt các competency/milestone quan trọng của JD.

Đây không phải một khóa học chung và cũng không phải một mock interview lặp lại. Người dùng luyện tập bằng cách nhắn tin với AI Coach, được gợi ý và giải thích chi tiết, không chịu áp lực thời gian.

## 2. Đầu vào

- Job Description (JD), bao gồm deadline nếu có.
- CV của người dùng.
- Kết quả AI Interview/Diagnosis.
- Cấu hình thời gian coaching do người dùng chọn nếu JD không có deadline.
- Khung giờ người dùng muốn học mỗi ngày.

### Quy tắc deadline

Nếu JD/job có deadline nộp hồ sơ hoặc deadline liên quan đến cơ hội việc làm, deadline đó là ngày kết thúc kế hoạch. Hệ thống lấy số ngày từ hiện tại đến deadline để tạo lịch.

Người dùng không tự chọn tổng số ngày trong trường hợp này. Người dùng chỉ chọn thời gian học trong ngày. Nếu không có deadline, hệ thống mới cho người dùng chọn thời lượng coaching.

## 3. Learning Graph

Learning Graph là bản đồ các mốc năng lực cần đạt để sẵn sàng cho JD đó. Mỗi milestone đại diện cho một competency hoặc một nhóm topic có liên quan.

Ví dụ:

```text
Backend Junior
├── Database
│   ├── Indexing
│   ├── Transactions
│   └── Query optimization
├── Operating System
├── System Design
└── Backend fundamentals
```

Mỗi milestone cần có:

- `name`: tên mốc.
- `scope/topics`: các topic được phép đánh giá trong mốc.
- `jd_importance`: mức quan trọng với JD, từ 1 đến 5.
- `weakness`: mức thiếu hụt hiện tại của user, từ 1 đến 5.
- `dependency`: mức phụ thuộc/nền tảng, từ 0 đến 3.
- `estimated_sessions`: số buổi dự kiến.
- `status`: `not_started`, `in_progress`, `passed`, `blocked`.
- `pass_criteria`: tiêu chí đạt cụ thể.
- `evidence`: câu trả lời hoặc kết quả làm cơ sở đánh giá.

## 4. Workflow chính của user

### Bước 1 — Hoàn thành AI Interview

User phỏng vấn AI cho một JD cụ thể.

### Bước 2 — Nhận Diagnosis

Hệ thống hiển thị:

- Điểm mạnh.
- Điểm yếu.
- Các câu trả lời chưa đạt.
- Rủi ro khi apply vị trí đó.
- CTA: **“Bạn có muốn cải thiện kỹ năng để apply vị trí này không?”**

### Bước 3 — Tạo Learning Graph

Nếu user chọn coaching, LLM phân tích JD + CV + interview result để tạo các milestone và tiêu chí pass. User nên được xem bản tóm tắt và biết vì sao từng mốc xuất hiện.

### Bước 4 — Tạo lịch coaching

Hệ thống lấy số ngày còn lại đến deadline, sau đó phân bổ các milestone theo độ ưu tiên và số buổi ước tính.

Ví dụ có 7 ngày:

```text
Ngày 1–3: Database
Ngày 4–5: Operating System
Ngày 6–7: System Design
```

User chọn giờ học; hệ thống quyết định nội dung/mốc của từng ngày.

### Bước 5 — Luyện tập

Trong mỗi buổi:

- AI đóng vai mentor/senior reviewer.
- AI hỏi lý thuyết và câu hỏi đào sâu theo topic của milestone.
- User trả lời bằng chat.
- User có thể xin hint, ví dụ hoặc cách tiếp cận.
- AI giải thích vì sao câu trả lời đúng/chưa tốt.
- AI yêu cầu user sửa hoặc trả lời lại.
- Không giới hạn thời gian như interview thật.

### Bước 6 — Đánh giá sau buổi

LLM tạo session evaluation gồm:

- Các tiêu chí đã kiểm tra.
- Mức độ đạt từng tiêu chí.
- Bằng chứng từ câu trả lời.
- Lỗi còn lại.
- Lỗ hổng mới phát hiện.
- Khuyến nghị cho buổi tiếp theo.
- Trạng thái milestone.

### Bước 7 — Cập nhật Learning Graph

- Trả lời tốt và có bằng chứng → giảm `weakness`.
- Trả lời sai hoặc không vượt qua follow-up → giữ hoặc tăng `weakness`.
- Đạt toàn bộ `pass_criteria` → `status = passed`.
- Phát hiện lỗ hổng mới → thêm vào đúng milestone liên quan nếu nằm trong phạm vi graph.

Ví dụ:

```text
Ban đầu: Database weakness = 4/5
Sau buổi học: trả lời đúng transaction và vượt follow-up
Cập nhật: weakness = 2/5
```

### Bước 8 — Reschedule

Chỉ các buổi chưa diễn ra mới được thay đổi. Các buổi đã hoàn thành giữ nguyên lịch sử.

- Mốc đã pass → loại khỏi lịch luyện tập bắt buộc.
- Mốc chưa pass → giữ lại.
- Mốc phát sinh trong cùng scope → thêm nội dung hoặc tăng số buổi.
- Thời gian dư → chuyển cho mốc chưa đạt có ưu tiên cao hơn.
- Không đủ thời gian → tập trung vào các mốc bắt buộc và rủi ro cao nhất.

### Bước 9 — Kết thúc coaching

Coaching thành công khi các milestone bắt buộc của JD đạt tiêu chí pass. Kết quả cuối cùng cần cho user biết:

- Mức độ sẵn sàng cho JD.
- Milestone đã pass.
- Milestone còn thiếu.
- Rủi ro còn lại.
- Có nên apply/interview ngay hay tiếp tục luyện.

## 5. Quy tắc phạm vi khi phát hiện lỗ hổng mới

Mỗi session có một `milestone_scope`.

- Nếu phát hiện thiếu Database trong session Database → được cập nhật Database.
- Nếu phát hiện thiếu Operating System trong session Database → không chuyển session hiện tại sang Operating System; ghi nhận vào node Operating System để xử lý trong lịch phù hợp.
- Nếu topic không nằm trong Learning Graph/JD → chỉ ghi nhận ở dạng observation, không tự động làm phình kế hoạch.

Có thể cập nhật toàn graph sau session, nhưng phải phân biệt rõ:

1. `session_update`: thay đổi kết quả của mốc đang học.
2. `graph_update`: phát hiện cần cập nhật mốc khác.
3. `out_of_scope_observation`: thông tin không làm thay đổi kế hoạch.

## 6. Thuật toán ưu tiên và reschedule

Giai đoạn đầu không cần machine learning. Dùng LLM cho việc hiểu/ngôn ngữ và dùng thuật toán luật cố định cho các quyết định lịch.

### Nguồn của các con số

`jd_importance` do LLM chấm theo rubric:

- 5: bắt buộc, là trách nhiệm chính hoặc xuất hiện nhiều lần trong JD.
- 4: yêu cầu quan trọng nhưng không phải trung tâm.
- 2–3: nice-to-have hoặc chỉ được nhắc nhẹ.
- 1: không đáng kể/không trực tiếp phục vụ JD.

`weakness` lấy từ interview và các session trước:

- 5: không trả lời được hoặc sai bản chất.
- 4: trả lời mơ hồ, sai nhiều hoặc fail follow-up.
- 3: biết cơ bản nhưng thiếu chiều sâu/ví dụ.
- 2: gần đạt, còn lỗi nhỏ.
- 1: đã thể hiện năng lực ổn định.

`dependency` thể hiện mốc có phải nền tảng cho mốc khác không:

- 3: nền tảng trực tiếp cho nhiều mốc.
- 2: có phụ thuộc.
- 1: phụ thuộc nhẹ.
- 0: độc lập.

### Công thức ưu tiên

```text
priority = (jd_importance × 2) + weakness + dependency
```

JD importance được nhân đôi vì coaching phục vụ một vị trí cụ thể. Khi milestone đã pass, nó không còn là ứng viên luyện tập bắt buộc.

### Pseudocode

```text
available_days = deadline - today

for milestone in learning_graph:
    if milestone.status == "passed":
        milestone.priority = 0
    else:
        milestone.priority =
            (milestone.jd_importance * 2)
            + milestone.weakness
            + milestone.dependency

allocate available_days to unfinished milestones
in descending priority order
respect dependencies and minimum sessions

after each session:
    apply LLM evaluation
    update weakness, evidence, pass criteria and status
    add in-scope gaps
    recalculate priority
    reschedule only remaining days
```

Nếu số ngày còn lại ít hơn tổng số buổi cần thiết, hệ thống không hứa hẹn hoàn thành toàn bộ. Nó tạo kế hoạch rủi ro cao nhất: mốc bắt buộc của JD trước, sau đó đến mốc yếu nhất và mốc nền tảng.

## 7. Vai trò của LLM

LLM được dùng cho:

- Trích xuất yêu cầu từ JD.
- Đối chiếu JD với CV.
- Phân tích câu trả lời interview.
- Sinh milestone, topic và pass criteria.
- Điều hành cuộc luyện tập.
- Chấm câu trả lời dựa trên rubric.
- Phát hiện lỗ hổng mới.
- Đề xuất số session ban đầu.

LLM không nên tự quyết định lịch bằng văn bản tự do. Kết quả phải trả về schema có cấu trúc, sau đó scheduler áp dụng luật cố định.

## 8. Các điểm cần chốt khi triển khai

- Ngưỡng pass: ví dụ đạt ít nhất 80% tiêu chí và không fail tiêu chí bắt buộc.
- Số lần follow-up tối thiểu để xác nhận user thực sự hiểu.
- Cách xử lý câu trả lời học thuộc nhưng không hiểu bản chất.
- Có cho phép user bỏ qua milestone hay không.
- Có dành ngày cuối cho final readiness check hay không.
- Khi deadline quá gần, hiển thị “không đủ thời gian” theo cách nào.
- User có được chỉnh thứ tự hoặc khóa một buổi không.
- Cơ chế chống LLM đánh giá không nhất quán: rubric, evidence, structured output và có thể chạy lại evaluation.

## 9. MVP đề xuất

MVP chỉ cần:

1. AI Interview result + JD + CV.
2. LLM tạo Learning Graph có rubric.
3. Lịch theo deadline và lựa chọn giờ học.
4. Coaching chat theo từng milestone.
5. Session evaluation.
6. Cập nhật weakness/status.
7. Reschedule phần lịch còn lại.
8. Báo cáo readiness cuối cùng.

Machine learning có thể bổ sung sau khi có dữ liệu thật về số buổi, tỷ lệ pass và hành vi học. Ở giai đoạn đầu, LLM + rubric + rule-based scheduler là đủ để xây dựng và kiểm soát feature.
