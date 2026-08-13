import axios from "axios";
import type { User } from "../../interfaces/User";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

export async function fetchUser(token: string): Promise<ResponseEntity<User>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/user/get-info`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string
        },
        withCredentials: true
    });
    return data;
}