import Access from "../features/auth/Access";
import ProfileDetail from "../features/profile/ProfileDetail";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";
const Profiles: React.FC = () => {
  useDynamicTitle("Chỉnh sửa hồ sơ - Cyber Real");

  return (
    <div className="card">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chỉnh sửa hồ sơ cá nhân</h2>
      </div>
      <Access permission={PERMISSIONS[Module.USERS].UPDATE} hideChildren>
        <ProfileDetail />
      </Access>
    </div>
  );
};

export default Profiles;
