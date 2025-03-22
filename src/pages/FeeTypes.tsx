import Access from "../features/auth/Access";
import AddFeeType from "../features/building/fee-types/AddFeeType";
import FeeTypesTable from "../features/building/fee-types/FeeTypesTable";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";

const FeeTypes: React.FC = () => {
  useDynamicTitle("Quản lý loại phí toà nhà - Cyber Real");

  return (
    <Access permission={PERMISSIONS[Module.FEES].GET_FEE_TYPES_PAGINATION}>
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Loại phí</h2>
          <Access
            permission={PERMISSIONS[Module.FEES].CREATE_FEE_TYPES}
            hideChildren
          >
            <AddFeeType />
          </Access>
        </div>
        <FeeTypesTable />
      </div>
    </Access>
  );
};

export default FeeTypes;
