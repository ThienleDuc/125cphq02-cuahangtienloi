// src/pages/ThanhToanCa.jsx
import React, { useState, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import { FaCheck, FaRegCircle, FaUserClock, FaMoneyBillWave } from "react-icons/fa"; 
import SelectWithScroll from "../components/SelectWithScroll";
import { getRoleFlags } from "../utils/roleCheck";

import { dataChamCong } from "../data/dataChamCong";
import { dataNguoiDung } from "../data/dataNguoiDung";
import { useSession } from "../contexts/SessionContext";

function ThanhToanCa() {
  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);
  const { isThuNgan } = getRoleFlags(session?.role);
  const { isQuanKho } = getRoleFlags(session?.role);

  const [data, setData] = useState(
    dataChamCong.map(row => {
      const [
        maChamCong,
        maLichNV,
        maNV,
        tenNV,
        maCa,
        tenCa,
        gioVao,
        gioRa,
        tongGio,
        tien,
        tienCongGio,
        trangThai,
        ngayLam,
        ghiChu
      ] = row;
      return {
        id: maChamCong,
        maLichNV,
        maNV,
        tenNV,
        maCa,
        tenCa,
        gioVao,
        gioRa,
        tongGio,
        tien,
        tienCongGio,
        trangThai,
        ngayLam,
        ghiChu,
        selected: false,
        chamCongDone: false
      };
    })
  );

  // ====== FILTER STATE ======
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterMaNV, setFilterMaNV] = useState("");   
  const [filterTenNV, setFilterTenNV] = useState(""); 
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const employees = dataNguoiDung.map(u => ({ maNV: u[0], tenNV: u[1] }));

  // ====== LỌC DỮ LIỆU ======
    useEffect(() => {
      let filtered = [...data];

      // --- Lọc theo ngày ---
      if (filterStart) filtered = filtered.filter(d => d.ngayLam >= filterStart);
      if (filterEnd) filtered = filtered.filter(d => d.ngayLam <= filterEnd);

      // --- Lọc theo vai trò ---
      if (isQuanLyCuaHang) {
        // giữ nguyên, không lọc theo id
      } else if (isQuanKho || isThuNgan) {
        // Nhân viên kho & thu ngân chỉ xem dữ liệu của chính mình
        filtered = filtered.filter(d => String(d.maNV) === String(session?.id));
      }

      // --- Lọc theo các trường khác ---
      if (filterMaNV) filtered = filtered.filter(d => String(d.maNV) === String(filterMaNV));
      if (filterTenNV) filtered = filtered.filter(d => d.tenNV === filterTenNV);
      if (filterTrangThai) filtered = filtered.filter(d => d.trangThai === filterTrangThai);

      setFilteredData(filtered);
    }, [
      filterStart,
      filterEnd,
      filterMaNV,
      filterTenNV,
      filterTrangThai,
      data,
      isQuanLyCuaHang,
      isQuanKho,
      isThuNgan,
      session?.id
    ]);

  const tongTien = filteredData.reduce(
    (acc, row) => (row.selected ? acc + row.tien : acc),
    0
  );

  const handleThanhToanTatCa = () => {
    const newData = data.map(r =>
      r.selected && r.trangThai === "Chưa thanh toán"
        ? { ...r, trangThai: "Đã thanh toán" }
        : r
    );
    setData(newData);
    alert("Đã thanh toán các dòng đã chọn!");
  };

  const columns = [
    "Mã chấm công",
    "Mã nhân viên",
    "Tên nhân viên",
    "Mã ca",
    "Tên ca",
    "Ngày làm",
    "Giờ vào",
    "Giờ ra",
    "Tổng giờ làm",
    "Tiền thực lãnh",
    "Tiền công giờ",
    "Trạng thái",
    "Ghi chú",
    "Tác vụ"
  ];

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Thanh Toán & Chấm Công</h1>
      <p className="mb-3">Danh sách thanh toán & chấm công.</p>

      {/* ====== FILTER ====== */}
      <div className="row g-3 mb-3 align-items-end">
        <div className="col-md-2">
          <label className="form-label">Ngày bắt đầu</label>
          <input
            type="date"
            className="form-control"
            value={filterStart}
            onChange={e => setFilterStart(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Ngày kết thúc</label>
          <input
            type="date"
            className="form-control"
            value={filterEnd}
            onChange={e => setFilterEnd(e.target.value)}
          />
        </div>

        {isQuanLyCuaHang && (
         <>
           <div className="col-md-2">
              <label className="form-label">Mã nhân viên</label>
              <SelectWithScroll
                options={["Tất cả", ...employees.map(e => e.maNV)]}
                value={filterMaNV || "Tất cả"}
                onChange={val => setFilterMaNV(val === "Tất cả" ? "" : val)}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Tên nhân viên</label>
              <SelectWithScroll
                options={["Tất cả", ...employees.map(e => e.tenNV)]}
                value={filterTenNV || "Tất cả"}
                onChange={val => setFilterTenNV(val === "Tất cả" ? "" : val)}
              />
            </div>
         </>
        )}

        <div className="col-md-2">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", "Chưa thanh toán", "Đã thanh toán"]}
            value={filterTrangThai || "Tất cả"}
            onChange={val => setFilterTrangThai(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* ====== TABLE ====== */}
      <TableComponent
        title="Danh sách thanh toán ca"
        columns={columns}
        hiddenColumns={[0, 1, 3, 8]}
        data={filteredData.map(row => [
          row.id,
          row.maNV,
          row.tenNV,
          row.maCa,
          row.tenCa,
          row.ngayLam,
          row.gioVao,
          row.gioRa,
          row.tongGio,
          row.tien.toLocaleString(),
          row.tienCongGio,
          row.trangThai,
          row.ghiChu,
          ""
        ])}
        renderCell={(cell, column, row) => {
          const dataRow = filteredData.find(d => d.id === row[0]);
          if (column === "Tác vụ") {
            return (
              <td className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  title="Chấm công"
                  onClick={() => {
                    const updated = data.map(r =>
                      r.id === dataRow.id
                        ? { ...r, chamCongDone: true, gioVao: r.gioVao || "08:00" }
                        : r
                    );
                    setData(updated);
                  }}
                  disabled={dataRow.gioVao !== "" || dataRow.chamCongDone}
                >
                  <FaUserClock />
                </button>
                {isQuanLyCuaHang && (
                  <button
                  className="btn btn-outline-success btn-sm"
                  title="Thanh toán"
                  onClick={() => {
                    const updated = data.map(r =>
                      r.id === dataRow.id && r.trangThai === "Chưa thanh toán"
                        ? { ...r, trangThai: "Đã thanh toán" }
                        : r
                    );
                    setData(updated);
                  }}
                  disabled={dataRow.trangThai === "Đã thanh toán"}
                >
                  <FaMoneyBillWave />
                </button>
                )}
                <label
                  className="btn btn-outline-secondary btn-sm mb-0"
                  onClick={() => {
                    const updated = data.map(r =>
                      r.id === dataRow.id ? { ...r, selected: !r.selected } : r
                    );
                    setData(updated);
                  }}
                >
                  {dataRow.selected ? <FaCheck /> : <FaRegCircle />}
                </label>
              </td>
            );
          }
          if (column === "Tiền thực lãnh") return <td>{dataRow.tien.toLocaleString()} VNĐ</td>;
          return <td>{cell}</td>;
        }}
      />

      <div className="d-flex align-items-center justify-content-between mt-3 gap-3">
        {/* Checkbox Chọn tất cả */}
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="selectAll"
            checked={filteredData.every(row => row.selected) && filteredData.length > 0}
            onChange={e => {
              const checked = e.target.checked;
              const updated = data.map(r =>
                filteredData.find(f => f.id === r.id)
                  ? { ...r, selected: checked }
                  : r
              );
              setData(updated);
            }}
          />
          <label className="form-check-label" htmlFor="selectAll">
            Chọn tất cả
          </label>
        </div>

        {/* Tổng tiền & Thanh toán */}
        <div className="d-flex align-items-center gap-2">
          <label className="me-2 mb-0">Tổng tiền:</label>
          <input
            type="text"
            className="form-control"
            readOnly
            value={`${tongTien.toLocaleString()} VNĐ`}
            style={{ width: 160 }}
          />
          {isQuanLyCuaHang && (
            <button
            className="btn btn-success"
            style={{ height: "40px" }}
            onClick={handleThanhToanTatCa}
          >
            Thanh Toán
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThanhToanCa;
