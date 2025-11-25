// src/pages/VaiTroQuyenHan.jsx
import React, { useState, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { dataVaiTroQuyenHan } from "../data/dataVaiTroQuyenHan";
import { dataVaiTro } from "../data/dataVaiTro";
import { dataQuyenHan } from "../data/dataQuyenHan";

function VaiTroQuyenHan() {
  const [data, setData] = useState(dataVaiTroQuyenHan);
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({ vaiTro: "", quyenHan: "" });
  const [selectedVaiTro, setSelectedVaiTro] = useState("Tất cả");
  const [selectedQuyenHan, setSelectedQuyenHan] = useState("Tất cả");

  const columns = ["Mã Vai Trò", "Vai Trò", "Mã Quyền", "Quyền Hạn", "Tác vụ"];

  const handleAddClick = () => {
    setFormData({ vaiTro: "", quyenHan: "" });
    setCurrentRow(null);
  };

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setFormData({ vaiTro: row[1], quyenHan: row[3] });
  };

  // Lọc dữ liệu theo Vai Trò và Quyền Hạn
  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchVaiTro = selectedVaiTro === "Tất cả" || row[1] === selectedVaiTro;
      const matchQuyenHan = selectedQuyenHan === "Tất cả" || row[3] === selectedQuyenHan;
      return matchVaiTro && matchQuyenHan;
    });
  }, [data, selectedVaiTro, selectedQuyenHan]);

  // Thêm mới
  const handleAdd = () => {
    const vt = dataVaiTro.find(v => v[1] === formData.vaiTro);
    const qh = dataQuyenHan.find(q => q[1] === formData.quyenHan);
    if (!vt || !qh) return;

    const exists = data.some(d => d[0] === vt[0] && d[2] === qh[0]);
    if (exists) {
      alert("Vai trò và quyền hạn này đã tồn tại!");
      return;
    }

    const newRow = [vt[0], vt[1], qh[0], qh[1]];
    setData(prev => [...prev, newRow]);
    setFormData({ vaiTro: "", quyenHan: "" });
  };

  // Lưu chỉnh sửa
  const handleSave = () => {
    if (!currentRow) return;
    const vt = dataVaiTro.find(v => v[1] === formData.vaiTro);
    const qh = dataQuyenHan.find(q => q[1] === formData.quyenHan);
    if (!vt || !qh) return;

    const updatedData = data.map(d =>
      d[0] === currentRow[0] && d[2] === currentRow[2] ? [vt[0], vt[1], qh[0], qh[1]] : d
    );
    setData(updatedData);
    setCurrentRow(null);
  };

  // Xóa
  const handleDelete = () => {
    if (!currentRow) return;
    setData(prev => prev.filter(d => !(d[0] === currentRow[0] && d[2] === currentRow[2])));
    setCurrentRow(null);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Vai Trò & Quyền Hạn</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị mối quan hệ giữa vai trò và quyền hạn.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={handleAddClick}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Filter */}
      <div className="d-flex mb-3 gap-2 flex-wrap">
        <div style={{ flex: 1, minWidth: "100px", maxWidth: "200px" }}>
          <SelectWithScroll
            options={["Tất cả", ...dataVaiTro.map(vt => vt[1])]}
            value={selectedVaiTro}
            onChange={setSelectedVaiTro}
          />
        </div>
        <div style={{ flex: 1, minWidth: "100px", maxWidth: "200px" }}>
          <SelectWithScroll
            options={["Tất cả", ...dataQuyenHan.map(q => q[1])]}
            value={selectedQuyenHan}
            onChange={setSelectedQuyenHan}
          />
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <TableComponent
        title="Danh sách Vai Trò & Quyền Hạn"
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
                  onClick={() => handleEditClick(row)}
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
              <h5 className="modal-title">Thêm mới Vai Trò & Quyền Hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Vai Trò</label>
                <SelectWithScroll
                  options={dataVaiTro.map(vt => vt[1])}
                  value={formData.vaiTro}
                  onChange={val => setFormData(prev => ({ ...prev, vaiTro: val }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quyền Hạn</label>
                <SelectWithScroll
                  options={dataQuyenHan.map(q => q[1])}
                  value={formData.quyenHan}
                  onChange={val => setFormData(prev => ({ ...prev, quyenHan: val }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAdd}>
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa Vai Trò & Quyền Hạn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Vai Trò</label>
                <SelectWithScroll
                  options={dataVaiTro.map(vt => vt[1])}
                  value={formData.vaiTro}
                  onChange={val => setFormData(prev => ({ ...prev, vaiTro: val }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quyền Hạn</label>
                <SelectWithScroll
                  options={dataQuyenHan.map(q => q[1])}
                  value={formData.quyenHan}
                  onChange={val => setFormData(prev => ({ ...prev, quyenHan: val }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSave}>
                Lưu
              </button>
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
            <div className="modal-body">Bạn có chắc muốn xóa bản ghi này?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                Có
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default VaiTroQuyenHan;
