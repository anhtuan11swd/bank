import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

/**
 * Dashboard dùng chung — hiển thị thống kê tổng quan.
 * Có thể nhận props stats để tùy biến (admin/employee/customer).
 */
const Dashboard = ({ stats } = {}) => {
  const defaultStats = {
    balance: stats?.balance ?? 0,
    totalExpense: stats?.totalExpense ?? 0,
    totalIncome: stats?.totalIncome ?? 0,
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Tổng quan</h2>
      <Row gutter={[16, 16]}>
        <Col lg={8} sm={12} xs={24}>
          <Card>
            <Statistic
              prefix={<WalletOutlined />}
              title="Số dư"
              value={defaultStats.balance}
            />
          </Card>
        </Col>
        <Col lg={8} sm={12} xs={24}>
          <Card>
            <Statistic
              prefix={<ArrowDownOutlined />}
              styles={{ content: { color: "#3f8600" } }}
              title="Tổng thu"
              value={defaultStats.totalIncome}
            />
          </Card>
        </Col>
        <Col lg={8} sm={12} xs={24}>
          <Card>
            <Statistic
              prefix={<ArrowUpOutlined />}
              styles={{ content: { color: "#cf1322" } }}
              title="Tổng chi"
              value={defaultStats.totalExpense}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
