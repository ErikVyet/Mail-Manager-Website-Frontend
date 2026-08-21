import axios from "axios";
import type { Api } from "../../interfaces/Api";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

async function createApiKey(token: string): Promise<ResponseEntity<Api>> {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_API as string}/dev/create-api-key`, null, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}

export { createApiKey };