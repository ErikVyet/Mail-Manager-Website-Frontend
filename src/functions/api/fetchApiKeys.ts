import type { Dayjs } from "dayjs";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { Api } from "../../interfaces/Api";
import axios from "axios";

async function fetchApiKeys(token: string, fromDate: Dayjs | null, toDate: Dayjs | null): Promise<ResponseEntity<Api[]>> {
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

export { fetchApiKeys };