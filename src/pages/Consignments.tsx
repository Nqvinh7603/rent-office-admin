import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import Access from "../features/auth/Access";
import ConsignmentsTable from "../features/consignment/ConsignmentsTable";
import SearchConsignment from "../features/consignment/SearchConsignment";
import {
  ConsignmentFilterCriteria,
  PaginationParams,
  SortParams,
} from "../interfaces";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { consignmentService } from "../services/consignment/consignment-service";
import { useDynamicTitle } from "../utils";

const Consignments: React.FC = () => {
  useDynamicTitle("Yêu cầu ký gửi - Cyber Real");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isListOpen, setListOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const pagination: PaginationParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };
  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const filter: ConsignmentFilterCriteria = {
    email: searchParams.get("email") || undefined,
    customerName: searchParams.get("customerName") || undefined,
    phoneNumber: searchParams.get("phoneNumber") || undefined,
    buildingType: searchParams.get("buildingType") || undefined,
    district: searchParams.get("district") || undefined,
    city: searchParams.get("city") || undefined,
    ward: searchParams.get("ward") || undefined,
    street: searchParams.get("street") || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    staffName: searchParams.get("staffName") || undefined,
    status: (searchParams.get("status") as any) || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["consignments", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => consignmentService.getConsignments(pagination, filter, sort),
  });

  return (
    <div className="space-y-2">
      <div className="card pb-1">
        <div
          className="mb-5 flex cursor-pointer items-center justify-between"
          onClick={() => setSearchOpen(!isSearchOpen)}
        >
          <h2 className="text-xl font-semibold">Tìm kiếm</h2>
          {isSearchOpen ? <DownOutlined /> : <RightOutlined />}
        </div>
        {isSearchOpen && (
          <Access
            permission={
              PERMISSIONS[Module.CONSIGNMENTS].GET_CONSIGNMENT_PAGINATION
            }
            hideChildren
          >
            <SearchConsignment />
          </Access>
        )}
      </div>

      <div className="card pb-1">
        <div
          className="mb-5 flex cursor-pointer items-center justify-between"
          onClick={() => setListOpen(!isListOpen)}
        >
          <h2 className="text-xl font-semibold">Danh sách ký gửi</h2>
        </div>

        <Access
          permission={
            PERMISSIONS[Module.CONSIGNMENTS].GET_CONSIGNMENT_PAGINATION
          }
          hideChildren
        >
          <ConsignmentsTable
            consignmentPage={data?.payload}
            isLoading={isLoading}
          />
        </Access>
      </div>
    </div>
  );
};

export default Consignments;
