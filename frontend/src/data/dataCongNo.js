// src/data/dataCongNo.js
import { dataNhaCungCap } from "./dataNhaCungCap";

export const dataCongNo = [
  [1, "Phải trả", "Nhà cung cấp", 1000000, "2025-12-01", "Chưa thanh toán", null, null],
  [2, "Phải trả", "Nhà cung cấp", 500000, "2025-11-15", "Đã thanh toán", null, null],
  [3, "Phải thu", "Khách hàng", 750000, "2025-12-10", "Chưa thanh toán", 103, "Khách hàng A"],
  [4, "Phải trả", "Nhà cung cấp", 1200000, "2025-12-05", "Chưa thanh toán", null, null],
  [5, "Phải thu", "Khách hàng", 300000, "2025-12-12", "Đã thanh toán", 105, "Khách hàng B"],
  [6, "Phải thu", "Khách hàng", 950000, "2025-12-08", "Chưa thanh toán", 106, "Khách hàng C"],
  [7, "Phải trả", "Khách hàng", 400000, "2025-12-20", "Chưa thanh toán", 107, "Khách hàng D"],
  [8, "Phải thu", "Nhà cung cấp", 600000, "2025-11-30", "Đã thanh toán", null, null],
  [9, "Phải trả", "Nhà cung cấp", 850000, "2025-12-18", "Chưa thanh toán", null, null],
  [10, "Phải thu", "Khách hàng", 200000, "2025-12-15", "Chưa thanh toán", 110, "Khách hàng E"]
].map(item => {
  let maNhaCungCap = null;
  let tenNhaCungCap = null;

  if (item[2] === "Nhà cung cấp") {
    const nhaCungCap = dataNhaCungCap[0];
    if (nhaCungCap) {
      maNhaCungCap = nhaCungCap[0];
      tenNhaCungCap = nhaCungCap[1];
    }
  }

  return [
    ...item,      
    maNhaCungCap,  
    tenNhaCungCap  
  ];
});
