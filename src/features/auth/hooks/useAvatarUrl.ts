import { useEffect, useState } from "react";
import { IUser } from "../../../interfaces/auth";

export const useAvatarUrl = (user: IUser | null) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.avatarUrl) {
            setAvatarUrl(user.avatarUrl);
        } else {
            setAvatarUrl(null);
        }
    }, [user]);

    return avatarUrl;
};