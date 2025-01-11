import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import Access from "../features/auth/Access";

import { useDynamicTitle } from "../utils";
import AddPermission from "../features/auth/permissions/AddPermission";
import PermissionTable from "../features/auth/permissions/PermissionsTable";

const Permissions: React.FC = () => {
  useDynamicTitle("Quản lý quyền hạn - Cyber Real");

  return (
    <Access permission={PERMISSIONS[Module.PERMISSIONS].GET_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quyền hạn</h2>
          <Access
            permission={PERMISSIONS[Module.PERMISSIONS].CREATE}
            hideChildren
          >
            <AddPermission />
          </Access>
        </div>
        <PermissionTable />
      </div>
    </Access>
  );
};

export default Permissions;
