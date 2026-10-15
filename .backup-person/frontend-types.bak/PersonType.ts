export interface Person {
    [key: string]: unknown;
    id: string;
    fullName: string | null;
    firstName: string | null
    lastName: string | null;
    jobTitle: string | null;
    jobTitleRole: string | null;
    industry: string | null;
    jobCompanyName: string | null;
    jobCompanyIndustry: string | null;
    locationName: string | null;
    locationCountry: string | null;
    locationRegion: string | null;
    locationLocality: string | null;
    summary: string | null;
    skills: string[];
    interests: string[];
    linkedinConnections: number | null;
    inferredYearsExperience: number | null;
}

export interface SearchResult {
    items: Person[];
    total: number;
    page: number;
    limit: number;
}

export interface SearchParams {
    keyword?: string;
    skill?: string;
    jobTitle?: string;
    page?: number;
    limit?: number;
}
