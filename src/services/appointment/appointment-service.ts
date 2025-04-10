import { ApiResponse, ICustomerPotential, Page, PaginationParams, SortParams } from "../../interfaces";
import { AppointmentFilterCriteria, IAppointmentBuilding } from "../../interfaces/appointment";
import { createApiClient } from "../api-client";

interface IAppointmentService {
    getAppointmentCalendar(): Promise<ApiResponse<Map<string, IAppointmentBuilding[]>>>;
    getAppointments(
        pagination: PaginationParams,
        filter?: AppointmentFilterCriteria,
        sort?: SortParams
    )
        : Promise<ApiResponse<Page<IAppointmentBuilding>>>;
    getAppointmentsCalendarById(appointmentBuildingId: number): Promise<ApiResponse<IAppointmentBuilding>>;
    delete(appointmentBuildingId: number): Promise<ApiResponse<void>>;
    createAppointmentBuilding(appointmentBuilding: ICustomerPotential): Promise<ApiResponse<void>>;
    updateAppointmentBuilding(
        appointmentBuildingId: number,
        appointmentBuilding: IAppointmentBuilding
    ): Promise<ApiResponse<IAppointmentBuilding>>;
    getAppointmentStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
    getAppointmentsByTime(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>>;
}

const apiClient = createApiClient("appointments");

class AppointmentService implements IAppointmentService {

    async getAppointmentStatistic(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics", { params })).data;
    }

    async getAppointmentsByTime(params: Record<string, string>): Promise<ApiResponse<Record<string, string>>> {
        return (await apiClient.get("/statistics-time", { params })).data;
    }

    async updateAppointmentBuilding(
        appointmentBuildingId: number,
        appointmentBuilding: IAppointmentBuilding
    ): Promise<ApiResponse<IAppointmentBuilding>> {
        return (await apiClient.put(`/calendar/${appointmentBuildingId}`, appointmentBuilding)).data;
    }

    async createAppointmentBuilding(appointmentBuilding: ICustomerPotential): Promise<ApiResponse<void>> {
        return (await apiClient.post("/calendar", appointmentBuilding)).data;
    }

    async delete(appointmentBuildingId: number): Promise<ApiResponse<void>> {
        return (await apiClient.delete(`/calendar/${appointmentBuildingId}`)).data;
    }

    async getAppointmentCalendar(): Promise<ApiResponse<Map<string, IAppointmentBuilding[]>>> {
        return (await apiClient.get("/calendar")).data;
    }
    async getAppointments(
        pagination: PaginationParams,
        filter?: AppointmentFilterCriteria,
        sort?: SortParams
    ): Promise<ApiResponse<Page<IAppointmentBuilding>>> {
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
    async getAppointmentsCalendarById(appointmentBuildingId: number): Promise<ApiResponse<IAppointmentBuilding>> {
        return (await apiClient.get(`/calendar/${appointmentBuildingId}`)).data;
    }
}

export const appointmentService = new AppointmentService();
