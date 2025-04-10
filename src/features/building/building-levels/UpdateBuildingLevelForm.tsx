import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IBuildingLevel } from "../../../interfaces";
import { buildingLevelService } from "../../../services";

interface UpdateBuildingLevelFormProps {
  buildingLevelToUpdate?: IBuildingLevel;
  onCancel: () => void;
  viewOnly?: boolean;
}

interface UpdateBuildingLevelArgs {
  buildingLevelId: number;
  updatedBuildingLevel: IBuildingLevel;
}

const UpdateBuildingLevelForm: React.FC<UpdateBuildingLevelFormProps> = ({
  buildingLevelToUpdate,
  onCancel,
  viewOnly = false,
}) => {
  const [form] = Form.useForm<IBuildingLevel>();
  const queryClient = useQueryClient();

  const { mutate: createBuildingLevel, isPending: isCreating } = useMutation({
    mutationFn: buildingLevelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("building-levels");
        },
      });
    },
  });

  const { mutate: updateBuildingLevel, isPending: isUpdating } = useMutation({
    mutationFn: ({
      buildingLevelId,
      updatedBuildingLevel,
    }: UpdateBuildingLevelArgs) =>
      buildingLevelService.update(buildingLevelId, updatedBuildingLevel),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("building-Levels");
        },
      });
    },
  });

  useEffect(() => {
    if (buildingLevelToUpdate) {
      form.setFieldsValue({
        ...buildingLevelToUpdate,
      });
    }
  }, [buildingLevelToUpdate, form]);

  function handleFinish(values: IBuildingLevel) {
    if (buildingLevelToUpdate) {
      const updatedBuildingLevel = {
        ...buildingLevelToUpdate,
        ...form.getFieldsValue(true),
      };
      updateBuildingLevel(
        {
          buildingLevelId: buildingLevelToUpdate.buildingLevelId,
          updatedBuildingLevel,
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật hạng toà nhà thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật hạng toà nhà thất bại");
          },
        },
      );
    } else {
      createBuildingLevel(values, {
        onSuccess: () => {
          toast.success("Thêm mới hạng toà nhà thành công");
          onCancel();
          form.resetFields();
        },
        onError: () => {
          toast.error("Thêm mới hạng toà nhà thất bại");
        },
      });
    }
  }

  return (
    <Form onFinish={handleFinish} form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={18}>
          <Form.Item
            label="Tên hạng"
            name="buildingLevelName"
            rules={[
              { required: true, message: "Vui lòng nhập tên hạng toà nhà" },
            ]}
          >
            <Input readOnly={viewOnly} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Mã hạng"
            name="buildingLevelCode"
            rules={[
              { required: true, message: "Vui lòng nhập mã hạng toà nhà" },
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
              {buildingLevelToUpdate ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default UpdateBuildingLevelForm;
