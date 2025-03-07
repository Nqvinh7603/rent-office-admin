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
    ADDITIONAL_INFO = "ADDITIONAL_INFO",
}

export enum PotentialCustomerStatus {
    CONTACTED_NO_RESPONSE = "CONTACTED_NO_RESPONSE", // đã liên hệ _ không phản hồi
    CONTACTED_SCHEDULED = "CONTACTED_SCHEDULED", // đã liên hệ _ đã lên lịch
    NOT_CONTACTED = "NOT_CONTACTED", // chưa liên hệ
    DEAL_DONE = "DEAL_DONE", // đã có hợp đồng
    IN_PROGRESS = "IN_PROGRESS", // đang trong quá trình làm việc
    CANCELED = "CANCELED", // đã hủy
}


