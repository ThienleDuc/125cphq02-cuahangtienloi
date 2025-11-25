// src/data/dataPhanCong.js
import { dataNguoiDung } from "./dataNguoiDung";
import { dataThoiGianBieu } from "./dataThoiGianBieu";

export const dataPhanCong = [
  // MaLichNV, MaNguoiDung, MaCaLam, NgayLam, TrangThai, NguoiPhanCong, NgayPhanCong, GhiChu
  [1, 7, 1, "2025-01-05", "Đã phân công", 6, "2025-01-03 09:12:00", ""],
  [2, 11, 2, "2025-01-05", "Hoàn thành", 6, "2025-01-03 09:15:20", "Làm tốt"],
  [3, 2, 3, "2025-01-06", "Vắng", 6, "2025-01-04 14:22:10", "Nghỉ không phép"],
  [4, 4, 1, "2025-01-06", "Đã phân công", 6, "2025-01-04 14:25:50", ""],
  [5, 7, 2, "2025-01-07", "Hoàn thành", 6, "2025-01-05 10:05:00", ""],
  [6, 11, 3, "2025-01-07", "Đã phân công", 6, "2025-01-05 10:10:33", ""],
  [7, 2, 1, "2025-01-08", "Vắng", 6, "2025-01-06 09:40:12", "Ốm"],
  [8, 4, 2, "2025-01-08", "Hoàn thành", 6, "2025-01-06 09:45:31", ""],
  [9, 7, 3, "2025-01-09", "Đã phân công", 6, "2025-01-07 08:22:15", ""],
  [10, 11, 1, "2025-01-09", "Đã phân công", 6, "2025-01-07 08:25:40", ""],
  [11, 2, 2, "2025-01-10", "Hoàn thành", 6, "2025-01-08 13:11:05", ""],
  [12, 4, 3, "2025-01-10", "Đã phân công", 6, "2025-01-08 13:15:44", ""]
].map(item => {
    const nguoiDung = dataNguoiDung.find(u => u[0] === item[1]);
    const tenNguoiDung = nguoiDung ? nguoiDung[1] : "";
    const nguoiPhanCong = dataNguoiDung.find(u => u[0] === item[5]);
    const tenNguoiPhanCong = nguoiPhanCong ? nguoiPhanCong[1] : "";

    const caLam = dataThoiGianBieu.find(c => c[0] === item[2]);
    const tenCaLam = caLam ? caLam[1] : "";
    const gioBD = caLam ? caLam[2] : "";   
    const gioKT = caLam ? caLam[3] : "";   

    return [
        item[0],        
        item[1],        
        tenNguoiDung,   
        item[2],        
        tenCaLam,       
        item[3],
        gioBD,          
        gioKT, 
        item[4],        
        item[5],
        tenNguoiPhanCong,  
        item[6],        
        item[7]         
  ];
});
