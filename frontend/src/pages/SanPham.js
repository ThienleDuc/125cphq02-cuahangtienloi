// src/pages/SanPham.jsx
import React, { useState } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { dataSanPham } from "../data/dataSanPham";
import { getRoleFlags } from "../utils/roleCheck";
import { useSession } from "../contexts/SessionContext";

function SanPham() {
  const [currentRow, setCurrentRow] = useState(null);

  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);

  // Bộ lọc
  const [searchName, setSearchName] = useState("");     // Tìm theo tên
  const [filterStatus, setFilterStatus] = useState(""); // Trạng thái
  const [filterType, setFilterType] = useState("");     // Bán chạy / Tồn kho

  // Form Thêm / Sửa
  const [addForm, setAddForm] = useState({
    tenSP: "",
    giaNhap: "",
    giaBan: "",
    soLuong: "",
    donVi: "",
    trangThai: true
  });
  const [editForm, setEditForm] = useState(addForm);

  const columns = [
    "Mã SP",
    "Tên sản phẩm",
    "Giá nhập",
    "Giá bán",
    "Số lượng tồn",
    "Đơn vị tính",
    "Trạng thái",
    "Ngày cập nhật",
    ...(isQuanLyCuaHang ? ["Tác vụ"] : [])
  ];

  const statusOptions = ["Tất cả", "Hoạt động", "Ngưng bán"];
  const filterOptions = ["Tất cả", "Bán chạy", "Tồn kho"];

  // Lọc dữ liệu
  const filteredData = dataSanPham.filter(row => {
    if (searchName && !row[1].toLowerCase().includes(searchName.toLowerCase())) return false;
    if (filterStatus === "Hoạt động" && !row[6]) return false;
    if (filterStatus === "Ngưng bán" && row[6]) return false;
    if (filterType === "Bán chạy" && row[4] <= 100) return false;
    if (filterType === "Tồn kho" && !(row[4] > 0 && row[4] <= 50)) return false;
    return true;
  });

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Sản phẩm</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-3">Danh sách sản phẩm của cửa hàng tiện lợi.</p>
          {isQuanLyCuaHang && (
            <button
            className="btn btn-success ms-md-auto mt-3 mt-md-0"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            <i className="fas fa-plus me-1"></i> Thêm mới
          </button>
          )}
      </div>

      {/* --- Bộ lọc tìm kiếm --- */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên sản phẩm..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <div className="col-md-2 d-flex">
        </div>
        </div>
        <div className="col-md-2">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Tất cả"
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Kiểu lọc</label>
          <SelectWithScroll
            options={filterOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Tất cả"
          />
        </div>
      </div>

      <TableComponent
        title="Danh sách sản phẩm"
        columns={columns}
        data={filteredData}
        renderCell={(cell, column, row) => {
          if (column === "Trạng thái") {
            return (
              <td>
                <span className={cell ? "badge bg-success" : "badge bg-secondary"}>
                  {cell ? "Hoạt động" : "Ngưng bán"}
                </span>
              </td>
            );
          }
          if (column === "Tác vụ" && isQuanLyCuaHang) {
            return (
              <td>
                <button
                  className="btn btn-primary btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => setCurrentRow(row)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  onClick={() => setCurrentRow(row)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }
          return <td>{cell}</td>;
        }}
      />

      {/* --- Modal Thêm mới --- */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm sản phẩm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tên sản phẩm</label>
                  <input type="text" className="form-control" value={addForm.tenSP} onChange={e => setAddForm({ ...addForm, tenSP: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá nhập</label>
                  <input type="number" className="form-control" value={addForm.giaNhap} onChange={e => setAddForm({ ...addForm, giaNhap: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Giá bán</label>
                  <input type="number" className="form-control" value={addForm.giaBan} onChange={e => setAddForm({ ...addForm, giaBan: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Số lượng</label>
                  <input type="number" className="form-control" value={addForm.soLuong} onChange={e => setAddForm({ ...addForm, soLuong: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Đơn vị tính</label>
                  <input type="text" className="form-control" value={addForm.donVi} onChange={e => setAddForm({ ...addForm, donVi: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" value={addForm.trangThai} onChange={e => setAddForm({ ...addForm, trangThai: e.target.value === "true" })}>
                    <option value="true">Hoạt động</option>
                    <option value="false">Ngưng bán</option>
                  </select>
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
              <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentRow && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Tên sản phẩm</label>
                    <input type="text" className="form-control" value={editForm.tenSP || currentRow[1]} onChange={e => setEditForm({ ...editForm, tenSP: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Giá nhập</label>
                    <input type="number" className="form-control" value={editForm.giaNhap || currentRow[2]} onChange={e => setEditForm({ ...editForm, giaNhap: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Giá bán</label>
                    <input type="number" className="form-control" value={editForm.giaBan || currentRow[3]} onChange={e => setEditForm({ ...editForm, giaBan: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Số lượng</label>
                    <input type="number" className="form-control" value={editForm.soLuong || currentRow[4]} onChange={e => setEditForm({ ...editForm, soLuong: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Đơn vị tính</label>
                    <input type="text" className="form-control" value={editForm.donVi || currentRow[5]} onChange={e => setEditForm({ ...editForm, donVi: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-select" value={editForm.trangThai ?? currentRow[6]} onChange={e => setEditForm({ ...editForm, trangThai: e.target.value === "true" })}>
                      <option value="true">Hoạt động</option>
                      <option value="false">Ngưng bán</option>
                    </select>
                  </div>
                </div>
              )}
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
            <div className="modal-body">
              Bạn có chắc muốn xóa sản phẩm <strong>{currentRow?.[1]}</strong>?
            </div>
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

export default SanPham;
