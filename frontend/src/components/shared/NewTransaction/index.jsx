import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Form, Image, Input, message, Select } from "antd";
import { useState } from "react";

// URL ảnh mặc định khi chưa có ảnh thật
const dummyImageUrl = `${import.meta.env.VITE_BASE_URL || ""}/bank-images/dummy.jpg`;

// Các loại giao dịch: ghi có / ghi nợ
const TRANSACTION_TYPE_OPTIONS = [
  { label: "Credit (Ghi có)", value: "credit" },
  { label: "Debit (Ghi nợ)", value: "debit" },
];

/** Form tạo giao dịch mới: tìm tài khoản theo số, hiển thị thông tin và nhập chi tiết giao dịch */
const NewTransaction = () => {
  const _userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
  const [_messageApi, contextHolder] = message.useMessage();
  const [accountNumber, setAccountNumber] = useState(null);
  const [accountDetail, _setAccountDetail] = useState(null);
  const [transactionForm] = Form.useForm();

  // Tìm kiếm tài khoản theo số tài khoản (chưa gọi API)
  const searchByAccountNumber = async () => {
    alert(accountNumber);
  };

  // Xử lý khi submit form giao dịch
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Card
      extra={
        <Input
          addonAfter={
            <SearchOutlined
              onClick={searchByAccountNumber}
              style={{ cursor: "pointer" }}
            />
          }
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Nhập số tài khoản"
          value={accountNumber ?? ""}
        />
      }
      title="Giao dịch mới"
    >
      {contextHolder}
      {accountDetail ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ảnh đại diện / CMND (placeholder) */}
          <div className="flex flex-col gap-4">
            <Image height={120} src={dummyImageUrl} width={120} />
            <Image height={120} src={dummyImageUrl} width={120} />
          </div>
          {/* Thông tin tài khoản: họ tên, SĐT, số dư, ngày sinh, loại tiền */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex justify-between items-center">
              <b>Họ tên</b>
              <b>{accountDetail.fullName ?? "-"}</b>
            </div>
            <div className="flex justify-between items-center">
              <b>Số điện thoại</b>
              <b>{accountDetail.mobile ?? "-"}</b>
            </div>
            <div className="flex justify-between items-center">
              <b>Số dư</b>
              <b>{accountDetail.finalBalance ?? "-"}</b>
            </div>
            <div className="flex justify-between items-center">
              <b>Ngày sinh</b>
              <b>{accountDetail.DOB ?? "-"}</b>
            </div>
            <div className="flex justify-between items-center">
              <b>Loại tiền</b>
              <b>{accountDetail.currency ?? "-"}</b>
            </div>
          </div>
          <div className="md:col-span-2" />
          {/* Form nhập loại giao dịch, số tiền, nội dung tham chiếu */}
          <div className="md:col-span-2">
            <Form form={transactionForm} layout="vertical" onFinish={onFinish}>
              <div className="grid gap-4 md:grid-cols-2">
                <Form.Item
                  label="Loại giao dịch"
                  name="transactionType"
                  rules={[
                    {
                      message: "Vui lòng chọn loại giao dịch",
                      required: true,
                    },
                  ]}
                >
                  <Select
                    options={TRANSACTION_TYPE_OPTIONS}
                    placeholder="Chọn loại giao dịch"
                  />
                </Form.Item>
                <Form.Item
                  label="Số tiền giao dịch"
                  name="amount"
                  rules={[
                    {
                      message: "Vui lòng nhập số tiền",
                      required: true,
                    },
                  ]}
                >
                  <Input min={0} placeholder="Nhập số tiền" type="number" />
                </Form.Item>
              </div>
              <Form.Item label="Nội dung / Tham chiếu" name="reference">
                <Input.TextArea placeholder="Nội dung tham chiếu" rows={3} />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  className="font-bold bg-blue-500 text-white hover:bg-blue-600!"
                  htmlType="submit"
                  type="primary"
                >
                  Xác nhận giao dịch
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <Empty description="Không có dữ liệu" />
      )}
    </Card>
  );
};

export default NewTransaction;
