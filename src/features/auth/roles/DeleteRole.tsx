import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import { roleService } from "../../../services";
import toast from "react-hot-toast";

interface DeleteRoleProps {
  roleId: number;
}

const DeleteRole: React.FC<DeleteRoleProps> = ({ roleId }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: roleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("roles"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteUser(roleId, {
      onSuccess: () => {
        toast.success("Xóa vai trò thành công");
      },
      onError: () => {
        toast.error("Xóa vai trò thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa vai trò này?"
      description="Bạn có chắc muốn xóa role này không?"
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

export default DeleteRole;
