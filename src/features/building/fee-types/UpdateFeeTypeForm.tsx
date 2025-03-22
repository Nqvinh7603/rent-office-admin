import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IFeeType } from "../../../interfaces";
import { feeTypeService } from "../../../services/building/fee-type-service";

interface UpdateFeeTypeFormProps {
  feeTypeToUpdate?: IFeeType;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateFeeTypeArgs {
  feeTypeId: number;
  updatedFeeType: IFeeType;
}

const UpdateFeeTypeForm: React.FC<UpdateFeeTypeFormProps> = ({
  feeTypeToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IFeeType>();
  const queryClient = useQueryClient();

  const { mutate: createFeeType, isPending: isCreating } = useMutation({
    mutationFn: feeTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("fee-types");
        },
      });
    },
  });

  const { mutate: updateFeeType, isPending: isUpdating } = useMutation({
    mutationFn: ({ feeTypeId, updatedFeeType }: UpdateFeeTypeArgs) =>
      feeTypeService.update(feeTypeId, updatedFeeType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("fee-types");
        },
      });
    },
  });

  useEffect(() => {
    if (feeTypeToUpdate) {
      form.setFieldsValue({
        ...feeTypeToUpdate,
      });
    }
  }, [feeTypeToUpdate, form]);

  function handleFinish(values: IFeeType) {
    if (feeTypeToUpdate) {
      const updatedFeeType = {
        ...feeTypeToUpdate,
        ...form.getFieldsValue(true),
      };
      updateFeeType(
        {
          feeTypeId: feeTypeToUpdate.feeTypeId,
          updatedFeeType,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật loại phí thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật loại phí thất bại");
          },
        },
      );
    } else {
      createFeeType(values, {
        onSuccess: () => {
          toast.success("Thêm mới loại phí thành công");
          onCancel();
          form.resetFields();
        },
        onError: () => {
          toast.error("Thêm mới loại phí thất bại");
        },
      });
    }
  }

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row>
        <Col span={23}>
          <Form.Item
            label="Tên loại phí"
            name="feeTypeName"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại phí toà nhà" },
            ]}
          >
            <Input readOnly={viewOnly} />
          </Form.Item>
        </Col>
      </Row>

      {!viewOnly && (
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {feeTypeToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateFeeTypeForm;
