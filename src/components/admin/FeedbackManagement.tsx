import React, { useState } from "react";
import { 
  Star, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Send, 
  Info,
  ShieldAlert,
  Lightbulb,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Feedback } from "../../types";

interface FeedbackManagementProps {
  feedbacks: Feedback[];
  onUpdateFeedbackStatus: (id: string, status: "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Đã đóng") => void;
  searchQuery: string;
}

export default function FeedbackManagement({ 
  feedbacks = [], 
  onUpdateFeedbackStatus,
  searchQuery = "" 
}: FeedbackManagementProps) {

  // Active status category tab filter
  const [activeTab, setActiveTab] = useState<"Tất cả" | "Chờ xử lý" | "Đang xử lý" | "Đã giải quyết" | "Đã đóng">("Tất cả");
  // Active type filter 
  const [activeType, setActiveType] = useState<"ALL" | "error" | "feature" | "help" | "praise">("ALL");
  
  // Replying state triggers
  const [replyingItem, setReplyingItem] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState("");
  const [localSearch, setLocalSearch] = useState("");

  // Pagination page state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const safeFeedbacks = feedbacks || [];

  // Filter feedbacks list based on search term, tab status, and type
  const matchingFeedbacks = safeFeedbacks.filter(fb => {
    if (!fb) return false;
    const combinedSearch = (searchQuery || localSearch || "").trim().toLowerCase();
    const matchesSearch = combinedSearch === "" ||
      (fb.userName || "").toLowerCase().includes(combinedSearch) ||
      (fb.title || "").toLowerCase().includes(combinedSearch) ||
      (fb.content || "").toLowerCase().includes(combinedSearch);

    const matchesStatus = activeTab === "Tất cả" || fb.status === activeTab;
    const matchesType = activeType === "ALL" || fb.type === activeType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats based on full un-filtered feedback array or design spec
  const totalCount = safeFeedbacks.length;
  const pendingCount = safeFeedbacks.filter(f => f && f.status === "Chờ xử lý").length;
  const resolvedCount = safeFeedbacks.filter(f => f && f.status === "Đã giải quyết").length;
  const errorCount = safeFeedbacks.filter(f => f && f.type === "error").length;

  // Pagination math calculations
  const totalItems = matchingFeedbacks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedbacks = matchingFeedbacks.slice(startIndex, startIndex + itemsPerPage);

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingItem) return;

    // Simulate sending answer response update
    onUpdateFeedbackStatus(replyingItem.id, "Đã giải quyết");
    
    // Reset inputs
    setReplyText("");
    setReplyingItem(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Chờ xử lý":
        return "bg-orange-50 text-orange-600";
      case "Đang xử lý":
        return "bg-primary text-white";
      case "Đã giải quyết":
        return "bg-tertiary/10 text-tertiary";
      case "Đã đóng":
      default:
        return "bg-surface-container-high text-on-surface-variant";
    }
  };

  const getTypeIconAndMeta = (type: string) => {
    switch (type) {
      case "error":
        return {
          Icon: AlertCircle,
          wrapperClass: "bg-error/10 text-error",
          text: "Lỗi báo cáo"
        };
      case "feature":
        return {
          Icon: Lightbulb,
          wrapperClass: "bg-orange-100 text-orange-500",
          text: "Ý tưởng mới"
        };
      case "help":
        return {
          Icon: HelpCircle,
          wrapperClass: "bg-primary/10 text-primary",
          text: "Hỏi đáp"
        };
      case "praise":
      default:
        return {
          Icon: ThumbsUp,
          wrapperClass: "bg-tertiary/10 text-tertiary",
                 text: "Yêu thích"
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Gradient Header matching the planify design */}
      <section className="bg-gradient-to-br from-[#2c4ed3] to-[#5445cf] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl select-none">
        {/* Abstract Background Ornaments */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-32 h-32 bg-[#5445cf]/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1.5">Phản hồi người dùng</h3>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl">Quản lý và phản hồi trực tiếp các ý kiến, đóng góp từ người dùng</p>
        </div>

        {/* Dynamic Metric Counter Grid matching design exactly */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Tổng phản hồi</span>
              <div className="w-9 h-9 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1c1a27] font-sans">
              {totalCount.toLocaleString()}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Chờ xử lý</span>
              <div className="w-9 h-9 bg-orange-100/80 text-orange-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1c1a27] font-sans">
              {pendingCount.toLocaleString()}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Đã giải quyết</span>
              <div className="w-9 h-9 bg-[#006a36]/10 text-[#006a36] rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1c1a27] font-sans">
              {resolvedCount.toLocaleString()}
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Lỗi báo cáo</span>
              <div className="w-9 h-9 bg-red-100/70 text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1c1a27] font-sans">
              {errorCount.toLocaleString()}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#c4c5d7]/20 shadow-sm min-h-[600px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#1c1a27]">Quản lý ý kiến & phản hồi</h3>
            <p className="text-xs text-[#444654] font-light mt-0.5">Lọc, tìm kiếm và trả lời các đóng góp ý kiến hoặc phản ánh lỗi từ người dùng</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444654] opacity-55" />
            <input 
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2.5 bg-[#f6f1ff]/60 border-none rounded-xl text-xs sm:text-sm w-full focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none placeholder-[#444654]/50 text-[#1c1a27]" 
              placeholder="Tìm kiếm nội dung phản hồi, người dùng..." 
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={activeType}
              onChange={(e) => {
                setActiveType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#f6f1ff]/60 text-[#1c1a27] font-semibold text-xs rounded-xl border-none focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả loại</option>
              <option value="error">🛡️ Lỗi báo cáo</option>
              <option value="feature">💡 Ý tưởng mới</option>
              <option value="help">❓ Hỏi đáp</option>
              <option value="praise">❤️ Yêu thích</option>
            </select>

            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-primary text-white hover:bg-[#1a3ec0] font-bold text-xs rounded-xl border-none focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer transition-all shadow-md shadow-primary/10"
            >
              <option value="Tất cả" className="bg-white text-[#1c1a27]">Trạng thái: Tất cả</option>
              <option value="Chờ xử lý" className="bg-white text-[#1c1a27]">Trạng thái: Chờ xử lý</option>
              <option value="Đang xử lý" className="bg-white text-[#1c1a27]">Trạng thái: Đang xử lý</option>
              <option value="Đã giải quyết" className="bg-white text-[#1c1a27]">Trạng thái: Đã giải quyết</option>
              <option value="Đã đóng" className="bg-white text-[#1c1a27]">Trạng thái: Đã đóng</option>
            </select>
          </div>
        </div>

        {/* Feedback List Container */}
        <div className="divide-y divide-outline-variant/30">
          
          {paginatedFeedbacks.length === 0 ? (
            <div className="py-20 text-center text-on-surface-variant/65">
              <MessageSquare className="w-12 h-12 text-[#2c4ed3]/40 mx-auto mb-4" />
              <p className="text-sm font-semibold">Không nhận thấy phản hồi nào đáp ứng tiêu chí sàng lọc.</p>
              <p className="text-xs text-on-surface-variant/50 mt-1">Vui lòng rà soát lại ký tự tìm kiếm hoặc bộ lọc trạng thái.</p>
            </div>
          ) : (
            paginatedFeedbacks.map((fb) => {
              const { Icon, wrapperClass } = getTypeIconAndMeta(fb.type);
              return (
                <div key={fb.id} className="py-6 flex gap-6 group">
                  <div className="mt-1">
                    <div className={`w-10 h-10 ${wrapperClass} rounded-full flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                        {fb.title}
                      </h4>
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getStatusBadgeClass(fb.status)}`}>
                        {fb.status}
                      </span>
                    </div>
                    <p className="text-body-md text-on-surface-variant mb-4 whitespace-pre-wrap">{fb.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-dim rounded-full flex items-center justify-center text-[10px] font-bold text-on-surface">
                          {fb.userInitials}
                        </div>
                        <span className="text-body-sm font-semibold text-on-surface">{fb.userName}</span>
                        {/* Star feedback rating representation */}
                        <div className="flex text-orange-400 select-none">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star 
                              key={sIdx} 
                              className={`w-3.5 h-3.5 ${sIdx < fb.rating ? "fill-orange-400 text-orange-400" : "text-outline-variant opacity-40"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-label-md text-on-surface-variant/60">{fb.timeText}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setReplyingItem(fb);
                          setReplyText("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface-variant text-body-sm font-medium rounded-lg hover:bg-surface-container-low transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        <span>Phản hồi</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Dynamic Pagination matching mockup strictly */}
        <div className="mt-12 flex items-center justify-between border-t border-outline-variant/30 pt-6 select-none">
          <p className="text-body-sm text-on-surface-variant">
            Hiển thị <span className="font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> trên <span className="font-bold">{totalItems.toLocaleString()}</span> phản hồi
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer text-on-surface-variant"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }).map((_, pIdx) => {
              const pageNum = pIdx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-primary text-white shadow-md"
                      : "border border-outline-variant hover:bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-all disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer text-on-surface-variant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </section>

      {/* Response Form Popup Dialog Box */}
      {replyingItem && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/55 backdrop-blur-sm z-[110]" onClick={() => setReplyingItem(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 sm:p-8 shadow-2xl z-[120] animate-[scaleUp_0.15s_ease-out]">
            
            <div className="flex justify-between items-center pb-3 border-b border-[#c4c5d7]/20 mb-4 select-none">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Trả lời: {replyingItem.userName}
              </h3>
              <button 
                onClick={() => setReplyingItem(null)}
                className="p-1 hover:bg-surface-container-low rounded-lg cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 mb-4 text-xs">
              <p className="font-bold text-on-surface text-body-sm">Được phản hồi từ khách hàng:</p>
              <p className="italic text-on-surface-variant font-light bg-white/50 p-2.5 rounded-xl border border-outline-variant/10">"{replyingItem.content}"</p>
            </div>

            <form onSubmit={handleSendResponse} className="space-y-4">
              <div className="space-y-1.5Packed">
                <label className="text-xs font-bold text-on-surface-variant block">Nội dung email trả lời hỗ trợ *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Kính chào quý khách, cảm ơn góp ý... Lỗi này đã xảy ra là do..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/50 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-on-surface focus:ring-1 focus:ring-primary focus:outline-none placeholder-on-surface-variant/40 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant block">Cập nhật trạng thái của góp ý</label>
                <select
                  value={replyingItem.status}
                  onChange={(e) => {
                    onUpdateFeedbackStatus(replyingItem.id, e.target.value as any);
                    setReplyingItem({ ...replyingItem, status: e.target.value as any });
                  }}
                  className="w-full bg-white border border-outline-variant/50 rounded-xl px-3 py-2.5 outline-none focus:border-primary text-xs sm:text-sm text-on-surface focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                >
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giải quyết">Đã giải quyết</option>
                  <option value="Đã đóng">Đã đóng</option>
                </select>
              </div>

              <div className="text-[11px] text-on-surface-variant/80 flex items-center gap-1.5 leading-relaxed">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Trạng thái của góp ý này sẽ tự động chuyển sang <strong className="text-on-surface">Đã giải quyết</strong> sau khi trả lời hỗ trợ gửi đi.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 select-none">
                <button
                  type="button"
                  onClick={() => setReplyingItem(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-[#e4dfff] text-on-surface-variant font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-[#1a3ec0] text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi phản hồi</span>
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
