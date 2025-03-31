import { AppointmentBuildingStatus, AppointmentStatus, BuildingStatus, BuildingUnitStatus, ConsignmentStatus, Module, Orientation, PotentialCustomerStatus } from "../enums";

export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
export const PRIMARY_COLOR = "#3162ad";

export const PERMISSIONS = {
    [Module.USERS]: {
        GET_PAGINATION: { method: "GET", apiPath: "/api/v1/users" },
        GET_LOGGED_IN: { method: "GET", apiPath: "/api/v1/users/logged-in" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/users/{id}" },
        CREATE: { method: "POST", apiPath: "/api/v1/users" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/users/{id}" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/users/{id}" },
        CHANGE_PASSWORD: {
            method: "PUT",
            apiPath: "/api/v1/users/change-password",
        },
        LOAD_STAFFS: { method: "GET", apiPath: "/api/v1/users/staffs" },
    },
    [Module.ROLES]: {
        GET_PAGINATION: { method: "GET", apiPath: "/api/v1/roles" },
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/roles/{id}" },
        CREATE: { method: "POST", apiPath: "/api/v1/roles" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/roles/{id}" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/roles/{id}" },
    },
    [Module.PERMISSIONS]: {
        GET_PAGINATION: { method: "GET", apiPath: "/api/v1/permissions" },
        CREATE: { method: "POST", apiPath: "/api/v1/permissions" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/permissions/{id}" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/permissions/{id}" },
        GET_ALL_PERMISSIONS: { method: "GET", apiPath: "/api/v1/permissions/all" },
    },
    [Module.BUILDINGS]: {

        // Building-type
        GET_BUILDING_TYPE_PAGINATION: { method: "GET", apiPath: "/api/v1/building-types" },
        GET_ALL_BUILDING_TYPE: { method: "GET", apiPath: "/api/v1/building-types/all" },
        CREATE_BUILDING_TYPE: { method: "POST", apiPath: "/api/v1/building-types" },
        UPDATE_BUILDING_TYPE: { method: "PUT", apiPath: "/api/v1/building-types/{id}" },
        DELETE_BUILDING_TYPE: { method: "DELETE", apiPath: "/api/v1/building-types/{id}" },

        // Building-level
        GET_BUILDING_LEVEL_PAGINATION: { method: "GET", apiPath: "/api/v1/building-levels" },
        GET_ALL_BUILDING_LEVEL: { method: "GET", apiPath: "/api/v1/building-levels/all" },
        CREATE_BUILDING_LEVEL: { method: "POST", apiPath: "/api/v1/building-levels" },
        UPDATE_BUILDING_LEVEL: { method: "PUT", apiPath: "/api/v1/building-levels/{id}" },
        DELETE_BUILDING_LEVEL: { method: "DELETE", apiPath: "/api/v1/building-levels/{id}" },

        //Building
        GET_BUILDING_PAGINATION: { method: "GET", apiPath: "/api/v1/buildings" },
        GET_BUILDING_BY_ID: { method: "GET", apiPath: "/api/v1/buildings/{id}" },
        CREATE_BUILDING: { method: "POST", apiPath: "/api/v1/buildings" },
        UPDATE_BUILDING: { method: "PUT", apiPath: "/api/v1/buildings/{id}" },
        DELETE_BUILDING: { method: "DELETE", apiPath: "/api/v1/buildings/{id}" },
        GET_BUILDING_OF_COMPANY_PAGINATION: {
            method: "GET",
            apiPath: "/api/v1/buildings/company",
        },
        GET_ALL_BUILDING_OFF_COMPANY: {
            method: "GET",
            apiPath: "/api/v1/buildings/company/all",
        },
        GET_STAFFS_BY_BUILDING_ID: { method: "GET", apiPath: "/api/v1/buildings/{id}/staffs" },
        ASSIGN_BUILDING_TO_STAFFS: { method: "POST", apiPath: "/api/v1/buildings/assign-building" },
    },
    [Module.CUSTOMERS]: {
        GET_CUSTOMER_BY_REQUIRE_TYPE: { method: "GET", apiPath: "/api/v1/customers/require-type" },
        GET_STAFFS_BY_CUSTOMER_ID: { method: "GET", apiPath: "/api/v1/customers/{id}/staffs" },
        ASSIGN_CUSTOMER_TO_STAFFS: { method: "POST", apiPath: "/api/v1/customers/assign-customer" },
        CREATE_CUSTOMER_POTENTIAL: { method: "POST", apiPath: "/api/v1/customers/potentials" },
        GET_CUSTOMER_POTENTIAL_PAGINATION: { method: "GET", apiPath: "/api/v1/customers/potentials" },
        UPDATE_CUSTOMER_POTENTIAL: { method: "PUT", apiPath: "/api/v1/customers/potentials/{id}" },
        DELETE_CUSTOMER_POTENTIAL: { method: "DELETE", apiPath: "/api/v1/customers/potentials/{id}" },
        GET_ALL_CUSTOMER_POTENTIAL: { method: "GET", apiPath: "/api/v1/customers/potentials/all" },
        GET_CUSTOMER_POTENTIAL_BY_ID: { method: "GET", apiPath: "/api/v1/customers/potentials/{id}" },
    },
    [Module.NOTIFICATIONS]: {
        MARK_ALL_AS_READ: { method: "PUT", apiPath: "/api/v1/notifications/mark-all-read" },
        MARK_AS_READ: { method: "PUT", apiPath: "/api/v1/notifications/{id}/mark-read" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/notifications" },
        GET_NOTIFICATIONS_BY_USER_ID: { method: "GET", apiPath: "/api/v1/notifications/user/{id}" },
    },
    [Module.FEES]: {
        //fee-types
        GET_FEE_TYPES_PAGINATION: { method: "GET", apiPath: "/api/v1/fee-types" },
        GET_ALL_FEE_TYPES: { method: "GET", apiPath: "/api/v1/fee-types/all" },
        CREATE_FEE_TYPES: { method: "POST", apiPath: "/api/v1/fee-types" },
        UPDATE_FEE_TYPES: { method: "PUT", apiPath: "/api/v1/fee-types/{id}" },
        DELETE_FEE_TYPES: { method: "DELETE", apiPath: "/api/v1/fee-types/{id}" },
    },
    [Module.APPOINTMENTS]: {
        // GET_APPOINTMENTS_PAGINATION: { method: "GET", apiPath: "/api/v1/appointments" },
        // GET_APPOINTMENT_BY_ID: { method: "GET", apiPath: "/api/v1/appointments/{id}" },
        // UPDATE_APPOINTMENT: { method: "PUT", apiPath: "/api/v1/appointments/{id}" },
        DELETE_APPOINTMENT_CALENDAR: { method: "DELETE", apiPath: "/api/v1/appointments/calendar/{id}" },
        GET_APPOINTMENT_CALENDAR: { method: "GET", apiPath: "/api/v1/appointments/calendar" },
        GET_APPOINTMENTS_PAGINATION: { method: "GET", apiPath: "/api/v1/appointments" },
        GET_APPOINTMENTS_CALENDAR_BY_ID: { method: "GET", apiPath: "/api/v1/appointments/calendar/{id}" },
        CREATE_APPOINTMENT_CALENDAR: { method: "POST", apiPath: "/api/v1/appointments/calendar" },

    },
};


export const CONSIGNMENT_STATUS_TRANSLATION: Record<ConsignmentStatus, string> = {
    [ConsignmentStatus.PENDING]: "Chờ xác nhận",
    [ConsignmentStatus.INCOMPLETE]: "Yêu cầu bổ sung thông tin",
    [ConsignmentStatus.ADDITIONAL_INFO]: "Đã thêm thông tin",
    [ConsignmentStatus.CANCELLED]: "Từ chối",
    [ConsignmentStatus.CONFIRMED]: "Chấp nhận",
};

export const BUILDING_STATUS_TRANSLATION: Record<BuildingStatus, string> = {
    [BuildingStatus.REVIEWING]: "Đang kiểm duyệt",
    [BuildingStatus.AVAILABLE]: "Sẵn sàng cho thuê",
}


export const USER_STATUS_TRANSLATION: Record<string, string> = {
    true: "Đang hoạt động",
    false: "Ngừng hoạt động",
};


export const ROLE_STATUS_TRANSLATION: Record<string, string> = {
    true: "Đang hoạt động",
    false: "Ngừng hoạt động",
};

export const POTENTIAL_CUSTOMER_STATUS_TRANSLATION: Record<PotentialCustomerStatus, string> = {

    [PotentialCustomerStatus.NOT_CONTACTED]: "Chưa liên hệ",
    [PotentialCustomerStatus.DEAL_DONE]: "Đã chốt thuê",
    [PotentialCustomerStatus.CANCELED]: "Không còn nhu cầu",
    [PotentialCustomerStatus.CONTACTED]: "Đã liên hệ",
    [PotentialCustomerStatus.DEAL_IN_PROGRESS]: "Đang thoả thuận",

}

export const ORENTATION_TRANSLATIONS: Record<Orientation, string> = {
    [Orientation.NORTH]: "Bắc",
    [Orientation.SOUTH]: "Nam",
    [Orientation.EAST]: "Đông",
    [Orientation.WEST]: "Tây",
    [Orientation.NORTHEAST]: "Đông Bắc",
    [Orientation.NORTHWEST]: "Tây Bắc",
    [Orientation.SOUTHEAST]: "Đông Nam",
    [Orientation.SOUTHWEST]: "Tây Nam",
    [Orientation.UNDETERMINED]: "Chưa xác định",
}

export const BUILDING_UNIT_STATUS_TRANSLATION: Record<BuildingUnitStatus, string> = {
    [BuildingUnitStatus.AVAILABLE]: "Có thể cho thuê",
    [BuildingUnitStatus.UNAVAILABLE]: "Không thể cho thuê",
    [BuildingUnitStatus.RENTED]: "Đã cho thuê",
    [BuildingUnitStatus.RESERVED]: "Đã đặt cọc",
    [BuildingUnitStatus.UNDER_MAINTENANCE]: "Đang bảo trì",

}

export const APPOINTMENT_STATUS_TRANSLATION: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: "Chờ xác nhận",
    [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
    [AppointmentStatus.CANCELLED]: "Đã hủy",
    [AppointmentStatus.IN_PROGRESS]: "Đang diễn ra",
    [AppointmentStatus.UNSUCCESSFUL]: "Không thành công",
    [AppointmentStatus.SUCCESSFUL]: "Thành công",
}

export const APPOINTMENT_BUILDING_STATUS_TRANSLATION: Record<AppointmentBuildingStatus, string> = {
    [AppointmentBuildingStatus.PENDING]: "Chờ xác nhận",
    [AppointmentBuildingStatus.CONFIRMED]: "Đã xác nhận",
    [AppointmentBuildingStatus.CANCELLED]: "Đã hủy",
    [AppointmentBuildingStatus.VIEWED]: "Đã xem",
    [AppointmentBuildingStatus.SUCCESSFUL]: "Thành công",
    [AppointmentBuildingStatus.UNSUCCESSFUL]: "Không thành công",

}