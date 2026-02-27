import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const { Header, Sider, Content } = Layout;

const EmployeeLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cookies = new Cookies();

  // Xử lý đăng xuất
  const logoutFunction = () => {
    sessionStorage.removeItem("user_info");
    cookies.remove("auth_token");
    navigate("/");
  };

  const menuItems = [
    {
      icon: <DashboardOutlined />,
      key: "/employee",
      label: <Link to="/employee">Bảng điều khiển</Link>,
    },
    {
      icon: <LogoutOutlined />,
      key: "/employee/logout",
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
export default EmployeeLayout;
