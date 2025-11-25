// src/utils/auth.js
import { dataNguoiDung } from "../data/dataNguoiDung";

/**
 * Hàm kiểm tra login (tích hợp fakeLogin + auth)
 * @param {string} email 
 * @param {string} password
 * @returns {object} { success, message, user }
 */
export function handleLogin(email, password) {
  if (!email || !password) {
    return {
      success: false,
      message: "Vui lòng nhập đầy đủ email và mật khẩu",
      user: null,
    };
  }

  // ---- LOGIN (fake database) ----
  const user = dataNguoiDung.find(u =>
    String(u[2]).trim().toLowerCase() === email.trim().toLowerCase() &&
    String(u[3]).trim() === password.trim()
  );

  if (!user) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng",
      user: null
    };
  }

  // ---- KIỂM TRA TRẠNG THÁI ----
  if (user[4] !== "Hoạt động") {
    return {
      success: false,
      message: "Tài khoản đã bị khóa",
      user: null
    };
  }

  // ---- TẠO OBJECT USER TRẢ VỀ ----
  const userObj = {
    id: user[0],
    name: user[1],
    email: user[2],
    role: user[6],      // tên role (chuỗi)
    status: user[4]
  };

  // ---- KHÔNG LƯU SESSION TẠI ĐÂY ----
  // Lưu session sẽ được thực hiện trong component login qua SessionContext

  return {
    success: true,
    message: "Đăng nhập thành công",
    user: userObj
  };
}
