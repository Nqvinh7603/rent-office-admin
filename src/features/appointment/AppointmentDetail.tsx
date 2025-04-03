import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Input,
  Menu,
  Select,
  Timeline,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useParams } from "react-router";
import Loading from "../../common/components/Loading";
import { IAppointmentBuilding } from "../../interfaces/appointment";
import { APPOINTMENT_BUILDING_STATUS_TRANSLATION } from "../../interfaces/common/constants";
import { AppointmentBuildingStatus } from "../../interfaces/common/enums";
import { appointmentService } from "../../services/appointment/appointment-service";
import { formatTimestamp } from "../../utils";
import AppointmentBreadcrumb from "./Breadcrumb/AppointmentBreadcrumb";

interface AppointmentBuildingAgrs {
  appointmentBuildingId?: string;
  updateAppointmentBuilding: IAppointmentBuilding;
}

const AppointmentDetail: React.FC = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form] = Form.useForm<IAppointmentBuilding>();
  const [currentTab, setCurrentTab] = useState<string>("detail");
  const { data, isLoading } = useQuery({
    queryFn: () => appointmentService.getAppointmentsCalendarById(Number(id)),
    queryKey: ["appointments", id],
  });

  // if (isLoading) {
  //   return <Loading />;
  // }

  const appointmentBuilding = data?.payload;

  useEffect(() => {
    if (appointmentBuilding) {
      form.setFieldsValue({
        ...appointmentBuilding,
        visitTime: appointmentBuilding.visitTime,
      });
    }
  }, [appointmentBuilding, form]);

  const { mutate: updateAppointmentBuilding, isPending: isUpdating } =
    useMutation({
      mutationFn: ({
        appointmentBuildingId,
        updateAppointmentBuilding,
      }: AppointmentBuildingAgrs) =>
        appointmentService.updateAppointmentBuilding(
          Number(appointmentBuildingId),
          updateAppointmentBuilding,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("appointments");
          },
        });
      },
    });

  function handleFinish(values: IAppointmentBuilding) {
    if (appointmentBuilding) {
      const updatedValues = {
        ...appointmentBuilding,
        ...values,
      };

      updateAppointmentBuilding(
        {
          appointmentBuildingId: id,
          updateAppointmentBuilding: updatedValues,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật cuộc hẹn thành công");
          },
          onError: () => {
            toast.error("Cập nhật vai trò thất bại");
          },
        },
      );
    }
  }
  if (isLoading || !appointmentBuilding) {
    return <Loading />;
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center">
        <Tooltip title="Quay lại">
          <Button icon={<GoArrowLeft />} onClick={() => navigate(-1)} />
        </Tooltip>
        <div className="ml-2">
          <AppointmentBreadcrumb appointmentBuildingId={id} />
        </div>
      </div>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["detail"]}
        onClick={({ key }) => setCurrentTab(key)}
        className="mb-1"
        style={{ borderRadius: "8px" }}
      >
        <Menu.Item key="detail">Chi tiết cuộc hẹn</Menu.Item>
        <Menu.Item key="process">Chăm sóc khách hàng</Menu.Item>
      </Menu>
      <div className="card pb-1">
        {currentTab === "detail" && (
          <Form
            layout="vertical"
            initialValues={{ active: true }}
            form={form}
            onFinish={handleFinish}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Thông tin khách hàng</h2>
            </div>
            <Descriptions column={3}>
              <Descriptions.Item label="Email">
                <Tooltip title="Gửi email">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${form.getFieldValue(["appointment", "customer", "email"])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {appointmentBuilding?.appointment?.customer?.email ||
                      "Không xác định"}
                  </a>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Tên khách hàng">
                {appointmentBuilding?.appointment?.customer?.customerName ||
                  "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Tooltip title="Liên hệ qua Zalo hoặc gọi điện">
                  <a
                    href={`https://zalo.me/${form.getFieldValue([
                      "appointment",
                      "customer",
                      "phoneNumber",
                    ])}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {appointmentBuilding?.appointment?.customer?.phoneNumber ||
                      "Không xác định"}
                  </a>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {appointmentBuilding?.appointment?.customer?.address ||
                  "Không xác định"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {appointmentBuilding?.appointment?.customer?.note ||
                  "Không xác định"}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Thông tin chi tiết cuộc hẹn
              </h2>
            </div>

            <Descriptions layout="horizontal" className="mb-4">
              <Descriptions.Item label="Tên tòa nhà">
                {appointmentBuilding?.building?.buildingName ||
                  "Không xác định"}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions layout="horizontal" className="mb-4">
              <Descriptions.Item label="Địa chỉ cuộc hẹn">
                {`${appointmentBuilding?.building?.buildingNumber || ""} ${
                  appointmentBuilding?.building?.street || ""
                }, ${appointmentBuilding?.building?.ward || ""}, ${
                  appointmentBuilding?.building?.district || ""
                }, ${appointmentBuilding?.building?.city || ""}`}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions layout="horizontal" className="mb-4">
              <Descriptions.Item label="Diện tích cần xem">
                {appointmentBuilding?.area || "Không xác định"} m²
              </Descriptions.Item>
            </Descriptions>
            <Descriptions layout="horizontal" className="mb-4">
              <Descriptions.Item label="Thời gian hẹn">
                {appointmentBuilding?.visitTime
                  ? formatTimestamp(appointmentBuilding.visitTime)
                  : "Không xác định"}
              </Descriptions.Item>
            </Descriptions>
            <Form.Item
              name={[
                "appointmentBuildingStatusHistories",
                appointmentBuilding?.appointmentBuildingStatusHistories?.length
                  ? appointmentBuilding.appointmentBuildingStatusHistories
                      .length - 1
                  : 0,
                "status",
              ]}
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Chọn trạng thái đơn vị!",
                },
              ]}
              className="flex-1"
            >
              <Select
                placeholder="Chọn trạng thái"
                options={Object.entries(
                  APPOINTMENT_BUILDING_STATUS_TRANSLATION,
                ).map(([value, label]) => ({
                  label,
                  value,
                }))}
                allowClear
              />
            </Form.Item>
            <Form.Item
              name={[
                "appointmentBuildingStatusHistories",
                appointmentBuilding?.appointmentBuildingStatusHistories?.length
                  ? appointmentBuilding.appointmentBuildingStatusHistories
                      .length - 1
                  : 0,
                "note",
              ]}
              label="Ghi chú trạng thái"
              rules={[
                {
                  required: false,
                  message: "Nhập ghi chú trạng thái!",
                },
              ]}
              className="flex-1"
            >
              <Input.TextArea
                placeholder="Nhập ghi chú trạng thái"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-[#3162ad] hover:bg-[#3162ad]"
                loading={isUpdating}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        )}
        {currentTab === "process" && (
          <div>
            <h2 className="mb-8 text-xl font-semibold">
              Quá trình chăm sóc khách hàng
            </h2>
            <div className="flex gap-8">
              <Timeline mode="left" style={{ paddingLeft: "20px" }}>
                {Array.isArray(
                  appointmentBuilding?.appointmentBuildingStatusHistories,
                ) &&
                  appointmentBuilding.appointmentBuildingStatusHistories.map(
                    (history, index) => {
                      const label =
                        APPOINTMENT_BUILDING_STATUS_TRANSLATION[
                          history.status as AppointmentBuildingStatus
                        ];
                      const color =
                        history.status === AppointmentBuildingStatus.CANCELLED
                          ? "red"
                          : history.status === AppointmentBuildingStatus.PENDING
                            ? "orange"
                            : history.status ===
                                AppointmentBuildingStatus.CONFIRMED
                              ? "green"
                              : history.status ===
                                  AppointmentBuildingStatus.VIEWED
                                ? "purple"
                                : history.status ===
                                    AppointmentBuildingStatus.UNSUCCESSFUL
                                  ? "purple"
                                  : history.status ===
                                      AppointmentBuildingStatus.SUCCESSFUL
                                    ? "purple"
                                    : "blue";

                      return (
                        <Timeline.Item
                          key={index}
                          color={color}
                          position={
                            index ===
                            appointmentBuilding
                              .appointmentBuildingStatusHistories.length -
                              1
                              ? "right"
                              : "left"
                          }
                        >
                          <div>
                            <span>
                              <strong>
                                <Tooltip>
                                  <em>
                                    {index ===
                                    appointmentBuilding
                                      .appointmentBuildingStatusHistories
                                      .length -
                                      1
                                      ? `${label} `
                                      : label}
                                  </em>
                                </Tooltip>
                              </strong>
                            </span>
                            <br />
                            <span>
                              {dayjs(history.createdAt).format(
                                "DD/MM/YYYY HH:mm",
                              )}
                            </span>
                            <br />
                            <span>
                              Người thực hiện:{" "}
                              {history.createdBy === "anonymousUser"
                                ? "Khách hàng"
                                : history.createdBy || "Khách hàng"}
                            </span>
                            <br />
                            <span>
                              Ghi chú: {history.note || "Không có ghi chú"}
                            </span>
                          </div>
                        </Timeline.Item>
                      );
                    },
                  )}
              </Timeline>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
