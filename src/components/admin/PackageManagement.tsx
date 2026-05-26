import React, { useState } from "react";
import { 
  Sparkles, 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  CheckCircle2, 
  Users, 
  Package,
  Search,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { PricingPackage } from "../../types";

interface PackageManagementProps {
  packages: PricingPackage[];
  onAddPackage: (pkg: Omit<PricingPackage, "id">) => void;
  onDeletePackage: (id: string) => void;
  onUpdatePackageStatus: (id: string, status: "Hoạt động" | "Tạm dừng") => void;
  onUpdatePackageDetails: (id: string, updated: Partial<PricingPackage>) => void;
  searchQuery: string;
}

export default function PackageManagement({
  packages,
  onAddPackage,
  onDeletePackage,
  onUpdatePackageStatus,
  onUpdatePackageDetails,
  searchQuery
}: PackageManagementProps) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PricingPackage | null>(null);
  
  // Local search input state to combine with sidebar search of needed
  const [localSearch, setLocalSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states (double mapped as add/edit fields)
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("1 tháng");
  const [features, setFeatures] = useState("");
  const [status, setStatus] = useState<"Hoạt động" | "Tạm dừng">("Hoạt động");

  // Filtering packages based on combined standard searchQuery & localSearch state
  const filteredPkgs = packages.filter(p => {
    const combinedQuery = (searchQuery || localSearch).toLowerCase().trim();
    return (
      combinedQuery === "" ||
      p.name.toLowerCase().includes(combinedQuery) ||
      p.code.toLowerCase().includes(combinedQuery) ||
      p.features.toLowerCase().includes(combinedQuery)
    );
  });

  // Pagination calculation
  const totalItems = filteredPkgs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPkgs = filteredPkgs.slice(startIndex, startIndex + itemsPerPage);

  // Dynamic statistics
  const totalCount = packages.length;
  const activeCount = packages.filter(p => p.status === "Hoạt động").length;
  const totalUsers = packages.reduce((acc, p) => acc + p.usersCount, 0);

  const handleOpenEdit = (pkg: PricingPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setCode(pkg.code);
    setPrice(pkg.price);
    setDuration(pkg.duration);
    setFeatures(pkg.features);
    setStatus(pkg.status);
    setShowAddModal(true);
  };

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setName("");
    setCode(`PKG00${packages.length + 1}`);
    setPrice("199,000đ");
    setDuration("1 tháng");
    setFeatures("AI thông minh, Không giới hạn tasks, Thống kê biểu đồ");
    setStatus("Hoạt động");
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !price.trim()) return;

    if (editingPkg) {
      onUpdatePackageDetails(editingPkg.id, {
        name,
        code,
        price,
        duration,
        features,
        status
      });
      setEditingPkg(null);
      setShowAddModal(false);
    } else {
      onAddPackage({
        name,
        code,
        price,
        duration,
        features,
        status,
        usersCount: 0
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
      
      {/* 1. Summary Header Card inside main-gradient with embedding statistics matching guidelines strictly */}
      <section className="bg-gradient-to-br from-[#4969ed] to-[#2c4ed3] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm select-none">
        
        {/* Abstract Background Ornaments */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-32 h-32 bg-[#5445cf]/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <h3 className="font-headline-lg text-headline-lg text-white mb-1">Gói giao dịch</h3>
            <p className="font-body-md text-white/80">Quản lý các gói dịch vụ trên nền tảng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#1c1a27]">
            
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="font-label-md text-label-md text-on-surface-variant mb-2">Tổng số gói</p>
                <span className="text-primary bg-primary/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-on-surface font-black">
                  {totalCount}
                </span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="font-label-md text-label-md text-on-surface-variant mb-2">Gói đang hoạt động</p>
                <span className="text-tertiary bg-tertiary/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#006a36]" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-on-surface font-black">
                  {activeCount}
                </span>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="flex justify-between items-start">
                <p className="font-label-md text-label-md text-on-surface-variant mb-2">Tổng người dùng</p>
                <span className="text-secondary bg-[#5445cf]/10 p-2 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#5445cf]" />
                </span>
              </div>
              <div className="flex items-end justify-between mt-2">
                <span className="font-stat-number text-stat-number text-on-surface font-black">
                  {totalUsers.toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Table Section styling matching planify mockup */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/30 min-h-[500px]">
        
        {/* Responsive Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Danh sách gói</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant shrink-0">
                <Search className="w-4 h-4" />
              </span>
              <input 
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#f0ebfe] border-none rounded-lg pl-9 pr-4 py-2 text-body-sm focus:ring-2 focus:ring-primary w-64 transition-all outline-none text-on-surface placeholder-on-surface-variant/40" 
                placeholder="Tìm kiếm gói..." 
                type="text"
              />
            </div>

            <button 
              onClick={handleOpenAdd}
              className="bg-primary hover:bg-[#1a3ec0] text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer text-body-sm shrink-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Thêm gói mới</span>
            </button>
          </div>
        </div>

        {/* Dense content data table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-on-surface-variant border-b border-outline-variant">
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Mã gói</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Tên gói</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Giá</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Thời hạn</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Tính năng</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Trạng thái</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider">Người dùng</th>
                <th className="pb-4 px-4 font-label-md text-label-md uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {paginatedPkgs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-on-surface-variant/65">
                    <Package className="w-12 h-12 text-[#2c4ed3]/40 mx-auto mb-4" />
                    <p className="text-sm font-semibold">Không tìm thấy thông tin gói cước.</p>
                    <p className="text-xs text-on-surface-variant/50 mt-1">Vui lòng rà soát ký tự tìm lọc trong hộp tìm kiếm.</p>
                  </td>
                </tr>
              ) : (
                paginatedPkgs.map((pkg) => {
                  const isActive = pkg.status === "Hoạt động";
                  return (
                    <tr key={pkg.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-4 px-4 font-body-sm text-body-sm font-semibold text-on-surface">{pkg.code}</td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface font-semibold">{pkg.name}</td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface font-medium">{pkg.price}</td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant">{pkg.duration}</td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant max-w-xs truncate" title={pkg.features}>
                        {pkg.features}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full font-label-md text-[11px] font-bold ${
                          isActive 
                            ? "bg-[#008646]/15 text-[#006a36]" 
                            : "bg-[#c4c5d7]/30 text-on-surface-variant"
                        }`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm font-medium text-on-surface">{pkg.usersCount?.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 select-none">
                          
                          <button 
                            onClick={() => handleOpenEdit(pkg)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-[#2c4ed3]/5 rounded-lg transition-all cursor-pointer"
                            title="Hiệu chỉnh thông tin gói"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>

                          <button 
                            onClick={() => onDeletePackage(pkg.id)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all cursor-pointer"
                            title="Xóa gói dịch vụ"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with dynamic pagination matching visual design perfectly */}
        <div className="mt-8 flex items-center justify-between border-t border-outline-variant/30 pt-6 select-none">
          <p className="text-label-md text-on-surface-variant text-[13px]">
            Hiển thị <span className="font-bold">{totalItems === 0 ? 0 : startIndex + 1}</span> - <span className="font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> trên <span className="font-bold">{totalItems}</span> gói dịch vụ
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, pIdx) => {
              const pageNum = pIdx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs transition-all cursor-pointer ${
                    currentPage === pageNum 
                      ? "bg-primary text-white shadow-sm" 
                      : "border border-outline-variant hover:bg-surface-container text-[#444654]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 3. Popover drawer dialogue modal to ADD or EDIT Pricing Package */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-[#1c1a27]/50 backdrop-blur-sm z-[110]" onClick={() => { setShowAddModal(false); setEditingPkg(null); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl border border-[#c4c5d7]/30 p-6 sm:p-8 shadow-2xl z-[120] animate-[scaleUp_0.15s_ease-out]">
            
            <div className="flex justify-between items-center pb-4 border-b border-[#c4c5d7]/20 mb-5 select-none">
              <h3 className="text-base sm:text-lg font-black text-[#1c1a27] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0" />
                <span>{editingPkg ? "Hiệu chỉnh thông tin Gói" : "Khởi tạo Gói cước mới"}</span>
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingPkg(null); }}
                className="p-1.5 hover:bg-surface-container-low rounded-lg cursor-pointer text-on-surface-variant"
              >
                <X className="w-5 h-5 animate-spin-once" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444654]">Tên gói cước *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Pro Plus, Premium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] placeholder-[#444654]/55 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444654]">Mã gói cước *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: PKG003"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444654]">Giá trị bằng VND *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 199,000đ"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#444654]">Chu kỳ thanh toán</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white border border-outline-variant/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] font-semibold focus:ring-1 focus:ring-primary cursor-pointer select-none"
                  >
                    <option value="1 tháng">1 tháng (Monthly)</option>
                    <option value="1 năm">1 năm (Yearly)</option>
                    <option value="Vĩnh viễn">Vĩnh viễn (Lifetime)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654]">Hạn mức và đặc quyền (Cách nhau bởi dấu phẩy)*</label>
                <textarea
                  required
                  rows={3}
                  placeholder="AI nâng cao, 100 kế hoạch, Xuất file excel..."
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full bg-[#f0ebfe]/40 border border-outline-variant/40 focus:border-primary px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] placeholder-[#444654]/55 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#444654]">Trạng thái phân phối</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-white border border-outline-variant/40 px-3 py-2.5 rounded-xl text-xs sm:text-sm text-[#1c1a27] font-semibold focus:ring-1 focus:ring-primary cursor-pointer select-none"
                >
                  <option value="Hoạt động">Mở phát hành (Hoạt động)</option>
                  <option value="Tạm dừng">Tạm ngắt bán (Tạm dừng)</option>
                </select>
              </div>

              <div className="text-[11px] text-on-surface-variant/80 flex items-center gap-1.5 leading-relaxed pt-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Thông tin cập nhật gói sẽ hiển thị tức thì trên bảng giá người dùng và có hiệu lực ngay khi mua gói.</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#c4c5d7]/20 mt-6 select-none">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingPkg(null); }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-[#e4dfff]/60 text-[#444654] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-[#1a3ec0] text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{editingPkg ? "Lưu thay đổi" : "Xuất bản mới"}</span>
                </button>
              </div>

            </form>
          </div>
        </>
      )}

    </div>
  );
}
