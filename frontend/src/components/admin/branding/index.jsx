import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { http, trimData } from "../../../modules/modules";
import AdminLayout from "../../layout/AdminLayout";

const Branding = () => {
  const [bankForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const httpRequest = http();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Làm sạch dữ liệu đầu vào
      const finalObj = trimData(values);

      // Phân tách dữ liệu: Thông tin Admin -> Users
      const userInfo = {
        address: finalObj.bankAddress,
        email: finalObj.adminEmail,
        fullName: finalObj.adminFullName,
        isActive: true,
        password: finalObj.adminPassword,
        profile: "bank-images/dummy.jpg",
        userType: "admin",
      };

      // Thông tin Branding -> Branding collection
      const brandingInfo = {
        bankAccountNumber: finalObj.bankAccountNumber,
        bankAddress: finalObj.bankAddress,
        bankDescription: finalObj.bankDescription,
        bankLogo: finalObj.bankLogo || "/bank-images/dummy.jpg",
        bankName: finalObj.bankName,
        bankTagline: finalObj.bankTagline,
        bankTransactionId: finalObj.bankTransactionId,
        facebook: finalObj.facebook,
        linkedin: finalObj.linkedin,
        twitter: finalObj.twitter,
      };

      // Gửi dữ liệu Admin đến API Users
      const userResponse = await httpRequest.post("/api/users", userInfo);

      if (userResponse.status === 200 || userResponse.status === 201) {
        // Gửi dữ liệu Branding đến API Branding
        const brandingResponse = await httpRequest.post(
          "/api/branding",
          brandingInfo,
        );

        if (
          brandingResponse.status === 200 ||
          brandingResponse.status === 201
        ) {
          messageApi.success("Lưu thông tin branding thành công");
          bankForm.resetFields();
        } else {
          messageApi.error("Không thể lưu thông tin branding");
        }
      } else {
        messageApi.error("Không thể tạo tài khoản admin");
      }
    } catch (error) {
      console.error("Lỗi khi lưu branding:", error);

      // Kiểm tra lỗi trùng lặp email
      if (error.response?.data?.error?.code === 11000) {
        bankForm.setFields([
          {
            errors: ["Email đã tồn tại"],
            name: "adminEmail",
          },
        ]);
      } else {
        messageApi.error("Không thể lưu thông tin branding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Card
        extra={
          <Button icon={<EditOutlined />} type="text">
            Sửa
          </Button>
        }
        title="Thông tin ngân hàng"
      >
        <Form form={bankForm} layout="vertical" onFinish={onFinish}>
          {/* Grid 3 cột cho các trường thông tin */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3">
            {/* Cột 1: Thông tin ngân hàng */}
            <div>
              <Form.Item
                label="Tên ngân hàng"
                name="bankName"
                rules={[
                  { message: "Vui lòng nhập tên ngân hàng", required: true },
                ]}
              >
                <Input placeholder="Nhập tên ngân hàng" />
              </Form.Item>

              <Form.Item
                label="Câu khẩu hiệu"
                name="bankTagline"
                rules={[
                  { message: "Vui lòng nhập câu khẩu hiệu", required: true },
                ]}
              >
                <Input placeholder="Nhập câu khẩu hiệu" />
              </Form.Item>

              <Form.Item label="Logo ngân hàng" name="bankLogo">
                <Input placeholder="Chọn logo" type="file" />
              </Form.Item>

              <Form.Item
                label="Số tài khoản ngân hàng"
                name="bankAccountNumber"
                rules={[
                  { message: "Vui lòng nhập số tài khoản", required: true },
                ]}
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>

              <Form.Item
                label="ID giao dịch ngân hàng"
                name="bankTransactionId"
                rules={[
                  { message: "Vui lòng nhập ID giao dịch", required: true },
                ]}
              >
                <Input placeholder="Nhập ID giao dịch" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ ngân hàng"
                name="bankAddress"
                rules={[{ message: "Vui lòng nhập địa chỉ", required: true }]}
              >
                <Input placeholder="Nhập địa chỉ ngân hàng" />
              </Form.Item>
            </div>

            {/* Cột 2: Thông tin Admin */}
            <div>
              <Form.Item
                label="Họ tên quản trị viên"
                name="adminFullName"
                rules={[{ message: "Vui lòng nhập họ tên", required: true }]}
              >
                <Input placeholder="Nhập họ tên quản trị viên" />
              </Form.Item>

              <Form.Item
                label="Email quản trị viên"
                name="adminEmail"
                rules={[
                  { message: "Vui lòng nhập email", required: true },
                  { message: "Email không hợp lệ", type: "email" },
                ]}
              >
                <Input placeholder="Nhập email quản trị viên" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu quản trị viên"
                name="adminPassword"
                rules={[{ message: "Vui lòng nhập mật khẩu", required: true }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </div>

            {/* Cột 3: Mạng xã hội */}
            <div>
              <Form.Item label="LinkedIn" name="linkedin">
                <Input placeholder="Nhập URL LinkedIn" type="url" />
              </Form.Item>

              <Form.Item label="Twitter" name="twitter">
                <Input placeholder="Nhập URL Twitter" type="url" />
              </Form.Item>

              <Form.Item label="Facebook" name="facebook">
                <Input placeholder="Nhập URL Facebook" type="url" />
              </Form.Item>
            </div>
          </div>

          {/* Bank Description - Full width */}
          <Form.Item
            label="Mô tả ngân hàng"
            name="bankDescription"
            rules={[{ message: "Vui lòng nhập mô tả", required: true }]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả chi tiết về ngân hàng"
              rows={4}
            />
          </Form.Item>

          {/* Nút Submit */}
          <div className="flex justify-end">
            <Button
              className="bg-blue-500"
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              Lưu
            </Button>
          </div>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default Branding;
