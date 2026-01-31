import axios from 'axios';

const API_BASE_URL = 'https://agents.propertygenie.com.my/api';

/** Filters for properties-mock API. Request body supports: section, name, categories, types, bedRooms, bathRooms, minPrice, maxPrice, furnishings. No "location" field. */
export interface PropertyFilters {
    section?: 'sale' | 'rent';
    name?: string;
    categories?: string[];
    types?: string[];
    bedRooms?: number[];
    bathRooms?: number[];
    minPrice?: number;
    maxPrice?: number;
    furnishings?: string[]; // API values: "unfurnished" | "partially-furnished" | "fully-furnished"
    tenure?: string[];
    isAuction?: boolean;
    location?: string; // Used for URL/UI only; not sent to API (not in API spec)
}

export interface PropertyQueryParams {
    page?: number;
    sort?: string;
}

export interface Property {
    id: string;
    name: string;
    slug: string;
    type: string;
    category: string;
    section: string;
    image: string;
    bedRooms: number | null;
    bathRooms: number | null;
    floorSize: string | null;
    landSize: string | null;
    address: string;
    price: number;
    account: {
        id: string;
        name: string;
        email: string;
        phone: string;
        slug: string;
        avatar?: string;
        verified?: boolean;
    };
    country: string;
    state: string;
    city: string;
    postcode: string;
    furnishings: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
    isAuction?: boolean;
    createdAt: string;
}

export interface PropertiesResponse {
    items: Property[];
    total?: number;
    page?: number;
    totalPages?: number;
    _meta?: {
        totalCount: number;
        pageCount: number;
        currentPage: number;
        perPage: number;
    };
    _links?: {
        self: { href: string };
        first?: { href: string };
        next?: { href: string };
        last?: { href: string };
    };
}

/**
 * Fetch properties from the API with filters and pagination
 */
export async function fetchProperties(
    params: PropertyQueryParams = {},
    filters: PropertyFilters = {}
): Promise<PropertiesResponse> {
    try {
        const { page = 1, sort = '-createdAt' } = params;

        const response = await axios.post<PropertiesResponse>(
            `${API_BASE_URL}/properties-mock`,
            filters,
            {
                params: {
                    page,
                    sort,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw new Error('Failed to fetch properties. Please try again later.');
    }
}

/**
 * Get sort value for API based on user selection
 */
export function getSortValue(sortOption: string): string {
    const sortMap: Record<string, string> = {
        default: 'createdAt', // Spec: Default = earliest created date (oldest first)
        priceLowToHigh: 'price',
        priceHighToLow: '-price',
        floorSizeLowToHigh: 'floorSize',
        floorSizeHighToLow: '-floorSize',
        psfLowToHigh: 'psf',
        psfHighToLow: '-psf',
        newest: '-createdAt',
        oldest: 'createdAt',
    };

    return sortMap[sortOption] || 'createdAt';
}

export interface PropertyTypeOption {
    value: string;
    label: string;
}

/**
 * Fetch available property types from the API.
 * Tries dedicated endpoint first; falls back to deriving from properties response.
 */
export async function fetchPropertyTypes(category?: string): Promise<PropertyTypeOption[]> {
    try {
        const response = await axios.get<{ data?: PropertyTypeOption[]; types?: PropertyTypeOption[] }>(
            `${API_BASE_URL}/property-types`,
            category ? { params: { category } } : undefined
        );
        const data = response.data as any;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.types)) return data.types;
        if (Array.isArray(data)) return data;
    } catch {
        // Fallback: derive from properties list
    }
    try {
        const { data } = await axios.post<PropertiesResponse>(
            `${API_BASE_URL}/properties-mock`,
            { section: 'sale', ...(category && category !== 'all' ? { categories: [category] } : {}) },
            { params: { page: 1, sort: '-createdAt' } }
        );
        const items = data?.items || (Array.isArray(data) ? data : []);
        const typeSet = new Set<string>();
        items.forEach((p: Property) => {
            if (p.type && String(p.type).trim()) typeSet.add(String(p.type).trim());
        });
        const sorted = Array.from(typeSet).sort();
        return sorted.map((value) => ({
            value,
            label: value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        }));
    } catch {
        return [];
    }
}
