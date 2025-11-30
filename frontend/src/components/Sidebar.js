// src/components/Sidebar.js
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getRoleFlags } from "../utils/roleCheck";
import { useSession } from '../contexts/SessionContext';

function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "active" : "";

  const { session } = useSession();
  const userRole = session?.role || "";
  const flags = getRoleFlags(userRole);

  // Tạo menu riêng theo role
  const menuByRole = {
    isQuanTriHeThong: [
      { path: "/nguoi-dung", label: "Người dùng", icon: "fas fa-users" },
      { path: "/vai-tro", label: "Vai trò", icon: "fas fa-id-badge" },
      { path: "/quyen-han", label: "Quyền hạn", icon: "fas fa-lock" },
    ],
    isQuanLyCuaHang: [
      { path: "/nguoi-dung", label: "Nhân viên", icon: "fas fa-user-friends" },
      { path: "/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
      { path: "/phieu-nhap", label: "Phiếu nhập", icon: "fas fa-file-import" },
      { path: "/nha-cung-cap", label: "Nhà cung cấp", icon: "fas fa-truck" },
      { path: "/cong-no", label: "Công nợ", icon: "fas fa-file-invoice-dollar" },
      { path: "/thoi-gian-bieu", label: "Thời gian biểu", icon: "fas fa-calendar-alt" },
      { path: "/phan-cong", label: "Phân công", icon: "fas fa-tasks" },
      { path: "/thanh-toan-ca", label: "Thanh toán & Chấm công", icon: "fas fa-cash-register" },
      { path: "/lap-hoa-don", label: "Lập hóa đơn", icon: "fas fa-receipt" },
      { path: "/doanh-thu", label: "Doanh thu", icon: "fas fa-chart-line" },
    ],
    isNhanVienKho: [
      { path: "/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
      { path: "/phieu-nhap", label: "Phiếu nhập", icon: "fas fa-file-import" },
      { path: "/thanh-toan-ca", label: "Lịch làm & Chấm công", icon: "fas fa-clock" },
    ],
    isNhanVienThuNgan: [
      { path: "/san-pham", label: "Sản phẩm", icon: "fas fa-box" },
      { path: "/lap-hoa-don", label: "Lập hóa đơn", icon: "fas fa-receipt" },
      { path: "/doanh-thu", label: "Doanh thu cá nhân", icon: "fas fa-chart-bar" },
      { path: "/thanh-toan-ca", label: "Lịch làm & Chấm công", icon: "fas fa-clock" },
    ],
  };

  // Nếu có session → hiển thị menu role tương ứng
  let menuItems = [];
  if (session) {
    if (flags.isQuanTriHeThong) menuItems = menuByRole.isQuanTriHeThong;
    else if (flags.isQuanLyCuaHang) menuItems = menuByRole.isQuanLyCuaHang;
    else if (flags.isNhanVienKho) menuItems = menuByRole.isNhanVienKho;
    else if (flags.isNhanVienThuNgan) menuItems = menuByRole.isNhanVienThuNgan;
  }

  // Nếu không có session → hiển thị menu login tương ứng
  const loginMenu = [
    { path: "/login/quan-tri-vien", label: "Quản trị viên", icon: "fas fa-user-shield" },
    { path: "/login/quan-ly-cua-hang", label: "Quản lý cửa hàng", icon: "fas fa-store" },
    { path: "/login/nhan-vien-kho", label: "Nhân viên kho", icon: "fas fa-warehouse" },
    { path: "/login/nhan-vien-thu-ngan", label: "Nhân viên thu ngân", icon: "fas fa-cash-register" },
  ];

  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            {(session && menuItems.length > 0) 
              ? menuItems.map(item => (
                  <NavLink key={item.path} className={`nav-link ${isActive(item.path)}`} to={item.path}>
                    <div className="sb-nav-link-icon"><i className={item.icon}></i></div>
                    {item.label}
                  </NavLink>
                ))
              : loginMenu.map(item => (
                  <NavLink key={item.path} className={`nav-link ${isActive(item.path)}`} to={item.path}>
                    <div className="sb-nav-link-icon"><i className={item.icon}></i></div>
                    {item.label}
                  </NavLink>
                ))
            }
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Logged in as:</div>
          {userRole}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
