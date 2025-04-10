import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IBuildingLevel } from "../../../interfaces";
import UpdateBuildingLevelForm from "./UpdateBuildingLevelForm";

interface UpdateBuildingLevelProps {
  buildingLevel: IBuildingLevel;
}

const UpdateBuildingLevel: React.FC<UpdateBuildingLevelProps> = ({
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
      <Tooltip title="Chỉnh sửa">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Chỉnh sửa hạng tòa nhà</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateBuildingLevelForm
          buildingLevelToUpdate={buildingLevel}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateBuildingLevel;
