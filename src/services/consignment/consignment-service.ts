import { AxiosInstance } from "axios";
import { ConsignmentFilterCriteria, IConsignment } from "../../interfaces";
import { ApiResponse, Page, PaginationParams, SortParams } from "../../interfaces/common";
import { createApiClient } from "../api-client";

interface IConsignmentService {

    getConsignments(pagination: PaginationParams, filter?: ConsignmentFilterCriteria, sort?: SortParams): Promise<ApiResponse<Page<IConsignment>>>;
    update(consignmentId: string, updatedConsignment: FormData): Promise<ApiResponse<IConsignment>>;
    delete(consignmentId: string): Promise<ApiResponse<void>>;
    getConsignmentById(consignmentId: string): Promise<ApiResponse<IConsignment>>;
}

const apiClient: AxiosInstance = createApiClient("consignments");
class ConsignmentService implements IConsignmentService {

    async getConsignments(
        pagination: PaginationParams, filter?: ConsignmentFilterCriteria, sort?: SortParams
    ): Promise<ApiResponse<Page<IConsignment>>> {
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

    async update(
        consignmentId: string,
        updatedConsignment: FormData,
    ): Promise<ApiResponse<IConsignment>> {
        return (await apiClient.put(`/${consignmentId}`, updatedConsignment)).data;
    }

    async delete(consignmentId: string): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/${consignmentId}`)).data;
    }

    async getConsignmentById(consignmentId: string): Promise<ApiResponse<IConsignment>> {
        return (await apiClient.get(`/${consignmentId}`)).data;
    }

}

export const consignmentService = new ConsignmentService();