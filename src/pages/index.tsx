import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Grid,
  Container,
  Box,
  Typography,
  Pagination,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  Breadcrumbs,
  Link,
  Stack,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FilterListIcon from '@mui/icons-material/FilterList';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { Sort as SortIcon } from '@mui/icons-material';

import PropertyCard from '@/components/PropertyCard';
import Filters from '@/components/Filters';
import SearchHeader from '@/components/SearchHeader/SearchHeader';
import Sidebar from '@/components/Sidebar/Sidebar';
import SavedSearches from '@/components/SavedSearches/SavedSearches';
import SortPopover from '@/components/SortPopover/SortPopover';

import { usePropertySearch } from '@/hooks/usePropertySearch';
import {
  fetchProperties,
  PropertiesResponse,
  PropertyFilters,
  getSortValue,
  fetchPropertyTypes,
  PropertyTypeOption,
} from '@/lib/api/properties';

interface HomeProps {
  initialData: PropertiesResponse;
  propertyTypes?: PropertyTypeOption[];
  error?: string;
}

export default function Home({ initialData, propertyTypes = [], error }: HomeProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { state, actions } = usePropertySearch();

  const getBedsBathsLabel = () => {
    const bedsArr = router.query.bedRooms ? (router.query.bedRooms as string).split(',') : [];
    const bathsArr = router.query.bathRooms ? (router.query.bathRooms as string).split(',') : [];
    let label = "";
    if (bedsArr.length === 1) label += `${bedsArr[0]} bed`;
    else if (bedsArr.length > 1) label += `${bedsArr.length} beds`;
    if (bathsArr.length > 0) {
      if (label) label += " & ";
      if (bathsArr.length === 1) label += `${bathsArr[0]} bath`;
      else label += `${bathsArr.length} baths`;
    }
    return label || "Beds & Baths";
  };

  const getSortLabel = (sortValue: string) => {
    const labels: Record<string, string> = {
      default: 'Recommended',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      floorSizeLowToHigh: 'Floor Size: Low to High',
      floorSizeHighToLow: 'Floor Size: High to Low',
      psfLowToHigh: 'PSF: Low to High',
      psfHighToLow: 'PSF: High to Low',
      newest: 'Newest Listings',
      oldest: 'Oldest Listings',
    };
    return labels[sortValue] || 'Sort By';
  };

  const getCurrentFilters = (): PropertyFilters => {
    const filters: PropertyFilters = {};
    if (router.query.minPrice) filters.minPrice = parseFloat(router.query.minPrice as string);
    if (router.query.maxPrice) filters.maxPrice = parseFloat(router.query.maxPrice as string);
    if (router.query.categories) filters.categories = (router.query.categories as string).split(',');
    if (router.query.types) filters.types = (router.query.types as string).split(',').filter(Boolean);
    if (router.query.bedRooms) filters.bedRooms = (router.query.bedRooms as string).split(',').map(n => parseInt(n, 10));
    if (router.query.bathRooms) filters.bathRooms = (router.query.bathRooms as string).split(',').map(n => parseInt(n, 10));
    if (router.query.tenure) filters.tenure = (router.query.tenure as string).split(',');
    if (router.query.furnishings) filters.furnishings = (router.query.furnishings as string).split(',');
    if (router.query.isAuction === 'true') filters.isAuction = true;
    return filters;
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/">Home</Link>
          <Typography color="text.primary">Properties</Typography>
        </Breadcrumbs>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Head>
        <title>Property Genie - Assesment</title>
        <meta name="description" content="Browse thousands of properties for sale and rent in Malaysia" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 3, overflow: 'hidden', minWidth: 0 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3, flexWrap: 'wrap' }}>
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.9rem' }}>Home</Link>
          <Typography color="text.primary" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
            Properties for {state.listingType === 'rent' ? 'Rent' : 'Sale'}
          </Typography>
        </Breadcrumbs>

        <SearchHeader
          locationSearch={state.locationSearch}
          setLocationSearch={actions.setLocationSearch}
          setNameSearch={actions.setNameSearch}
          handleSearch={actions.handleSearch}
          filterCount={state.getFilterCount()}
          setMobileFiltersOpen={actions.setMobileFiltersOpen}
          bedsBathsCount={state.getBedsBathsCount()}
          bedsBathsLabel={getBedsBathsLabel()}
          handleBedsBathsClick={actions.handleBedsBathsClick}
          listingType={state.listingType}
          handleSectionChange={actions.handleSectionChange}
          handleSaveSearch={actions.handleSaveSearch}
          savedSearchesCount={state.savedSearches.length}
          setSavedSearchesOpen={actions.setSavedSearchesOpen}
          router={router}
          openBedsBaths={Boolean(state.bedsBathsAnchor)}
          bedsBathsAnchor={state.bedsBathsAnchor}
          handleBedsBathsClose={actions.handleBedsBathsClose}
          handleBedsBathsClear={actions.handleBedsBathsClear}
          beds={state.beds}
          setBeds={actions.setBeds}
          baths={state.baths}
          setBaths={actions.setBaths}
          handleBedsBathsApply={actions.handleBedsBathsApply}
          priceAnchor={state.priceAnchor}
          minPrice={state.minPrice}
          maxPrice={state.maxPrice}
          setMinPrice={actions.setMinPrice}
          setMaxPrice={actions.setMaxPrice}
          handlePriceClick={actions.handlePriceClick}
          handlePriceClose={actions.handlePriceClose}
          handlePriceApply={actions.handlePriceApply}
          handlePriceClear={actions.handlePriceClear}
        />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 9 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3, minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, minWidth: 0 }}>
                {initialData?.total?.toLocaleString()} Properties for {state.listingType === 'rent' ? 'Rent' : 'Sale'} in Malaysia
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={actions.handleSortClick}
                  sx={{ borderRadius: 1, px: 2, py: 1, borderColor: '#E2E8F0', color: 'text.primary', fontWeight: 500, textTransform: 'none', bgcolor: 'white', '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' } }}
                >
                  {getSortLabel(state.currentSort)}
                </Button>

                <SortPopover
                  open={Boolean(state.sortAnchor)}
                  anchorEl={state.sortAnchor}
                  onClose={actions.handleSortClose}
                  currentSort={state.currentSort}
                  handleSortChange={actions.handleSortChange}
                  getSortLabel={getSortLabel}
                />

                <ToggleButtonGroup
                  value={state.viewMode}
                  exclusive
                  onChange={(e, val) => val && actions.setViewMode(val)}
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 1, height: 40, '& .MuiToggleButton-root': { border: 'none', width: 48, color: '#94A3B8', '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } } }}
                >
                  <ToggleButton value="grid">
                    <Tooltip title="Grid View" arrow><GridViewIcon fontSize="small" /></Tooltip>
                  </ToggleButton>
                  <ToggleButton value="list" sx={{ borderLeft: '1px solid #E2E8F0 !important' }}>
                    <Tooltip title="List View" arrow><ViewListIcon fontSize="small" /></Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Box>

            {(!initialData || !initialData.items || initialData.items.length === 0) ? (
              <Alert severity="info" sx={{ mt: 4, borderRadius: 1 }}>
                No properties found matching your criteria. Try adjusting your filters.
              </Alert>
            ) : (
              <>
                <Grid container spacing={3}>
                  {initialData.items.map((property: any, index: number) => (
                    <Grid size={{ xs: 12, sm: state.viewMode === 'list' ? 12 : 6, md: state.viewMode === 'list' ? 12 : 4 }} key={property.id || property._id}>
                      <PropertyCard property={property} viewMode={state.viewMode} index={index} />
                    </Grid>
                  ))}
                </Grid>

                {initialData.totalPages && initialData.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={initialData.totalPages}
                      page={state.currentPage}
                      onChange={actions.handlePageChange}
                      color="primary"
                      shape="rounded"
                      size={isMobile ? 'medium' : 'large'}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>

          <Sidebar totalCount={initialData?.total || 0} listingType={state.listingType} />
        </Grid>
      </Container>

      <Dialog open={state.mobileFiltersOpen} onClose={() => actions.setMobileFiltersOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 1, maxHeight: '90vh' } }}>
        <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon sx={{ color: 'text.primary' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Filter Properties</Typography>
          </Stack>
          <IconButton onClick={() => actions.setMobileFiltersOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Filters propertyTypes={propertyTypes} onFilterChange={actions.handleFilterChange} initialFilters={getCurrentFilters()} onClose={() => actions.setMobileFiltersOpen(false)} />
        </DialogContent>
      </Dialog>

      <SavedSearches
        open={state.savedSearchesOpen}
        onClose={() => actions.setSavedSearchesOpen(false)}
        savedSearches={state.savedSearches}
        applySavedSearch={actions.applySavedSearch}
        handleDeleteSavedSearch={actions.handleDeleteSavedSearch}
      />

      <Snackbar open={state.snackbarOpen} autoHideDuration={3000} onClose={() => actions.setSnackbarOpen(false)} message={state.snackbarMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} ContentProps={{ sx: { bgcolor: 'primary.main', color: 'white', fontWeight: 600, borderRadius: 1 } }} />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const {
      page = '1',
      sort = 'default',
      minPrice,
      maxPrice,
      categories,
      types: typesParam,
      section,
      bedRooms,
      bathRooms,
      tenure,
      furnishings,
      isAuction,
      location,
      name
    } = context.query;

    const filters: PropertyFilters = {};
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (categories) filters.categories = (categories as string).split(',');
    if (typesParam) filters.types = (typesParam as string).split(',').filter(Boolean);
    if (name) filters.name = name as string;

    if (section === 'rent') filters.section = 'rent';
    else filters.section = 'sale';

    if (bedRooms) {
      filters.bedRooms = (bedRooms as string).split(',').map(n => n === 'Studio' ? 0 : parseInt(n, 10)).filter(num => !isNaN(num));
    }
    if (bathRooms) {
      filters.bathRooms = (bathRooms as string).split(',').map(n => parseInt(n, 10)).filter(num => !isNaN(num));
    }
    if (tenure) filters.tenure = (tenure as string).split(',');
    if (furnishings) {
      const raw = (furnishings as string).split(',');
      filters.furnishings = raw.map((f) => {
        if (f === 'partially') return 'partially-furnished';
        if (f === 'fully') return 'fully-furnished';
        return f;
      });
    }
    if (isAuction === 'true') filters.isAuction = true;

    const apiFilters = { ...filters };
    delete (apiFilters as any).location;

    const searchTerm = ((name as string) || (location as string) || '').trim().toLowerCase();
    const categoryForTypes = (categories as string)?.split(',')?.[0] || undefined;
    const propertyTypes = await fetchPropertyTypes(categoryForTypes);

    const filtersForFetch = searchTerm ? (() => {
      const f = { ...apiFilters };
      delete f.name;
      return f;
    })() : apiFilters;

    let data = await fetchProperties(
      {
        page: parseInt(page as string, 10),
        sort: getSortValue(sort as string),
      },
      filtersForFetch
    );

    let properties: any[] = [];
    let total = 0;
    let totalPages = 0;

    if (data && Array.isArray(data.items)) {
      properties = data.items;
      if (data._meta) {
        total = data._meta.totalCount || properties.length;
        totalPages = data._meta.pageCount || 1;
      } else {
        total = data.total || properties.length;
        totalPages = data.totalPages || Math.ceil(total / 10);
      }
    } else if (Array.isArray(data)) {
      properties = data;
      total = data.length;
      totalPages = 1;
    }

    if (searchTerm && properties.length > 0) {
      const words = searchTerm.split(/\s+/).filter(Boolean);

      const matchesTerm = (p: any) => {
        const city = p.city ?? p.location?.city ?? '';
        const state = p.state ?? p.location?.state ?? '';
        const address = p.address ?? '';
        const name = p.name ?? '';
        const country = p.country ?? '';
        const postcode = (p.postcode ?? '').toString();
        const price = (p.price ?? 0).toString();

        return words.every((word) => {
          const w = word.toLowerCase();
          // Text matching
          if (
            name.toLowerCase().includes(w) ||
            address.toLowerCase().includes(w) ||
            city.toLowerCase().includes(w) ||
            state.toLowerCase().includes(w) ||
            country.toLowerCase().includes(w) ||
            postcode.includes(w)
          ) {
            return true;
          }

          // Price matching (if the word is numeric)
          const numValue = parseFloat(w.replace(/,/g, '').replace(/[^\d.-]/g, ''));
          if (!isNaN(numValue)) {
            // Check if property price is exactly the same, or contains the digits
            if (price.includes(w)) return true;
            // Also allow a range match if it's a large number (e.g., within 5% of the price)
            if (numValue > 1000) {
              const diff = Math.abs(p.price - numValue);
              if (diff / numValue <= 0.05) return true;
            }
          }

          return false;
        });
      };
      const filtered = properties.filter(p => matchesTerm(p));
      properties = filtered;
      total = filtered.length;
      totalPages = Math.max(1, Math.ceil(filtered.length / 10));
    }

    const validData = {
      items: properties,
      total: total,
      page: parseInt(page as string, 10),
      totalPages: totalPages,
    };

    return {
      props: { initialData: validData, propertyTypes },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        initialData: { items: [], total: 0, page: 1, totalPages: 0 },
        propertyTypes: [],
        error: 'Failed to load properties. Please try again later.',
      },
    };
  }
};
