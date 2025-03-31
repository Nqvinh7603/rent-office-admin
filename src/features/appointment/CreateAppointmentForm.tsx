import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { IAppointmentBuilding } from "../../interfaces/appointment";
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
  const [form] = Form.useForm<IAppointmentBuilding>();
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

  // Fetch customer options
  const { data: customersData, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getAllCustomers,
  });

  const customerOptions = customersData?.payload?.map((customer) => ({
    value: customer.email,
    label: customer.email,
  }));

  // Mutation to create a new appointment building
  const { mutate: createAppointmentBuilding, isLoading: isCreating } =
    useMutation({
      mutationFn: (newAppointmentBuilding: IAppointmentBuilding) =>
        appointmentService.createAppointmentBuilding(newAppointmentBuilding),
      onSuccess: () => {
        toast.success("Thêm mới lịch hẹn thành công");
        queryClient.invalidateQueries(["appointments"]);
        form.resetFields();
        onCancel();
      },
      onError: () => {
        toast.error("Thêm mới lịch hẹn thất bại");
      },
    });

  // Handle form submission
  const handleFinish = (values: IAppointmentBuilding) => {
    const formattedValues = {
      ...values,
      visitTime: values.visitTime
        ? dayjs(values.visitTime).format("YYYY-MM-DDTHH:mm:ss")
        : null,
    };
    createAppointmentBuilding(formattedValues);
  };

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Khách hàng"
            name="customerEmail"
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

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Tòa nhà cần xem"
            name="buildingId"
            rules={[{ required: true, message: "Chọn tòa nhà" }]}
          >
            <Select
              placeholder="Chọn tòa nhà"
              options={buildingOption}
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Thời gian hẹn"
            name="visitTime"
            rules={[{ required: true, message: "Chọn thời gian" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Chọn thời gian"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Diện tích cần xem"
            name="area"
            rules={[{ required: true, message: "Nhập diện tích" }]}
          >
            <Input placeholder="Nhập diện tích (vd: 100m²)" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Trạng thái hiện tại"
            name="status"
            initialValue="PENDING"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
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
        </Col>
      </Row>

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
