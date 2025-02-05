import { ApiResponse, IBuildingType, Page, PaginationParams, SortParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IBuildingTypesService {
    getBuildingTypes(pagination: PaginationParams,
        sort?: SortParams,): Promise<ApiResponse<Page<IBuildingType>>>;
    getAllBuildingTypes(): Promise<ApiResponse<IBuildingType[]>>;
    create(newBuildingType: Omit<IBuildingType, "buildingTypeId">): Promise<ApiResponse<IBuildingType>>;
    update(buildingTypeId: number, updatedBuildingType: IBuildingType): Promise<ApiResponse<IBuildingType>>;
    delete(buildingTypeId: number): Promise<ApiResponse<void>>;
}

const apiClient = createApiClient("building-types");

class BuildingTypeService implements IBuildingTypesService {

    async getBuildingTypes(pagination: PaginationParams, sort?: SortParams): Promise<ApiResponse<Page<IBuildingType>>> {
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

    async getAllBuildingTypes(): Promise<ApiResponse<IBuildingType[]>> {
        return (await apiClient.get("/all")).data;
    }

    async create(newBuildingType: Omit<IBuildingType, "buildingTypeId">): Promise<ApiResponse<IBuildingType>> {
        return (await apiClient.post("", newBuildingType)).data;
    }

    async update(
        buildingTypeId: number,
        updatedBuildingType: IBuildingType,
    ): Promise<ApiResponse<IBuildingType>> {
        return (await apiClient.put(`/${buildingTypeId}`, updatedBuildingType)).data;
    }

    async delete(buildingTypeId: number): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${buildingTypeId}`)).data;
    }
}

export const buildingTypeService = new BuildingTypeService();
