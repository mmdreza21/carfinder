export const PERSON_INDEX = 'people';

export const personIndexMapping = {
    mappings: {
        properties: {
            id: { type: 'keyword' },

            fullName: { type: 'text' },
            firstName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
            lastName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
            jobTitle: { type: 'text', fields: { keyword: { type: 'keyword' } } },
            jobTitleRole: { type: 'keyword' },
            industry: { type: 'keyword' },

            jobCompanyName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
            jobCompanyIndustry: { type: 'keyword' },

            locationName: { type: 'text' },
            locationCountry: { type: 'keyword' },
            locationRegion: { type: 'keyword' },
            locationLocality: { type: 'keyword' },

            summary: { type: 'text' },

            skills: { type: 'keyword' },
            interests: { type: 'keyword' },

            linkedinConnections: { type: 'integer' },
            inferredYearsExperience: { type: 'float' },
        },
    },
} as const;
