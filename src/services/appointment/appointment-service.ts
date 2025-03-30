import { ApiResponse, Page, PaginationParams, SortParams } from "../../interfaces";
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
}

const apiClient = createApiClient("appointments");

class AppointmentService implements IAppointmentService {

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
}

export const appointmentService = new AppointmentService();
