import { dataNguoiDung } from "./dataNguoiDung";

// Dữ liệu gốc
const rawHoaDon = [
  [1, "2025-01-05", 1, "Tiền mặt", 150000, "Đã thanh toán"],
  [2, "2025-02-12", 2, "Chuyển khoản", 250000, "Đã thanh toán"],
  [3, "2025-03-20", 4, "Thẻ ngân hàng", 100000, "Đã hủy"],
  [4, "2025-03-25", 3, "Tiền mặt", 200000, "Đã thanh toán"],
  [5, "2025-04-10", 4, "Chuyển khoản", 300000, "Đã thanh toán"],
];

// Chuyển sang format có tên người lập
export const dataHoaDon = rawHoaDon.map(([maHD, ngayLap, maNguoiDung, phuongThucTT, tongTien, trangThai]) => {
  const nguoiDung = dataNguoiDung.find(nd => nd[0] === maNguoiDung);
  return [
    maHD,
    ngayLap,
    maNguoiDung,
    nguoiDung ? nguoiDung[1] : "Không xác định", // Tên người lập
    phuongThucTT,
    tongTien,
    trangThai
  ];
});
