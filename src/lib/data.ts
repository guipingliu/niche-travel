import { Route, Attraction, Suggestion, Giver } from "@/types";
import request from "@/lib/request";

export async function getRoutes(): Promise<Route[]> {
    return request.get<any, Route[]>("/routes");
}

export async function getRoute(id: string): Promise<Route | undefined> {
    const routes = await getRoutes();
    return routes.find((r) => r.id === id);
}

export async function getAttractions(): Promise<Attraction[]> {
    return request.get<any, Attraction[]>("/attractions");
}

export async function getSuggestions(): Promise<Suggestion[]> {
    return request.get<any, Suggestion[]>("/suggestions");
}

export async function getGivers(): Promise<Giver[]> {
    return request.get<any, Giver[]>("/givers");
}

