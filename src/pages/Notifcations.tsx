import NotificationList from "../features/notification/NotificationList";
import { useDynamicTitle } from "../utils";

const Notifications: React.FC = () => {
  useDynamicTitle("Quản lý thông báo - Cyber Real");

  return (
    <div className="card">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách thông báo</h2>
      </div>
      <NotificationList />
    </div>
  );
};

export default Notifications;
