// src/pages/NhaCungCap.jsx
import React, { useState } from "react";
import TableComponent from "../components/TableComponent";
import { dataNhaCungCap } from "../data/dataNhaCungCap";

function NhaCungCap() {
  const [currentRow, setCurrentRow] = useState(null);
  const [searchName, setSearchName] = useState("");

  const columns = [
    "Mã NCC",
    "Tên NCC",
    "Địa chỉ",
    "SĐT",
    "Ngày cập nhật",
    "Tác vụ"
  ];

  

  // 📌 Lọc theo tên NCC
  const filteredData = dataNhaCungCap.filter(row =>
    row[1].toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Nhà cung cấp</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách nhà cung cấp cửa hàng.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo tên NCC..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      <TableComponent
        title="Danh sách nhà cung cấp"
        columns={columns}
        data={filteredData}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
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

      {/* (Toàn bộ 3 modal giữ nguyên) */}
      {/* Modal Thêm mới */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới nhà cung cấp</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên NCC</label>
                <input type="text" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ</label>
                <input type="text" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">SĐT</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal">Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa nhà cung cấp</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên NCC</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[1] : ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[2] : ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">SĐT</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[3] : ""}
                  readOnly
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
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
            <div className="modal-body">
              Bạn có chắc muốn xóa nhà cung cấp này?
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

export default NhaCungCap;
