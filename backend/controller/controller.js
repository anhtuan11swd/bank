import {
  createNewRecord,
  findAllRecord,
  updateRecord,
} from "../services/db.js";

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

export const updateData = async (req, res, schema) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedData = await updateRecord(id, data, schema);

    if (!updatedData) {
      return res.status(404).json({
        message: "Không tìm thấy bản ghi",
        success: false,
      });
    }

    return res.status(200).json({
      data: updatedData,
      message: "Cập nhật bản ghi thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu:", error);

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};
