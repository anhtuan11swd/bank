import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { http, trimData } from "../../../modules/modules.js";

// Khởi tạo instance của Cookies
const cookies = new Cookies();

const Login = () => {
  const navigate = useNavigate();
  const [messageAPI, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      // Làm sạch dữ liệu đầu vào
      const cleanedData = trimData(values);

      // Gửi yêu cầu POST đến endpoint /api/login
      const response = await http().post("/api/login", cleanedData);

      // Lấy token và userType từ response
      const { token, data } = response.data;
      const { userType } = data;

      // Thiết lập thời gian hết hạn cookie (3 ngày)
      const expires = new Date();
      expires.setDate(expires.getDate() + 3);

      // Lưu token vào cookie
      cookies.set("auth-token", token, { expires, path: "/" });

      // Lưu userType vào cookie để phân quyền
      cookies.set("user-type", userType, { expires, path: "/" });

      // Hiển thị thông báo thành công
      messageAPI.success("Đăng nhập thành công");

      // Điều hướng theo vai trò người dùng
      const userRole = userType?.toLowerCase();
      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "employee") {
        navigate("/employee");
      } else if (userRole === "customer") {
        navigate("/customer");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Hiển thị thông báo lỗi chi tiết từ server
      const errorMessage = err?.response?.data?.message || "Đăng nhập thất bại";
      messageAPI.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Phần bên trái - Hình ảnh ngân hàng */}
      <div className="hidden md:block w-1/2">
        <img
          alt="Bank"
          className="w-full h-full object-cover"
          src="/bank-img.jpg"
        />
      </div>

      {/* Phần bên phải - Biểu mẫu đăng nhập */}
      <div className="flex justify-center items-center bg-gray-50 p-8 w-full md:w-1/2">
        <Card className="shadow-xl w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-bold text-blue-600 text-2xl">Đăng nhập</h1>
            <p className="text-gray-500">Chào mừng đến với Ngân hàng</p>
          </div>

          {contextHolder}
          <Form
            autoComplete="off"
            layout="vertical"
            name="login"
            onFinish={onFinish}
          >
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  message: "Vui lòng nhập email!",
                  required: true,
                },
                {
                  message: "Email không hợp lệ!",
                  type: "email",
                },
              ]}
            >
              <Input placeholder="Nhập email" prefix={<UserOutlined />} />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  message: "Vui lòng nhập mật khẩu!",
                  required: true,
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            {/* Nút đăng nhập */}
            <Form.Item>
              <Button
                block
                className="bg-blue-500 hover:bg-blue-600 font-bold text-white"
                htmlType="submit"
                type="primary"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
