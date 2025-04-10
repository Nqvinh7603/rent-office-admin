import { ApiResponse, IAssignCustomer, ICustomer, ICustomerPotential, IUser, Page, PaginationParams, PotentialCustomerFilterCriteria, SortParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface ICustomersService {
    getAllCustomerByRequireType(): Promise<ApiResponse<ICustomer[]>>;
    getStaffsByCustomerId(customerId: number): Promise<ApiResponse<IUser[]>>;
    assignmentCustomerToStaffs(assignCustomer: IAssignCustomer): Promise<ApiResponse<void>>;
    updatePotentialCustomer(customerId: number, updatedCustomer: ICustomerPotential): Promise<ApiResponse<ICustomer>>;
    deletePotentialCustomer(customerId: number): Promise<ApiResponse<void>>;
    getPotentialCustomers(
        pagination: PaginationParams,
        filter?: PotentialCustomerFilterCriteria,
        sort?: SortParams
    )
        : Promise<ApiResponse<Page<ICustomerPotential>>>;
    getAllPotentialCustomers(): Promise<ApiResponse<ICustomerPotential[]>>;
    getCustomerPotentialById(customerId: number): Promise<ApiResponse<ICustomerPotential>>;
    getAllCustomers(): Promise<ApiResponse<ICustomer[]>>;
    getCustomerStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
    getCustomerStatisticByTime(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
    getCustomerStatisticByTimeAndTypeConsignment(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
    getCustomerStatisticByTimeAndTypePotential(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
}

const apiClient = createApiClient("customers");

class CustomerService implements ICustomersService {

    async getCustomerStatisticByTimeAndTypeConsignment(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics-time-and-type-consignment", { params })).data;
    }

    async getCustomerStatisticByTimeAndTypePotential(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics-time-and-type-potential", { params })).data;
    }

    async getCustomerStatisticByTime(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics-time", { params })).data;
    }

    async getCustomerStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics", { params })).data;
    }

    async getAllCustomers(): Promise<ApiResponse<ICustomer[]>> {
        return (await apiClient.get("/all")).data;
    }

    async getPotentialCustomers(
        pagination: PaginationParams,
        filter?: PotentialCustomerFilterCriteria,
        sort?: SortParams
    ): Promise<ApiResponse<Page<ICustomerPotential>>> {
        return (
            await apiClient.get("/potentials", {
                params: {
                    ...pagination,
                    ...filter,
                    sortBy: sort?.sortBy !== "" ? sort?.sortBy : undefined,
                    direction: sort?.direction !== "" ? sort?.direction : undefined,
                },
            })
        ).data;
    }

    async getCustomerPotentialById(customerId: number): Promise<ApiResponse<ICustomerPotential>> {
        return (await apiClient.get(`/potentials/${customerId}`)).data;
    }

    async updatePotentialCustomer(customerId: number, updatedCustomer: ICustomerPotential): Promise<ApiResponse<ICustomerPotential>> {
        return (await apiClient.put(`/potentials/${customerId}`, updatedCustomer)).data;
    }

    async deletePotentialCustomer(customerId: number): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/potentials/${customerId}`)).data;
    }

    async getAllCustomerByRequireType(): Promise<ApiResponse<ICustomer[]>> {
        return (await apiClient.get("/require-type")).data;
    }

    async getStaffsByCustomerId(customerId: number): Promise<ApiResponse<IUser[]>> {
        return (await apiClient.get(`/${customerId}/staffs`)).data;
    }

    async assignmentCustomerToStaffs(assignCustomer: IAssignCustomer): Promise<ApiResponse<void>> {
        return (await apiClient.post("/assign-customer", assignCustomer)).data;
    }

    async getAllPotentialCustomers(): Promise<ApiResponse<ICustomerPotential[]>> {
        return (await apiClient.get("/potentials/all")).data;
    }
}

export const customerService = new CustomerService();
