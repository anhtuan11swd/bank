import {
  BranchesOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  GiftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const logoutFunction = () => {
    sessionStorage.removeItem("user_info");
    cookies.remove("auth_token");
    navigate("/");
  };

  const menuItems = [
    {
      icon: <DashboardOutlined />,
      key: "/admin",
      label: <Link to="/admin">Bảng điều khiển</Link>,
    },
    {
      icon: <UserOutlined />,
      key: "/admin/new-employee",
      label: <Link to="/admin/new-employee">Thêm nhân viên mới</Link>,
    },
    {
      icon: <UserAddOutlined />,
      key: "/admin/new-account",
      label: <Link to="/admin/new-account">Mở tài khoản mới</Link>,
    },
    {
      icon: <BranchesOutlined />,
      key: "/admin/branch",
      label: <Link to="/admin/branch">Chi nhánh</Link>,
    },
    {
      icon: <DollarCircleOutlined />,
      key: "/admin/currency",
      label: <Link to="/admin/currency">Tiền tệ</Link>,
    },
    {
      icon: <GiftOutlined />,
      key: "/admin/branding",
      label: <Link to="/admin/branding">Thương hiệu</Link>,
    },
    {
      icon: <LogoutOutlined />,
      key: "/admin/logout",
      label: (
        <button
          className="font-semibold bg-transparent border-0 p-0 cursor-pointer hover:opacity-80"
          onClick={logoutFunction}
          style={{ color: "rgba(255, 255, 255, 0.85)" }}
          type="button"
        >
          Đăng xuất
        </button>
      ),
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout className="min-h-screen!">
      <Sider collapsed={collapsed} collapsible trigger={null}>
        <div className="demo-logo-vertical" />
        <Menu
          items={menuItems}
          mode="inline"
          selectedKeys={[location.pathname]}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, padding: 0 }}>
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              height: 64,
              width: 64,
            }}
            type="text"
          />
        </Header>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            margin: "24px 16px",
            minHeight: 280,
            padding: 24,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
