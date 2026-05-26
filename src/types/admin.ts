// src/types/admin.ts

export type ViewType = "dashboard" | "users" | "plans" | "statistics" | "activities" | "feedback" | "notifications" | "packages" | "settings";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Hoạt động" | "Tạm khóa";
  avatarText: string;
  joinedDate: string;
  plan: string;
}

export interface PlanItem {
  id: string;
  title: string;
  creator: string;
  tasksCount: number;
  completedTasks: number;
  status: "Hoạt động" | "Đã xong" | "Quá hạn";
  dueDate: string;
  progress: number;
}

export interface FeedbackItem {
  id: string;
  senderName: string;
  email: string;
  content: string;
  timeText: string;
  category: "Góp ý" | "Lỗi hệ thống" | "Khác";
  status: "Chờ xử lý" | "Đã trả lời";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  target: string;
  sentTime: string;
  status: "Đã gửi" | "Đã lên lịch";
  openRate?: string;
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

export interface Activity {
  id: string;
  userName: string;
  actionText: string;
  details?: string;
  timeText: string;
  type: "registration" | "plan_creation" | "plan_update" | "upgrade_pro" | "upgrade_ent" | "completed_task" | "report_bug" | "system_update" | "new_login" | "delete_spam";
}