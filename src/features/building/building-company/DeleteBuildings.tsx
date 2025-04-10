import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { buildingService } from "../../../services/building/building-service";

interface DeleteBuildingProps {
  buildingId: number;
}

const DeleteBuildings: React.FC<DeleteBuildingProps> = ({ buildingId }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteConsignment, isPending: isDeleting } = useMutation({
    mutationFn: buildingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("buildings"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteConsignment(buildingId.toString(), {
      onSuccess: () => {
        toast.success("Xóa tài sản thành công");
      },
      onError: () => {
        toast.error("Xóa tài sản thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa hạng tài sản  này?"
      description="Bạn có chắc muốn xóa tài sản snày không?"
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

export default DeleteBuildings;
