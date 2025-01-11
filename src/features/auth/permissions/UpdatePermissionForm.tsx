import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IPermission } from "../../../interfaces";
import { Method, Module } from "../../../interfaces/common/enums";
import { permissionService } from "../../../services";

interface UpdatePermissionFormProps {
  permissionToUpdate?: IPermission;
  onCancel: () => void;
}

const methodOptions = Object.values(Method).map((method: string) => ({
  value: method,
  label: method,
}));

const moduleOptions = Object.values(Module).map((module: string) => ({
  value: module,
  label: module,
}));

const UpdatePermissionForm: React.FC<UpdatePermissionFormProps> = ({
  permissionToUpdate,
  onCancel,
}) => {
  const [form] = Form.useForm<IPermission>();
  const queryClient = useQueryClient();

  const { mutate: createPermission, isPending: isCreating } = useMutation({
    mutationFn: permissionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("permissions");
        },
      });
    },
  });

  const { mutate: updatePermission, isPending: isUpdating } = useMutation({
    mutationFn: permissionService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey[0] === "permissions";
        },
      });
    },
  });

  function handleFinish(values: IPermission) {
    if (permissionToUpdate) {
      updatePermission(
        { ...permissionToUpdate, ...values },
        {
          onSuccess: () => {
            toast.success("Cập nhật quyền hạn thành công");
            onCancel();
            form.resetFields();
          },
          onError: () => {
            toast.error("Cập nhật quyền hạn thất bại");
          },
        },
      );
    } else {
      createPermission(values, {
        onSuccess: () => {
          toast.success("Thêm quyền hạn thành công");
          onCancel();
          form.resetFields();
        },
        onError: () => {
          toast.error("Thêm quyền hạn thất bại");
        },
      });
    }
  }

  useEffect(() => {
    if (permissionToUpdate) {
      form.setFieldsValue(permissionToUpdate);
    }
  }, [form, permissionToUpdate]);

  return (
    <Form onFinish={handleFinish} layout="vertical" form={form}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="Tên quyền hạn"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên quyền hạn không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Đường dẫn API"
            name="apiPath"
            rules={[
              {
                required: true,
                message: "Đường dẫn API không được để trống",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phương thức"
            name="method"
            rules={[
              { required: true, message: "Phương thức không được để trống" },
            ]}
          >
            <Select allowClear options={methodOptions} />
          </Form.Item>
          <Form.Item
            label="Module"
            name="module"
            rules={[{ required: true, message: "Module không được để trống" }]}
          >
            <Select allowClear options={moduleOptions} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
        <Space>
          <Button onClick={onCancel} loading={isCreating || isUpdating}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {permissionToUpdate ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UpdatePermissionForm;
