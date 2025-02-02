import { DownOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import Access from "../features/auth/Access";
import ChangePassword from "../features/auth/profile/ChangePassword";
import ProfileDetail from "../features/auth/profile/ProfileDetail";
import { PERMISSIONS } from "../interfaces/common/constants";
import { Module } from "../interfaces/common/enums";
import { useDynamicTitle } from "../utils";

const Profiles: React.FC = () => {
  useDynamicTitle("Chỉnh sửa hồ sơ - Cyber Real");
  const [isProfileOpen, setProfileOpen] = useState(true);
  const [isPasswordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="card">
        <div
          className="mb-5 flex cursor-pointer items-center justify-between"
          onClick={() => setProfileOpen(!isProfileOpen)}
        >
          <h2 className="text-xl font-semibold">Chỉnh sửa tài khoản</h2>
          {isProfileOpen ? <DownOutlined /> : <RightOutlined />}
        </div>
        {isProfileOpen && (
          <Access permission={PERMISSIONS[Module.USERS].UPDATE} hideChildren>
            <ProfileDetail />
          </Access>
        )}
      </div>

      <div className="card">
        <div
          className="mb-5 flex cursor-pointer items-center justify-between"
          onClick={() => setPasswordOpen(!isPasswordOpen)}
        >
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
          {isPasswordOpen ? <DownOutlined /> : <RightOutlined />}
        </div>
        {isPasswordOpen && (
          <Access
            permission={PERMISSIONS[Module.USERS].CHANGE_PASSWORD}
            hideChildren
          >
            <ChangePassword />
          </Access>
        )}
      </div>
    </div>
  );
};

export default Profiles;
