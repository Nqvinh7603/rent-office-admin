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
    APPOINTMENTS = "APPOINTMENTS",
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
    NOT_CONTACTED = "NOT_CONTACTED",         // Chưa liên hệ
    CONTACTED = "CONTACTED",             // Đã liên hệ 
    DEAL_IN_PROGRESS = "DEAL_IN_PROGRESS",      // Đang xử lý deal (đã vào phễu)
    DEAL_DONE = "DEAL_DONE",             // Đã chốt thuê
    CANCELED = "CANCELED"              // Không còn nhu cầu
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

export enum AppointmentStatus {
    PENDING = "PENDING",        // Mới tạo
    CONFIRMED = "CONFIRMED",      // Đã xác nhận
    IN_PROGRESS = "IN_PROGRESS",    // Đang diễn ra
    SUCCESSFUL = "SUCCESSFUL",     // Khách đã thuê sau cuộc hẹn
    UNSUCCESSFUL = "UNSUCCESSFUL",   // Cuộc hẹn không thành công
    CANCELLED = "CANCELLED"       // Cuộc hẹn bị hủy hoặc không diễn ra
}

export enum AppointmentBuildingStatus {
    PENDING = "PENDING", // Mới tạo
    CONFIRMED = "CONFIRMED", // Đã xác nhận
    VIEWED = "VIEWED", // Đã xem
    SUCCESSFUL = "SUCCESSFUL", // Khách đã thuê
    UNSUCCESSFUL = "UNSUCESSFUL", // Khách không thuê
    CANCELLED = "CANCELLED" // Cuộc hẹn bị hủy hoặc không diễn ra
}