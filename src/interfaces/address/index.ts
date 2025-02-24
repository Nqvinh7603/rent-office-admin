export interface IAddress {
    name: string;
    code: number;
    codename?: string;
    divisionType?: string;
    phoneCode?: string;
    districts?: IDistrict[];
}

export interface IDistrict {
    name: string;
    code: number;
    codename?: string;
    divisionType?: string;
    shortCodename?: string;
    wards?: IWard[];
}

export interface IWard {
    name: string;
    code: number;
    codename?: string;
    divisionType?: string;
    shortCodename?: string;
}

export interface ILocationData {
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    error?: string;
}