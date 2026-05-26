import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
   
  UserX, 
  Trash2, 
  Search, 
  X, 
  Sparkles, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Check, 
  ShieldCheck,
  Plus
} from "lucide-react";
import { User } from "../../types";

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, "id" | "lastActive">) => void;
  onDeleteUser: (id: string) => void;
  onUpdateUserStatus: (id: string, status: "Hoạt động" | "Không hoạt động" | "Đã khóa") => void;
  onUpdateUserPackage: (id: string, tier: "FREE" | "PRO" | "ENTERPRISE") => void;
  searchQuery: string;
}

export default function UserManagement({ 
  users, 
  onAddUser, 
  onDeleteUser, 
  onUpdateUserStatus, 
  onUpdateUserPackage,
  searchQuery 
}: UserManagementProps) {
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterPackage, setFilterPackage] = useState<"ALL" | "FREE" | "PRO" | "ENTERPRISE">("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "Hoạt động" | "Không hoạt động" | "Đã khóa">("ALL");
  const [localSearchText, setLocalSearchText] = useState("");
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPackage, setNewPackage] = useState<"FREE" | "PRO" | "ENTERPRISE">("FREE");
  const [newStatus, setNewStatus] = useState<"Hoạt động" | "Không hoạt động" | "Đã khóa">("Hoạt động");

  // Filters combined
  const filteredUsers = users.filter(user => {
    const finalQuery = (localSearchText || searchQuery || "").toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(finalQuery) ||
      user.email.toLowerCase().includes(finalQuery);
    
    const matchesPackage = filterPackage === "ALL" || user.package === filterPackage;
    const matchesStatus = filterStatus === "ALL" || user.status === filterStatus;

    return matchesSearch && matchesPackage && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Status,Package,Plans,Tasks,Last Active\n";
    const rows = filteredUsers.map(u => 
      `"${u.id}","${u.name}","${u.email}","${u.status}","${u.package}",${u.plansCount},${u.tasksCount},"${u.lastActive}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `planify_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    // Derive initials
    const nameParts = newName.trim().split(" ");
    const initials = nameParts.length === 1 
      ? nameParts[0].substring(0, 2).toUpperCase() 
      : (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();

    onAddUser({
      name: newName,
      email: newEmail,
      initials: initials,
      status: newStatus,
      package: newPackage,
      plansCount: 0,
      tasksCount: 0
    });

    // Reset Form & Close
    setNewName("");
    setNewEmail("");
    setNewPackage("FREE");
    setNewStatus("Hoạt động");
    setShowAddModal(false);
  };

  const toggleActionMenu = (userId: string) => {
    if (activeMenuUserId === userId) {
      setActiveMenuUserId(null);
    } else {
      setActiveMenuUserId(userId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Dashboard Hero Banner matching design guidelines */}
      <section className="bg-gradient-to-br from-[#2c4ed3] to-[#5445cf] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1.5">Quản lý người dùng</h3>
          <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl">Xem và quản lý tất cả người dùng trên nền tảng</p>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Tổng người dùng</span>
              <div className="w-9 h-9 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              12,458
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.5%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Người dùng mới (tháng)</span>
              <div className="w-9 h-9 bg-[#006a36]/10 text-[#006a36] rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              1,234
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
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Đang hoạt động</span>
              <div className="w-9 h-9 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              8,942
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all hover:-translate-y-1 duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-[#444654] uppercase tracking-wider">Đã khóa</span>
              <div className="w-9 h-9 bg-red-100/70 text-[#ba1a1a] rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-[28px] font-black text-[#1c1a27] mb-1.5 leading-none font-sans">
              156
            </div>
            <div className="flex items-center gap-1 text-[#ba1a1a] text-[11px] font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-3%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main interactive Table Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#c4c5d7]/20 overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-[#1c1a27]">Quản lý người dùng</h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Search inputs */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444654] opacity-55" />
              <input 
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={localSearchText}
                onChange={(e) => setLocalSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#f6f1ff]/60 border-none rounded-xl text-xs sm:text-sm w-full sm:w-64 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none placeholder-[#444654]/50 text-[#1c1a27]"
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2 border rounded-xl hover:bg-[#f6f1ff]/50 transition-all flex items-center gap-1.5 text-xs font-bold text-[#444654] cursor-pointer ${
                  filterPackage !== "ALL" || filterStatus !== "ALL" ? "border-[#2c4ed3] text-[#2c4ed3] bg-[#2c4ed3]/5" : "border-[#c4c5d7]/30"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Bộ lọc</span>
              </button>
              
              {/* Dropdown popup */}
              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute right-0 mt-2 bg-white rounded-2xl border border-[#c4c5d7]/20 shadow-xl p-4 z-30 min-w-[210px] space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block">Theo gói</label>
                      <select
                        value={filterPackage}
                        onChange={(e) => setFilterPackage(e.target.value as any)}
                        className="w-full bg-[#f0ebfe] text-[#1c1a27] font-semibold text-xs px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">Tất cả các gói</option>
                        <option value="FREE">Gói FREE</option>
                        <option value="PRO">Gói PRO</option>
                        <option value="ENTERPRISE">Gói ENTERPRISE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block">Theo trạng thái</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="w-full bg-[#f0ebfe] text-[#1c1a27] font-semibold text-xs px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                      >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Không hoạt động">Không hoạt động</option>
                        <option value="Đã khóa">Đã khóa</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Export list button */}
            <button 
              onClick={handleExportCSV}
              className="p-2 border border-[#c4c5d7]/30 rounded-xl hover:bg-[#f6f1ff]/50 transition-all text-xs font-bold text-[#444654] cursor-pointer"
              title="Xuất bảng dữ liệu"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add User trigger */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-[#2c4ed3] text-white rounded-xl font-bold hover:bg-[#2c4ed3]/95 transition-all shadow-md shadow-[#2c4ed3]/10 text-xs sm:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* Responsive Table UI */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-[#fcf8ff] border-t border-b border-[#c4c5d7]/20">
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider">NGƯỜI DÙNG</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">TRẠNG THÁI</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">GÓI</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">KẾ HOẠCH</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">TASKS</th>
                <th className="px-6 py-4 font-bold text-[11px] text-[#444654] uppercase tracking-wider text-center">HOẠT ĐỘNG</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d7]/20 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#444654] font-medium opacity-60">
                    <Users className="w-8 h-8 text-[#2c4ed3] mx-auto mb-2" />
                    Không tìm thấy thành viên phù hợp với bộ lọc hiển thị.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f6f1ff]/30 transition-colors group">
                    
                    {/* User display name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f0ebfe] text-[#2c4ed3] flex items-center justify-center font-bold text-xs shadow-sm">
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[#1c1a27] group-hover:text-[#2c4ed3] transition-colors">{user.name}</p>
                          <p className="text-xs text-[#444654] opacity-70">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status badge pill style mapped verbatim to screenshot */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 font-bold rounded-full text-[10px] tracking-wide uppercase ${
                        user.status === "Hoạt động" 
                          ? "bg-[#006a36]/10 text-[#006a36]" 
                          : user.status === "Đã khóa" 
                          ? "bg-red-50 text-[#ba1a1a]" 
                          : "bg-slate-100 text-[#444654]"
                      }`}>
                        {user.status === "Hoạt động" ? "HOẠT ĐỘNG" : user.status === "Đã khóa" ? "ĐÃ KHÓA" : "KHÔNG HOẠT ĐỘNG"}
                      </span>
                    </td>

                    {/* Package tier badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 font-extrabold rounded-full text-[10px] tracking-wider uppercase ${
                        user.package === "ENTERPRISE" 
                          ? "bg-[#fff8e1] text-amber-600" 
                          : user.package === "PRO" 
                          ? "bg-[#2c4ed3]/10 text-[#2c4ed3]" 
                          : "bg-[#ebe5f8] text-[#5445cf]"
                      }`}>
                        {user.package}
                      </span>
                    </td>

                    {/* Plans count */}
                    <td className="px-6 py-4 text-center font-bold text-[#1c1a27]">
                      {user.plansCount}
                    </td>

                    {/* Tasks count */}
                    <td className="px-6 py-4 text-center font-bold text-[#1c1a27]">
                      {user.tasksCount}
                    </td>

                    {/* Last active status */}
                    <td className="px-6 py-4 text-center text-xs text-[#444654] opacity-70">
                      {user.lastActive}
                    </td>

                    {/* Action popup selector trigger button */}
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleActionMenu(user.id)}
                        className="text-[#444654] hover:text-[#2c4ed3] transition-colors p-1.5 hover:bg-[#f6f1ff] rounded-lg cursor-pointer flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Float absolute contextual action menu */}
                      {activeMenuUserId === user.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuUserId(null)} />
                          <div className="absolute right-6 mt-1 w-48 bg-white border border-[#c4c5d7]/20 rounded-2xl shadow-xl p-3 z-30 space-y-2 text-left">
                            
                            <div className="text-[10px] font-bold text-[#444654] uppercase tracking-wider pb-1 border-b border-slate-100 mb-1">
                              Chuyển trạng thái
                            </div>
                            <button 
                              onClick={() => { onUpdateUserStatus(user.id, "Hoạt động"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-medium text-[#006a36] flex items-center justify-between cursor-pointer"
                            >
                              <span>Hoạt động</span>
                              {user.status === "Hoạt động" && <Check className="w-3.5 h-3.5 text-[#006a36]" />}
                            </button>
                            <button 
                              onClick={() => { onUpdateUserStatus(user.id, "Không hoạt động"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-medium text-[#444654] flex items-center justify-between cursor-pointer"
                            >
                              <span>Không hoạt động</span>
                              {user.status === "Không hoạt động" && <Check className="w-3.5 h-3.5 text-[#444654]" />}
                            </button>
                            <button 
                              onClick={() => { onUpdateUserStatus(user.id, "Đã khóa"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-medium text-[#ba1a1a] flex items-center justify-between cursor-pointer"
                            >
                              <span>Đã khóa</span>
                              {user.status === "Đã khóa" && <Check className="w-3.5 h-3.5 text-[#ba1a1a]" />}
                            </button>

                            <div className="text-[10px] font-bold text-[#444654] uppercase tracking-wider pb-1 border-b border-slate-100 pt-2 mb-1">
                              Nâng/hạ gói
                            </div>
                            <button 
                              onClick={() => { onUpdateUserPackage(user.id, "FREE"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-[#5445cf] flex items-center justify-between cursor-pointer"
                            >
                              <span>Gói FREE</span>
                              {user.package === "FREE" && <Check className="w-3.5 h-3.5 text-[#5445cf]" />}
                            </button>
                            <button 
                              onClick={() => { onUpdateUserPackage(user.id, "PRO"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-[#2c4ed3] flex items-center justify-between cursor-pointer"
                            >
                              <span>Gói PRO</span>
                              {user.package === "PRO" && <Check className="w-3.5 h-3.5 text-[#2c4ed3]" />}
                            </button>
                            <button 
                              onClick={() => { onUpdateUserPackage(user.id, "ENTERPRISE"); setActiveMenuUserId(null); }}
                              className="w-full text-left text-xs px-2.5 py-1.5 hover:bg-[#f6f1ff] rounded-lg font-bold text-amber-600 flex items-center justify-between cursor-pointer"
                            >
                              <span>Gói ENTERPRISE</span>
                              {user.package === "ENTERPRISE" && <Check className="w-3.5 h-3.5 text-amber-600" />}
                            </button>

                            <div className="border-t border-slate-100 pt-1.5 mt-1.5">
                              <button 
                                onClick={() => { onDeleteUser(user.id); setActiveMenuUserId(null); }}
                                className="w-full text-left text-xs px-2.5 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                <span>Xóa người dùng</span>
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

        {/* Elegant Pagination Component conforming strictly with the layout styles */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-center bg-[#fcf8ff]/20 gap-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm font-semibold text-[#444654] opacity-80">
            Hiển thị 1-{filteredUsers.length} của {users.length} người dùng
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

      {/* Adding Users Floating Drawer-Style Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/30 backdrop-blur-sm z-[110]" onClick={() => setShowAddModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 shadow-2xl z-[120] animate-[scaleUp_0.2s_ease-out]">
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c5d7]/20 mb-5">
              <h3 className="text-base font-black text-[#1c1a27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2c4ed3]" /> Đăng ký người dùng mới
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
                <label className="text-xs font-bold text-[#444654]">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyen Van A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] placeholder-[#444654]/50 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#444654]">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#f0ebfe] border-none px-4 py-2.5 rounded-xl text-xs text-[#1c1a27] placeholder-[#444654]/50 focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654]">Cấp độ tài khoản</label>
                  <select
                    value={newPackage}
                    onChange={(e) => setNewPackage(e.target.value as any)}
                    className="w-full bg-[#f0ebfe] border-none px-3 py-2.5 rounded-xl text-xs text-[#1c1a27] font-semibold focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#444654]">Trạng thái ban đầu</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#f0ebfe] border-none px-3 py-2.5 rounded-xl text-xs text-[#1c1a27] font-semibold focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none cursor-pointer"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Đã khóa">Đã khóa</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 mt-6">
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
                  Xác nhận lưu
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
