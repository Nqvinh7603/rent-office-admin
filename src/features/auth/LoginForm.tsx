import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { IAuthRequest, IAuthResponse } from "../../interfaces/auth";
import { ApiResponse } from "../../interfaces/common";
import { authService } from "../../services";

const LoginForm: React.FC = () => {
  const [loginForm] = Form.useForm<IAuthRequest>();
  const navigate = useNavigate();
  const accessToken =
    window.localStorage.getItem("access_token") ||
    window.sessionStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const { mutate: login } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: ApiResponse<IAuthResponse>) => {
      const { accessToken } = data.payload || {};
      if (accessToken) {
        const storage = loginForm.getFieldValue("rememberMe")
          ? window.localStorage
          : window.sessionStorage;
        storage.setItem("access_token", accessToken);
        toast.success("Đăng nhập thành công");
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Đăng nhập thất bại");
    },
  });

  function onFinish(data: IAuthRequest): void {
    login(data);
  }

  return (
    <>
      <Form
        className="flex flex-col"
        onFinish={onFinish}
        form={loginForm}
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Email không hợp lệ",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="focus:shadow-outline mt-2 w-full rounded py-2 font-bold text-white focus:outline-none"
          >
            Đăng nhập
          </Button>
          <input type="submit" style={{ display: "none" }} />
        </Form.Item>
        <div className="flex flex-col gap-5 text-center text-xs">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold hover:text-[#3162ad]"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
