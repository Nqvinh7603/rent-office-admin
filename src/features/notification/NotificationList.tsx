import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Checkbox,
  Empty,
  List,
  Popconfirm,
  Skeleton,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib";
import dayjs from "dayjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineBell, AiOutlineDelete } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router";
import { INotification } from "../../interfaces";
import { PERMISSIONS } from "../../interfaces/common/constants";
import { Module } from "../../interfaces/common/enums";
import { notificationService } from "../../services";
import Access from "../auth/Access";
import { useLoggedInUser } from "../auth/hooks/useLoggedInUser";
import {
  useMarkAllRead,
  useMarkNotificationRead,
} from "./hooks/useNotification";

const NotificationList: React.FC = () => {
  const { user, isLoading: isUserLoading } = useLoggedInUser();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications", user?.userId],
    queryFn: () => notificationService.getNotifications(user?.userId ?? ""),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { mutate: markNotificationRead } = useMarkNotificationRead(
    user?.userId ?? "",
  );

  const { mutate: markAllRead } = useMarkAllRead(user?.userId ?? "");
  const { mutate: deleteNotifications, status: isDeleting } = useMutation({
    mutationFn: async (notifications: number[]) => {
      return notificationService.deleteNotification(notifications);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("notifications"),
      });
    },
  });

  const navigate = useNavigate();
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  if (isUserLoading || isNotificationsLoading) {
    return <Skeleton active />;
  }

  if (!user || !notifications?.payload?.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const allRead = notifications.payload.every(
    (notification) => notification.status === true,
  );

  const handleNotificationClick = (
    notificationId: number,
    consignmentId: number,
  ) => {
    markNotificationRead(notificationId, {
      onSuccess: () => {
        navigate(`/consignments/${consignmentId}`);
      },
    });
  };

  const handleMarkAllRead = () => {
    setMarkAllLoading(true);
    markAllRead(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", user?.userId],
        });
        setMarkAllLoading(false);
      },
      onError: () => {
        setMarkAllLoading(false);
      },
    });
  };

  const handleSelectNotification = (
    notificationId: number,
    event: CheckboxChangeEvent,
  ) => {
    event.stopPropagation();
    setSelectedNotifications((prevSelected) =>
      prevSelected.includes(notificationId)
        ? prevSelected.filter((id) => id !== notificationId)
        : [...prevSelected, notificationId],
    );
  };

  const handleSelectAll = () => {
    const notificationList = notifications.payload as INotification[];
    if (selectedNotifications.length === notificationList?.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(
        notificationList.map((n: INotification) => n.notificationId),
      );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length > 0) {
      setLoading(true);
      deleteNotifications(selectedNotifications, {
        onSuccess: () => {
          toast.success("Xóa thông báo thành công");
          queryClient.invalidateQueries({
            queryKey: ["notifications", user?.userId],
          });
          setSelectedNotifications([]);
          setLoading(false);
        },
        onError: () => {
          toast.error("Xóa thông báo thất bại");
          setLoading(false);
        },
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        <Button
          icon={<FaRegEye size={16} />}
          type="primary"
          htmlType="submit"
          onClick={handleMarkAllRead}
          disabled={allRead || loading}
          loading={markAllLoading}
          className="text-sm"
        >
          Đánh dấu đã đọc tất cả
        </Button>
        <Button
          type="default"
          onClick={handleSelectAll}
          className="text-sm"
          disabled={loading}
        >
          {selectedNotifications.length ===
          (notifications.payload as INotification[]).length
            ? "Bỏ chọn tất cả"
            : "Chọn tất cả"}
        </Button>
        <Access
          permission={PERMISSIONS[Module.NOTIFICATIONS].DELETE}
          hideChildren={true}
        >
          {selectedNotifications.length > 0 && (
            <Popconfirm
              title="Xóa các thông báo đã chọn?"
              description="Bạn có chắc muốn xóa các thông báo đã chọn không?"
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={handleDeleteSelected}
            >
              <Button
                type="dashed"
                icon={<AiOutlineDelete />}
                style={{ color: "red" }}
                disabled={loading}
                loading={isDeleting === "pending"}
              >
                Xoá
              </Button>
            </Popconfirm>
          )}
        </Access>
      </div>

      <div style={{ maxHeight: "670px", overflowY: "auto" }}>
        <List
          loading={isNotificationsLoading}
          itemLayout="horizontal"
          dataSource={notifications.payload as INotification[]}
          renderItem={(notification: INotification) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-100 dark:bg-[#2C2C2C] dark:text-gray-300 dark:hover:bg-[#363535]"
              onClick={() =>
                handleNotificationClick(
                  notification.notificationId,
                  notification.consignmentId,
                )
              }
              actions={[
                <Checkbox
                  style={{ marginRight: "20px" }}
                  checked={selectedNotifications.includes(
                    notification.notificationId,
                  )}
                  onChange={(event) => {
                    event.stopPropagation();
                    handleSelectNotification(
                      notification.notificationId,
                      event,
                    );
                  }}
                  onClick={(event) => event.stopPropagation()}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={
                      <AiOutlineBell className="text-black dark:text-white" />
                    }
                    className={`${
                      (notification as INotification).status === false
                        ? "bg-green-500"
                        : "bg-transparent"
                    }`}
                  />
                }
                title={
                  <span
                    className={`${
                      (notification as INotification).status === false
                        ? "font-bold"
                        : ""
                    }`}
                  >
                    {(notification as INotification).message}
                  </span>
                }
                description={dayjs(
                  (notification as INotification).createdAt,
                ).format("DD/MM/YYYY hh:mm A")}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default NotificationList;
