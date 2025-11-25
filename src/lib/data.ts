import { prisma } from "@/lib/db";
import { Route, Attraction, Suggestion, Giver } from "@/types";

export async function getRoutes(): Promise<Route[]> {
    const routes = await prisma.route.findMany({
        include: {
            giver: true,
            itinerary: {
                include: {
                    activities: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    day: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return routes.map((route: any) => ({
        ...route,
        tags: JSON.parse(route.tags),
        images: JSON.parse(route.images),
        nextDeparture: route.nextDeparture ? route.nextDeparture.toISOString() : undefined,
        giver: {
            ...route.giver,
            tags: JSON.parse(route.giver.tags)
        },
        itinerary: route.itinerary.map((day: any) => ({
            ...day,
            activities: day.activities.map((act: any) => ({
                name: act.name,
                image: act.image || undefined
            }))
        }))
    })) as unknown as Route[];
}

export async function getRoute(id: string): Promise<Route | undefined> {
    const route = await prisma.route.findUnique({
        where: { id },
        include: {
            giver: true,
            itinerary: {
                include: {
                    activities: {
                        orderBy: {
                            order: 'asc'
                        }
                    }
                },
                orderBy: {
                    day: 'asc'
                }
            }
        }
    });

    if (!route) return undefined;

    return {
        ...route,
        tags: JSON.parse(route.tags),
        images: JSON.parse(route.images),
        nextDeparture: route.nextDeparture ? route.nextDeparture.toISOString() : undefined,
        giver: {
            ...route.giver,
            tags: JSON.parse(route.giver.tags)
        },
        itinerary: route.itinerary.map((day: any) => ({
            ...day,
            activities: day.activities.map((act: any) => ({
                name: act.name,
                image: act.image || undefined
            }))
        }))
    } as unknown as Route;
}

export async function getAttractions(): Promise<Attraction[]> {
    const attractions = await prisma.attraction.findMany({
        orderBy: {
            hiddenGemScore: 'desc'
        }
    });

    return attractions.map((attraction: any) => ({
        ...attraction,
        vibeTags: JSON.parse(attraction.vibeTags),
        images: JSON.parse(attraction.images)
    }));
}

export async function getSuggestions(): Promise<Suggestion[]> {
    const suggestions = await prisma.suggestion.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return suggestions.map((s: any) => ({
        ...s,
        createdAt: s.createdAt.toISOString().split('T')[0]
    })) as unknown as Suggestion[];
}

export async function getGivers(): Promise<Giver[]> {
    const givers = await prisma.giver.findMany();
    return givers.map((giver: any) => ({
        ...giver,
        tags: JSON.parse(giver.tags)
    }));
}
