import { Module } from "../enums";

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
        GET_BY_ID: { method: "GET", apiPath: "/api/v1/permissions/{id}" },
        CREATE: { method: "POST", apiPath: "/api/v1/permissions" },
        UPDATE: { method: "PUT", apiPath: "/api/v1/permissions/{id}" },
        DELETE: { method: "DELETE", apiPath: "/api/v1/permissions/{id}" },
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
};
