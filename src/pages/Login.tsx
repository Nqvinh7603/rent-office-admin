import { useTheme } from "../context/ThemeContext";
import LoginForm from "../features/auth/LoginForm";
import { useDynamicTitle } from "../utils";

const Login: React.FC = () => {
  useDynamicTitle("Đăng nhập - Cyber Real");

  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen items-center justify-center py-16 transition-all duration-300 ${
        isDarkMode ? "bg-[#121212]" : "bg-gray-50"
      }`}
    >
      <div
        className={`border-1 w-full max-w-6xl rounded-3xl border-gray-300 shadow-2xl transition-all duration-300 lg:flex lg:p-16 ${
          isDarkMode ? "border-gray-700 bg-[#1E1E1E] text-gray-300" : "bg-white"
        }`}
      >
        <div className="flex w-full flex-col items-center justify-center p-10 lg:w-1/2">
          <div className="text-center">
            <img
              className="mx-auto w-36 md:w-44"
              src="/logo.png"
              alt="Cyber Real logo"
            />
            <h2
              className={`mt-6 text-3xl font-extrabold transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Đăng nhập
            </h2>
            <p
              className={`mt-2 text-sm transition-all duration-300 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Chào mừng bạn quay trở lại!
            </p>
          </div>

          <div className="mt-8 w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <div className="hidden w-full lg:block lg:w-1/2">
          <img
            src="/bg-3.png"
            alt="Login illustration"
            className="h-full w-full rounded-r-3xl object-cover brightness-100 transition-all duration-300"
            style={{
              filter: isDarkMode ? "brightness(0.8)" : "brightness(1)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
