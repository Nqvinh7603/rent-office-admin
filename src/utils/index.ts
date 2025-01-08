import { useEffect } from "react";
import { blue, green, grey, orange, red } from "@ant-design/colors";
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

// export function colorFilterIcon(filtered: boolean) {
//     return filtered ? "#3b82f6" : "#fff";
// }

// export function colorSortUpIcon(sortOrder: SortOrder | undefined) {
//     return sortOrder === "ascend" ? "#3b82f6" : "#fff";
// }

// export function colorSortDownIcon(sortOrder: SortOrder | undefined) {
//     return sortOrder === "descend" ? "#3b82f6" : "#fff";
// }