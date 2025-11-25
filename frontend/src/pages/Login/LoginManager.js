// src/pages/LoginManager.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../utils/auth";
import PasswordInput from "../../components/PasswordInput";
import { getRoleFlags } from "../../utils/roleCheck";
import { useSession } from "../../contexts/SessionContext";

function LoginManager() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useSession();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = handleLogin(email, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    const flags = getRoleFlags(result.user.role);

    // Kiểm tra role Quản lý cửa hàng
    if (!flags.isQuanLyCuaHang) {
      setError("Bạn không có quyền truy cập trang Quản lý cửa hàng!");
      return;
    }

    // Lưu session
    login(result.user);

    // Điều hướng sang trang chính của Quản lý cửa hàng
    navigate("/nguoi-dung");
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">
          <i className="fas fa-store"></i> Đăng nhập Quản lý cửa hàng
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text"><i className="fas fa-user"></i></span>
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

          <button type="submit" className="btn btn-success w-100 mb-2">
            Đăng nhập
          </button>

          <div className="text-center mt-2">
            <a href="/forgot-password" className="small text-decoration-none text-secondary">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginManager;
