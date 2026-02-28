import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  message,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  fetchData,
  http,
  trimData,
  uploadFile,
} from "../../../modules/modules.js";

const NewAccount = () => {
  // State cho danh sách tài khoản
  const [accountList, _setAccountList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // State điều khiển hiển thị Modal
  const [accountModel, setAccountModel] = useState(false);

  // Khởi tạo form
  const [accountForm] = Form.useForm();

  // Khởi tạo Message API
  const [messageApi, contextHolder] = message.useMessage();

  // State quản lý trạng thái tải và tệp
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [document, setDocument] = useState(null);
  const [number, setNumber] = useState(0);

  // Lấy http client
  const httpRequest = http();

  // Fetch dữ liệu branding để lấy số tài khoản cơ sở
  const { data: brandings } = useSWR(
    "/api/branding",
    (url) => fetchData(url, httpRequest),
    {
      revalidateOnFocus: false,
    },
  );

  // Fetch danh sách customers
  const { data: customers, mutate: mutateCustomers } = useSWR(
    "/api/customers",
    (url) => fetchData(url, httpRequest),
    {
      revalidateOnFocus: true,
    },
  );

  // Cập nhật danh sách tài khoản khi có dữ liệu customers
  useEffect(() => {
    if (customers) {
      _setAccountList(customers);
      setFilteredList(customers);
    }
  }, [customers]);

  // Lấy dữ liệu branding đầu tiên từ mảng
  const brandingData = brandings?.[0];

  // Cập nhật số tài khoản động khi có dữ liệu branding
  useEffect(() => {
    if (brandingData?.bankAccountNumber && accountModel) {
      const baseNumber = Number(brandingData.bankAccountNumber);
      const newNumber = baseNumber + number + 1;
      accountForm.setFieldsValue({ accountNumber: String(newNumber) });
    }
  }, [brandingData, number, accountForm, accountModel]);

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

  // Xử lý tải ảnh khách hàng
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadFile(file, "customer-photo", httpRequest);

      if (result.success) {
        setPhoto(result.filePath);
        messageApi.success("Tải ảnh lên thành công");
      } else {
        messageApi.error(result.message || "Tải ảnh lên thất bại");
      }
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Thất bại - Không thể tải ảnh lên",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tải chữ ký
  const handleSignature = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadFile(file, "customer-signature", httpRequest);

      if (result.success) {
        setSignature(result.filePath);
        messageApi.success("Tải chữ ký lên thành công");
      } else {
        messageApi.error(result.message || "Tải chữ ký lên thất bại");
      }
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Thất bại - Không thể tải chữ ký lên",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tải tài liệu
  const handleDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadFile(file, "customer-document", httpRequest);

      if (result.success) {
        setDocument(result.filePath);
        messageApi.success("Tải tài liệu lên thành công");
      } else {
        messageApi.error(result.message || "Tải tài liệu lên thất bại");
      }
    } catch (error) {
      messageApi.error(
        error.response?.data?.message ||
          "Thất bại - Không thể tải tài liệu lên",
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi submit form
  const onFinish = async (values) => {
    let createdUserId = null;
    let createdCustomerId = null;

    try {
      setLoading(true);

      // Lấy thông tin nhân viên từ sessionStorage
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const employeeBranch = userInfo?.branch || "";
      const employeeEmail = userInfo?.email || "";

      // Kiểm tra thông tin nhân viên
      if (!employeeEmail) {
        messageApi.error(
          "Không tìm thấy thông tin nhân viên. Vui lòng đăng nhập lại.",
        );
        setLoading(false);
        return;
      }

      // Chuẩn hóa dữ liệu đầu vào
      const finalObj = trimData(values);

      // Đính kèm đường dẫn tệp tin (sử dụng ảnh mặc định nếu chưa tải lên)
      finalObj.profile = photo || "bank-images/dummy.jpg";
      finalObj.signature = signature || "bank-images/dummy.jpg";
      finalObj.document = document || "bank-images/dummy.jpg";

      // Thiết lập các thuộc tính định danh
      finalObj.userType = "customer";
      finalObj.key = finalObj.email;

      // Thêm thông tin chi nhánh và người tạo
      finalObj.branch = employeeBranch;
      finalObj.createdBy = employeeEmail;

      // Bước 1: Tạo tài khoản đăng nhập trong bộ sưu tập Users
      const userPayload = {
        address: finalObj.address,
        branch: employeeBranch,
        email: finalObj.email,
        fullName: finalObj.fullName,
        isActive: true,
        key: finalObj.email,
        mobile: finalObj.mobile,
        password: finalObj.password,
        profile: finalObj.profile,
        userType: "customer",
      };

      const userResponse = await httpRequest.post("/api/users", userPayload);
      createdUserId = userResponse?.data?.data?._id;

      // Bước 2: Tạo hồ sơ khách hàng trong bộ sưu tập Customers
      const customerPayload = {
        accountNumber: Number(finalObj.accountNumber),
        address: finalObj.address,
        branch: employeeBranch,
        createdBy: employeeEmail,
        currency: finalObj.currency,
        DOB: finalObj.dob,
        document: finalObj.document,
        email: finalObj.email,
        finalBalance: 0,
        fullName: finalObj.fullName,
        gender: finalObj.gender,
        isActive: true,
        mobile: finalObj.mobile,
        profile: finalObj.profile,
        signature: finalObj.signature,
        userType: "customer",
      };

      const customerResponse = await httpRequest.post(
        "/api/customers",
        customerPayload,
      );
      createdCustomerId = customerResponse?.data?.data?._id;

      // Bước 3: Gửi email thông báo cho khách hàng
      const emailPayload = {
        email: finalObj.email,
        fullName: finalObj.fullName,
        message: `Chào ${finalObj.fullName},\n\nTài khoản của bạn đã được tạo thành công.\n\nThông tin đăng nhập:\nEmail: ${finalObj.email}\nMật khẩu: ${finalObj.password}\n\nVui lòng đổi mật khẩu sau khi đăng nhập lần đầu.`,
        subject: "Thông báo tạo tài khoản thành công",
      };

      await httpRequest.post("/api/send-email", emailPayload);

      // Bước 4: Cập nhật số tài khoản tiếp theo trong Branding
      if (brandingData?._id) {
        const nextAccountNumber = Number(finalObj.accountNumber) + 1;
        const brandingPayload = {
          bankAccountNumber: String(nextAccountNumber),
          bankAddress: brandingData.bankAddress,
          bankDescription: brandingData.bankDescription,
          bankLogo: brandingData.bankLogo,
          bankName: brandingData.bankName,
          bankTagline: brandingData.bankTagline,
          bankTransactionId: brandingData.bankTransactionId,
          facebook: brandingData.facebook,
          linkedin: brandingData.linkedin,
          twitter: brandingData.twitter,
        };

        await httpRequest.put(
          `/api/branding/${brandingData._id}`,
          brandingPayload,
        );

        // Cập nhật dữ liệu branding ngay lập tức
        mutate("/api/branding");
      }

      // Làm mới danh sách customers
      mutateCustomers();

      // Hiển thị thông báo thành công
      messageApi.success("Tạo tài khoản thành công");

      // Tăng số tài khoản cho lần tiếp theo
      setNumber((prev) => prev + 1);

      // Reset form và các state
      accountForm.resetFields();
      setPhoto(null);
      setSignature(null);
      setDocument(null);
      setAccountModel(false);
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);

      // Cleanup: Xóa dữ liệu đã tạo nếu có lỗi xảy ra giữa chừng
      if (createdCustomerId) {
        try {
          await httpRequest.delete(`/api/customers/${createdCustomerId}`);
          console.log("Đã xóa customer do lỗi:", createdCustomerId);
        } catch (cleanupError) {
          console.error("Không thể xóa customer:", cleanupError);
        }
      }
      if (createdUserId) {
        try {
          await httpRequest.delete(`/api/users/${createdUserId}`);
          console.log("Đã xóa user do lỗi:", createdUserId);
        } catch (cleanupError) {
          console.error("Không thể xóa user:", cleanupError);
        }
      }

      // Kiểm tra lỗi trùng lặp email
      if (error.response?.data?.error?.code === 11000) {
        messageApi.error("Email đã tồn tại trong hệ thống");
      } else if (error.response?.status === 404) {
        messageApi.error(
          "API endpoint không tồn tại. Vui lòng kiểm tra cấu hình server.",
        );
      } else if (error.response?.status === 500) {
        messageApi.error("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else {
        messageApi.error(
          error.response?.data?.message || "Thất bại - Vui lòng thử lại sau",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa các cột cho bảng
  const columns = [
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
      dataIndex: "DOB",
      key: "DOB",
      title: "Ngày sinh",
    },
    {
      dataIndex: "gender",
      key: "gender",
      render: (text) => {
        const genderMap = {
          female: "Nữ",
          male: "Nam",
        };
        return <span>{genderMap[text] || text}</span>;
      },
      title: "Giới tính",
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
      dataIndex: "currency",
      key: "currency",
      render: (text) => <span className="uppercase">{text}</span>,
      title: "Tiền tệ",
    },
    {
      dataIndex: "finalBalance",
      key: "finalBalance",
      render: (balance) => (
        <span className="font-medium">
          {balance?.toLocaleString("vi-VN") || "0"}
        </span>
      ),
      title: "Số dư",
    },
    {
      dataIndex: "branch",
      key: "branch",
      title: "Chi nhánh",
    },
    {
      dataIndex: "profile",
      key: "profile",
      render: (profile) => (
        <span
          className={`cursor-pointer ${profile && profile !== "bank-images/dummy.jpg" ? "text-green-500" : "text-gray-400"}`}
        >
          {profile && profile !== "bank-images/dummy.jpg" ? "Có" : "Không"}
        </span>
      ),
      title: "Ảnh",
    },
    {
      dataIndex: "signature",
      key: "signature",
      render: (signature) => (
        <span
          className={`cursor-pointer ${signature && signature !== "bank-images/dummy.jpg" ? "text-green-500" : "text-gray-400"}`}
        >
          {signature && signature !== "bank-images/dummy.jpg" ? "Có" : "Không"}
        </span>
      ),
      title: "Chữ ký",
    },
    {
      dataIndex: "document",
      key: "document",
      render: (document) => (
        <span
          className={`cursor-pointer ${document && document !== "bank-images/dummy.jpg" ? "text-green-500" : "text-gray-400"}`}
        >
          {document && document !== "bank-images/dummy.jpg" ? "Có" : "Không"}
        </span>
      ),
      title: "Tài liệu",
    },
    {
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span
          className={`${isActive ? "text-green-500" : "text-red-500"} font-medium`}
        >
          {isActive ? "Hoạt động" : "Khóa"}
        </span>
      ),
      title: "Trạng thái",
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
      {contextHolder}
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
              <Input disabled placeholder="Số tài khoản tự động" />
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
              <Input onChange={handlePhoto} type="file" />
            </Form.Item>

            {/* Tải chữ ký */}
            <Form.Item label="Chữ ký" name="signature">
              <Input onChange={handleSignature} type="file" />
            </Form.Item>

            {/* Tải tài liệu */}
            <Form.Item label="Tài liệu" name="document">
              <Input onChange={handleDocument} type="file" />
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
              loading={loading}
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
