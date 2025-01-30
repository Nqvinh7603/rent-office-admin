import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Space } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaRegSave } from "react-icons/fa";
import { IChangePasswordRequest } from "../../interfaces";
import { userService } from "../../services";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";

const ChangePassword: React.FC = () => {
  const { user: currentUser } = useLoggedInUser();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<IChangePasswordRequest>();

  useEffect(() => {
    if (currentUser) {
      form.resetFields();
    }
  }, [currentUser, form]);

  const { mutate: updatePassword, isPending: isUpdating } = useMutation({
    mutationFn: (changePassword: IChangePasswordRequest) => {
      return userService.changePassword(changePassword);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("loggedInUser"),
      });
      toast.success("Đổi mật khẩu thành công");
      form.resetFields();
    },
    onError: () => {
      toast.error("Đổi mật khẩu thất bại");
    },
  });

  const handleFinish = (values: IChangePasswordRequest) => {
    updatePassword(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ email: currentUser?.email }}
    >
      <Form.Item
        label="Mật khẩu hiện tại"
        name="currentPassword"
        rules={[{ required: true, message: "Nhập mật khẩu hiện tại của bạn" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Nhập mật khẩu mới" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Xác nhận mật khẩu mới"
        name="confirmPassword"
        rules={[
          { required: true, message: "Nhập lại mật khẩu mới" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            icon={<FaRegSave />}
          >
            Đổi mật khẩu
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
