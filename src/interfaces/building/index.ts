import { IUser } from "../auth";
import { BuildingUnitStatus } from "../common/enums";
import { IBuilding, IRentalPricing } from "../consignment";

export interface IBuildingType {
    buildingTypeId: number;
    buildingTypeName: string;
    buildingTypeCode: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IBuildingLevel {
    buildingLevelId: number;
    buildingLevelCode: string;
    buildingLevelName: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IFeeType {
    feeTypeId: number;
    feeTypeName: string;
    createdAt: string;
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

export interface IAssignBuilding {
    building: IBuilding;
    users: IUser[];
}

export interface IBuildingUnit {
    buildingUnitId: number;
    unitName?: string;
    rentalPricing: IRentalPricing[];
    floor: number;
    buildingUnitStatus: BuildingUnitStatus;
    rentAreas: IRentArea[];
    createdAt: string;
    updatedAt?: string;
}

export interface IRentArea {
    rentAreaId: number;
    area: number;
    createdAt: string;
    updatedAt?: string;
}