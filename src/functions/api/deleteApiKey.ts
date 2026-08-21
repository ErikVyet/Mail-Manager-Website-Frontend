import axios from "axios";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

async function deleteApiKey(token: string, key: string): Promise<ResponseEntity<any>> {
    const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_API as string}/dev/delete-api-key/${key}`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}

export { deleteApiKey };