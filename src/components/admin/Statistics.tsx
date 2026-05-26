import * as React from "react";
import { useState, useEffect } from "react";
import { 
  BarChart2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Compass, 
  TrendingUp, 
  LineChart,
  Zap,
  Globe,
  Wifi,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  Sliders,
  Activity,
  AlertTriangle,
  MapPin,
  Check,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const Chrome = Globe;

interface BrowserStat {
  name: string;
  icon: any;
  pct: number;
  users: number;
  color: string;
}

interface PopularPage {
  path: string;
  views: number;
  bounce: number;
}

// Bọc an toàn các Icon của lucide-react để không bao giờ bị lỗi 'type is invalid' trắng trang trong browser
function SafeIcon({ icon, fallback = Globe, className }: { icon: any; fallback?: any; className?: string }) {
  const Component = (typeof icon === "function" || typeof icon === "object") && icon !== null ? icon : fallback;
  return <Component className={className} />;
}

// Error Boundary to prevent white screen and catch any render time errors
class StatisticsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Lỗi xảy ra trong trang Thống kê:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-[2rem] text-sm text-[#ba1a1a] max-w-4xl mx-auto my-10 shadow-lg">
          <div className="flex items-center gap-3 mb-4 text-red-700">
            <AlertTriangle className="w-8 h-8 shrink-0 text-red-600" />
            <div>
              <h2 className="text-lg font-black tracking-tight">Đã xảy ra lỗi khi tải trang Thống kê!</h2>
              <p className="text-xs opacity-80 font-medium">Lỗi này xảy ra do một sự cố không mong muốn trong lúc dựng giao diện (Render) hoặc nạp dữ liệu thống kê.</p>
            </div>
          </div>
          
          <div className="bg-white/90 border border-red-100 rounded-2xl p-4 mb-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">Mô tả chi tiết lỗi (Error Message)</div>
            <p className="font-mono text-xs font-bold text-[#1c1a27] select-all">
              {this.state.error?.toString()}
            </p>
          </div>

          <div className="bg-[#1e1e2e] border border-slate-950 text-[#cdd6f4] rounded-2xl p-4 overflow-auto max-h-72 font-mono text-[10px] leading-relaxed">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 select-none">Mã vết xếp chồng (Stack Trace)</div>
            <pre className="whitespace-pre select-all">
              {this.state.error?.stack}
            </pre>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              className="px-5 py-2.5 bg-[#ba1a1a] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md cursor-pointer"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Nạp lại trang Thống kê
            </button>
            <button 
              type="button"
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              onClick={() => { window.location.reload(); }}
            >
              Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Statistics() {
  return (
    <StatisticsErrorBoundary>
      <StatisticsContent />
    </StatisticsErrorBoundary>
  );
}

function StatisticsContent() {
  // 1. Time range selections
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "6m">("6m");
  
  // 2. Active simulation controllers
  const [liveUsersCount, setLiveUsersCount] = useState(2458);
  const [isSimulatingTraffic, setIsSimulatingTraffic] = useState(false);
  const [latencyMultiplier, setLatencyMultiplier] = useState(1.0);
  
  // 3. Browser Distribution state with searchable & sorting filters
  const [browserSearch, setBrowserSearch] = useState("");
  const [browserSortColumn, setBrowserSortColumn] = useState<"name" | "pct" | "users">("pct");
  const [browserSortDirection, setBrowserSortDirection] = useState<"asc" | "desc">("desc");

  // Dynamic Browser Data
  const [browsers, setBrowsers] = useState<BrowserStat[]>([
    { name: "Google Chrome", icon: Chrome, pct: 54.2, users: 6750, color: "bg-[#2c4ed3]" },
    { name: "Safari (iOS/macOS)", icon: Compass, pct: 28.5, users: 3550, color: "bg-purple-600" },
    { name: "Firefox Browser", icon: Globe, pct: 11.3, users: 1408, color: "bg-orange-500" },
    { name: "Microsoft Edge", icon: Monitor, pct: 6.0, users: 750, color: "bg-blue-400" },
  ]);

  // 4. Interactive Device Proportions
  const [desktopPct, setDesktopPct] = useState(68.5);
  const [mobilePct, setMobilePct] = useState(28.3);
  const [tabletPct, setTabletPct] = useState(3.2);

  // 5. Popular monitored routes manager
  const [pagesSearch, setPagesSearch] = useState("");
  const [popularPages, setPopularPages] = useState<PopularPage[]>([
    { path: "/dashboard", views: 45678, bounce: 12 },
    { path: "/plans/create", views: 23456, bounce: 18 },
    { path: "/profile", views: 12345, bounce: 25 },
    { path: "/billing", views: 8901, bounce: 15 },
    { path: "/settings", views: 6789, bounce: 30 }
  ]);
  const [newPath, setNewPath] = useState("");
  const [newViews, setNewViews] = useState(5000);
  const [newBounce, setNewBounce] = useState(20);
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);
  const [routeSortColumn, setRouteSortColumn] = useState<"path" | "views" | "bounce">("views");
  const [routeSortDirection, setRouteSortDirection] = useState<"asc" | "desc">("desc");

  // 6. Selected graph point interactive info
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(4);

  // Traffic fluctuations simulation interval
  useEffect(() => {
    let interval: any = null;
    if (isSimulatingTraffic) {
      interval = setInterval(() => {
        setLiveUsersCount(prev => {
          const shift = Math.floor(Math.random() * 80) - 40;
          const next = prev + shift;
          return next < 1000 ? 1000 : next > 5000 ? 4000 : next;
        });
      }, 2500);
    } else {
      setLiveUsersCount(2458);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingTraffic]);

  // Handle Latency calculation based on slide multiplier
  const getNodeLatency = (baseMs: number) => {
    return Math.round(baseMs * latencyMultiplier);
  };

  // Safe percentage helper for Devices
  const handleDeviceChange = (type: "desktop" | "mobile" | "tablet", val: number) => {
    const formattedVal = parseFloat(val.toFixed(1));
    if (type === "desktop") {
      setDesktopPct(formattedVal);
      // distribute remaining 100-val between mobile & tablet proportionally
      const remaining = 100 - formattedVal;
      const factor = mobilePct + tabletPct > 0 ? mobilePct / (mobilePct + tabletPct) : 0.8;
      setMobilePct(parseFloat((remaining * factor).toFixed(1)));
      setTabletPct(parseFloat((remaining * (1 - factor)).toFixed(1)));
    } else if (type === "mobile") {
      setMobilePct(formattedVal);
      const remaining = 100 - formattedVal;
      const factor = desktopPct + tabletPct > 0 ? desktopPct / (desktopPct + tabletPct) : 0.9;
      setDesktopPct(parseFloat((remaining * factor).toFixed(1)));
      setTabletPct(parseFloat((remaining * (1 - factor)).toFixed(1)));
    } else {
      setTabletPct(formattedVal);
      const remaining = 100 - formattedVal;
      const factor = desktopPct + mobilePct > 0 ? desktopPct / (desktopPct + mobilePct) : 0.7;
      setDesktopPct(parseFloat((remaining * factor).toFixed(1)));
      setMobilePct(parseFloat((remaining * (1 - factor)).toFixed(1)));
    }
  };

  // Browser list filters & sorts
  const safeBrowsers = browsers || [];
  const filteredAndSortedBrowsers = safeBrowsers
    .filter(b => b && b.name && b.name.toLowerCase().includes((browserSearch || "").toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (browserSortColumn === "name") {
        comparison = (a.name || "").localeCompare(b.name || "");
      } else if (browserSortColumn === "pct") {
        comparison = (a.pct || 0) - (b.pct || 0);
      } else {
        comparison = (a.users || 0) - (b.users || 0);
      }
      return browserSortDirection === "asc" ? comparison : -comparison;
    });

  const toggleBrowserSort = (column: "name" | "pct" | "users") => {
    if (browserSortColumn === column) {
      setBrowserSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setBrowserSortColumn(column);
      setBrowserSortDirection("desc");
    }
  };

  // Popular routes sorting & filter
  const safePopularPages = popularPages || [];
  const filteredAndSortedPages = safePopularPages
    .filter(p => p && p.path && p.path.toLowerCase().includes((pagesSearch || "").toLowerCase()))
    .sort((a, b) => {
      let elem = 0;
      if (routeSortColumn === "path") {
        elem = (a.path || "").localeCompare(b.path || "");
      } else if (routeSortColumn === "views") {
        elem = (a.views || 0) - (b.views || 0);
      } else {
        elem = (a.bounce || 0) - (b.bounce || 0);
      }
      return routeSortDirection === "asc" ? elem : -elem;
    });

  const toggleRouteSort = (col: "path" | "views" | "bounce") => {
    if (routeSortColumn === col) {
      setRouteSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setRouteSortColumn(col);
      setRouteSortDirection("desc");
    }
  };

  // Add route submission
  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim()) return;
    
    // Formatting safety: make sure starts with a slash
    let formattedPath = newPath.trim();
    if (!formattedPath.startsWith("/")) {
      formattedPath = "/" + formattedPath;
    }

    if (popularPages.some(p => p.path.toLowerCase() === formattedPath.toLowerCase())) {
      alert("Đường dẫn này hiện đã được giám sát!");
      return;
    }

    setPopularPages([...popularPages, {
      path: formattedPath,
      views: newViews,
      bounce: newBounce
    }]);

    setNewPath("");
    setNewViews(5000);
    setNewBounce(22);
    setShowAddRouteForm(false);
  };

  // Clear page tracking
  const handleDeleteRoute = (path: string) => {
    setPopularPages(popularPages.filter(p => p.path !== path));
  };

  // Graph Data points configuration mapped dynamically by Time Range
  const graphDataSets = {
    "24h": {
      points: [
        { x: 5, y: 40, label: "00:00", val: "12,450 lượt", status: "Bình yên" },
        { x: 24, y: 32, label: "06:00", val: "45,890 lượt", status: "Bình yên" },
        { x: 43, y: 36, label: "12:00", val: "38,210 lượt", status: "Khá bận" },
        { x: 62, y: 15, label: "18:00", val: "95,430 lượt", status: "Tập trung cao" },
        { x: 81, y: 8, label: "21:00", val: "156,789 lượt", status: "Đỉnh điểm tải" },
        { x: 100, y: 22, label: "23:59", val: "124,100 lượt", status: "Bình yên" }
      ],
      path: "M 5 40 Q 24 32 43 36 T 62 15 T 81 8 T 100 22",
      fillPath: "M 5 40 Q 24 32 43 36 T 62 15 T 81 8 T 100 22 L 100 50 L 5 50 Z"
    },
    "7d": {
      points: [
        { x: 5, y: 43, label: "T2", val: "145,820 lượt", status: "Bình thản" },
        { x: 24, y: 25, label: "T3", val: "210,400 lượt", status: "Bình thản" },
        { x: 43, y: 30, label: "T4", val: "192,200 lượt", status: "Bình thản" },
        { x: 62, y: 12, label: "T5", val: "310,210 lượt", status: "Cao điểm" },
        { x: 81, y: 9, label: "T6", val: "380,450 lượt", status: "Đỉnh điểm tuần" },
        { x: 100, y: 18, label: "CN", val: "290,011 lượt", status: "Bình thản" }
      ],
      path: "M 5 43 Q 24 25 43 30 T 62 12 T 81 9 T 100 18",
      fillPath: "M 5 43 Q 24 25 43 30 T 62 12 T 81 9 T 100 18 L 100 50 L 5 50 Z"
    },
    "30d": {
      points: [
        { x: 5, y: 38, label: "Tuần 1", val: "1,204,500 lượt", status: "Ổn định" },
        { x: 36, y: 20, label: "Tuần 2", val: "2,010,480 lượt", status: "Đạt mốc" },
        { x: 68, y: 28, label: "Tuần 3", val: "1,689,010 lượt", status: "Ổn định" },
        { x: 100, y: 6, label: "Tuần 4", val: "3,140,580 lượt", status: "Tăng trưởng vọt" }
      ],
      path: "M 5 38 Q 36 20 68 28 T 100 6",
      fillPath: "M 5 38 Q 36 20 68 28 T 100 6 L 100 50 L 5 50 Z"
    },
    "6m": {
      points: [
        { x: 5, y: 44, label: "Thg 1", val: "542,000 lượt", status: "Khởi động" },
        { x: 24, y: 38, label: "Thg 2", val: "780,450 lượt", status: "Ổn định" },
        { x: 43, y: 35, label: "Thg 3", val: "1,120,400 lượt", status: "Ổn định" },
        { x: 62, y: 18, label: "Thg 4", val: "1,940,020 lượt", status: "Phát triển" },
        { x: 81, y: 8, label: "Thg 5", val: "2,840,410 lượt", status: "Gia tốc mạnh" },
        { x: 100, y: 12, label: "Thg 6", val: "3,592,440 lượt", status: "Đạt cực đại" }
      ],
      path: "M 5 44 Q 24 38 43 35 T 62 18 T 81 8 T 100 12",
      fillPath: "M 5 44 Q 24 38 43 35 T 62 18 T 81 8 T 100 12 L 100 50 L 5 50 Z"
    }
  };

  const currentDataset = graphDataSets[timeRange] || graphDataSets["6m"];
  const activeSelectedPoint = selectedPointIdx !== null && currentDataset && currentDataset.points && currentDataset.points[selectedPointIdx] 
    ? currentDataset.points[selectedPointIdx] 
    : (currentDataset && currentDataset.points && currentDataset.points.length > 0 ? currentDataset.points[currentDataset.points.length - 1] : { label: "N/A", val: "N/A", status: "Bình yên" });

  return (
    <div className="space-y-6">
      
      {/* 1. TOP BRANDED SUMMARY GRADIENT BLOCK */}
      <section className="bg-gradient-to-br from-[#2c4ed3] to-[#5445cf] rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase text-white mb-3">
              <Zap className="w-3.5 h-3.5 text-[#6cfe9f]" /> TRUNG TÂM PHÂN TÍCH CHỈ SỐ
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-2">Thống kê hệ thống</h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-xl leading-relaxed">
              Phân tích lưu lượng dữ liệu lướt web, hiệu năng máy chủ API và hành vi người dùng cuối với độ phân giải cao.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live simulator indicator button */}
            <button
              onClick={() => setIsSimulatingTraffic(!isSimulatingTraffic)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                isSimulatingTraffic 
                  ? "bg-[#6cfe9f] text-[#00210d] hover:bg-[#6cfe9f]/90" 
                  : "bg-white text-[#2c4ed3] hover:bg-slate-50"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingTraffic ? "animate-spin" : ""}`} />
              <span>{isSimulatingTraffic ? "Đang chạy mô phỏng..." : "Giả lập tải thực tế"}</span>
            </button>
          </div>
        </div>

        {/* Core Quick Metrics inside section matching visual flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider">Tổng lượt truy cập</span>
              <div className="w-8 h-8 bg-[#2c4ed3]/10 text-[#2c4ed3] rounded-lg flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1c1a27] mb-1 leading-none font-sans">
              156,789
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18%</span>
              <span className="text-[#444654] font-normal">so với tháng trước</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider font-sans">Tỷ lệ chuyển đổi</span>
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1c1a27] mb-1 leading-none">
              24.5%
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.2%</span>
              <span className="text-[#444654] font-normal">so với hôm qua</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider">Người dùng hoạt động</span>
              <div className="w-8 h-8 bg-emerald-50 text-[#006a36] rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1c1a27] mb-1 leading-none font-sans">
              8,942
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4%</span>
              <span className="text-[#444654] font-normal font-sans">tuần này</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm text-[#1c1a27] transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider">Mục tiêu đạt được</span>
              <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#1c1a27] mb-1 leading-none font-sans">
              78%
            </div>
            <div className="flex items-center gap-1 text-[#006a36] text-[10px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+5%</span>
              <span className="text-[#444654] font-normal">tiến trình tổng</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. REAL-TIME SIMULATION & NODES CONTROL PANEL DESK */}
      <div className="bg-white rounded-[2rem] p-6 border border-[#c4c5d7]/20 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-[#2c4ed3]" />
          <h4 className="text-sm sm:text-base font-black text-[#1c1a27]">Bộ điều khiển điều phối & Mô phỏng tải</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-[#444654]">
              <span>Hệ số tải giả lập latency</span>
              <span className="text-[#2c4ed3] font-mono font-bold">{latencyMultiplier.toFixed(1)}x</span>
            </div>
            <input 
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={latencyMultiplier}
              onChange={(e) => setLatencyMultiplier(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#f0ebfe] rounded-lg appearance-none cursor-pointer accent-[#2c4ed3]"
            />
            <p className="text-[10px] text-[#444654] opacity-75">Tăng hệ số kéo dãn độ trễ mạng lưới khu vực.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider">Lượt Concurrent Trực Tiếp</span>
            <div className="flex items-center gap-3">
              <div className="text-xl sm:text-2xl font-black text-[#2c4ed3] tracking-tight">{liveUsersCount.toLocaleString()}</div>
              <div className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${isSimulatingTraffic ? "bg-[#006a36] animate-pulse" : "bg-zinc-300"}`} />
                <span className="text-[10px] font-medium text-[#444654]">
                  {isSimulatingTraffic ? "đang truyền hồi" : "tĩnh lặng"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#444654] uppercase tracking-wider">Cảnh báo ngưỡng nghẽn mạng</span>
            <div className="flex items-center gap-2">
              {latencyMultiplier > 2.0 ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ba1a1a] bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5" /> Quá tải độ trễ hệ thống ({getNodeLatency(145)}ms)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006a36] bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                  <Check className="w-3.5 h-3.5" /> Băng thông cụm mạng an toàn
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. CORE CHARTS DIVISION (Traffic Hours & Geographical Latency) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph Area Left Panel */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 flex flex-col justify-between h-[440px] lg:col-span-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h4 className="text-sm sm:text-base font-black text-[#1c1a27] flex items-center gap-2">
                <SafeIcon icon={LineChart} fallback={Activity} className="w-5 h-5 text-[#2c4ed3]" /> Lưu lượng truy cập tích lũy
              </h4>
              <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Sự phân phối lượng tương tác đồng bộ dựa theo mốc thời gian.</p>
            </div>

            {/* Time Selector Tabs Layout */}
            <div className="flex items-center bg-[#f0ebfe] p-1 rounded-xl shrink-0">
              {[
                { code: "24h", label: "24 Giờ" },
                { code: "7d", label: "7 Ngày" },
                { code: "30d", label: "30 Ngày" },
                { code: "6m", label: "6 Tháng" }
              ].map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => { setTimeRange(opt.code as any); setSelectedPointIdx(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === opt.code 
                      ? "bg-white text-[#2c4ed3] shadow-sm" 
                      : "text-[#444654] hover:text-[#2c4ed3]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart stage */}
          <div className="flex-1 flex gap-4 min-h-0 bg-[#fcf8ff] rounded-2xl border border-slate-100 p-4 relative overflow-hidden">
            
            {/* SVG Visual graph container */}
            <div className="flex-1 relative h-full">
              
              <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradientFlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2c4ed3" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2c4ed3" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal guide lines */}
                <g className="stroke-[#e5e0f3] opacity-65 stroke-[0.3]">
                  <line x1="0" y1="10" x2="100" y2="10" strokeDasharray="1 2" />
                  <line x1="0" y1="22" x2="100" y2="22" strokeDasharray="1 2" />
                  <line x1="0" y1="35" x2="100" y2="35" strokeDasharray="1 2" />
                  <line x1="0" y1="46" x2="100" y2="46" />
                </g>

                {/* Area path gradient */}
                <path d={currentDataset.fillPath} fill="url(#gradientFlow)" />

                {/* Main Curve line */}
                <path 
                  d={currentDataset.path} 
                  fill="none" 
                  stroke="#2c4ed3" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  className="transition-all duration-500"
                />

                {/* Interactive points markers circles */}
                {currentDataset.points.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedPointIdx === idx ? 3.5 : 2}
                    fill={selectedPointIdx === idx ? "#2c4ed3" : "#5445cf"}
                    stroke="white"
                    strokeWidth={selectedPointIdx === idx ? 1.5 : 0.8}
                    className="cursor-pointer transition-all hover:scale-150"
                    onClick={() => setSelectedPointIdx(idx)}
                  />
                ))}
              </svg>

              {/* Responsive timelines labels */}
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] font-bold text-[#444654] font-sans pt-1">
                {currentDataset.points.map((pt, i) => (
                  <span 
                    key={i} 
                    className={`cursor-pointer transition-colors ${selectedPointIdx === i ? "text-[#2c4ed3] scale-105" : "opacity-75"}`}
                    onClick={() => setSelectedPointIdx(i)}
                  >
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Selected point interactive details cards inside graph viewport */}
            <div className="w-48 bg-white/90 backdrop-blur-sm border border-[#c4c5d7]/20 p-3.5 rounded-xl shadow-lg flex flex-col justify-between shrink-0 select-none">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">CHI TIẾT MỐC ĐO</span>
                <h5 className="text-xs font-black text-[#1c1a27] font-mono text-purple-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2c4ed3]" /> {activeSelectedPoint.label}
                </h5>
                <div className="text-lg font-black text-[#1c1a27] font-sans tracking-tight">{activeSelectedPoint.val}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-[#444654]">TRẠNG THÁI TẢI:</span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg text-center ${
                  activeSelectedPoint.status.includes("Đỉnh") 
                    ? "bg-red-50 text-[#ba1a1a]" 
                    : activeSelectedPoint.status.includes("tâm") || activeSelectedPoint.status.includes("bận")
                    ? "bg-amber-50 text-amber-700"
                    : "bg-emerald-50 text-[#006a36]"
                }`}>
                  {activeSelectedPoint.status}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Global Node Latency Right Panel */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 flex flex-col justify-between h-[440px] lg:col-span-4">
          <div>
            <h4 className="text-sm sm:text-base font-black text-[#1c1a27] flex items-center gap-2">
              <Wifi className="w-5 h-5 text-purple-600" /> Tốc độ phản hồi cụm Node
            </h4>
            <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Thời gian trễ API dựa theo khu vực cơ sở hạ tầng phân tán toàn cầu.</p>
          </div>

          <div className="space-y-4 flex-1 mt-6">
            {[
              { region: "Đông Nam Á (Singapore)", location: "sg-node", base: 32, color: "bg-[#2c4ed3]" },
              { region: "Bắc Á (Tokyo)", location: "tok-node", base: 56, color: "bg-[#2c4ed3]" },
              { region: "Bắc Mỹ (Oregon)", location: "or-node", base: 124, color: "bg-[#5445cf]" },
              { region: "Châu Âu (Frankfurt)", location: "fra-node", base: 145, color: "bg-amber-600" }
            ].map((node) => {
              const currentLatency = getNodeLatency(node.base);
              const lagPercentage = Math.min(100, Math.round((currentLatency / 300) * 100));

              return (
                <div key={node.location} className="space-y-1 bg-[#fcf8ff] p-3 rounded-xl border border-slate-50 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-bold text-[#1c1a27]">
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> {node.region}</span>
                    <span className="font-mono text-[#2c4ed3]">{currentLatency}ms</span>
                  </div>

                  <div className="h-2 bg-[#f0ebfe] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        currentLatency > 200 ? "bg-[#ba1a1a]" : currentLatency > 120 ? "bg-amber-500" : "bg-[#006a36]"
                      }`}
                      style={{ width: `${lagPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#444654] font-medium opacity-80 pt-0.5 select-none">
                    <span>Trạng thái máy chủ:</span>
                    <span className={currentLatency > 200 ? "text-[#ba1a1a] font-bold" : currentLatency > 120 ? "text-amber-600 font-bold" : "text-[#006a36] font-bold"}>
                      {currentLatency > 200 ? "Cảnh báo nghẽn" : currentLatency > 120 ? "Độ trễ trung" : "Phát phản hồi nhanh"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#f0ebfe] text-xs p-3 rounded-xl text-[#444654] font-medium border border-[#c4c5d7]/20 select-none">
            <span className="font-bold text-[#2c4ed3] block mb-0.5">Mẹo tối ưu:</span> 
            Độ trễ lý tưởng cụm nội địa thường nằm dưới mốc 100ms. Sử dụng CDN phân cực để tránh nút thắt cổ chai.
          </div>

        </div>

      </div>

      {/* 4. PLATFORM DEVICE CONTROLLER & CLIENT AGENTS DATA RULING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Systems User Agents Table List */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#c4c5d7]/20 lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-sm sm:text-base font-black text-[#1c1a27]">Hệ điều hành & Trình duyệt khách truy cập</h4>
                <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Sắp xếp, tìm kiếm và phân thùy tỷ lệ truy cập phần cứng khách hàng.</p>
              </div>

              {/* Filter search bar in list browsers */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444654] opacity-50" />
                <input 
                  type="text" 
                  placeholder="Lọc trình duyệt..."
                  value={browserSearch}
                  onChange={(e) => setBrowserSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-48 bg-[#f6f1ff]/60 text-xs border-none rounded-xl focus:ring-2 focus:ring-[#2c4ed3] focus:outline-none placeholder-[#444654]/50 font-sans"
                />
              </div>
            </div>

            {/* List Table with headers sorting attributes */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="bg-[#fcf8ff] text-[10px] font-bold text-[#444654] uppercase border-t border-b border-[#c4c5d7]/20 select-none">
                    <th className="px-4 py-3 cursor-pointer hover:text-[#2c4ed3]" onClick={() => toggleBrowserSort("name")}>
                      Tên trình duyệt {browserSortColumn === "name" && (browserSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-4 py-3 text-center cursor-pointer hover:text-[#2c4ed3]" onClick={() => toggleBrowserSort("pct")}>
                      Phần trăm {browserSortColumn === "pct" && (browserSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                    </th>
                    <th className="px-4 py-3 text-right cursor-pointer hover:text-[#2c4ed3]" onClick={() => toggleBrowserSort("users")}>
                      Đếm số Client {browserSortColumn === "users" && (browserSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d7]/25 text-xs text-[#1c1a27] font-semibold">
                  {filteredAndSortedBrowsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-[#444654] opacity-60">
                        Không khớp dữ liệu kết quả tìm kiếm!
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedBrowsers.map((b, idx) => {
                      const Icon = b.icon;
                      return (
                        <tr key={b.name} className="hover:bg-[#f6f1ff]/30 transition-colors">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f0ebfe] text-[#2c4ed3] flex items-center justify-center">
                              <SafeIcon icon={Icon} fallback={Globe} className="w-4 h-4 text-[#2c4ed3]" />
                            </div>
                            <span>{b.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-3">
                              <span className="w-10 font-bold">{b.pct}%</span>
                              <div className="w-24 h-1.5 bg-[#e5e0f3] rounded-full overflow-hidden hidden sm:block shrink-0">
                                <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-indigo-700">
                            {b.users.toLocaleString()} users
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-[#fcf8ff] rounded-xl border border-[#c4c5d7]/20 flex items-center justify-between text-[11px] font-medium text-[#444654] select-none mt-4">
            <span>Dùng API đo lường tự động qua: <b>Http Headers Agent Payload</b></span>
            <span className="text-[#2c4ed3] font-bold">Cập nhật 5 phút trước</span>
          </div>

        </div>

        {/* Dynamic Proportion Widget Gauge Right Panel */}
        <div className="bg-[#fcf8ff] border border-[#c4c5d7]/20 p-6 rounded-[2rem] lg:col-span-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-black text-[#1c1a27] mb-1">Cân bằng tỷ trọng thiết bị</h4>
            <p className="text-[10px] text-[#444654] opacity-75 leading-normal">
              Điều chỉnh thanh kéo kiểm định mô hình phản hồi co giãn giao diện tương ứng theo phần trăm thực tế.
            </p>
          </div>

          <div className="space-y-4 my-6">
            
            {/* Desktop proportion slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#1c1a27]">
                <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-[#2c4ed3]" /> Máy tính (Desktop)</span>
                <span className="font-mono text-[#2c4ed3]">{desktopPct}%</span>
              </div>
              <input 
                type="range"
                min="10"
                max="90"
                step="0.5"
                value={desktopPct}
                onChange={(e) => handleDeviceChange("desktop", parseFloat(e.target.value))}
                className="w-full accent-[#2c4ed3] cursor-pointer h-1.5 bg-[#e5e0f3] rounded-lg appearance-none"
              />
            </div>

            {/* Mobile proportion slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#1c1a27]">
                <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-purple-600" /> Di động (Mobile)</span>
                <span className="font-mono text-purple-600">{mobilePct}%</span>
              </div>
              <input 
                type="range"
                min="5"
                max="80"
                step="0.5"
                value={mobilePct}
                onChange={(e) => handleDeviceChange("mobile", parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-[#e5e0f3] rounded-lg appearance-none"
              />
            </div>

            {/* Tablet proportion slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[#1c1a27]">
                <span className="flex items-center gap-1.5"><Tablet className="w-4 h-4 text-orange-500" /> Máy tính bảng (Tablet)</span>
                <span className="font-mono text-orange-500">{tabletPct}%</span>
              </div>
              <input 
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={tabletPct}
                onChange={(e) => handleDeviceChange("tablet", parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-[#e5e0f3] rounded-lg appearance-none"
              />
            </div>

          </div>

          <div className="bg-white border text-center border-[#c4c5d7]/20 rounded-xl p-4 shadow-sm select-none">
            <span className="text-[10px] uppercase font-black text-[#444654] block mb-1">Mã hóa nén tỷ trọng</span>
            <div className="flex justify-center items-center gap-3">
              <span className="text-xs font-bold text-[#2c4ed3]">DT: {desktopPct}%</span>
              <span className="font-bold text-slate-300">|</span>
              <span className="text-xs font-bold text-purple-600">MB: {mobilePct}%</span>
              <span className="font-bold text-slate-300">|</span>
              <span className="text-xs font-bold text-orange-500">TB: {tabletPct}%</span>
            </div>
            <div className="text-[10px] text-[#444654] opacity-75 font-medium mt-2 leading-relaxed">
              * Tổng tỷ trọng luôn tự động chuẩn hóa đạt chuẩn 100%.
            </div>
          </div>

        </div>

      </div>

      {/* 5. POPULAR ROUTES MANAGING MONITORED STREAM */}
      <div className="bg-white p-6 rounded-[2rem] border border-[#c4c5d7]/20 shadow-sm">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-sm sm:text-base font-black text-[#1c1a27]">Giám sát các đường dẫn (Trang phổ biến)</h4>
            <p className="text-[10px] text-[#444654] opacity-75 mt-0.5">Bảng ghi đo theo dõi lưu lượng views và bounce rate nội bộ trực thuộc nền tảng Planify.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            
            {/* Route search query */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444654] opacity-55" />
              <input 
                type="text" 
                placeholder="Tìm trang..."
                value={pagesSearch}
                onChange={(e) => setPagesSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-full sm:w-48 bg-[#f6f1ff]/60 border-none text-xs rounded-xl focus:ring-1 focus:ring-[#2c4ed3]"
              />
            </div>

            {/* Trigger custom route trigger button */}
            <button
              onClick={() => setShowAddRouteForm(!showAddRouteForm)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#2c4ed3] text-white font-bold text-xs rounded-xl hover:bg-[#2c4ed3]/95 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddRouteForm ? "Đóng form" : "Thêm trang"}</span>
            </button>
          </div>
        </div>

        {/* Floating / slide add custom route form */}
        {showAddRouteForm && (
          <form onSubmit={handleAddRoute} className="bg-[#fcf8ff] p-5 border border-[#c4c5d7]/20 rounded-2xl mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 animate-[fadeIn_0.15s_ease-out]">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block">Đường dẫn trang *</label>
              <input 
                type="text"
                required
                placeholder="Ví dụ: /profile/edit"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 text-[#1c1a27] focus:ring-1 focus:ring-[#2c4ed3]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block">Lượt xem mô phỏng (Views)</label>
              <input 
                type="number"
                min="1"
                value={newViews}
                onChange={(e) => setNewViews(parseInt(e.target.value) || 1)}
                className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 text-[#1c1a27] focus:ring-1 focus:ring-[#2c4ed3] font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#444654] uppercase tracking-wider block">Tỷ lệ thoát % (Bounce)</label>
              <input 
                type="number"
                min="1"
                max="99"
                value={newBounce}
                onChange={(e) => setNewBounce(parseInt(e.target.value) || 1)}
                className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 text-[#1c1a27] focus:ring-1 focus:ring-[#2c4ed3] font-mono"
              />
            </div>

            <div className="flex items-end select-none">
              <button 
                type="submit"
                className="w-full py-2 bg-[#2c4ed3] hover:bg-[#2c4ed3]/95 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer text-center"
              >
                Đăng ký theo dõi
              </button>
            </div>

          </form>
        )}

        {/* Structured Grid Table for Popular pages */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[#fcf8ff] border-t border-b border-[#c4c5d7]/20 text-[10px] font-bold text-[#444654] uppercase select-none">
                <th className="px-6 py-3 cursor-pointer hover:text-[#2c4ed3] w-1/2" onClick={() => toggleRouteSort("path")}>
                  Đường dẫn (Path Address) {routeSortColumn === "path" && (routeSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#2c4ed3] text-center" onClick={() => toggleRouteSort("views")}>
                  Số lượt xem (Views) {routeSortColumn === "views" && (routeSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                </th>
                <th className="px-6 py-3 cursor-pointer hover:text-[#2c4ed3] text-center" onClick={() => toggleRouteSort("bounce")}>
                  Tỷ lệ thoát (Bounce Rate) {routeSortColumn === "bounce" && (routeSortDirection === "asc" ? <ChevronUp className="inline w-3 h-3" /> : <ChevronDown className="inline w-3 h-3" />)}
                </th>
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-xs text-[#1c1a27] font-semibold">
              {filteredAndSortedPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[#444654] opacity-60">
                    Không tìm thấy đường dẫn theo dạng tìm kiếm lọc!
                  </td>
                </tr>
              ) : (
                filteredAndSortedPages.map((page) => (
                  <tr key={page.path} className="hover:bg-[#f6f1ff]/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[#444654] group-hover:text-[#2c4ed3] transition-colors">{page.path}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#1c1a27]">
                      {page.views.toLocaleString()} views
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          page.bounce > 25 ? "bg-[#ba1a1a]" : page.bounce > 15 ? "bg-amber-400" : "bg-[#006a36]"
                        }`} />
                        <span className="font-mono">{page.bounce}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Only allow deleting if there are elements left */}
                      {popularPages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRoute(page.path)}
                          className="mr-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1 rounded-lg hover:bg-red-50"
                          title="Hủy theo dõi tuyến"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
