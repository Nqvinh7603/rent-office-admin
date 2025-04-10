import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import UpdateBuildingLevelForm from "./UpdateBuildingLevelForm";
import { IBuildingLevel } from "../../../interfaces";

interface ViewBuildingLevelProps {
  buildingLevel: IBuildingLevel;
}

const ViewBuildingLevel: React.FC<ViewBuildingLevelProps> = ({
  buildingLevel,
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
        <UpdateBuildingLevelForm
          buildingLevelToUpdate={buildingLevel}
          onCancel={handleCloseModal}
          viewOnly
        />
      </Modal>
    </>
  );
};

export default ViewBuildingLevel;
