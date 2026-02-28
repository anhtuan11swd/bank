import {
  DownloadOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import {
  fetchData,
  http,
  trimData,
  uploadFile,
} from "../../../modules/modules.js";

// Extend dayjs với plugin customParseFormat
dayjs.extend(customParseFormat);

const NewAccount = () => {
  // State cho danh sách tài khoản
  const [allCustomer, setAllCustomer] = useState(null);
  const [finalCustomer, setFinalCustomer] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // State điều khiển hiển thị Modal
  const [accountModel, setAccountModel] = useState(false);

  // State cho chức năng chỉnh sửa
  const [edit, setEdit] = useState(null);

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
      setAllCustomer(customers);
      setFinalCustomer(customers);
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
      setAllCustomer(finalCustomer);
      return;
    }

    const filtered = finalCustomer.filter((cust) => {
      const fullName = (cust.fullName || "").toLowerCase();
      const address = (cust.address || "").toLowerCase();
      const accountNumber = String(cust.accountNumber || "").toLowerCase();
      const email = (cust.email || "").toLowerCase();
      const mobile = (cust.mobile || "").toLowerCase();
      const createdBy = (cust.createdBy || "").toLowerCase();
      const finalBalance = String(cust.finalBalance || "0").toLowerCase();

      return (
        fullName.includes(value) ||
        address.includes(value) ||
        accountNumber.includes(value) ||
        email.includes(value) ||
        mobile.includes(value) ||
        createdBy.includes(value) ||
        finalBalance.includes(value)
      );
    });

    setAllCustomer(filtered);
  };

  // Xử lý tải ảnh khách hàng
  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await uploadFile(file, "customer-photo", httpRequest);

      if (result.success) {
        setPhoto(result.data.path);
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
        setSignature(result.data.path);
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
        setDocument(result.data.path);
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
    // Nếu đang ở chế độ chỉnh sửa, gọi hàm onUpdate
    if (edit) {
      return onUpdate(values);
    }

    // Nếu không, tiếp tục logic tạo mới
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

      // Format ngày sinh từ DatePicker sang dd/MM/yyyy
      if (finalObj.dob && typeof finalObj.dob === "object") {
        const dobDate = finalObj.dob.$d || finalObj.dob;
        const day = String(dobDate.getDate()).padStart(2, "0");
        const month = String(dobDate.getMonth() + 1).padStart(2, "0");
        const year = dobDate.getFullYear();
        finalObj.dob = `${day}/${month}/${year}`;
      }

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

  // Hàm cập nhật trạng thái isActive
  const updateIsActive = async (id, currentIsActive) => {
    try {
      // Đảo ngược trạng thái hiện tại
      const newStatus = !currentIsActive;

      const response = await httpRequest.put(`/api/customers/${id}`, {
        isActive: newStatus,
      });

      if (response.status === 200) {
        messageApi.success(
          newStatus ? "Đã kích hoạt khách hàng" : "Đã vô hiệu hóa khách hàng",
        );
        // Làm mới dữ liệu
        mutateCustomers();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      messageApi.error("Không thể cập nhật trạng thái");
    }
  };

  // Hàm xử lý chỉnh sửa khách hàng - đổ dữ liệu vào form
  const onEditCustomer = (record) => {
    // Lưu dữ liệu khách hàng vào state edit
    setEdit(record);

    // Chuẩn bị dữ liệu để điền vào form
    const formData = {
      accountNumber: record.accountNumber,
      address: record.address,
      currency: record.currency,
      email: record.email,
      fullName: record.fullName,
      gender: record.gender,
      mobile: record.mobile,
    };

    // Xử lý ngày sinh nếu có - chuyển đổi sang dayjs object cho DatePicker
    if (record.DOB) {
      try {
        // Thử parse với nhiều định dạng khác nhau
        let dobDayjs = null;

        // Nếu DOB là string dạng dd/MM/yyyy
        if (typeof record.DOB === "string" && record.DOB.includes("/")) {
          dobDayjs = dayjs(record.DOB, "DD/MM/YYYY");
        } else {
          // Nếu DOB là ISO string hoặc timestamp
          dobDayjs = dayjs(record.DOB);
        }

        // Kiểm tra dayjs object có hợp lệ không
        if (dobDayjs?.isValid()) {
          formData.dob = dobDayjs;
        }
      } catch (error) {
        console.log("Không thể parse ngày sinh:", error);
      }
    }

    // Tự động điền dữ liệu vào form
    accountForm.setFieldsValue(formData);

    // Cập nhật các file đã tải lên nếu có
    setPhoto(record.profile);
    setSignature(record.signature);
    setDocument(record.document);

    // Mở modal
    setAccountModel(true);
    messageApi.success("Đã tải dữ liệu khách hàng vào form chỉnh sửa");
  };

  // Hàm xử lý cập nhật khách hàng
  const onUpdate = async (values) => {
    try {
      setLoading(true);

      // Làm sạch dữ liệu đầu vào
      const finalObj = trimData(values);

      // Xóa password để tránh ghi đè mật khẩu cũ
      delete finalObj.password;

      // Format ngày sinh nếu có
      if (finalObj.dob && typeof finalObj.dob === "object") {
        const dobDate = finalObj.dob.$d || finalObj.dob;
        const day = String(dobDate.getDate()).padStart(2, "0");
        const month = String(dobDate.getMonth() + 1).padStart(2, "0");
        const year = dobDate.getFullYear();
        finalObj.dob = `${day}/${month}/${year}`;
      }

      // Chỉ thêm file nếu người dùng tải lên file mới
      if (photo && photo !== edit.profile) {
        finalObj.profile = photo;
      }
      if (signature && signature !== edit.signature) {
        finalObj.signature = signature;
      }
      if (document && document !== edit.document) {
        finalObj.document = document;
      }

      // Gửi yêu cầu cập nhật đến API
      const response = await httpRequest.put(
        `/api/customers/${edit._id}`,
        finalObj,
      );

      if (response.status === 200) {
        messageApi.success("Cập nhật khách hàng thành công");

        // Đặt lại form và state sau khi hoàn tất
        accountForm.resetFields();
        setPhoto(null);
        setSignature(null);
        setDocument(null);
        setEdit(null);
        setAccountModel(false);

        // Làm mới dữ liệu
        mutateCustomers();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      messageApi.error("Không thể cập nhật khách hàng");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa khách hàng
  const onDeleteCustomer = async (id) => {
    try {
      // Thực hiện yêu cầu HTTP DELETE tới endpoint /api/customers/ kèm theo ID
      await httpRequest.delete(`/api/customers/${id}`);

      // Khi thành công, hiển thị thông báo
      messageApi.success("Xóa khách hàng thành công");

      // Cập nhật lại danh sách khách hàng trên UI mà không cần reload
      setAllCustomer((prev) => prev.filter((cust) => cust._id !== id));
      setFinalCustomer((prev) => prev.filter((cust) => cust._id !== id));

      // Làm mới dữ liệu
      mutateCustomers();
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
      messageApi.error("Không thể xóa khách hàng");
    }
  };

  // Định nghĩa các cột cho bảng
  const columns = [
    // 1. Ảnh chân dung
    {
      dataIndex: "profile",
      key: "profile",
      render: (profile) => {
        let profilePath = profile || "bank-images/dummy.jpg";
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
      title: "Ảnh",
    },
    // 2. Chữ ký
    {
      dataIndex: "signature",
      key: "signature",
      render: (signature) => {
        let signaturePath = signature || "bank-images/dummy.jpg";
        if (signaturePath.startsWith("/")) {
          signaturePath = signaturePath.slice(1);
        }
        const imageUrl = `${import.meta.env.VITE_BASE_URL}/${signaturePath}`;
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
      title: "Chữ ký",
    },
    // 3. Tài liệu (nút download)
    {
      dataIndex: "document",
      key: "document",
      render: (document) => {
        const hasDocument = document && document !== "bank-images/dummy.jpg";
        if (!hasDocument) {
          return <span className="text-gray-400">-</span>;
        }
        let docPath = document;
        if (docPath.startsWith("/")) {
          docPath = docPath.slice(1);
        }
        const downloadUrl = `${import.meta.env.VITE_BASE_URL}/${docPath}`;
        return (
          <Button
            className="bg-blue-100 text-blue-500 hover:bg-blue-200"
            href={downloadUrl}
            icon={<DownloadOutlined />}
            shape="circle"
            target="_blank"
            type="text"
          />
        );
      },
      title: "Tài liệu",
    },
    // 4. Loại người dùng
    {
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        let colorClass = "text-rose-500";
        let label = "khách hàng";
        if (text === "admin") {
          colorClass = "text-indigo-500";
          label = "quản trị viên";
        } else if (text === "employee") {
          colorClass = "text-green-500";
          label = "nhân viên";
        }
        return (
          <span className={`${colorClass} capitalize font-medium`}>
            {label}
          </span>
        );
      },
      title: "Loại người dùng",
    },
    // 5. Số tài khoản
    {
      dataIndex: "accountNumber",
      key: "accountNumber",
      title: "Số tài khoản",
    },
    // 6. Họ tên
    {
      dataIndex: "fullName",
      key: "fullName",
      title: "Họ tên",
    },
    // 7. Ngày sinh
    {
      dataIndex: "DOB",
      key: "DOB",
      render: (dob) => {
        if (!dob) return "-";
        // Chuyển đổi sang định dạng dd/MM/yyyy
        const date = new Date(dob);
        if (Number.isNaN(date.getTime())) return dob;
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      title: "Ngày sinh",
    },
    // 8. Email
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
    },
    // 9. Số điện thoại
    {
      dataIndex: "mobile",
      key: "mobile",
      title: "Số điện thoại",
    },
    // 10. Địa chỉ
    {
      dataIndex: "address",
      key: "address",
      title: "Địa chỉ",
    },
    // 11. Người tạo (Created By)
    {
      dataIndex: "createdBy",
      key: "createdBy_column",
      render: (createdBy) => (
        <span className="text-gray-600">{createdBy || "-"}</span>
      ),
      title: "Người tạo",
    },
    // 12. Số dư (finalBalance)
    {
      dataIndex: "finalBalance",
      key: "finalBalance_column",
      render: (balance) => (
        <span className="font-medium text-green-600">
          {balance?.toLocaleString("vi-VN") || "0"}
        </span>
      ),
      title: "Số dư",
    },
    // 13. Trạng thái (có thể click để thay đổi)
    {
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Popconfirm
          cancelText="Không"
          description="Sau khi cập nhật, bạn có thể cập nhật lại"
          okText="Có"
          onConfirm={() => updateIsActive(record._id, isActive)}
          title="Bạn có chắc chắn?"
        >
          {isActive ? (
            <EyeOutlined className="text-green-500 hover:text-green-700 text-lg cursor-pointer" />
          ) : (
            <EyeInvisibleOutlined className="text-pink-500 hover:text-pink-700 text-lg cursor-pointer" />
          )}
        </Popconfirm>
      ),
      title: "Trạng thái",
    },
    // 14. Hành động
    {
      fixed: "right",
      key: "action",
      render: (_text, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => onEditCustomer(record)}
            size="small"
            type="primary"
          >
            Chỉnh sửa
          </Button>
          <Popconfirm
            cancelText="Không"
            description="Sau khi xóa, bạn sẽ không thể khôi phục"
            okText="Có"
            onCancel={() => messageApi.info("Dữ liệu của bạn vẫn an toàn")}
            onConfirm={() => onDeleteCustomer(record._id)}
            title="Bạn có chắc chắn muốn xóa?"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
      title: "Hành động",
    },
  ];

  // Dữ liệu hiển thị
  const displayData = allCustomer || [];

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
        onCancel={() => {
          setAccountModel(false);
          setEdit(null);
          accountForm.resetFields();
          setPhoto(null);
          setSignature(null);
          setDocument(null);
        }}
        open={accountModel}
        title={edit ? "Chỉnh sửa tài khoản" : "Mở tài khoản mới"}
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
              <Input
                disabled
                placeholder={
                  edit ? "Không thể thay đổi" : "Số tài khoản tự động"
                }
              />
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
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { message: "Vui lòng nhập email", required: true },
                { message: "Email không hợp lệ", type: "email" },
              ]}
            >
              <Input
                disabled={!!edit}
                placeholder={edit ? "Không thể thay đổi" : "Nhập email"}
              />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ message: "Vui lòng nhập mật khẩu", required: !edit }]}
            >
              <Input.Password
                disabled={!!edit}
                placeholder={edit ? "Không thể thay đổi" : "Nhập mật khẩu"}
              />
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
            <div>
              <Form.Item label="Ảnh" name="photoFile">
                <Input onChange={handlePhoto} type="file" />
              </Form.Item>
              {photo && (
                <div className="mt-2 ml-0">
                  <Image
                    height={80}
                    src={`${import.meta.env.VITE_BASE_URL}/${photo.startsWith("/") ? photo.slice(1) : photo}`}
                    width={80}
                  />
                </div>
              )}
            </div>

            {/* Tải chữ ký */}
            <div>
              <Form.Item label="Chữ ký" name="signatureFile">
                <Input onChange={handleSignature} type="file" />
              </Form.Item>
              {signature && (
                <div className="mt-2 ml-0">
                  <Image
                    height={80}
                    src={`${import.meta.env.VITE_BASE_URL}/${signature.startsWith("/") ? signature.slice(1) : signature}`}
                    width={80}
                  />
                </div>
              )}
            </div>

            {/* Tải tài liệu */}
            <div>
              <Form.Item label="Tài liệu" name="documentFile">
                <Input onChange={handleDocument} type="file" />
              </Form.Item>
              {document && document !== "bank-images/dummy.jpg" && (
                <div className="mt-2 ml-0">
                  <a
                    className="text-blue-500 underline"
                    href={`${import.meta.env.VITE_BASE_URL}/${document.startsWith("/") ? document.slice(1) : document}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Xem tài liệu hiện tại
                  </a>
                </div>
              )}
            </div>
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
            <div className="flex gap-2">
              <Button
                className="text-white! font-bold"
                htmlType="submit"
                loading={loading}
                type="primary"
              >
                {edit ? "Cập nhật" : "Lưu"}
              </Button>
              {edit && (
                <Button
                  onClick={() => {
                    accountForm.resetFields();
                    setPhoto(null);
                    setSignature(null);
                    setDocument(null);
                    setEdit(null);
                    setAccountModel(false);
                    messageApi.info("Đã hủy chỉnh sửa");
                  }}
                >
                  Hủy
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewAccount;
