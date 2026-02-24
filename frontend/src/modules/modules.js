import axios from "axios";

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

/**
 * Hàm tạo instance HTTP dùng chung cho frontend
 * @param {string|null} accessToken - Token xác thực (mặc định null)
 * @returns {Object} - Instance axios đã được cấu hình
 */
export const http = (accessToken = null) => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return axios;
};
