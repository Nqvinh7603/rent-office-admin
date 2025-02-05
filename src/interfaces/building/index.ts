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