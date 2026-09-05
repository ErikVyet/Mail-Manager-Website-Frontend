import axios from "axios";
import type { Activity } from "../interfaces/Activity";
import type { ResponseEntity } from "../interfaces/ResponseEntity";

export async function fetchPlanActivities(token: string): Promise<ResponseEntity<Activity[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/activity/plan/`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    });
    return data;
}