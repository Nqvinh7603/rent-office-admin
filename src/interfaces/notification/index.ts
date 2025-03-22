
export interface INotification {
    notificationId: number;
    consignmentId: number;
    message: string;
    status: boolean;
    // user: IUser;
    createdAt: string;
}

export interface INotificationEvent {
    notificationId: number;
    message: string;
    status: boolean;
    userId: string;
    buildingId: number;
    createdAt: string;
    type: string;
    code: string;
}