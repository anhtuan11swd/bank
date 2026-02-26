import { EditOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, message, Upload } from "antd";
import { useCallback, useEffect, useState } from "react";
import { http, trimData } from "../../../modules/modules";
import AdminLayout from "../../layout/AdminLayout";

const DUMMY_LOGO = "/bank-images/dummy.jpg";

const Branding = () => {
  const [bankForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoPath, setLogoPath] = useState(null);
  const [brandings, setBrandings] = useState(null);
  const [_number, setNumber] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const httpRequest = http();

  // Lấy dữ liệu branding khi component mount hoặc number thay đổi
  const fetchBrandings = useCallback(async () => {
    try {
      const response = await httpRequest.get("/api/branding");
      const data = response?.data?.data?.[0];
      console.log("Branding data:", data);

      if (data) {
        setBrandings(data);
        setLogoPath(data.bankLogo);

        // Điền dữ liệu vào form
        bankForm.setFieldsValue({
          bankAccountNumber: data.bankAccountNumber,
          bankAddress: data.bankAddress,
          bankDescription: data.bankDescription,
          bankName: data.bankName,
          bankTagline: data.bankTagline,
          bankTransactionId: data.bankTransactionId,
          facebook: data.facebook,
          linkedin: data.linkedin,
          twitter: data.twitter,
        });

        // Nếu có dữ liệu, mặc định khóa form (không cho edit)
        setIsEdit(false);
      } else {
        // Nếu chưa có dữ liệu, cho phép nhập mới
        setIsEdit(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu branding:", error);
      messageApi.error("Không thể lấy dữ liệu branding");
    }
  }, [httpRequest, bankForm, messageApi]);

  useEffect(() => {
    fetchBrandings();
  }, [fetchBrandings]);

  // Xử lý upload logo ngân hàng
  const handleUpload = async ({ file }) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await httpRequest.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPath = response?.data?.data?.path;
      if (uploadedPath) {
        setLogoPath(uploadedPath);
        messageApi.success("Tải logo thành công");
      }
    } catch (error) {
      console.error("Lỗi khi tải logo:", error);
      messageApi.error("Không thể tải logo lên");
    } finally {
      setUploading(false);
    }
  };

  // Custom upload button với preview
  const uploadButton = (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <UploadOutlined className="text-2xl mb-2" />
      <div className="text-sm">{uploading ? "Đang tải..." : "Chọn logo"}</div>
    </div>
  );

  // Hàm xử lý CẬP NHẬT branding
  const onUpdate = async (finalObj) => {
    // Chuẩn bị dữ liệu branding - giữ ảnh cũ nếu không có ảnh mới
    const brandingInfo = {
      bankAccountNumber: finalObj.bankAccountNumber,
      bankAddress: finalObj.bankAddress,
      bankDescription: finalObj.bankDescription,
      // Nếu có logoPath mới thì dùng, không thì giữ ảnh cũ từ brandings
      bankLogo: logoPath || brandings?.bankLogo || DUMMY_LOGO,
      bankName: finalObj.bankName,
      bankTagline: finalObj.bankTagline,
      bankTransactionId: finalObj.bankTransactionId,
      facebook: finalObj.facebook,
      linkedin: finalObj.linkedin,
      twitter: finalObj.twitter,
    };

    const brandingResponse = await httpRequest.put(
      `/api/branding/${brandings._id}`,
      brandingInfo,
    );

    if (brandingResponse.status === 200 || brandingResponse.status === 201) {
      messageApi.success("Cập nhật thông tin branding thành công");
      setIsEdit(false); // Khóa form sau khi cập nhật
      setLogoPath(null); // Reset trạng thái ảnh
      setNumber((prev) => prev + 1); // Lấy dữ liệu mới
    } else {
      messageApi.error("Không thể cập nhật thông tin branding");
    }
  };

  // Hàm xử lý TẠO MỚI branding
  const onCreate = async (finalObj) => {
    // Phân tách dữ liệu: Thông tin Admin -> Users
    const userInfo = {
      address: finalObj.bankAddress,
      email: finalObj.adminEmail,
      fullName: finalObj.adminFullName,
      isActive: true,
      password: finalObj.adminPassword,
      profile: "bank-images/dummy.jpg",
      userType: "admin",
    };

    // Thông tin Branding -> Branding collection
    const brandingInfo = {
      bankAccountNumber: finalObj.bankAccountNumber,
      bankAddress: finalObj.bankAddress,
      bankDescription: finalObj.bankDescription,
      bankLogo: logoPath || DUMMY_LOGO,
      bankName: finalObj.bankName,
      bankTagline: finalObj.bankTagline,
      bankTransactionId: finalObj.bankTransactionId,
      facebook: finalObj.facebook,
      linkedin: finalObj.linkedin,
      twitter: finalObj.twitter,
    };

    // Gửi dữ liệu Admin đến API Users
    const userResponse = await httpRequest.post("/api/users", userInfo);

    if (userResponse.status === 200 || userResponse.status === 201) {
      // Gửi dữ liệu Branding đến API Branding
      const brandingResponse = await httpRequest.post(
        "/api/branding",
        brandingInfo,
      );

      if (brandingResponse.status === 200 || brandingResponse.status === 201) {
        messageApi.success("Lưu thông tin branding thành công");
        bankForm.resetFields(); // Reset form sau khi tạo mới
        setLogoPath(null); // Reset ảnh
        setNumber((prev) => prev + 1); // Lấy dữ liệu mới
      } else {
        messageApi.error("Không thể lưu thông tin branding");
      }
    } else {
      messageApi.error("Không thể tạo tài khoản admin");
    }
  };

  // Hàm xử lý chính - Phân luồng Create/Update
  const onFinish = async (values) => {
    setLoading(true);

    try {
      // Làm sạch dữ liệu đầu vào
      const finalObj = trimData(values);

      // Phân luồng: Update nếu có dữ liệu, Create nếu chưa có
      if (brandings) {
        await onUpdate(finalObj);
      } else {
        await onCreate(finalObj);
      }
    } catch (error) {
      console.error("Lỗi khi lưu branding:", error);

      // Kiểm tra lỗi trùng lặp email (chỉ khi tạo mới)
      if (!brandings && error.response?.data?.error?.code === 11000) {
        bankForm.setFields([
          {
            errors: ["Email đã tồn tại"],
            name: "adminEmail",
          },
        ]);
      } else {
        messageApi.error(
          brandings
            ? "Không thể cập nhật thông tin branding"
            : "Không thể lưu thông tin branding",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {contextHolder}
      <Card
        extra={
          brandings && (
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEdit(!isEdit)}
              type={isEdit ? "primary" : "text"}
            >
              {isEdit ? "Hủy chỉnh sửa" : "Sửa"}
            </Button>
          )
        }
        title="Thông tin ngân hàng"
      >
        <Form
          disabled={!isEdit}
          form={bankForm}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* Grid động: 3 cột khi tạo mới, 2 cột khi cập nhật */}
          <div
            className={`grid grid-cols-1 ${brandings ? "md:grid-cols-2" : "md:grid-cols-3"} gap-x-4 gap-y-2`}
          >
            {/* Cột 1: Thông tin ngân hàng */}
            <div className="space-y-1">
              <Form.Item
                label="Tên ngân hàng"
                name="bankName"
                rules={[
                  { message: "Vui lòng nhập tên ngân hàng", required: true },
                ]}
              >
                <Input placeholder="Nhập tên ngân hàng" />
              </Form.Item>

              <Form.Item
                label="Câu khẩu hiệu"
                name="bankTagline"
                rules={[
                  { message: "Vui lòng nhập câu khẩu hiệu", required: true },
                ]}
              >
                <Input placeholder="Nhập câu khẩu hiệu" />
              </Form.Item>

              <Form.Item label="Logo ngân hàng">
                <div className="flex items-center gap-4">
                  <Upload
                    accept="image/*"
                    customRequest={handleUpload}
                    disabled={!isEdit}
                    listType="picture-card"
                    maxCount={1}
                    showUploadList={false}
                  >
                    {logoPath ? (
                      <Image
                        alt="Logo ngân hàng"
                        className="object-contain"
                        fallback={DUMMY_LOGO}
                        height={100}
                        preview={false}
                        src={logoPath}
                        width={100}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                  {logoPath && isEdit && (
                    <Button
                      danger
                      onClick={() => setLogoPath(null)}
                      size="small"
                    >
                      Xóa logo
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hỗ trợ định dạng: JPG, PNG, GIF. Tối đa 2MB.
                </p>
              </Form.Item>

              <Form.Item
                label="Số tài khoản ngân hàng"
                name="bankAccountNumber"
                rules={[
                  { message: "Vui lòng nhập số tài khoản", required: true },
                ]}
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>

              <Form.Item
                label="ID giao dịch ngân hàng"
                name="bankTransactionId"
                rules={[
                  { message: "Vui lòng nhập ID giao dịch", required: true },
                ]}
              >
                <Input placeholder="Nhập ID giao dịch" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ ngân hàng"
                name="bankAddress"
                rules={[{ message: "Vui lòng nhập địa chỉ", required: true }]}
              >
                <Input placeholder="Nhập địa chỉ ngân hàng" />
              </Form.Item>
            </div>

            {/* Cột 2: Thông tin Admin - Chỉ hiển thị khi tạo mới */}
            {!brandings && (
              <div className="space-y-1">
                <div className="bg-blue-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-blue-700 font-medium">
                    Thông tin tài khoản Admin
                  </p>
                  <p className="text-xs text-blue-600">
                    Tạo tài khoản quản trị viên mới
                  </p>
                </div>

                <Form.Item
                  label="Họ tên quản trị viên"
                  name="adminFullName"
                  rules={[
                    {
                      message: "Vui lòng nhập họ tên",
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Nhập họ tên quản trị viên" />
                </Form.Item>

                <Form.Item
                  label="Email quản trị viên"
                  name="adminEmail"
                  rules={[
                    {
                      message: "Vui lòng nhập email",
                      required: true,
                    },
                    { message: "Email không hợp lệ", type: "email" },
                  ]}
                >
                  <Input placeholder="Nhập email quản trị viên" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu quản trị viên"
                  name="adminPassword"
                  rules={[
                    {
                      message: "Vui lòng nhập mật khẩu",
                      required: true,
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </div>
            )}

            {/* Cột cuối: Mạng xã hội */}
            <div className="space-y-1">
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="text-sm text-gray-700 font-medium">
                  Liên kết mạng xã hội
                </p>
                <p className="text-xs text-gray-500">
                  Tùy chọn - Có thể để trống
                </p>
              </div>

              <Form.Item label="LinkedIn" name="linkedin">
                <Input
                  placeholder="https://linkedin.com/company/..."
                  type="url"
                />
              </Form.Item>

              <Form.Item label="Twitter" name="twitter">
                <Input placeholder="https://twitter.com/..." type="url" />
              </Form.Item>

              <Form.Item label="Facebook" name="facebook">
                <Input placeholder="https://facebook.com/..." type="url" />
              </Form.Item>
            </div>
          </div>

          {/* Bank Description - Full width với divider */}
          <div className="border-t border-gray-200 my-4 pt-4">
            <Form.Item
              label="Mô tả ngân hàng"
              name="bankDescription"
              rules={[{ message: "Vui lòng nhập mô tả", required: true }]}
            >
              <Input.TextArea
                maxLength={500}
                placeholder="Nhập mô tả chi tiết về ngân hàng, lịch sử hình thành, sứ mệnh và tầm nhìn..."
                rows={4}
                showCount
              />
            </Form.Item>
          </div>

          {/* Nút Submit/Update */}
          <div className="flex justify-end">
            <Button
              className="bg-blue-500"
              htmlType="submit"
              icon={brandings ? <SaveOutlined /> : null}
              loading={loading}
              type="primary"
            >
              {brandings ? "Cập nhật" : "Lưu"}
            </Button>
          </div>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default Branding;
