import axios from "axios";
import type { Plan } from "../interfaces/Plan";
import type { ResponseEntity } from "../interfaces/ResponseEntity";
import type { PlanTimelineRevenue } from "../interfaces/PlanTimelineRevenue";
import type { Timeline } from "../enums/Timeline";

export async function fetchPlans(token: string): Promise<ResponseEntity<Plan[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function fetchPlan(token: string, id: number): Promise<ResponseEntity<Plan>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function fetchActivePlans(): Promise<ResponseEntity<Plan[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/active`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
        }
    });
    return data;
}

export async function fetchPlanSubscriptionCounts(token: string): Promise<ResponseEntity<{ name: string, count: number }[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/subscription-counts`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function fetchPlanNewSignUpCounts(token: string): Promise<ResponseEntity<{ month: string, count: number }[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/new-signup-counts`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function fetchPlanTimelineRevenues(token: string, timeline: Timeline, planIds?: number[]): Promise<ResponseEntity<PlanTimelineRevenue[]>> {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API as string}/plan/revenue`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        params: {
            timeline, planIds
        },
        withCredentials: true
    });
    return data;
}

export async function createPlan(token: string, plan: Plan): Promise<ResponseEntity<Plan>> {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_API as string}/plan/`, plan, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function deletePlan(token: string, id: number): Promise<ResponseEntity<void>> {
    const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_API as string}/plan/delete/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function updatePlan(token: string, plan: Plan): Promise<ResponseEntity<void>> {
    const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_API as string}/plan/update`, plan, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}

export async function updatePlanStatus(token: string, id: number, active: boolean): Promise<ResponseEntity<void>> {
    const { data } = await axios.patch(`${import.meta.env.VITE_BACKEND_API as string}/plan/update/status/${id}/${active}`, null, {
        headers: {
            "Content-Type": "application/json",
            "Api-Key": import.meta.env.VITE_BACKEND_API_KEY as string,
            "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
    });
    return data;
}