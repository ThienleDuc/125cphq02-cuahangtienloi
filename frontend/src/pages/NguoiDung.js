// src/pages/NguoiDung.jsx
import React, { useState, useMemo, useEffect } from "react";
import TableComponent from "../components/TableComponent";
import SelectWithScroll from "../components/SelectWithScroll";
import PasswordInput from "../components/PasswordInput";
import { useSession } from "../contexts/SessionContext";
import { getRoleFlags } from "../utils/roleCheck";
import { getUsersByFilter } from "../data/dataNguoiDung";
import { getUserById } from "../data/dataNguoiDung";
import { dataVaiTro } from "../data/dataVaiTro";

function NguoiDung() {
  const { session } = useSession();
  const { isQuanLyCuaHang } = getRoleFlags(session?.role);

  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");      
  const [searchRoleName, setSearchRoleName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const statusOptions = ["Hoạt động", "Khóa"];
  const [editUserNameInput, setUserNameInput] = useState("");
  const [editUserEmailInput, setUserEmailInput] = useState("");
  const [editUserPasswordInput, setUserPasswordInput] = useState("");
  const [, setEditUserRole] = useState("");
  const [editUserRoleName, setEditUserRoleName] = useState("");
  const [editUserStatus, setEditUserStatus] = useState("Hoạt động");
  
  const columns = ["Mã", "Họ tên", "Email", "Mật khẩu", "Trạng thái", "Ngày tạo", "Vai trò", "Tác vụ"];

  // Lọc dữ liệu
  const filteredUsers = useMemo(() => {
    const safeName = searchName.trim();
    const safeRole = searchRole.trim();
    const safeStatus = searchStatus.trim();

    let data = getUsersByFilter({
      name: safeName,
      role: safeRole,
      status: safeStatus,
    });

    if (isQuanLyCuaHang) {
      data = data.filter(u =>
        u.role?.name?.toLowerCase().startsWith("nhân viên")
      );
    }

    return data;
  }, [searchName, searchRole, searchStatus, isQuanLyCuaHang]);

  // set data-* cho modal Bootstrap
  useEffect(() => {
    const editModalEl = document.getElementById("editModal");
    if (!editModalEl) return;

    const handleShow = (event) => {
      const button = event.relatedTarget;
      const userId = button.getAttribute("data-user-id");
      if (!userId) return;

      const user = getUserById(userId);
      if (!user) return;

      setUserNameInput(user.name || "");
      setUserEmailInput(user.email || "");
      setUserPasswordInput(user.password || user._password || "");
      setEditUserRole(user.role?.id || "");
      setEditUserRoleName(user.role?.name || "");
      setEditUserStatus(user.status || "Hoạt động");
    };

    editModalEl.addEventListener("show.bs.modal", handleShow);

    return () => editModalEl.removeEventListener("show.bs.modal", handleShow);
  }, []);

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">{isQuanLyCuaHang ? "Nhân viên" : "Người dùng"}</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="mb-0">{isQuanLyCuaHang ? "Danh sách nhân viên hiển thị dưới đây." : "Danh sách người dùng hiển thị dưới đây."}</p>
        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addModal">
          <i className="fas fa-plus me-1"></i> Thêm mới
        </button>
      </div>

      {/* Search Filter */}
      <div className="row g-2 mb-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">{isQuanLyCuaHang ? "Tên nhân viên" : "Tên người dùng"}</label>
          <input type="text" className="form-control" placeholder="Nhập tên..." value={searchName} onChange={e => setSearchName(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Vai trò</label>
          <SelectWithScroll
            options={["Tất cả", ...dataVaiTro
              .filter(r => !isQuanLyCuaHang || r.name.toLowerCase().startsWith("nhân viên"))
              .map(r => r.name)
            ]}
            value={searchRoleName || "Tất cả"}
            onChange={val => {
              if (val === "Tất cả") {
                setSearchRole("");
                setSearchRoleName("Tất cả");
              } else {
                const selectedRole = dataVaiTro.find(r => r.name === val);
                if (selectedRole) {
                  setSearchRole(selectedRole.id);
                  setSearchRoleName(selectedRole.name);
                }
              }
            }}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Trạng thái</label>
          <SelectWithScroll
            options={["Tất cả", ...statusOptions]}
            value={searchStatus === "" ? "Tất cả" : searchStatus}
            onChange={val => setSearchStatus(val === "Tất cả" ? "" : val)}
          />
        </div>
      </div>

      {/* Table */}
      <TableComponent
        title={isQuanLyCuaHang ? "Danh sách Nhân viên" : "Danh sách Người dùng"}
        columns={columns}
        data={filteredUsers.map(u => [
          u.id,
          u.name,
          u.email,
          u.password,
          u.status,
          u.createdAt,
          u.role?.name || ""
        ])}
        hiddenColumns={[3]} // ẩn mật khẩu
        renderCell={(cell, column, row, rowIndex) => {
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
            return <td><PasswordInput className="form-control form-control-sm" value={cell} readOnly /></td>;
          }

          if (column === "Tác vụ") {
            const user = row; // row là object
            if (!user) return <td></td>;

            return (
              <td>
                <button
                  className="btn btn-primary btn-sm me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  data-user-id={row[0]} 
                >
                  <i className="fas fa-edit"></i>
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  data-user-id={row[0]}
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
              <h5 className="modal-title">Thêm mới người dùng</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
              <label className="form-label">Họ tên</label>
              <input
                type="text"
                className="form-control"
                value={editUserNameInput}
                onChange={e => setUserNameInput(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={editUserEmailInput}
                onChange={e => setUserEmailInput(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="text"
                className="form-control"
                value={editUserPasswordInput}
                onChange={e => setUserPasswordInput(e.target.value)}
              />
            </div>
              <div className="mb-3">
                <label className="form-label">Vai trò</label>
                <SelectWithScroll
                  options={dataVaiTro
                    .filter(r => !isQuanLyCuaHang || r.name.toLowerCase().startsWith("nhân viên"))
                    .map(r => r.name)}
                  value={editUserRoleName || dataVaiTro.find(r => !isQuanLyCuaHang || r.name.toLowerCase().startsWith("nhân viên"))?.name || ""}
                  onChange={val => {
                    const selectedRole = dataVaiTro.find(r => r.name === val);
                    if (selectedRole) {
                      setEditUserRole(selectedRole.id);
                      setEditUserRoleName(selectedRole.name);
                    }
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={statusOptions}
                  value={editUserStatus}
                  onChange={val => setEditUserStatus(val)}
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

      {/* Modal Edit */}
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
                  value={editUserNameInput}
                  onChange={e => setUserNameInput(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUserEmailInput}
                  onChange={e => setUserEmailInput(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUserPasswordInput}
                  onChange={e => setUserPasswordInput(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Vai trò</label>
                <SelectWithScroll
                  options={dataVaiTro
                    .filter(r => !isQuanLyCuaHang || r.name.toLowerCase().startsWith("nhân viên"))
                    .map(r => r.name)}
                  value={editUserRoleName}
                  onChange={val => {
                    const selectedRole = dataVaiTro.find(r => r.name === val);
                    if (selectedRole) {
                      setEditUserRole(selectedRole.id);
                      setEditUserRoleName(selectedRole.name);
                    }
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <SelectWithScroll
                  options={statusOptions}
                  value={editUserStatus}
                  onChange={val => setEditUserStatus(val)}
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

      {/* Modal Delete */}
      <div className="modal fade" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc muốn xóa người dùng <strong id="deleteUserName"></strong>?</p>
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
