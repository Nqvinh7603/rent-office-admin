import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Popconfirm, Tooltip } from "antd";
import toast from "react-hot-toast";
import { appointmentService } from "../../services/appointment/appointment-service";

interface DeleteAppointmentProps {
  appointmentBuildingId: number;
}

const DeleteAppointments: React.FC<DeleteAppointmentProps> = ({
  appointmentBuildingId,
}) => {
  const queryClient = useQueryClient();
  const { mutate: deleteAppointment, isPending: isDeleting } = useMutation({
    mutationFn: appointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("appointments"),
      });
    },
  });

  function handleConfirmDelete(): void {
    deleteAppointment(appointmentBuildingId, {
      onSuccess: () => {
        toast.success("Xóa cuộc hẹn thành công thành công");
      },
      onError: () => {
        toast.error("Xóa cuộc hẹn thất bại");
      },
    });
  }

  return (
    <Popconfirm
      title="Xóa cuộc hẹn  này?"
      description="Bạn có chắc muốn xóa cuộc hẹn snày không?"
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

export default DeleteAppointments;
