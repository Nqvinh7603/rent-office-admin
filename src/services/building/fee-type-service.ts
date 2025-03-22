import { ApiResponse, IBuildingType, IFeeType, Page, PaginationParams, SortParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface IFeeTypesService {
    getFeeTypes(pagination: PaginationParams,
        sort?: SortParams,): Promise<ApiResponse<Page<IFeeType>>>;
    getAllFeeTypes(): Promise<ApiResponse<IFeeType[]>>;
    create(newFeeType: Omit<IFeeType, "feeTypeId">): Promise<ApiResponse<IBuildingType>>;
    update(feeTypeId: number, updatedFeeType: IFeeType): Promise<ApiResponse<IBuildingType>>;
    delete(feeTypeId: number): Promise<ApiResponse<void>>;
}

const apiClient = createApiClient("fee-types");

class FeeTypeService implements IFeeTypesService {
    async getFeeTypes(pagination: PaginationParams, sort?: SortParams): Promise<ApiResponse<Page<IFeeType>>> {
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
    async getAllFeeTypes(): Promise<ApiResponse<IFeeType[]>> {
        return (await apiClient.get("/all")).data;
    }
    async create(newFeeType: Omit<IFeeType, "feeTypeId">): Promise<ApiResponse<IBuildingType>> {
        return (await apiClient.post("", newFeeType)).data;
    }
    async update(
        feeTypeId: number,
        updatedFeeType: IFeeType,
    ): Promise<ApiResponse<IBuildingType>> {
        return (await apiClient.put(`/${feeTypeId}`, updatedFeeType)).data;
    }
    async delete(feeTypeId: number): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${feeTypeId}`)).data;
    }
}

export const feeTypeService = new FeeTypeService();
