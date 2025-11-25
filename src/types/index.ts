export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface Giver {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    tags: string[];
}

export interface Activity {
    name: string;
    image?: string;
}

export interface RouteDay {
    id?: string;
    day: number;
    title: string;
    description: string;
    activities: Activity[];
}

export interface Route {
    id: string;
    title: string;
    price: number;
    duration: string; // e.g. "3 Days 2 Nights"
    intensity: IntensityLevel;
    groupSize: number; // Max 20
    tags: string[]; // e.g. "City Walk", "Local Life"
    description: string;
    images: string[];
    itinerary: RouteDay[];
    giver: Giver;
    nextDeparture?: string;
    mapImage?: string;
}

export interface Attraction {
    id: string;
    name: string;
    location: string;
    description: string;
    hiddenGemScore: number; // 1-10
    vibeTags: string[]; // e.g. "Quiet", "Retro", "Photogenic"
    images: string[];
}

export interface Suggestion {
    id: string;
    title: string;
    category: "Preparation" | "Culture" | "Safety" | "Food";
    content: string;
    author: string;
    createdAt: string;
}
