import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Image, Input, message, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { http, trimData } from "../../../modules/modules";
import AdminLayout from "../../layout/AdminLayout";

const NewEmployee = () => {
  // Khởi tạo http request với cấu hình mặc định
  const httpRequest = http();
  // Khởi tạo hook useForm để quản lý form
  const [EMPForm] = Form.useForm();

  // State cho trạng thái loading
  const [loading, setLoading] = useState(false);

  // State cho ảnh đại diện
  const [photo, setPhoto] = useState(null);

  // State cho danh sách nhân viên
  const [allEmployee, setAllEmployee] = useState([]);

  // Sử dụng hook useMessage để tạo messageApi và contextHolder
  const [messageApi, contextHolder] = message.useMessage();

  // Hàm lấy danh sách nhân viên từ API
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await httpRequest.get("/api/users");
      setAllEmployee(response?.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      messageApi.error("Không thể lấy dữ liệu");
    }
  }, [httpRequest, messageApi]);

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Hàm xử lý tải ảnh lên server
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await httpRequest.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPhoto(response?.data?.data?.path);
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      messageApi.error("Thất bại - Không thể tải lên");
    }
  };

  // Xử lý khi form được submit thành công
  const onFinish = async (values) => {
    const finalObj = trimData(values);
    console.log("Thành công:", finalObj);

    // Gán ảnh đại diện cho nhân viên
    finalObj.profile = photo || "/bank-images/dummy.jpg";

    // Bật trạng thái loading
    setLoading(true);

    try {
      const response = await httpRequest.post("/api/users", finalObj);
      console.log("Phản hồi:", response.data);

      // Chỉ gửi email khi tạo user thành công
      if (response.status === 200 || response.status === 201) {
        // Chuẩn bị dữ liệu để gửi email
        const obj = {
          email: finalObj.email,
          password: finalObj.password,
        };

        // Gọi API gửi email thông tin đăng nhập
        const emailResponse = await httpRequest.post("/api/send-email", obj);
        console.log("Phản hồi Email:", emailResponse.data);
      }

      // Hiển thị thông báo thành công bằng Ant Design Message
      messageApi.success("Tạo nhân viên thành công");

      // Đặt lại form và state ảnh sau khi hoàn tất
      EMPForm.resetFields();
      setPhoto(null);

      // Refresh danh sách nhân viên sau khi tạo mới
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi:", error);

      // Kiểm tra lỗi trùng lặp email (mã lỗi 11000)
      if (error.response?.data?.error?.code === 11000) {
        // Hiển thị lỗi tại trường email
        EMPForm.setFields([
          {
            errors: ["Email đã tồn tại"],
            name: "email",
          },
        ]);
      } else {
        // Hiển thị thông báo lỗi hệ thống bằng Ant Design Message
        messageApi.error("Thất bại - Vui lòng thử lại sau");
      }
    } finally {
      // Tắt trạng thái loading trong mọi trường hợp
      setLoading(false);
    }
  };

  // Handle enable/disable employee
  const handleToggleStatus = (record) => {
    console.log("Chuyển đổi trạng thái:", record);
    messageApi.success(
      record.isActive ? "Đã vô hiệu hóa nhân viên" : "Đã kích hoạt nhân viên",
    );
  };

  // Handle edit employee
  const handleEdit = (record) => {
    console.log("Chỉnh sửa:", record);
    messageApi.info("Chỉnh sửa thông tin nhân viên");
  };

  // Handle delete employee
  const handleDelete = (record) => {
    console.log("Xóa:", record);
    messageApi.error("Đã xóa nhân viên khỏi hệ thống");
  };

  const columns = [
    {
      key: "profile",
      render: (_, obj) => {
        // Chuẩn hóa URL: loại bỏ dấu / ở đầu nếu có để tránh double slash
        let profilePath = obj.profile || "bank-images/dummy.jpg";
        if (profilePath.startsWith("/")) {
          profilePath = profilePath.slice(1);
        }
        const imageUrl = `${import.meta.env.VITE_BASE_URL}/${profilePath}`;
        return (
          <Image
            className="rounded-full object-cover"
            fallback={`${import.meta.env.VITE_BASE_URL}/bank-images/dummy.jpg`}
            height={40}
            src={imageUrl}
            style={{ borderRadius: "50%" }}
            width={40}
          />
        );
      },
      title: "Ảnh đại diện",
    },
    {
      dataIndex: "fullName",
      key: "fullName",
      title: "Họ tên",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
    },
    {
      dataIndex: "mobile",
      key: "mobile",
      title: "Số điện thoại",
    },
    {
      dataIndex: "address",
      key: "address",
      title: "Địa chỉ",
    },
    {
      fixed: "right",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.isActive ? (
            <EyeOutlined
              className="text-indigo-500 hover:text-indigo-700 text-lg cursor-pointer"
              onClick={() => handleToggleStatus(record)}
            />
          ) : (
            <EyeInvisibleOutlined
              className="text-pink-500 hover:text-pink-700 text-lg cursor-pointer"
              onClick={() => handleToggleStatus(record)}
            />
          )}
          <EditOutlined
            className="text-green-500 hover:text-green-700 text-lg cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            className="text-rose-500 hover:text-rose-700 text-lg cursor-pointer"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
      title: "Hành động",
    },
  ];

  // Thêm thuộc tính key cho mỗi đối tượng dữ liệu
  const dataWithKeys = allEmployee.map((emp) => ({
    ...emp,
    key: emp._id || emp.id,
  }));

  return (
    <AdminLayout>
      {/* ContextHolder để hiển thị notifications trên toàn ứng dụng */}
      {contextHolder}
      <div className="gap-3 grid md:grid-cols-3">
        {/* Add New Employee Card */}
        <Card className="md:col-span-1" title="Thêm nhân viên mới">
          <Form form={EMPForm} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Ảnh đại diện" name="photo">
              <Input onChange={handleUpload} type="file" />
            </Form.Item>

            <div className="gap-2 grid md:grid-cols-2">
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{ message: "Vui lòng nhập họ tên", required: true }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="mobile"
                rules={[
                  { message: "Vui lòng nhập số điện thoại", required: true },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" type="number" />
              </Form.Item>
            </div>

            <div className="gap-2 grid md:grid-cols-2">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { message: "Vui lòng nhập email", required: true },
                  { message: "Email không hợp lệ", type: "email" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ message: "Vui lòng nhập mật khẩu", required: true }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </div>

            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
            </Form.Item>

            <Button
              className="w-full"
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              Thêm nhân viên
            </Button>
          </Form>
        </Card>

        {/* Employee List Card */}
        <Card
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
          title="Danh sách nhân viên"
        >
          <Table
            columns={columns}
            dataSource={dataWithKeys}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NewEmployee;
