import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

const Login = () => {
  const onFinish = (values) => {
    console.log("Login values:", values);
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

          <Form
            autoComplete="off"
            layout="vertical"
            name="login"
            onFinish={onFinish}
          >
            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  message: "Vui lòng nhập username!",
                  required: true,
                },
              ]}
            >
              <Input placeholder="Enter Username" prefix={<UserOutlined />} />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  message: "Vui lòng nhập password!",
                  required: true,
                },
              ]}
            >
              <Input.Password
                placeholder="Enter Password"
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
