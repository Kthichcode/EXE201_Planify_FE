export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  status: "Hoạt động" | "Không hoạt động" | "Đã khóa";
  package: "PRO" | "ENTERPRISE" | "FREE";
  plansCount: number;
  tasksCount: number;
  lastActive: string;
}

export interface Plan {
  id: string;
  title: string;
  creatorInitials: string;
  creatorName: string;
  status: "Đang thực hiện" | "Hoàn thành" | "Quá hạn";
  progress: number;
  tasksText: string;
  deadline: string;
}

export interface Activity {
  id: string;
  type: string;
  userName: string;
  actionText: string;
  details?: string;
  timeText: string;
  icon: string;
  iconColor: string;
}

export interface Feedback {
  id: string;
  userName: string;
  userInitials: string;
  title: string;
  content: string;
  rating: number;
  timeText: string;
  status: "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Đã đóng";
  type: "error" | "feature" | "help" | "praise";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  target: string;
  sentTime: string;
  openRate?: string;
  status: "Đã gửi" | "Đã lên lịch";
}

export interface PricingPackage {
  id: string;
  code: string;
  name: string;
  price: string;
  duration: string;
  features: string;
  status: "Hoạt động" | "Tạm dừng";
  usersCount: number;
}

export type ViewType = 
  | "dashboard" 
  | "users" 
  | "plans" 
  | "statistics" 
  | "activities" 
  | "feedback" 
  | "payments"
  | "notifications" 
  | "packages" 
  | "settings";