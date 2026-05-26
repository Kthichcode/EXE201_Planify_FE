import React, { useState } from "react";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Search, 
  X, 
  CheckCircle2, 
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  MoreHorizontal,
  Check,
  Percent
} from "lucide-react";
import { Plan } from "../../types";

interface PlanManagementProps {
  plans: Plan[];
  onAddPlan: (plan: Omit<Plan, "id">) => void;
  onDeletePlan: (id: string) => void;
  onUpdatePlanStatus: (id: string, status: "Đang thực hiện" | "Hoàn thành" | "Quá hạn") => void;
  onUpdatePlanProgress: (id: string, progress: number) => void;
  searchQuery: string;
}

export default function PlanManagement({ 
  plans, 
  onAddPlan, 
  onDeletePlan, 
  onUpdatePlanStatus, 
  onUpdatePlanProgress,
  searchQuery 
}: PlanManagementProps) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "Đang thực hiện" | "Hoàn thành" | "Quá hạn" >("ALL");
  const [localSearchText, setLocalSearchText] = useState("");
  const [activeMenuPlanId, setActiveMenuPlanId] = useState<string | null>(null);

  // Form states for creating a new plan
  const [newTitle, setNewTitle] = useState("");
  const [newCreator, setNewCreator] = useState("");
  const [newStatus, setNewStatus] = useState<"Đang thực hiện" | "Hoàn thành" | "Quá hạn">("Đang thực hiện");
  const [newProgress, setNewProgress] = useState(0);
  const [totalTasks, setTotalTasks] = useState(20);
  const [newDeadline, setNewDeadline] = useState("15/03/2024");

  // Filters combined
  const filteredPlans = plans.filter(p => {
    const finalQuery = (localSearchText || searchQuery || "").toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(finalQuery) || 
      p.creatorName.toLowerCase().includes(finalQuery);
    
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCreator.trim()) return;

    // Derive creator initials
    const parts = newCreator.trim().split(" ");
    const initials = parts.length === 1 
      ? parts[0].substring(0, 2).toUpperCase() 
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    // calculate tasks text
    const compTasks = Math.round((newProgress / 100) * totalTasks);
    const tasksText = `${compTasks}/${totalTasks} tasks`;

    onAddPlan({
      title: newTitle,
      creatorName: newCreator,
      creatorInitials: initials,
      status: newStatus,
      progress: newProgress,
      tasksText: tasksText,
      deadline: newDeadline
    });

    // Reset Form & Close
    setNewTitle("");
    setNewCreator("");
    setNewStatus("Đang thực hiện");
    setNewProgress(0);
    setTotalTasks(20);
    setNewDeadline("15/03/2024");
    setShowAddModal(false);
  };

  const handleUpdateStatusAndAdjustProgress = (planId: string, status: "Đang thực hiện" | "Hoàn thành" | "Quá hạn") => {
    onUpdatePlanStatus(planId, status);
    if (status === "Hoàn thành") {
      onUpdatePlanProgress(planId, 100);
    } else if (status === "Đang thực hiện") {
      const planObj = plans.find(p => p.id === planId);
      if (planObj && planObj.progress === 100) {
        onUpdatePlanProgress(planId, 80);
      }
    }
    setActiveMenuPlanId(null);
  };

  const handleProgressSliderChange = (id: string, value: number) => {
    onUpdatePlanProgress(id, value);
    if (value === 100) {
      onUpdatePlanStatus(id, "Hoàn thành");
    } else if (value < 100) {
      const planObj = plans.find(p => p.id === id);
      if (planObj && planObj.status === "Hoàn thành") {
        onUpdatePlanStatus(id, "Đang thực hiện");
      }
    }
  };

  const toggleActionMenu = (planId: string) => {
    if (activeMenuPlanId === planId) {
      setActiveMenuPlanId(null);
    } else {
      setActiveMenuPlanId(planId);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Plan Title,Creator,Status,Progress,Deadline\n";
    const rows = filteredPlans.map(p => 
      `"${p.id}","${p.title}","${p.creatorName}","${p.status}",${p.progress}%,"${p.deadline}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `planify_plans_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary Gradient Card Section */}
      <section className="bg-gradient-to-br from-[#2c4ed3] to-[#5445cf] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1.5">Quản lý kế hoạch</h3>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl">Xem và quản lý tất cả các kế hoạch được tạo bởi người dùng</p>
        </div>

        {/* Highlight Stats Grid inside Section verbatim to screenshot design layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Tổng kế hoạch</span>
              <div className="w-9 h-9 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#2c4ed3]" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              45,892
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Đang thực hiện</span>
              <div className="w-9 h-9 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#2c4ed3]" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              12,340
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Hoàn thành</span>
              <div className="w-9 h-9 bg-[#006a36]/10 text-[#006a36] rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#006a36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              28,450
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+22%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Quá hạn</span>
              <div className="w-9 h-9 bg-red-100/70 text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              1,024
            </div>
            <div className="flex items-center gap-1 text-[#ba1a1a] text-[11px] font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-5%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main interactive Table Card identical with screenshot specification */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#c4c5d7]/20 overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-[#1c1a27]">Danh sách kế hoạch</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Search Input bar */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444654] opacity-55" />
              <input 
                type="text"
                placeholder="Tìm kiếm kế hoạch..."
                value={localSearchText}
                onChange={(e) => setLocalSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#f6f1ff]/60 border-none rounded-xl text-xs sm:text-sm w-full sm:w-72 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none placeholder-[#444654]/50 text-[#1c1a27]"
              />
            </div>

            {/* Filter Toggle Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 border rounded-xl hover:bg-[#f6f1ff]/50 transition-all flex items-center gap-1.5 text-xs font-bold text-[#444654] cursor-pointer ${
                  filterStatus !== "ALL" ? "border-[#2c4ed3] text-[#2c4ed3] bg-[#2c4ed3]/5" : "border-[#c4c5d7]/30"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Bộ lọc</span>
              </button>
              
              {/* Dropdown status popup */}
              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute right-0 mt-2 bg-white rounded-2xl border border-[#c4c5d7]/20 shadow-xl p-4 z-30 min-w-[200px] space-y-2">
                    <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block mb-1">Theo trạng thái</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => { setFilterStatus(e.target.value as any); setShowFilterDropdown(false); }}
                      className="w-full bg-[#f0ebfe] text-[#1c1a27] font-semibold text-xs px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="Đang thực hiện">Đang thực hiện</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Quá hạn">Quá hạn</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Export List Button */}
            <button 
              onClick={handleExportCSV}
              className="p-2 border border-[#c4c5d7]/30 rounded-xl hover:bg-[#f6f1ff]/50 transition-all text-xs font-bold text-[#444654] cursor-pointer"
              title="Xuất kế hoạch CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add New Plan trigger */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-[#2c4ed3] text-white rounded-xl font-bold hover:bg-[#2c4ed3]/95 transition-all shadow-md shadow-[#2c4ed3]/10 text-xs sm:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* High Precision Table Content matching specification */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-[#fcf8ff] border-t border-b border-[#c4c5d7]/20">
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider">Kế hoạch</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider">Người tạo</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider w-48 text-center font-sans">Tiến độ</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center font-sans">Deadline</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d7]/20 bg-white">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#444654] font-medium opacity-60">
                    <Calendar className="w-8 h-8 text-[#2c4ed3] mx-auto mb-2" />
                    Không tìm thấy kế hoạch học tập hay công việc nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[#f6f1ff]/30 transition-colors group">
                    
                    {/* Plan name & tasks info */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#1c1a27] group-hover:text-[#2c4ed3] transition-colors">{plan.title}</p>
                        <p className="text-xs text-[#444654] opacity-70 mt-0.5">{plan.tasksText || "0/10 tasks"}</p>
                      </div>
                    </td>

                    {/* Creator display name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f0ebfe] text-[#2c4ed3] flex items-center justify-center font-bold text-[11px] shadow-sm">
                          {plan.creatorInitials || plan.creatorName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-[#1c1a27] text-xs sm:text-sm">{plan.creatorName}</span>
                      </div>
                    </td>

                    {/* Status badges mapped strictly with screenshot color scheme */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 font-bold rounded-full text-[10px] tracking-wide uppercase ${
                        plan.status === "Hoàn thành" 
                          ? "bg-[#006a36]/10 text-[#006a36]" 
                          : plan.status === "Quá hạn" 
                          ? "bg-red-50 text-[#ba1a1a]" 
                          : "bg-[#2c4ed3]/10 text-[#2c4ed3]"
                      }`}>
                        {plan.status}
                      </span>
                    </td>

                    {/* Interactive horizontal layout custom action progress bar */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 w-44 mx-auto">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#444654]">
                          <span>Tiến độ ({plan.progress}%)</span>
                        </div>
                        
                        <div className="h-2 bg-[#f0ebfe] rounded-full overflow-hidden relative">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              plan.status === "Hoàn thành" ? "bg-[#006a36]" : "bg-[#2c4ed3]"
                            }`}
                            style={{ width: `${plan.progress}%` }}
                          />
                        </div>

                        {/* Slide feedback directly on list hover */}
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          <Percent className="w-3 h-3 text-[#2c4ed3] shrink-0" />
                          <input 
                            type="range" 
                            min="0"
                            max="100"
                            value={plan.progress}
                            onChange={(e) => handleProgressSliderChange(plan.id, parseInt(e.target.value))}
                            className="w-full accent-[#2c4ed3] cursor-pointer h-1 bg-[#e5e0f3] rounded-lg appearance-none"
                            title="Điều chỉnh nhanh tiến độ"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Date strings */}
                    <td className="px-6 py-4 text-center text-xs text-[#1c1a27] font-semibold font-mono">
                      {plan.deadline}
                    </td>

                    {/* Inline actions menu popup matching design depth */}
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleActionMenu(plan.id)}
                        className="text-[#444654] hover:text-[#2c4ed3] transition-colors p-1.5 hover:bg-[#f6f1ff] rounded-lg cursor-pointer flex items-center justify-center"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Display floating list menu */}
                      {activeMenuPlanId === plan.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuPlanId(null)} />
                          <div className="absolute right-6 mt-1 w-48 bg-white border border-[#c4c5d7]/20 rounded-2xl shadow-xl p-3 z-30 space-y-1.5 text-left">
                            
                            <div className="text-[10px] font-bold text-[#444654] uppercase tracking-wider pb-1 border-b border-slate-100 mb-1">
                              Trạng thái thực tế
                            </div>
                            
                            <button 
                              onClick={() => handleUpdateStatusAndAdjustProgress(plan.id, "Đang thực hiện")}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-[#2c4ed3] flex items-center justify-between cursor-pointer"
                            >
                              <span>Đang thực hiện</span>
                              {plan.status === "Đang thực hiện" && <Check className="w-3.5 h-3.5 text-[#2c4ed3]" />}
                            </button>
                            
                            <button 
                              onClick={() => handleUpdateStatusAndAdjustProgress(plan.id, "Hoàn thành")}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-[#006a36] flex items-center justify-between cursor-pointer"
                            >
                              <span>Hoàn thành</span>
                              {plan.status === "Hoàn thành" && <Check className="w-3.5 h-3.5 text-[#006a36]" />}
                            </button>
                            
                            <button 
                              onClick={() => handleUpdateStatusAndAdjustProgress(plan.id, "Quá hạn")}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-[#ba1a1a] flex items-center justify-between cursor-pointer"
                            >
                              <span>Quá hạn</span>
                              {plan.status === "Quá hạn" && <Check className="w-3.5 h-3.5 text-[#ba1a1a]" />}
                            </button>

                            <div className="border-t border-slate-100 pt-1.5 mt-1.5">
                              <button 
                                onClick={() => { onDeletePlan(plan.id); setActiveMenuPlanId(null); }}
                                className="w-full text-left text-xs px-2.5 py-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                <span>Xóa kế hoạch</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination identical with screenshot */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center bg-[#fcf8ff]/20 gap-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm font-semibold text-[#444654] opacity-80">
            Hiển thị 1-{filteredPlans.length} của {plans.length} kế hoạch
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs text-[#444654] hover:text-[#2c4ed3] font-bold cursor-pointer">Trước</button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#2c4ed3] text-white rounded-lg font-bold text-xs cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#444654] hover:bg-[#ebe5f8] rounded-lg font-bold text-xs cursor-pointer">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#444654] hover:bg-[#ebe5f8] rounded-lg font-bold text-xs cursor-pointer">3</button>
            <button className="px-3 py-1.5 text-xs text-[#444654] hover:text-[#2c4ed3] font-bold cursor-pointer">Sau</button>
          </div>
        </div>
      </div>

      {/* Floating creation modal verbatim popup */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/30 backdrop-blur-sm z-[110]" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 shadow-2xl z-[120] animate-[scaleUp_0.2s_ease-out]">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c5d7]/20 mb-5">
              <h3 className="text-base font-black text-[#1c1a27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2c4ed3]" /> Khởi tạo kế hoạch mới
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-[#f6f1ff] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-[#444654]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Tên kế hoạch *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Xây dựng website bán hàng"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] placeholder-[#444654]/50 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Người tạo (Họ và tên) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyen Van A"
                  value={newCreator}
                  onChange={(e) => setNewCreator(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] placeholder-[#444654]/50 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654]">Deadline *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 15/03/2024"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs text-[#1c1a27] focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654]">Tổng số việc (tasks)</label>
                  <input
                    type="number"
                    min="1"
                    value={totalTasks}
                    onChange={(e) => setTotalTasks(parseInt(e.target.value) || 20)}
                    className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs text-[#1c1a27] focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654]">Trạng thái</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#f0ebfe] border-none px-3 py-2.5 rounded-xl text-xs text-[#1c1a27] font-semibold focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                  >
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Quá hạn">Quá hạn</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654] block mb-1">Tiến độ (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => {
                      const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setNewProgress(v);
                      if (v === 100) setNewStatus("Hoàn thành");
                      else if (newStatus === "Hoàn thành") setNewStatus("Đang thực hiện");
                    }}
                    className="w-full bg-[#f0ebfe] border-none px-4 py-2 rounded-xl text-xs text-[#1c1a27] font-semibold focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 mt-6 select-none font-sans">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#444654] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2c4ed3] hover:bg-[#2c4ed3]/95 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#2c4ed3]/10 transition-all cursor-pointer"
                >
                  Tạo kế hoạch
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
