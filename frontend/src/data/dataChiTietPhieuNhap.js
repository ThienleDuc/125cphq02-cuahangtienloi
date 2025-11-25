// src/data/dataChiTietPhieuNhap.js
import { dataSanPham } from "./dataSanPham";

// Dữ liệu mapping ban đầu: [MaPN, MaSP, SoLuong, DonGia]
const rawChiTietPhieuNhap = [
  [1, 1, 50, 3000],
  [1, 2, 30, 18000],
  [2, 1, 20, 3000],
  [2, 3, 10, 12000],
  [3, 2, 25, 18000],
  [3, 3, 40, 12000],
];

// Chuyển sang format đầy đủ: [MaPN, MaSP, TenSP, SoLuong, DonGia]
export const dataChiTietPhieuNhap = rawChiTietPhieuNhap.map(([maPN, maSP, soLuong, donGia]) => {
  const sanPham = dataSanPham.find(sp => sp[0] === maSP);
  return [
    maPN,
    maSP,
    sanPham ? sanPham[1] : "Không xác định",
    soLuong,
    donGia
  ];
});
