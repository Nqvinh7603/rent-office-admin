import LoginForm from "../features/auth/LoginForm";
import { useDynamicTitle } from "../utils";

const Login: React.FC = () => {
  useDynamicTitle("Đăng nhập - Cyber Real");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-16">
      <div className="border-1 w-full max-w-6xl rounded-3xl border-gray-300 bg-white shadow-2xl lg:flex lg:p-16">
        <div className="flex w-full flex-col items-center justify-center p-10 lg:w-1/2">
          <div className="text-center">
            <img
              className="mx-auto w-36 md:w-44"
              src="/logo.png"
              alt="Cyber Real logo"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chào mừng bạn quay trở lại!
            </p>
          </div>

          <div className="mt-8 w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <div className="hidden w-full lg:block lg:w-1/2">
          <img
            src="/bg-2.jpg"
            alt="Login illustration"
            className="h-full w-full rounded-r-3xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
