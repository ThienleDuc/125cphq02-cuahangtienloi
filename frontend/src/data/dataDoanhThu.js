// src/data/dataDoanhThu.js
import { dataSanPham } from "./dataSanPham";
import { dataHoaDon } from "./dataHoaDon";

// Tạo dữ liệu doanh thu dựa trên hóa đơn, đảm bảo tổng tiền khớp
export const dataDoanhThu = dataHoaDon.flatMap(
  ([maHD, ngayLap, maNguoiDung, tenNguoiLap, phuongThucTT, tongTien, trangThai]) => {
    // Chọn ngẫu nhiên 1-3 sản phẩm cho mỗi hóa đơn
    const soSP = Math.floor(Math.random() * 3) + 1;
    const selectedSPs = [...dataSanPham].sort(() => 0.5 - Math.random()).slice(0, soSP);
    // Tính tổng giá bán gốc của các sản phẩm
    const totalGiaGoc = selectedSPs.reduce((sum, sp) => sum + sp[3], 0);

    // Tạo doanh thu từng sản phẩm dựa trên tỉ lệ giá bán gốc
    return selectedSPs.map(sp => {
      const ratio = sp[3] / totalGiaGoc;
      const thanhTien = Math.round(tongTien * ratio); // Phân bổ theo tỉ lệ
      const soLuong = Math.max(1, Math.round(thanhTien / sp[3])); // Lấy số lượng tối thiểu 1
      const donGia = sp[3];

      return {
        maHD,
        ngayLap,
        maNguoiDung,
        tenNguoiLap,
        maSP: sp[0],
        tenSP: sp[1],
        soLuong,
        donGia,
        thanhTien
      };
    });
  }
);
