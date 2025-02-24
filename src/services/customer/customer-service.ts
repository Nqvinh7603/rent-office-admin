import { ApiResponse, IAssignCustomer, ICustomer, IUser } from "../../interfaces";
import { createApiClient } from "../api-client";

interface ICustomersService {
    getAllCustomerByRequireType(): Promise<ApiResponse<ICustomer[]>>;
    getStaffsByCustomerId(customerId: number): Promise<ApiResponse<IUser[]>>;
    assignmentCustomerToStaffs(assignCustomer: IAssignCustomer): Promise<ApiResponse<void>>;

}

const apiClient = createApiClient("customers");

class CustomerService implements ICustomersService {
    async getAllCustomerByRequireType(): Promise<ApiResponse<ICustomer[]>> {
        return (await apiClient.get("/require-type")).data;
    }

    async getStaffsByCustomerId(customerId: number): Promise<ApiResponse<IUser[]>> {
        return (await apiClient.get(`/${customerId}/staffs`)).data;
    }

    async assignmentCustomerToStaffs(assignCustomer: IAssignCustomer): Promise<ApiResponse<void>> {
        return (await apiClient.post("/assign-customer", assignCustomer)).data;
    }
}

export const customerService = new CustomerService();
