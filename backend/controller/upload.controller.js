import path from "node:path";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Không có tệp nào được tải lên",
        success: false,
      });
    }

    const { filename, originalname, mimetype, size } = req.file;
    const _uploadPath = path.join(
      process.cwd(),
      "public",
      "bank-images",
      filename,
    );

    return res.status(200).json({
      data: {
        filename,
        mimetype,
        originalname,
        path: `/bank-images/${filename}`,
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
