// src/pages/PhieuNhap.jsx
import React, { useState, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { Link } from "react-router-dom";
import { dataPhieuNhap } from "../data/dataPhieuNhap";
import { dataNhaCungCap } from "../data/dataNhaCungCap";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { isRole } from "../utils/roleUtils";
import { useSession } from "../contexts/SessionContext";

function PhieuNhap() {
  const [data, setData] = useState(dataPhieuNhap);
  const [currentRow, setCurrentRow] = useState(null);

  const session = useSession();
  const isQuanLyCuaHang = isRole(session?.role, "Quản lý cửa hàng");
  const isQuanKho = isRole(session?.role, "Nhân viên kho");

  // Filter
  const [filterNgay, setFilterNgay] = useState("");
  const [filterNCC, setFilterNCC] = useState("Tất cả");
  const [filterNguoiNhap, setFilterNguoiNhap] = useState("Tất cả");

  // Form Thêm
  const [ngayNhapAdd, setNgayNhapAdd] = useState("");
  const [nccAdd, setNCCAdd] = useState("");
  const [nguoiNhapAdd, setNguoiNhapAdd] = useState("");
  const [tongTienAdd, setTongTienAdd] = useState("");

  // Form Sửa
  const [ngayNhapEdit, setNgayNhapEdit] = useState("");
  const [nccEdit, setNCCEdit] = useState("");
  const [nguoiNhapEdit, setNguoiNhapEdit] = useState("");
  const [tongTienEdit, setTongTienEdit] = useState("");

  const columns = ["Mã PN", "Ngày nhập", "Nhà cung cấp", "Người nhập", "Tổng tiền", "Tác vụ"];

  const filteredData = useMemo(() => {
    return dataPhieuNhap.filter(d => {
      const ngayMatch =
        !filterNgay || d[1] === filterNgay;

      const nccMatch =
        filterNCC === "Tất cả" || d[2] === parseInt(filterNCC);

      const nguoiNhapMatch =
        filterNguoiNhap === "Tất cả" || d[3] === parseInt(filterNguoiNhap);

      // --- Lọc theo vai trò ---
      const roleMatch = isQuanKho
        ? d[3] === parseInt(session?.id)  // chỉ lấy của chính mình
        : true;                           // còn lại lấy hết

      return ngayMatch && nccMatch && nguoiNhapMatch && roleMatch;
    });
  }, [filterNgay, filterNCC, filterNguoiNhap, isQuanKho, session?.id]);

  // Thêm mới
  const handleAdd = () => {
    if (!ngayNhapAdd || !nccAdd || !nguoiNhapAdd || !tongTienAdd) return;
    const newId = Math.max(...dataPhieuNhap.map(d => d[0])) + 1;
    const newRow = [newId, ngayNhapAdd, parseInt(nccAdd), parseInt(nguoiNhapAdd), parseInt(tongTienAdd)];
    dataPhieuNhap.push(newRow);
    setData([...data, newRow]);
    setNgayNhapAdd(""); setNCCAdd(""); setNguoiNhapAdd(""); setTongTienAdd("");
  };

  // Sửa
  const handleSave = () => {
    if (!currentRow) return;
    const updatedData = data.map(d =>
      d[0] === currentRow[0] ? [d[0], ngayNhapEdit, parseInt(nccEdit), parseInt(nguoiNhapEdit), parseInt(tongTienEdit)] : d
    );
    const indexDemo = dataPhieuNhap.findIndex(d => d[0] === currentRow[0]);
    if (indexDemo !== -1) dataPhieuNhap[indexDemo] = [currentRow[0], ngayNhapEdit, parseInt(nccEdit), parseInt(nguoiNhapEdit), parseInt(tongTienEdit)];
    setData(updatedData);
    setCurrentRow(null);
  };

  // Xóa
  const handleDelete = () => {
    if (!currentRow) return;
    const filtered = data.filter(d => d[0] !== currentRow[0]);
    setData(filtered);
    const indexDemo = dataPhieuNhap.findIndex(d => d[0] === currentRow[0]);
    if (indexDemo !== -1) dataPhieuNhap.splice(indexDemo, 1);
    setCurrentRow(null);
  };

  // Click Edit
  const handleEditClick = (row) => {
    setCurrentRow(row);
    setNgayNhapEdit(row[1]);
    setNCCEdit(row[2].toString());
    setNguoiNhapEdit(row[3].toString());
    setTongTienEdit(row[4].toString());
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Phiếu Nhập</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng dưới đây hiển thị các phiếu nhập hàng.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => { setNgayNhapAdd(""); setNCCAdd(""); setNguoiNhapAdd(""); setTongTienAdd(""); }}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Ngày nhập</label>
          <input type="date" className="form-control" value={filterNgay} onChange={e => setFilterNgay(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Nhà cung cấp</label>
          <SelectWithScroll
            options={["Tất cả", ...dataNhaCungCap.map(n => n[1])]}
            value={filterNCC === "Tất cả" ? "Tất cả" : dataNhaCungCap.find(n => n[0] === parseInt(filterNCC))?.[1]}
            onChange={val => { 
              if(val === "Tất cả") setFilterNCC("Tất cả");
              else { const n = dataNhaCungCap.find(n => n[1] === val); setFilterNCC(n ? n[0].toString() : ""); }
            }}
          />
        </div>
        {isQuanLyCuaHang && (
          <div className="col-md-3">
            <label className="form-label">Người nhập</label>
            <SelectWithScroll
              options={["Tất cả", ...dataNguoiDung.map(n => n[1])]}
              value={filterNguoiNhap === "Tất cả" ? "Tất cả" : dataNguoiDung.find(n => n[0] === parseInt(filterNguoiNhap))?.[1]}
              onChange={val => {
                if(val === "Tất cả") setFilterNguoiNhap("Tất cả");
                else { const nd = dataNguoiDung.find(n => n[1] === val); setFilterNguoiNhap(nd ? nd[0].toString() : ""); }
              }}
            />
          </div>
        )}
      </div>

      <TableComponent
        title="Danh sách Phiếu Nhập"
        columns={columns}
        data={filteredData.map(row => [
          row[0],
          row[1],
          dataNhaCungCap.find(n => n[0] === row[2])?.[1],
          dataNguoiDung.find(n => n[0] === row[3])?.[1],
          row[4].toLocaleString("vi-VN") + " VNĐ",
        ])}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            return (
              <td>
                <Link to={`/phieu-nhap/${row[0]}`} className="btn btn-info btn-sm me-1">
                  <i className="fas fa-search"></i>
                </Link>
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
              <h5 className="modal-title">Thêm Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nhà cung cấp</label>
                <SelectWithScroll
                  options={dataNhaCungCap.map(n => n[1])}
                  value={nccAdd ? dataNhaCungCap.find(n => n[0] === parseInt(nccAdd))?.[1] : ""}
                  onChange={val => { const n = dataNhaCungCap.find(n => n[1] === val); setNCCAdd(n ? n[0].toString() : ""); }}
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
              <h5 className="modal-title">Chỉnh sửa Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nhà cung cấp</label>
                <SelectWithScroll
                  options={dataNhaCungCap.map(n => n[1])}
                  value={nccEdit ? dataNhaCungCap.find(n => n[0] === parseInt(nccEdit))?.[1] : ""}
                  onChange={val => { const n = dataNhaCungCap.find(n => n[1] === val); setNCCEdit(n ? n[0].toString() : ""); }}
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
            <div className="modal-body">Bạn có chắc muốn xóa phiếu nhập này?</div>
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

export default PhieuNhap;
