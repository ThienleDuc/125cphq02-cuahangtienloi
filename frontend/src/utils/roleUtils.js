// src/data/roleUtils.js
import { dataVaiTro } from "../data/dataVaiTro";

/**
 * Lấy thông tin vai trò theo tên
 * @param {string} roleName - ví dụ: "Quản trị hệ thống"
 * @returns {object|null} { id, name, description } hoặc null nếu không tìm thấy
 */
export const getRoleByName = (roleName) => {
  const role = dataVaiTro.find(vt => vt[1] === roleName);
  if (!role) return null;
  return {
    id: role[0],
    name: role[1],
    description: role[2],
  };
};

/**
 * Kiểm tra role
 * @param {string} roleName - tên role của người dùng
 * @param {string} checkRole - role muốn kiểm tra
 * @returns {boolean}
 */
export const isRole = (roleName, checkRole) => roleName === checkRole;

/**
 * Lấy tất cả vai trò
 * @returns {Array} danh sách role dạng { id, name, description }
 */
export const getAllRoles = () => dataVaiTro.map(vt => ({
  id: vt[0],
  name: vt[1],
  description: vt[2],
}));
