import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const BuildingStatisticBreadcrumb = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/dashboard-building">Thống kê và phân tích tài sản</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BuildingStatisticBreadcrumb;
