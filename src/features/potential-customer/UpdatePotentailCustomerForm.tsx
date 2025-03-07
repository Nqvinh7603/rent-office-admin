import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ICustomer } from "../../interfaces";
import { POTENTIAL_CUSTOMER_STATUS_TRANSLATION } from "../../interfaces/common/constants";
import { PotentialCustomerStatus } from "../../interfaces/common/enums";
import { customerService } from "../../services/customer/customer-service";

interface UpdatePotentialCustomerFormProps {
  potentialCustomerToUpdate?: ICustomer;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdatePotentialCustomerArgs {
  potentialCustomerId: number;
  updatedPotentialCustomer: ICustomer;
}

const UpdatePotentialCustomerForm: React.FC<
  UpdatePotentialCustomerFormProps
> = ({ potentialCustomerToUpdate, onCancel, viewOnly = false }) => {
  const [form] = Form.useForm<ICustomer>();
  const queryClient = useQueryClient();

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
      form.setFieldsValue({
        ...potentialCustomerToUpdate,
      });
    }
  }, [potentialCustomerToUpdate, form]);

  function handleFinish(values: ICustomer) {
    if (potentialCustomerToUpdate) {
      const updatedPotentialCustomer = {
        ...potentialCustomerToUpdate,
        ...form.getFieldsValue(true),
      };
      updatePotentialCustomer(
        {
          potentialCustomerId: potentialCustomerToUpdate.customerId,
          updatedPotentialCustomer,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật trạng thái thành công");
            onCancel();
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

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
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
