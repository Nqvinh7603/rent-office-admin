import { AxiosInstance } from "axios";
import { IAuthRequest, IAuthResponse, IForgotPasswordRequest, IResetPasswordRequest } from "../../interfaces/auth";
import { ApiResponse } from "../../interfaces/common";
import { createApiClient } from "../api-client";

interface IAuthService {
    login(authRequest: IAuthRequest): Promise<ApiResponse<IAuthResponse>>;
    logout(): Promise<ApiResponse<void>>;
    forgotPassword(forgotPasswordRequest: IForgotPasswordRequest): Promise<ApiResponse<string>>;
    resetPassword(resetPasswordRequest: IResetPasswordRequest): Promise<ApiResponse<string>>;
    verifyResetToken(token: string): Promise<ApiResponse<string>>;
}

const apiClient: AxiosInstance = createApiClient("auth", { auth: false });
class AuthService implements IAuthService {

    async login(authRequest: IAuthRequest): Promise<ApiResponse<IAuthResponse>> {
        return (await apiClient.post("/login", authRequest)).data;
    }

    async logout(): Promise<ApiResponse<void>> {
        return (await apiClient.post("/logout")).data;
    }

    async forgotPassword(forgotPasswordRequest: IForgotPasswordRequest): Promise<ApiResponse<string>> {
        return (await apiClient.post("/forgot-password", forgotPasswordRequest)).data;
    }

    async resetPassword(resetPasswordRequest: IResetPasswordRequest): Promise<ApiResponse<string>> {
        return (await apiClient.post("/reset-password", resetPasswordRequest)).data;
    }

    async verifyResetToken(token: string): Promise<ApiResponse<string>> {
        return (
            await apiClient.get(`/verify-reset-token`, {
                params: { token },
            })
        ).data;
    }
}

export const authService = new AuthService();
