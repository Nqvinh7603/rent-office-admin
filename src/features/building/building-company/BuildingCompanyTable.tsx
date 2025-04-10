import {
  CaretDownFilled,
  CaretUpFilled,
  FilterFilled,
} from "@ant-design/icons";
import { Space, Table, TablePaginationConfig, Tag, Tooltip } from "antd";
import { TableProps } from "antd/lib";
import { useEffect, useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router";
import { IBuilding, Page } from "../../../interfaces";
import {
  BUILDING_STATUS_TRANSLATION,
  PERMISSIONS,
} from "../../../interfaces/common/constants";
import { BuildingStatus, Module } from "../../../interfaces/common/enums";
import {
  colorBuildingStatus,
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatCurrency,
  formatTimestamp,
  getDefaultSortOrder,
  getSortDirection,
} from "../../../utils";
import Access from "../../auth/Access";
import AssignBuildingForStaff from "./AssignBuildingForStaff";
import DeleteBuildings from "./DeleteBuildings";

interface TableParams {
  pagination: TablePaginationConfig;
}

interface BuildingTableProps {
  buildingPage?: Page<IBuilding>;
  isLoading: boolean;
}

const BuildingCompanyTable: React.FC<BuildingTableProps> = ({
  buildingPage,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} tài sản`,
    },
  }));

  useEffect(() => {
    if (buildingPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: buildingPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} tài sản`,
        },
      }));
    }
  }, [buildingPage]);

  const handleTableChange: TableProps<IBuilding>["onChange"] = (
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

  const columns: TableProps<IBuilding>["columns"] = [
    {
      key: "buildingName",
      title: "Tên tài sản",
      dataIndex: ["buildingName"],
      width: "10%",
    },
    {
      key: "buildingType",
      title: "Loại tài sản",
      dataIndex: ["buildingType", "buildingTypeName"],
      width: "10%",
    },
    {
      key: "buildingLevel",
      title: "Xếp hạng",
      dataIndex: ["buildingLevel", "buildingLevelName"],
      width: "10%",
      render: (buildingLevelName: string) =>
        buildingLevelName ? buildingLevelName : "Chưa xếp hạng",
    },
    {
      key: "price",
      title: "Giá (VND/m²)",
      dataIndex: ["buildingUnits"],
      width: "10%",
      render: (buildingUnits: { rentalPricing: { price: number }[] }[]) => {
        const minPrice = Math.min(
          ...buildingUnits.map(
            (unit) => unit.rentalPricing?.[0]?.price || Infinity,
          ),
        );
        return (
          <span>
            {minPrice !== Infinity ? formatCurrency(minPrice) : "N/A"}
          </span>
        );
      },
      sorter: (a, b) => {
        const minPriceA = Math.min(
          ...a.buildingUnits.map(
            (unit) => unit.rentalPricing[0]?.price || Infinity,
          ),
        );
        const minPriceB = Math.min(
          ...b.buildingUnits.map(
            (unit) => unit.rentalPricing[0]?.price || Infinity,
          ),
        );
        return minPriceA - minPriceB;
      },
      defaultSortOrder: getDefaultSortOrder(searchParams, "price"),
      sortIcon: ({ sortOrder }) => (
        <div className="flex flex-col text-[10px]">
          <CaretUpFilled style={{ color: colorSortUpIcon(sortOrder) }} />
          <CaretDownFilled style={{ color: colorSortDownIcon(sortOrder) }} />
        </div>
      ),
    },
    {
      key: "buildingStatus",
      title: "Trạng thái",
      dataIndex: "buildingStatus",
      width: "5%",
      render: (status: BuildingStatus) => (
        <Tag color={colorBuildingStatus(status)}>
          {BUILDING_STATUS_TRANSLATION[status]}
        </Tag>
      ),
      filters: Object.keys(BUILDING_STATUS_TRANSLATION).map((key) => ({
        text: BUILDING_STATUS_TRANSLATION[key as BuildingStatus],
        value: key,
      })),
      defaultFilteredValue:
        searchParams.get("buildingStatus")?.split(",") || undefined,
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
      render: (record: IBuilding) => (
        <Space
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          <Access
            permission={
              PERMISSIONS[Module.BUILDINGS].GET_STAFFS_BY_BUILDING_ID &&
              PERMISSIONS[Module.BUILDINGS].ASSIGN_BUILDING_TO_STAFFS
            }
            hideChildren={true}
          >
            <AssignBuildingForStaff building={record} />
          </Access>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].GET_BUILDING_BY_ID}
            hideChildren={false}
          >
            <Tooltip title="Xem chi tiết">
              <FaArrowRightToBracket
                onClick={() => navigate(`${record.buildingId}`)}
                size={19}
              />
            </Tooltip>
          </Access>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].DELETE_BUILDING}
            hideChildren={true}
          >
            <DeleteBuildings buildingId={record.buildingId} />
          </Access>
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered={false}
      columns={columns}
      rowKey={(record: IBuilding) => record.buildingId}
      pagination={tableParams.pagination}
      dataSource={buildingPage?.content || []}
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

export default BuildingCompanyTable;
