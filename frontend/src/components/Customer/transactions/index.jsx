import { Card, Col, Empty, Row, Table } from "antd";
import { useMemo, useState } from "react";

/**
 * Trang giao dịch khách hàng — cấu trúc giống Dashboard, nội dung là danh sách giao dịch.
 * Dùng placeholder/empty state khi chưa có API.
 */
const CustomerTransactions = () => {
  const [dataSource] = useState([]);

  const columns = useMemo(
    () => [
      {
        dataIndex: "created_at",
        key: "created_at",
        title: "Thời gian",
        width: 180,
      },
      { dataIndex: "type", key: "type", title: "Loại", width: 120 },
      { dataIndex: "amount", key: "amount", title: "Số tiền", width: 140 },
      { dataIndex: "description", key: "description", title: "Mô tả" },
    ],
    [],
  );

  const table = useMemo(
    () =>
      dataSource.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          size="middle"
        />
      ) : (
        <Empty description="Chưa có giao dịch nào" />
      ),
    [dataSource, columns],
  );

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Giao dịch</h2>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Lịch sử giao dịch">{table}</Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerTransactions;
