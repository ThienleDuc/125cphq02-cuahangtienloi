import React, { createContext, useState, useContext, useEffect } from "react";

// Tạo context
const SessionContext = createContext(null);

// Provider
export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    // Lấy dữ liệu từ localStorage lúc khởi tạo
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Cập nhật localStorage mỗi khi session thay đổi
  useEffect(() => {
    if (session) {
      localStorage.setItem("currentUser", JSON.stringify(session));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [session]);

  // Hàm login
  const login = (user) => {
    setSession(user);
  };

  // Hàm logout
  const logout = () => {
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook tiện lợi để sử dụng
export const useSession = () => useContext(SessionContext);
