import { createNewRecord } from "../services/db.js";

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
    if (error.code === 11000) {
      return res.status(422).json({
        message: "Email đã tồn tại",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};
