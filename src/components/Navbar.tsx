import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const navLinkStyles = ({ isActive }: { isActive: boolean }) => 
    `text-sm font-medium transition-colors ${isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img src="/logo hệ thống planify.png" alt="Planify Logo" className="h-8 w-auto object-contain" />
            <img src="/logo-text.png" alt="PLANIFY" className="h-4 w-auto object-contain mt-1" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" end className={navLinkStyles}>
              Trang chủ
            </NavLink>
            <NavLink to="/planning" className={navLinkStyles}>
              Kế hoạch
            </NavLink>
            <NavLink to="/pricing" className={navLinkStyles}>
              Các gói
            </NavLink>
            <NavLink to="/about" className={navLinkStyles}>
              Về chúng tôi
            </NavLink>
            <NavLink to="/contact" className={navLinkStyles}>
              Liên hệ
            </NavLink>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link 
                  to="/pricing"
                  className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-md text-sm font-semibold transition-all shadow-md shadow-primary/20"
                >
                  Dùng thử miễn phí
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <NavLink 
                  to="/login"
                  className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                >
                  Đăng nhập
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-4">
                
                {/* ===== NÚT VÀO TRANG QUẢN TRỊ ===== */}
                <Link 
                  to="/admin" 
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-md"
                >
                  Trang Quản Trị
                </Link>
                {/* ================================== */}

                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserIcon size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user.fullName}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;