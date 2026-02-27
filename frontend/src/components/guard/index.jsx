import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import { http } from "../../modules/modules.js";

// Khởi tạo instance của Cookies
const cookies = new Cookies();

/**
 * Component Guard - Bảo vệ định tuyến
 * Kiểm tra xác thực token trước khi cho phép truy cập vào các trang được bảo vệ
 * @param {Object} props - Props của component
 * @param {string} props.endPoint - Endpoint API để xác thực token
 * @param {string} props.role - Vai trò yêu cầu để truy cập (admin, employee)
 */
const Guard = ({ endPoint, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticateToken = async () => {
      try {
        // Lấy token từ cookie
        const token = cookies.get("auth-token");
        const userType = cookies.get("user-type");

        console.log("Guard - Token:", token);
        console.log("Guard - Endpoint:", endPoint);
        console.log("Guard - Role:", role);
        console.log("Guard - UserType từ cookie:", userType);

        // Kiểm tra token có tồn tại không
        if (!token) {
          console.log(
            "Guard - Không tìm thấy token, chuyển hướng về trang chủ",
          );
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Kiểm tra vai trò người dùng có khớp không (nếu có yêu cầu role)
        if (role && userType && userType.toLowerCase() !== role.toLowerCase()) {
          console.log("Guard - Vai trò không khớp, chuyển hướng về trang chủ");
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Gọi API xác thực token với server
        const response = await http(token).post(endPoint);
        console.log("Guard - Kết quả xác thực:", response.data);

        if (response.data.success && response.data.valid) {
          // Kiểm tra vai trò từ server có khớp không (nếu có yêu cầu role)
          const roleFromServer = response.data.data?.userType;
          if (
            !role ||
            (roleFromServer &&
              roleFromServer.toLowerCase() === role.toLowerCase())
          ) {
            setIsAuthenticated(true);
          } else {
            console.log("Guard - Vai trò từ server không khớp");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Guard - Lỗi xác thực:", err);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    authenticateToken();
  }, [endPoint, role]);

  // Hiển thị loading trong khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Đang xác thực...</div>
      </div>
    );
  }

  // Nếu không xác thực được, chuyển hướng về trang chủ
  if (!isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  // Nếu xác thực thành công, hiển thị các route con
  return <Outlet />;
};

export default Guard;
