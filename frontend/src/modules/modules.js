/**
 * Hàm dùng chung để xử lý dữ liệu
 * Loại bỏ khoảng trắng thừa và chuyển đổi sang chữ thường
 * @param {Object} obj - Đối tượng dữ liệu cần xử lý
 * @returns {Object} - Đối tượng đã được làm sạch
 */
export const trimData = (obj) => {
  const finalObj = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (typeof value === "string") {
        finalObj[key] = value.trim().toLowerCase();
      } else {
        finalObj[key] = value;
      }
    }
  }

  return finalObj;
};
