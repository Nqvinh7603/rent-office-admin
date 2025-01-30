import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import React, { useCallback } from "react";
import toast from "react-hot-toast";
import { authService } from "../../services";

const ForgotPasswordForm: React.FC = () => {
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu.");
      form.resetFields();
    },
    onError: () => {
      toast.error("Không thể gửi yêu cầu đặt lại mật khẩu.");
    },
  });

  const handleFinish = useCallback(
    (values: { email: string }) => {
      mutation.mutate({ email: values.email, siteUrl: window.location.origin });
    },
    [mutation],
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Đặt lại mật khẩu của bạn</h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            //label={<span className="font-semibold">E-mail</span>}
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input
              placeholder="E-mail"
              className="h-10 rounded-md border-gray-300 text-base focus:border-[#3162ad] focus:ring-[#3162ad]"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.status === "pending"}
              className="h-10 w-full rounded-md text-white"
            >
              Gửi email đặt lại
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="mt-2 block font-semibold hover:underline">
            Quay lại mẫu đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
