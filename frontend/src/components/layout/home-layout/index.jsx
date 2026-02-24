import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useState } from "react";

const { Header, Sider, Content } = Layout;
const HomeLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
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
          defaultSelectedKeys={["1"]}
          items={[
            {
              icon: <UserOutlined />,
              key: "1",
              label: "nav 1",
            },
            {
              icon: <VideoCameraOutlined />,
              key: "2",
              label: "nav 2",
            },
            {
              icon: <UploadOutlined />,
              key: "3",
              label: "nav 3",
            },
          ]}
          mode="inline"
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
export default HomeLayout;
