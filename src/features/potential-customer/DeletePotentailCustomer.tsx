import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { customerService } from "../../services/customer/customer-service";

interface DeletePotentialProps {
  potentialCustomerId: number;
}

const DeletePotentialCustomer: React.FC<DeletePotentialProps> = ({
  potentialCustomerId,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deletePotentialCustomer, isPending: isDeleting } =
    useMutation({
      mutationFn: customerService.deletePotentialCustomer,
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey.includes("customers"),
        });
      },
    });

  function handleConfirmDelete(): void {
    deletePotentialCustomer(potentialCustomerId, {
      onSuccess: () => {
        toast.success("Xóa khách hàng tiềm năng thành công");
      },
      onError: () => {
        toast.error("Xóa khách hàng tiềm năng thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa khách hàng tiềm năng này?"
      description="Bạn có chắc muốn xóa khách hàng tiềm năng này không?"
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading: isDeleting }}
      onConfirm={handleConfirmDelete}
    >
      <Tooltip title="Xóa">
        <DeleteOutlined className="text-xl text-[#ff4d4f]" />
      </Tooltip>
    </Popconfirm>
  );
};

export default DeletePotentialCustomer;
