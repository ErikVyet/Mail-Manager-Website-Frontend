import axios from "axios";
import type { Api } from "../interfaces/Api";
import type { ResponseEntity } from "../interfaces/ResponseEntity";
import type { Dayjs } from "dayjs";

export async function createApiKey(token: string): Promise<ResponseEntity<Api>> {
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

export async function deleteApiKey(token: string, key: string): Promise<ResponseEntity<any>> {
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

export async function fetchApiKeys(token: string, fromDate: Dayjs | null, toDate: Dayjs | null): Promise<ResponseEntity<Api[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/dev/`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        params: { fromDate: fromDate?.toISOString() ?? null, toDate: toDate?.toISOString() ?? null },
        withCredentials: true
    });
    return data;
}