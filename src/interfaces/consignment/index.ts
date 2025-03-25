import { IUser } from "../auth";
import { IBuildingLevel, IBuildingType, IBuildingUnit, IFeeType } from "../building";
import { BuildingStatus, ConsignmentStatus, Orientation, PotentialCustomerStatus, RequireType } from "../common/enums";

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

export interface IBuilding {
    buildingId: number;
    buildingName: string;
    numberOfFloors: number;
    totalArea: number;
    ward: string;
    district: string;
    city: string;
    street: string;
    buildingNumber: string;
    description: string;
    orientation: Orientation;
    buildingImages: IBuildingImage[];
    consignmentStatusHistories: IBuildingStatusHistory[];
    buildingUnits: IBuildingUnit[];
    status: BuildingStatus;
    buildingType: IBuildingType;
    buildingLevel: IBuildingLevel;
    fees: IFee[];
    createdAt: string;
    updatedAt?: string;
    paymentPolicies: IPaymentPolicy[];
    customer: ICustomer;
}

export interface IBuildingImage {
    buildingImageId: number;
    imgUrl?: string;
}

export interface IBuildingStatusHistory {
    consignmentStatusHistoryId: number;
    status: ConsignmentStatus;
    note: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}

export interface BuildingFilterCriteria {
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
    maxArea?: number;
    minArea?: number;
    staffName?: string;
    status?: ConsignmentStatus;
    orientation?: Orientation;
}


export interface BuildingCompanyFilterCriteria {
    email?: string;
    customerName?: string;
    phoneNumber?: string;
    buildingType?: string;
    buildingLevel?: string;
    district?: string;
    city?: string;
    ward?: string;
    street?: string;
    maxPrice?: number;
    minPrice?: number;
    maxArea?: number;
    minArea?: number;
    staffName?: string;
    buildingStatus?: BuildingStatus;
    orientation?: Orientation;
    buildingName?: string;
}

export interface IAssignCustomer {
    customer: ICustomer;
    users: IUser[];
}

export interface IRentalPricing {
    rentalPricingId: number;
    price: number;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
}

export interface IFee {
    feeId: number;
    feePricing: IFeePricing[];
    feeType: IFeeType;
    createdAt: string;
    updatedAt?: string;
}


export interface IFeePricing {
    feePricingId: number;
    priceUnit?: string;
    priceValue?: number;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IPaymentPolicy {
    paymentPolicyId: number;
    paymentCycle: string;
    depositTerm: number;
    createdAt: string;
    updatedAt?: string;
}