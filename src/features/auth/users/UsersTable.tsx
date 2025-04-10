import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { useSearchParams } from "react-router-dom";
import { IUser, Page } from "../../../interfaces";
import {
  PERMISSIONS,
  USER_STATUS_TRANSLATION,
} from "../../../interfaces/common/constants";
import { Module } from "../../../interfaces/common/enums";
import { roleService } from "../../../services";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  colorUserStatus,
  formatTimestamp,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";
import Access from "../Access";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import DeleteUser from "./DeleteUser";
import UpdateUser from "./UpdateUser";
import ViewUser from "./ViewUser";

interface TableParams {
  pagination: TablePaginationConfig;
}

interface UserTableProps {
  userPage?: Page<IUser>;
  isLoading: boolean;
}
const UsersTable: React.FC<UserTableProps> = ({ userPage, isLoading }) => {
  const { user: currentUser } = useLoggedInUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} người dùng`,
    },
  }));

  useEffect(() => {
    if (userPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: userPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} người dùng`,
        },
      }));
    }
  }, [userPage]);

  const handleTableChange: TableProps<IUser>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
      sorter,
      filters,
    }));
    searchParams.set("page", String(pagination.current));
    searchParams.set("pageSize", String(pagination.pageSize));

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(","));
        } else {
          if (value) {
            searchParams.set(key, `${value}`);
          } else {
            searchParams.delete(key);
          }
        }
      });
    }

    let sortBy;
    let direction;

    if (sorter) {
      if (Array.isArray(sorter)) {
        sortBy = sorter[0].field as string;
        direction = getSortDirection(sorter[0].order as string);
      } else {
        sortBy = sorter.field as string;
        direction = getSortDirection(sorter.order as string);
      }
    }

    if (sortBy && direction) {
      searchParams.set("sortBy", sortBy);
      searchParams.set("direction", direction);
    } else {
      searchParams.delete("direction");
      searchParams.delete("sortBy");
    }

    setSearchParams(searchParams);
  };

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: roleService.getAllRoles,
  });
  const roleOptions = rolesData?.payload?.map((role) => ({
    value: role.roleId,
    text: role.roleName,
  }));
  const columns: TableProps<IUser>["columns"] = [
    {
      title: "Họ và tên",
      key: "fullName",
      dataIndex: ["lastName", "firstName"],
      width: "20%",
      render: (_, record) =>
        `${record.lastName || ""} ${record.firstName || ""}`.trim(),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "15%",
      render: (email) => email || "",
    },
    {
      key: "role",
      title: "Vai trò",
      dataIndex: "role",
      width: "10%",
      render: (role) => role?.roleName || "",
      filters: roleOptions,
      onFilter: (value, record) => record.role?.roleId === value,
      defaultFilteredValue: getDefaultFilterValue(searchParams, "role"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "active",
      title: "Trạng thái",
      dataIndex: "active",
      width: "10%",
      render: (active: boolean) => (
        <Tag color={colorUserStatus(active)}>
          {USER_STATUS_TRANSLATION[String(active)] || ""}
        </Tag>
      ),
      filters: [
        { text: "Đang hoạt động", value: true },
        { text: "Ngừng hoạt động", value: false },
      ],
      defaultFilteredValue: getDefaultFilterValue(searchParams, "active"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "14%",
      render: (createdAt: string) =>
        createdAt ? formatTimestamp(createdAt) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "createdAt"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "updateAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "14%",
      render: (updatedAt: string) =>
        updatedAt ? formatTimestamp(updatedAt) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "updatedAt"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "8%",

      render: (record: IUser) => (
        <Space style={{ display: "flex", justifyContent: "center" }}>
          {currentUser?.userId !== record.userId ? (
            <>
              <ViewUser user={record} />

              <Access
                permission={PERMISSIONS[Module.USERS].UPDATE}
                hideChildren
              >
                <UpdateUser user={record} />
              </Access>
              <Access
                permission={PERMISSIONS[Module.USERS].DELETE}
                hideChildren
              >
                <DeleteUser userId={record.userId} />
              </Access>
            </>
          ) : (
            <FcCancel size={24} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IUser) => record.userId}
      pagination={tableParams.pagination}
      dataSource={userPage?.content || []}
      rowClassName={(_, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-gray"
      }
      rowHoverable={false}
      loading={{
        spinning: isLoading,
        tip: "Đang tải dữ liệu...",
      }}
      onChange={handleTableChange}
      size="middle"
    />
  );
};

export default UsersTable;
