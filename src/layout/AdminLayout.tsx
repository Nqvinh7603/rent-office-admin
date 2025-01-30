import React, { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, Button, Dropdown, Layout, Menu, MenuProps, theme } from "antd";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { FaKey, FaUser, FaUserCog, FaUsers } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import Loading from "../common/components/Loading";
import { useAvatarUrl } from "../features/auth/hooks/useAvatarUrl";
import { useLoggedInUser } from "../features/auth/hooks/useLoggedInUser";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { authService } from "../services";
const { Header, Sider } = Layout;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    location.pathname === "/"
      ? ["dashboard"]
      : location.pathname.slice(1).split("/"),
  );
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);
  const { user, isLoading } = useLoggedInUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const avatarUrl = useAvatarUrl(user ?? null);

  const { mutate: logout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      window.localStorage.removeItem("access_token");
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
          {!collapsed && <h1 className="font-semibold">Admin</h1>}
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
                      <Avatar
                        src={avatarUrl}
                        // className="m-2"
                        size={"large"}
                        shape="square"
                      />
                    ) : (
                      <FaUser size={18} className="mb-2" />
                    )
                  }
                  style={{
                    fontSize: "30px",
                  }}
                />
              </Dropdown>
              <p className="text-semibold cursor-pointer">
                {user ? `${user.lastName} ${user.firstName}` : ""}
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
