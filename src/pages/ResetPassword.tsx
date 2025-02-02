import ResetPasswordForm from "../features/auth/ResetPasswordForm";
import { useDynamicTitle } from "../utils";
const ResetPassword: React.FC = () => {
  useDynamicTitle("Đặt mật khẩu mới - Cyber Real");
  return <ResetPasswordForm />;
};

export default ResetPassword;
