import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
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
  const [authorized, setAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Lấy token từ cookie
        const token = cookies.get("auth-token");
        const userType = cookies.get("user-type");

        // Kiểm tra token có tồn tại không
        if (!token) {
          setAuthorized(false);
          setIsLoading(false);
          navigate("/");
          return;
        }

        // Kiểm tra vai trò người dùng có khớp không (nếu có yêu cầu role)
        if (role && userType && userType.toLowerCase() !== role.toLowerCase()) {
          setAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Gọi API xác thực token với server bằng phương thức GET
        const response = await http(token).get(endPoint);

        if (response.data.success && response.data.isVerified) {
          // Lưu thông tin người dùng vào sessionStorage dưới dạng JSON
          const userData = response.data.data;
          sessionStorage.setItem("userInfo", JSON.stringify(userData));

          // Kiểm tra vai trò từ server có khớp không (nếu có yêu cầu role)
          const roleFromServer = userData?.userType;

          if (
            !role ||
            (roleFromServer &&
              roleFromServer.toLowerCase() === role.toLowerCase())
          ) {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else {
          setAuthorized(false);
        }
        setIsLoading(false);
      } catch {
        setAuthorized(false);
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [endPoint, role, navigate]);

  // Hiển thị loading trong khi đang kiểm tra
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Đang xác thực...</div>
      </div>
    );
  }

  // Nếu không xác thực được, chuyển hướng về trang chủ
  if (!authorized) {
    return <Navigate replace to="/" />;
  }

  // Nếu xác thực thành công, hiển thị các route con
  return <Outlet />;
};

export default Guard;
