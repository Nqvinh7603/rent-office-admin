import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { GetProp } from "antd/lib";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IRole, RoleFilterCriteria, SortParams } from "../../../interfaces";
import { PERMISSIONS } from "../../../interfaces/common/constants";
import { Module } from "../../../interfaces/common/enums";
import { roleService } from "../../../services/auth/role-service";
import {
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";
import Access from "../Access";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import DeleteRole from "./DeleteRole";
import UpdateRole from "./UpdateRole";
import ViewRole from "./ViewRole";
interface TableParams {
  pagination: TablePaginationConfig;
  sorter?: SorterResult<IRole> | SorterResult<IRole>[];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const RolesTable: React.FC = () => {
  const { user: currentUser } = useLoggedInUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} vai trò`,
    },
  }));

  const pagination = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };
  const filter: RoleFilterCriteria = {
    active:
      searchParams.get("active") === "true"
        ? true
        : searchParams.get("active") === "false"
          ? false
          : undefined,
  };
  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["roles", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => roleService.getRoles(pagination, filter, sort),
  });

  useEffect(() => {
    if (data) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: data.payload?.meta.total,
          showTotal: (total) => `Tổng ${total} vai trò`,
        },
      }));
    }
  }, [data]);

  const handleTableChange: TableProps<IRole>["onChange"] = (
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

  const columns: TableProps<IRole>["columns"] = [
    {
      title: "ID",
      dataIndex: "roleId",
      key: "roleId",
      width: "5%",
    },
    {
      title: "Tên",
      dataIndex: "roleName",
      key: "roleName",
      width: "10%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      width: "15%",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
      filters: [
        { text: "ACTIVE", value: true },
        { text: "INACTIVE", value: false },
      ],
      defaultFilteredValue: getDefaultFilterValue(searchParams, "active"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "15%",
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
      width: "10%",
      render: (record: IRole) => (
        <Space>
          <ViewRole role={record} />
          <Access permission={PERMISSIONS[Module.ROLES].UPDATE} hideChildren>
            <UpdateRole role={record} />
          </Access>
          {currentUser?.role.roleId !== record.roleId && (
            <Access permission={PERMISSIONS[Module.ROLES].DELETE} hideChildren>
              <DeleteRole roleId={record.roleId} />
            </Access>
          )}
        </Space>
      ),
    },
  ];
  return (
    <Table
      rowKey={(role: IRole) => role.roleId}
      dataSource={data?.payload?.content}
      columns={columns}
      pagination={tableParams.pagination}
      bordered={false}
      size="middle"
      rowClassName={(_, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-gray"
      }
      rowHoverable={false}
      loading={{
        spinning: isLoading,
        tip: "Đang tải dữ liệu...",
      }}
      onChange={handleTableChange}
    />
  );
};

export default RolesTable;
