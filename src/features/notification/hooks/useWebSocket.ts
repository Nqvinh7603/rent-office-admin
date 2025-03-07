// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
// import { INotificationEvent } from "../../../interfaces";

// const useWebSocket = (url: string) => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
//     const socketRef = useRef<WebSocket | null>(null);
//     const audioRef = useRef(new Audio("/sound/noti.wav"));

//     useEffect(() => {
//         if (!url) return;

//         const socket = new WebSocket(url);
//         socketRef.current = socket;

//         socket.onopen = () => {
//             console.log("✅ WebSocket connection established");
//         };

//         socket.onmessage = async (event) => {
//             const isDarkMode = document.documentElement.classList.contains("dark");

//             try {
//                 const data: INotificationEvent = JSON.parse(event.data);


//                 try {
//                     await audioRef.current.play();
//                 } catch (audioError) {
//                     console.warn("🔇 Không thể phát âm thanh thông báo:", audioError);
//                 }

//                 toast(`🔔 ${data.message}`, {
//                     onClick: () => navigate(`/consignments/${data.consignmentId}`),
//                     autoClose: 10000,
//                     pauseOnHover: true,
//                     closeOnClick: true,
//                     position: "top-right",
//                     theme: isDarkMode ? "dark" : "light",
//                 });

//                 queryClient.invalidateQueries({ queryKey: ["notifications"] });
//             } catch (error) {
//                 console.error("❌ Lỗi khi xử lý thông báo WebSocket:", error);
//                 toast.error("❌ Không thể xử lý thông báo mới!", {
//                     autoClose: 10000,
//                     theme: isDarkMode ? "dark" : "light",
//                 });
//             }
//         };

//         socket.onclose = () => {
//             console.warn("⚠️ WebSocket connection closed");
//         };

//         socket.onerror = (error) => {
//             console.error("🚨 WebSocket error:", error);
//         };

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.close();
//             }
//         };
//     }, [url, navigate, queryClient]);

//     return null;
// };

// export default useWebSocket;

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { INotificationEvent } from "../../../interfaces";

const useWebSocket = (url: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const socketRef = useRef<WebSocket | null>(null);
    const audioRef = useRef(new Audio("/sound/noti.wav"));

    useEffect(() => {
        if (!url) return;

        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("✅ WebSocket connection established");
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        };

        socket.onmessage = async (event) => {
            const isDarkMode = document.documentElement.classList.contains("dark");
            try {
                const data: INotificationEvent = JSON.parse(event.data);

                // Trường hợp người dùng đang xem tab
                if (!document.hidden) {
                    try {
                        audioRef.current.play();
                    } catch (error) {
                        console.warn("Không phát được âm thanh:", error);
                    }

                    toast(`🔔 ${data.message}`, {
                        onClick: () => navigate(`/consignments/${data.consignmentId}`),
                        autoClose: 10000,
                        pauseOnHover: true,
                        closeOnClick: true,
                        position: "top-right",
                        theme: isDarkMode ? "dark" : "light",
                    });
                } else if (Notification.permission === "granted") {
                    // Trường hợp tab đang ẩn, hiển thị thông báo native
                    const notification = new Notification("🔔 Thông báo mới", {
                        body: data.message,
                        icon: "/favicon.ico", // tùy chọn icon
                    });

                    notification.onclick = () => {
                        window.focus();
                        navigate(`/consignments/${data.consignmentId}`);
                        notification.close();
                    };
                }

                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            } catch (error) {
                console.error("❌ Lỗi khi xử lý thông báo:", error);
                toast.error("❌ Không thể xử lý thông báo mới!", {
                    autoClose: 10000,
                    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
                });
            }
        };

        socket.onclose = () => {
            console.warn("⚠️ WebSocket connection closed");
        };

        socket.onerror = (error) => {
            console.error("🚨 WebSocket error:", error);
        };

        return () => {
            socket.close();
        };
    }, [url, navigate, queryClient]);

    // Request permission on first load
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    return null;
};

export default useWebSocket;