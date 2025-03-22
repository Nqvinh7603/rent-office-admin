import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { IFeeType } from "../../../interfaces";
import UpdateFeeTypeForm from "./UpdateFeeTypeForm";

interface UpdateFeeTypeProps {
  feeType: IFeeType;
}

const UpdateFeeType: React.FC<UpdateFeeTypeProps> = ({ feeType }) => {
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
        width="30%"
        title={<span className="text-lg">Chỉnh sửa loại phí</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdateFeeTypeForm
          feeTypeToUpdate={feeType}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdateFeeType;
