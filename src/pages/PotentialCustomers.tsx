import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import Access from "../features/auth/Access";
import PotentailCustomersTable from "../features/potential-customer/PotentialCustomersTable";
import SearchPotentialCustomer from "../features/potential-customer/SearchPotentailCustomer";
import {
  PaginationParams,
  PotentialCustomerFilterCriteria,
  SortParams,
} from "../interfaces";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { customerService } from "../services/customer/customer-service";
import { useDynamicTitle } from "../utils";

const PotentialCusstomers: React.FC = () => {
  useDynamicTitle("Yêu cầu thuê - Cyber Real");
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

  const filter: PotentialCustomerFilterCriteria = {
    email: searchParams.get("email") || undefined,
    customerName: searchParams.get("customerName") || undefined,
    phoneNumber: searchParams.get("phoneNumber") || undefined,
    staffName: searchParams.get("staffName") || undefined,
    status: (searchParams.get("status") as any) || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["customers", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () =>
      customerService.getPotentialCustomers(pagination, filter, sort),
  });
  console.log("data", data);
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
              PERMISSIONS[Module.CUSTOMERS].GET_CUSTOMER_POTENTIAL_PAGINATION
            }
            hideChildren
          >
            <SearchPotentialCustomer />
          </Access>
        )}
      </div>

      <div className="card pb-1">
        <div
          className="mb-5 flex cursor-pointer items-center justify-between"
          onClick={() => setListOpen(!isListOpen)}
        >
          <h2 className="text-xl font-semibold">Danh sách yêu cầu thuê</h2>
        </div>

        <Access
          permission={
            PERMISSIONS[Module.CUSTOMERS].GET_CUSTOMER_POTENTIAL_PAGINATION
          }
          hideChildren
        >
          <PotentailCustomersTable
            potentialCustomerPage={data?.payload}
            isLoading={isLoading}
          />
        </Access>
      </div>
    </div>
  );
};

export default PotentialCusstomers;
