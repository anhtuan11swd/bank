import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
        status="404"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
        title="404"
      />
    </div>
  );
};

export default PageNotFound;
