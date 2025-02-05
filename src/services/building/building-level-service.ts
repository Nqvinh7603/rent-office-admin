import { ApiResponse, IBuildingLevel, Page, PaginationParams, SortParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IBuildingLevelsService {
    getBuildingLevels(pagination: PaginationParams,
        sort?: SortParams,): Promise<ApiResponse<Page<IBuildingLevel>>>;
    getAllBuildingLevels(): Promise<ApiResponse<IBuildingLevel[]>>;
    create(newBuildingLevel: Omit<IBuildingLevel, "buildingLevelId">): Promise<ApiResponse<IBuildingLevel>>;
    update(buildingLevelId: number, updatedBuildingLevel: IBuildingLevel): Promise<ApiResponse<IBuildingLevel>>;
    delete(buildingLevelId: number): Promise<ApiResponse<void>>;
}

const apiClient = createApiClient("building-levels");

class BuildingLevelService implements IBuildingLevelsService {

    async getBuildingLevels(pagination: PaginationParams, sort?: SortParams): Promise<ApiResponse<Page<IBuildingLevel>>> {
        return (
            await apiClient.get("", {
                params: {
                    ...pagination,
                    sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
                    direction: sort?.direction !== "" ? sort?.direction : undefined,
                },
            })
        ).data;
    }

    async getAllBuildingLevels(): Promise<ApiResponse<IBuildingLevel[]>> {
        return (await apiClient.get("/all")).data;
    }

    async create(newBuildingLevel: Omit<IBuildingLevel, "buildingLevelId">): Promise<ApiResponse<IBuildingLevel>> {
        return (await apiClient.post("", newBuildingLevel)).data;
    }

    async update(
        buildingLevelId: number,
        updatedBuildingLevel: IBuildingLevel,
    ): Promise<ApiResponse<IBuildingLevel>> {
        return (await apiClient.put(`/${buildingLevelId}`, updatedBuildingLevel)).data;
    }

    async delete(buildingLevelId: number): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${buildingLevelId}`)).data;
    }
}

export const buildingLevelService = new BuildingLevelService();
