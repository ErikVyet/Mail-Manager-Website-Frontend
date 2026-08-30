import axios from "axios";
import type { User } from "../../interfaces/User";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

async function fetchAdmin(token: string): Promise<ResponseEntity<User>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/admin/get-info`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
} 

export { fetchAdmin };