import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const ConsignmentBreadcrumb = ({
  consignmentId,
}: {
  consignmentId?: string;
}) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/consignments">Quản lý yêu cầu ký gửi</Link>
      </Breadcrumb.Item>
      {consignmentId && (
        <Breadcrumb.Item>Chi tiết yêu cầu ký gửi</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};

export default ConsignmentBreadcrumb;
