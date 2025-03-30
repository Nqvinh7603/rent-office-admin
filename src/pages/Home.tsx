import { useQuery } from "@tanstack/react-query";
import { Badge, Calendar, CalendarProps } from "antd";
import { BadgeProps } from "antd/lib";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
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
    const dateKey = value.format("YYYY_MM_DD");
    console.log("Date key:", dateKey);

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
    const monthKey = value.format("YYYY_MM");
    console.log("Month key:", monthKey);

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
    const selectedDateKey = date.format("YYYY_MM_DD");
    const hasAppointments = Array.from(appointments.keys()).some((key) =>
      key.startsWith(selectedDateKey),
    );

    if (hasAppointments) {
      // Truyền tham số vào URL
      searchParams.set("startDate", date.format("YYYY-MM-DD"));

      searchParams.set("type", "date");
      setSearchParams(searchParams);

      // Điều hướng đến trang danh sách cuộc hẹn
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
      {/* <div className="mx-2 mt-3 rounded-lg bg-white px-2 py-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-semibold">Biểu đồ</h2>
          <FilterTimeWithoutDate onDateChange={handleDateChange} />
        </div>
        <div>
          <SalesStatsChart />
        </div>
        <div className="flex items-center">
          <div className="w-[40%]">
            <PassengerStatsChart />
          </div>
          <div className="w-[60%]">
            <TopDestinationsChart />
          </div>
        </div>
      </div> */}
      <div className="px-4 py-4">
        {/* Thống kê tổng quan */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tổng số cuộc hẹn</h3>
              <p className="text-2xl font-bold">120</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Cuộc hẹn đang chờ</h3>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Cuộc hẹn đã hoàn thành</h3>
              <p className="text-2xl font-bold">75</p>
            </div>
          </div>
        </div>
        <div className="card">
          <Access
            permission={
              PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENT_CALENDAR
            }
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
