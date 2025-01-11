import Access from "../features/auth/Access";
import AddRole from "../features/auth/roles/AddRole";
import RolesTable from "../features/auth/roles/RolesTable";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";

const Roles: React.FC = () => {
  useDynamicTitle("Quản lý vai trò - Cyber Real");

  return (
    <Access permission={PERMISSIONS[Module.ROLES].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vai trò</h2>
          <Access permission={PERMISSIONS[Module.ROLES].CREATE} hideChildren>
            <AddRole />
          </Access>
        </div>
        <RolesTable />
      </div>
    </Access>
  );
};

export default Roles;
