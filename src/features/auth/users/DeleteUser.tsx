import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { userService } from "../../../services";

interface DeleteUserProps {
  userId: string;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ userId }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("users"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteUser(userId, {
      onSuccess: () => {
        toast.success("Xóa người dùng thành công");
      },
      onError: () => {
        toast.error("Xóa người dùng thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa user này?"
      description="Bạn có chắc muốn xóa user này không?"
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

export default DeleteUser;
