import { User, Plan, Activity, Feedback, NotificationItem, PricingPackage } from "./types";

export const INITIAL_USERS: User[] = [
  {
    id: "U001",
    name: "Nguyen Van A",
    email: "nguyenvana@email.com",
    initials: "NV",
    status: "Hoạt động",
    package: "PRO",
    plansCount: 45,
    tasksCount: 234,
    lastActive: "2 phút trước"
  },
  {
    id: "U002",
    name: "Tran Thi B",
    email: "tranthib@email.com",
    initials: "TT",
    status: "Hoạt động",
    package: "ENTERPRISE",
    plansCount: 128,
    tasksCount: 1024,
    lastActive: "5 phút trước"
  },
  {
    id: "U003",
    name: "Le Van C",
    email: "levanc@email.com",
    initials: "LV",
    status: "Không hoạt động",
    package: "FREE",
    plansCount: 12,
    tasksCount: 45,
    lastActive: "3 ngày trước"
  },
  {
    id: "U004",
    name: "Pham Thi D",
    email: "phamthid@email.com",
    initials: "PT",
    status: "Đã khóa",
    package: "PRO",
    plansCount: 0,
    tasksCount: 0,
    lastActive: "1 tuần trước"
  },
  {
    id: "U005",
    name: "Hoang Van E",
    email: "hoangvane@email.com",
    initials: "HV",
    status: "Hoạt động",
    package: "FREE",
    plansCount: 8,
    tasksCount: 56,
    lastActive: "1 giờ trước"
  }
];

export const INITIAL_PLANS: Plan[] = [
  {
    id: "P001",
    title: "Xây dựng website bán hàng",
    creatorInitials: "NV",
    creatorName: "Nguyen Van A",
    status: "Đang thực hiện",
    progress: 65,
    tasksText: "13/20 tasks",
    deadline: "15/03/2024"
  },
  {
    id: "P002",
    title: "Thuyết trình đồ án tốt nghiệp",
    creatorInitials: "TT",
    creatorName: "Tran Thi B",
    status: "Hoàn thành",
    progress: 100,
    tasksText: "8/8 tasks",
    deadline: "10/03/2024"
  },
  {
    id: "P003",
    title: "Phát triển ứng dụng mobile",
    creatorInitials: "LV",
    creatorName: "Le Van C",
    status: "Đang thực hiện",
    progress: 30,
    tasksText: "6/20 tasks",
    deadline: "30/04/2024"
  },
  {
    id: "P004",
    title: "Chiến dịch Marketing Q2",
    creatorInitials: "PT",
    creatorName: "Pham Thi D",
    status: "Quá hạn",
    progress: 45,
    tasksText: "9/20 tasks",
    deadline: "01/03/2024"
  },
  {
    id: "P005",
    title: "Thiết kế UI/UX cho app",
    creatorInitials: "HV",
    creatorName: "Hoang Van E",
    status: "Đang thực hiện",
    progress: 80,
    tasksText: "16/20 tasks",
    deadline: "20/03/2024"
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "ACT001",
    type: "registration",
    userName: "Nguyen Van A",
    actionText: "đã đăng ký tài khoản mới",
    timeText: "2 phút trước",
    icon: "person_add",
    iconColor: "text-green-500"
  },
  {
    id: "ACT002",
    type: "plan_creation",
    userName: "Tran Thi B",
    actionText: "đã tạo kế hoạch",
    details: "Xây dựng ứng dụng mobile",
    timeText: "5 phút trước",
    icon: "description",
    iconColor: "text-blue-500"
  },
  {
    id: "ACT003",
    type: "upgrade_pro",
    userName: "Le Van C",
    actionText: "đã nâng cấp lên gói",
    details: "PRO",
    timeText: "15 phút trước",
    icon: "upgrade",
    iconColor: "text-yellow-500"
  },
  {
    id: "ACT004",
    type: "completed_task",
    userName: "Pham Thi D",
    actionText: "đã hoàn thành 25 tasks trong kế hoạch",
    timeText: "30 phút trước",
    icon: "task_alt",
    iconColor: "text-green-500"
  },
  {
    id: "ACT005",
    type: "report_bug",
    userName: "Hoang Van E",
    actionText: "báo cáo lỗi AI không phản hồi",
    timeText: "1 giờ trước",
    icon: "error",
    iconColor: "text-red-500"
  },
  {
    id: "ACT006",
    type: "system_update",
    userName: "Admin",
    actionText: "đã cập nhật cài đặt hệ thống",
    timeText: "2 giờ trước",
    icon: "settings",
    iconColor: "text-purple-500"
  },
  {
    id: "ACT007",
    type: "new_login",
    userName: "Nguyen Van A",
    actionText: "đã đăng nhập từ thiết bị mới",
    timeText: "3 giờ trước",
    icon: "login",
    iconColor: "text-blue-400"
  },
  {
    id: "ACT008",
    type: "delete_spam",
    userName: "Admin",
    actionText: "đã xóa 5 tài khoản spam",
    timeText: "4 giờ trước",
    icon: "delete",
    iconColor: "text-red-400"
  },
  {
    id: "ACT009",
    type: "plan_update",
    userName: "Le Van C",
    actionText: "đã cập nhật kế hoạch",
    details: "Marketing Q1",
    timeText: "5 giờ trước",
    icon: "description",
    iconColor: "text-blue-500"
  },
  {
    id: "ACT010",
    type: "upgrade_ent",
    userName: "Tran Thi B",
    actionText: "đã nâng cấp lên Enterprise",
    timeText: "6 giờ trước",
    icon: "upgrade",
    iconColor: "text-yellow-500"
  }
];

export const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: "F001",
    userName: "Nguyen Van A",
    userInitials: "NV",
    title: "AI không phản hồi khi tạo kế hoạch",
    content: "Khi tôi nhập yêu cầu tạo kế hoạch, AI mất rất lâu để phản hồi và đôi khi bị timeout.",
    rating: 2,
    timeText: "2 giờ trước",
    status: "Chờ xử lý",
    type: "error"
  },
  {
    id: "F002",
    userName: "Tran Thi B",
    userInitials: "TT",
    title: "Thêm tính năng chia sẻ kế hoạch",
    content: "Tôi muốn có thể chia sẻ kế hoạch với đồng nghiệp để cùng theo dõi tiến độ.",
    rating: 4,
    timeText: "5 giờ trước",
    status: "Đang xử lý",
    type: "feature"
  },
  {
    id: "F003",
    userName: "Le Van C",
    userInitials: "LV",
    title: "Làm thế nào để xuất kế hoạch ra PDF?",
    content: "Tôi cần xuất kế hoạch để in nhưng không tìm thấy nút export.",
    rating: 5,
    timeText: "1 ngày trước",
    status: "Đã giải quyết",
    type: "help"
  },
  {
    id: "F004",
    userName: "Pham Thi D",
    userInitials: "PT",
    title: "Giao diện rất đẹp và dễ sử dụng",
    content: "Tôi rất thích giao diện mới. Rất trực quan và dễ sử dụng. Chúc team phát triển tốt!",
    rating: 5,
    timeText: "2 ngày trước",
    status: "Đã đóng",
    type: "praise"
  },
  {
    id: "F005",
    userName: "Hoang Van E",
    userInitials: "HV",
    title: "Lỗi hiển thị trên mobile",
    content: "Trên điện thoại, sidebar bị che mất nội dung chính khi mở ra.",
    rating: 3,
    timeText: "3 ngày trước",
    status: "Chờ xử lý",
    type: "error"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "N001",
    title: "Cập nhật tính năng mới v2.5",
    description: "Chúng tôi vừa ra mắt tính năng chia sẻ kế hoạch với đồng nghiệp...",
    target: "Tất cả người dùng",
    sentTime: "07/03/2024 10:00",
    openRate: "72%",
    status: "Đã gửi"
  },
  {
    id: "N002",
    title: "Khuyến mãi nâng cấp Pro -30%",
    description: "Nhân dịp sinh nhật Planify, giảm ngay 30% khi nâng cấp gói Pro...",
    target: "Người dùng Free",
    sentTime: "05/03/2024 09:00",
    openRate: "85%",
    status: "Đã gửi"
  },
  {
    id: "N003",
    title: "Bảo trì hệ thống",
    description: "Hệ thống sẽ được bảo trì từ 2:00 - 4:00 ngày 10/03...",
    target: "Tất cả người dùng",
    sentTime: "Lên lịch: 09/03/2024",
    status: "Đã lên lịch"
  },
  {
    id: "N004",
    title: "Nhắc nhở hoàn thành hồ sơ",
    description: "Hoàn thiện hồ sơ để trải nghiệm đầy đủ tính năng...",
    target: "Hồ sơ chưa hoàn thiện",
    sentTime: "01/03/2024 08:00",
    openRate: "45%",
    status: "Đã gửi"
  }
];

export const INITIAL_PACKAGES: PricingPackage[] = [
  {
    id: "PKG001",
    code: "PKG001",
    name: "Free",
    price: "0đ",
    duration: "Vĩnh viễn",
    features: "5 kế hoạch, 50 tasks, AI cơ bản",
    status: "Hoạt động",
    usersCount: 8500
  },
  {
    id: "PKG002",
    code: "PKG002",
    name: "Pro",
    price: "299,000đ",
    duration: "1 tháng",
    features: "Không giới hạn kế hoạch, 500 tasks, AI nâng cao",
    status: "Hoạt động",
    usersCount: 3200
  },
  {
    id: "PKG003",
    code: "PKG003",
    name: "Pro Yearly",
    price: "2,990,000đ",
    duration: "1 năm",
    features: "Tất cả Pro + Ưu đãi 2 tháng",
    status: "Hoạt động",
    usersCount: 850
  },
  {
    id: "PKG004",
    code: "PKG004",
    name: "Enterprise",
    price: "999,000đ",
    duration: "1 tháng",
    features: "Không giới hạn, API access, Dedicated support",
    status: "Hoạt động",
    usersCount: 758
  },
  {
    id: "PKG005",
    code: "PKG005",
    name: "Student",
    price: "99,000đ",
    duration: "1 tháng",
    features: "Tương tự Pro, dành cho sinh viên",
    status: "Tạm dừng",
    usersCount: 120
  }
];