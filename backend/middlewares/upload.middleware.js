import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình Disk Storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Lưu ảnh vào thư mục ./public/bank-images
    const uploadPath = path.join(__dirname, "..", "public", "bank-images");
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    // Tạo tên tệp duy nhất: timestamp + phần mở rộng gốc
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// Khởi tạo middleware với .single('photo')
export const upload = multer({ storage });
