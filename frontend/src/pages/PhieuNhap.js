// src/pages/PhieuNhap.jsx
import React, { useState, useMemo } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { Link } from "react-router-dom";
import { dataPhieuNhap } from "../data/dataPhieuNhap";
import { dataNhaCungCap } from "../data/dataNhaCungCap";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";

function PhieuNhap() {
  const [data, setData] = useState(dataPhieuNhap);
  const [currentRow, setCurrentRow] = useState(null);

  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);
  const { isQuanKho } = getRoleFlags(session?.role);

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

  const columns = ["Mã PN", "Ngày nhập", "Mã NCC", "Nhà cung cấp", "Mã người nhập", "Người nhập", "Tổng tiền", "Tác vụ"];

  // Filter dữ liệu
  const filteredData = useMemo(() => {
    return data.filter(d => {
      const ngayMatch = !filterNgay || d[1] === filterNgay;
      const nccMatch = filterNCC === "Tất cả" || d[2] === parseInt(filterNCC);
      const nguoiNhapMatch = filterNguoiNhap === "Tất cả" || d[4] === parseInt(filterNguoiNhap);
      const roleMatch = isQuanKho ? d[4] === parseInt(session?.id) : true;
      return ngayMatch && nccMatch && nguoiNhapMatch && roleMatch;
    });
  }, [filterNgay, filterNCC, filterNguoiNhap, isQuanKho, session?.id, data]);

  // Thêm mới
  const handleAdd = () => {
    if (!ngayNhapAdd || !nccAdd || !nguoiNhapAdd || !tongTienAdd) return;
    const newId = Math.max(...data.map(d => d[0])) + 1;
    const nccObj = dataNhaCungCap.find(n => n[0] === parseInt(nccAdd));
    const nguoiNhapObj = dataNguoiDung.find(n => n[0] === parseInt(nguoiNhapAdd));
    const newRow = [
      newId,
      ngayNhapAdd,
      parseInt(nccAdd),
      nccObj ? nccObj[1] : "",
      parseInt(nguoiNhapAdd),
      nguoiNhapObj ? nguoiNhapObj[1] : "",
      parseInt(tongTienAdd)
    ];
    setData([...data, newRow]);
    setNgayNhapAdd(""); setNCCAdd(""); setNguoiNhapAdd(""); setTongTienAdd("");
  };

  // Sửa
  const handleSave = () => {
    if (!currentRow) return;
    const nccObj = dataNhaCungCap.find(n => n[0] === parseInt(nccEdit));
    const nguoiNhapObj = dataNguoiDung.find(n => n[0] === parseInt(nguoiNhapEdit));
    const updatedData = data.map(d =>
      d[0] === currentRow[0]
        ? [
            d[0],
            ngayNhapEdit,
            parseInt(nccEdit),
            nccObj ? nccObj[1] : "",
            parseInt(nguoiNhapEdit),
            nguoiNhapObj ? nguoiNhapObj[1] : "",
            parseInt(tongTienEdit)
          ]
        : d
    );
    setData(updatedData);
    setCurrentRow(null);
  };

  // Xóa
  const handleDelete = () => {
    if (!currentRow) return;
    setData(data.filter(d => d[0] !== currentRow[0]));
    setCurrentRow(null);
  };

  // Click Edit
  const handleEditClick = (row) => {
    setCurrentRow(row);
    setNgayNhapEdit(row[1]);
    setNCCEdit(row[2].toString());
    setNguoiNhapEdit(row[4].toString());
    setTongTienEdit(row[6].toString());
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
        hiddenColumns={[2, 4]}
        data={filteredData.map(row => [
          row[0], // Mã PN
          row[1], // Ngày nhập
          row[2], // Mã NCC
          row[3], // Tên NCC
          row[4], // Mã người nhập
          row[5], // Người nhập
          row[6].toLocaleString("vi-VN") + " VNĐ"
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
