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
import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate, useSearchParams } from "react-router";
import FilterTimeWithoutDate from "../../../common/components/FilterTimeWithOutDate";
import { customerService } from "../../../services/customer/customer-service";
import CustomerStatisticBreadcrumb from "./Breadcrumb/CustomerStatisticBreadcrumb";

// Đăng ký các thành phần của Chart.js
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

// Định nghĩa màu sắc và nhãn
const RENT_STATUS_COLORS = {
  notContacted: "#3162ad",
  contacted: "#f5a623",
  dealInProgress: "#7ed321",
  dealDone: "#2196f3",
  canceled: "#d0021b",
};

const CONSIGNMENT_STATUS_COLORS = {
  pending: "#4caf50",
  confirmed: "#2196f3",
  cancelled: "#d0021b",
  incomplete: "#ffc107",
  additionalInfo: "#9c27b0",
};

const RENT_LABELS = [
  "Chưa liên hệ",
  "Đã liên hệ",
  "Đang xử lý",
  "Đã chốt thuê",
  "Không còn nhu cầu",
];

const CONSIGNMENT_LABELS = [
  "Chưa xác nhận",
  "Đã xác nhận",
  "Từ chối",
  "Thiếu thông tin",
  "Bổ sung thông tin",
];

const CustomerStatistic: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Bộ lọc cho khách hàng thuê (Pie Chart)
  const filterRent = {
    startDate:
      searchParams.get("pieStartDateRent") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("pieEndDateRent") || undefined,
    type: searchParams.get("pieTypeRent") || undefined,
  } as Record<string, string>;

  // Bộ lọc cho khách hàng ký gửi (Pie Chart)
  const filterConsignment = {
    startDate:
      searchParams.get("pieStartDateConsignment") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("pieEndDateConsignment") || undefined,
    type: searchParams.get("pieTypeConsignment") || undefined,
  } as Record<string, string>;

  // Dữ liệu cho khách hàng thuê (Pie Chart)
  const { data: customerStatsData } = useQuery({
    queryKey: ["customer", "statistics", filterRent],
    queryFn: () => customerService.getCustomerStatistic(filterRent),
    select: (data) => data.payload,
  });

  // Dữ liệu cho khách hàng ký gửi (Pie Chart)
  const { data: customerStatsDataConsignment } = useQuery({
    queryKey: ["customer", "statistics", filterConsignment],
    queryFn: () => customerService.getCustomerStatistic(filterConsignment),
    select: (data) => data.payload,
  });

  // Dữ liệu tổng (dùng cho thẻ thống kê)
  const { data: totalStatsData } = useQuery({
    queryKey: ["customer", "statistics", "total"],
    queryFn: () => customerService.getCustomerStatistic({}),
    select: (data) => data.payload,
  });

  const filterBar = {
    startDate:
      searchParams.get("barStartDate") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("barEndDate") || undefined,
    type: searchParams.get("barType") || "month",
  } as Record<string, string>;

  const { data: barChartData } = useQuery({
    queryKey: ["customers", "statistics-time", filterBar],
    queryFn: () => customerService.getCustomerStatisticByTime(filterBar),
    select: (data) => data.payload,
  });

  const filterLine = {
    startDate:
      searchParams.get("lineStartDate") ||
      dayjs().startOf("month").format("YYYY-MM"),
    endDate: searchParams.get("lineEndDate") || undefined,
    type: searchParams.get("lineType") || "month",
  } as Record<string, string>;

  const { data: lineChartDataPotential } = useQuery({
    queryKey: ["customers", "statistics-time-type-potential", filterLine],
    queryFn: () =>
      customerService.getCustomerStatisticByTimeAndTypePotential(filterLine),
    select: (data) => data.payload,
  });

  const { data: lineChartDataConsignment } = useQuery({
    queryKey: ["customers", "statistics-time-type-consignment", filterLine],
    queryFn: () =>
      customerService.getCustomerStatisticByTimeAndTypeConsignment(filterLine),
    select: (data) => data.payload,
  });

  const generateBarChartData = () => {
    const labels = Object.keys(barChartData || {}).sort(); // Sắp xếp theo thời gian

    const data = labels.map((key) => barChartData?.[key] || 0);

    return {
      labels,
      datasets: [
        {
          label: "Khách hàng",
          data,
          backgroundColor: "#fbc02d", // Darker yellow
          borderColor: "#fbc02d", // Darker yellow
          borderWidth: 1,
        },
      ],
    };
  };

  const barData = generateBarChartData();

  const generateLineChartData = () => {
    if (!lineChartDataPotential || !lineChartDataConsignment) {
      return { labels: [], datasets: [] };
    }

    // Lấy tất cả các mốc thời gian từ cả hai nhóm dữ liệu
    const labels = Array.from(
      new Set([
        ...Object.keys(lineChartDataPotential),
        ...Object.keys(lineChartDataConsignment),
      ]),
    ).sort(); // Sắp xếp theo thời gian

    // Dữ liệu cho nhóm khách hàng tiềm năng
    const potentialData = labels.map(
      (label) => lineChartDataPotential[label] || 0,
    );

    // Dữ liệu cho nhóm khách hàng ký gửi
    const consignmentData = labels.map(
      (label) => lineChartDataConsignment[label] || 0,
    );

    return {
      labels,
      datasets: [
        {
          label: "Khách hàng tiềm năng",
          data: potentialData,
          borderColor: "#36a2eb",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Khách hàng ký gửi",
          data: consignmentData,
          borderColor: "#ff6384",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  };

  const lineData = generateLineChartData();

  const totalCustomers = totalStatsData?.totalCustomers || 0;
  const consignmentCustomers = totalStatsData?.consignmentCustomers || 0;
  const potentialCustomers = totalStatsData?.potentialCustomers || 0;

  const isDataEmpty =
    customerStatsData &&
    Number(customerStatsData.notContactedRentCustomer) === 0 &&
    Number(customerStatsData.contactedRentCustomer) === 0 &&
    Number(customerStatsData.dealInProgressRentCustomer) === 0 &&
    Number(customerStatsData.dealDoneRentCustomer) === 0 &&
    Number(customerStatsData.canceledRentCustomer) === 0;

  const isDataEmptyConsignment =
    customerStatsDataConsignment &&
    Number(customerStatsDataConsignment.pendingConsignmentCustomer) === 0 &&
    Number(customerStatsDataConsignment.confirmedConsignmentCustomer) === 0 &&
    Number(customerStatsDataConsignment.cancelledConsignmentCustomer) === 0 &&
    Number(customerStatsDataConsignment.incompleteConsignmentCustomer) === 0 &&
    Number(customerStatsDataConsignment.additionalInfoConsignmentCustomer) ===
      0;

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

  const handleLineChartFilterChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("lineStartDate", startDate);
    } else {
      searchParams.delete("lineStartDate");
    }

    if (endDate) {
      searchParams.set("lineEndDate", endDate);
    } else {
      searchParams.delete("lineEndDate");
    }

    if (type) {
      searchParams.set("lineType", type);
    } else {
      searchParams.delete("lineType");
    }

    setSearchParams(searchParams);
  };

  // Hàm xử lý thay đổi bộ lọc cho Pie Chart (Khách hàng thuê)
  const handlePieChartFilterChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("pieStartDateRent", startDate);
    } else {
      searchParams.delete("pieStartDateRent");
    }

    if (endDate) {
      searchParams.set("pieEndDateRent", endDate);
    } else {
      searchParams.delete("pieEndDateRent");
    }

    if (type) {
      searchParams.set("pieTypeRent", type);
    } else {
      searchParams.delete("pieTypeRent");
    }

    setSearchParams(searchParams);
  };

  // Hàm xử lý thay đổi bộ lọc cho Pie Chart (Khách hàng ký gửi)
  const handlePieChartFilterChangeConsignment = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("pieStartDateConsignment", startDate);
    } else {
      searchParams.delete("pieStartDateConsignment");
    }

    if (endDate) {
      searchParams.set("pieEndDateConsignment", endDate);
    } else {
      searchParams.delete("pieEndDateConsignment");
    }

    if (type) {
      searchParams.set("pieTypeConsignment", type);
    } else {
      searchParams.delete("pieTypeConsignment");
    }

    setSearchParams(searchParams);
  };

  // Dữ liệu cho Pie Chart (Khách hàng thuê)
  const pieDataRent = {
    labels: RENT_LABELS,
    datasets: [
      {
        data: customerStatsData
          ? [
              customerStatsData.notContactedRentCustomer || 0,
              customerStatsData.contactedRentCustomer || 0,
              customerStatsData.dealInProgressRentCustomer || 0,
              customerStatsData.dealDoneRentCustomer || 0,
              customerStatsData.canceledRentCustomer || 0,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: Object.values(RENT_STATUS_COLORS),
        hoverBackgroundColor: Object.values(RENT_STATUS_COLORS),
        borderWidth: 0,
        borderColor: "transparent",
      },
    ],
  };

  // Dữ liệu cho Pie Chart (Khách hàng ký gửi)
  const pieDataConsignment = {
    labels: CONSIGNMENT_LABELS,
    datasets: [
      {
        data: customerStatsDataConsignment
          ? [
              customerStatsDataConsignment.pendingConsignmentCustomer || 0,
              customerStatsDataConsignment.confirmedConsignmentCustomer || 0,
              customerStatsDataConsignment.cancelledConsignmentCustomer || 0,
              customerStatsDataConsignment.incompleteConsignmentCustomer || 0,
              customerStatsDataConsignment.additionalInfoConsignmentCustomer ||
                0,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: Object.values(CONSIGNMENT_STATUS_COLORS),
        hoverBackgroundColor: Object.values(CONSIGNMENT_STATUS_COLORS),
        borderWidth: 0,
        borderColor: "transparent",
      },
    ],
  };

  // Cấu hình cho Pie Chart
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
        position: "top" as const,
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
          text: "Tổng số khách hàng",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
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
          text: "Số lượng khách hàng",
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
          <CustomerStatisticBreadcrumb />
        </div>
      </div>

      {/* Cards nhỏ nằm ngang */}
      <div className="mb-4 flex justify-between gap-4">
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Tổng khách hàng
          </h4>
          <p className="text-3xl font-bold">{totalCustomers}</p>
        </div>
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Khách hàng thuê
          </h4>
          <p className="text-3xl font-bold">{potentialCustomers}</p>
        </div>
        <div className="card flex-1 rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-lg font-semibold text-gray-400">
            Khách hàng ký gửi
          </h4>
          <p className="text-3xl font-bold">{consignmentCustomers}</p>
        </div>
      </div>

      {/* Biểu đồ Bánh */}
      <div className="flex gap-3">
        <div className="card mb-4 flex-1">
          <div className="card-body">
            <div className="mb-4 flex justify-between">
              <h3 className="card-title text-xl font-semibold">
                Thống kê trạng thái khách hàng thuê
              </h3>
            </div>
            <div className="mb-6 flex justify-end">
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
                Thống kê trạng thái khách hàng ký gửi
              </h3>
            </div>
            <div className="mb-6 flex justify-end">
              <FilterTimeWithoutDate
                onDateChange={handlePieChartFilterChangeConsignment}
              />
            </div>
            <div style={{ maxWidth: "350px", margin: "0 auto" }}>
              {isDataEmptyConsignment ? (
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
                <Doughnut data={pieDataConsignment} options={pieOptions} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ Đường (Bar Chart) */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-4 flex justify-between">
            <h3 className="card-title text-xl font-semibold">
              Biến động số lượng khách hàng
            </h3>
          </div>
          <div className="mb-6 flex justify-end">
            <FilterTimeWithoutDate onDateChange={handleBarChartFilterChange} />
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

      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-4 flex justify-between">
            <h3 className="card-title text-xl font-semibold">
              Biến động số lượng nhóm khách hàng
            </h3>
          </div>
          <div className="mb-6 flex justify-end">
            <FilterTimeWithoutDate onDateChange={handleLineChartFilterChange} />
          </div>
          <div style={{ height: "400px", margin: "0 auto" }}>
            {Object.keys(lineChartDataPotential || {}).length === 0 &&
            Object.keys(lineChartDataConsignment || {}).length === 0 ? (
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
              <Line data={lineData} options={lineOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatistic;
