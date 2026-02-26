import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { http, trimData } from "../../../modules/modules";

const Branch = () => {
  // Khởi tạo http request với cấu hình mặc định
  const httpRequest = http();
  // Khởi tạo hook useForm để quản lý form
  const [branchForm] = Form.useForm();

  // State cho trạng thái loading
  const [loading, setLoading] = useState(false);

  // State cho danh sách chi nhánh
  const [allBranch, setAllBranch] = useState([]);

  // State lưu trữ dữ liệu chi nhánh đang chỉnh sửa
  const [edit, setEdit] = useState(null);

  // Sử dụng hook useMessage để tạo messageApi và contextHolder
  const [messageApi, contextHolder] = message.useMessage();

  // Hàm lấy danh sách chi nhánh từ API
  const fetchBranches = useCallback(async () => {
    try {
      const response = await httpRequest.get("/api/branch");
      setAllBranch(response?.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi nhánh:", error);
      messageApi.error("Không thể lấy dữ liệu");
    }
  }, [httpRequest, messageApi]);

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Xử lý khi form được submit thành công
  const onFinish = async (values) => {
    const finalObj = trimData(values);
    console.log("Thành công:", finalObj);

    // Tạo key dựa trên tên chi nhánh
    finalObj.key = finalObj.branchName;

    // Bật trạng thái loading
    setLoading(true);

    try {
      const response = await httpRequest.post("/api/branch", finalObj);
      console.log("Phản hồi:", response.data);

      messageApi.success("Đã tạo chi nhánh");

      // Đặt lại form sau khi hoàn tất
      branchForm.resetFields();

      // Làm mới dữ liệu
      fetchBranches();
    } catch (error) {
      console.error("Lỗi:", error);

      // Kiểm tra lỗi trùng lặp (mã lỗi 11000)
      if (error.response?.data?.error?.code === 11000) {
        messageApi.error("Chi nhánh đã tồn tại");
      } else {
        messageApi.error("Thất bại - Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý cập nhật chi nhánh
  const onUpdate = async (values) => {
    const finalObj = trimData(values);

    setLoading(true);

    try {
      const response = await httpRequest.put(
        `/api/branch/${edit._id}`,
        finalObj,
      );

      if (response.status === 200) {
        messageApi.success("Cập nhật chi nhánh thành công");

        branchForm.resetFields();
        setEdit(null);

        fetchBranches();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      messageApi.error("Không thể cập nhật chi nhánh");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý chỉnh sửa chi nhánh - đổ dữ liệu vào form
  const onEditBranch = (record) => {
    setEdit(record);
    branchForm.setFieldsValue({
      branchAddress: record.branchAddress,
      branchName: record.branchName,
    });
    messageApi.success("Đã tải dữ liệu chi nhánh vào form chỉnh sửa");
  };

  // Hàm xóa chi nhánh
  const onDeleteBranch = async (id) => {
    try {
      await httpRequest.delete(`/api/branch/${id}`);

      messageApi.success("Đã xóa chi nhánh thành công");

      setAllBranch((prev) => prev.filter((branch) => branch._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa chi nhánh:", error);
      messageApi.error("Không thể xóa chi nhánh");
    }
  };

  const columns = [
    {
      dataIndex: "branchName",
      key: "branchName",
      title: "Tên chi nhánh",
    },
    {
      dataIndex: "branchAddress",
      key: "branchAddress",
      title: "Địa chỉ chi nhánh",
    },
    {
      fixed: "right",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            cancelText="Không"
            description="Sau khi cập nhật bạn vẫn có thể cập nhật lại"
            okText="Có"
            onCancel={() => messageApi.info("Không có thay đổi nào xảy ra")}
            onConfirm={() => onEditBranch(record)}
            title="Bạn có chắc không?"
          >
            <EditOutlined className="text-green-500 hover:text-green-700 text-lg cursor-pointer" />
          </Popconfirm>
          <Popconfirm
            cancelText="Không"
            description="Sau khi xóa, bạn sẽ không thể khôi phục"
            okText="Có"
            onCancel={() => messageApi.info("Dữ liệu của bạn vẫn an toàn")}
            onConfirm={() => onDeleteBranch(record._id)}
            title="Bạn có chắc chắn muốn xóa?"
          >
            <DeleteOutlined className="text-rose-500 hover:text-rose-700 text-lg cursor-pointer" />
          </Popconfirm>
        </div>
      ),
      title: "Thao tác",
    },
  ];

  // Thêm thuộc tính key cho mỗi đối tượng dữ liệu
  const dataWithKeys = allBranch.map((branch) => ({
    ...branch,
    key: branch.key || branch._id || branch.id,
  }));

  return (
    <>
      {/* ContextHolder để hiển thị notifications trên toàn ứng dụng */}
      {contextHolder}
      <div className="gap-3 grid md:grid-cols-3">
        {/* Thẻ thêm/chỉnh sửa chi nhánh */}
        <Card
          className="md:col-span-1"
          title={edit ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
        >
          <Form
            form={branchForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
          >
            <Form.Item
              label="Tên chi nhánh"
              name="branchName"
              rules={[
                { message: "Vui lòng nhập tên chi nhánh", required: true },
              ]}
            >
              <Input placeholder="Nhập tên chi nhánh" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ chi nhánh"
              name="branchAddress"
              rules={[
                { message: "Vui lòng nhập địa chỉ chi nhánh", required: true },
              ]}
            >
              <Input.TextArea placeholder="Nhập địa chỉ chi nhánh" rows={3} />
            </Form.Item>

            <Button
              className="w-full"
              danger={!!edit}
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              {edit ? "Cập nhật chi nhánh" : "Thêm chi nhánh"}
            </Button>

            {edit && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  branchForm.resetFields();
                  setEdit(null);
                  messageApi.info("Đã hủy chỉnh sửa");
                }}
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </Form>
        </Card>

        {/* Thẻ danh sách chi nhánh */}
        <Card
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
          title="Danh sách chi nhánh"
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

export default Branch;
