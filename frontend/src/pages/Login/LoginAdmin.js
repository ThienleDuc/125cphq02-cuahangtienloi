// src/pages/LoginAdmin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../utils/auth";
import PasswordInput from "../../components/PasswordInput";
import { getRoleFlags } from "../../utils/roleCheck";
import { useSession } from "../../contexts/SessionContext";

function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Gọi handleLogin
    const result = handleLogin(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // ---- KIỂM TRA ROLE DÙNG roleCheck ----
    const flags = getRoleFlags(result.user.role);

    if (!flags.isQuanTriHeThong) {
      setError("Bạn không có quyền truy cập trang Quản trị hệ thống!");
      return;
    }

    login(result.user); // lưu session vào context
    navigate("/nguoi-dung");
    window.location.reload();
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">
          <i className="fas fa-users-cog"></i> Đăng nhập Quản trị viên
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;
