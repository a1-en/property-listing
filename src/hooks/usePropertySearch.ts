import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PropertyFilters } from '@/lib/api/properties';

export function usePropertySearch() {
    const router = useRouter();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [savedSearchesOpen, setSavedSearchesOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [listingType, setListingType] = useState('sale');
    const [bedsBathsAnchor, setBedsBathsAnchor] = useState<null | HTMLElement>(null);
    const [beds, setBeds] = useState<string[]>([]);
    const [baths, setBaths] = useState<string[]>([]);
    const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
    const [locationSearch, setLocationSearch] = useState(
        () => router.query.location?.toString() || router.query.name?.toString() || ''
    );
    const [nameSearch, setNameSearch] = useState(router.query.name?.toString() || '');
    const [savedSearches, setSavedSearches] = useState<any[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('Searched results are saved');

    // Load saved searches on mount
    useEffect(() => {
        const saved = localStorage.getItem('saved_searches');
        if (saved) {
            setSavedSearches(JSON.parse(saved));
        }
    }, []);

    // Sync search box with URL
    useEffect(() => {
        if (!router.isReady) return;
        const loc = router.query.location?.toString() || '';
        const name = router.query.name?.toString() || '';
        const term = loc || name;
        setLocationSearch(term);
        setNameSearch(name);
        if (router.query.section) {
            setListingType(router.query.section as string);
        }
    }, [router.isReady, router.query.location, router.query.name, router.query.section]);

    const { page = '1', sort = 'default' } = router.query;
    const currentPage = parseInt(page as string, 10);
    const currentSort = sort as string;

    const getFilterCount = () => {
        let count = 0;
        const { minPrice, maxPrice, categories, types: typesQuery, tenure, furnishings, isAuction, bedRooms, bathRooms } = router.query;
        if (minPrice) count++;
        if (maxPrice) count++;
        if (categories || typesQuery) count += 1;
        if (tenure) count += (tenure as string).split(',').length;
        if (furnishings) count += (furnishings as string).split(',').length;
        if (isAuction === 'true') count++;
        if (bedRooms) count += (bedRooms as string).split(',').length;
        if (bathRooms) count += (bathRooms as string).split(',').length;
        return count;
    };

    const getBedsBathsCount = () => {
        let count = 0;
        if (router.query.bedRooms) {
            count += (router.query.bedRooms as string).split(',').length;
        }
        if (router.query.bathRooms) {
            count += (router.query.bathRooms as string).split(',').length;
        }
        return count;
    };

    const handleBedsBathsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (router.query.bedRooms) {
            setBeds((router.query.bedRooms as string).split(','));
        } else {
            setBeds([]);
        }
        if (router.query.bathRooms) {
            setBaths((router.query.bathRooms as string).split(','));
        } else {
            setBaths([]);
        }
        setBedsBathsAnchor(event.currentTarget);
    };

    const handleBedsBathsClose = () => setBedsBathsAnchor(null);
    const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => setSortAnchor(event.currentTarget);
    const handleSortClose = () => setSortAnchor(null);

    const handleBedsBathsApply = () => {
        handleBedsBathsClose();
        const query: any = { ...router.query, page: 1 };
        if (beds.length > 0) query.bedRooms = beds.join(',');
        else delete query.bedRooms;
        if (baths.length > 0) query.bathRooms = baths.join(',');
        else delete query.bathRooms;
        router.push({ pathname: '/', query });
    };

    const handleBedsBathsClear = () => {
        setBeds([]);
        setBaths([]);
        handleBedsBathsClose();
        const query = { ...router.query };
        delete query.bedRooms;
        delete query.bathRooms;
        router.push({ pathname: '/', query });
    };

    const handleSearch = () => {
        const query: any = { ...router.query, page: 1 };
        const searchTerm = (locationSearch || nameSearch || '').trim();
        if (searchTerm) {
            query.location = searchTerm;
            query.name = searchTerm;
        } else {
            delete query.location;
            delete query.name;
        }
        router.push({ pathname: '/', query });
    };

    const handleSaveSearch = () => {
        let generatedName = nameSearch || locationSearch;
        if (!generatedName) {
            generatedName = 'General Search';
        }

        if (generatedName === 'General Search' && getFilterCount() === 0 && getBedsBathsCount() === 0) {
            return;
        }

        const currentQuery: any = { ...router.query, location: locationSearch, name: nameSearch };
        // Remove transient parameters like 'page' from comparison
        const { page: _p, ...cleanCurrentQuery } = currentQuery;

        const isDuplicate = savedSearches.some(search => {
            const { page: _sp, ...cleanSavedQuery } = search.query;
            const currentKeys = Object.keys(cleanCurrentQuery).sort();
            const savedKeys = Object.keys(cleanSavedQuery).sort();

            if (currentKeys.length !== savedKeys.length) return false;
            return currentKeys.every(key => String(cleanCurrentQuery[key]) === String(cleanSavedQuery[key]));
        });

        if (isDuplicate) {
            setSnackbarMessage('This search is already saved');
            setSnackbarOpen(true);
            return;
        }

        const newSave = {
            id: Date.now(),
            name: generatedName,
            query: currentQuery,
            timestamp: new Date().toISOString(),
            filters: getFilterCount() + getBedsBathsCount()
        };
        const updated = [newSave, ...savedSearches];
        setSavedSearches(updated);
        localStorage.setItem('saved_searches', JSON.stringify(updated));
        setSnackbarMessage('Searched results are saved');
        setSnackbarOpen(true);
    };

    const handleDeleteSavedSearch = (id: number) => {
        const updated = savedSearches.filter(s => s.id !== id);
        setSavedSearches(updated);
        localStorage.setItem('saved_searches', JSON.stringify(updated));
    };

    const applySavedSearch = (search: any) => {
        setLocationSearch(search.query.location || '');
        setNameSearch(search.query.name || '');
        router.push({ pathname: '/', query: search.query });
        setSavedSearchesOpen(false);
    };

    const handleSortChange = (newSort: string) => {
        router.push({ pathname: '/', query: { ...router.query, sort: newSort, page: 1 } });
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        router.push({ pathname: '/', query: { ...router.query, page: value } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSectionChange = (val: string) => {
        setListingType(val);
        router.push({ pathname: '/', query: { ...router.query, section: val, page: 1 } });
    };

    const handleFilterChange = (filters: PropertyFilters) => {
        const query: any = { page: 1, sort: currentSort };
        if (locationSearch) query.location = locationSearch;
        if (nameSearch) query.name = nameSearch;
        if (filters.minPrice) query.minPrice = filters.minPrice.toString();
        if (filters.maxPrice) query.maxPrice = filters.maxPrice.toString();
        if (filters.categories?.length) query.categories = filters.categories.join(',');
        if (filters.types?.length) query.types = filters.types.join(',');
        if (filters.bedRooms?.length) query.bedRooms = filters.bedRooms.join(',');
        if (filters.bathRooms?.length) query.bathRooms = filters.bathRooms.join(',');
        if (filters.tenure?.length) query.tenure = filters.tenure.join(',');
        if (filters.furnishings?.length) query.furnishings = filters.furnishings.join(',');
        if (filters.isAuction) query.isAuction = 'true';
        if (listingType) query.section = listingType;

        router.push({ pathname: '/', query });
        setMobileFiltersOpen(false);
    };

    return {
        state: {
            mobileFiltersOpen,
            savedSearchesOpen,
            viewMode,
            listingType,
            bedsBathsAnchor,
            beds,
            baths,
            sortAnchor,
            locationSearch,
            nameSearch,
            savedSearches,
            snackbarOpen,
            snackbarMessage,
            currentPage,
            currentSort,
            getFilterCount,
            getBedsBathsCount
        },
        actions: {
            setMobileFiltersOpen,
            setSavedSearchesOpen,
            setViewMode,
            setListingType,
            setLocationSearch,
            setNameSearch,
            setSnackbarOpen,
            setBeds,
            setBaths,
            handleBedsBathsClick,
            handleBedsBathsClose,
            handleSortClick,
            handleSortClose,
            handleBedsBathsApply,
            handleBedsBathsClear,
            handleSearch,
            handleSaveSearch,
            handleDeleteSavedSearch,
            applySavedSearch,
            handleSortChange,
            handlePageChange,
            handleSectionChange,
            handleFilterChange
        }
    };
}
