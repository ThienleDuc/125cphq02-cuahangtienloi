// src/data/dataChiTietHoaDon.js
import { dataSanPham } from "./dataSanPham";

// Dữ liệu gốc: [MaHD, MaSP, SoLuong, DonGia, ThanhTien]
const rawChiTietHoaDon = [
  [1, 1, 10, 5000],
  [1, 2, 5, 22000],
  [2, 1, 20, 5000],
  [2, 3, 10, 15000],
];

// Chuyển sang format đầy đủ: [MaHD, MaSP, TenSP, SoLuong, DonGia, ThanhTien]
export const dataChiTietHoaDon = rawChiTietHoaDon.map(([maHD, maSP, soLuong, donGia]) => {
  const sp = dataSanPham.find(s => s[0] === maSP);
  return [
    maHD,
    maSP,
    sp ? sp[1] : "Không xác định",
    soLuong,
    donGia,
    soLuong * donGia
  ];
});
