import { ProfileOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, message, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { IAssignCustomer, IConsignment, IUser } from "../../interfaces";
import { customerService } from "../../services/customer/customer-service";
interface AssignCustomerProps {
  consignment: IConsignment;
}

const AssignCustomerForConsignment: React.FC<AssignCustomerProps> = ({
  consignment,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<IUser[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [tempSelectedStaffIds, setTempSelectedStaffIds] = useState<string[]>(
    [],
  );
  const queryClient = useQueryClient();

  const handleOpenModal = () => {
    setTempSelectedStaffIds([...selectedStaffIds]);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setTempSelectedStaffIds([...selectedStaffIds]);
    setIsOpenModal(false);
  };

  const { data: staffData, isLoading } = useQuery({
    queryKey: ["staffs", consignment.customer.customerId],
    queryFn: () =>
      customerService.getStaffsByCustomerId(consignment.customer.customerId),
  });

  useEffect(() => {
    if (staffData) {
      const payload = staffData.payload || [];
      setStaffList(payload);
      setSelectedStaffIds(
        payload.filter((user) => user.checked).map((user) => user.userId),
      );
    }
  }, [staffData]);

  const handleCheckboxChange = (userId: string, checked: boolean) => {
    setTempSelectedStaffIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  const { mutate: assignCustomer, isPending } = useMutation({
    mutationFn: (assignData: IAssignCustomer) =>
      customerService.assignmentCustomerToStaffs(assignData),
    onSuccess: () => {
      message.success("Giao khách hàng thành công!");
      setSelectedStaffIds([...tempSelectedStaffIds]);
      queryClient.invalidateQueries({
        queryKey: ["staffs", consignment.customer.customerId],
      });
      setIsOpenModal(false);
    },
    onError: () => {
      message.error("Giao khách hàng thất bại!");
    },
  });

  const handleConfirm = () => {
    const assignData: IAssignCustomer = {
      customer: consignment.customer,
      users: tempSelectedStaffIds.map(
        (id) => staffList.find((user) => user.userId === id) as IUser,
      ),
    };
    assignCustomer(assignData);
  };

  const columns = [
    {
      width: "40%",
      title: "Tên nhân viên",
      dataIndex: "",
      key: "name",
      render: (_: any, record: IUser) =>
        `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Chọn nhân viên",
      dataIndex: "checked",
      render: (_: any, record: IUser) => (
        <Checkbox
          checked={tempSelectedStaffIds.includes(record.userId)}
          onChange={(e) =>
            handleCheckboxChange(record.userId, e.target.checked)
          }
        />
      ),
      width: "30%",
    },
  ];

  return (
    <>
      <Tooltip title="Giao sản phẩm ký gửi cho nhân viên quản lý">
        <ProfileOutlined
          className="table-icon text-2xl"
          onClick={handleOpenModal}
        />
      </Tooltip>
      <Modal
        width="40%"
        title="Danh sách nhân viên"
        open={isOpenModal}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleConfirm}
            loading={isPending}
          >
            Giao khách hàng cho nhân viên
          </Button>,
        ]}
      >
        <Table
          rowKey="userId"
          columns={columns}
          dataSource={staffList}
          pagination={false}
          bordered={false}
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-gray"
          }
          rowHoverable={false}
          loading={{
            spinning: isLoading,
            tip: "Đang tải dữ liệu...",
          }}
          size="small"
        />
      </Modal>
    </>
  );
};

export default AssignCustomerForConsignment;
