import { IUser } from "../auth";
import { ConsignmentStatus, RequireType } from "../common/enums";

export interface ICustomer {
    customerId: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    address: string;
    requireType: RequireType;
    createdAt: string;
    updatedAt?: string;
}

export interface IConsignment {
    consignmentId: number;
    ward: string;
    district: string;
    city: string;
    description: string;
    buildingType: string;
    rejectionReason?: string;
    additionalInfo?: string;
    price: number;
    status: ConsignmentStatus;
    consignmentImages: IConsignmentImage[];
    customer: ICustomer;
    createdAt: string;
    updatedAt?: string;
    additionalInfoAt?: string;
    rejectedReasonAt?: string;
    confirmedAt?: string;
    additionalInfoAfterAt?: string;
}

export interface IConsignmentImage {
    consignmentImageId: number;
    imgUrl?: string;
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