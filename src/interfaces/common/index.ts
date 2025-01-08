import { UploadProps } from "antd";
import { GetProp } from "antd/lib";

export interface ApiResponse<T> {
    payload?: T;
    error?: string;
    message?: string;
    status: number;
}

export interface ApiResponse<T> {
    payload?: T;
    error?: string;
    message?: string;
    status: number;
}

export interface PaginationParams {
    page: number;
    page_size: number;
}

export interface PaginationMeta {
    page: number;
    page_size: number;
    pages: number;
    total: number;
}

export interface Page<T> {
    content: T[];
    meta: PaginationMeta;
}

export interface SortParams {
    sortBy: string;
    direction: string;
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];