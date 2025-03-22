import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import {
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ICustomer, Page } from "../../interfaces";
import {
  PERMISSIONS,
  POTENTIAL_CUSTOMER_STATUS_TRANSLATION,
} from "../../interfaces/common/constants";
import { Module, PotentialCustomerStatus } from "../../interfaces/common/enums";
import {
  colorFilterIcon,
  colorPotentialCustomerStatus,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultSortOrder,
  getSortDirection,
} from "../../utils";
import Access from "../auth/Access";
import AssignPotentialCustomer from "./AssignPotentialCustomer";
import DeletePotentialCustomer from "./DeletePotentailCustomer";
import UpdatePotentialCustomer from "./UpdatePotentialCustomer";

interface TableParams {
  pagination: TablePaginationConfig;
}

interface PotentailCustomerTableProps {
  potentialCustomerPage?: Page<ICustomer>;
  isLoading: boolean;
}

const PotentailCustomersTable: React.FC<PotentailCustomerTableProps> = ({
  potentialCustomerPage,
  isLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} yêu cầu thuê`,
    },
  }));

  useEffect(() => {
    if (potentialCustomerPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: potentialCustomerPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} yêu cầu thuê`,
        },
      }));
    }
  }, [potentialCustomerPage]);

  const handleTableChange: TableProps<ICustomer>["onChange"] = (
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

  const columns: TableProps<ICustomer>["columns"] = [
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      width: "5%",
      render: (email: string) => (
        <Tooltip title="Click chuyển sang gmail">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {email}
          </a>
        </Tooltip>
      ),
    },
    {
      key: "phoneNumber",
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: "8%",
      render: (phoneNumber: string) => (
        <Tooltip title="Click chuyển sang zalo">
          <a
            href={`https://zalo.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {phoneNumber}
          </a>
        </Tooltip>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (status: PotentialCustomerStatus) => (
        <Tag color={colorPotentialCustomerStatus(status)}>
          {POTENTIAL_CUSTOMER_STATUS_TRANSLATION[status]}
        </Tag>
      ),
      filters: Object.keys(POTENTIAL_CUSTOMER_STATUS_TRANSLATION).map(
        (key) => ({
          text: POTENTIAL_CUSTOMER_STATUS_TRANSLATION[
            key as PotentialCustomerStatus
          ],
          value: key,
        }),
      ),
      defaultFilteredValue: searchParams.get("status")?.split(",") || null,
      filterIcon: (filtered: boolean) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: "10%",
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
      key: "updatedAt",
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      width: "10%",
      render: (createdAt: string) =>
        createdAt ? formatTimestamp(createdAt) : "",
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
      key: "actions",
      title: "Hành động",
      dataIndex: "actions",
      width: "8%",
      render: (_, record) => (
        <Space size="middle">
          <Access
            permission={
              PERMISSIONS[Module.CUSTOMERS].GET_STAFFS_BY_CUSTOMER_ID &&
              PERMISSIONS[Module.CUSTOMERS].ASSIGN_CUSTOMER_TO_STAFFS
            }
            hideChildren={true}
          >
            <AssignPotentialCustomer customer={record} />
          </Access>
          <Access
            permission={PERMISSIONS[Module.CUSTOMERS].UPDATE_CUSTOMER_POTENTIAL}
            hideChildren={false}
          >
            <UpdatePotentialCustomer potentialCustomer={record} />
          </Access>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].DELETE_BUILDING}
            hideChildren={false}
          >
            <DeletePotentialCustomer potentialCustomerId={record.customerId} />
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: ICustomer) => record.customerId}
      pagination={tableParams.pagination}
      dataSource={potentialCustomerPage?.content || []}
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

export default PotentailCustomersTable;
