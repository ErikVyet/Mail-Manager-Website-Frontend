import axios from "axios";
import type { User } from "../../interfaces/User";

async function updateUser(user: User, token: string) {
    const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_API as string}/user/update-info`, user, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}

export { updateUser };