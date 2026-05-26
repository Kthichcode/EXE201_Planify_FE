import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard'; 

function AppLayout() {
  const location = useLocation();
  // Nếu đường dẫn bắt đầu bằng /admin, ẩn Navbar và Footer chung
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {!isAdminPath && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          
          {/* Định tuyến Quản trị viên */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Tuyệt chiêu: Bắt thêm tham số phía sau /admin/ (ví dụ: /admin/users) */}
          <Route path="/admin/:view" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;