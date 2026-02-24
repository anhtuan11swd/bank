import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const HomeLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsedWidth={0}
        collapsible
        trigger={null}
      >
        <div className="demo-logo-vertical" />
        <Menu
          items={[
            {
              icon: <UserOutlined />,
              key: "/",
              label: <Link to="/">Trang chủ</Link>,
            },
            {
              icon: <VideoCameraOutlined />,
              key: "/nav-2",
              label: <Link to="/nav-2">Giới thiệu</Link>,
            },
            {
              icon: <UploadOutlined />,
              key: "/nav-3",
              label: <Link to="/nav-3">Liên hệ</Link>,
            },
          ]}
          mode="inline"
          selectedKeys={[location.pathname]}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header style={{ background: colorBgContainer, padding: 0 }}>
          <div className="flex justify-between items-center px-4">
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
            <Link
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
              to="/admin"
            >
              Truy cập bảng quản trị
            </Link>
          </div>
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
export default HomeLayout;
