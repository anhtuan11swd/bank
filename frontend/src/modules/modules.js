import axios from "axios";

/**
 * Hàm dùng chung để xử lý dữ liệu
 * Loại bỏ khoảng trắng thừa và chuẩn hóa kiểu dữ liệu
 * Lưu ý:
 * - Trường password giữ nguyên case để bảo mật
 * - Trường email chuyển sang chữ thường (chuẩn email)
 * - Trường fullName và address giữ nguyên case để hiển thị đúng
 * - Xử lý cả số và boolean bằng cách chuyển sang chuỗi
 * @param {Object} obj - Đối tượng dữ liệu cần xử lý
 * @returns {Object} - Đối tượng đã được làm sạch
 */
export const trimData = (obj) => {
  const finalObject = {};

  // Danh sách các trường chỉ cần trim, không chuyển case
  const preserveCaseFields = ["password", "fullName", "address"];

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];

      if (typeof value === "string") {
        // Chuỗi: trim và xử lý case
        if (preserveCaseFields.includes(key)) {
          finalObject[key] = value.trim();
        } else if (key === "email") {
          // Email chuyển sang chữ thường (chuẩn email)
          finalObject[key] = value.trim().toLowerCase();
        } else {
          // Các trường khác giữ nguyên case, chỉ trim
          finalObject[key] = value.trim();
        }
      } else if (typeof value === "number" || typeof value === "boolean") {
        // Số hoặc boolean: chuyển sang chuỗi
        finalObject[key] = value.toString();
      } else {
        // Các kiểu khác (null, object, array...): giữ nguyên
        finalObject[key] = value;
      }
    }
  }

  return finalObject;
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

/**
 * Hàm fetcher cho SWR - lấy dữ liệu từ API
 * @param {string} url - Đường dẫn API
 * @param {Object} httpClient - Instance axios từ http()
 * @returns {Promise<Array>} - Dữ liệu từ response
 */
export const fetchData = async (url, httpClient) => {
  const response = await httpClient.get(url);
  return response.data?.data || [];
};

/**
 * Hàm upload file lên server với thư mục động
 * @param {File} file - File cần upload
 * @param {string} folderName - Tên thư mục đích (ví dụ: "employee_photo", "signature")
 * @param {Object} httpClient - Instance axios từ http()
 * @returns {Promise<Object>} - Dữ liệu response từ server
 */
export const uploadFile = async (file, folderName, httpClient) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post(
    `/api/upload?folderName=${folderName}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
