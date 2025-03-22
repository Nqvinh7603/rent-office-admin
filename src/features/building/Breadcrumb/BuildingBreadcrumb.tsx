import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const BuildingBreadcrumb = ({ consignmentId }: { consignmentId?: string }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to="/">Trang chủ</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to="/buildings">Quản lý tài sản</Link>
      </Breadcrumb.Item>
      {consignmentId && <Breadcrumb.Item>Chi tiết tài sản</Breadcrumb.Item>}
    </Breadcrumb>
  );
};

export default BuildingBreadcrumb;
