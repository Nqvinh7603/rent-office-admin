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
    NOTIFICATIONS = "NOTIFICATIONS",
    FEES = "FEES",
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


export enum Orientation {
    EAST = "EAST", // Đông
    WEST = "WEST", // Tây
    SOUTH = "SOUTH", // Nam
    NORTH = "NORTH", // Bắc
    SOUTHEAST = "SOUTHEAST", // Đông Nam
    NORTHEAST = "NORTHEAST", // Đông Bắc
    SOUTHWEST = "SOUTHWEST", // Tây Nam
    NORTHWEST = "NORTHWEST", // Tây Bắc
    UNDETERMINED = "UNDETERMINED", // Chưa xác định
}


export enum BuildingStatus {
    REVIEWING = "REVIEWING", // kiểm duyệt trước khi đăng tin
    AVAILABLE = "AVAILABLE", // có thể cho thuê

}

export enum BuildingUnitStatus {
    AVAILABLE = "AVAILABLE",           // Đang có sẵn để thuê
    RENTED = "RENTED",             // Đã được thuê
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",  // Đang bảo trì
    RESERVED = "RESERVED",           // Đã có người đặt trước
    UNAVAILABLE = "UNAVAILABLE",         // Không thể cho thuê (chủ tòa nhà không muốn cho thuê)
}