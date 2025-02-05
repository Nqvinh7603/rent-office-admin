import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Space, Table, TablePaginationConfig, TableProps, Tag } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IBuildingLevel, SortParams } from "../../../interfaces";
import { PERMISSIONS } from "../../../interfaces/common/constants";
import { Module } from "../../../interfaces/common/enums";
import { buildingLevelService } from "../../../services";
import {
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";
import Access from "../../auth/Access";
import DeleteBuildingLevel from "./DeleteBuildingLevel";
import UpdateBuildingLevel from "./UpdateBuildingLevel";
import ViewBuildingLevel from "./ViewBuildingLevel";

interface TableParams {
  pagination: TablePaginationConfig;
  sorter?: SorterResult<IBuildingLevel> | SorterResult<IBuildingLevel>[];
}

const BuildingLevelsTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} hạng toà nhà`,
    },
  }));

  const pagination = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };
  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["building-levels", pagination, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => buildingLevelService.getBuildingLevels(pagination, sort),
  });

  useEffect(() => {
    if (data) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: data.payload?.meta.total,
          showTotal: (total) => `Tổng ${total} hạng toà nhà`,
        },
      }));
    }
  }, [data]);

  const handleTableChange: TableProps<IBuildingLevel>["onChange"] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams((prev) => ({
      ...prev,
      pagination,
      sorter,
    }));

    searchParams.set("page", String(pagination.current));
    searchParams.set("pageSize", String(pagination.pageSize));

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

  const columns: TableProps<IBuildingLevel>["columns"] = [
    {
      title: "ID",
      dataIndex: "buildingLevelId",
      key: "buildingLevelId",
      width: "5%",
    },
    {
      title: "Mã hạng toà nhà",
      dataIndex: "buildingLevelCode",
      key: "buildingLevelCode",
      width: "30%",
      render: (buildingLevelCode: string) => (
        <Tag color="green">{buildingLevelCode}</Tag>
      ),
    },
    {
      title: "Tên hạng toà nhà",
      dataIndex: "buildingLevelName",
      key: "buildingLevelName",
      width: "30%",
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
      width: "15%",
      render: (record: IBuildingLevel) => (
        <Space>
          <ViewBuildingLevel buildingLevel={record} />
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].UPDATE_BUILDING_LEVEL}
            hideChildren
          >
            <UpdateBuildingLevel buildingLevel={record} />
          </Access>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].DELETE_BUILDING_LEVEL}
            hideChildren
          >
            <DeleteBuildingLevel buildingLevelId={record.buildingLevelId} />
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record: IBuildingLevel) => record.buildingLevelId}
      dataSource={data?.payload?.content || []}
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

export default BuildingLevelsTable;
