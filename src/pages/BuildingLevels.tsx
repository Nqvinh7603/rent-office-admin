import Access from "../features/auth/Access";
import AddBuildingLevel from "../features/building/building-levels/AddBuildingLevel";
import BuildingLevelsTable from "../features/building/building-levels/BuildingLevelsTable";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";

const BuildingLevels: React.FC = () => {
  useDynamicTitle("Quản lý hạng toà nhà - Cyber Real");

  return (
    <Access
      permission={PERMISSIONS[Module.BUILDINGS].GET_BUILDING_LEVEL_PAGINATION}
    >
      <div className="card">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Hạng toà nhà</h2>
          <Access
            permission={PERMISSIONS[Module.BUILDINGS].CREATE_BUILDING_LEVEL}
            hideChildren
          >
            <AddBuildingLevel />
          </Access>
        </div>
        <BuildingLevelsTable />
      </div>
    </Access>
  );
};

export default BuildingLevels;
