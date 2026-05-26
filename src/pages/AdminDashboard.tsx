import React, { useState } from "react";
// ===== THÊM DÒNG IMPORT NÀY =====
import { useParams, useNavigate } from "react-router-dom"; 

import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import DashboardOverview from "../components/admin/DashboardOverview";
import UserManagement from "../components/admin/UserManagement";
import PlanManagement from "../components/admin/PlanManagement";
import ActivityLog from "../components/admin/ActivityLog";
import FeedbackManagement from "../components/admin/FeedbackManagement";
import NotificationManagement from "../components/admin/NotificationManagement";
import PackageManagement from "../components/admin/PackageManagement";
import Statistics from "../components/admin/Statistics";
import Settings from "../components/admin/Settings";
import { Banknote } from "lucide-react";

import { 
  INITIAL_USERS, 
  INITIAL_PLANS, 
  INITIAL_ACTIVITIES, 
  INITIAL_FEEDBACKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PACKAGES 
} from "../data"; 
import { User, Plan, Activity, Feedback, NotificationItem, PricingPackage, ViewType } from "../types"; 

export default function AdminDashboard() {
  // ===== SỬA LẠI ĐOẠN KHAI BÁO NÀY =====
  const { view } = useParams();
  const navigate = useNavigate();
  
  // Đọc view từ URL (nếu URL là /admin thì view bị rỗng, mặc định gán là 'dashboard')
  const currentView = (view as ViewType) || "dashboard";

  // Hàm setView giờ đây sẽ chuyển URL thay vì đổi state ẩn
  const setView = (v: ViewType) => {
    if (v === "dashboard") {
      navigate("/admin");
    } else {
      navigate(`/admin/${v}`);
    }
    setSearchQuery(""); // Vẫn giữ nguyên logic xóa search
  };

  // State tìm kiếm giữ nguyên
  const [searchQuery, setSearchQuery] = useState("");
  // =====================================

  // Key platform lists held in state
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);

  // ... (TẤT CẢ CÁC ĐOẠN CODE BÊN DƯỚI TỪ const [activities...] TRỞ ĐI BẠN GIỮ NGUYÊN 100%)
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [packages, setPackages] = useState<PricingPackage[]>(INITIAL_PACKAGES);

  // Users action handlers
  const handleAddUser = (newUser: Omit<User, "id" | "lastActive">) => {
    const id = `U00${users.length + 1}`;
    const userWithId: User = {
      ...newUser,
      id,
      lastActive: "Vừa mới"
    };
    setUsers([userWithId, ...users]);

    // Append activity
    const newAct: Activity = {
      id: `ACT00${activities.length + 1}`,
      type: "registration",
      userName: newUser.name,
      actionText: "đăng ký một thành viên mới",
      timeText: "Vừa mới",
      icon: "person_add",
      iconColor: "text-green-500"
    };
    setActivities([newAct, ...activities]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleUpdateUserStatus = (id: string, status: "Hoạt động" | "Không hoạt động" | "Đã khóa") => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    
    // audit logs
    const usr = users.find(u => u.id === id);
    if (usr) {
      const newAct: Activity = {
        id: `ACT00${activities.length + 1}`,
        type: "system_update",
        userName: "Admin",
        actionText: `đã chuyển trạng thái của ${usr.name} sang`,
        details: status,
        timeText: "Vừa mới",
        icon: "settings",
        iconColor: "text-purple-500"
      };
      setActivities([newAct, ...activities]);
    }
  };

  const handleUpdateUserPackage = (id: string, tier: "FREE" | "PRO" | "ENTERPRISE") => {
    setUsers(users.map(u => u.id === id ? { ...u, package: tier } : u));

    // Audit logs
    const usr = users.find(u => u.id === id);
    if (usr) {
      const isUpgrade = tier === "PRO" || tier === "ENTERPRISE";
      const newAct: Activity = {
        id: `ACT00${activities.length + 1}`,
        type: tier === "ENTERPRISE" ? "upgrade_ent" : tier === "PRO" ? "upgrade_pro" : "system_update",
        userName: usr.name,
        actionText: isUpgrade ? "đã nâng cấp lên gói dịch vụ" : "đã hoàn trả về tài khoản",
        details: tier,
        timeText: "Vừa mới",
        icon: "upgrade",
        iconColor: "text-yellow-500"
      };
      setActivities([newAct, ...activities]);
    }
  };

  // Plans action handlers
  const handleAddPlan = (newPlan: Omit<Plan, "id">) => {
    const id = `P00${plans.length + 1}`;
    setPlans([{ ...newPlan, id }, ...plans]);

    // Append Activity logs
    const newAct: Activity = {
      id: `ACT00${activities.length + 1}`,
      type: "plan_creation",
      userName: newPlan.creatorName,
      actionText: "đã khởi tạo một dự thảo kế hoạch",
      details: newPlan.title,
      timeText: "Vừa mới",
      icon: "description",
      iconColor: "text-blue-500"
    };
    setActivities([newAct, ...activities]);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const handleUpdatePlanStatus = (id: string, status: "Đang thực hiện" | "Hoàn thành" | "Quá hạn") => {
    setPlans(plans.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleUpdatePlanProgress = (id: string, progress: number) => {
    setPlans(plans.map(p => {
      if (p.id === id) {
        // compute tasks description based on progress percentage
        const parts = p.tasksText.split("/");
        const total = parts.length > 1 ? parseInt(parts[1]) : 10;
        const comp = Math.round((progress / 100) * total);
        return {
          ...p,
          progress,
          tasksText: `${comp}/${total} tasks`
        };
      }
      return p;
    }));
  };

  // Activities action handlers
  const handleAddActivity = (newAct: Omit<Activity, "id" | "timeText">) => {
    const id = `ACT00${activities.length + 1}`;
    setActivities([{ ...newAct, id, timeText: "Vừa mới" }, ...activities]);
  };

  const handleClearActivities = () => {
    setActivities([]);
  };

  // Feedbacks action handlers
  const handleUpdateFeedbackStatus = (id: string, status: "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Đã đóng") => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status } : f));

    // Audit logs
    const fb = feedbacks.find(f => f.id === id);
    if (fb) {
      const newAct: Activity = {
        id: `ACT00${activities.length + 1}`,
        type: "system_update",
        userName: "Admin",
        actionText: `đã chuyển trạng thái góp ý "${fb.title}" thành`,
        details: status,
        timeText: "Vừa mới",
        icon: "settings",
        iconColor: "text-purple-500"
      };
      setActivities([newAct, ...activities]);
    }
  };

  // Notifications action handlers
  const handleAddNotification = (newNotif: Omit<NotificationItem, "id">) => {
    const id = `N00${notifications.length + 1}`;
    setNotifications([{ ...newNotif, id }, ...notifications]);

    // log activities trace
    const newAct: Activity = {
      id: `ACT00${activities.length + 1}`,
      type: "system_update",
      userName: "Admin",
      actionText: `đã phát hành thông báo pushes diện rộng`,
      details: newNotif.title,
      timeText: "Vừa mới",
      icon: "settings",
      iconColor: "text-[#2c4ed3]"
    };
    setActivities([newAct, ...activities]);
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Packages action handlers
  const handleAddPackage = (newPkg: Omit<PricingPackage, "id">) => {
    const id = `PKG00${packages.length + 1}`;
    setPackages([{ ...newPkg, id }, ...packages]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleUpdatePackageStatus = (id: string, status: "Hoạt động" | "Tạm dừng") => {
    setPackages(packages.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleUpdatePackageDetails = (id: string, updated: Partial<PricingPackage>) => {
    setPackages(packages.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  // Dynamic Page routing switcher
  const renderViewContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardOverview 
            users={users} 
            activities={activities} 
            setView={setView} 
            onAddUserClick={() => setView("users")}
          />
        );
      case "users":
        return (
          <UserManagement
            users={users}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onUpdateUserStatus={handleUpdateUserStatus}
            onUpdateUserPackage={handleUpdateUserPackage}
            searchQuery={searchQuery}
          />
        );
      case "plans":
        return (
          <PlanManagement
            plans={plans}
            onAddPlan={handleAddPlan}
            onDeletePlan={handleDeletePlan}
            onUpdatePlanStatus={handleUpdatePlanStatus}
            onUpdatePlanProgress={handleUpdatePlanProgress}
            searchQuery={searchQuery}
          />
        );
      case "activities":
        return (
          <ActivityLog
            activities={activities}
            onAddActivity={handleAddActivity}
            onClearActivities={handleClearActivities}
            searchQuery={searchQuery}
          />
        );
      case "feedback":
        return (
          <FeedbackManagement
            feedbacks={feedbacks}
            onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
            searchQuery={searchQuery}
          />
        );
      case "payments":
        return (
          <div className="space-y-6">
            <section className="bg-gradient-to-br from-[#4969ed] to-[#2c4ed3] rounded-3xl p-8 mb-[-80px] shadow-sm relative overflow-hidden select-none">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-40 bottom-0 w-32 h-32 bg-[#5445cf]/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 mb-8">
                <h3 className="font-headline-lg text-headline-lg text-white mb-1">Quản lý thanh toán</h3>
                <p className="font-body-md text-white/80">Theo dõi doanh thu, hóa đơn giao dịch nâng cấp tài khoản đại diện hệ thống</p>
              </div>
            </section>

            <section className="bg-white rounded-3xl pt-24 pb-12 px-6 sm:px-8 border border-outline-variant/30 shadow-sm min-h-[450px]">
              <div className="text-center py-16 text-on-surface-variant/65">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8" />
                </div>
                <h4 className="font-headline-lg text-headline-sm text-on-surface mb-2 font-black">Hệ thống Thanh toán (Tượng trưng)</h4>
                <p className="max-w-md mx-auto text-[14px] text-on-surface-variant/80 leading-relaxed mb-6">
                  Giao diện quản trị, đối soát dòng tiền và lịch sử nâng cấp tài khoản PRO / ENTERPRISE từ người dùng. Chức năng đang được chuẩn bị để tích hợp nâng cao ở các giai đoạn sau.
                </p>
                <button
                  onClick={() => setView("dashboard")}
                  className="px-5 py-2.5 bg-primary hover:bg-[#1a3ec0] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Quay về Tổng quan
                </button>
              </div>
            </section>
          </div>
        );
      case "notifications":
        return (
          <NotificationManagement
            notifications={notifications}
            onAddNotification={handleAddNotification}
            onDeleteNotification={handleDeleteNotification}
            searchQuery={searchQuery}
          />
        );
      case "packages":
        return (
          <PackageManagement
            packages={packages}
            onAddPackage={handleAddPackage}
            onDeletePackage={handleDeletePackage}
            onUpdatePackageStatus={handleUpdatePackageStatus}
            onUpdatePackageDetails={handleUpdatePackageDetails}
            searchQuery={searchQuery}
          />
        );
      case "statistics":
        return <Statistics />;
      case "settings":
        return <Settings />;
      default:
        return <div className="text-center py-20 text-[#444654] font-medium">Coming soon!</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1c1a27] font-sans flex relative">
      <Sidebar currentView={currentView} setView={(v) => { setView(v); setSearchQuery(""); }} />

      <div className="flex-1 pl-20 min-h-screen flex flex-col overflow-x-hidden">
        <Header 
          currentView={currentView} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onBellClick={() => setView("notifications")}
        />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl w-full mx-auto animate-[fadeIn_0.3s_ease-out]">
          {renderViewContent()}
        </main>

        <footer className="py-6 border-t border-[#c4c5d7]/20 text-center text-xs text-[#444654] opacity-75 mt-auto">
          © 2024 Planify Admin Portal. Được thiết kế cho năng suất cao.
        </footer>
      </div>
    </div>
  );
}