import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import { useCallback, useEffect, useState } from "react";
import { http, trimData } from "../../../modules/modules";
import AdminLayout from "../../layout/AdminLayout";

const Currency = () => {
  // Khởi tạo http request với cấu hình mặc định
  const httpRequest = http();
  // Khởi tạo hook useForm để quản lý form
  const [currencyForm] = Form.useForm();

  // State cho trạng thái loading
  const [loading, setLoading] = useState(false);

  // State cho danh sách tiền tệ
  const [allCurrency, setAllCurrency] = useState([]);

  // State lưu trữ dữ liệu tiền tệ đang chỉnh sửa
  const [edit, setEdit] = useState(null);

  // Sử dụng hook useMessage để tạo messageApi và contextHolder
  const [messageApi, contextHolder] = message.useMessage();

  // Hàm lấy danh sách tiền tệ từ API
  const fetchCurrencies = useCallback(async () => {
    try {
      const response = await httpRequest.get("/api/currency");
      setAllCurrency(response?.data?.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tiền tệ:", error);
      messageApi.error("Không thể lấy dữ liệu");
    }
  }, [httpRequest, messageApi]);

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  // Xử lý khi form được submit thành công
  const onFinish = async (values) => {
    const finalObj = trimData(values);
    console.log("Thành công:", finalObj);

    // Tạo key dựa trên tên tiền tệ
    finalObj.key = finalObj.currencyName;

    // Bật trạng thái loading
    setLoading(true);

    try {
      const response = await httpRequest.post("/api/currency", finalObj);
      console.log("Phản hồi:", response.data);

      messageApi.success("Đã tạo tiền tệ");

      // Đặt lại form sau khi hoàn tất
      currencyForm.resetFields();

      // Làm mới dữ liệu
      fetchCurrencies();
    } catch (error) {
      console.error("Lỗi:", error);

      // Kiểm tra lỗi trùng lặp (mã lỗi 11000)
      if (error.response?.data?.error?.code === 11000) {
        messageApi.error("Tiền tệ đã tồn tại");
      } else {
        messageApi.error("Thất bại - Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý cập nhật tiền tệ
  const onUpdate = async (values) => {
    const finalObj = trimData(values);

    setLoading(true);

    try {
      const response = await httpRequest.put(
        `/api/currency/${edit._id}`,
        finalObj,
      );

      if (response.status === 200) {
        messageApi.success("Cập nhật tiền tệ thành công");

        currencyForm.resetFields();
        setEdit(null);

        fetchCurrencies();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      messageApi.error("Không thể cập nhật tiền tệ");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý chỉnh sửa tiền tệ - đổ dữ liệu vào form
  const onEditCurrency = (record) => {
    setEdit(record);
    currencyForm.setFieldsValue({
      currencyDescription: record.currencyDescription,
      currencyName: record.currencyName,
    });
    messageApi.success("Đã tải dữ liệu tiền tệ vào form chỉnh sửa");
  };

  // Hàm xóa tiền tệ
  const onDeleteCurrency = async (id) => {
    try {
      await httpRequest.delete(`/api/currency/${id}`);

      messageApi.success("Đã xóa tiền tệ thành công");

      setAllCurrency((prev) => prev.filter((currency) => currency._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa tiền tệ:", error);
      messageApi.error("Không thể xóa tiền tệ");
    }
  };

  const columns = [
    {
      dataIndex: "currencyName",
      key: "currencyName",
      title: "Tên tiền tệ",
    },
    {
      dataIndex: "currencyDescription",
      key: "currencyDescription",
      title: "Mô tả tiền tệ",
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
            onConfirm={() => onEditCurrency(record)}
            title="Bạn có chắc không?"
          >
            <EditOutlined className="text-green-500 hover:text-green-700 text-lg cursor-pointer" />
          </Popconfirm>
          <Popconfirm
            cancelText="Không"
            description="Sau khi xóa, bạn sẽ không thể khôi phục"
            okText="Có"
            onCancel={() => messageApi.info("Dữ liệu của bạn vẫn an toàn")}
            onConfirm={() => onDeleteCurrency(record._id)}
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
  const dataWithKeys = allCurrency.map((currency) => ({
    ...currency,
    key: currency.key || currency._id || currency.id,
  }));

  return (
    <AdminLayout>
      {/* ContextHolder để hiển thị notifications trên toàn ứng dụng */}
      {contextHolder}
      <div className="gap-3 grid md:grid-cols-3">
        {/* Thẻ thêm/chỉnh sửa tiền tệ */}
        <Card
          className="md:col-span-1"
          title={edit ? "Chỉnh sửa tiền tệ" : "Thêm tiền tệ mới"}
        >
          <Form
            form={currencyForm}
            layout="vertical"
            onFinish={edit ? onUpdate : onFinish}
          >
            <Form.Item
              label="Tên tiền tệ"
              name="currencyName"
              rules={[{ message: "Vui lòng nhập tên tiền tệ", required: true }]}
            >
              <Input placeholder="Nhập tên tiền tệ" />
            </Form.Item>

            <Form.Item
              label="Mô tả tiền tệ"
              name="currencyDescription"
              rules={[
                { message: "Vui lòng nhập mô tả tiền tệ", required: true },
              ]}
            >
              <Input.TextArea placeholder="Nhập mô tả tiền tệ" rows={3} />
            </Form.Item>

            <Button
              className="w-full"
              danger={!!edit}
              htmlType="submit"
              loading={loading}
              type="primary"
            >
              {edit ? "Cập nhật tiền tệ" : "Thêm tiền tệ"}
            </Button>

            {edit && (
              <Button
                className="w-full mt-2"
                onClick={() => {
                  currencyForm.resetFields();
                  setEdit(null);
                  messageApi.info("Đã hủy chỉnh sửa");
                }}
              >
                Hủy chỉnh sửa
              </Button>
            )}
          </Form>
        </Card>

        {/* Thẻ danh sách tiền tệ */}
        <Card
          className="md:col-span-2"
          style={{ overflowX: "auto" }}
          title="Danh sách tiền tệ"
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

export default Currency;
