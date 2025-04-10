import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { feeTypeService } from "../../../services/building/fee-type-service";

interface DeleteFeeTypeProps {
  feeTypeId: number;
}

const DeleteFeeType: React.FC<DeleteFeeTypeProps> = ({ feeTypeId }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteFeeType, isPending: isDeleting } = useMutation({
    mutationFn: feeTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("fee-types"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteFeeType(feeTypeId, {
      onSuccess: () => {
        toast.success("Xóa loại phí thành công");
      },
      onError: () => {
        toast.error("Xóa loại phí thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa loại phí này?"
      description="Bạn có chắc muốn xóa loại phí này không?"
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

export default DeleteFeeType;
