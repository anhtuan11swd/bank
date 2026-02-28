import Customer from "../model/customer.model.js";
import User from "../model/users.model.js";
import { createData, getData } from "./controller.js";

export const createCustomer = (req, res) => createData(req, res, Customer);
export const getCustomers = (req, res) => getData(req, res, Customer);

// Cập nhật customer với đồng bộ isActive sang users
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Loại bỏ các trường không được phép cập nhật
    delete data.accountNumber;
    delete data.email;
    delete data.password;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    });

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
        success: false,
      });
    }

    // Đồng bộ isActive sang collection users nếu có thay đổi
    if (data.isActive !== undefined && updatedCustomer.userId) {
      await User.findByIdAndUpdate(updatedCustomer.userId, {
        isActive: data.isActive,
      });
      console.log(
        `Đã đồng bộ isActive=${data.isActive} cho user ${updatedCustomer.userId}`,
      );
    }

    return res.status(200).json({
      data: updatedCustomer,
      message: "Cập nhật khách hàng thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật khách hàng:", error);

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};

// Xóa customer với đồng bộ xóa user
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Không tìm thấy khách hàng",
        success: false,
      });
    }

    // Xóa user tương ứng nếu có userId
    if (customer.userId) {
      await User.findByIdAndDelete(customer.userId);
      console.log(`Đã xóa user ${customer.userId} liên kết với customer ${id}`);
    } else {
      console.warn(`Customer ${id} không có userId, chỉ xóa customer`);
    }

    // Xóa customer
    await Customer.findByIdAndDelete(id);
    console.log(`Đã xóa customer ${id}`);

    return res.status(200).json({
      message: "Xóa khách hàng thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi xóa khách hàng:", error);

    return res.status(500).json({
      error: error.message,
      message: "Lỗi máy chủ nội bộ",
      success: false,
    });
  }
};

export const handleCustomer404 = (_req, res) => {
  res.status(404).json({
    message: "Route không tồn tại",
    success: false,
  });
};
