// src/pages/VaiTro.js
import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { dataVaiTro } from "../data/dataVaiTro";

function VaiTro() {
  // Form dữ liệu Thêm/Sửa
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [currentRow, setCurrentRow] = useState(null);

  const columns = ["Mã", "Tên vai trò", "Mô tả", "Tác vụ"];

  // Đồng bộ formData khi chọn row để sửa
  useEffect(() => {
    if (currentRow) {
      setFormData({ name: currentRow[1], description: currentRow[2] });
    } else {
      setFormData({ name: "", description: "" });
    }
  }, [currentRow]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Vai trò</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách vai trò trong hệ thống.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => setCurrentRow(null)}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      <TableComponent
        title="Danh sách vai trò"
        columns={columns}
        data={dataVaiTro}
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

      {/* Modal Thêm */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm vai trò mới</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={e => handleChange("description", e.target.value)}
                />
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
              <h5 className="modal-title">Chỉnh sửa vai trò</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên vai trò</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={e => handleChange("name", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={e => handleChange("description", e.target.value)}
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
              Bạn có chắc muốn xóa vai trò này?
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

export default VaiTro;
