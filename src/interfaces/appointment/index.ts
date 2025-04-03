import { AppointmentBuildingStatus } from "../common/enums";
import { IBuilding, ICustomer } from "../consignment";

export interface IAppointment {
    appointmentId: number;
    customer?: ICustomer;
    createdAt: string;
    createdBy: string;
}


export interface IAppointmentBuildingStatusHistory {
    appointmentBuildingStatusHistoryId: number;
    note: string;
    status: AppointmentBuildingStatus;
    createdAt: string;
    createdBy: string;
}

export interface IAppointmentBuilding {
    appointmentBuildingId: number;
    appointmentBuildingStatusHistories: IAppointmentBuildingStatusHistory[];
    visitTime: string;
    appointment: IAppointment;
    area?: string;
    building: IBuilding;
    createdAt: string;
    createdBy: string;
}

export interface AppointmentFilterCriteria {
    type?: string;
    startDate?: string;
    endDate?: string;
    status?: AppointmentBuildingStatus;
    email?: string;
}

