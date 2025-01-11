import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { GetProp, Space, Table, TablePaginationConfig, TableProps } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  IPermission,
  PaginationParams,
  PermissionFilterCriteria,
  SortParams,
} from "../../../interfaces";
import { PERMISSIONS } from "../../../interfaces/common/constants";
import { Method, Module } from "../../../interfaces/common/enums";
import { permissionService } from "../../../services";
import {
  colorFilterIcon,
  colorMethod,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultFilterValue,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";
import Access from "../Access";
import UpdatePermission from "./UpdatePermission";

interface TableParams {
  pagination: TablePaginationConfig;
  sorter?: SorterResult<IPermission> | SorterResult<IPermission>[];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const PermissionTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} quyền hạn`,
    },
  }));

  const pagination: PaginationParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };
  const filter: PermissionFilterCriteria = {
    method: searchParams.get("method") || undefined,
    module: searchParams.get("module") || undefined,
  };
  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["permissions", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => permissionService.getPermissions(pagination, filter, sort),
  });

  useEffect(() => {
    if (data) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: data?.payload?.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} quyền hạn`,
        },
      }));
    }
  }, [data]);

  const handleTableChange: TableProps<IPermission>["onChange"] = (
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

  const columns: TableProps<IPermission>["columns"] = [
    {
      title: "ID",
      dataIndex: "permissionId",
      key: "permissionId",
      width: "5%",
    },
    {
      title: "Tên quyền hạn",
      dataIndex: "name",
      key: "name",
      width: "15%",
    },
    {
      title: "API",
      dataIndex: "apiPath",
      key: "apiPath",
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      width: "12%",
      render(method: IPermission["method"]) {
        return (
          <p
            style={{
              fontWeight: "bold",
              color: colorMethod(method),
            }}
          >
            {method}
          </p>
        );
      },
      filters: Object.values(Method).map((method: string) => ({
        text: method,
        value: method,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "method"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      filters: Object.values(Module).map((module: string) => ({
        text: module,
        value: module,
      })),
      defaultFilteredValue: getDefaultFilterValue(searchParams, "module"),
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      title: "Thời gian tạo",
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
      title: "Thời gian cập nhật",
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
      align: "center",
      render: (record: IPermission) => (
        <Space size="middle">
          <Access
            permission={PERMISSIONS[Module.PERMISSIONS].UPDATE}
            hideChildren
          >
            <UpdatePermission permission={record} />
          </Access>
          {/* <DeletePermission permissionId={record.permissionId} />O */}
        </Space>
      ),
    },
  ];
  return (
    <Table
      bordered={false}
      rowKey={(record: IPermission) => record.permissionId}
      dataSource={data?.payload?.content || []}
      columns={columns}
      pagination={tableParams.pagination}
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

export default PermissionTable;
