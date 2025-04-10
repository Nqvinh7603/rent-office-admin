import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const CustomerStatisticBreadcrumb = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/dashboard-customer">Thống kê và phân đoạn khách hàng</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default CustomerStatisticBreadcrumb;
