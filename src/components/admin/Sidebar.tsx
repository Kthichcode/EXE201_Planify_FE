import React, { useState } from "react";
import { 
  Users, 
  Calendar, 
  BarChart2, 
  Activity, 
  MessageSquare, 
  Banknote, 
  Bell, 
  Package, 
  Settings, 
  Menu, 
  ChevronLeft, 
  LayoutDashboard 
} from "lucide-react";
import { ViewType } from "../../types";

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function Sidebar({ currentView, setView }: SidebarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const navigationItems = [
    { view: "users" as ViewType, label: "Người dùng", icon: Users },
    { view: "plans" as ViewType, label: "Kế hoạch", icon: Calendar },
    { view: "statistics" as ViewType, label: "Thống kê", icon: BarChart2 },
    { view: "activities" as ViewType, label: "Hoạt động", icon: Activity },
    { view: "feedback" as ViewType, label: "Phản hồi", icon: MessageSquare },
    { view: "payments" as ViewType, label: "Thanh toán", icon: Banknote },
    { view: "notifications" as ViewType, label: "Thông báo", icon: Bell },
    { view: "packages" as ViewType, label: "Gói giao dịch", icon: Package },
    { view: "settings" as ViewType, label: "Cài đặt", icon: Settings },
  ];

  return (
    <>
      {/* Permanent Narrow Sidebar (Icon Strip) */}
      <aside className="fixed inset-y-0 left-0 w-20 bg-white border-r border-[#c4c5d7]/30 flex flex-col items-center py-6 z-[60] shadow-sm">
        {/* Toggle Drawer Button */}
        <button 
          onClick={toggleDrawer}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#2c4ed3] text-white hover:bg-[#2c4ed3]/90 transition-transform hover:scale-105 active:scale-95 mb-8 shadow-md cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Icon Navigation */}
        <nav className="flex flex-col gap-5 w-full items-center">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                title={item.label}
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer relative ${
                  isActive 
                    ? "bg-[#2c4ed3]/10 text-[#2c4ed3] font-semibold" 
                    : "text-[#444654] hover:bg-[#f0ebfe] hover:text-[#2c4ed3]"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#2c4ed3] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile At Bottom */}
        <div className="mt-auto">
          <button 
            onClick={() => setView("settings")}
            className="w-10 h-10 rounded-xl bg-[#2c4ed3] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:opacity-90 cursor-pointer"
          >
            AD
          </button>
        </div>
      </aside>

      {/* Slide-out Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          onClick={closeDrawer}
          className="fixed inset-0 bg-[#1c1a27]/20 backdrop-blur-sm z-[70] transition-opacity duration-300"
        />
      )}

      {/* Slide-out Full Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[260px] bg-white z-[80] shadow-2xl flex flex-col p-6 transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setView("dashboard");
                closeDrawer();
              }}
              title="Tổng quan"
              className="w-10 h-10 bg-[#2c4ed3] hover:bg-[#1a3ec0] transition-colors rounded-xl flex items-center justify-center text-white shadow-md shadow-[#2c4ed3]/20 cursor-pointer"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black tracking-tight text-[#1c1a27] leading-none uppercase">PLANIFY</h1>
              <p className="text-[10px] uppercase font-bold text-[#444654] opacity-70 mt-1">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={closeDrawer}
            className="text-[#444654] hover:text-[#1c1a27] p-1.5 hover:bg-[#f6f1ff] rounded-lg transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Expanded Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  closeDrawer();
                }}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                  isActive 
                    ? "bg-[#2c4ed3]/10 text-[#2c4ed3] font-semibold border-l-4 border-[#2c4ed3]" 
                    : "text-[#444654] hover:bg-[#f6f1ff] hover:text-[#2c4ed3]"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Profile Extended */}
        <div className="pt-4 border-t border-[#c4c5d7]/20 mt-auto">
          <div 
            onClick={() => {
              setView("settings");
              closeDrawer();
            }}
            className="flex items-center gap-3 p-2 hover:bg-[#f6f1ff] rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#2c4ed3] flex items-center justify-center text-white font-bold shadow-sm">
              AD
            </div>
            <div className="overflow-hidden flex-1 select-none">
              <p className="text-xs font-bold text-[#1c1a27] truncate">Admin Account</p>
              <p className="text-[10px] text-[#444654] truncate">admin@planify.io</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
