import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IBuildingType } from "../../../interfaces";
import { buildingTypeService } from "../../../services";

interface UpdateBuildingTypeFormProps {
  buildingTypeToUpdate?: IBuildingType;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateBuildingTypeArgs {
  buildingTypeId: number;
  updatedBuildingType: IBuildingType;
}

const UpdateBuildingTypeForm: React.FC<UpdateBuildingTypeFormProps> = ({
  buildingTypeToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IBuildingType>();
  const queryClient = useQueryClient();

  const { mutate: createBuildingType, isPending: isCreating } = useMutation({
    mutationFn: buildingTypeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("building-types");
        },
      });
    },
  });

  const { mutate: updateBuildingType, isPending: isUpdating } = useMutation({
    mutationFn: ({
      buildingTypeId,
      updatedBuildingType,
    }: UpdateBuildingTypeArgs) =>
      buildingTypeService.update(buildingTypeId, updatedBuildingType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("building-types");
        },
      });
    },
  });

  useEffect(() => {
    if (buildingTypeToUpdate) {
      form.setFieldsValue({
        ...buildingTypeToUpdate,
      });
    }
  }, [buildingTypeToUpdate, form]);

  function handleFinish(values: IBuildingType) {
    if (buildingTypeToUpdate) {
      const updatedBuildingType = {
        ...buildingTypeToUpdate,
        ...form.getFieldsValue(true),
      };
      updateBuildingType(
        {
          buildingTypeId: buildingTypeToUpdate.buildingTypeId,
          updatedBuildingType,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật loại toà nhà thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật loại toà nhà thất bại");
          },
        },
      );
    } else {
      createBuildingType(values, {
        onSuccess: () => {
          toast.success("Thêm mới loại toà nhà thành công");
          onCancel();
          form.resetFields();
        },
        onError: () => {
          toast.error("Thêm mới loại toà nhà thất bại");
        },
      });
    }
  }

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={18}>
          <Form.Item
            label="Tên loại toà nhà"
            name="buildingTypeName"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại toà nhà" },
            ]}
          >
            <Input readOnly={viewOnly} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Mã loại"
            name="buildingTypeCode"
            rules={[
              { required: true, message: "Vui lòng nhập mã loại toà nhà" },
            ]}
          >
            <Input readOnly={viewOnly} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea readOnly={viewOnly} rows={2} />
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
              {buildingTypeToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateBuildingTypeForm;
