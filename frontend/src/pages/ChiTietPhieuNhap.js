// src/pages/ChiTietPhieuNhap.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import Breadcrumb from "../components/Breadcrumb";
import { dataChiTietPhieuNhap } from "../data/dataChiTietPhieuNhap";
import { dataSanPham } from "../data/dataSanPham";

function ChiTietPhieuNhap() {
  const { maPN } = useParams();
  const [data, setData] = useState([]);
  const [currentRow, setCurrentRow] = useState(null);

  // Form Thêm/Sửa
  const [selectedSP, setSelectedSP] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [donGia, setDonGia] = useState("");

  // Filter
  const [filterSP, setFilterSP] = useState("");

  // Lọc dữ liệu theo Mã phiếu nhập và filter SP
  const displayedData = useMemo(() => {
    return dataChiTietPhieuNhap.filter(d =>
      d[0] === Number(maPN) &&
      (!filterSP || d[1] === parseInt(filterSP))
    );
  }, [maPN, filterSP]);

  useEffect(() => {
    setData(displayedData);
  }, [displayedData]);

  const handleEditClick = (row) => {
    setCurrentRow(row);
    setSelectedSP(row[1].toString());
    setSoLuong(row[3].toString());
    setDonGia(row[4].toString());
  };

  const handleAdd = () => {
    if (!selectedSP || !soLuong || !donGia) return;
    const sp = dataSanPham.find(s => s[0] === parseInt(selectedSP));
    const newRow = [
      Number(maPN),
      parseInt(selectedSP),
      sp ? sp[1] : "Không xác định",
      parseInt(soLuong),
      parseInt(donGia)
    ];
    dataChiTietPhieuNhap.push(newRow);
    setData([...data, newRow]);
    setSelectedSP(""); setSoLuong(""); setDonGia("");
  };

  const handleSave = () => {
    if (!currentRow) return;
    const sp = dataSanPham.find(s => s[0] === parseInt(selectedSP));
    const updatedData = data.map(d =>
      d[0] === currentRow[0] && d[1] === currentRow[1]
        ? [d[0], parseInt(selectedSP), sp ? sp[1] : "Không xác định", parseInt(soLuong), parseInt(donGia)]
        : d
    );
    const indexDemo = dataChiTietPhieuNhap.findIndex(d => d[0] === currentRow[0] && d[1] === currentRow[1]);
    if (indexDemo !== -1) {
      dataChiTietPhieuNhap[indexDemo] = [Number(maPN), parseInt(selectedSP), sp ? sp[1] : "Không xác định", parseInt(soLuong), parseInt(donGia)];
    }
    setData(updatedData);
    setCurrentRow(null);
  };

  const handleDelete = () => {
    if (!currentRow) return;
    const filtered = data.filter(d => !(d[0] === currentRow[0] && d[1] === currentRow[1]));
    setData(filtered);
    const indexDemo = dataChiTietPhieuNhap.findIndex(d => d[0] === currentRow[0] && d[1] === currentRow[1]);
    if (indexDemo !== -1) dataChiTietPhieuNhap.splice(indexDemo, 1);
    setCurrentRow(null);
  };

  const columns = ["Mã PN", "Sản phẩm", "Số lượng", "Đơn giá", "Tác vụ"];

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Chi Tiết Phiếu Nhập</h1>
      <Breadcrumb
        items={[
          { name: "Phiếu Nhập", link: "/phieu-nhap" },
          { name: `Chi Tiết Phiếu Nhập #${maPN}` }
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">Bảng hiển thị chi tiết sản phẩm trong phiếu nhập.</p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => { setSelectedSP(""); setSoLuong(""); setDonGia(""); }}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Sản phẩm</label>
          <SelectWithScroll
            options={["Tất cả", ...dataSanPham.map(s => s[1])]}
            value={
              filterSP
                ? dataSanPham.find(s => s[0] === parseInt(filterSP))?.[1]
                : "Tất cả"
            }
            onChange={(val) => {
              if (val === "Tất cả") {
                setFilterSP("");
              } else {
                const sp = dataSanPham.find(s => s[1] === val);
                setFilterSP(sp ? sp[0].toString() : "");
              }
            }}
          />
        </div>
      </div>

      <TableComponent
        title="Danh sách Chi Tiết Phiếu Nhập"
        columns={columns}
        data={data}
        renderCell={(cell, column, row) => {
          if (column === "Mã PN") return <td>{row[0]}</td>;
          if (column === "Sản phẩm") return <td>{row[2]}</td>;
          if (column === "Số lượng") return <td>{row[3]}</td>;
          if (column === "Đơn giá") return <td>{row[4].toLocaleString("vi-VN")} VNĐ</td>;
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
              <h5 className="modal-title">Thêm Chi Tiết Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={dataSanPham.map(s => s[1])}
                  value={selectedSP ? dataSanPham.find(s => s[0] === parseInt(selectedSP))?.[1] : ""}
                  onChange={(val) => { const sp = dataSanPham.find(s => s[1] === val); setSelectedSP(sp ? sp[0].toString() : ""); }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input type="number" className="form-control" value={soLuong} onChange={e => setSoLuong(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input type="number" className="form-control" value={donGia} onChange={e => setDonGia(e.target.value)} />
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
              <h5 className="modal-title">Chỉnh sửa Chi Tiết Phiếu Nhập</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Sản phẩm</label>
                <SelectWithScroll
                  options={dataSanPham.map(s => s[1])}
                  value={selectedSP ? dataSanPham.find(s => s[0] === parseInt(selectedSP))?.[1] : ""}
                  onChange={(val) => { const sp = dataSanPham.find(s => s[1] === val); setSelectedSP(sp ? sp[0].toString() : ""); }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng</label>
                <input type="number" className="form-control" value={soLuong} onChange={e => setSoLuong(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Đơn giá</label>
                <input type="number" className="form-control" value={donGia} onChange={e => setDonGia(e.target.value)} />
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
            <div className="modal-body">Bạn có chắc muốn xóa chi tiết phiếu nhập này?</div>
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

export default ChiTietPhieuNhap;
