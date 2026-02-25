import { createNewRecord, findAllRecord } from "../services/db.js";

export const createData = async (req, res, schema) => {
  try {
    const data = req.body;
    const savedData = await createNewRecord(data, schema);

    return res.status(200).json({
      data: savedData,
      message: "Dữ liệu đã được chèn thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu:", error);

    if (error.code === 11000) {
      return res.status(422).json({
        message: "Email đã tồn tại",
        success: false,
      });
    }

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};

export const getData = async (_req, res, schema) => {
  try {
    const dbResponse = await findAllRecord(schema);

    return res.status(200).json({
      data: dbResponse,
      message: "Đã tìm thấy bản ghi",
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};
