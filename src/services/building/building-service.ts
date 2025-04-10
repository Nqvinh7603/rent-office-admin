import { AxiosInstance } from "axios";
import { BuildingCompanyFilterCriteria, BuildingFilterCriteria, IAssignBuilding, IBuilding, IUser } from "../../interfaces";
import { ApiResponse, Page, PaginationParams, SortParams } from "../../interfaces/common";
import { createApiClient } from "../api-client";

interface IBuildingService {

    getBuildings(pagination: PaginationParams, filter?: BuildingFilterCriteria, sort?: SortParams): Promise<ApiResponse<Page<IBuilding>>>;
    update(buildingId: string, updatedBuilding: FormData): Promise<ApiResponse<IBuilding>>;
    delete(buildingId: string): Promise<ApiResponse<void>>;
    getBuildingById(buildingId: string): Promise<ApiResponse<IBuilding>>;
    getBuildingCompanys(pagination: PaginationParams, filter?: BuildingCompanyFilterCriteria, sort?: SortParams): Promise<ApiResponse<Page<IBuilding>>>;
    getAllBuildingOfCompany(): Promise<ApiResponse<IBuilding[]>>;
    getStaffsByBuildingId(buildingId: number): Promise<ApiResponse<IUser[]>>;
    assignmentBuildingToStaffs(assignBuilding: IAssignBuilding): Promise<ApiResponse<void>>;
    getBuildingStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;

}

const apiClient: AxiosInstance = createApiClient("buildings");
class BuildingService implements IBuildingService {

    async getBuildingStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics", { params })).data;
    }
    async getStaffsByBuildingId(buildingId: number): Promise<ApiResponse<IUser[]>> {
        return (await apiClient.get(`/${buildingId}/staffs`)).data;
    }
    async assignmentBuildingToStaffs(assignBuilding: IAssignBuilding): Promise<ApiResponse<void>> {
        return (await apiClient.post("/assign-building", assignBuilding)).data;
    }
    async getBuildings(
        pagination: PaginationParams, filter?: BuildingFilterCriteria, sort?: SortParams
    ): Promise<ApiResponse<Page<IBuilding>>> {
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

    async getAllBuildingOfCompany(): Promise<ApiResponse<IBuilding[]>> {
        return (await apiClient.get("/all")).data;
    }

    async getBuildingCompanys(
        pagination: PaginationParams, filter?: BuildingCompanyFilterCriteria, sort?: SortParams
    ): Promise<ApiResponse<Page<IBuilding>>> {
        return (
            await apiClient.get("/company", {
                params: {
                    ...pagination,
                    ...filter,
                    sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
                    direction: sort?.direction !== "" ? sort?.direction : undefined,
                },
            })
        ).data;
    }



    async update(
        buildingId: string,
        updatedBuilding: FormData,
    ): Promise<ApiResponse<IBuilding>> {
        return (await apiClient.put(`/${buildingId}`, updatedBuilding)).data;
    }

    async delete(buildingId: string): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${buildingId}`)).data;
    }

    async getBuildingById(buildingId: string): Promise<ApiResponse<IBuilding>> {
        return (await apiClient.get(`/${buildingId}`)).data;
    }

}

export const buildingService = new BuildingService();