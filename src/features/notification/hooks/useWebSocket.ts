// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
// import { INotificationEvent } from "../../../interfaces";

// const useWebSocket = (url: string) => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
//     const audio = new Audio("/sound/noti.wav");
//     useEffect(() => {
//         const socket = new WebSocket(url);

//         socket.onopen = () => {
//             console.log("✅ WebSocket connection established");
//         };

//         socket.onmessage = (event) => {

//             const isDarkMode = document.documentElement.classList.contains("dark");
//             try {
//                 const data: INotificationEvent = JSON.parse(event.data);
//                 audio.play();
//                 toast(`🔔 ${data.message}`, {
//                     onClick: () => {
//                         navigate(`/consignments/${data.consignmentId}`);
//                     },
//                     autoClose: 10000,
//                     pauseOnHover: true,
//                     closeOnClick: true,
//                     position: "top-right",
//                     theme: isDarkMode ? "dark" : "light",
//                 });

//                 queryClient.invalidateQueries({
//                     queryKey: ["notifications"],
//                 });


//             } catch (error) {
//                 toast.error("❌ Không thể xử lý thông báo mới!", {
//                     autoClose: 10000,
//                     theme: isDarkMode ? "dark" : "light",
//                 });
//             }
//         };

//         socket.onclose = () => {
//             console.warn("⚠️ WebSocket connection closed");
//         };

//         return () => {
//             socket.close();
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
        };

        socket.onmessage = async (event) => {
            const isDarkMode = document.documentElement.classList.contains("dark");

            try {
                const data: INotificationEvent = JSON.parse(event.data);

                // Phát âm thanh nếu có thể
                try {
                    await audioRef.current.play();
                } catch (audioError) {
                    console.warn("🔇 Không thể phát âm thanh thông báo:", audioError);
                }

                toast(`🔔 ${data.message}`, {
                    onClick: () => navigate(`/consignments/${data.consignmentId}`),
                    autoClose: 10000,
                    pauseOnHover: true,
                    closeOnClick: true,
                    position: "top-right",
                    theme: isDarkMode ? "dark" : "light",
                });

                queryClient.invalidateQueries({ queryKey: ["notifications"] });
            } catch (error) {
                console.error("❌ Lỗi khi xử lý thông báo WebSocket:", error);
                toast.error("❌ Không thể xử lý thông báo mới!", {
                    autoClose: 10000,
                    theme: isDarkMode ? "dark" : "light",
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
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [url, navigate, queryClient]);

    return null;
};

export default useWebSocket;