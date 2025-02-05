import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { type IBuildingType } from "../../../interfaces";
import UpdateBuildingTypeForm from "./UpdateBuildingTypeForm";

interface ViewBuildingTypeProps {
  buildingType: IBuildingType;
}

const ViewBuildingType: React.FC<ViewBuildingTypeProps> = ({
  buildingType,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Tooltip title="Xem chi tiết">
        <EyeOutlined
          className="table-icon text-xl text-[#1677FF]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Xem thông tin loại tòa nhà</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateBuildingTypeForm
          buildingTypeToUpdate={buildingType}
          onCancel={handleCloseModal}
          viewOnly
        />
      </Modal>
    </>
  );
};

export default ViewBuildingType;
