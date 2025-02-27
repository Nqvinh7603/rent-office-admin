import { blue, green, grey, orange, red } from "@ant-design/colors";
import { SortOrder } from "antd/es/table/interface";
import { snakeCase } from "change-case";
import dayjs from "dayjs";
import { useEffect } from "react";
import { FileType } from "../interfaces";
import { ConsignmentStatus } from "../interfaces/common/enums";
export function useDynamicTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}

export function colorMethod(method: "GET" | "POST" | "PUT" | "DELETE") {
    switch (method) {
        case "POST":
            return green[5];
        case "PUT":
            return orange[5];
        case "GET":
            return blue[5];
        case "DELETE":
            return red[5];
        default:
            return grey[10];
    }
}


export function colorFilterIcon(filtered: boolean) {
    return filtered ? "#1a3d66" : "#fff";
}

export function colorSortUpIcon(sortOrder: SortOrder | undefined) {
    return sortOrder === "ascend" ? "#3162ad" : "#fff";
}

export function colorSortDownIcon(sortOrder: SortOrder | undefined) {
    return sortOrder === "descend" ? "#3162ad" : "#fff";
}


export function groupBy<T, K>(
    list: T[],
    keyGetter: (item: T) => K,
): Map<K, T[]> {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export function getDefaultSortOrder(
    searchParams: URLSearchParams,
    columnKey: string,
): SortOrder | undefined {
    const sortBy = searchParams.get("sortBy");
    const direction = searchParams.get("direction");

    if (sortBy === columnKey) {
        return direction === "asc"
            ? "ascend"
            : direction === "desc"
                ? "descend"
                : undefined;
    }
    return undefined;
}

export function getSortDirection(sortOrder: string): string | undefined {
    return sortOrder === "ascend"
        ? "asc"
        : sortOrder === "descend"
            ? "desc"
            : undefined;
}

export function getDefaultFilterValue(
    searchParams: URLSearchParams,
    key: string,
): string[] | undefined {
    const value = searchParams.get(key);
    return value ? value.split(",") : undefined;
}

export function formatTimestamp(timestamp: string) {
    return dayjs(timestamp).format("DD-MM-YYYY HH:mm:ss");
}

export async function getBase64(file: FileType): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}


export function formatCurrency(value: number | undefined): string {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseCurrency(value: string | undefined): number {
    return (value?.replace(/\$\s?|(,*)/g, "") as unknown as number) || 0;
}

export function isInDateRange(
    date: string,
    startDate: string,
    endDate: string,
): boolean {
    return dayjs(date).tz().isBetween(startDate, endDate, null, "[]");
}

export function toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(toSnakeCase);
    } else if (obj !== null && typeof obj === "object") {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[snakeCase(key)] = toSnakeCase(value);
            return acc;
        }, {} as Record<string, any>);
    }
    return obj;
}


export const colorConsignmentStatus = (status: string) => {
    switch (status) {
        case ConsignmentStatus.PENDING:
            return orange[5];
        case ConsignmentStatus.CONFIRMED:
            return green[5];
        case ConsignmentStatus.CANCELLED:
            return red[5];
        case ConsignmentStatus.INCOMPLETE:
            return grey[5];
        case ConsignmentStatus.ADDITIONAL_INFO:
            return blue[5];
        default:
            return grey[10];
    }
}

export const colorUserStatus = (status: boolean) => {
    switch (status) {
        case true:
            return green[7];
        case false:
            return red[7];
        default:
            return grey[10];
    }
}

export const colorRoleStatus = (status: boolean) => {
    switch (status) {
        case true:
            return green[7];
        case false:
            return red[7];
        default:
            return grey[10];
    }
}