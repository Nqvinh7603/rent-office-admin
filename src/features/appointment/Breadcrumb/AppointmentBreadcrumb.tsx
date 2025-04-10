import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const AppointmentBreadcrumb = ({
  appointmentBuildingId,
}: {
  appointmentBuildingId?: string;
}) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/appointments">Quản lý cuộc hẹn</Link>
      </Breadcrumb.Item>
      {appointmentBuildingId && (
        <Breadcrumb.Item>Chi tiết cuộc hẹn</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};

export default AppointmentBreadcrumb;
