import { Button } from "antd";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage: React.FC = () => {
  const routeError = useRouteError();
  const navigate = useNavigate();
  let errorMessage: string;

  if (isRouteErrorResponse(routeError)) {
    errorMessage = routeError.data;
  } else if (routeError instanceof Error) {
    errorMessage = routeError.message;
  } else if (typeof routeError === "string") {
    errorMessage = routeError;
  } else {
    errorMessage = "Unknown error";
  }

  useDynamicTitle("Lỗi - Cybereal");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <img
          src="/sth-went-wrong.png"
          alt="Something went wrong"
          width={300}
          height={300}
        />

        <p className="my-4">{errorMessage}</p>

        <Button size="large" type="primary" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
