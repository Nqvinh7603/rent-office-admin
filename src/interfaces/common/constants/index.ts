import { ConsignmentStatus, Module, PotentialCustomerStatus } from "../enums";

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
    },
    [Module.CONSIGNMENTS]: {
        GET_CONSIGNMENT_PAGINATION: { method: "GET", apiPath: "/api/v1/consignments" },
        UPDATE_CONSIGNMENT: { method: "PUT", apiPath: "/api/v1/consignments/{id}" },
        DELETE_CONSIGNMENT: { method: "DELETE", apiPath: "/api/v1/consignments/{id}" },
        GET_CONSIGNMENT_BY_ID: { method: "GET", apiPath: "/api/v1/consignments/{id}" },
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
    },
    [Module.NOTIFICATIONS]: {
        MARK_ALL_AS_READ: { method: "PUT", apiPath: "/api/v1/notifications/mark-all-read" },
        MARK_AS_READ: { method: "PUT", apiPath: "/api/v1/notifications/{id}/mark-read" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/notifications" },
        GET_NOTIFICATIONS_BY_USER_ID: { method: "GET", apiPath: "/api/v1/notifications/user/{id}" },
    }
};


export const CONSIGNMENT_STATUS_TRANSLATION: Record<ConsignmentStatus, string> = {
    [ConsignmentStatus.PENDING]: "Chờ xác nhận",
    [ConsignmentStatus.INCOMPLETE]: "Yêu cầu bổ sung thông tin",
    [ConsignmentStatus.ADDITIONAL_INFO]: "Đã thêm thông tin",
    [ConsignmentStatus.CANCELLED]: "Từ chối",
    [ConsignmentStatus.CONFIRMED]: "Chấp nhận",
};


export const USER_STATUS_TRANSLATION: Record<string, string> = {
    true: "Đang hoạt động",
    false: "Ngừng hoạt động",
};


export const ROLE_STATUS_TRANSLATION: Record<string, string> = {
    true: "Đang hoạt động",
    false: "Ngừng hoạt động",
};

export const POTENTIAL_CUSTOMER_STATUS_TRANSLATION: Record<PotentialCustomerStatus, string> = {
    [PotentialCustomerStatus.CONTACTED_NO_RESPONSE]: "Đã liên hệ - Không phản hồi",
    [PotentialCustomerStatus.CONTACTED_SCHEDULED]: "Đã liên hệ - Hẹn gọi lại",
    [PotentialCustomerStatus.NOT_CONTACTED]: "Chưa liên hệ",
    [PotentialCustomerStatus.DEAL_DONE]: "Tư vấn thành công",
    [PotentialCustomerStatus.IN_PROGRESS]: "Đang trong quá trình làm việc",
    [PotentialCustomerStatus.CANCELED]: "Đã hủy",
}