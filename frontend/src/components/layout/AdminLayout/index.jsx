import {
  BranchesOutlined,
  DashboardOutlined,
  GiftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

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
    icon: <BranchesOutlined />,
    key: "/admin/branch",
    label: <Link to="/admin/branch">Chi nhánh</Link>,
  },
  {
    icon: <GiftOutlined />,
    key: "/admin/branding",
    label: <Link to="/admin/branding">Thương hiệu</Link>,
  },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
