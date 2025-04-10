import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { ICustomerPotential } from "../../interfaces";
import { APPOINTMENT_BUILDING_STATUS_TRANSLATION } from "../../interfaces/common/constants";
import { appointmentService } from "../../services/appointment/appointment-service";
import { buildingService } from "../../services/building/building-service";
import { customerService } from "../../services/customer/customer-service";

interface CreateAppointmentBuildingFormProps {
  onCancel: () => void;
}

const CreateAppointmentBuildingForm: React.FC<
  CreateAppointmentBuildingFormProps
> = ({ onCancel }) => {
  const [form] = Form.useForm<ICustomerPotential>();
  const queryClient = useQueryClient();

  // Fetch building options
  const { data: buildingsData } = useQuery({
    queryKey: ["buildings"],
    queryFn: buildingService.getAllBuildingOfCompany,
  });

  const buildingOption = buildingsData?.payload?.map((buildingType) => ({
    label: buildingType.buildingName,
    value: buildingType.buildingId,
  }));

  const { data: customersData, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getAllCustomers,
  });

  const customerOptions = customersData?.payload?.map((customer) => ({
    value: customer.email,
    label: customer.email,
  }));

  const { mutate: createAppointmentBuilding, isPending: isCreating } =
    useMutation({
      mutationFn: appointmentService.createAppointmentBuilding,
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("appointments");
          },
        });
      },
    });

  // Handle form submission
  const handleFinish = (values: ICustomerPotential) => {
    const formattedValues = {
      ...values,
      appointments: values.appointments?.map((appointment) => ({
        ...appointment,
        appointmentBuildings: appointment.appointmentBuildings?.map(
          (building) => ({
            ...building,
            buildingId: building.building.buildingId,
            building: building.building,
            visitTime: building.visitTime
              ? dayjs(building.visitTime).format("YYYY-MM-DDTHH:mm:ss")
              : "",
            area: building.area,
          }),
        ),
      })),
    };
    createAppointmentBuilding(formattedValues, {
      onSuccess: () => {
        toast.success("Thêm mới lịch hẹn thành công");
        form.resetFields();
        onCancel();
      },
      onError: () => {
        toast.error("Thêm mới lịch hẹn thất bại");
      },
    });
  };

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Khách hàng"
            name="email"
            rules={[{ required: true, message: "Chọn khách hàng" }]}
          >
            <Select
              placeholder="Chọn khách hàng"
              options={customerOptions}
              loading={isCustomersLoading}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Lịch hẹn">
        <Form.List name={["appointments"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.length === 0 && (
                <div className="mb-2 text-gray-500">
                  Chưa có lịch hẹn nào. Nhấn "Thêm lịch hẹn" để tạo mới.
                </div>
              )}
              {fields.map(({ key, name }) => (
                <div key={key} className="mb-4">
                  <Form.List name={[name, "appointmentBuildings"]}>
                    {(buildingFields, { remove: removeBuilding }) => (
                      <>
                        {buildingFields.map(
                          ({
                            key: buildingKey,
                            name: buildingName,
                            ...buildingRestField
                          }) => (
                            <div
                              key={buildingKey}
                              className="mb-2 flex items-center gap-4"
                            >
                              <Form.Item
                                {...buildingRestField}
                                label="Tòa nhà cần xem"
                                name={[buildingName, "building", "buildingId"]}
                                rules={[
                                  { required: true, message: "Chọn tòa nhà" },
                                ]}
                                className="flex-1"
                              >
                                <Select
                                  placeholder="Chọn tòa nhà"
                                  options={buildingOption}
                                  allowClear
                                />
                              </Form.Item>

                              <Form.Item
                                {...buildingRestField}
                                label="Thời gian hẹn"
                                name={[buildingName, "visitTime"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Chọn thời gian",
                                  },
                                ]}
                                className="flex-2"
                              >
                                <DatePicker
                                  showTime
                                  format="YYYY-MM-DD HH:mm:ss"
                                  placeholder="Chọn thời gian"
                                />
                              </Form.Item>

                              <Form.Item
                                {...buildingRestField}
                                label="Diện tích cần xem"
                                name={[buildingName, "area"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Nhập diện tích",
                                  },
                                ]}
                                className="flex-1"
                              >
                                <Input placeholder="Nhập diện tích (vd: 100m²)" />
                              </Form.Item>

                              <Form.Item
                                {...buildingRestField}
                                label="Trạng thái hiện tại"
                                name={[
                                  buildingName,
                                  "appointmentBuildingStatusHistories",
                                  0,
                                  "status",
                                ]}
                                className="flex-1"
                                initialValue="PENDING"
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
                                  disabled
                                />
                              </Form.Item>
                              <Button
                                type="link"
                                onClick={() => removeBuilding(buildingName)}
                                className="items-center text-red-500"
                                icon={
                                  <PlusOutlined rotate={45} className="mb-5" />
                                }
                              />
                            </div>
                          ),
                        )}
                      </>
                    )}
                  </Form.List>
                </div>
              ))}
              <Button
                type="primary"
                htmlType="button"
                className="w-full bg-[#3162ad] hover:bg-[#3162ad]"
                onClick={() =>
                  add({
                    appointmentBuildings: [
                      { buildingId: null, visitTime: null, area: null },
                    ],
                  })
                }
                block
              >
                + Thêm lịch hẹn
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            Thêm mới
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateAppointmentBuildingForm;
