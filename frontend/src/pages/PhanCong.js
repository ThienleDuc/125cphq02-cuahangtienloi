// src/pages/PhanCong.jsx
import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";

// Dữ liệu duy nhất, đã bao gồm chi tiết
import { dataPhanCong } from "../data/dataPhanCong";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { dataThoiGianBieu } from "../data/dataThoiGianBieu";

function PhanCong() {
  // ====== STATE CHÍNH ======
  const [phanCongList, setPhanCongList] = useState(dataPhanCong);
  const [filters, setFilters] = useState({ caLam: "", ngayLam: "" });
  const [filteredList, setFilteredList] = useState(dataPhanCong);

  // ====== FILTER DATA ======
  useEffect(() => {
    setFilteredList(
      phanCongList.filter(r => {
        const matchCa = !filters.caLam || r[4] === filters.caLam;   // r[4] = tenCa
        const matchNgay = !filters.ngayLam || r[5] === filters.ngayLam; // r[5] = ngayLam
        return matchCa && matchNgay;
      })
    );
  }, [filters, phanCongList]);

  // ====== FORM ======
  const [currentRow, setCurrentRow] = useState(null);
  const emptyForm = {
    maNV: "",
    maCa: "",
    nhanVien: "",
    caLam: "",
    ngayLam: "",
    trangThai: "Đã phân công",
    nguoiPhanCong: "",
    ngayPhanCong: "",
    ghiChu: ""
  };
  const [form, setForm] = useState(emptyForm);

  const columns = [
    "Mã Lịch NV",
    "Mã NV",
    "Nhân viên",
    "Mã Ca",
    "Ca làm",
    "Ngày làm",
    "Giờ bắt đầu",
    "Giờ kết thúc",
    "Trạng thái",
    "Mã gười phân công",
    "Người phân công",
    "Ngày phân công",
    "Ghi chú",
    "Tác vụ"
  ];

  const openModal = (id) => {
    new window.bootstrap.Modal(document.getElementById(id)).show();
  };

  // ====== THÊM ======
  const handleAdd = () => {
    const newId = phanCongList.length ? Math.max(...phanCongList.map(r => r[0])) + 1 : 1;
    const tenNV = dataNguoiDung.find(n => n[0] === form.maNV)?.[1] || "";
    const ca = dataThoiGianBieu.find(c => c[0] === form.maCa) || [];
    const tenCa = ca[1] || "";
    const gioBD = ca[2] || "";
    const gioKT = ca[3] || "";
    const tenNguoiPhanCong = dataNguoiDung.find(n => n[0] === form.nguoiPhanCong)?.[1] || "";

    const newRow = [
      newId,
      form.maNV,
      tenNV,
      form.maCa,
      tenCa,
      form.ngayLam,
      gioBD,
      gioKT,
      form.trangThai,
      tenNguoiPhanCong,
      form.ngayPhanCong,
      form.ghiChu || ""
    ];

    setPhanCongList([...phanCongList, newRow]);
    setForm(emptyForm);
  };

  // ====== CHỌN SỬA ======
  const handleEditClick = (row) => {
    setCurrentRow(row);
    setForm({
      maNV: row[1],
      maCa: row[3],
      nhanVien: row[2],
      caLam: row[4],
      ngayLam: row[5],
      trangThai: row[8],
      nguoiPhanCong: dataNguoiDung.find(n => n[1] === row[9])?.[0] || "",
      ngayPhanCong: row[10],
      ghiChu: row[11]
    });
    openModal("editModal");
  };

  // ====== LƯU SỬA ======
  const handleSaveEdit = () => {
    const tenNV = dataNguoiDung.find(n => n[0] === form.maNV)?.[1] || "";
    const ca = dataThoiGianBieu.find(c => c[0] === form.maCa) || [];
    const tenCa = ca[1] || "";
    const gioBD = ca[2] || "";
    const gioKT = ca[3] || "";
    const tenNguoiPhanCong = dataNguoiDung.find(n => n[0] === form.nguoiPhanCong)?.[1] || "";

    setPhanCongList(
      phanCongList.map(r =>
        r[0] === currentRow[0]
          ? [
              r[0],
              form.maNV,
              tenNV,
              form.maCa,
              tenCa,
              form.ngayLam,
              gioBD,
              gioKT,
              form.trangThai,
              tenNguoiPhanCong,
              form.ngayPhanCong,
              form.ghiChu || ""
            ]
          : r
      )
    );
  };

  // ====== XOÁ ======
  const handleDeleteClick = (row) => {
    setCurrentRow(row);
    openModal("deleteModal");
  };

  const handleConfirmDelete = () => {
    setPhanCongList(phanCongList.filter(r => r[0] !== currentRow[0]));
  };

  // ============================================
  // =============== RENDER =====================
  // ============================================

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Phân công nhân viên</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách phân công ca làm việc.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* FILTER */}
      <div className="row mb-3 g-3">
        <div className="col-md-3">
          <label className="form-label">Ca làm</label>
          <SelectWithScroll
            options={dataThoiGianBieu.map(c => `${c[0]}: ${c[1]}`)}
            value={filters.caLam ? `${dataThoiGianBieu.find(c => c[1] === filters.caLam)?.[0]}: ${filters.caLam}` : ""}
            onChange={val => {
              if (!val) return setFilters({...filters, caLam: ""});
              const ca = val.split(":")[1].trim();
              setFilters({...filters, caLam: ca});
            }}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Ngày làm</label>
          <input type="date" className="form-control" value={filters.ngayLam} onChange={e => setFilters({...filters, ngayLam: e.target.value})}/>
        </div>
      </div>

      {/* TABLE */}
      <TableComponent
        title="Danh sách phân công"
        columns={columns}
        hiddenColumns={[0, 1, 3, 9, 11]} 
        data={filteredList}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            return (
              <td>
                <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditClick(row)}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(row)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />

      {/* =================== MODAL THÊM =================== */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm phân công</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nhân viên</label>
                  <SelectWithScroll
                    options={dataNguoiDung.map(n => `${n[0]}: ${n[1]}`)}
                    value={form.maNV ? `${form.maNV}: ${form.nhanVien}` : ""}
                    onChange={val => {
                      if (!val) return setForm({...form, maNV: "", nhanVien: ""});
                      const [ma, ten] = val.split(":");
                      setForm({...form, maNV: parseInt(ma), nhanVien: ten.trim()});
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ca làm</label>
                  <SelectWithScroll
                    options={dataThoiGianBieu.map(c => `${c[0]}: ${c[1]}`)}
                    value={form.maCa ? `${form.maCa}: ${form.caLam}` : ""}
                    onChange={val => {
                      if (!val) return setForm({...form, maCa: "", caLam: ""});
                      const [ma, ten] = val.split(":");
                      setForm({...form, maCa: parseInt(ma), caLam: ten.trim()});
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày làm</label>
                  <input type="date" className="form-control" value={form.ngayLam} onChange={e => setForm({...form, ngayLam: e.target.value})}/>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" value={form.trangThai} onChange={e => setForm({...form, trangThai: e.target.value})}>
                    <option>Đã phân công</option>
                    <option>Hoàn thành</option>
                    <option>Vắng</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Ghi chú</label>
                  <textarea className="form-control" value={form.ghiChu} onChange={e => setForm({...form, ghiChu: e.target.value})}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAdd}>Thêm</button>
            </div>
          </div>
        </div>
      </div>

      {/* =================== MODAL SỬA =================== */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sửa phân công</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nhân viên</label>
                  <SelectWithScroll
                    options={dataNguoiDung.map(n => `${n[0]}: ${n[1]}`)}
                    value={form.maNV ? `${form.maNV}: ${form.nhanVien}` : ""}
                    onChange={val => {
                      if (!val) return setForm({...form, maNV: "", nhanVien: ""});
                      const [ma, ten] = val.split(":");
                      setForm({...form, maNV: parseInt(ma), nhanVien: ten.trim()});
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ca làm</label>
                  <SelectWithScroll
                    options={dataThoiGianBieu.map(c => `${c[0]}: ${c[1]}`)}
                    value={form.maCa ? `${form.maCa}: ${form.caLam}` : ""}
                    onChange={val => {
                      if (!val) return setForm({...form, maCa: "", caLam: ""});
                      const [ma, ten] = val.split(":");
                      setForm({...form, maCa: parseInt(ma), caLam: ten.trim()});
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày làm</label>
                  <input type="date" className="form-control" value={form.ngayLam} onChange={e => setForm({...form, ngayLam: e.target.value})}/>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" value={form.trangThai} onChange={e => setForm({...form, trangThai: e.target.value})}>
                    <option>Đã phân công</option>
                    <option>Hoàn thành</option>
                    <option>Vắng</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Ghi chú</label>
                  <textarea className="form-control" value={form.ghiChu} onChange={e => setForm({...form, ghiChu: e.target.value})}></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* =================== MODAL XOÁ =================== */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Bạn có chắc muốn xóa bản ghi này?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleConfirmDelete}>Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhanCong;
