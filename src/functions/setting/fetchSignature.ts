import axios from "axios";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

async function fetchSignature(token: string): Promise<ResponseEntity<string>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/setting/signature`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}

export { fetchSignature };