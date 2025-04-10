import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../../services";

export const useMarkAllRead = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationService.markAllRead(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        },
    });
};

export const useMarkNotificationRead = (userId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationId: number) =>
            notificationService.markNotificationRead(userId, notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        },
    });
};
