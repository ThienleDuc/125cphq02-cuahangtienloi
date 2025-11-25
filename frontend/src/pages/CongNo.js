// src/pages/CongNo.jsx
import React, { useState } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import { dataCongNo as initialDataCongNo } from "../data/dataCongNo";
import { dataNhaCungCap } from "../data/dataNhaCungCap";

function CongNo() {
  const [dataCongNo, setDataCongNo] = useState(initialDataCongNo);
  const [currentRow, setCurrentRow] = useState(null);
  const [doiTuongAdd, setDoiTuongAdd] = useState("Nhà cung cấp");
  const [doiTuongEdit, setDoiTuongEdit] = useState("Nhà cung cấp");

  const [addForm, setAddForm] = useState({
    loai: "Phải thu",
    doiTuong: "Nhà cung cấp",
    soTien: "",
    hanThanhToan: "",
    maHoaDon: "",
    tenKhachHang: "",
    tenNhaCungCap: ""
  });

  const [editForm, setEditForm] = useState({
    loai: "",
    doiTuong: "Nhà cung cấp",
    soTien: "",
    hanThanhToan: "",
    maHoaDon: "",
    tenKhachHang: "",
    tenNhaCungCap: ""
  });

  const [filter, setFilter] = useState({
    loai: "",
    doiTuong: "",
    tenDoiTuong: "",
    trangThai: ""
  });

  const columns = [
    "Mã công nợ",
    "Loại công nợ",
    "Đối tượng",
    "Số tiền",
    "Hạn thanh toán",
    "Trạng thái",
    "Mã hóa đơn",
    "Tên Khách hàng",
    "Mã Nhà cung cấp",
    "Tên nhà cung cấp",
    "Tác vụ"
  ];

  const openModal = (id) => {
    const modal = new window.bootstrap.Modal(document.getElementById(id));
    modal.show();
  };

  // --- Xử lý thao tác ---
  const handleEditClick = (row) => {
    setCurrentRow(row);
    setDoiTuongEdit(row[2]);
    setEditForm({
      loai: row[1],
      doiTuong: row[2],
      soTien: row[3],
      hanThanhToan: row[4],
      maHoaDon: row[6] || "",
      tenKhachHang: row[7] || "",
      tenNhaCungCap: row[9] || ""
    });
    openModal("editModal");
  };

  const handleViewClick = (row) => {
    setCurrentRow(row);
    openModal("viewModal");
  };

  const handleDeleteClick = (row) => {
    setCurrentRow(row);
    openModal("deleteModal");
  };

  const handleAddSubmit = () => {
    const newRow = [
      dataCongNo.length + 1,
      addForm.loai,
      addForm.doiTuong,
      Number(addForm.soTien),
      addForm.hanThanhToan,
      "Chưa thanh toán",
      addForm.maHoaDon ? Number(addForm.maHoaDon) : null,
      addForm.tenKhachHang || null,
      addForm.doiTuong === "Nhà cung cấp" ? dataNhaCungCap.find(n => n[1] === addForm.tenNhaCungCap)?.[0] : null,
      addForm.doiTuong === "Nhà cung cấp" ? addForm.tenNhaCungCap : null
    ];
    setDataCongNo([...dataCongNo, newRow]);
  };

  const handleEditSubmit = () => {
    const updatedData = dataCongNo.map(row => {
      if (row[0] === currentRow[0]) {
        return [
          row[0],
          editForm.loai,
          editForm.doiTuong,
          Number(editForm.soTien),
          editForm.hanThanhToan,
          row[5],
          editForm.maHoaDon ? Number(editForm.maHoaDon) : null,
          editForm.tenKhachHang || null,
          editForm.doiTuong === "Nhà cung cấp" ? dataNhaCungCap.find(n => n[1] === editForm.tenNhaCungCap)?.[0] : null,
          editForm.doiTuong === "Nhà cung cấp" ? editForm.tenNhaCungCap : null
        ];
      }
      return row;
    });
    setDataCongNo(updatedData);
  };

  const handleDeleteConfirm = () => {
    setDataCongNo(dataCongNo.filter(row => row[0] !== currentRow[0]));
  };

  // --- Bộ lọc dữ liệu ---
  const filteredData = dataCongNo.filter(row => {
    if (filter.loai && row[1] !== filter.loai) return false;
    if (filter.doiTuong && row[2] !== filter.doiTuong) return false;

    if (filter.tenDoiTuong) {
      if (filter.doiTuong === "Khách hàng" && row[7] && !row[7].toLowerCase().includes(filter.tenDoiTuong.toLowerCase()))
        return false;
      if (filter.doiTuong === "Nhà cung cấp" && row[9] && !row[9].toLowerCase().includes(filter.tenDoiTuong.toLowerCase()))
        return false;
    }

    if (filter.trangThai && row[5] !== filter.trangThai) return false;

    return true;
  });

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Công nợ</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Danh sách công nợ của cửa hàng.</p>
        <button
          className="btn btn-success"
          onClick={() => {
            setAddForm({
              loai: "Phải thu",
              doiTuong: "Nhà cung cấp",
              soTien: "",
              hanThanhToan: "",
              maHoaDon: "",
              tenKhachHang: "",
              tenNhaCungCap: ""
            });
            setDoiTuongAdd("Nhà cung cấp");
            openModal("addModal");
          }}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <label className="form-label">Loại công nợ</label>
          <select
            className="form-select"
            value={filter.loai}
            onChange={(e) => setFilter({ ...filter, loai: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="Phải thu">Phải thu</option>
            <option value="Phải trả">Phải trả</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Đối tượng</label>
          <select
            className="form-select"
            value={filter.doiTuong}
            onChange={(e) => setFilter({ ...filter, doiTuong: e.target.value, tenDoiTuong: "" })}
          >
            <option value="">Tất cả</option>
            <option value="Nhà cung cấp">Nhà cung cấp</option>
            <option value="Khách hàng">Khách hàng</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">{filter.doiTuong === "Khách hàng" ? "Tên khách hàng" : "Tên nhà cung cấp"}</label>
          <input
            type="text"
            className="form-control"
            value={filter.tenDoiTuong}
            onChange={(e) => setFilter({ ...filter, tenDoiTuong: e.target.value })}
            disabled={!filter.doiTuong}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Trạng thái</label>
          <select
            className="form-select"
            value={filter.trangThai}
            onChange={(e) => setFilter({ ...filter, trangThai: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="Chưa thanh toán">Chưa thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <TableComponent
        title="Danh sách công nợ"
        columns={columns}
        data={filteredData}
        hiddenColumns={[8, 0]}
        renderCell={(cell, column, row) => {
          if (column === "Tác vụ") {
            return (
              <td className="text-nowrap">
                <button className="btn btn-info btn-sm me-1" onClick={() => handleViewClick(row)}>
                  <i className="fas fa-search"></i>
                </button>
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

      {/* --- Modal Thêm mới --- */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm mới công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Loại công nợ</label>
                  <select
                    className="form-select"
                    value={addForm.loai}
                    onChange={(e) => setAddForm({ ...addForm, loai: e.target.value })}
                  >
                    <option>Phải thu</option>
                    <option>Phải trả</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Đối tượng</label>
                  <select
                    className="form-select"
                    value={addForm.doiTuong}
                    onChange={(e) => {
                      setDoiTuongAdd(e.target.value);
                      setAddForm({ ...addForm, doiTuong: e.target.value });
                    }}
                  >
                    <option>Nhà cung cấp</option>
                    <option>Khách hàng</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Số tiền</label>
                  <input
                    type="number"
                    className="form-control"
                    value={addForm.soTien}
                    onChange={(e) => setAddForm({ ...addForm, soTien: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Hạn thanh toán</label>
                  <input
                    type="date"
                    className="form-control"
                    value={addForm.hanThanhToan}
                    onChange={(e) => setAddForm({ ...addForm, hanThanhToan: e.target.value })}
                  />
                </div>

                {doiTuongAdd === "Khách hàng" && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Mã hóa đơn</label>
                      <input
                        type="number"
                        className="form-control"
                        value={addForm.maHoaDon}
                        onChange={(e) => setAddForm({ ...addForm, maHoaDon: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tên khách hàng</label>
                      <input
                        type="text"
                        className="form-control"
                        value={addForm.tenKhachHang}
                        onChange={(e) => setAddForm({ ...addForm, tenKhachHang: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {doiTuongAdd === "Nhà cung cấp" && (
                  <div className="col-md-12">
                    <label className="form-label">Tên nhà cung cấp</label>
                    <SelectWithScroll
                      options={dataNhaCungCap.map(n => n[1])}
                      value={addForm.tenNhaCungCap}
                      onChange={(val) => setAddForm({ ...addForm, tenNhaCungCap: val })}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-success" data-bs-dismiss="modal" onClick={handleAddSubmit}>Thêm mới</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Sửa --- */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentRow && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Loại công nợ</label>
                    <select
                      className="form-select"
                      value={editForm.loai}
                      onChange={(e) => setEditForm({ ...editForm, loai: e.target.value })}
                    >
                      <option>Phải thu</option>
                      <option>Phải trả</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Đối tượng</label>
                    <select
                      className="form-select"
                      value={editForm.doiTuong}
                      onChange={(e) => {
                        setDoiTuongEdit(e.target.value);
                        setEditForm({ ...editForm, doiTuong: e.target.value });
                      }}
                    >
                      <option>Nhà cung cấp</option>
                      <option>Khách hàng</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số tiền</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.soTien}
                      onChange={(e) => setEditForm({ ...editForm, soTien: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hạn thanh toán</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.hanThanhToan}
                      onChange={(e) => setEditForm({ ...editForm, hanThanhToan: e.target.value })}
                    />
                  </div>

                  {doiTuongEdit === "Khách hàng" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Mã hóa đơn</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editForm.maHoaDon}
                          onChange={(e) => setEditForm({ ...editForm, maHoaDon: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tên khách hàng</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.tenKhachHang}
                          onChange={(e) => setEditForm({ ...editForm, tenKhachHang: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {doiTuongEdit === "Nhà cung cấp" && (
                    <div className="col-md-12">
                      <label className="form-label">Tên nhà cung cấp</label>
                      <SelectWithScroll
                        options={dataNhaCungCap.map(n => n[1])}
                        value={editForm.tenNhaCungCap || ""}
                        onChange={(val) => setEditForm({ ...editForm, tenNhaCungCap: val })}
                        placeholder="Chọn nhà cung cấp"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleEditSubmit}>Lưu</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Xóa --- */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xóa công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentRow && <p>Bạn có chắc muốn xóa công nợ này không?</p>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteConfirm}>Xóa</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal Xem chi tiết --- */}
      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết công nợ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {currentRow ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Mã công nợ:</strong> {currentRow[0]}
                  </div>
                  <div className="col-md-6">
                    <strong>Loại công nợ:</strong> {currentRow[1]}
                  </div>
                  <div className="col-md-6">
                    <strong>Đối tượng:</strong> {currentRow[2]}
                  </div>
                  <div className="col-md-6">
                    <strong>Số tiền:</strong> {currentRow[3].toLocaleString()} VNĐ
                  </div>
                  <div className="col-md-6">
                    <strong>Hạn thanh toán:</strong> {currentRow[4]}
                  </div>
                  <div className="col-md-6">
                    <strong>Trạng thái:</strong> {currentRow[5]}
                  </div>
                  {currentRow[6] !== null && (
                    <div className="col-md-6">
                      <strong>Mã hóa đơn:</strong> {currentRow[6]}
                    </div>
                  )}
                  {currentRow[7] && (
                    <div className="col-md-6">
                      <strong>Tên khách hàng:</strong> {currentRow[7]}
                    </div>
                  )}
                  {currentRow[8] !== null && (
                    <div className="col-md-6">
                      <strong>Mã nhà cung cấp:</strong> {currentRow[8]}
                    </div>
                  )}
                  {currentRow[9] && (
                    <div className="col-md-6">
                      <strong>Tên nhà cung cấp:</strong> {currentRow[9]}
                    </div>
                  )}
                </div>
              ) : (
                <p>Không có dữ liệu.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CongNo;
