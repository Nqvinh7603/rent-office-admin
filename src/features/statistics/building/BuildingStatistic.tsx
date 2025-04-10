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
import { buildingService } from "../../../services/building/building-service";
import BuildingStatisticBreadcrumb from "./Breadcrumb/BuildingStatisticBreadcrumb";
interface BuildingStatisticProps {}
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

interface Top10Building {
  [key: string]: number; // key là tên tòa nhà, value là số lượng cuộc hẹn
}

interface Top10Data {
  top10Buildings: Top10Building[];
}

const ORIENTATION_COLOR = {
  east: "#FF8C00",
  west: "#008000",
  south: "#0000FF",
  north: "#FFD700",
  southeast: "#FF4500",
  northeast: "#808080",
  southwest: "#FF69B4",
  northwest: "#8A2BE2",
  undetermined: "#A9A9A9",
};

const ORIENTATION_LABELS = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Bắc",
  "Đông Nam",
  "Tây Bắc",
  "Tây Nam",
  "Chưa xác định",
];

const STATUS_COLOR = {
  available: "#FF8C00",
  reviewing: "#008000",
};

const STATUS_LABELS = ["Đang xét duyệt", "Sẵn sàng cho thuê"];

const BuildingStatistic: React.FC<BuildingStatisticProps> = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterOrientation = {
    startDate:
      searchParams.get("pieStartDateOrientation") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("pieEndDateOrientation") || undefined,
    type: searchParams.get("pieTypeOrientation") || undefined,
  } as Record<string, string>;

  const filterStatus = {
    startDate:
      searchParams.get("pieStartDateStatus") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("pieEndDateStatus") || undefined,
    type: searchParams.get("pieTypeStatus") || undefined,
  } as Record<string, string>;

  const filterTop10 = {
    startDate:
      searchParams.get("barStartDateTop10") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("barEndDateTop10") || undefined,
    type: searchParams.get("barTypeStatusTop10") || undefined,
  } as Record<string, string>;

  const { data: top10Data } = useQuery({
    queryKey: ["buildings", "statistics-top10", filterTop10],
    queryFn: () => buildingService.getBuildingStatistic(filterTop10),
    select: (data) => data.payload,
  });

  const { data: orientationData } = useQuery({
    queryKey: ["buildings", "statistics-orientation", filterOrientation],
    queryFn: () => buildingService.getBuildingStatistic(filterOrientation),
    select: (data) => data.payload,
  });

  const { data: statusData } = useQuery({
    queryKey: ["buildings", "statistics-status", filterStatus],
    queryFn: () => buildingService.getBuildingStatistic(filterStatus),
    select: (data) => data.payload,
  });

  const { data: totalDataBuilding } = useQuery({
    queryKey: ["buildings", "statistics", "total"],
    queryFn: () => buildingService.getBuildingStatistic({}),
    select: (data) => data.payload,
  });

  const generateBarChartData = () => {
    const labels = Array.isArray(top10Data?.top10Buildings)
      ? top10Data?.top10Buildings.map((building: Top10Building) => {
          return Object.keys(building)[0];
        })
      : [];

    const data = Array.isArray(top10Data?.top10Buildings)
      ? top10Data?.top10Buildings.map((building: Top10Building) => {
          return Object.values(building)[0];
        })
      : [];

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

  const barData = generateBarChartData(); // Gọi hàm để lấy dữ liệu cho biểu đồ

  const totalBuilding = totalDataBuilding?.totalBuilding || 0;
  const totalBuildingType = totalDataBuilding?.totalBuildingType || 0;
  const totalBuildingLevel = totalDataBuilding?.totalBuildingLevel || 0;

  const isDataOrientationEmpty =
    orientationData &&
    Number(orientationData.north) === 0 &&
    Number(orientationData.south) === 0 &&
    Number(orientationData.east) === 0 &&
    Number(orientationData.west) === 0 &&
    Number(orientationData.northeast) === 0 &&
    Number(orientationData.northwest) === 0 &&
    Number(orientationData.southeast) === 0 &&
    Number(orientationData.southwest) === 0 &&
    Number(orientationData.undetermined) === 0;

  const isDataStatusEmpty =
    statusData &&
    Number(statusData.reviewing) === 0 &&
    Number(statusData.available) === 0;

  const handlePieChartFilterChangeOrientation = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("pieStartDateOrientation", startDate);
    } else {
      searchParams.delete("pieStartDateOrientation");
    }

    if (endDate) {
      searchParams.set("pieEndDateOrientation", endDate);
    } else {
      searchParams.delete("pieEndDateOrientation");
    }

    if (type) {
      searchParams.set("pieTypeOrientation", type);
    } else {
      searchParams.delete("pieTypeOrientation");
    }

    setSearchParams(searchParams);
  };

  const handleBarChartFilterChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("barStartDateTop10", startDate);
    } else {
      searchParams.delete("barStartDateTop10");
    }

    if (endDate) {
      searchParams.set("barEndDateTop10", endDate);
    } else {
      searchParams.delete("barEndDateTop10");
    }

    if (type) {
      searchParams.set("barTypeTop10", type);
    } else {
      searchParams.delete("barTypeTop10");
    }

    setSearchParams(searchParams);
  };
  const handlePieChartFilterChangeStatus = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("pieStartDateStatus", startDate);
    } else {
      searchParams.delete("pieStartDateStatus");
    }

    if (endDate) {
      searchParams.set("pieEndDateStatus", endDate);
    } else {
      searchParams.delete("pieEndDateStatus");
    }

    if (type) {
      searchParams.set("pieTypeStatus", type);
    } else {
      searchParams.delete("pieTypeStatus");
    }

    setSearchParams(searchParams);
  };

  const pieDataOrientation = {
    labels: ORIENTATION_LABELS,
    datasets: [
      {
        data: orientationData
          ? [
              orientationData.north || 0,
              orientationData.south || 0,
              orientationData.east || 0,
              orientationData.west || 0,
              orientationData.northeast || 0,
              orientationData.northwest || 0,
              orientationData.southeast || 0,
              orientationData.southwest || 0,
              orientationData.undetermined || 0,
            ]
          : [0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: Object.values(ORIENTATION_COLOR),
        hoverBackgroundColor: Object.values(ORIENTATION_COLOR),
        borderWidth: 0,
        borderColor: "transparent",
      },
    ],
  };

  const pieDataStatus = {
    labels: STATUS_LABELS,
    datasets: [
      {
        data: statusData
          ? [statusData.reviewing || 0, statusData.available || 0]
          : [0, 0],
        backgroundColor: Object.values(STATUS_COLOR),
        hoverBackgroundColor: Object.values(STATUS_COLOR),
        borderWidth: 0,
        borderColor: "transparent",
      },
    ],
  };

  const pieOptionsOrientation = {
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

  const pieOptionsStatus = {
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
          text: "Toà nhà",
        },
        // ticks: {
        //   autoSkip: true, // Đảm bảo không có quá nhiều nhãn hiển thị
        //   maxRotation: 45, // Xoay nhãn cho dễ đọc
        //   minRotation: 0,
        // },
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
          <BuildingStatisticBreadcrumb />
        </div>
      </div>
      {/* Cards nhỏ nằm ngang */}
      <div className="mb-4 flex justify-between gap-4">
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Tổng số tài sản
          </h4>
          <p className="text-3xl font-bold">{totalBuilding}</p>
        </div>
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Tổng loại tài sản
          </h4>
          <p className="text-3xl font-bold">{totalBuildingType}</p>
        </div>
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Tổng cấp độ tài sản
          </h4>
          <p className="text-3xl font-bold">{totalBuildingLevel}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="card mb-4 flex-1">
          <div className="card-body">
            <div className="mb-4 flex justify-between">
              <h3 className="card-title text-xl font-semibold">
                Thống kê tài sản theo hướng
              </h3>
            </div>
            <div className="mb-10 flex justify-end">
              <FilterTimeWithoutDate
                onDateChange={handlePieChartFilterChangeOrientation}
              />
            </div>
            <div style={{ maxWidth: "350px", margin: "0 auto" }}>
              {isDataOrientationEmpty ? (
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
                <Doughnut
                  data={pieDataOrientation}
                  options={pieOptionsOrientation}
                />
              )}
            </div>
          </div>
        </div>
        <div className="card mb-4 flex-1">
          <div className="card-body">
            <div className="mb-4 flex justify-between">
              <h3 className="card-title text-xl font-semibold">
                Thống kê trạng thái tài sản
              </h3>
            </div>
            <div className="mb-10 flex justify-end">
              <FilterTimeWithoutDate
                onDateChange={handlePieChartFilterChangeStatus}
              />
            </div>
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              {isDataStatusEmpty ? (
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
                <Doughnut data={pieDataStatus} options={pieOptionsStatus} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card mb-4 flex-1">
        <div className="card-body">
          <div className="mb-4 flex justify-between">
            <h3 className="card-title text-xl font-semibold">
              Top 10 toà nhà được khách hàng đi xem nhiều nhất
            </h3>
          </div>
          <div className="mb-6 flex justify-end">
            <FilterTimeWithoutDate onDateChange={handleBarChartFilterChange} />
          </div>
          <div style={{ height: "400px", margin: "0 auto" }}>
            {Object.keys(top10Data || {}).length === 0 ? (
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
  );
};

export default BuildingStatistic;
