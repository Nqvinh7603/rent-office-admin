import ForgotPasswordForm from "../features/auth/ForgotPasswordForm";
import { useDynamicTitle } from "../utils";

const ForgotPassword: React.FC = () => {
  useDynamicTitle("Quên mật khẩu - Cyber Real");
  return <ForgotPasswordForm />;
};

export default ForgotPassword;
