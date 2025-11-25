import React, { useState } from "react";
import TableComponent from "../components/TableComponent";
import { dataThoiGianBieu } from "../data/dataThoiGianBieu";

function ThoiGianBieu() {
  const [, setCurrentRow] = useState(null);

  const columns = [
    "Mã ca",
    "Tên ca",
    "Giờ bắt đầu",
    "Giờ kết thúc",
    "Tổng giờ",
    "Tiền công/giờ",
    "Tiền công/ca",
    "Ngày áp dụng",
    "Trạng thái",
    "Ghi chú",
    "Tác vụ"
  ];

  const [addForm, setAddForm] = useState({
    tenCa: "",
    gioBatDau: "",
    gioKetThuc: "",
    tienCongGio: "",
    ngayApDung: "",
    trangThai: "Hoạt động",
    ghiChu: ""
  });

  const [editForm, setEditForm] = useState(addForm);

  const [filter, setFilter] = useState({
    tenCa: "",
    trangThai: ""
  });

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setEditForm({
      tenCa: row[1],
      gioBatDau: row[2],
      gioKetThuc: row[3],
      tienCongGio: row[5],
      ngayApDung: row[7],
      trangThai: row[8],
      ghiChu: row[9]
    });
  };

  // --- Lọc dữ liệu theo bộ lọc ---
  const filteredData = dataThoiGianBieu.filter(row => {
    if (filter.tenCa && !row[1].toLowerCase().includes(filter.tenCa.toLowerCase())) return false;
    if (filter.trangThai && row[8] !== filter.trangThai) return false;
    return true;
  });

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thời gian biểu</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách ca làm việc của cửa hàng.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* --- Bộ lọc tìm kiếm --- */}
        <div className="row g-3 mb-3">
            <div className="col-md-3">
                <label className="form-label">Tìm theo tên ca</label>
                <input
                type="text"
                className="form-control"
                value={filter.tenCa}
                onChange={(e) => setFilter({ ...filter, tenCa: e.target.value })}
                placeholder="Nhập tên ca..."
                />
            </div>
            <div className="col-md-2">
                <label className="form-label">Trạng thái</label>
                <select
                className="form-select"
                value={filter.trangThai}
                onChange={(e) => setFilter({ ...filter, trangThai: e.target.value })}
                >
                <option value="">Tất cả</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                </select>
            </div>
            <div className="col-md-7">
                {/* Có thể thêm bộ lọc khác hoặc để trống */}
            </div>
        </div>

      <TableComponent
        title="Danh sách ca làm"
        columns={columns}
        data={filteredData}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") return (
            <td>
              <button className="btn btn-primary btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleEditClick(row)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setCurrentRow(row)}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </td>
          );
          return <td>{cell}</td>;
        }}
      />

      {/* --- Modal Thêm mới --- */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới ca làm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên ca</label>
                  <input type="text" className="form-control" value={addForm.tenCa} onChange={e => setAddForm({ ...addForm, tenCa: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tiền công/giờ</label>
                  <input type="number" className="form-control" value={addForm.tienCongGio} onChange={e => setAddForm({ ...addForm, tienCongGio: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giờ bắt đầu</label>
                  <input type="time" className="form-control" value={addForm.gioBatDau} onChange={e => setAddForm({ ...addForm, gioBatDau: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giờ kết thúc</label>
                  <input type="time" className="form-control" value={addForm.gioKetThuc} onChange={e => setAddForm({ ...addForm, gioKetThuc: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày áp dụng</label>
                  <input type="date" className="form-control" value={addForm.ngayApDung} onChange={e => setAddForm({ ...addForm, ngayApDung: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" value={addForm.trangThai} onChange={e => setAddForm({ ...addForm, trangThai: e.target.value })}>
                    <option>Hoạt động</option>
                    <option>Ngưng hoạt động</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Ghi chú</label>
                  <input type="text" className="form-control" value={addForm.ghiChu} onChange={e => setAddForm({ ...addForm, ghiChu: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal">Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Sửa --- */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa ca làm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên ca</label>
                  <input type="text" className="form-control" value={editForm.tenCa} onChange={e => setEditForm({ ...editForm, tenCa: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tiền công/giờ</label>
                  <input type="number" className="form-control" value={editForm.tienCongGio} onChange={e => setEditForm({ ...editForm, tienCongGio: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giờ bắt đầu</label>
                  <input type="time" className="form-control" value={editForm.gioBatDau} onChange={e => setEditForm({ ...editForm, gioBatDau: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Giờ kết thúc</label>
                  <input type="time" className="form-control" value={editForm.gioKetThuc} onChange={e => setEditForm({ ...editForm, gioKetThuc: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày áp dụng</label>
                  <input type="date" className="form-control" value={editForm.ngayApDung} onChange={e => setEditForm({ ...editForm, ngayApDung: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" value={editForm.trangThai} onChange={e => setEditForm({ ...editForm, trangThai: e.target.value })}>
                    <option>Hoạt động</option>
                    <option>Ngưng hoạt động</option>
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Ghi chú</label>
                  <input type="text" className="form-control" value={editForm.ghiChu} onChange={e => setEditForm({ ...editForm, ghiChu: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Xóa --- */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">Bạn có chắc muốn xóa ca làm này?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal">Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThoiGianBieu;
