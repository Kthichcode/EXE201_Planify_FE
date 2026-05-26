import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  Eye, 
  Users, 
  Megaphone, 
  Mail, 
  MessageSquare, 
  Trash2, 
  Edit, 
  Plus, 
  X,
  Sparkles,
  Info,
  Calendar
} from "lucide-react";
import { NotificationItem } from "../../types";

interface NotificationManagementProps {
  notifications: NotificationItem[];
  onAddNotification: (notif: Omit<NotificationItem, "id">) => void;
  onDeleteNotification: (id: string) => void;
  searchQuery: string;
}

export default function NotificationManagement({ 
  notifications, 
  onAddNotification, 
  onDeleteNotification,
  searchQuery 
}: NotificationManagementProps) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "Đã gửi" | "Đã lên lịch">("ALL");

  // Local interactive states for channels matching mockup
  const [pushActive, setPushActive] = useState(true);
  const [emailActive, setEmailActive] = useState(true);
  const [smsActive, setSmsActive] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTarget, setNewTarget] = useState("Tất cả người dùng");
  const [sendImmediately, setSendImmediately] = useState(true);
  const [scheduleTime, setScheduleTime] = useState("");

  // Edit / view symbolic states without adding overly heavy backend
  const [editingItem, setEditingItem] = useState<NotificationItem | null>(null);

  // Filtering based on search and status
  const filteredNotifs = notifications.filter(n => {
    const combinedSearch = searchQuery.toLowerCase().trim();
    const matchesSearch = combinedSearch === "" || 
      n.title.toLowerCase().includes(combinedSearch) || 
      n.description.toLowerCase().includes(combinedSearch);

    const matchesStatus = filterStatus === "ALL" || n.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle addition of new notifications
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const formattedTime = sendImmediately 
      ? new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
      : `${scheduleTime || "10/12/2024 10:00"}`;

    onAddNotification({
      title: newTitle,
      description: newDesc,
      target: newTarget,
      sentTime: formattedTime,
      status: sendImmediately ? "Đã gửi" : "Đã lên lịch",
      openRate: sendImmediately ? `${Math.floor(Math.random() * 30) + 60}%` : undefined
    });

    // Reset forms
    setNewTitle("");
    setNewDesc("");
    setNewTarget("Tất cả người dùng");
    setSendImmediately(true);
    setScheduleTime("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
      
      {/* 1. Hero Gradient Section holding stats & channels */}
      <section className="bg-gradient-to-br from-[#2c4ed3] to-[#6d60e9] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-sm select-none">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h3 className="text-headline-xl font-headline-xl mb-1 font-bold">Quản lý thông báo</h3>
              <p className="text-[#dde1ff]/80 text-sm">Gửi và quản lý thông báo đến người dùng</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-white hover:bg-[#f6f1ff] text-[#2c4ed3] px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-black/5 active:scale-95 cursor-pointer text-xs sm:text-sm shrink-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Tạo thông báo mới</span>
            </button>
          </div>

          {/* Stats Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Stat Box 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-[13px] font-medium text-[#444654] mb-2">Tổng thông báo đã gửi</p>
                <span className="text-primary bg-[#2c4ed3]/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-[#1c1a27] font-black">45,892</span>
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-[13px] font-medium text-[#444654] mb-2">Gửi hôm nay</p>
                <span className="text-[#006a36] bg-[#006a36]/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-[#1c1a27] font-black">234</span>
              </div>
            </div>

            {/* Stat Box 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-[13px] font-medium text-[#444654] mb-2">Tỷ lệ mở</p>
                <span className="text-[#5445cf] bg-[#5445cf]/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-[#1c1a27] font-black">68.5%</span>
              </div>
            </div>

            {/* Stat Box 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="text-xs sm:text-[13px] font-medium text-[#444654] mb-2">Người nhận TB</p>
                <span className="text-primary bg-[#2c4ed3]/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-[#1c1a27] font-black">8,450</span>
              </div>
            </div>

          </div>

          {/* Interactive Channels Section */}
          <div className="mt-10">
            <h4 className="text-headline-md font-headline-md mb-4 text-white font-semibold">Kênh thông báo</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#1c1a27]">
              
              {/* Push Switch Card */}
              <div className="bg-white/95 p-4 rounded-2xl flex items-center justify-between shadow-md transition-all hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#dde1ff] flex items-center justify-center text-primary shrink-0">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">Push Notification</p>
                    <p className="text-xs text-[#444654]">Thông báo đẩy trên app</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={pushActive}
                    onChange={(e) => setPushActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e5e0f3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c4ed3]" />
                </label>
              </div>

              {/* Email Switch Card */}
              <div className="bg-white/95 p-4 rounded-2xl flex items-center justify-between shadow-md transition-all hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e4dfff] flex items-center justify-center text-[#5445cf] shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">Email</p>
                    <p className="text-xs text-[#444654]">Gửi qua email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={emailActive}
                    onChange={(e) => setEmailActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e5e0f3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c4ed3]" />
                </label>
              </div>

              {/* SMS Switch Card */}
              <div className="bg-white/95 p-4 rounded-2xl flex items-center justify-between shadow-md transition-all hover:bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ebe5f8] flex items-center justify-center text-[#444654] shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">SMS</p>
                    <p className="text-xs text-[#444654]">Tin nhắn điện thoại</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={smsActive}
                    onChange={(e) => setSmsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#e5e0f3] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2c4ed3]" />
                </label>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Notification History Block styling */}
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-outline-variant/30 custom-shadow">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h3 className="text-headline-md font-headline-md text-on-surface font-semibold">Lịch sử thông báo</h3>
          
          {/* Quick status mini tabs filter */}
          <div className="flex bg-[#f0ebfe] p-1 rounded-xl gap-1.5 self-stretch sm:self-auto select-none">
            <button 
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === "ALL" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilterStatus("Đã gửi")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === "Đã gửi" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Đã gửi
            </button>
            <button 
              onClick={() => setFilterStatus("Đã lên lịch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${filterStatus === "Đã lên lịch" ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Đã lên lịch
            </button>
          </div>
        </div>

        {/* Notifs Content Feed */}
        <div className="space-y-6">
          
          {filteredNotifs.length === 0 ? (
            <div className="py-20 text-center text-on-surface-variant/65">
              <Bell className="w-12 h-12 text-[#2c4ed3]/40 mx-auto mb-4" />
              <p className="text-sm font-semibold">Không tìm thấy thông báo nào phù hợp.</p>
              <p className="text-xs text-on-surface-variant/50 mt-1">Vui lòng rà soát ký tự tìm kiếm hoặc bấm tab Lịch lọc khác.</p>
            </div>
          ) : (
            filteredNotifs.map((notif, idx) => {
              const isSent = notif.status === "Đã gửi";
              return (
                <div key={notif.id}>
                  {idx > 0 && <div className="border-b border-outline-variant/30 my-6" />}
                  
                  <div className="flex items-start justify-between p-4 rounded-2xl hover:bg-[#f6f1ff]/40 transition-colors group">
                    <div className="flex items-start gap-4 sm:gap-6">
                      
                      {/* Left side dynamic icon wrapper */}
                      <div className="w-12 h-12 rounded-full bg-[#dde1ff] text-primary flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>

                      {/* Info core details */}
                      <div className="flex flex-col gap-1.5">
                        <h5 className="font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors">
                          {notif.title}
                        </h5>
                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
                          {notif.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-1.5 text-xs text-on-surface-variant/70">
                          <span className="font-medium bg-[#f0ebfe] px-2 py-0.5 rounded text-[11px] text-[#2c4ed3]">{notif.target}</span>
                          <span className="text-[11px] text-[#747686] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {notif.sentTime}
                          </span>
                          {isSent && notif.openRate && (
                            <span className="text-[11px] font-semibold text-[#006a36]">Tỷ lệ mở: {notif.openRate}</span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right action control state with badges & buttons */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0 ml-4 select-none">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full ${
                        isSent 
                          ? "text-[#006a36] bg-[#006a36]/10" 
                          : "text-[#D37D00] bg-orange-50"
                      }`}>
                        {notif.status}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setEditingItem(notif);
                            setNewTitle(notif.title);
                            setNewDesc(notif.description);
                            setNewTarget(notif.target);
                            setSendImmediately(notif.status === "Đã gửi");
                          }}
                          className="p-2 text-[#747686] hover:text-primary hover:bg-[#f0ebfe] rounded-xl transition-all cursor-pointer"
                          title="Chỉnh sửa thông báo"
                        >
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        
                        <button 
                          onClick={() => onDeleteNotification(notif.id)}
                          className="p-2 text-[#747686] hover:text-error hover:bg-[#ffdad6] rounded-xl transition-all cursor-pointer"
                          title="Xóa thông báo"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}

        </div>

      </section>

      {/* 3. Popover drawer dialogue modal to ADD Notification */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/50 backdrop-blur-sm z-[110]" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 sm:p-8 shadow-2xl z-[120] animate-[scaleUp_0.15s_ease-out]">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c5d7]/20 mb-5 select-none">
              <h3 className="text-base sm:text-lg font-black text-[#1c1a27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <span>Tạo và thiết lập thông báo đẩy</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-surface-container-low rounded-lg cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Tiêu đề thông cáo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Khuyến mãi mừng ngày lễ giảm giá 15%..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary focus:outline-none placeholder-on-surface-variant/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Nội dung văn bản chi tiết *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Nhập nội dung thông điệp gửi tới khách hàng của bạn..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary focus:outline-none placeholder-on-surface-variant/40 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Đối tượng khách hàng áp dụng</label>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-white border border-outline-variant/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                >
                  <option value="Tất cả người dùng">Tất cả người dùng (All Active)</option>
                  <option value="Người dùng Free">Nội bộ người dùng FREE</option>
                  <option value="Hội viên gói Pro">Hội viên đóng tiền gói PRO</option>
                  <option value="Khách hàng Enterprise">Tập đoàn ENTERPRISE</option>
                </select>
              </div>

              {/* Toggle Date execution */}
              <div className="space-y-3.5 border-t border-[#c4c5d7]/20 pt-4 mt-2">
                <div className="flex items-center gap-2.5 select-none">
                  <input
                    type="checkbox"
                    id="sendNowCheckbox"
                    checked={sendImmediately}
                    onChange={(e) => setSendImmediately(e.target.checked)}
                    className="w-4.5 h-4.5 text-primary border-outline-variant/50 focus:ring-primary rounded cursor-pointer"
                  />
                  <label htmlFor="sendNowCheckbox" className="text-xs font-bold text-on-surface cursor-pointer">
                    Gửi ngay lập tức sau khi xác nhận nộp
                  </label>
                </div>

                {!sendImmediately && (
                  <div className="space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                    <label className="text-xs font-bold text-[#444654] block">Lên lịch ngày phát hành</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 09/03/2024 10:00"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="text-[11px] text-on-surface-variant/80 flex items-center gap-1.5 leading-relaxed pt-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Người dùng nằm trong danh sách đối tượng sẽ nhận được thông báo ngay lập tức hoặc đúng thời gian đặt trước.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 mt-6 select-none">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-[#e4dfff]/60 text-[#444654] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-[#1a3ec0] text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Xác nhận gửi</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Editing Dialog Modal (Symbolic Action to satisfy design edit buttons cleanly) */}
      {editingItem && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/50 backdrop-blur-sm z-[110]" onClick={() => setEditingItem(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 sm:p-8 shadow-2xl z-[120] animate-[scaleUp_0.15s_ease-out]">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c5d7]/20 mb-5 select-none">
              <h3 className="text-base sm:text-lg font-black text-[#1c1a27] flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary shrink-0" />
                <span>Chỉnh sửa thông báo (Draft)</span>
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1.5 hover:bg-surface-container-low rounded-lg cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // Update elements locally
              editingItem.title = newTitle;
              editingItem.description = newDesc;
              editingItem.target = newTarget;
              editingItem.status = sendImmediately ? "Đã gửi" : "Đã lên lịch";
              setEditingItem(null);
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Tiêu đề thông cáo *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Nội dung văn bản chi tiết *</label>
                <textarea
                  required
                  rows={4}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654] block">Đối tượng khách hàng áp dụng</label>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-white border border-outline-variant/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                >
                  <option value="Tất cả người dùng">Tất cả người dùng (All Active)</option>
                  <option value="Người dùng Free">Nội bộ người dùng FREE</option>
                  <option value="Hội viên gói Pro">Hội viên đóng tiền gói PRO</option>
                  <option value="Khách hàng Enterprise">Tập đoàn ENTERPRISE</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 mt-6 select-none">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-slate-100 text-[#444654] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-[#1a3ec0] text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
