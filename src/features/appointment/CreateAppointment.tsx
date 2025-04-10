import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useState } from "react";
import CreateAppointmentBuildingForm from "./CreateAppointmentForm";
const CreateAppointment: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
        Thêm mới cuộc hẹn
      </Button>
      <Modal
        open={isOpenModal}
        width="70%"
        title={<span className="text-lg">Thêm cuộc hẹn</span>}
        destroyOnClose
        onCancel={handleCloseModal}
        footer={null}
      >
        <CreateAppointmentBuildingForm onCancel={handleCloseModal} />
      </Modal>
    </>
  );
};

export default CreateAppointment;
