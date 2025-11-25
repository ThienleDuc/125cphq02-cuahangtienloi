// src/pages/ChiTietHoaDon.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import Breadcrumb from "../components/Breadcrumb";
import { dataChiTietHoaDon } from "../data/dataChiTietHoaDon";
import { dataSanPham } from "../data/dataSanPham";

function ChiTietHoaDon() {
  const { maHD } = useParams();
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);
  const [selectedSP, setSelectedSP] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [donGia, setDonGia] = useState("");
  const [filterSP, setFilterSP] = useState("");

  useEffect(() => {
    // Lọc theo MaHD và filterSP mỗi khi filterSP thay đổi
    const filtered = dataChiTietHoaDon
      .filter(d => d[0] === Number(maHD))
      .filter(d => !filterSP || filterSP === "all" || d[1] === Number(filterSP));
    setData(filtered);
  }, [maHD, filterSP]);

  const columns = ["Mã HĐ", "Mã sản phẩm", "Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền", "Tác vụ"];

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setSelectedSP(row[1]);
    setSoLuong(row[3]);
    setDonGia(row[4]);
  };

  const handleAdd = () => {
    if (!selectedSP || !soLuong || !donGia) return;
    const thanhTien = Number(soLuong) * Number(donGia);
    const newRow = [Number(maHD), Number(selectedSP), Number(soLuong), Number(donGia), thanhTien];
    setData([...data, newRow]);
    setSelectedSP("");
    setSoLuong("");
    setDonGia("");
  };

  const handleSave = () => {
    if (!currentRow) return;
    const thanhTien = Number(soLuong) * Number(donGia);
    const updatedData = data.map(d =>
      d[0] === currentRow[0] && d[1] === currentRow[1]
        ? [d[0], d[1], Number(soLuong), Number(donGia), thanhTien]
        : d
    );
    setData(updatedData);
    setCurrentRow(null);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Chi Tiết Hóa Đơn</h1>
      <Breadcrumb
        items={[
          { name: "Hóa Đơn", link: "/lap-hoa-don" },
          { name: `Chi Tiết Hóa Đơn #${maHD}` }
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-2">
        <p className="mb-0">Bảng hiển thị chi tiết sản phẩm trong hóa đơn.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => {
            setSelectedSP("");
            setSoLuong("");
            setDonGia("");
          }}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Bộ lọc Sản phẩm (tự động render) */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label small">Sản phẩm</label>
          <SelectWithScroll
            options={["Tất cả", ...dataSanPham.map(s => s[1])]}
            value={
              filterSP === "all" || !filterSP
                ? "Tất cả"
                : dataSanPham.find(s => s[0] === Number(filterSP))?.[1] || ""
            }
            onChange={val => {
              if (val === "Tất cả") setFilterSP("all");
              else {
                const sp = dataSanPham.find(s => s[1] === val);
                setFilterSP(sp ? sp[0].toString() : "");
              }
            }}
          />
        </div>
      </div>

      <TableComponent
        title="Danh sách Chi Tiết Hóa Đơn"
        columns={columns}
        hiddenColumns={[1]}
        data={data}
        renderCell={(cell, column, row) => {
          // Tác vụ vẫn giữ nút sửa/xóa
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

          // Render tất cả các cột còn lại trực tiếp
          return <td>{cell}</td>;
        }}
      />

      {/* Modal Thêm mới */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Thêm Chi Tiết Hóa Đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={dataSanPham.map(s => s[1])}
                  value={dataSanPham.find(s => s[0] === selectedSP)?.[1] || ""}
                  onChange={val => {
                    const sp = dataSanPham.find(s => s[1] === val);
                    setSelectedSP(sp ? sp[0] : "");
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={soLuong}
                  onChange={e => setSoLuong(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={donGia}
                  onChange={e => setDonGia(e.target.value)}
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
              <h5 className="modal-title">Chỉnh sửa Chi Tiết Hóa Đơn</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={dataSanPham.map(s => s[1])}
                  value={dataSanPham.find(s => s[0] === selectedSP)?.[1] || ""}
                  onChange={val => {
                    const sp = dataSanPham.find(s => s[1] === val);
                    setSelectedSP(sp ? sp[0] : "");
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input
                  type="number"
                  className="form-control"
                  value={soLuong}
                  onChange={e => setSoLuong(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={donGia}
                  onChange={e => setDonGia(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thành tiền</label>
                <input
                  type="number"
                  className="form-control"
                  value={soLuong && donGia ? soLuong * donGia : 0}
                  readOnly
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
            <div className="modal-body">Bạn có chắc muốn xóa chi tiết hóa đơn này?</div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Không</button>
              <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => {
                if (!currentRow) return;
                setData(data.filter(d => !(d[0] === currentRow[0] && d[1] === currentRow[1])));
                setCurrentRow(null);
              }}>Có</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChiTietHoaDon;
