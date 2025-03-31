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
import { Page } from "../../interfaces";
import {
  IAppointmentBuilding,
  IAppointmentBuildingStatusHistory,
} from "../../interfaces/appointment";
import {
  APPOINTMENT_BUILDING_STATUS_TRANSLATION,
  PERMISSIONS,
} from "../../interfaces/common/constants";
import {
  AppointmentBuildingStatus,
  Module,
} from "../../interfaces/common/enums";
import {
  colorAppointmentBuildingStatus,
  colorFilterIcon,
  colorSortDownIcon,
  colorSortUpIcon,
  formatTimestamp,
  getDefaultSortOrder,
  getSortDirection,
} from "../../utils";
import Access from "../auth/Access";
import DeleteAppointments from "./DeleteAppointment";

interface TableParams {
  pagination: TablePaginationConfig;
}

interface AppointmentTableProps {
  appointmentPage?: Page<IAppointmentBuilding>;
  isLoading: boolean;
}
const AppointmentsTable: React.FC<AppointmentTableProps> = ({
  appointmentPage,
  isLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableParams, setTableParams] = useState<TableParams>(() => ({
    pagination: {
      current: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      showSizeChanger: true,
      showTotal: (total) => `Tổng ${total} cuộc hẹn`,
    },
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (appointmentPage) {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: appointmentPage.meta?.total || 0,
          showTotal: (total) => `Tổng ${total} cuộc hẹn`,
        },
      }));
    }
  }, [appointmentPage]);

  const handleTableChange: TableProps<IAppointmentBuilding>["onChange"] = (
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

  //   const { data: rolesData, isLoading: isRolesLoading } = useQuery({
  //     queryKey: ["roles"],
  //     queryFn: roleService.getAllRoles,
  //   });
  //   const roleOptions = rolesData?.payload?.map((role) => ({
  //     value: role.roleId,
  //     text: role.roleName,
  //   }));
  const columns: TableProps<IAppointmentBuilding>["columns"] = [
    {
      title: "Khách hàng",
      key: "customer",
      dataIndex: ["appointment", "customer"],
      width: "5%",
      render: (_, record) => (
        <>
          <div style={{ fontWeight: "bold", fontSize: "15px" }}>
            {record.appointment.customer?.customerName || ""}
          </div>
          <div style={{ fontSize: "13px", color: "#777" }}>
            <Tooltip title="Click chuyển sang zalo">
              <a
                href={`https://zalo.me/${record.appointment.customer?.phoneNumber || ""}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.appointment.customer?.phoneNumber || ""}
              </a>
            </Tooltip>
          </div>
          <div style={{ fontSize: "13px", color: "#777" }}>
            <Tooltip title="Click chuyển sang gmail">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.appointment.customer?.email || ""}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {record.appointment.customer?.email || ""}
              </a>
            </Tooltip>
          </div>
        </>
      ),
    },
    {
      title: "Tòa nhà",
      key: "building",
      dataIndex: ["building", "buildingName"],
      width: "20%",
      render: (_, record) => (
        <>
          <div style={{ fontWeight: "bold", fontSize: "15px" }}>
            {record.building?.buildingName || ""}
          </div>
          <div style={{ fontSize: "13px", color: "#777" }}>
            {[
              record.building?.buildingNumber,
              record.building?.street,
              record.building?.ward,
              record.building?.district,
              record.building?.city,
            ]
              .filter(Boolean)
              .join(", ")}
          </div>
        </>
      ),
    },
    {
      title: "Thời gian hẹn",
      key: "visitTime",
      dataIndex: "visitTime",
      width: "8%",
      render: (visitTime: string) =>
        visitTime ? formatTimestamp(visitTime) : "",
      sorter: true,
      defaultSortOrder: getDefaultSortOrder(searchParams, "visitTime"),
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
      dataIndex: "appointmentBuildingStatusHistories",
      width: "5%",
      render: (histories: IAppointmentBuildingStatusHistory[]) => {
        const latestStatus = histories?.[histories.length - 1];
        return latestStatus ? (
          <Tag color={colorAppointmentBuildingStatus(latestStatus.status)}>
            {
              APPOINTMENT_BUILDING_STATUS_TRANSLATION[
                latestStatus.status as AppointmentBuildingStatus
              ]
            }
          </Tag>
        ) : null;
      },
      filters: Object.keys(APPOINTMENT_BUILDING_STATUS_TRANSLATION).map(
        (key) => ({
          text: APPOINTMENT_BUILDING_STATUS_TRANSLATION[
            key as AppointmentBuildingStatus
          ],
          value: key,
        }),
      ),
      defaultFilteredValue: searchParams.get("status")?.split(",") || null,
      filterIcon: (filtered) => (
        <FilterFilled style={{ color: colorFilterIcon(filtered) }} />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "5%",
      render: (record: IAppointmentBuilding) => (
        <Space
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          {/* <Access
            permission={
              PERMISSIONS[Module.BUILDINGS].GET_STAFFS_BY_BUILDING_ID &&
              PERMISSIONS[Module.BUILDINGS].ASSIGN_BUILDING_TO_STAFFS
            }
            hideChildren={true}
          >
            <AssignBuildingForStaff building={record} />
          </Access> */}
          <Access
            permission={
              PERMISSIONS[Module.APPOINTMENTS].DELETE_APPOINTMENT_CALENDAR
            }
          >
            <DeleteAppointments
              appointmentBuildingId={record.appointmentBuildingId}
            />
          </Access>
          <Access
            permission={
              PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENTS_CALENDAR_BY_ID
            }
            hideChildren={false}
          >
            <Tooltip title="Xem chi tiết">
              <FaArrowRightToBracket
                onClick={() => navigate(`${record.appointmentBuildingId}`)}
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
      rowKey={(record: IAppointmentBuilding) => record.appointmentBuildingId}
      pagination={tableParams.pagination}
      dataSource={appointmentPage?.content || []}
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

export default AppointmentsTable;
