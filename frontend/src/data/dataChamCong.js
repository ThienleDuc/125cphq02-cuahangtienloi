// src/data/dataChamCong.js
import { dataNguoiDung } from "./dataNguoiDung";
import { dataPhanCong } from "./dataPhanCong";
import { dataThoiGianBieu } from "./dataThoiGianBieu";

// Dữ liệu demo chấm công (giờ vào, giờ ra, trạng thái, ngày cập nhật, ghi chú)
export let dataChamCong = [
  [1, 1, "08:05", "12:00", "Chưa thanh toán", "2025-11-20", ""],
  [2, 2, "13:05", "17:10", "Đã thanh toán", "2025-11-21", ""],
  [3, 3, "", "", "Chưa thanh toán", "2025-11-22", "Nghỉ không phép"],
  [4, 4, "09:00", "13:15", "Đã thanh toán", "2025-11-23", ""],
  [5, 5, "08:30", "12:30", "Chưa thanh toán", "2025-11-24", ""],
  [6, 6, "", "16:00", "Đã thanh toán", "2025-11-25", ""],
  [7, 7, "08:00", "12:05", "Chưa thanh toán", "2025-11-26", ""],
  [8, 8, "", "", "Chưa thanh toán", "2025-11-27", "Ốm"],
  [9, 9, "07:50", "11:45", "Đã thanh toán", "2025-11-28", ""],
  [10, 10, "", "17:00", "Chưa thanh toán", "2025-11-29", ""],
  [11, 11, "08:10", "12:00", "Chưa thanh toán", "2025-11-30", ""],
  [12, 12, "", "", "Đã thanh toán", "2025-12-01", ""]
];

// Tạo dữ liệu có thông tin đầy đủ
dataChamCong = dataChamCong.map(row => {
  const [maChamCong, maLichNV, gioVao, gioRa, trangThai, ngayCapNhat, ghiChu] = row;

  // Lấy thông tin phân công dựa trên MaLichNV
  const phanCong = dataPhanCong.find(p => p[0] === maLichNV);
  const maNguoiDung = phanCong ? phanCong[1] : null;
  const maCa = phanCong ? phanCong[3] : null; // Lấy đúng MaCaLam

  // Lấy thông tin người dùng
  const nguoiDung = dataNguoiDung.find(u => u[0] === maNguoiDung);
  const tenNguoiDung = nguoiDung ? nguoiDung[1] : "";

  // Lấy thông tin ca làm
  const ca = dataThoiGianBieu.find(c => c[0] === maCa);
  const tenCa = ca ? ca[1] : "";
  const tienCongGio = ca ? ca[5] : 0;

  // Tính tổng giờ làm và tiền thực lãnh
  let tongGioLam = 0;
  let tienThucLanh = 0;
  if (gioVao && gioRa && tienCongGio > 0) {
    const [hV, mV] = gioVao.split(":").map(Number);
    const [hR, mR] = gioRa.split(":").map(Number);
    tongGioLam = (hR + mR / 60) - (hV + mV / 60);
    tienThucLanh = tongGioLam * tienCongGio;
  }

  return [
    maChamCong,       // 0
    maLichNV,         // 1
    maNguoiDung,      // 2
    tenNguoiDung,     // 3
    maCa,             // 4
    tenCa,            // 5
    gioVao,           // 6
    gioRa,            // 7
    parseFloat(tongGioLam.toFixed(2)), // 8
    tienThucLanh,     // 9
    tienCongGio,      // 10
    trangThai,        // 11
    ngayCapNhat,      // 12
    ghiChu            // 13
  ];
});
