import { INotification } from "../notification";

export interface IAuthRequest {
    email?: string;
    password: string;
    rememberMe?: boolean;
}

export interface IAuthResponse {
    accessToken: string;
}

export interface IForgotPasswordRequest {
    email: string;
    siteUrl: string;
}

export interface IResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface IChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}


export interface IUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    password?: string;
    phoneNumber: string;
    avatarUrl?: string;
    active: boolean;
    role: IRole;
    notifications: INotification[];
    dateOfBirth?: string;
    createdAt: string;
    updatedAt?: string;
    checked?: string;
}

export interface UserFilterCriteria {
    query?: string;
    active?: boolean;
}

export interface IRole {
    roleId: number;
    roleName: string;
    active: boolean;
    description?: string;
    permissions: IPermission[];
    createdAt: string;
    updatedAt?: string;
}

export interface RoleFilterCriteria {
    active?: boolean;
}
export interface IPermission {
    permissionId: number;
    name: string;
    apiPath: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    module: string;
    createdAt: string;
    updatedAt?: string;
}



export interface PermissionFilterCriteria {
    method?: string;
    module?: string;
}