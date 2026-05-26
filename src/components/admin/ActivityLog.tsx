import React, { useState } from "react";
import { 
  UserPlus, 
  FileText, 
  ArrowUpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  LogIn, 
  Trash2, 
  Search, 
  Bell 
} from "lucide-react";
import { Activity } from "../../types";

interface ActivityLogProps {
  activities: Activity[];
  onAddActivity: (act: Omit<Activity, "id" | "timeText">) => void;
  onClearActivities: () => void;
  searchQuery: string;
}

export default function ActivityLog({ 
  activities, 
  onAddActivity, 
  onClearActivities,
  searchQuery 
}: ActivityLogProps) {

  // Filter tabs state matching image options
  const [activeTab, setActiveTab] = useState<"ALL" | "REG" | "PLAN" | "UPGRADE" | "SYS">("ALL");

  // Quick helper to map activity type to icon, metadata and custom styling
  const getActivityMeta = (act: Activity) => {
    let IconComp = Settings;
    let iconColorClass = "text-white";
    let typeLabel = "Hệ thống";

    switch (act.type) {
      case "registration":
        IconComp = UserPlus;
        iconColorClass = "text-[#6cfe9f]"; // tertiary-fixed
        typeLabel = "Đăng ký";
        break;
      case "plan_creation":
      case "plan_update":
        IconComp = FileText;
        iconColorClass = "text-white";
        typeLabel = "Kế hoạch";
        break;
      case "upgrade_pro":
      case "upgrade_ent":
        IconComp = ArrowUpCircle;
        iconColorClass = "text-yellow-300"; // upgrade yellow
        typeLabel = "Nâng cấp";
        break;
      case "completed_task":
        IconComp = CheckCircle2;
        iconColorClass = "text-[#6cfe9f]"; // success green
        typeLabel = "Nhiệm vụ";
        break;
      case "report_bug":
        IconComp = AlertTriangle;
        iconColorClass = "text-error-container text-[#ffdad6]"; // error light
        typeLabel = "Sự cố";
        break;
      case "new_login":
        IconComp = LogIn;
        iconColorClass = "text-white";
        typeLabel = "Truy cập";
        break;
      case "delete_spam":
        IconComp = Trash2;
        iconColorClass = "text-[#ffdad6]";
        typeLabel = "Dọn spam";
        break;
      default:
        IconComp = Settings;
        iconColorClass = "text-white/90";
    }

    return { icon: IconComp, color: iconColorClass, label: typeLabel };
  };

  // Tab dynamic filtering logic
  const filteredActivities = activities.filter(act => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      act.userName.toLowerCase().includes(query) || 
      act.actionText.toLowerCase().includes(query) || 
      (act.details && act.details.toLowerCase().includes(query));

    // 2. Tab Filter
    if (!matchesSearch) return false;
    if (activeTab === "ALL") return true;
    if (activeTab === "REG") return act.type === "registration";
    if (activeTab === "PLAN") return act.type === "plan_creation" || act.type === "plan_update";
    if (activeTab === "UPGRADE") return act.type === "upgrade_pro" || act.type === "upgrade_ent";
    if (activeTab === "SYS") return act.type === "system_update" || act.type === "delete_spam" || act.type === "new_login" || act.type === "report_bug";
    
    return true;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      
      {/* 1. Main Immersive Glassmorphism Card exactly matching Planify Activities design screenshot */}
      <section className="bg-gradient-to-br from-[#4969ed] to-[#2c4ed3] rounded-[2rem] p-6 sm:p-10 text-white min-h-[819px] shadow-sm relative overflow-hidden select-none">
        
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          
          {/* Main Title Header area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-2 font-headline-xl">Hoạt động</h3>
              <p className="text-white/80 text-sm font-body-md font-light">Lịch sử hoạt động trên nền tảng</p>
            </div>

            {/* Quick action triggers */}
            <div className="flex gap-4 self-stretch sm:self-auto justify-end">
              
              {/* Reset/Clear events indicator button */}
              {activities.length > 0 && (
                <button 
                  onClick={onClearActivities}
                  className="px-4 py-2 bg-white/10 hover:bg-[#ffdad6]/20 hover:text-[#ffdad6] text-white/90 rounded-full text-xs font-bold transition-all border border-white/5 cursor-pointer flex items-center gap-1.5"
                  title="Xóa lịch sử để làm sạch màn hình"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa nhật trình</span>
                </button>
              )}

              <button className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center text-white/75 hover:text-white transition-all cursor-pointer">
                <Search className="w-[18px] h-[18px]" />
              </button>
              
              <button className="relative w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center text-white/75 hover:text-white transition-all cursor-pointer">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold flex items-center justify-center rounded-full bg-[#6cfe9f] text-[#00210d]">3</span>
              </button>
            </div>
          </div>

          {/* Horizontal Interactive Timeline filter toggles */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 max-w-full no-scrollbar select-none">
            <button 
              onClick={() => setActiveTab("ALL")}
              className={`px-5 py-2.5 rounded-full font-headline-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "ALL" 
                  ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              Tất cả hoạt động
            </button>

            <button 
              onClick={() => setActiveTab("REG")}
              className={`px-5 py-2.5 rounded-full font-headline-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "REG" 
                  ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              Đăng ký mới
            </button>

            <button 
              onClick={() => setActiveTab("PLAN")}
              className={`px-5 py-2.5 rounded-full font-headline-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "PLAN" 
                  ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              Kế hoạch
            </button>

            <button 
              onClick={() => setActiveTab("UPGRADE")}
              className={`px-5 py-2.5 rounded-full font-headline-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "UPGRADE" 
                  ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              Gói dịch vụ
            </button>

            <button 
              onClick={() => setActiveTab("SYS")}
              className={`px-5 py-2.5 rounded-full font-headline-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "SYS" 
                  ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              Sự cố & Bảo trì
            </button>
          </div>

          {/* Activity Timeline List - Perfectly styled with clean borders & spacings matching the mockup */}
          <div className="space-y-6 max-w-4xl relative z-10 pt-4">
            {filteredActivities.length === 0 ? (
              <div className="py-24 text-center">
                <Bell className="w-12 h-12 text-white/30 mx-auto mb-4 animate-bounce" />
                <p className="text-sm font-medium text-white/60">Không ghi nhận hoạt động nào tương ứng.</p>
                <p className="text-xs text-white/40 mt-1">Sử dụng bộ tìm kiếm hoặc nhấp phân loại khác để tra cứu.</p>
              </div>
            ) : (
              filteredActivities.map((act) => {
                const meta = getActivityMeta(act);
                const IconComp = meta.icon;

                return (
                  <div 
                    key={act.id}
                    className="flex items-center gap-6 p-2 rounded-2xl hover:bg-white/5 transition-all duration-200 group"
                  >
                    {/* Left Icon Pill */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                      <IconComp className={`w-[20px] h-[20px] ${meta.color}`} />
                    </div>

                    {/* Middle Core Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                        <span className="font-bold text-headline-md text-sm sm:text-base text-white tracking-tight">
                          {act.userName}
                        </span>
                        
                        <span className="font-body-md text-white/80 text-xs sm:text-sm">
                          {act.actionText}
                        </span>

                        {act.details && (
                          <span className="italic font-normal text-xs sm:text-sm text-white/90">
                            "{act.details}"
                          </span>
                        )}
                      </div>

                      {/* Timeline bottom timestamp */}
                      <p className="font-label-md text-label-md text-white/50 mt-1 text-[11px] sm:text-xs">
                        {act.timeText}
                      </p>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
