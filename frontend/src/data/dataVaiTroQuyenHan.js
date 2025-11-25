// src/data/dataVaiTroQuyenHan.js
import { dataVaiTro } from "./dataVaiTro";
import { dataQuyenHan } from "./dataQuyenHan";

// Dữ liệu mapping ban đầu: [MaVaiTro, MaQuyenHan]
const rawVaiTroQuyenHan = [
  [1, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 6],
  [4, 7],
  [1, 8],
  [2, 9],
  [3, 10],
];

// Chuyển sang format đầy đủ: [MaVaiTro, TenVaiTro, MaQuyen, TenQuyen]
export const dataVaiTroQuyenHan = rawVaiTroQuyenHan.map(([maVaiTro, maQuyen]) => {
  const vaiTro = dataVaiTro.find(vt => vt[0] === maVaiTro);
  const quyenHan = dataQuyenHan.find(qh => qh[0] === maQuyen);
  return [
    maVaiTro,
    vaiTro ? vaiTro[1] : "Không xác định",
    maQuyen,
    quyenHan ? quyenHan[1] : "Không xác định"
  ];
});
