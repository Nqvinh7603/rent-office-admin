import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import React from "react";
import { useSearchParams } from "react-router";
import FilterTimeWithoutDate from "../common/components/FilterTimeWithOutDate";
import AppointmentsTable from "../features/appointment/AppointmentsTable";
import Access from "../features/auth/Access";
import { PaginationParams, SortParams } from "../interfaces";
import { AppointmentFilterCriteria } from "../interfaces/appointment";
import { PERMISSIONS } from "../interfaces/common/constants";
import { AppointmentBuildingStatus, Module } from "../interfaces/common/enums";
import { appointmentService } from "../services/appointment/appointment-service";
import { customerService } from "../services/customer/customer-service";
import { useDynamicTitle } from "../utils";

const Appointments: React.FC = () => {
  useDynamicTitle("Quản lý cuộc hẹn - DaViKa Airways");
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination: PaginationParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };

  const handleDateChange = (
    startDate: string | null,
    endDate: string | null,
    type: string | null,
  ) => {
    if (startDate) {
      searchParams.set("startDate", startDate);
    } else {
      searchParams.delete("startDate");
    }

    if (endDate) {
      searchParams.set("endDate", endDate);
    } else {
      searchParams.delete("endDate");
    }

    if (type) {
      searchParams.set("type", type);
    } else {
      searchParams.delete("type");
    }

    setSearchParams(searchParams);
  };

  const { data: customersData, isLoading: isCustomersLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getAllCustomers,
  });
  const customerOptions = customersData?.payload?.map((role) => ({
    value: role.email,
    label: role.email,
  }));

  const handleCustomerChange = (email: string | undefined) => {
    if (email) {
      searchParams.set("email", email);
    } else {
      searchParams.delete("email");
    }
    setSearchParams(searchParams); // Cập nhật URL và kích hoạt lại `useQuery`
  };

  const filter: AppointmentFilterCriteria = {
    status:
      (searchParams.get("status") as AppointmentBuildingStatus) || undefined,
    type: searchParams.get("type") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    email: searchParams.get("email") || undefined,
  };

  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["appointments", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => appointmentService.getAppointments(pagination, filter, sort),
  });

  return (
    <Access
      permission={PERMISSIONS[Module.APPOINTMENTS].GET_APPOINTMENTS_PAGINATION}
    >
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách cuộc hẹn</h2>
          <div className="flex items-center gap-4">
            <Select
              allowClear
              showSearch
              placeholder="Nhập email khách hàng"
              options={customerOptions}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase()) ??
                false
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={searchParams.get("email") || undefined} // Map email from URL to Select
              onChange={handleCustomerChange}
            />
            <FilterTimeWithoutDate onDateChange={handleDateChange} />
          </div>
        </div>

        <AppointmentsTable
          appointmentPage={data?.payload}
          isLoading={isLoading}
        />
      </div>
    </Access>
  );
};

export default Appointments;
