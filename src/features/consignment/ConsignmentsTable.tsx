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
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IConsignment, Page } from "../../interfaces";
import {
  CONSIGNMENT_STATUS_TRANSLATION,
  PERMISSIONS,
} from "../../interfaces/common/constants";
import { ConsignmentStatus, Module } from "../../interfaces/common/enums";
import {
  colorConsignmentStatus,
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatCurrency,
  formatTimestamp,
  getDefaultSortOrder,
  getSortDirection,
} from "../../utils";
import Access from "../auth/Access";
import AssignCustomer from "./AssignCustomer";

interface TableParams {
  pagination: TablePaginationConfig;
}

interface ConsignmentTableProps {
  consignmentPage?: Page<IConsignment>;
  isLoading: boolean;
}

const ConsignmentsTable: React.FC<ConsignmentTableProps> = ({
  consignmentPage,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} yêu cầu ký gửi`,
    },
  }));

  useEffect(() => {
    if (consignmentPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: consignmentPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} yêu cầu ký gửi`,
        },
      }));
    }
  }, [consignmentPage]);

  const handleTableChange: TableProps<IConsignment>["onChange"] = (
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

  const columns: TableProps<IConsignment>["columns"] = [
    {
      key: "email",
      title: "Email",
      dataIndex: ["customer", "email"],
      width: "10%",
    },
    {
      key: "phoneNumber",
      title: "Số điện thoại",
      dataIndex: ["customer", "phoneNumber"],
      width: "8%",
    },
    {
      key: "buildingType",
      title: "Loại toà nhà",
      dataIndex: "buildingType",
      width: "15%",
    },
    {
      key: "price",
      title: "Giá (VND/m²)",
      dataIndex: "price",
      width: "8%",
      render: (price: number) => <span>{formatCurrency(price)}</span>,
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "price"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      dataIndex: "status",
      width: "5%",
      render: (status: string) => (
        <Tag color={colorConsignmentStatus(status)}>
          {CONSIGNMENT_STATUS_TRANSLATION[status as ConsignmentStatus]}
        </Tag>
      ),
      filters: Object.keys(CONSIGNMENT_STATUS_TRANSLATION).map((key) => ({
        text: CONSIGNMENT_STATUS_TRANSLATION[key as ConsignmentStatus],
        value: key,
      })),
      defaultFilteredValue: searchParams.get("status")?.split(",") || null,
      filterIcon: (filtered) => (
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
      title: "Hành động",
      key: "action",
      width: "7%",
      render: (record: IConsignment) => (
        <Space
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          <Access
            permission={
              PERMISSIONS[Module.CUSTOMERS].GET_STAFFS_BY_CUSTOMER_ID &&
              PERMISSIONS[Module.CUSTOMERS].ASSIGN_CUSTOMER_TO_STAFFS
            }
            hideChildren={true}
          >
            <AssignCustomer consignment={record} />
          </Access>
          <Access
            permission={PERMISSIONS[Module.CONSIGNMENTS].GET_CONSIGNMENT_BY_ID}
            hideChildren={false}
          >
            <Tooltip title="Xem chi tiết">
              <FaArrowRightToBracket
                onClick={() => navigate(`${record.consignmentId}`)}
                size={19}
              />
            </Tooltip>
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IConsignment) => record.consignmentId}
      pagination={tableParams.pagination}
      dataSource={consignmentPage?.content || []}
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

export default ConsignmentsTable;
