import { Input } from "antd";
import Access from "../features/auth/Access";
import { PERMISSIONS } from "../interfaces/common/constants";

import { useQuery } from "@tanstack/react-query";
import { SearchProps } from "antd/es/input";
import { useSearchParams } from "react-router";
import AddUser from "../features/auth/users/AddUser";
import UsersTable from "../features/auth/users/UsersTable";
import {
  PaginationParams,
  SortParams,
  UserFilterCriteria,
} from "../interfaces";
import { Module } from "../interfaces/common/enums";
import { userService } from "../services";
import { useDynamicTitle } from "../utils";

const Users: React.FC = () => {
  useDynamicTitle("Quản lý người dùng - DaViKa Airways");
  const [searchParams, setSearchParams] = useSearchParams();

  const pagination: PaginationParams = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
  };

  const filter: UserFilterCriteria = {
    query: searchParams.get("query") || undefined,

    active:
      searchParams.get("active") === "true"
        ? true
        : searchParams.get("active") === "false"
          ? false
          : undefined,
  };

  const sort: SortParams = {
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "",
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users", pagination, filter, sort].filter((key) => {
      if (typeof key === "string") {
        return key !== "";
      } else if (key instanceof Object) {
        return Object.values(key).some(
          (value) => value !== undefined && value !== "",
        );
      }
    }),
    queryFn: () => userService.getUsers(pagination, filter, sort),
  });
  const handleSearch: SearchProps["onSearch"] = (value) => {
    if (value) {
      searchParams.set("query", value);
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
  };
  return (
    <Access permission={PERMISSIONS[Module.USERS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Danh sách người dùng</h2>

          <div className="w-[60%]">
            <div className="flex gap-3">
              <Input.Search
                placeholder="Nhập thông tin của người dùng để tìm kiếm..."
                enterButton
                allowClear
                onSearch={handleSearch}
              />
            </div>
          </div>

          <Access permission={PERMISSIONS[Module.USERS].CREATE} hideChildren>
            <AddUser />
          </Access>
        </div>
        <UsersTable userPage={data?.payload} isLoading={isLoading} />
      </div>
    </Access>
  );
};

export default Users;
