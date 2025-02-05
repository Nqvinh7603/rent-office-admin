import Access from "../features/auth/Access";
import AddBuildingType from "../features/building/building-types/AddBuildingType";
import BuildingTypesTable from "../features/building/building-types/BuildingTypesTable";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";

const BuildingTypes: React.FC = () => {
  useDynamicTitle("Quản lý loại toà nhà - Cyber Real");

  return (
    <Access
      permission={PERMISSIONS[Module.BUILDINGS].GET_BUILDING_TYPE_PAGINATION}
    >
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Loại toà nhà</h2>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].CREATE_BUILDING_TYPE}
            hideChildren
          >
            <AddBuildingType />
          </Access>
        </div>
        <BuildingTypesTable />
      </div>
    </Access>
  );
};

export default BuildingTypes;
