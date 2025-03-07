import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { consignmentService } from "../../services";

interface DeleteConsignmentProps {
  consignmentId: number;
}

const DeleteConsignment: React.FC<DeleteConsignmentProps> = ({
  consignmentId,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteConsignment, isPending: isDeleting } = useMutation({
    mutationFn: consignmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("consignments"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteConsignment(consignmentId.toString(), {
      onSuccess: () => {
        toast.success("Xóa tài sản ký gửi thành công");
      },
      onError: () => {
        toast.error("Xóa tài sản ký gửi thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa hạng tài sản ký gửi này?"
      description="Bạn có chắc muốn xóa tài sản ký gửi này không?"
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

export default DeleteConsignment;
