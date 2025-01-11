import { Input } from "antd";
import Access from "../features/auth/Access";
import { PERMISSIONS } from "../interfaces/common/constants";

import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";
import UsersTable from "../features/auth/users/UsersTable";
import AddUser from "../features/auth/users/AddUser";

const Users: React.FC = () => {
  useDynamicTitle("Quản lý người dùng - DaViKa Airways");

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
              />
            </div>
          </div>

          <Access permission={PERMISSIONS[Module.USERS].CREATE} hideChildren>
            <AddUser />
          </Access>
        </div>
        <UsersTable />
      </div>
    </Access>
  );
};

export default Users;
