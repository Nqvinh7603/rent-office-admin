import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Switch,
  theme,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  AiOutlineBell,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { BsBuildingsFill } from "react-icons/bs";
import {
  FaKey,
  FaRegCalendarAlt,
  FaUser,
  FaUserCog,
  FaUsers,
} from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineHomeModern } from "react-icons/hi2";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdDashboard, MdOutlineAddHomeWork } from "react-icons/md";
import { RiLuggageDepositFill } from "react-icons/ri";
import { SiFeedly } from "react-icons/si";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import Loading from "../common/components/Loading";
import { useTheme } from "../context/ThemeContext";
import { useAvatarUrl } from "../features/auth/hooks/useAvatarUrl";
import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import {
  useMarkAllRead,
  useMarkNotificationRead,
} from "../features/notification/hooks/useNotification";
import useWebSocket from "../features/notification/hooks/useWebSocket";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { authService, notificationService } from "../services";

const { Header, Sider } = Layout;

const AdminLayout: React.FC = () => {
  useWebSocket("ws://localhost:8081/ws/notifications");
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    location.pathname === "/"
      ? ["dashboard"]
      : location.pathname.slice(1).split("/"),
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);
  const { user, isLoading } = useLoggedInUser();

  const { mutate: markNotificationRead } = useMarkNotificationRead(
    user?.userId ?? "",
  );
  const { mutate: markAllRead } = useMarkAllRead(user?.userId ?? "");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const avatarUrl = useAvatarUrl(user ?? null);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { mutate: logout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      if (window.localStorage.getItem("access_token")) {
        window.localStorage.removeItem("access_token");
      } else {
        window.sessionStorage.removeItem("access_token");
      }
      queryClient.removeQueries();
      navigate("/login");
    },
  });

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <NavLink to={`/users/${user?.userId}`} className="px-1">
          Thông tin tài khoản
        </NavLink>
      ),
    },
    {
      key: "logout",
      label: (
        <span onClick={() => logout()} className="px-1">
          Đăng xuất
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (user?.role.permissions) {
      const permissions = user.role.permissions;

      const viewUsers = permissions.find(
        (item) =>
          item.apiPath === PERMISSIONS[Module.USERS].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.USERS].GET_PAGINATION.method,
      );
      const viewRoles = permissions.find(
        (item) =>
          item.apiPath === PERMISSIONS[Module.ROLES].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.ROLES].GET_PAGINATION.method,
      );

      const viewPermissions = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION.apiPath &&
          item.method === PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION.method,
      );

      const hasAuthChildren: boolean = Boolean(
        viewUsers || viewRoles || viewPermissions,
      );

      const viewBuildingTypes = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_TYPE_PAGINATION
              .apiPath &&
          item.method ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_TYPE_PAGINATION.method,
      );

      const viewBuildingCompany = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_OF_COMPANY_PAGINATION
              .apiPath &&
          item.method ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_OF_COMPANY_PAGINATION
              .method,
      );

      const viewFeeTypes = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.FEES].GET_FEE_TYPES_PAGINATION.apiPath &&
          item.method ===
            PERMISSIONS[Module.FEES].GET_FEE_TYPES_PAGINATION.method,
      );

      const viewBuildingLevels = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_LEVEL_PAGINATION
              .apiPath &&
          item.method ===
            PERMISSIONS[Module.BUILDINGS].GET_BUILDING_LEVEL_PAGINATION.method,
      );

      const viewConsignments: boolean = Boolean(
        permissions.find(
          (item) =>
            item.apiPath ===
              PERMISSIONS[Module.BUILDINGS].GET_BUILDING_PAGINATION.apiPath &&
            item.method ===
              PERMISSIONS[Module.BUILDINGS].GET_BUILDING_PAGINATION.method,
        ),
      );

      const hasBuildingChildren: boolean = Boolean(
        viewBuildingTypes || viewBuildingLevels || viewFeeTypes,
      );

      const viewNotification = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.NOTIFICATIONS].GET_NOTIFICATIONS_BY_USER_ID
              .apiPath &&
          item.method ===
            PERMISSIONS[Module.NOTIFICATIONS].GET_NOTIFICATIONS_BY_USER_ID
              .method,
      );

      const viewPotentialCustomers = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.CUSTOMERS].GET_CUSTOMER_POTENTIAL_PAGINATION
              .apiPath &&
          item.method ===
            PERMISSIONS[Module.CUSTOMERS].GET_CUSTOMER_POTENTIAL_PAGINATION
              .method,
      );

      const viewAppiontmens = permissions.find(
        (item) =>
          item.apiPath ===
            PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENT_CALENDAR.apiPath &&
          item.method ===
            PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENT_CALENDAR.method,
      );

      const menuItems = [
        {
          label: (
            <NavLink className="" to="/">
              Trang chủ
            </NavLink>
          ),
          key: "dashboard",
          icon: <MdDashboard />,
        },
        ...(hasAuthChildren
          ? [
              {
                label: "Xác thực",
                key: "auth",
                icon: <IoShieldCheckmark />,
                children: [
                  ...(viewUsers
                    ? [
                        {
                          label: <NavLink to="/users">Người dùng</NavLink>,
                          key: "users",
                          icon: <FaUsers />,
                        },
                      ]
                    : []),
                  ...(viewRoles
                    ? [
                        {
                          label: <NavLink to="/roles">Vai trò</NavLink>,
                          key: "roles",
                          icon: <FaUserCog />,
                        },
                      ]
                    : []),
                  ...(viewPermissions
                    ? [
                        {
                          label: <NavLink to="/permissions">Quyền hạn</NavLink>,
                          key: "permissions",
                          icon: <FaKey />,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),

        ...(hasBuildingChildren
          ? [
              {
                label: "Quản lý tòa nhà",
                key: "buildings",
                icon: <BsBuildingsFill />,
                children: [
                  ...(viewBuildingTypes
                    ? [
                        {
                          label: (
                            <NavLink to="/building-types">Loại tòa nhà</NavLink>
                          ),
                          key: "building-types",
                          icon: <MdOutlineAddHomeWork size={16} />,
                        },
                      ]
                    : []),
                  ...(viewBuildingLevels
                    ? [
                        {
                          label: (
                            <NavLink to="/building-levels">
                              Hạng tòa nhà
                            </NavLink>
                          ),
                          key: "building-levels",
                          icon: <FaRankingStar size={17} />,
                        },
                      ]
                    : []),
                  ...(viewFeeTypes
                    ? [
                        {
                          label: <NavLink to="/fee-types">Loại phí</NavLink>,
                          key: "fee-types",
                          icon: <SiFeedly size={17} />,
                        },
                      ]
                    : []),
                  ...(viewBuildingCompany
                    ? [
                        {
                          label: (
                            <NavLink to="/buildings">Danh sách tài sản</NavLink>
                          ),
                          key: "buildings",
                          icon: <HiOutlineHomeModern />,
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        ...(viewConsignments
          ? [
              {
                label: <NavLink to="/consignments">Yêu cầu ký gửi</NavLink>,
                key: "consignments",
                icon: <RiLuggageDepositFill size={17} />,
              },
            ]
          : []),
        ...(viewPotentialCustomers
          ? [
              {
                label: (
                  <NavLink to="/potential-customers">Yêu cầu thuê</NavLink>
                ),
                key: "customers",
                icon: <FiPhoneCall size={16} />,
              },
            ]
          : []),
        ...(viewAppiontmens
          ? [
              {
                label: <NavLink to="/appointments">Cuộc hẹn</NavLink>,
                key: "appointments",
                icon: <FaRegCalendarAlt size={15} />,
              },
            ]
          : []),
        ...(viewNotification
          ? [
              {
                label: <NavLink to="/notifications">Quản lý thông báo</NavLink>,
                key: "notifications",
                icon: <AiOutlineBell size={18} />,
              },
            ]
          : []),
      ];
      setMenuItems(menuItems);
    }
  }, [user]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const checkScreenWidth = () => {
      const mdBreakpoint = 768;
      if (window.innerWidth < mdBreakpoint) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === `/users/${user?.userId}`) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(
        location.pathname === "/"
          ? ["dashboard"]
          : location.pathname.slice(1).split("/"),
      );
    }
  }, [location, user]);

  const { data: notificationDatas } = useQuery({
    queryKey: ["notifications", user?.userId],
    queryFn: () => notificationService.getNotifications(user?.userId ?? ""),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const notifications = notificationDatas?.payload || [];

  if (isLoading) {
    return <Loading />;
  }

  const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "fixed",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    scrollbarColor: "black",
    boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle: React.CSSProperties = {
    background: colorBgContainer,
    padding: 0,
    zIndex: 1,
    overflow: "auto",
    position: "fixed",
    insetInlineStart: collapsed ? 80 : 230,
    top: 0,
    right: 0,
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        style={siderStyle}
        width={230}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
      >
        <div className="demo-logo-vertical flex flex-col items-center pb-6">
          <img src="/logo.png" alt="Logo" className="w-48 p-2" />
          {!collapsed && (
            <h1
              className={`font-semibold ${isDarkMode ? "text-white" : "text-black"}`}
            >
              Admin
            </h1>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => {
            setSelectedKeys([key]);
          }}
        />
      </Sider>
      <Layout
        className="transition-all duration-200"
        style={{ marginInlineStart: collapsed ? 80 : 230 }}
      >
        <Header
          style={headerStyle}
          className="shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <Button
              type="text"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "20px",
              }}
            />
            <div className="relative mr-5 flex items-center gap-2">
              <Switch
                className="mr-1 items-center"
                checked={isDarkMode}
                onChange={() => {
                  toggleDarkMode();
                }}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />

              <Badge
                count={notifications.filter((n) => !n.status).length}
                className={`mr-4 ${
                  notifications.some((n) => !n.status)
                    ? "animate-bell-shake"
                    : ""
                }`}
                size="small"
              >
                <Dropdown
                  menu={{
                    items:
                      notifications.length > 0
                        ? [
                            {
                              key: "mark-all-read",
                              label: (
                                <Checkbox
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAllRead();
                                  }}
                                  disabled={notifications.every(
                                    (n) => n.status,
                                  )}
                                >
                                  Đánh dấu đọc tất cả
                                </Checkbox>
                              ),
                            },
                            { type: "divider" },
                            ...notifications
                              .slice(0, 5)
                              .map((notification, index) => ({
                                key: notification.notificationId,
                                label: (
                                  <div className="flex cursor-pointer items-start py-2">
                                    <div className="flex-grow">
                                      <span
                                        className={
                                          notification.status === false
                                            ? "font-bold"
                                            : ""
                                        }
                                      >
                                        {notification.message.length > 100
                                          ? `${notification.message.slice(0, 100)}...`
                                          : notification.message}
                                      </span>
                                      {notification.status === false && (
                                        <span className="float-right ml-2 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                                      )}
                                      <br />
                                      <small className="text-xs text-gray-500">
                                        {dayjs(notification.createdAt).format(
                                          "DD/MM/YYYY hh:mm A",
                                        )}
                                      </small>
                                    </div>
                                  </div>
                                ),
                                className:
                                  index % 2 === 0
                                    ? "table-row-light"
                                    : "table-row-gray",
                                onClick: () => {
                                  navigate(
                                    `/consignments/${notification.consignmentId}`,
                                  );
                                  markNotificationRead(
                                    notification.notificationId,
                                    {
                                      onSuccess: () => {
                                        queryClient.invalidateQueries({
                                          queryKey: ["notifications"],
                                        });
                                      },
                                    },
                                  );
                                },
                              })),
                            { type: "divider" },
                            {
                              key: "view-all",
                              label: (
                                <div
                                  className="cursor-pointer text-center font-semibold text-[#3162ad]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/notifications");
                                  }}
                                >
                                  Xem tất cả thông báo
                                </div>
                              ),
                            },
                          ]
                        : [
                            {
                              key: "no-notifications",
                              label: (
                                <div className="text-center text-gray-500">
                                  Không có thông báo
                                </div>
                              ),
                            },
                          ],
                  }}
                  trigger={["click"]}
                  placement="bottomRight"
                  arrow
                  overlayStyle={{ width: 300 }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      queryClient.invalidateQueries({
                        queryKey: ["notifications"],
                      });
                    }}
                    className="cursor-pointer"
                  >
                    <AiOutlineBell size={24} />
                  </div>
                </Dropdown>
              </Badge>

              <Dropdown
                menu={{ items }}
                placement="bottom"
                overlayStyle={{
                  position: "absolute",
                  top: "60px",
                }}
              >
                <Button
                  type="text"
                  icon={
                    avatarUrl ? (
                      <Avatar src={avatarUrl} size={"large"} shape="square" />
                    ) : (
                      <FaUser size={18} className="" />
                    )
                  }
                  style={{
                    fontSize: "15px",
                  }}
                />
              </Dropdown>
              <p className="text-semibold cursor-pointer">
                {user ? `${user.lastName || ""} ${user.firstName || ""}` : ""}
              </p>
            </div>
          </div>
        </Header>

        <Layout.Content>
          <div className="m-2 mt-[70px]">
            <Outlet />
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
