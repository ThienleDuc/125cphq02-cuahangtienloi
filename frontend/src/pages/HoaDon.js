// src/pages/HoaDon.jsx
import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { Link } from "react-router-dom";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { exportExcel } from "../components/exportExcel";
import { FaMoneyBillWave } from "react-icons/fa";
import { dataHoaDon } from "../data/dataHoaDon";
import { isRole } from "../utils/roleUtils";
import { useSession } from "../contexts/SessionContext";

function HoaDon({ currentUserId = 1 }) {
  const { session }= useSession();
  const isQuanLyCuaHang = isRole(session?.role, "Quản lý cửa hàng");
  const isThuNgan = isRole(session?.role, "Nhân viên thu ngân");

  // Dữ liệu demo phương thức thanh toán
  const phuongThucOptions = ["Tiền mặt", "Chuyển khoản", "Thẻ ngân hàng"];
  const trangThaiOptions = ["Đã thanh toán", "Đã hủy", "Chưa thanh toán"];

  // Tính tổng doanh thu theo role
  const tongDoanhThu = (
    isThuNgan 
      ? dataHoaDon.filter(d => d[2] === session?.id)
      : dataHoaDon
  ).reduce((acc, row) => acc + row[5], 0);

  const handleExport = () => {
    const exportData = dataHoaDon.map(row => ({
      "Mã HĐ": row[0],
      "Ngày lập": row[1],
      "Thu ngân": row[3],
      "Phương thức TT": row[4],
      "Tổng tiền": row[5].toLocaleString("vi-VN") + " VNĐ",
      "Trạng thái": row[6]
    }));

    exportExcel(exportData, [], "DoanhThuHoaDon.xlsx");
  };

  const [data, setData] = useState(dataHoaDon);
  const [currentRow, setCurrentRow] = useState(null);

  // Filter
  const [filterNgay, setFilterNgay] = useState("");
  const [filterThuNgan, setFilterThuNgan] = useState("");
  const [filterPTTT, setFilterPTTT] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");

  // Form Thêm/Sửa
  const [pttt, setPTTT] = useState("");
  const [trangThai, setTrangThai] = useState("");

  const columns = ["Mã HĐ", "Ngày lập", "Thu ngân", "Phương thức TT", "Tổng tiền", "Trạng thái", "Tác vụ"];

  // Hàm lọc tự động khi filter thay đổi
  useEffect(() => {
    let filtered = [...dataHoaDon];

    if (filterNgay) filtered = filtered.filter(d => d[1] === filterNgay);
    if (filterThuNgan && filterThuNgan !== "all")
      filtered = filtered.filter(d => d[2] === parseInt(filterThuNgan));
    if (filterPTTT && filterPTTT !== "all")
      filtered = filtered.filter(d => d[4] === filterPTTT);
    if (filterTrangThai && filterTrangThai !== "all")
      filtered = filtered.filter(d => d[6] === filterTrangThai);

    setData(filtered);
  }, [filterNgay, filterThuNgan, filterPTTT, filterTrangThai]);

  const handleAdd = () => {
    if (!pttt || !trangThai) return;

    const newId = Math.max(...dataHoaDon.map(d => d[0])) + 1;
    
    const u = dataNguoiDung.find(x => x[0] === currentUserId);

    const newRow = [
      newId,
      new Date().toISOString().slice(0, 10), // ngày lập tự động
      currentUserId,
      u ? u[1] : "Không xác định",
      pttt,
      Math.floor(Math.random() * 200000) + 50000, // tổng tiền demo
      trangThai
    ];

    dataHoaDon.push(newRow);
    setData([...dataHoaDon]);

    setPTTT(""); 
    setTrangThai("");
  };

  const handleSave = () => {
    if (!currentRow) return;

    const updated = [...dataHoaDon].map(d =>
      d[0] === currentRow[0]
        ? [d[0], d[1], d[2], d[3], pttt, d[5], trangThai]
        : d
    );

    setData(updated);

    // cập nhật mảng demo
    const index = dataHoaDon.findIndex(d => d[0] === currentRow[0]);
    dataHoaDon[index] = updated[index];

    setCurrentRow(null);
  };

  const handleDelete = () => {
    if (!currentRow) return;

    const filtered = dataHoaDon.filter(d => d[0] !== currentRow[0]);

    // cập nhật lại
    dataHoaDon.length = 0;
    dataHoaDon.push(...filtered);

    setData(filtered);
    setCurrentRow(null);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Hóa Đơn</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị các hóa đơn.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => {
            setPTTT("");
            setTrangThai("");
          }}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Bộ lọc tự động */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-2">
          <label className="form-label">Ngày lập</label>
          <input type="date" className="form-control" value={filterNgay} onChange={e => setFilterNgay(e.target.value)} />
        </div>
        {isQuanLyCuaHang && (
          <div className="col-md-2">
            <label className="form-label">Thu ngân</label>
            <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(u => u[1])]}
              value={
                filterThuNgan ? 
                (filterThuNgan === "all" 
                  ? "Tất cả" 
                  : dataNguoiDung.find(u => u[0] === parseInt(filterThuNgan))?.[1]
                ) 
                  : "Tất cả"
              }
              onChange={val => {
                if (val === "Tất cả") setFilterThuNgan("all");
                else {
                  const u = dataNguoiDung.find(u => u[1] === val);
                  setFilterThuNgan(u ? u[0].toString() : "");
                }
              }}
            />
          </div>
        )}
        <div className="col-md-2">
          <label className="form-label">PT thanh toán</label>
          <SelectWithScroll options={["Tất cả", ...phuongThucOptions]} value={filterPTTT || "Tất cả"} onChange={val => setFilterPTTT(val === "Tất cả" ? "all" : val)} />
        </div>
        <div className="col-md-2">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll options={["Tất cả", ...trangThaiOptions]} value={filterTrangThai || "Tất cả"} onChange={val => setFilterTrangThai(val === "Tất cả" ? "all" : val)} />
        </div>
      </div>

      <TableComponent
        title="Danh sách Hóa Đơn"
        columns={columns}
        data={(
          isThuNgan 
            ? data.filter(d => d[2] === session?.id) // chỉ lấy bản thân
            : data // lấy hết
        ).map(row => [
          row[0],
          row[1],
          row[3], // tên người lập
          row[4],
          row[5].toLocaleString("vi-VN") + " VNĐ",
          row[6]
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            return (
              <td>
                <Link to={`/lap-hoa-don/${row[0]}`} className="btn btn-info btn-sm me-1">
                  <i className="fas fa-search"></i>
                </Link>
                <button
                  className="btn btn-primary btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => {
                    const original = dataHoaDon.find(d => d[0] === row[0]);
                    setCurrentRow(original);
                    setPTTT(original[4]);
                    setTrangThai(original[6]);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => setCurrentRow(dataHoaDon.find(d => d[0] === row[0]))}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
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

      {/* Modal Thêm mới */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Hóa Đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Phương thức TT</label>
                <SelectWithScroll
                  options={phuongThucOptions}
                  value={pttt}
                  onChange={setPTTT}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={trangThaiOptions}
                  value={trangThai}
                  onChange={setTrangThai}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAdd}>Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Hóa Đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Phương thức TT</label>
                <SelectWithScroll
                  options={phuongThucOptions}
                  value={pttt}
                  onChange={setPTTT}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={trangThaiOptions}
                  value={trangThai}
                  onChange={setTrangThai}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xóa */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Bạn có chắc muốn xóa hóa đơn này?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoaDon;
