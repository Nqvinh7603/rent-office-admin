import { useQuery } from "@tanstack/react-query";
import { Badge, Calendar, CalendarProps, Tooltip } from "antd";
import { BadgeProps } from "antd/lib";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { ImCalendar } from "react-icons/im";
import { LuUsers } from "react-icons/lu";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router";
import Loading from "../common/components/Loading";
import Access from "../features/auth/Access";
import { IAppointmentBuilding } from "../interfaces/appointment";
import { PERMISSIONS } from "../interfaces/common/constants";
import { AppointmentBuildingStatus, Module } from "../interfaces/common/enums";
import { appointmentService } from "../services/appointment/appointment-service";
import { useDynamicTitle } from "../utils";
const Home: React.FC = () => {
  useDynamicTitle("Trang chủ - Cyber Real");
  const [searchParams, setSearchParams] = useSearchParams();

  //   const handleDateChange = (
  //     startDate: string | null,
  //     endDate: string | null,
  //     type: string | null,
  //   ) => {
  //     if (startDate) {
  //       searchParams.set("startDate", startDate);
  //     } else {
  //       searchParams.delete("startDate");
  //     }

  //     if (endDate) {
  //       searchParams.set("endDate", endDate);
  //     } else {
  //       searchParams.delete("endDate");
  //     }

  //     if (type) {
  //       searchParams.set("type", type);
  //     } else {
  //       searchParams.delete("type");
  //     }

  //     setSearchParams(searchParams);
  //   };

  const [appointments, setAppointments] = useState<
    Map<string, IAppointmentBuilding[]>
  >(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await appointmentService.getAppointmentCalendar();
      return new Map(Object.entries(response.payload || {}));
    },
  });

  useEffect(() => {
    if (data) {
      setAppointments(data);
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  const getListData = (value: Dayjs) => {
    const dateKey = value.format("YYYY-MM-DD");

    const appointmentList: IAppointmentBuilding[] = [];
    appointments.forEach((value, key) => {
      if (key.startsWith(dateKey)) {
        appointmentList.push(...value);
      }
    });

    if (appointmentList.length === 0) {
      return [];
    }
    const pendingAppointments = appointmentList.filter((appointment) => {
      const histories = appointment.appointmentBuildingStatusHistories;
      const lastHistory = histories[histories.length - 1];
      return lastHistory.status === AppointmentBuildingStatus.PENDING;
    });

    if (pendingAppointments.length === 0) {
      return [];
    }

    const formattedAppointments = pendingAppointments
      .slice(0, 2)
      .map((appointment) => {
        const visitTime = appointment.visitTime.split("T")[1];
        return {
          type: "success",
          content: (
            <span style={{ fontSize: "0.90em" }}>
              <strong>{appointment.building.buildingName}</strong> - {visitTime}
            </span>
          ),
        };
      });
    if (pendingAppointments.length > 2) {
      formattedAppointments.push({
        type: "...",
        content: (
          <span style={{ fontSize: "0.85em" }}>
            +{pendingAppointments.length - 2} cuộc hẹn khác
          </span>
        ),
      });
    }

    return formattedAppointments;
  };

  const getMonthData = (value: Dayjs) => {
    const monthKey = value.format("YYYY-MM");

    const appointmentList: IAppointmentBuilding[] = [];
    appointments.forEach((value, key) => {
      if (key.startsWith(monthKey)) {
        appointmentList.push(...value);
      }
    });

    return appointmentList.length > 0
      ? [{ type: "success", content: `${appointmentList.length} cuộc hẹn` }]
      : [];
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const listData = getMonthData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={item.content}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const handleDateSelect = (date: Dayjs) => {
    const selectedDateKey = date.format("YYYY-MM-DD");
    const hasAppointments = Array.from(appointments.keys()).some((key) =>
      key.startsWith(selectedDateKey),
    );

    if (hasAppointments) {
      searchParams.set("startDate", date.format("YYYY-MM-DD"));
      searchParams.set("type", "date");
      setSearchParams(searchParams);
      navigate(
        `/appointments?startDate=${date.format("YYYY-MM-DD")}&type=date`,
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="px-4 py-4">
        {/* Thống kê tổng quan */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <Access
            permission={PERMISSIONS[Module.CUSTOMERS].CUSTOMER_STATISTIC}
            hideChildren={true}
          >
            <div className="card">
              <div className="card-body flex items-center justify-between">
                <LuUsers size={40} />
                <div>
                  <h3 className="card-title text-xl font-semibold">
                    Khách hàng
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thống kê và phân đoạn khách hàng
                  </p>
                  {/* <p className="text-2xl font-bold">120</p> */}
                </div>
                <Tooltip title="Xem chi tiết">
                  <FaArrowRightToBracket
                    onClick={() => navigate("/dashboard-customer")}
                    size={19}
                    className="cursor-pointer"
                  />
                </Tooltip>
              </div>
            </div>
          </Access>
          <Access
            permission={PERMISSIONS[Module.APPOINTMENTS].STATISTIC_APPOINTMENT}
            hideChildren={true}
          >
            <div className="card">
              <div className="card-body flex items-center justify-between">
                <ImCalendar size={34} />
                <div>
                  <h3 className="card-title text-xl font-semibold">Cuộc hẹn</h3>
                  <p className="text-sm text-gray-500">
                    Thống kê và phân tích cuộc hẹn
                  </p>
                  {/* <p className="text-2xl font-bold">45</p> */}
                </div>
                <Tooltip title="Xem chi tiết">
                  <FaArrowRightToBracket
                    onClick={() => navigate("/dashboard-appointment")}
                    size={19}
                    className="cursor-pointer"
                  />
                </Tooltip>
              </div>
            </div>
          </Access>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].STATISTICS_BUILDING}
            hideChildren={true}
          >
            <div className="card">
              <div className="card-body flex items-center justify-between">
                <PiBuildingOfficeLight size={40} />
                <div>
                  <h3 className="card-title text-xl font-semibold">Tài sản</h3>
                  <p className="text-sm text-gray-500">
                    Thống kê và phân tích tài sản
                  </p>
                  {/* <p className="text-2xl font-bold">75</p> */}
                </div>
                <Tooltip title="Xem chi tiết">
                  <FaArrowRightToBracket
                    onClick={() => navigate("/dashboard-building")}
                    size={19}
                    className="cursor-pointer"
                  />
                </Tooltip>
              </div>
            </div>
          </Access>
        </div>
        <div className="card">
          <Access
            permission={
              PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENT_CALENDAR
            }
            hideChildren={true}
          >
            <h3 className="text-xl font-semibold">Lịch hẹn</h3>
            <Calendar
              cellRender={cellRender}
              onSelect={handleDateSelect}
              fullscreen
            />
          </Access>
        </div>
      </div>
    </>
  );
};

export default Home;
