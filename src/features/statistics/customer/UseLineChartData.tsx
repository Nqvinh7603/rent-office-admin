import { useQuery } from "@tanstack/react-query";
import { customerService } from "../../../services/customer/customer-service";

const useLineChartData = (
  intervals: { startDate: string; endDate: string; label: string }[],
) => {
  // Tạo một mảng hooks cố định (số lượng hook không thay đổi)
  const queries = intervals.map((interval, index) => {
    const filter = {
      startDate: interval.startDate,
      endDate: interval.endDate,
    };

    return useQuery({
      queryKey: ["customer", "statistics", `interval-${index}`, filter],
      queryFn: () => customerService.getCustomerStatistic(filter),
      select: (data) => ({
        label: interval.label,
        potentialCustomers: data?.payload?.potentialCustomers || 0,
        consignmentCustomers: data?.payload?.consignmentCustomers || 0,
      }),
      enabled: !!interval.startDate && !!interval.endDate,
    });
  });

  return {
    data: queries
      .map((query) => query.data)
      .filter((data) => data !== undefined), // Lọc bỏ undefined
    isLoading: queries.some((query) => query.isLoading),
    isEmpty: queries.every(
      (query) =>
        query.data?.potentialCustomers === 0 &&
        query.data?.consignmentCustomers === 0,
    ),
  };
};
export default useLineChartData;
