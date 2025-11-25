// src/pages/DoanhThuSanPham.jsx
import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { FaMoneyBillWave } from "react-icons/fa";
import { exportExcel } from "../components/exportExcel";
import { dataDoanhThu } from "../data/dataDoanhThu";
import SelectWithScroll from "../components/SelectWithScroll";
import { isRole } from "../utils/roleUtils";
import { useSession } from "../contexts/SessionContext";

function DoanhThuSanPham() {
  const [data, setData] = useState(dataDoanhThu);

  const {session} = useSession();
  const isQuanLyCuaHang = isRole(session?.role, "Quản lý cửa hàng");
  const isThuNgan = isRole(session?.role, "Nhân viên thu ngân");
  // FILTER STATES
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterSanPham, setFilterSanPham] = useState("all");
  const [filterThuNgan, setFilterThuNgan] = useState("all");

  const columns = [
    "Mã HĐ",
    "Sản phẩm",
    "Số lượng",
    "Đơn giá",
    "Thành tiền",
    "Ngày lập",
    "Mã thu ngân",
    "Tên người lập"
  ];

  // TỔNG DOANH THU
  const tongDoanhThu = data.reduce((acc, row) => acc + row.thanhTien, 0);

  // APPLY FILTERS TỰ ĐỘNG
  useEffect(() => {
    let filtered = dataDoanhThu;

    // Lọc theo ngày
    if (fromDate)
      filtered = filtered.filter(r => r.ngayLap >= fromDate);
    if (toDate)
      filtered = filtered.filter(r => r.ngayLap <= toDate);

    // Lọc sản phẩm
    if (filterSanPham !== "all")
      filtered = filtered.filter(r => r.tenSP === filterSanPham);

    // Thu ngân
    if (isThuNgan) {
      filtered = filtered.filter(r => r.maNguoiDung === session.id);
    } else if (filterThuNgan !== "all") {
      filtered = filtered.filter(r => r.tenNguoiLap === filterThuNgan);
    }

    setData(filtered);
  }, [fromDate, toDate, filterSanPham, filterThuNgan, isThuNgan, session.id]);

  // EXPORT EXCEL
  const handleExport = () => {
    const exportData = data.map(row => ({
      "Mã HĐ": row.maHD,
      "Sản phẩm": row.tenSP,
      "Số lượng": row.soLuong,
      "Đơn giá": row.donGia.toLocaleString("vi-VN") + " VNĐ",
      "Thành tiền": row.thanhTien.toLocaleString("vi-VN") + " VNĐ",
      "Ngày lập": row.ngayLap,
      "Tên người lập": row.tenNguoiLap
    }));
    exportExcel(exportData, [], "DoanhThuSanPham.xlsx");
  };

  // Lấy danh sách Sản phẩm & Thu ngân unique
  const sanPhamOptions = ["Tất cả", ...new Set(dataDoanhThu.map(r => r.tenSP))];
  const thuNganOptions = ["Tất cả", ...new Set(dataDoanhThu.map(r => r.tenNguoiLap))];

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Doanh Thu Sản Phẩm</h1>
      <p className="mb-3">Trang xem doanh thu theo sản phẩm, ngày lập, và người lập.</p>

      {/* BỘ LỌC */}
      <div className="row g-2 mb-3 align-items-end">
        
        <div className="col-md-2">
          <label className="form-label">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            className="form-control"
            onChange={e => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            className="form-control"
            onChange={e => setToDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Sản phẩm</label>
          <SelectWithScroll
            options={sanPhamOptions}
            value={filterSanPham === "all" ? "Tất cả" : filterSanPham}
            onChange={val => setFilterSanPham(val === "Tất cả" ? "all" : val)}
          />
        </div>

        {isQuanLyCuaHang && (
          <div className="col-md-3">
          <label className="form-label">Thu ngân</label>
          <SelectWithScroll
            options={thuNganOptions}
            value={filterThuNgan === "all" ? "Tất cả" : filterThuNgan}
            onChange={val => setFilterThuNgan(val === "Tất cả" ? "all" : val)}
          />
        </div>
        )}

      </div>

      {/* BẢNG */}
      <TableComponent
        title="Bảng Doanh Thu"
        columns={columns}
        hiddenColumns={[6]}
        data={data.map(row => [
          row.maHD,
          row.tenSP,
          row.soLuong,
          row.donGia.toLocaleString("vi-VN") + " VNĐ",
          row.thanhTien.toLocaleString("vi-VN") + " VNĐ",
          row.ngayLap,
          row.maThuNgan,
          row.tenNguoiLap
        ])} 
      />

      {/* TỔNG DOANH THU & EXPORT */}
      <div className="d-flex justify-content-end align-items-center mt-3">
        <div className="me-3 d-flex align-items-center">
          <label className="me-2 mb-0">Tổng doanh thu:</label>
          <input
            type="text"
            className="form-control"
            value={`${tongDoanhThu.toLocaleString()} VNĐ`}
            readOnly
            style={{ width: "200px", opacity: 0.7 }}
          />
        </div>
        <button className="btn btn-success" onClick={handleExport}>
          <FaMoneyBillWave className="me-1" /> Xuất báo cáo
        </button>
      </div>

    </div>
  );
}

export default DoanhThuSanPham;
