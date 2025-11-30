// src/pages/QuyenHan.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { dataQuyenHan, getPermissionById, getPermissionFilter } from "../data/dataQuyenHan";

function QuyenHan() {
  const [filterKeyword, setFilterKeyword] = useState("");
  const [currentRow, setCurrentRow] = useState(null);

  // State cho modal thêm/sửa
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const columns = ["Mã", "Tên quyền", "Mô tả", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    const keyword = filterKeyword.trim();
    if (!keyword) return dataQuyenHan;
    return getPermissionFilter(keyword);
  }, [filterKeyword]);

  // Khi mở modal Edit, set dữ liệu
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    if (!editModalEl) return;

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const permissionId = button.getAttribute("data-permission-id");
      if (!permissionId) return;

      const permission = getPermissionById(permissionId);
      if (!permission) return;

      setCurrentRow(permission);
      setEditName(permission.name || "");
      setEditDescription(permission.description || "");
    };

    editModalEl.addEventListener("show.bs.modal", handleShow);

    return () => editModalEl.removeEventListener("show.bs.modal", handleShow);
  }, []);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quyền hạn</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách quyền hạn hiển thị dưới đây.</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search Filter */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm theo tên hoặc mô tả..."
          value={filterKeyword}
          onChange={e => setFilterKeyword(e.target.value)}
        />
      </div>

      {/* Table */}
      <TableComponent
        title="Danh sách quyền hạn"
        columns={columns}
        data={filteredData.map(p => [p.id, p.name, p.description])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            const permission = row; // row là object
            if (!permission) return <td></td>;
            return (
              <td>
                <button
                  className="btn btn-primary btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-permission-id={row[0]}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-permission-id={row[0]}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            );
          }

          return <td>{cell}</td>;
        }}
      />

      {/* Modal Add */}
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
                <input type="text" className="form-control" value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input type="text" className="form-control" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal">Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
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
                <input type="text" className="form-control" value={editName} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <input type="text" className="form-control" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal">Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Bạn có chắc muốn xóa quyền hạn <strong>{currentRow?.name}</strong> không?
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
