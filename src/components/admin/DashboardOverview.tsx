import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  BarChart3, 
  BookOpen, 
  ArrowRight,
  ShieldAlert,
  HardDrive,
  Cpu,
  Database,
  Network,
  CloudAlert,
  CornerDownLeft,
  ChevronRight,
  Plus,
  ArrowUpCircle,
  CheckSquare,
  LogIn,
  Trash2,
  Settings,
  Activity as ActivityIcon
} from "lucide-react";
import { User, Plan, Activity, Feedback, ViewType } from "../../types";

const getActivityIconAndColor = (act: Activity) => {
  let Icon = Settings;
  const targetIconName = act.icon || act.type;

  switch (targetIconName) {
    case "person_add":
    case "registration":
      Icon = UserPlus;
      break;
    case "description":
    case "plan_creation":
    case "plan_update":
      Icon = BookOpen;
      break;
    case "upgrade":
    case "upgrade_pro":
    case "upgrade_ent":
      Icon = ArrowUpCircle;
      break;
    case "task_alt":
    case "completed_task":
      Icon = CheckSquare;
      break;
    case "error":
    case "report_bug":
      Icon = ShieldAlert;
      break;
    case "login":
    case "new_login":
      Icon = LogIn;
      break;
    case "delete":
    case "delete_spam":
      Icon = Trash2;
      break;
    default:
      Icon = Settings;
  }

  let bgClass = "bg-[#f0ebfe] text-[#2c4ed3]";
  if (act.iconColor) {
    if (act.iconColor.includes("green")) {
      bgClass = "bg-green-50 text-green-600 border border-green-100";
    } else if (act.iconColor.includes("blue") || act.iconColor.includes("#2c4ed3")) {
      bgClass = "bg-[#f0ebfe]/60 text-[#2c4ed3] border border-[#f0ebfe]";
    } else if (act.iconColor.includes("yellow") || act.iconColor.includes("orange")) {
      bgClass = "bg-amber-50 text-amber-600 border border-amber-100";
    } else if (act.iconColor.includes("red") || act.iconColor.includes("pink")) {
      bgClass = "bg-red-50 text-red-600 border border-red-100";
    } else if (act.iconColor.includes("purple")) {
      bgClass = "bg-purple-50 text-purple-600 border border-purple-100";
    } else {
      bgClass = `bg-indigo-50 border border-indigo-100 ${act.iconColor}`;
    }
  } else {
    switch (act.type) {
      case "registration":
        bgClass = "bg-green-50 text-green-600 border border-green-100";
        break;
      case "completed_task":
        bgClass = "bg-green-50 text-green-600 border border-green-100";
        break;
      case "plan_creation":
      case "plan_update":
        bgClass = "bg-blue-50 text-blue-600 border border-blue-100";
        break;
      case "upgrade_pro":
      case "upgrade_ent":
        bgClass = "bg-amber-50 text-amber-600 border border-amber-100";
        break;
      case "report_bug":
        bgClass = "bg-red-50 text-red-600 border border-red-100";
        break;
      default:
        bgClass = "bg-[#f0ebfe] text-[#2c4ed3]";
    }
  }

  return { Icon, bgClass };
};

interface DashboardOverviewProps {
  users: User[];
  activities: Activity[];
  setView: (view: ViewType) => void;
  onAddUserClick: () => void;
}

export default function DashboardOverview({ users, activities, setView, onAddUserClick }: DashboardOverviewProps) {
  const [cpuVal, setCpuVal] = useState(42);
  const [storageVal, setStorageVal] = useState(78);

  const stats = [
    {
      title: "Tổng người dùng",
      value: "12,458",
      trend: "+12.5% ",
      subtext: "tháng này",
      isPositive: true,
      icon: Users,
      iconColor: "text-[#2c4ed3] bg-[#2c4ed3]/10",
    },
    {
      title: "Người dùng mới",
      value: "1,234",
      trend: "+8.2% ",
      subtext: "tuần này",
      isPositive: true,
      icon: UserPlus,
      iconColor: "text-[#006a36] bg-[#006a36]/10",
    },
    {
      title: "Task hoàn thành",
      value: "234,567",
      trend: "+22.1% ",
      subtext: "tháng này",
      isPositive: true,
      icon: CheckCircle2,
      iconColor: "text-[#006a36] bg-[#006a36]/10",
    },
    {
      title: "Hoạt động hôm nay",
      value: "8,945",
      trend: "+5.4% ",
      subtext: "so với hôm qua",
      isPositive: true,
      icon: BarChart3,
      iconColor: "text-orange-600 bg-orange-100",
    },
    {
      title: "Kế hoạch đã tạo",
      value: "45,678",
      trend: "+15.3% ",
      subtext: "tháng này",
      isPositive: true,
      icon: BookOpen,
      iconColor: "text-[#2c4ed3] bg-[#2c4ed3]/10",
    },
    {
      title: "Thời gian TB",
      value: "4.2 phút",
      trend: "-2.1% ",
      subtext: "tối ưu hơn",
      isPositive: false, // negative means optimal here, but styled in orange
      icon: Clock,
      iconColor: "text-[#2c4ed3] bg-[#2c4ed3]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics & Activity Grid Layout Banner */}
      <div className="grid grid-cols-12 gap-6 bg-[#2c4ed3]/5 p-6 rounded-[2rem] relative overflow-hidden">
        {/* Statistics Metric cards box - Left side */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-[#c4c5d7]/20 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[11px] font-bold text-[#444654] uppercase tracking-wider">{stat.title}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1c1a27] font-sans mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {stat.isPositive ? (
                    <span className="text-[#006a36] flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {stat.trend}
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {stat.trend}
                    </span>
                  )}
                  <span className="text-[#444654] font-normal leading-none">{stat.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity Mini-list - Right side */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-[#c4c5d7]/20 flex flex-col h-[350px] lg:h-auto overflow-hidden relative z-10">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h3 className="text-sm md:text-base font-bold text-[#1c1a27]">Hoạt động gần đây</h3>
            <button 
              onClick={() => setView("activities")}
              className="text-[#2c4ed3] text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {activities.slice(0, 5).map((act) => {
              const { Icon, bgClass } = getActivityIconAndColor(act);
              return (
                <div 
                  key={act.id} 
                  className="flex gap-3 p-2.5 hover:bg-[#f6f1ff]/50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-[#1c1a27] leading-relaxed break-words">
                      <span className="font-bold">{act.userName}</span>{" "}
                      {act.actionText}
                      {act.details && (
                        <span className="font-semibold italic text-[#2c4ed3]"> "{act.details}"</span>
                      )}
                    </p>
                    <span className="text-[10px] text-[#444654] opacity-60 block mt-1">{act.timeText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative elements behind content */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-[2rem]">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2c4ed3]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#5445cf]/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* System Status Table Row */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm md:text-base font-bold text-[#1c1a27]">Trạng thái hệ thống</h3>
          <div className="flex items-center gap-2 text-[#006a36] font-bold text-xs bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-[#006a36] rounded-full animate-pulse" />
            <span>Tất cả hoạt động bình thường</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-[#c4c5d7]/20 pb-3">
              <span className="text-xs md:text-sm text-[#444654] font-medium flex items-center gap-2">
                <Network className="w-4 h-4 text-[#2c4ed3]" /> API Server
              </span>
              <span className="text-xs md:text-sm font-bold text-[#1c1a27]">99.9% uptime</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-[#444654] font-medium flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2c4ed3]" /> CPU Usage
                </span>
                <span className="font-bold text-[#1c1a27]">{cpuVal}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#f0ebfe] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2c4ed3] rounded-full transition-all duration-1000" 
                  style={{ width: `${cpuVal}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#c4c5d7]/20 pb-3">
              <span className="text-xs md:text-sm text-[#444654] font-medium flex items-center gap-2">
                <CloudAlert className="w-4 h-4 text-purple-600" /> AI Service
              </span>
              <span className="text-xs md:text-sm font-bold text-[#1c1a27]">99.5% uptime</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-[#c4c5d7]/20 pb-3">
              <span className="text-xs md:text-sm text-[#444654] font-medium flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2c4ed3]" /> Database Latency
              </span>
              <span className="text-xs md:text-sm font-bold text-[#1c1a27]">45ms latency</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs md:text-sm">
                <span className="text-[#444654] font-medium flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#2c4ed3]" /> Disk Storage
                </span>
                <span className="font-bold text-[#1c1a27]">{storageVal}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#f0ebfe] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2c4ed3] rounded-full transition-all duration-1000" 
                  style={{ width: `${storageVal}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-[#c4c5d7]/20 pb-3">
              <span className="text-xs md:text-sm text-[#444654] font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" /> Băng thông mạng
              </span>
              <span className="text-xs md:text-sm font-bold text-[#1c1a27]">120 Mbps</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Management table sneak-peek */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-sm md:text-base font-bold text-[#1c1a27]">Quản lý người dùng</h3>
            <p className="text-[11px] text-[#444654] mt-1">Danh sách đại diện 5 tài khoản hoạt động gần nhất.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onAddUserClick}
              className="bg-[#2c4ed3] text-white px-4 py-2 rounded-xl text-xs font-bold leading-none flex items-center gap-1.5 hover:bg-[#2c4ed3]/95 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Thêm mới
            </button>
            <button 
              onClick={() => setView("users")}
              className="border border-[#c4c5d7] text-[#444654] hover:bg-[#f6f1ff] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="text-[11px] font-bold text-[#444654] uppercase tracking-wider border-b border-[#c4c5d7]/30 pb-3">
                <th className="py-3 font-semibold">Người dùng</th>
                <th className="py-3 font-semibold text-center">Trạng thái</th>
                <th className="py-3 font-semibold text-center">Gói tài khoản</th>
                <th className="py-3 font-semibold text-center">Kế hoạch</th>
                <th className="py-3 font-semibold text-center">Tasks</th>
                <th className="py-3 font-semibold text-right">Hoạt động cuối</th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm divide-y divide-[#c4c5d7]/20">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="hover:bg-[#fcf8ff]/60 transition-colors group">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#f0ebfe] text-[#2c4ed3] flex items-center justify-center font-black text-xs">
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-bold text-[#1c1a27] group-hover:text-[#2c4ed3] transition-colors">{user.name}</p>
                        <p className="text-[10px] text-[#444654] opacity-70 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      user.status === "Hoạt động" 
                        ? "text-[#006a36] bg-[#006a36]/10" 
                        : user.status === "Đã khóa" 
                        ? "text-red-700 bg-red-100" 
                        : "text-[#444654] bg-[#f0ebfe]"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest ${
                      user.package === "ENTERPRISE" 
                        ? "text-orange-700 bg-orange-100" 
                        : user.package === "PRO" 
                        ? "text-[#2c4ed3] bg-[#2c4ed3]/10" 
                        : "text-[#444654] bg-slate-100"
                    }`}>
                      {user.package}
                    </span>
                  </td>
                  <td className="py-3 text-center font-bold text-[#1c1a27]">{user.plansCount}</td>
                  <td className="py-3 text-center font-semibold text-[#444654]">{user.tasksCount}</td>
                  <td className="py-3 text-right text-[11px] text-[#444654] opacity-80">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Charts Section Grid representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Chart 1: User Growth */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 flex flex-col h-[400px]">
          <h4 className="text-sm md:text-base font-bold text-[#1c1a27] mb-2">Tăng trưởng người dùng</h4>
          <p className="text-[10px] text-[#444654] mb-4">Biểu đồ biểu diễn tốc độ tích lũy tài khoản theo tuần.</p>
          <div className="flex-1 flex items-center justify-center relative bg-[#fcf8ff] rounded-2xl overflow-hidden p-4 border border-slate-100">
            <img 
              alt="Tăng trưởng người dùng" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ3NFJsIHJ5gX6Jl8jWY5QihT9kAeQ5TfWroAza2USB_l7LQ9qAqy4ButvGYQi8TBJeVwjqrSvFm7XY4_2WVRiS6G6s7W-iz_MVGdi4UUnHiTywne7OyLXe3g6u-YoRZRAAVmThtP2HCt-lQlGE6fL8ryuzMc_fHJMgC3igfvAQzIpLSX_aQvudaqIX-ib-gY3hPBmD7tjA2mSc-OE4bLBuSwO1-o4aZ2MXjncsTpHpsRsQBfKzavPzX48Xs6XaNOwyuU19CvnIkwx"
            />
          </div>
        </div>

        {/* Chart 2: Package Distribution */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 flex flex-col h-[400px]">
          <h4 className="text-sm md:text-base font-bold text-[#1c1a27] mb-2">Phân bổ gói người dùng</h4>
          <p className="text-[10px] text-[#444654] mb-4">Mật độ phân bổ thị phần giữa các cấp độ Free/Pro/Ent.</p>
          <div className="flex-1 flex items-center justify-center relative bg-[#fcf8ff] rounded-2xl overflow-hidden p-4 border border-slate-100">
            <img 
              alt="Phân bổ gói" 
              referrerPolicy="no-referrer"
              className="w-56 h-56 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUlchGua7jgdjJTUB3__plRI4mj8wGtlupxDyWCrcYKe223aHJNe8HxMHr4NvWcFQLUVP_Ztb0L2mkjZnt-eyUKvBq2rxohui_bhreyUB4W3kbB36pMYa2x1vzPizOop0A12PV-RXRYotso8Zrn8Gtyb0Ardi3nce0LGSNdpvztaBBM3BT74Gew_-R09CZNGRJQQKpZmtGh2OPdVJZ6ee_FqQ8zUyeeBzJkUa7qoILHhojEjXfw_7SeXr8I3q1l1K7-m9eqBBbDxX-"
            />
          </div>
        </div>

        {/* Chart 3: Weekly Plans */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 flex flex-col h-[400px] xl:col-span-1 md:col-span-2 w-full mx-auto">
          <h4 className="text-sm md:text-base font-bold text-[#1c1a27] mb-2">Kế hoạch tạo trong tuần</h4>
          <p className="text-[10px] text-[#444654] mb-4">Số lượng kế hoạch học tập/làm việc khởi tạo mới mỗi ngày.</p>
          <div className="flex-1 flex items-center justify-center relative bg-[#fcf8ff] rounded-2xl overflow-hidden p-4 border border-slate-100">
            <img 
              alt="Kế hoạch tuần" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-xyvCo9zhzNJmcjJOk3mjTqVlWj3HZir1329D492pHHbccbV6aVqWW-YxlzD7u_224nEz744RxbsQmSi2XotGXhDJ3rM5NYvVurbMswB_S9z2AwdgPMZSPSvwyor4pFk10V6RoDc-YTowcpBnp82PyybKG0Oz0GcyegtCI8S4vtrtvJIdQMHNj8fT85tEVbIETFElQH3qQoUwzlk0EWAiqtYe0eptSdiS9KoUop3t4PPMdf3Gh-87bWMD5hBq7WXBSui05-fzawO7"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
