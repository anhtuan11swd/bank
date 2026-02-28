import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import {
  fetchData,
  http,
  trimData,
  uploadFile,
} from "../../../modules/modules";

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

  // State lưu trữ bản sao dữ liệu gốc từ backend để khôi phục khi xóa tìm kiếm
  const [finalEmployee, setFinalEmployee] = useState([]);

  // State lưu trữ dữ liệu nhân viên đang chỉnh sửa
  const [edit, setEdit] = useState(null);

  // State lưu trữ danh sách chi nhánh cho Select
  const [allBranch, setAllBranch] = useState([]);

  // Sử dụng hook useMessage để tạo messageApi và contextHolder
  const [messageApi, contextHolder] = message.useMessage();

  // Sử dụng SWR để lấy danh sách chi nhánh với cấu hình tối ưu
  const { data: branches } = useSWR(
    "/api/branch",
    (url) => fetchData(url, httpRequest),
    {
      refreshInterval: 30000, // Làm mới dữ liệu mỗi 30 giây
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // useEffect xử lý dữ liệu chi nhánh từ SWR
  useEffect(() => {
    if (branches) {
      const formattedBranches = branches.map((item) => ({
        key: item._id,
        label: item.branchName,
        value: item.branchName,
      }));
      setAllBranch(formattedBranches);
    }
  }, [branches]);

  // Hàm lấy danh sách nhân viên từ API
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await httpRequest.get("/api/users");
      const allUsers = response?.data?.data || [];

      // Lọc chỉ lấy employee và admin, loại bỏ customer
      const employeeData = allUsers.filter(
        (user) => user.userType === "employee" || user.userType === "admin",
      );

      setAllEmployee(employeeData);
      setFinalEmployee(employeeData); // Lưu bản sao dữ liệu gốc cho việc tìm kiếm
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      messageApi.error("Không thể lấy dữ liệu");
    }
  }, [httpRequest, messageApi]);

  // Sử dụng useEffect để gọi API khi component được mount hoặc number thay đổi
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Hàm xử lý tải ảnh lên server
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Sử dụng hàm uploadFile từ modules với folderName = "employee_photo"
      const result = await uploadFile(file, "employee_photo", httpRequest);

      if (result.success) {
        setPhoto(result.data.path);
        messageApi.success("Tải ảnh lên thành công");
      } else {
        messageApi.error(result.message || "Tải lên thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tải lên:", error);
      messageApi.error(
        error.response?.data?.message || "Thất bại - Không thể tải lên",
      );
    }
  };

  // Xử lý khi form được submit thành công
  const onFinish = async (values) => {
    const finalObj = trimData(values);
    console.log("Thành công:", finalObj);

    // Gán ảnh đại diện cho nhân viên
    finalObj.profile = photo || "/dummy.jpg";

    // Gán key duy nhất bằng email
    finalObj.key = finalObj.email;

    // Gán loại người dùng là employee
    finalObj.userType = "employee";

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

      // Làm mới dữ liệu
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

  // Hàm xử lý cập nhật nhân viên
  const onUpdate = async (values) => {
    // Làm sạch dữ liệu đầu vào
    const finalObj = trimData(values);

    // Xóa password để tránh ghi đè mật khẩu cũ
    delete finalObj.password;

    // Chỉ thêm ảnh đại diện nếu người dùng tải lên ảnh mới
    // Nếu không, backend sẽ giữ nguyên ảnh cũ
    if (photo) {
      finalObj.profile = photo;
    }

    // Bật trạng thái loading
    setLoading(true);

    try {
      // Gửi yêu cầu cập nhật đến API với ID của nhân viên đang chỉnh sửa
      const response = await httpRequest.put(
        `/api/users/${edit._id}`,
        finalObj,
      );

      if (response.status === 200) {
        messageApi.success("Cập nhật nhân viên thành công");

        // Đặt lại form và state sau khi hoàn tất
        EMPForm.resetFields();
        setPhoto(null);
        setEdit(null);

        // Làm mới dữ liệu để hiển thị thay đổi ngay lập tức
        fetchEmployees();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      messageApi.error("Không thể cập nhật nhân viên");
    } finally {
      // Tắt trạng thái loading trong mọi trường hợp
      setLoading(false);
    }
  };

  // Hàm cập nhật trạng thái isActive
  const updateIsActive = async (id, currentIsActive) => {
    try {
      // Đảo ngược trạng thái hiện tại
      const newStatus = !currentIsActive;

      const response = await httpRequest.put(`/api/users/${id}`, {
        isActive: newStatus,
      });

      if (response.status === 200) {
        messageApi.success(
          newStatus ? "Đã kích hoạt nhân viên" : "Đã vô hiệu hóa nhân viên",
        );
        // Làm mới dữ liệu
        fetchEmployees();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      messageApi.error("Không thể cập nhật trạng thái");
    }
  };

  // Hàm xử lý chỉnh sửa nhân viên - đổ dữ liệu vào form
  const handleEdit = (record) => {
    // Lưu dữ liệu nhân viên vào state edit
    setEdit(record);
    // Tự động điền dữ liệu vào form
    EMPForm.setFieldsValue({
      address: record.address,
      branch: record.branch,
      email: record.email,
      fullName: record.fullName,
      mobile: record.mobile,
      userType: record.userType,
    });
    // Cập nhật ảnh đại diện nếu có
    setPhoto(record.profile);
    messageApi.success("Đã tải dữ liệu nhân viên vào form chỉnh sửa");
  };

  // Hàm xóa nhân viên (async với try-catch)
  const onDeleteUser = async (id) => {
    try {
      // Thực hiện yêu cầu HTTP DELETE tới endpoint /api/users/ kèm theo ID
      await httpRequest.delete(`/api/users/${id}`);

      // Khi thành công, hiển thị thông báo "Xóa nhân viên thành công"
      messageApi.success("Xóa nhân viên thành công");

      // Cập nhật lại danh sách nhân viên trên UI mà không cần reload
      setAllEmployee((prev) => prev.filter((emp) => emp._id !== id));
      setFinalEmployee((prev) => prev.filter((emp) => emp._id !== id)); // Cập nhật cả dữ liệu gốc
    } catch (error) {
      // Hiển thị thông báo lỗi "Unable to delete user" nếu có sự cố
      console.error("Lỗi khi xóa nhân viên:", error);
      messageApi.error("Không thể xóa nhân viên");
    }
  };

  // Hàm xử lý tìm kiếm nhân viên
  const onSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();

    if (!searchValue) {
      // Nếu ô tìm kiếm trống, khôi phục danh sách đầy đủ
      setAllEmployee(finalEmployee);
      return;
    }

    // Lọc dữ liệu từ finalEmployee theo nhiều trường
    const filteredData = finalEmployee.filter((emp) => {
      const fullName = (emp.fullName || "").toLowerCase();
      const userType = (emp.userType || "").toLowerCase();
      const email = (emp.email || "").toLowerCase();
      const branch = (emp.branch || "").toLowerCase();
      const mobile = (emp.mobile || "").toLowerCase();
      const address = (emp.address || "").toLowerCase();

      return (
        fullName.indexOf(searchValue) !== -1 ||
        userType.indexOf(searchValue) !== -1 ||
        email.indexOf(searchValue) !== -1 ||
        branch.indexOf(searchValue) !== -1 ||
        mobile.indexOf(searchValue) !== -1 ||
        address.indexOf(searchValue) !== -1
      );
    });

    setAllEmployee(filteredData);
  };

  const columns = [
    {
      key: "profile",
      render: (_, obj) => {
        // Chuẩn hóa URL: loại bỏ dấu / ở đầu nếu có để tránh double slash
        let profilePath = obj.profile || "dummy.jpg";
        if (profilePath.startsWith("/")) {
          profilePath = profilePath.slice(1);
        }
        const imageUrl = `${import.meta.env.VITE_BASE_URL}/${profilePath}`;
        return (
          <Image
            className="rounded-full object-cover"
            fallback={`${import.meta.env.VITE_BASE_URL}/dummy.jpg`}
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
      dataIndex: "branch",
      key: "branch",
      title: "Chi nhánh",
    },
    {
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        let colorClass = "text-rose-500"; // Mặc định Customer - đỏ
        let label = "khách hàng";
        if (text === "admin") {
          colorClass = "text-indigo-500"; // Admin - chàm
          label = "quản trị viên";
        } else if (text === "employee") {
          colorClass = "text-green-500"; // Employee - xanh lá
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
    {
      fixed: "right",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.isActive ? (
            <Popconfirm
              cancelText="Không"
              description="Sau khi cập nhật, bạn có thể cập nhật lại"
              okText="Có"
              onCancel={() => messageApi.info("Không có thay đổi nào")}
              onConfirm={() => updateIsActive(record._id, record.isActive)}
              title="Bạn có chắc chắn?"
            >
              <EyeOutlined className="text-indigo-500 hover:text-indigo-700 text-lg cursor-pointer" />
            </Popconfirm>
          ) : (
            <Popconfirm
              cancelText="Không"
              description="Sau khi cập nhật, bạn có thể cập nhật lại"
              okText="Có"
              onCancel={() => messageApi.info("Không có thay đổi nào")}
              onConfirm={() => updateIsActive(record._id, record.isActive)}
              title="Bạn có chắc chắn?"
            >
              <EyeInvisibleOutlined className="text-pink-500 hover:text-pink-700 text-lg cursor-pointer" />
            </Popconfirm>
          )}
          <Popconfirm
            cancelText="Không"
            description="Sau khi cập nhật bạn vẫn có thể cập nhật lại"
            okText="Có"
            onCancel={() => messageApi.info("Không có thay đổi nào xảy ra")}
            onConfirm={() => handleEdit(record)}
            title="Bạn có chắc không?"
          >
            <EditOutlined className="text-green-500 hover:text-green-700 text-lg cursor-pointer" />
          </Popconfirm>
          <Popconfirm
            cancelText="Không"
            description="Sau khi xóa, bạn sẽ không thể khôi phục"
            okText="Có"
            onCancel={() => messageApi.info("Dữ liệu của bạn vẫn an toàn")}
            onConfirm={() => onDeleteUser(record._id)}
            title="Bạn có chắc chắn muốn xóa?"
          >
            <DeleteOutlined className="text-rose-500 hover:text-rose-700 text-lg cursor-pointer" />
          </Popconfirm>
        </div>
      ),
      title: "Hành động",
    },
  ];

  // Thêm thuộc tính key cho mỗi đối tượng dữ liệu
  const dataWithKeys = allEmployee.map((emp) => ({
    ...emp,
    key: emp.key || emp._id || emp.id,
  }));

  return (
    <>
      {/* ContextHolder để hiển thị notifications trên toàn ứng dụng */}
      {contextHolder}
      <div className="gap-3 grid md:grid-cols-3">
        {/* Thẻ thêm/chỉnh sửa nhân viên */}
        <Card
          className="md:col-span-1"
          title={edit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        >
          <Form
            form={EMPForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
          >
            <Form.Item
              label="Chọn chi nhánh"
              name="branch"
              rules={[{ message: "Vui lòng chọn chi nhánh", required: true }]}
            >
              <Select options={allBranch} placeholder="Chọn chi nhánh" />
            </Form.Item>

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
                <Input
                  disabled={!!edit}
                  placeholder={edit ? "Không thể thay đổi" : "Nhập email"}
                />
              </Form.Item>

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

            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
            </Form.Item>

            <Button
              className="w-full"
              danger={!!edit}
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              {edit ? "Cập nhật nhân viên" : "Thêm nhân viên"}
            </Button>

            {edit && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  EMPForm.resetFields();
                  setPhoto(null);
                  setEdit(null);
                  messageApi.info("Đã hủy chỉnh sửa");
                }}
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </Form>
        </Card>

        {/* Thẻ danh sách nhân viên */}
        <Card
          className="md:col-span-2"
          extra={
            <Input
              onChange={onSearch}
              placeholder="Search by all"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
          }
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
    </>
  );
};

export default NewEmployee;
