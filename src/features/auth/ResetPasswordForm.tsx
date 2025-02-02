import { LockOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../common/components/Loading";
import { IResetPasswordRequest } from "../../interfaces/auth";
import { authService } from "../../services";

const ResetPasswordForm: React.FC = () => {
  const [resetPasswordForm] = Form.useForm<IResetPasswordRequest>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { isLoading: isVerifyingToken, isError: isTokenInvalid } = useQuery({
    queryKey: ["verifyResetToken", token],
    queryFn: async () => {
      if (!token) throw new Error("Token không hợp lệ");
      return authService.verifyResetToken(token);
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (isTokenInvalid) {
      toast.error("Token không hợp lệ");
      navigate("/login");
    }
  }, [isTokenInvalid, navigate]);

  const { mutate: resetPassword, status: isResettingPassword } = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Đặt lại mật khẩu thành công");
      navigate("/");
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Đặt lại mật khẩu thất bại");
      }
    },
  });

  const onFinish = (values: IResetPasswordRequest) => {
    if (token) {
      resetPassword({ ...values, token });
    } else {
      toast.error("Token không hợp lệ");
      navigate("/login");
    }
  };
  if (isVerifyingToken) {
    return <Loading />;
  }

  if (isTokenInvalid) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Đặt mật khẩu mới</h1>
        </div>
        <Form
          form={resetPasswordForm}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới",
              },
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isResettingPassword === "pending"}
              className="w-full"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
