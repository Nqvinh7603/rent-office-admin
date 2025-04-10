import { AxiosInstance } from "axios";
import { IChangePasswordRequest, IUser, UserFilterCriteria } from "../../interfaces/auth";
import { ApiResponse, Page, PaginationParams, SortParams } from "../../interfaces/common";
import { createApiClient } from "../api-client";

interface IUserService {
    getLoggedInUser(): Promise<ApiResponse<IUser>>;
    getUsers(pagination: PaginationParams, filter?: UserFilterCriteria, sort?: SortParams): Promise<ApiResponse<Page<IUser>>>;
    create(newUser: FormData): Promise<ApiResponse<IUser>>;
    update(userId: string, updatedUser: FormData): Promise<ApiResponse<IUser>>;
    delete(userId: string): Promise<ApiResponse<void>>;
    changePassword(changePasswordRequest: IChangePasswordRequest): Promise<ApiResponse<void>>;
    loadStaffs(): Promise<ApiResponse<IUser[]>>;
}

const apiClient: AxiosInstance = createApiClient("users");
class UserService implements IUserService {

    async loadStaffs(): Promise<ApiResponse<IUser[]>> {
        return (await apiClient.get("/staffs")).data;
    }

    async getLoggedInUser(): Promise<ApiResponse<IUser>> {
        return (await apiClient.get("/logged-in")).data;
    }

    async getUsers(
        pagination: PaginationParams, filter?: UserFilterCriteria, sort?: SortParams
    ): Promise<ApiResponse<Page<IUser>>> {
        return (
            await apiClient.get("", {
                params: {
                    ...pagination,
                    ...filter,
                    sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
                    direction: sort?.direction !== "" ? sort?.direction : undefined,
                },
            })
        ).data;
    }

    async create(newUser: FormData): Promise<ApiResponse<IUser>> {
        return (await apiClient.post("", newUser)).data;
    }

    async update(
        userId: string,
        updatedUser: FormData,
    ): Promise<ApiResponse<IUser>> {
        return (await apiClient.put(`/${userId}`, updatedUser)).data;
    }

    async delete(userId: string): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${userId}`)).data;
    }

    async changePassword(changePasswordRequest: IChangePasswordRequest): Promise<ApiResponse<void>> {
        return (await apiClient.put("/change-password", changePasswordRequest)).data;
    }
}

export const userService = new UserService();