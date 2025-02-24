import { AxiosInstance } from "axios";
import { INotification } from "../../interfaces";
import { ApiResponse } from "../../interfaces/common";
import { createApiClient } from "../api-client";

interface INotificationService {
    markAllRead(userId: string): Promise<ApiResponse<void>>;
    markNotificationRead(userId: string, notificationId: number): Promise<ApiResponse<void>>;
    deleteNotification(notifications: number[]): Promise<ApiResponse<void>>;
    getNotifications(userId: string): Promise<ApiResponse<INotification[]>>;
}

const apiClient: AxiosInstance = createApiClient("notifications");
class NotificationService implements INotificationService {
    async getNotifications(userId: string): Promise<ApiResponse<INotification[]>> {
        return (await apiClient.get(`/user/${userId}`)).data;
    }
    async markAllRead(userId: string): Promise<ApiResponse<void>> {
        return (await apiClient.put(`/mark-all-read`, null, { params: { userId } })).data;
    }

    async markNotificationRead(userId: string, notificationId: number): Promise<ApiResponse<void>> {
        return (await apiClient.put(`/${notificationId}/mark-read`, null, { params: { userId } })).data;
    }

    async deleteNotification(notifications: number[]): Promise<ApiResponse<void>> {
        return (await apiClient.delete("", {
            headers: { "Content-Type": "application/json" },
            data: notifications
        })).data;
    }
}

export const notificationService = new NotificationService();
