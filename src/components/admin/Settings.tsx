import React, { useState } from "react";
import { 
  Settings as 
  ShieldCheck, 
  Sparkles, 
  

  Database,
  
  CheckCircle2,
  Save,
  Globe
} from "lucide-react";




export default function Settings() {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temp, setTemp] = useState(0.7);
  const [rateLimit, setRateLimit] = useState(120);
  const [isMaint, setIsMaint] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [siteTitle, setSiteTitle] = useState("Planify Collaborative Suite");
  const [supportEmail, setSupportEmail] = useState("support@planify.io");
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedMsg(true);
    setTimeout(() => {
      setShowSavedMsg(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert simulation */}
      {showSavedMsg && (
        <div className="fixed bottom-6 right-6 bg-[#006a36] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 z-50 animate-[slideIn_0.2s_ease-out]">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-bold">Cài đặt hệ thống đã được cập nhật thành công!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: General settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Site Metadata */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 space-y-4">
            <h4 className="text-sm md:text-base font-bold text-[#1c1a27] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#2c4ed3]" /> Thông tin nền tảng chung
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Tiêu đề hệ thống (Site Name)</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:outline-none focus:ring-2 focus:ring-[#2c4ed3]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Email hỗ trợ khách hàng</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:outline-none focus:ring-2 focus:ring-[#2c4ed3]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: AI Core Engine configs */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 space-y-5">
            <h4 className="text-sm md:text-base font-bold text-[#1c1a27] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2c4ed3]" /> Cài đặt mô hình AI (Gemini SDK Core)
            </h4>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Lựa chọn mô hình ngôn ngữ mặc định (Model Select)</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2c4ed3] cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Tốc độ tối ưu - Mặc định)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Lý luận cao cấp - Thích hợp kế hoạch dài ngày)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Mô hình tương thích ngược)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-[#444654]">
                  <span>Độ sáng tạo (Temperature)</span>
                  <span className="font-mono text-[#2c4ed3]">{temp}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full accent-[#2c4ed3] cursor-pointer"
                />
                <p className="text-[10px] text-[#444654] opacity-70">
                  * Trị số thấp giúp AI phản hồi chặt chẽ, chính xác hơn. Trị số cao kích thích thiết kế đa dạng hơn.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Server Limit Restrictions configs */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 space-y-4">
            <h4 className="text-sm md:text-base font-bold text-[#1c1a27] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#2c4ed3]" /> Thông số bảo vệ giới hạn (Rate Limits)
            </h4>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-[#444654]">
                  <span>Hạn mức tối đa số yêu cầu/người dùng/phút</span>
                  <span className="font-mono text-purple-600 font-bold">{rateLimit} req/min</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(parseInt(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Column 3: Security & toggle controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 space-y-5">
            <h4 className="text-sm md:text-base font-bold text-[#1c1a27] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2c4ed3]" /> An ninh & Đóng băng Máy chủ
            </h4>

            <div className="space-y-5">
              {/* Toggle 1: Two factor */}
              <div className="flex items-center justify-between p-3.5 bg-[#fcf8ff] rounded-2xl border border-[#c4c5d7]/10">
                <div>
                  <p className="text-xs sm:text-sm font-black text-[#1c1a27]">Bảo mật 2 lớp (2FA)</p>
                  <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Yêu cầu OTP khi đăng nhập Admin.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                    twoFactor ? "bg-[#2c4ed3]" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    twoFactor ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>

              {/* Toggle 2: Maintenance mode */}
              <div className="flex items-center justify-between p-3.5 bg-red-50/20 rounded-2xl border border-red-200/40">
                <div>
                  <p className="text-xs sm:text-sm font-black text-red-700">Chế độ bảo trì (Maintenance)</p>
                  <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Đóng cổng và hiển thị biển báo khách.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMaint(!isMaint)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                    isMaint ? "bg-red-600" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${
                    isMaint ? "right-0.5" : "left-0.5"
                  }`} />
                </button>
              </div>
            </div>
            
            <p className="text-[10px] text-[#444654] leading-relaxed block border-t border-[#c4c5d7]/20 pt-4 opacity-75 italic">
              * Hành động đóng băng hoặc bật bảo trì sẽ gửi trực tiếp thông báo thời gian thực đến tất cả kết nối WebSocket hiện hữu.
            </p>
          </div>

          {/* Trigger button action column footer */}
          <button
            type="submit"
            className="w-full bg-[#2c4ed3] hover:bg-[#2c4ed3]/95 text-white py-4.5 rounded-[1.5rem] font-sans font-black tracking-tight text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#2c4ed3]/15 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
          >
            <Save className="w-5 h-5" /> Áp dụng cấu hình
          </button>
        </div>

      </form>
    </div>
  );
}
