import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Grid,
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Breadcrumbs,
  Link,
  Stack,
  Divider,
  Paper,
  Popover,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Chip,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BedIcon from '@mui/icons-material/Bed';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import PropertyCard from '@/components/PropertyCard';
import Filters from '@/components/Filters';
import {
  fetchProperties,
  PropertiesResponse,
  PropertyFilters,
  getSortValue,
} from '@/lib/api/properties';

interface HomeProps {
  initialData: PropertiesResponse;
  error?: string;
}

export default function Home({ initialData, error }: HomeProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listingType, setListingType] = useState('sale');
  const [bedsBathsAnchor, setBedsBathsAnchor] = useState<null | HTMLElement>(null);
  const [beds, setBeds] = useState<string[]>([]);
  const [baths, setBaths] = useState<string[]>([]);

  const openBedsBaths = Boolean(bedsBathsAnchor);

  const { page = '1', sort = 'default' } = router.query;
  const currentPage = parseInt(page as string, 10);
  const currentSort = sort as string;

  const handleBedsBathsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBedsBathsAnchor(event.currentTarget);
  };

  const handleBedsBathsClose = () => {
    setBedsBathsAnchor(null);
  };

  const handleBedsBathsApply = () => {
    handleBedsBathsClose();

    const query: any = { ...router.query, page: 1 };
    if (beds.length > 0) query.bedRooms = beds.join(',');
    if (baths.length > 0) query.bathRooms = baths.join(',');

    router.push({
      pathname: '/',
      query
    });
  };

  const handleBedsBathsClear = () => {
    setBeds([]);
    setBaths([]);

    const query = { ...router.query };
    delete query.bedRooms;
    delete query.bathRooms;

    router.push({
      pathname: '/',
      query
    });
  };

  // Handle sorting change
  const handleSortChange = (newSort: string) => {
    router.push({
      pathname: '/',
      query: { ...router.query, sort: newSort, page: 1 },
    });
  };

  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: '/',
      query: { ...router.query, page: value },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Section change
  const handleSectionChange = (val: string) => {
    setListingType(val);
    router.push({
      pathname: '/',
      query: { ...router.query, section: val, page: 1 }
    });
  };

  // Handle filter changes
  const handleFilterChange = (filters: PropertyFilters) => {
    const query: any = { page: 1, sort: currentSort };

    if (filters.minPrice) query.minPrice = filters.minPrice;
    if (filters.maxPrice) query.maxPrice = filters.maxPrice;
    if (filters.categories && filters.categories.length > 0) {
      query.categories = filters.categories.join(',');
    }
    if (listingType) query.section = listingType;

    router.push({
      pathname: '/',
      query,
    });

    if (isMobile) {
      setMobileFiltersOpen(false);
    }
  };

  // Get current filters from URL
  const getCurrentFilters = (): PropertyFilters => {
    const filters: PropertyFilters = {};

    if (router.query.minPrice) {
      filters.minPrice = parseFloat(router.query.minPrice as string);
    }
    if (router.query.maxPrice) {
      filters.maxPrice = parseFloat(router.query.maxPrice as string);
    }
    if (router.query.categories) {
      filters.categories = (router.query.categories as string).split(',');
    }

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
        <title>Property Genie - Find Your Dream Property</title>
        <meta name="description" content="Browse thousands of properties for sale and rent in Malaysia" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.9rem' }}>Home</Link>
          <Typography color="text.primary" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Properties for {listingType === 'rent' ? 'Rent' : 'Sale'}</Typography>
        </Breadcrumbs>

        {/* Search Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by location, area or landmark"
            variant="outlined"
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 0' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#FBFDFF'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setMobileFiltersOpen(true)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                borderColor: '#E2E8F0',
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' }
              }}
            >
              Filters
            </Button>
            <Button
              variant="outlined"
              startIcon={<BedIcon />}
              onClick={handleBedsBathsClick}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                borderColor: '#E2E8F0',
                color: 'text.primary',
                fontWeight: 500,
                '&:hover': { borderColor: 'primary.main', bgcolor: 'transparent' }
              }}
            >
              Beds & Baths
            </Button>
          </Stack>

          <Popover
            open={openBedsBaths}
            anchorEl={bedsBathsAnchor}
            onClose={handleBedsBathsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { p: 3, width: 320, borderRadius: 4, mt: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>Beds & Baths</Typography>
              <Button size="small" onClick={handleBedsBathsClear} sx={{ fontWeight: 600 }}>Clear</Button>
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Bedrooms</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {['Studio', '1', '2', '3', '4', '5+'].map((num) => (
                <FormControlLabel
                  key={num}
                  control={<Checkbox size="small" checked={beds.includes(num)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeds(prev => e.target.checked ? [...prev, num] : prev.filter(b => b !== num))} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{num}</Typography>}
                />
              ))}
            </Box>

            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Bathrooms</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {['1', '2', '3', '4', '5+'].map((num) => (
                <FormControlLabel
                  key={num}
                  control={<Checkbox size="small" checked={baths.includes(num)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaths(prev => e.target.checked ? [...prev, num] : prev.filter(b => b !== num))} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{num}</Typography>}
                />
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleBedsBathsApply}
              sx={{ mt: 3, py: 1, borderRadius: 2, fontWeight: 700 }}
            >
              Apply
            </Button>
          </Popover>

          <ToggleButtonGroup
            value={listingType}
            exclusive
            onChange={(e, val) => val && handleSectionChange(val)}
            sx={{
              height: 48,
              '& .MuiToggleButton-root': {
                px: 3,
                border: '1px solid #E2E8F0',
                borderRadius: 2,
                fontWeight: 600,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }
              }
            }}
          >
            <ToggleButton value="sale" sx={{ mr: '-1px' }}>For Sale</ToggleButton>
            <ToggleButton value="rent">For Rent</ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Content Area */}
          <Grid size={{ xs: 12, lg: 9 }}>
            {/* Header Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {initialData?.total?.toLocaleString()} Properties for {listingType === 'rent' ? 'Rent' : 'Sale'} in Malaysia
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={currentSort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                  >
                    <MenuItem value="default">IE Recommended</MenuItem>
                    <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
                    <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                  </Select>
                </FormControl>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, val) => val && setViewMode(val)}
                  size="small"
                  sx={{ bgcolor: 'white' }}
                >
                  <ToggleButton value="grid"><GridViewIcon fontSize="small" /></ToggleButton>
                  <ToggleButton value="list"><ViewListIcon fontSize="small" /></ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Box>

            {/* Property Grid */}
            {(!initialData || !initialData.items || initialData.items.length === 0) ? (
              <Alert severity="info" sx={{ mt: 4, borderRadius: 4 }}>
                No properties found matching your criteria. Try adjusting your filters.
              </Alert>
            ) : (
              <>
                <Grid container spacing={3}>
                  {initialData.items.map((property: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property.id || property._id}>
                      <PropertyCard property={property} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {initialData.totalPages && initialData.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={initialData.totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      size={isMobile ? 'medium' : 'large'}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Right Sidebar */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={4}>
              {/* Resources Card */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Property Discovery & Resources</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  There are {initialData?.total?.toLocaleString()} Properties for {listingType === 'rent' ? 'rent' : 'sale'} in Malaysia. You can use the enhanced search filters available to find the right
                  <Link href="#" sx={{ ml: 0.5, fontWeight: 600 }}>landed homes</Link>,
                  <Link href="#" sx={{ ml: 0.5, fontWeight: 600 }}>condominium</Link>,
                  <Link href="#" sx={{ ml: 0.5, fontWeight: 600 }}>bungalow</Link> or
                  <Link href="#" sx={{ ml: 0.5, fontWeight: 600 }}>residential land</Link> in this area.
                </Typography>
              </Box>

              {/* Map View Card */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'primary.main',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 1.5 }}>
                      <MapIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Explore on Map</Typography>
                    <Chip label="NEW" size="small" sx={{ bgcolor: '#FCD34D', color: '#92400E', fontWeight: 800, fontSize: '0.65rem' }} />
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    View all {initialData?.total?.toLocaleString()} properties for {listingType} in Malaysia on an interactive map.
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      py: 1.5,
                      fontWeight: 700,
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                  >
                    Open Map View →
                  </Button>
                </Box>
                {/* Decorative pattern could be added here */}
              </Paper>

              {/* Popular Locations */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Popular Locations</Typography>
                </Stack>
                <Stack spacing={1}>
                  {['Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak'].map((loc) => (
                    <Link key={loc} href="#" underline="hover" color="text.primary" sx={{ fontWeight: 500, py: 0.5 }}>
                      {loc}
                    </Link>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Filters Drawer/Modal */}
      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Filter Properties</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}><NavigateNextIcon /></IconButton>
          </Box>
          <Filters
            onFilterChange={handleFilterChange}
            initialFilters={getCurrentFilters()}
          />
        </Box>
      </Drawer>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { page = '1', sort = 'default', minPrice, maxPrice, categories, section, bedRooms, bathRooms } = context.query;

    // Build filters from query params
    const filters: PropertyFilters = {};
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (categories) filters.categories = (categories as string).split(',');

    // Section handle
    if (section === 'rent') filters.section = 'rent';
    else filters.section = 'sale'; // Default

    // Handle bedRooms and bathRooms as arrays of numbers
    if (bedRooms) {
      filters.bedRooms = (bedRooms as string).split(',').map(n => n === 'Studio' ? 0 : parseInt(n, 10));
    }
    if (bathRooms) {
      filters.bathRooms = (bathRooms as string).split(',').map(n => parseInt(n, 10));
    }

    // Fetch properties
    const data = await fetchProperties(
      {
        page: parseInt(page as string, 10),
        sort: getSortValue(sort as string),
      },
      filters
    );

    // Defensive check to handle different API response formats
    let properties: any[] = [];
    let total = 0;
    let totalPages = 0;

    if (data && Array.isArray(data.items)) {
      properties = data.items;
      total = data.total || 100; // API usually provides total, but fallback if missing
      totalPages = Math.ceil(total / 10);
    } else if (Array.isArray(data)) {
      // Fallback for array response
      properties = data;
      total = data.length;
      totalPages = 1;
    }

    const validData = {
      items: properties,
      total: total,
      page: parseInt(page as string, 10),
      totalPages: totalPages,
    };

    return {
      props: {
        initialData: validData,
      },
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        initialData: {
          items: [],
          total: 0,
          page: 1,
          totalPages: 0,
        },
        error: 'Failed to load properties. Please try again later.',
      },
    };
  }
};
