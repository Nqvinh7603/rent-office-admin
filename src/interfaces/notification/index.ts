
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
    consignmentId: number;
    createdAt: string;
    type: string;
    code: string;
}