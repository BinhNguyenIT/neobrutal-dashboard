# PRD - AI Workflow Kanban System

## 1. Tổng quan sản phẩm
AI Workflow Kanban System là ứng dụng web quản lý công việc theo mô hình Kanban, tập trung vào việc giao việc cho các AI agent chuyên biệt như Coder, Writer, Analyst và theo dõi tiến độ thực thi. Sản phẩm hiện đang chạy tại `localhost:3245/tasks` và được định hướng như một không gian điều phối công việc hiện đại, dễ quan sát, hỗ trợ dark/light mode và đa ngôn ngữ.

## 2. Mục tiêu sản phẩm
### 2.1 Mục tiêu hiện tại (current scope)
- Cho phép người dùng tạo, xem, cập nhật và theo dõi task trong giao diện Kanban hoặc List.
- Cho phép gán task cho AI agent phù hợp theo vai trò.
- Hỗ trợ recurring task với lịch cố định, có thể chỉnh sửa, tạm dừng và force run.
- Hiển thị trạng thái task rõ ràng theo luồng To Do -> In Progress -> Waiting -> Done.
- Hỗ trợ tìm kiếm, lọc và chuyển đổi góc nhìn nhanh trong cùng màn hình Tasks.
- Theo dõi thời gian xử lý của task và agent ở mức tự động.
- Cung cấp cấu trúc điều hướng nhất quán: Dashboard, Tasks, Agents, Notebooks, Documents, Settings.

### 2.2 Mục tiêu giai đoạn sau (later phases)
- Tối ưu dashboard tổng quan hiệu suất theo agent, theo workload, theo thời gian.
- Mở rộng workflow đa bước hoặc task phụ.
- Thêm automation rule nâng cao ngoài recurring task cố định.
- Thêm phân tích hiệu suất agent, lịch sử prompt/workflow, và đề xuất agent phù hợp.
- Thêm notification center và collaboration giữa nhiều người dùng.

## 3. Bài toán cần giải quyết
Người dùng cần một nơi duy nhất để:
- quản lý hàng đợi công việc theo trạng thái,
- giao đúng việc cho đúng AI agent,
- theo dõi task đang chờ, bị block, đang review hay đã xong,
- quản lý các công việc lặp lại theo lịch,
- quan sát thời gian thực thi và trạng thái sẵn sàng của hệ thống.

Hiện tại nhu cầu cốt lõi không phải quản lý nhân sự mà là điều phối AI agent như lực lượng thực thi chính.

## 4. Giả định chính
- Mỗi task có thể có một agent chính tại một thời điểm trong current scope.
- Việc giao task cho agent sẽ kích hoạt backend chọn workflow/model tương ứng theo role, nhưng chi tiết routing nội bộ không thuộc phạm vi PRD này.
- Time tracking được hệ thống tự động ghi nhận khi task bắt đầu xử lý, chuyển trạng thái hoặc hoàn tất.
- Recurring task là template điều khiển các lần chạy trong tương lai; chỉnh sửa recurring task sẽ ảnh hưởng các lần chạy sau, không mặc định sửa hồi tố các lần đã chạy hoặc đang chạy.
- Tại current scope, người dùng tương tác chủ yếu qua một workspace chính, chưa yêu cầu phân quyền sâu nhiều team.
- UI đa ngôn ngữ đã có nền tảng chuyển ngôn ngữ, hiện mặc định/đang dùng tiếng Việt.

## 5. Người dùng và vai trò
### 5.1 Người dùng chính
- **Operator / User:** người tạo task, theo dõi tiến độ, lọc dữ liệu, quản lý recurring task, xem agent nào phù hợp và đang online/offline.

### 5.2 Thực thể hệ thống liên quan
- **AI Agent:** thực thể nhận task để xử lý, có role chuyên môn và trạng thái online/offline.
  - DUY A.I - General
  - Nghiện Fake - Coder
  - Khỏe Quán - Analyst
  - ROMhub - Writer

## 6. Phạm vi sản phẩm
### 6.1 In scope
- Tasks page là trung tâm điều phối chính.
- Top navigation với search, filters, view toggle, theme toggle, language switch, New Task.
- Left sidebar với menu chính, danh sách agent, system status, user profile.
- Recurring tasks section.
- Kanban board drag & drop.
- List view cho task.
- Waiting tách 2 nhóm: Blocked, In Review.
- Done nhóm theo ngày hoàn thành với accordion.
- Task card hiển thị status, priority, title, assigned agent, time tracking.
- Tự động theo dõi thời gian theo task/agent ở mức hiển thị vận hành.

### 6.2 Out of scope
- Thiết kế kiến trúc hệ thống.
- Thiết kế database hoặc API.
- Chi tiết code implementation.
- Triển khai production/deployment.
- Agent training hoặc cấu hình model chi tiết.
- Permission matrix phức tạp nhiều vai trò người dùng.
- Collaboration thời gian thực giữa nhiều operator.

## 7. Information Architecture
### 7.1 Global navigation
- Dashboard
- Tasks
- Agents
- Notebooks
- Documents
- Settings

### 7.2 Màn hình Tasks
Màn hình Tasks gồm 3 lớp chính:
1. **Top navigation bar**
   - Global search
   - Filters: All Agents, All Priority, All Tags
   - View toggle: Board / List
   - Quick actions: Light/Dark, Language switch, New Task
2. **Left sidebar**
   - Main menu
   - Agents list + online/offline + role label
   - System status
   - User profile
3. **Main workspace**
   - Recurring tasks section
   - Task board hoặc task list

### 7.3 Các module chức năng
- Search & Filtering
- Task Creation / Edit
- Task Assignment
- Recurring Task Management
- Board View
- List View
- Time Tracking Display
- Agent Presence Display
- Theme & Language Preferences

## 8. Chi tiết module / page breakdown
### 8.1 Top navigation bar
**Chức năng:** điều hướng thao tác nhanh trên toàn bộ màn hình Tasks.

**Thành phần:**
- Global search để tìm task, document, agent.
- Bộ lọc theo agent, priority, tag.
- Chuyển đổi Board/List.
- Light/Dark toggle.
- Language switch.
- CTA `+ New Task`.

**Yêu cầu:**
- Search và filter tác động ngay lên view hiện tại.
- Board/List phải giữ ngữ cảnh filter/search đang áp dụng.
- Theme/language là preference cấp người dùng hoặc session, không làm mất dữ liệu đang xem.

### 8.2 Left sidebar
**Chức năng:** cung cấp điều hướng chính và trạng thái hệ thống.

**Thành phần:**
- Menu: Dashboard, Tasks, Agents, Notebooks, Documents, Settings.
- Tasks đang được chọn và có badge count.
- Danh sách AI agents với trạng thái online/offline và role.
- System status: Server Ready.
- User profile block: account/package/email/logout.

**Yêu cầu:**
- Agent list phải dễ scan, phân biệt được role và trạng thái.
- System status luôn hiển thị ở mức dễ thấy nhưng không lấn át task area.

### 8.3 Recurring tasks section
**Chức năng:** hiển thị và quản lý các công việc lặp định kỳ.

**Thành phần hiển thị mỗi recurring task:**
- Task name
- Badge `FIXED SCHEDULE`
- Badge `ACTIVE` hoặc trạng thái tương ứng
- Starts date
- Next run date
- Actions: Edit, Pause, Force run/Refresh

**Yêu cầu:**
- Edit recurring task sẽ áp dụng cho các lần chạy tương lai.
- Pause ngừng tạo lần chạy mới cho đến khi resume.
- Force run tạo hoặc kích hoạt một lần chạy ngay, không làm mất lịch tiếp theo nếu không có rule khác.
- Refresh cập nhật trạng thái lần chạy kế tiếp và trạng thái hiện tại.

### 8.4 Board/Kanban view
**Cột chính:**
- To Do
- In Progress
- Waiting
- Done

**Quy ước nhóm:**
- Waiting tách thành `Blocked` và `In Review`.
- Done nhóm theo completion date và dùng accordion để mở/thu gọn.

**Task card hiển thị:**
- Status
- Priority
- Title
- Assigned agent icon/name ngắn
- Time tracking

**Yêu cầu:**
- Hỗ trợ drag & drop giữa các cột/trạng thái hợp lệ.
- Di chuyển task phải cập nhật trạng thái ngay trong UI.
- Done không hiển thị như một danh sách phẳng dài vô hạn; phải gom nhóm theo ngày hoàn thành.

### 8.5 List view
**Chức năng:** thay thế Board view cho người dùng muốn scan nhiều task nhanh.

**Yêu cầu tối thiểu:**
- Hiển thị cùng tập dữ liệu như Board view.
- Giữ các trường cốt lõi: title, status, priority, assigned agent, tags, time tracking.
- Giữ search/filter giống Board view.

## 9. Mô hình dữ liệu nghiệp vụ ở mức sản phẩm
### 9.1 Task
Thuộc tính cốt lõi cần được UI và logic xử lý:
- tiêu đề
- mô tả ngắn hoặc brief
- trạng thái
- mức ưu tiên
- agent được gán
- tags
- loại task: one-time hoặc recurring run
- thời gian theo dõi
- thời điểm bắt đầu / hoàn thành nếu có

### 9.2 AI Agent
- tên hiển thị
- vai trò chuyên môn
- trạng thái online/offline
- biểu tượng đại diện

### 9.3 Recurring task template
- tên recurring task
- lịch chạy cố định
- ngày bắt đầu
- trạng thái active/paused
- agent mặc định (nếu có)
- quy tắc sinh lần chạy kế tiếp

## 10. Luồng người dùng chính
### 10.1 Tạo task mới
1. Người dùng bấm `+ New Task`.
2. Nhập thông tin cơ bản: title, brief, priority, tags, agent.
3. Chọn task thường hoặc recurring task.
4. Nếu là recurring task, nhập lịch chạy và trạng thái mặc định.
5. Lưu task và hiển thị trong Board/List phù hợp.

### 10.2 Giao task cho AI agent
1. Người dùng chọn task.
2. Gán agent theo vai trò phù hợp.
3. Hệ thống ghi nhận agent assignee.
4. UI hiển thị icon/role agent trên task card.
5. Backend downstream sẽ route workflow tương ứng theo agent.

### 10.3 Quản lý task trên Kanban board
1. Người dùng mở Tasks page ở Board view.
2. Kéo task giữa các cột để cập nhật trạng thái.
3. Với Waiting, task được đưa vào Blocked hoặc In Review theo lý do chờ.
4. Khi task hoàn thành, task chuyển sang Done và được nhóm theo ngày hoàn thành.

### 10.4 Quản lý recurring task
1. Người dùng xem recurring tasks ở khu vực riêng.
2. Có thể Edit, Pause, hoặc Force run.
3. Edit áp dụng cho các run tương lai.
4. Force run tạo một lần chạy ngay và hiển thị ở khu vực task phù hợp.

### 10.5 Tìm kiếm và lọc
1. Người dùng nhập từ khóa vào Global Search.
2. Chọn filter theo agent, priority, tag.
3. Hệ thống cập nhật Board/List theo điều kiện đang áp dụng.
4. Chuyển Board/List không làm mất filter/search context.

## 11. Trạng thái task và chuyển trạng thái
### 11.1 Trạng thái chính
- To Do
- In Progress
- Waiting
  - Blocked
  - In Review
- Done

### 11.2 Quy tắc nghiệp vụ ở mức sản phẩm
- Task mới mặc định vào To Do trừ khi có rule khác.
- Task đang xử lý chuyển sang In Progress.
- Task bị kẹt hoặc thiếu điều kiện tiếp tục có thể vào Waiting/Blocked.
- Task cần kiểm duyệt hoặc xác nhận trước khi hoàn tất có thể vào Waiting/In Review.
- Task hoàn tất chuyển sang Done.
- Done task được nhóm theo completion date để dễ tra cứu.

## 12. Hành vi time tracking
- Time tracking được hiển thị ngay trên task card.
- Mục tiêu là cho phép người dùng quan sát “chi phí thời gian” của từng task/agent.
- Hệ thống tự động cập nhật thời lượng thay vì yêu cầu nhập tay.
- Thời gian có thể hiển thị dưới dạng `less than a minute`, `1 minute`, `19 minutes`.

## 13. Hành vi search / filter / view
### 13.1 Search
- Global Search phải hỗ trợ tìm task, document, agent.
- Kết quả có thể ưu tiên theo ngữ cảnh màn hình hiện tại, nhưng không được gây nhầm lẫn loại thực thể.

### 13.2 Filters
- Agent filter: lọc theo agent đang đảm nhận.
- Priority filter: lọc theo mức ưu tiên.
- Tag filter: lọc theo nhãn.
- Các filter có thể hoạt động đồng thời.

### 13.3 View toggle
- Board và List là hai cách hiển thị của cùng dataset.
- Việc chuyển view không làm mất search/filter đang áp dụng.

## 14. Edge cases cần xử lý
- Không có task trong một cột vẫn phải hiển thị vùng trống rõ ràng.
- Waiting không có task ở cả Blocked/In Review vẫn phải thể hiện rõ là đang rỗng.
- Done có quá nhiều group ngày cần cho phép collapse/expand.
- Agent offline vẫn có thể hiển thị trong danh sách; việc assign cho agent offline cần có rule downstream rõ ràng ở phase sau.
- Recurring task bị paused thì không sinh run mới.
- Force run khi server bận hoặc agent unavailable cần có phản hồi trạng thái phù hợp ở phase sau.
- Search không có kết quả phải có empty state dễ hiểu.
- Dark/Light hoặc đổi ngôn ngữ không làm reset task view context.

## 15. Non-goals
- Không giải quyết chi tiết cơ chế prompt engineering nội bộ cho từng agent trong PRD này.
- Không mô tả chi tiết cron syntax hoặc lịch engine implementation.
- Không mô tả API contract hoặc event bus.
- Không mở rộng sang hệ thống quản lý nhân sự truyền thống.
- Không bao phủ collaboration nhiều người dùng real-time ở current scope.

## 16. Acceptance criteria
### 16.1 Top navigation
- Có global search, 3 filter chính, Board/List toggle, theme toggle, language switch, và `+ New Task`.
- Người dùng có thể thao tác nhanh mà không rời màn hình Tasks.

### 16.2 Sidebar
- Có đủ menu: Dashboard, Tasks, Agents, Notebooks, Documents, Settings.
- Danh sách AI agent hiển thị role và trạng thái online/offline.
- Có system status và user profile block.

### 16.3 Recurring tasks
- Hiển thị được recurring task với badge lịch cố định và trạng thái hoạt động.
- Có actions Edit, Pause, Force run/Refresh.
- Hành vi chỉnh sửa recurring task được hiểu là áp dụng cho các lần chạy tương lai.

### 16.4 Board/List
- Board có 4 cột To Do, In Progress, Waiting, Done.
- Waiting tách được thành Blocked và In Review.
- Done nhóm theo ngày hoàn thành và có accordion.
- Task card có status, priority, title, agent assignee, time tracking.
- Có thể chuyển sang List view mà vẫn giữ filter/search context.

### 16.5 Task delegation
- Task hiển thị rõ agent được giao.
- Người dùng hiểu được agent nào có vai trò nào từ sidebar/assignment UI.

### 16.6 Time tracking
- Task card hiển thị thời gian theo dõi dễ hiểu.
- Thời gian được trình bày theo hướng tự động và phục vụ quản trị vận hành.

### 16.7 Search / filter behavior
- Search và filter làm thay đổi tập task hiển thị.
- Có thể kết hợp nhiều filter.
- Không làm mất view context khi đổi Board/List hoặc đổi theme/ngôn ngữ.

## 17. Hướng handoff tiếp theo
- Architect cần chuyển PRD này thành technical design cho:
  - task state model
  - recurring schedule handling contract
  - agent assignment contract
  - search/filter/view state management
  - board/list rendering strategy
  - time tracking display/update contract
