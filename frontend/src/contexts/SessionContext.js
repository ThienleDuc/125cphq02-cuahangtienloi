import React, { createContext, useState, useContext, useEffect } from "react";
import User from "../models/User"; // import class User

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return null;

    try {
      const obj = JSON.parse(saved);
      // Chuyển plain object thành instance User
      return new User(
        obj._id,
        obj._name,
        obj._email,
        obj._password,
        obj._status,
        obj._createdAt,
        obj._role,
        obj._avatar
      );
    } catch (err) {
      console.error("Lỗi load session:", err);
      return null;
    }
  });

  useEffect(() => {
    if (session) {
      const payload = {
        _id: session.id,
        _name: session.name,
        _email: session.email,
        _password: session.password,
        _status: session.status,
        _createdAt: session.createdAt,
        _role: session.role,
        _avatar: session.avatar,
      };
      localStorage.setItem("currentUser", JSON.stringify(payload));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [session]);

  const login = (user) => {
    setSession(user);
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
