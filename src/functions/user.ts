import axios from "axios";
import type { ResponseEntity } from "../interfaces/ResponseEntity";
import type { User } from "../interfaces/User";

export async function fetchUser(token: string): Promise<ResponseEntity<User>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/user/info`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string
        },
        withCredentials: true
    });
    return data;
}

export async function updateUser(user: User, token: string) {
    const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_API as string}/user/info/update`, user, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}