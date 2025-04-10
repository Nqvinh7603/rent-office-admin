import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ICustomer, ICustomerPotential } from "../../interfaces";
import {
  APPOINTMENT_BUILDING_STATUS_TRANSLATION,
  POTENTIAL_CUSTOMER_STATUS_TRANSLATION,
} from "../../interfaces/common/constants";
import { PotentialCustomerStatus } from "../../interfaces/common/enums";
import { buildingService } from "../../services/building/building-service";
import { customerService } from "../../services/customer/customer-service";
interface UpdatePotentialCustomerFormProps {
  potentialCustomerToUpdate?: ICustomerPotential;
  //onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdatePotentialCustomerArgs {
  potentialCustomerId: number;
  updatedPotentialCustomer: ICustomerPotential;
}

const UpdatePotentialCustomerForm: React.FC<
  UpdatePotentialCustomerFormProps
> = ({ potentialCustomerToUpdate, viewOnly = false }) => {
  const [form] = Form.useForm<ICustomer>();
  const queryClient = useQueryClient();

  const { data: buildingsData } = useQuery({
    queryKey: ["buildingss"],
    queryFn: buildingService.getAllBuildingOfCompany,
  });

  const buildingOption = buildingsData?.payload?.map((buildingType) => ({
    label: buildingType.buildingName,
    value: buildingType.buildingId,
  }));

  const { mutate: updatePotentialCustomer, isPending: isUpdating } =
    useMutation({
      mutationFn: ({
        potentialCustomerId,
        updatedPotentialCustomer,
      }: UpdatePotentialCustomerArgs) =>
        customerService.updatePotentialCustomer(
          potentialCustomerId,
          updatedPotentialCustomer,
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes("customers");
          },
        });
      },
    });

  useEffect(() => {
    if (potentialCustomerToUpdate) {
      const updatedFields = {
        ...potentialCustomerToUpdate,
        appointments: potentialCustomerToUpdate.appointments?.map(
          (appointment) => ({
            ...appointment,
            appointmentBuildings: appointment.appointmentBuildings?.map(
              (building) => ({
                ...building,
                building: building.building,
                visitTime: building.visitTime
                  ? dayjs(building.visitTime)
                  : null,
                area: building.area,
              }),
            ),
          }),
        ),
      };
      form.setFieldsValue(updatedFields);
    }
  }, [potentialCustomerToUpdate, form]);

  function handleFinish() {
    if (potentialCustomerToUpdate) {
      const formValues = form.getFieldsValue(true);

      const updatedAppointments = formValues.appointments?.map(
        (appointment: any) => ({
          ...appointment,
          appointmentBuildings: appointment.appointmentBuildings?.map(
            (building: any) => ({
              ...building,
              visitTime: building.visitTime
                ? dayjs(building.visitTime).format("YYYY-MM-DDTHH:mm:ss")
                : null,
            }),
          ),
        }),
      );

      // Cập nhật lại dữ liệu của khách hàng
      const updatedPotentialCustomer = {
        ...potentialCustomerToUpdate,
        ...formValues,
        appointments: updatedAppointments,
      };

      // Gửi yêu cầu cập nhật
      updatePotentialCustomer(
        {
          potentialCustomerId: potentialCustomerToUpdate.customerId,
          updatedPotentialCustomer,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật trạng thái thất bại");
          },
        },
      );
    }
  }

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Tên khách hàng" name="customerName">
            <Input readOnly={true} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Email" name="email">
            <Input
              readOnly={true}
              onClick={() => {
                const email = form.getFieldValue("email");
                if (
                  window.confirm(
                    "Bạn có chắc chắn muốn chuyển sang Gmail không?",
                  )
                ) {
                  window.open(
                    `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
                    "_blank",
                  );
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input
              readOnly={true}
              onClick={() => {
                const phoneNumber = form.getFieldValue("phoneNumber");
                if (
                  window.confirm(
                    "Bạn có chắc chắn muốn chuyển sang Zalo không?",
                  )
                ) {
                  window.open(`https://zalo.me/${phoneNumber}`, "_blank");
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label="Yêu cầu" name="note">
            <Input.TextArea readOnly={true} rows={2} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label="Trạng thái" name="status">
            <Select disabled={viewOnly}>
              {Object.keys(POTENTIAL_CUSTOMER_STATUS_TRANSLATION).map((key) => (
                <Select.Option key={key} value={key}>
                  {
                    POTENTIAL_CUSTOMER_STATUS_TRANSLATION[
                      key as PotentialCustomerStatus
                    ]
                  }
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Lịch hẹn">
        <div className="rounded-md border p-4">
          <Form.List name={["appointments"]}>
            {(fields, { add, remove }) => (
              <div>
                {fields.length === 0 && (
                  <div className="mb-2 text-gray-500">
                    Chưa có lịch hẹn nào. Nhấn "Thêm lịch hẹn" để tạo mới.
                  </div>
                )}
                {fields.map(({ key, name }) => (
                  <div key={key} className="mb-4">
                    <Form.List name={[name, "appointmentBuildings"]}>
                      {(buildingFields, { remove: removeBuilding }) => (
                        <div>
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
                                  name={[
                                    buildingName,
                                    "building",
                                    "buildingId",
                                  ]}
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
                                    <PlusOutlined
                                      rotate={45}
                                      className="mb-5"
                                    />
                                  }
                                />
                              </div>
                            ),
                          )}
                        </div>
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
                        { building: null, visitTime: null, area: null },
                      ],
                    })
                  }
                  block
                >
                  + Thêm lịch hẹn
                </Button>
                {fields.length > 0 && (
                  <Button
                    type="link"
                    htmlType="button"
                    className="mt-2 w-full"
                    onClick={() => {
                      const email = form.getFieldValue("email");
                      if (email) {
                        window.open(`/appointments?email=${email}`, "_blank");
                      } else {
                        toast.error("Không tìm thấy email để điều hướng.");
                      }
                    }}
                    block
                  >
                    Điều hướng đến trang lịch hẹn
                  </Button>
                )}
              </div>
            )}
          </Form.List>
        </div>
      </Form.Item>

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {potentialCustomerToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdatePotentialCustomerForm;
