
export interface IAuthRequest {
    email?: string;
    username?: string;
    password: string;
}

export interface IAuthResponse {
    access_token: string;
}


export interface IUser {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    password?: string;
    phone_number: string;
    avatar?: string;
    active: boolean;
    role: IRole;
    created_at: string;
    updated_at?: string;
}

export interface IRole {
    roleId: number;
    roleName: string;
    active: boolean;
    description?: string;
    permissions: IPermission[];
    created_at: string;
    updated_at?: string;
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