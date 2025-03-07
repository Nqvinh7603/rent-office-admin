import { ApiResponse, IAssignCustomer, ICustomer, IUser, Page, PaginationParams, PotentialCustomerFilterCriteria, SortParams } from "../../interfaces";
import { createApiClient } from "../api-client";

interface ICustomersService {
    getAllCustomerByRequireType(): Promise<ApiResponse<ICustomer[]>>;
    getStaffsByCustomerId(customerId: number): Promise<ApiResponse<IUser[]>>;
    assignmentCustomerToStaffs(assignCustomer: IAssignCustomer): Promise<ApiResponse<void>>;
    updatePotentialCustomer(customerId: number, updatedCustomer: ICustomer): Promise<ApiResponse<ICustomer>>;
    deletePotentialCustomer(customerId: number): Promise<ApiResponse<void>>;
    getPotentialCustomers(
        pagination: PaginationParams,
        filter?: PotentialCustomerFilterCriteria,
        sort?: SortParams
    )
        : Promise<ApiResponse<Page<ICustomer>>>;
    getAllPotentialCustomers(): Promise<ApiResponse<ICustomer[]>>;

}

const apiClient = createApiClient("customers");

class CustomerService implements ICustomersService {
    async getPotentialCustomers(
        pagination: PaginationParams,
        filter?: PotentialCustomerFilterCriteria,
        sort?: SortParams
    ): Promise<ApiResponse<Page<ICustomer>>> {
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

    async updatePotentialCustomer(customerId: number, updatedCustomer: ICustomer): Promise<ApiResponse<ICustomer>> {
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

    async getAllPotentialCustomers(): Promise<ApiResponse<ICustomer[]>> {
        return (await apiClient.get("/potentials/all")).data;
    }
}

export const customerService = new CustomerService();
