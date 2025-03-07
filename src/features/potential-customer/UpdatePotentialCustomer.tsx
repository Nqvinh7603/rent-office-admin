import { EditOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { ICustomer } from "../../interfaces";
import UpdatePotentialCustomerForm from "./UpdatePotentailCustomerForm";

interface UpdatePotentialCustomerProps {
  potentialCustomer: ICustomer;
}

const UpdatePotentialCustomer: React.FC<UpdatePotentialCustomerProps> = ({
  potentialCustomer,
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
        title={<span className="text-lg">Chỉnh sửa trạng thái</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <UpdatePotentialCustomerForm
          potentialCustomerToUpdate={potentialCustomer}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default UpdatePotentialCustomer;
