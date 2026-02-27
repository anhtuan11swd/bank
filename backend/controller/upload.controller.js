/**
 * Controller xử lý upload file
 * Trả về thông tin file và đường dẫn để Front-end hiển thị
 */
export const uploadFile = async (req, res) => {
  try {
    // Kiểm tra nếu không có file được tải lên
    if (!req.file) {
      return res.status(400).json({
        message: "Không có tệp nào được tải lên",
        success: false,
      });
    }

    const { filename, originalname, mimetype, size } = req.file;
    const { folderName } = req.query;

    // Đường dẫn file để truy cập từ browser: /{folderName}/{filename}
    const filePath = `/${folderName}/${filename}`;

    return res.status(200).json({
      data: {
        filename,
        mimetype,
        originalname,
        path: filePath,
        size,
      },
      message: "Tệp đã được tải lên thành công",
      success: true,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};
