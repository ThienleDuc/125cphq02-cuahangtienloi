// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarToggle from './components/SidebarToggle';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import NguoiDung from './pages/NguoiDung';
import VaiTro from './pages/VaiTro';
import QuyenHan from './pages/QuyenHan';
import VaiTroQuyenHan from './pages/VaiTroQuyenHan';
import SanPham from './pages/SanPham';
import NhaCungCap from './pages/NhaCungCap';
import CongNo from './pages/CongNo';
import ThoiGianBieu from './pages/ThoiGianBieu';
import PhanCong from './pages/PhanCong';
import ThanhToanCa from './pages/ThanhToanCa';
import DoanhThu from './pages/DoanhThu';
import PhieuNhap from './pages/PhieuNhap';
import ChiTietPhieuNhap from './pages/ChiTietPhieuNhap';
import HoaDon from './pages/HoaDon';
import ChiTietHoaDon from './pages/ChiTietHoaDon';

import LoginAdmin from './pages/Login/LoginAdmin';
import LoginManager from './pages/Login/LoginManager';
import LoginCashier from './pages/Login/LoginCashier';
import LoginWarehouse from './pages/Login/LoginWarehouse';
import ForgotPassword from './pages/ForgotPassword';
import { getRoleFlags } from './utils/roleCheck';

import { useSession } from './contexts/SessionContext';

function App() {
  const {session} = useSession();

  const getDefaultRoute = () => {
    if (!session) return "/login/quan-tri-vien";

    const flags = getRoleFlags(session.role);
    if (flags.isQuanTriHeThong) return "/nguoi-dung";
    if (flags.isQuanLyCuaHang) return "/nguoi-dung";
    if (flags.isNhanVienThuNgan) return "/san-pham";
    if (flags.isNhanVienKho) return "/phieu-nhap";

    return "/login/quan-tri-vien";
  };

  return (
    <>
      <Header />
      <SidebarToggle />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar user={session} />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <Routes>
              {/* Login routes */}
              <Route path="/login/quan-tri-vien" element={<LoginAdmin />} />
              <Route path="/login/quan-ly-cua-hang" element={<LoginManager />} />
              <Route path="/login/nhan-vien-thu-ngan" element={<LoginCashier />} />
              <Route path="/login/nhan-vien-kho" element={<LoginWarehouse />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Routes bảo vệ */}
              <Route path="/nguoi-dung" element={session ? <NguoiDung /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/vai-tro" element={session ? <VaiTro /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/quyen-han" element={session ? <QuyenHan /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/vai-tro-quyen-han" element={session ? <VaiTroQuyenHan /> : <Navigate to={getDefaultRoute()} />} />

              <Route path="/nhan-vien" element={session ? <NguoiDung /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/san-pham" element={session ? <SanPham /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/nha-cung-cap" element={session ? <NhaCungCap /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/cong-no" element={session ? <CongNo /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/thoi-gian-bieu" element={session ? <ThoiGianBieu /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/phan-cong" element={session ? <PhanCong /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/thanh-toan-ca" element={session ? <ThanhToanCa /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/doanh-thu" element={session ? <DoanhThu /> : <Navigate to={getDefaultRoute()} />} />

              <Route path="/phieu-nhap" element={session ? <PhieuNhap /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/phieu-nhap/:maPN" element={session ? <ChiTietPhieuNhap /> : <Navigate to={getDefaultRoute()} />} />

              <Route path="/lap-hoa-don" element={session ? <HoaDon /> : <Navigate to={getDefaultRoute()} />} />
              <Route path="/lap-hoa-don/:maHD" element={session ? <ChiTietHoaDon /> : <Navigate to={getDefaultRoute()} />} />

              {/* Default route */}
              <Route path="/" element={<Navigate to={getDefaultRoute()} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
