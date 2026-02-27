import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
} from "antd";
import { useState } from "react";

const NewAccount = () => {
  // State cho danh sách tài khoản
  const [accountList, _setAccountList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // State điều khiển hiển thị Modal
  const [accountModel, setAccountModel] = useState(false);

  // Khởi tạo form
  const [accountForm] = Form.useForm();

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    setSearchValue(value);

    if (!value) {
      setFilteredList(accountList);
      return;
    }

    const filtered = accountList.filter((account) => {
      const accountNumber = (account.accountNumber || "").toLowerCase();
      const fullName = (account.fullName || "").toLowerCase();
      const email = (account.email || "").toLowerCase();
      const mobile = (account.mobile || "").toLowerCase();
      const branch = (account.branch || "").toLowerCase();

      return (
        accountNumber.includes(value) ||
        fullName.includes(value) ||
        email.includes(value) ||
        mobile.includes(value) ||
        branch.includes(value)
      );
    });

    setFilteredList(filtered);
  };

  // Xử lý khi submit form
  const onFinish = (values) => {
    console.log("Dữ liệu biểu mẫu:", values);
    // Xử lý lưu dữ liệu tại đây
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      dataIndex: "branch",
      key: "branch",
      title: "Chi nhánh",
    },
    {
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        const colorClass =
          text === "customer" ? "text-green-500" : "text-blue-500";
        return (
          <span className={`${colorClass} capitalize font-medium`}>
            {text || "customer"}
          </span>
        );
      },
      title: "Loại người dùng",
    },
    {
      dataIndex: "accountNumber",
      key: "accountNumber",
      title: "Số tài khoản",
    },
    {
      dataIndex: "fullName",
      key: "fullName",
      title: "Họ tên",
    },
    {
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      title: "Ngày sinh",
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
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <span className="text-blue-500 cursor-pointer">
          {photo ? "Có" : "Không"}
        </span>
      ),
      title: "Ảnh",
    },
    {
      dataIndex: "signature",
      key: "signature",
      render: (signature) => (
        <span className="text-blue-500 cursor-pointer">
          {signature ? "Có" : "Không"}
        </span>
      ),
      title: "Chữ ký",
    },
    {
      dataIndex: "document",
      key: "document",
      render: (document) => (
        <span className="text-blue-500 cursor-pointer">
          {document ? "Có" : "Không"}
        </span>
      ),
      title: "Tài liệu",
    },
    {
      fixed: "right",
      key: "action",
      render: () => (
        <div className="flex gap-2">
          <Button size="small" type="primary">
            Xem
          </Button>
          <Button danger size="small">
            Xóa
          </Button>
        </div>
      ),
      title: "Hành động",
    },
  ];

  // Dữ liệu hiển thị
  const displayData = searchValue ? filteredList : accountList;

  // Options cho Select
  const genderOptions = [
    { label: "Nam", value: "male" },
    { label: "Nữ", value: "female" },
  ];

  const currencyOptions = [
    { label: "VND", value: "vnd" },
    { label: "USD", value: "usd" },
    { label: "EUR", value: "eur" },
  ];

  return (
    <div className="p-6">
      <Card
        extra={
          <div className="flex items-center gap-x-3">
            <Input
              onChange={handleSearch}
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchValue}
            />
            <Button
              className="font-bold bg-blue-500 text-white hover:bg-blue-600"
              icon={<PlusOutlined />}
              onClick={() => setAccountModel(true)}
              type="primary"
            >
              Mở tài khoản mới
            </Button>
          </div>
        }
        title="Danh sách tài khoản"
      >
        <Table
          columns={columns}
          dataSource={displayData}
          pagination={{ pageSize: 10 }}
          rowKey="accountNumber"
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Modal cho biểu mẫu mở tài khoản mới */}
      <Modal
        footer={null}
        onCancel={() => setAccountModel(false)}
        open={accountModel}
        title="Mở tài khoản mới"
        width={820}
      >
        <Form form={accountForm} layout="vertical" onFinish={onFinish}>
          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Số tài khoản */}
            <Form.Item
              label="Số tài khoản"
              name="accountNumber"
              rules={[
                { message: "Vui lòng nhập số tài khoản", required: true },
              ]}
            >
              <Input placeholder="Nhập số tài khoản" />
            </Form.Item>

            {/* Họ tên */}
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ message: "Vui lòng nhập họ tên", required: true }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="mobile"
              rules={[
                { message: "Vui lòng nhập số điện thoại", required: true },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </div>

          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Tên cha */}
            <Form.Item
              label="Tên cha"
              name="fatherName"
              rules={[{ message: "Vui lòng nhập tên cha", required: true }]}
            >
              <Input placeholder="Nhập tên cha" />
            </Form.Item>

            {/* Email */}
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

            {/* Mật khẩu */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ message: "Vui lòng nhập mật khẩu", required: true }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </div>

          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Ngày sinh */}
            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ message: "Vui lòng chọn ngày sinh", required: true }]}
            >
              <DatePicker className="w-full" placeholder="Chọn ngày sinh" />
            </Form.Item>

            {/* Giới tính */}
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ message: "Vui lòng chọn giới tính", required: true }]}
            >
              <Select options={genderOptions} placeholder="Chọn giới tính" />
            </Form.Item>

            {/* Loại tiền tệ */}
            <Form.Item
              label="Loại tiền tệ"
              name="currency"
              rules={[
                { message: "Vui lòng chọn loại tiền tệ", required: true },
              ]}
            >
              <Select
                options={currencyOptions}
                placeholder="Chọn loại tiền tệ"
              />
            </Form.Item>
          </div>

          <div className="grid md:grid-cols-3 gap-x-3">
            {/* Tải ảnh */}
            <Form.Item label="Ảnh" name="photo">
              <Input type="file" />
            </Form.Item>

            {/* Tải chữ ký */}
            <Form.Item label="Chữ ký" name="signature">
              <Input type="file" />
            </Form.Item>

            {/* Tải tài liệu */}
            <Form.Item label="Tài liệu" name="document">
              <Input type="file" />
            </Form.Item>
          </div>

          {/* Địa chỉ */}
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ message: "Vui lòng nhập địa chỉ", required: true }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
          </Form.Item>

          {/* Nút Submit */}
          <Form.Item className="flex justify-end mb-0">
            <Button
              className="!text-white font-bold"
              htmlType="submit"
              type="primary"
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewAccount;
