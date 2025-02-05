import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IBuildingType } from "../../../interfaces";
import UpdateBuildingTypeForm from "./UpdateBuildingTypeForm";

interface UpdateBuildingTypeProps {
  buildingType: IBuildingType;
}

const UpdateBuildingType: React.FC<UpdateBuildingTypeProps> = ({
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
      <Tooltip title="Chỉnh sửa">
        <EditOutlined
          className="table-icon text-xl text-[#ffa500]"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        open={isOpenModal}
        width="50%"
        title={<span className="text-lg">Chỉnh sửa loại tòa nhà</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateBuildingTypeForm
          buildingTypeToUpdate={buildingType}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateBuildingType;
