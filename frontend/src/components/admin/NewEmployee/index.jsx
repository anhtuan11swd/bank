import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Form, Input, message, Table } from "antd";
import AdminLayout from "../../layout/AdminLayout";

const NewEmployee = () => {
  const [form] = Form.useForm();

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

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const columns = [
    {
      key: "profile",
      render: (_, record) => (
        <Avatar
          size={40}
          src={record.avatar}
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
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="Ảnh đại diện" name="photo">
              <Input type="file" />
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

            <button
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded w-full font-bold text-white"
              type="submit"
            >
              Thêm nhân viên
            </button>
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
