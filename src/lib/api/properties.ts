import axios from 'axios';

const API_BASE_URL = 'https://agents.propertygenie.com.my/api';

export interface PropertyFilters {
    section?: 'sale' | 'rent';
    name?: string;
    categories?: string[];
    types?: string[];
    bedRooms?: number[];
    bathRooms?: number[];
    minPrice?: number;
    maxPrice?: number;
    furnishings?: string[];
    tenure?: string[];
    isAuction?: boolean;
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
    createdAt: string;
}

export interface PropertiesResponse {
    items: Property[];
    total?: number;
    page?: number;
    totalPages?: number;
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
        default: '-createdAt',
        priceLowToHigh: 'price',
        priceHighToLow: '-price',
        floorSizeLowToHigh: 'floorSize',
        floorSizeHighToLow: '-floorSize',
        psfLowToHigh: 'psf',
        psfHighToLow: '-psf',
        newest: '-createdAt',
        oldest: 'createdAt',
    };

    return sortMap[sortOption] || '-createdAt';
}
