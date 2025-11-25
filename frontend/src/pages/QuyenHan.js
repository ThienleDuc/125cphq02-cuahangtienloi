// src/pages/QuyenHan.jsx
import React, { useState } from "react";
import TableComponent from "../components/TableComponent";
import { dataQuyenHan } from "../data/dataQuyenHan";

function QuyenHan() {
  const [currentRow, setCurrentRow] = useState(null);
  const [filterName, setFilterName] = useState("");


  const columns = ["Mã", "Tên quyền", "Mô tả", "Vai trò", "Tác vụ"];

  // Filter theo Tên quyền
  const filteredData =  dataQuyenHan.filter(d =>
    d[1].toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quyền hạn</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị danh sách quyền hạn.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Thanh tìm kiếm giống Phiếu Nhập */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo tên quyền..."
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
        />
      </div>

      <TableComponent
        title="Danh sách quyền hạn"
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

      {/* Modal Thêm mới */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới quyền hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên quyền</label>
                <input type="text" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input type="text" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Vai trò</label>
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
              <h5 className="modal-title">Chỉnh sửa quyền hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tên quyền</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[1] : ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[2] : ""}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Vai trò</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentRow ? currentRow[3] : ""}
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
              Bạn có chắc muốn xóa quyền hạn này?
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

export default QuyenHan;
