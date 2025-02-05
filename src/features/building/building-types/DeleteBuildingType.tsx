import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { buildingTypeService } from "../../../services";

interface DeleteBuildingTypeProps {
  buildingTypeId: number;
}

const DeleteBuildingType: React.FC<DeleteBuildingTypeProps> = ({
  buildingTypeId,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteBuildingType, isPending: isDeleting } = useMutation({
    mutationFn: buildingTypeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("building-types"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteBuildingType(buildingTypeId, {
      onSuccess: () => {
        toast.success("Xóa loại tòa nhà thành công");
      },
      onError: () => {
        toast.error("Xóa loại tòa nhà thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa loại tòa nhà này?"
      description="Bạn có chắc muốn xóa loại tòa nhà này không?"
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

export default DeleteBuildingType;
