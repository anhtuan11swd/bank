import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Form, Input, message, Table } from "antd";
import { useState } from "react";
import swal from "sweetalert";
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
      console.error("Upload error:", error);
      message.error("Unable to upload");
    }
  };

  // Xử lý khi form được submit thành công
  const onFinish = async (values) => {
    const finalObj = trimData(values);
    console.log("Success:", finalObj);

    // Gán ảnh đại diện cho nhân viên
    finalObj.profile = photo || "/bank-images/dummy.jpg";

    // Bật trạng thái loading
    setLoading(true);

    try {
      const response = await httpRequest.post("/api/users", finalObj);
      console.log("Response:", response.data);

      // Chỉ gửi email khi tạo user thành công
      if (response.status === 200 || response.status === 201) {
        // Chuẩn bị dữ liệu để gửi email
        const obj = {
          email: finalObj.email,
          password: finalObj.password,
        };

        // Gọi API gửi email thông tin đăng nhập
        const emailResponse = await httpRequest.post("/api/send-email", obj);
        console.log("Email Response:", emailResponse.data);
      }

      // Hiển thị thông báo thành công bằng SweetAlert
      swal("Tạo nhân viên thành công", "Thông báo thành công", "success");

      // Đặt lại form và state ảnh sau khi hoàn tất
      EMPForm.resetFields();
      setPhoto(null);
    } catch (error) {
      console.error("Error:", error);

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
        // Hiển thị thông báo lỗi hệ thống bằng SweetAlert
        swal("Vui lòng thử lại sau", "Lỗi hệ thống", "warning");
      }
    } finally {
      // Tắt trạng thái loading trong mọi trường hợp
      setLoading(false);
    }
  };

  // Handle enable/disable employee
  const handleToggleStatus = (record) => {
    console.log("Toggle status:", record);
    message.success(
      record.status === "active"
        ? "Đã vô hiệu hóa nhân viên"
        : "Đã kích hoạt nhân viên",
    );
  };

  // Handle edit employee
  const handleEdit = (record) => {
    console.log("Edit:", record);
    message.info("Chỉnh sửa thông tin nhân viên");
  };

  // Handle delete employee
  const handleDelete = (record) => {
    console.log("Delete:", record);
    message.error("Đã xóa nhân viên khỏi hệ thống");
  };

  const columns = [
    {
      key: "profile",
      render: (_, record) => (
        <Avatar
          size={40}
          src={record.avatar || null}
          style={{ backgroundColor: record.avatar ? undefined : "#1890ff" }}
        >
          {record.fullName?.charAt(0).toUpperCase()}
        </Avatar>
      ),
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
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.status === "active" ? (
            <EyeOutlined
              className="text-blue-500 hover:text-blue-700 text-lg cursor-pointer"
              onClick={() => handleToggleStatus(record)}
            />
          ) : (
            <EyeInvisibleOutlined
              className="text-gray-500 hover:text-gray-700 text-lg cursor-pointer"
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

  const dataSource = [
    {
      address: "Hà Nội",
      avatar: "",
      email: "nguyenvana@email.com",
      fullName: "Nguyễn Văn A",
      key: "1",
      mobile: "0123456789",
      status: "active",
    },
    {
      address: "TP. Hồ Chí Minh",
      avatar: "",
      email: "tranthib@email.com",
      fullName: "Trần Thị B",
      key: "2",
      mobile: "0987654321",
      status: "active",
    },
    {
      address: "Đà Nẵng",
      avatar: "",
      email: "levanc@email.com",
      fullName: "Lê Văn C",
      key: "3",
      mobile: "0369258147",
      status: "inactive",
    },
    {
      address: "Hải Phòng",
      avatar: "",
      email: "phamthid@email.com",
      fullName: "Phạm Thị D",
      key: "4",
      mobile: "0258147369",
      status: "active",
    },
    {
      address: "Cần Thơ",
      avatar: "",
      email: "hoangvane@email.com",
      fullName: "Hoàng Văn E",
      key: "5",
      mobile: "0147258369",
      status: "inactive",
    },
  ];

  return (
    <AdminLayout>
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
        <Card className="md:col-span-2" title="Danh sách nhân viên">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default NewEmployee;
