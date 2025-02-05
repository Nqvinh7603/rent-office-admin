import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { buildingLevelService } from "../../../services";

interface DeleteBuildingLevelProps {
  buildingLevelId: number;
}

const DeleteBuildingLevel: React.FC<DeleteBuildingLevelProps> = ({
  buildingLevelId,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteBuildingLevel, isPending: isDeleting } = useMutation({
    mutationFn: buildingLevelService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("building-levels"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteBuildingLevel(buildingLevelId, {
      onSuccess: () => {
        toast.success("Xóa hạng tòa nhà thành công");
      },
      onError: () => {
        toast.error("Xóa hạng tòa nhà thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa hạng tòa nhà này?"
      description="Bạn có chắc muốn xóa hạng tòa nhà này không?"
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

export default DeleteBuildingLevel;
