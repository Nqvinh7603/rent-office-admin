import { IUser } from "../auth";
import { ConsignmentStatus, PotentialCustomerStatus, RequireType } from "../common/enums";

export interface ICustomer {
    customerId: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    address: string;
    requireType: RequireType;
    note?: string;
    status?: PotentialCustomerStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface PotentialCustomerFilterCriteria {
    customerName?: string;
    phoneNumber?: string;
    email?: string;
    status?: PotentialCustomerStatus;
    staffName?: string;
}

export interface IConsignment {
    consignmentId: number;
    ward: string;
    district: string;
    city: string;
    description: string;
    buildingType: string;
    price: number;
    consignmentImages: IConsignmentImage[];
    customer: ICustomer;
    createdAt: string;
    updatedAt?: string;
    consignmentStatusHistories: IConsignmentStatusHistory[];
}

export interface IConsignmentImage {
    consignmentImageId: number;
    imgUrl?: string;
}

export interface IConsignmentStatusHistory {
    consignmentStatusHistoryId: number;
    status: ConsignmentStatus;
    note: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface ConsignmentFilterCriteria {
    email?: string;
    customerName?: string;
    phoneNumber?: string;
    buildingType?: string;
    district?: string;
    city?: string;
    ward?: string;
    street?: string;
    maxPrice?: number;
    minPrice?: number;
    staffName?: string;
    status?: ConsignmentStatus;
}


export interface IAssignCustomer {
    customer: ICustomer;
    users: IUser[];
}