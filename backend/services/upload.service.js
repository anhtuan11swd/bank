import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Tạo storage configuration cho Multer với thư mục động
 * @returns {Object} Multer diskStorage configuration
 */
export const createDynamicStorage = () => {
  return multer.diskStorage({
    destination: (req, _file, cb) => {
      // Lấy folderName từ query parameter
      const { folderName } = req.query;

      // Kiểm tra nếu không có folderName
      if (!folderName) {
        return cb(new Error("No folder name provided"), null);
      }

      // Xác định đường dẫn upload: public/{folderName}
      const uploadPath = path.join(__dirname, "..", "public", folderName);

      // Kiểm tra và tạo thư mục nếu chưa tồn tại
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      // Tạo unique suffix kết hợp Date.now() và số ngẫu nhiên
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      // Lấy phần mở rộng của file gốc
      const extension = path.extname(file.originalname);

      // Tạo tên file mới: fieldname-uniqueSuffix.extension
      const newFilename = `${file.fieldname}-${uniqueSuffix}${extension}`;

      cb(null, newFilename);
    },
  });
};

/**
 * Khởi tạo Multer instance với storage động
 */
export const upload = multer({ storage: createDynamicStorage() });
