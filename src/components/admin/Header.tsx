import React, { useState } from "react";
import { Search, Bell } from "lucide-react";
import { ViewType } from "../../types";

interface HeaderProps {
  currentView: ViewType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onBellClick?: () => void;
}

export default function Header({ currentView, searchQuery, setSearchQuery, onBellClick }: HeaderProps) {
  const [showBellDropdown, setShowBellDropdown] = useState(false);

  // Dynamic titles and subtitles based on active page state
  const getHeaderContent = () => {
    switch (currentView) {
      case "dashboard":
        return {
          title: "Xin chào, Admin!",
          subtitle: "Đây là tổng quan về nền tảng Planify của bạn. Theo dõi người dùng, kế hoạch và hiệu suất hệ thống.",
        };
      case "users":
        return {
          title: "Quản lý người dùng",
          subtitle: "Xem và quản lý tất cả người dùng trên nền tảng, thiết lập phân quyền và theo dõi các chỉ số hoạt động.",
        };
      case "plans":
        return {
          title: "Quản lý kế hoạch",
          subtitle: "Xem và quản lý tất cả các kế hoạch được khởi tạo, theo dõi sát sao tiến độ hoàn thành các nhiệm vụ.",
        };
      case "statistics":
        return {
          title: "Thống kê phân tích",
          subtitle: "Biểu đồ chi tiết về lưu lượng truy cập hệ thống, thiết bị sử dụng và xu hướng tăng trưởng người dùng.",
        };
      case "activities":
        return {
          title: "Nhật ký hoạt động",
          subtitle: "Xem toàn bộ dòng thời gian sự kiện, hoạt động và lịch sử thao tác của tất cả các cấp độ thành viên.",
        };
      case "feedback":
        return {
          title: "Phản hồi người dùng",
          subtitle: "Lắng nghe ý kiến đóng góp, báo lỗi hệ thống và trả lời các thắc mắc nâng cao trải nghiệm người dùng.",
        };
      case "notifications":
        return {
          title: "Quản lý thông báo",
          subtitle: "Thiết lập, lập lịch và gửi trực tiếp các chương trình thông báo đẩy, SMS hoặc Email Marketing diện rộng.",
        };
      case "packages":
        return {
          title: "Gói giao dịch & Dịch vụ",
          subtitle: "Cấu hình giá cả gói Pro/Enterprise, nâng cấp tính năng giới hạn và theo dõi phân bổ doanh thu người dùng.",
        };
      case "settings":
        return {
          title: "Cài đặt cấu hình",
          subtitle: "Thiết lập thông số bảo mật hệ thống, sao lưu dữ liệu, điều chỉnh kết nối cổng API và đồng bộ dữ liệu.",
        };
      default:
        return {
          title: "Xin chào, Admin!",
          subtitle: "Hệ thống quản trị tổng thể dịch vụ Planify Admin Panel.",
        };
    }
  };

  const { title, subtitle } = getHeaderContent();

  const bellNotifications = [
    { text: "Nguyen Van A vừa đăng ký tài khoản mới", time: "2 phút trước" },
    { text: "Tran Thi B đã tạo kế hoạch 'Xây dựng ứng dụng mobile'", time: "5 phút trước" },
    { text: "Hoang Van E gửi báo cáo lỗi AI không phản hồi", time: "1 giờ trước" }
  ];

  return (
    <header className="sticky top-0 z-[45] w-full bg-[#fcf8ff]/85 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between px-8 py-5 border-b border-[#c4c5d7]/20">
      <div className="flex flex-col mb-4 md:mb-0">
        <h2 className="text-xl md:text-2xl font-black text-[#1c1a27] tracking-tight antialiased">
          {title}
        </h2>
        <p className="text-xs md:text-sm text-[#444654] font-medium mt-1 max-w-2xl leading-relaxed whitespace-pre-line">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-6 self-end md:self-auto">
        {/* Search form bar container */}
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm thông tin..."
            className="bg-[#f0ebfe] border-none rounded-full px-5 py-2.5 pl-11 text-xs md:text-sm text-[#1c1a27] placeholder-[#444654]/60 focus:ring-2 focus:ring-[#2c4ed3] focus:bg-white w-48 md:w-64 transition-all focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#444654] absolute left-4 top-1/2 -translate-y-1/2 opacity-70 group-focus-within:text-[#2c4ed3] transition-colors" />
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setShowBellDropdown(!showBellDropdown)}
            className="w-10 h-10 flex items-center justify-center rounded-all hover:bg-[#f0ebfe] text-[#444654] transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5 text-[#444654] group-hover:text-[#2c4ed3]" />
            <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-[#2c4ed3] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#fcf8ff]">
              3
            </span>
          </button>

          {/* Bell Notifications Dropdown Box */}
          {showBellDropdown && (
            <>
              <div 
                className="fixed inset-0 z-50" 
                onClick={() => setShowBellDropdown(false)}
              />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-[#c4c5d7]/30 shadow-xl p-4 z-[100] animate-[slideIn_0.15s_ease-out]">
                <div className="flex justify-between items-center pb-2 border-b border-[#c4c5d7]/20 mb-2">
                  <h4 className="text-xs font-bold text-[#1c1a27]">Thông báo mới</h4>
                  <button 
                    onClick={() => {
                      if (onBellClick) onBellClick();
                      setShowBellDropdown(false);
                    }}
                    className="text-[10px] uppercase tracking-wider font-extrabold text-[#2c4ed3] hover:underline"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-3">
                  {bellNotifications.map((notif, idx) => (
                    <div key={idx} className="text-xs hover:bg-[#f6f1ff] p-2 rounded-lg transition-colors cursor-pointer">
                      <p className="text-[#1c1a27] font-semibold">{notif.text}</p>
                      <span className="text-[10px] text-[#444654] opacity-70 mt-1 block">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Admin Image Avatar */}
          <div className="w-10 h-10 rounded-full border-2 border-[#c4c5d7]/50 overflow-hidden shadow-sm flex-shrink-0 bg-slate-100">
            <img 
              alt="Admin Avatar" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTsRZJlx1DFGuTTkbwyhZqVw-9ejPtlhWi8Bu0QczVVIKHYfabaXXhSGMjB9d47iL8zA8c_YOcCYPBXMuCPIRGltC8tWN17Y143FR5pjm0XmwOj_Yq8kC-qmhFnx_na6Zl1F9nrR2XpHN0HNA5-CAHgDmWv98phgY7SZGBTZj9GP7PtFUsDxJk18q9DLwRoyrhFsaNr3e_sE6iP39ye2iyn_P-T9rV-Kgpug7_ffRzKxEfimsYQnfr1i9uuTokIhRotCBUk2C6Gek1"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
