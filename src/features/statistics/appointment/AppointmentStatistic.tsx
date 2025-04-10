import { useQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "antd";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import { Bar, Doughnut } from "react-chartjs-2";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";
import FilterTimeWithoutDate from "../../../common/components/FilterTimeWithOutDate";
import { appointmentService } from "../../../services/appointment/appointment-service";
import AppointmentStatisticBreadcrumb from "./Breadcrumb/AppointmentStatisticBreadcrumb";
interface AppointmentStatisticProps {}
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  TimeScale,
);
ChartJS.register(ChartDataLabels);
const APPOINTMENT_COLOR = {
  pending: "#FF8C00",
  confirmed: "#008000",
  viewed: "#0000FF",
  successful: "#FFD700",
  unsucessful: "#FF4500",
  cancelled: "#808080",
};
const APPOINTMENT_LABELS = [
  "Đang chờ",
  "Đã xác nhận",
  "Đã xem",
  "Thành công",
  "Không thành công",
  "Đã hủy",
];
const AppointmentStatistic: React.FC<AppointmentStatisticProps> = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStatus = {
    startDate:
      searchParams.get("pieStartDate") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("pieEndDate") || undefined,
    type: searchParams.get("pieType") || undefined,
  } as Record<string, string>;

  const filterBar = {
    startDate:
      searchParams.get("barStartDate") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("barEndDate") || undefined,
    type: searchParams.get("barType") || "month",
  } as Record<string, string>;

  const { data: appointmentStatsData } = useQuery({
    queryKey: ["appointment", "statistics", filterStatus],
    queryFn: () => appointmentService.getAppointmentStatistic(filterStatus),
    select: (data) => data.payload,
  });

  const { data: barChartData } = useQuery({
    queryKey: ["appointment", "statistics-time", filterBar],
    queryFn: () => appointmentService.getAppointmentsByTime(filterBar),
    select: (data) => data.payload,
  });

  const generateBarChartData = () => {
    const labels = Object.keys(barChartData || {}).sort(); // Sắp xếp theo thời gian

    const data = labels.map((key) => barChartData?.[key] || 0);

    return {
      labels,
      datasets: [
        {
          label: "Số lượng cuộc hẹn",
          data,
          backgroundColor: "#36a2eb",
          borderColor: "#36a2eb",
          borderWidth: 1,
        },
      ],
    };
  };

  const barData = generateBarChartData();

  const isDataEmpty =
    appointmentStatsData &&
    Number(appointmentStatsData.pending) === 0 &&
    Number(appointmentStatsData.confirmed) === 0 &&
    Number(appointmentStatsData.viewed) === 0 &&
    Number(appointmentStatsData.successful) === 0 &&
    Number(appointmentStatsData.unsucessful) === 0 &&
    Number(appointmentStatsData.cancelled) === 0;

  const handleBarChartFilterChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("barStartDate", startDate);
    } else {
      searchParams.delete("barStartDate");
    }

    if (endDate) {
      searchParams.set("barEndDate", endDate);
    } else {
      searchParams.delete("barEndDate");
    }

    if (type) {
      searchParams.set("barType", type);
    } else {
      searchParams.delete("barType");
    }

    setSearchParams(searchParams);
  };

  const handlePieChartFilterChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("pieStartDate", startDate);
    } else {
      searchParams.delete("pieStartDate");
    }

    if (endDate) {
      searchParams.set("pieEndDate", endDate);
    } else {
      searchParams.delete("pieEndDate");
    }

    if (type) {
      searchParams.set("pieType", type);
    } else {
      searchParams.delete("pieType");
    }

    setSearchParams(searchParams);
  };

  const pieDataRent = {
    labels: APPOINTMENT_LABELS,
    datasets: [
      {
        data: appointmentStatsData
          ? [
              appointmentStatsData.pending || 0,
              appointmentStatsData.confirmed || 0,
              appointmentStatsData.viewed || 0,
              appointmentStatsData.successful || 0,
              appointmentStatsData.unsuccessful || 0,
              appointmentStatsData.cancelled || 0,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: Object.values(APPOINTMENT_COLOR),
        hoverBackgroundColor: Object.values(APPOINTMENT_COLOR),
        borderWidth: 0,
        borderColor: "transparent",
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce(
              (sum: number, val: number) => sum + val,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        font: {
          size: 13,
        },
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce(
            (sum: number, val: number) => sum + val,
            0,
          );
          const percentage = ((value / total) * 100).toFixed(2);
          return parseFloat(percentage) > 0 ? `${percentage}%` : null;
        },
      },
      elements: {
        arc: {
          borderWidth: 0,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
      datalabels: {
        display: false, // Tắt hiển thị số liệu trên các cột
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
        ticks: {
          autoSkip: true, // Đảm bảo không có quá nhiều nhãn hiển thị
          maxRotation: 45, // Xoay nhãn cho dễ đọc
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng cuộc hẹn",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center">
        <Tooltip title="Quay lại">
          <Button icon={<GoArrowLeft />} onClick={() => navigate(-1)} />
        </Tooltip>
        <div className="ml-2">
          <AppointmentStatisticBreadcrumb />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="card flex-2 mb-4">
          <div className="card-body">
            <div className="mb-4 flex justify-between">
              <h3 className="card-title text-xl font-semibold">
                Thống kê trạng thái cuộc hẹn
              </h3>
            </div>
            <div className="mb-10 mt-10 flex justify-end">
              <FilterTimeWithoutDate
                onDateChange={handlePieChartFilterChange}
              />
            </div>
            <div style={{ maxWidth: "350px", margin: "0 auto" }}>
              {isDataEmpty ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    color: "#aaa",
                  }}
                >
                  Không có dữ liệu
                </div>
              ) : (
                <Doughnut data={pieDataRent} options={pieOptions} />
              )}
            </div>
          </div>
        </div>
        <div className="card mb-4 flex-1">
          <div className="card-body">
            <div className="mb-4 flex justify-between">
              <h3 className="card-title text-xl font-semibold">
                Thống kê số lượng cuộc hẹn
              </h3>
            </div>
            <div className="mb-6 flex justify-end">
              <FilterTimeWithoutDate
                onDateChange={handleBarChartFilterChange}
              />
            </div>
            <div style={{ height: "400px", margin: "0 auto" }}>
              {Object.keys(barChartData || {}).length === 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    color: "#aaa",
                  }}
                >
                  Không có dữ liệu
                </div>
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatistic;
