// src/pages/NguoiDung.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";

import { dataNguoiDung } from "../data/dataNguoiDung";
import { dataVaiTro } from "../data/dataVaiTro";
import { isRole } from "../utils/roleUtils";
import PasswordInput from "../components/PasswordInput";
import { useSession } from "../contexts/SessionContext";

const session = useSession;
const isQuanLyCuaHang = isRole(session?.role, "Quản lý cửa hàng")

function NguoiDung() {
  // Form dữ liệu Thêm/Sửa
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: "Hoạt động",
  });
  const [currentRow, setCurrentRow] = useState(null);

  // Filter tìm kiếm
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const statusOptions = ["Hoạt động", "Khóa"];

  const columns = [
    "Mã",
    "Họ tên",
    "Email",
    "Mật khẩu",
    "Trạng thái",
    "Ngày tạo",
    "Vai trò",
    "Tác vụ"
  ];

  // State ẩn/hiện mật khẩu theo từng row
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Đồng bộ formData khi chọn row
  useEffect(() => {
    if (currentRow) {
      setFormData({
        name: currentRow[1],
        email: currentRow[2],
        password: currentRow[3],
        role: currentRow[4],
        status: currentRow[5]
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        status: "Hoạt động"
      });
    }
  }, [currentRow]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredData = useMemo(() => {
    return dataNguoiDung.filter(row => {
      const name = row[1].toLowerCase();
      const role = row[6];   // role ở cột 6
      const status = row[4]; // trạng thái ở cột 4

      const matchName = name.includes(searchName.toLowerCase());
      const matchRole = searchRole ? role === searchRole : true;
      const matchStatus = searchStatus ? status === searchStatus : true;

      // Nếu là Quản lý cửa hàng, chỉ giữ role bắt đầu bằng "Nhân viên"
      if (isQuanLyCuaHang && !role.toLowerCase().startsWith("nhân viên")) {
        return false;
      }

      return matchName && matchRole && matchStatus;
    });
  }, [searchName, searchRole, searchStatus]);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">{isQuanLyCuaHang ? "Nhân viên" : "Người dùng"}</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">{isQuanLyCuaHang
          ? "Danh sách nhân viên hiển thị dưới đây."
          : "Danh sách người dùng hiển thị dưới đây."}
        </p>
        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          onClick={() => setCurrentRow(null)}
        >
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search filter */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">{isQuanLyCuaHang ? "Tên nhân viên" : "Tên người dùng"}</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Vai trò</label>
          <SelectWithScroll
            options={[
              "Tất cả",
              ...dataVaiTro
                .map(role => role[1])
                .filter(role => !isQuanLyCuaHang || role.toLowerCase().startsWith("nhân viên"))
            ]}
            value={searchRole || "Tất cả"}
            onChange={val => setSearchRole(val === "Tất cả" ? "" : val)}
            placeholder="Tất cả"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", ...statusOptions]}
            value={searchStatus || "Tất cả"}
            onChange={val => setSearchStatus(val === "Tất cả" ? "" : val)}
            placeholder="Tất cả"
          />
        </div>
      </div>

      <TableComponent
        title={isQuanLyCuaHang ? "Danh sách Nhân viên" : "Danh sách Người dùng"} // đổi tiêu đề tùy quyền
        columns={columns}
        data={filteredData}
        hiddenColumns={[3]} // ẩn cột mật khẩu
        renderCell={(cell, column, row) => {
          if (column === "Trạng thái") {
            return (
              <td>
                <span className={cell === "Hoạt động" ? "badge bg-success" : "badge bg-secondary"}>
                  {cell}
                </span>
              </td>
            );
          }

          if (column === "Mật khẩu") {
            const isShown = showPasswordMap[row[0]] || false;
            return (
              <td>
                <div className="d-flex align-items-center">
                  <input
                    type={isShown ? "text" : "password"}
                    className="form-control form-control-sm"
                    value={cell}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm ms-1"
                    onClick={() =>
                      setShowPasswordMap(prev => ({
                        ...prev,
                        [row[0]]: !prev[row[0]]
                      }))
                    }
                  >
                    <i className={`fas ${isShown ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </td>
            );
          }

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
                <h5 className="modal-title">Thêm mới người dùng</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={e => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={e => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <div className="input-group">
                    <PasswordInput
                      value={formData.password}
                      onChange={e => handleChange("password", e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Vai trò</label>
                  <SelectWithScroll
                    options={
                      // Nếu là Quản lý cửa hàng, chỉ hiển thị role bắt đầu bằng "Nhân viên"
                      isQuanLyCuaHang
                        ? dataVaiTro.map(r => r[1]).filter(role => role.toLowerCase().startsWith("nhân viên"))
                        : dataVaiTro.map(r => r[1])
                    }
                    value={formData.role}
                    onChange={val => handleChange("role", val)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <SelectWithScroll
                    options={["Tất cả", ...statusOptions]}
                    value={formData.status}
                    onChange={val => handleChange("status", val)}
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
                <h5 className="modal-title">Chỉnh sửa người dùng</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={e => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={e => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <div className="input-group">
                    <PasswordInput
                      value={formData.password}
                      onChange={e => handleChange("password", e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Vai trò</label>
                  <SelectWithScroll
                    options={
                      // Nếu là Quản lý cửa hàng, chỉ hiển thị role bắt đầu bằng "Nhân viên"
                      isQuanLyCuaHang
                        ? dataVaiTro.map(r => r[1]).filter(role => role.toLowerCase().startsWith("nhân viên"))
                        : dataVaiTro.map(r => r[1])
                    }
                    value={formData.role}
                    onChange={val => handleChange("role", val)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <SelectWithScroll
                    options={["Tất cả", ...statusOptions]}
                    value={formData.status}
                    onChange={val => handleChange("status", val)}
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
              Bạn có chắc muốn xóa người dùng này?
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

export default NguoiDung;
