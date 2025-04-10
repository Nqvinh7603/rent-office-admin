import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const AppointmentStatisticBreadcrumb = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/dashboard-appointment">Thống kê và phân tích cuộc hẹn</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default AppointmentStatisticBreadcrumb;
