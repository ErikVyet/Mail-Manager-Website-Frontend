import axios from "axios";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";

async function regenerateSignature(token: string): Promise<ResponseEntity<string>> {
    const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_API as string}/setting/signature/regenerate`, null, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}

export { regenerateSignature };