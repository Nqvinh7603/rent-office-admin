//PERMISSIONS
export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export enum Module {
    USERS = "USERS",
    ROLES = "ROLES",
    PERMISSIONS = "PERMISSIONS",
    BUILDINGS = "BUILDINGS",
    CUSTOMERS = "CUSTOMERS",
    CONSIGNMENTS = "CONSIGNMENTS",
    NOTIFICATIONS = "NOTIFICATIONS",
}


export enum RequireType {
    RENT = "RENT",
    CONSIGNMENT = "CONSIGNMENT",
}

export enum ConsignmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    INCOMPLETE = "INCOMPLETE",
}


