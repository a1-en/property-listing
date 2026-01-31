import React, { useState, useEffect } from 'react';
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
} from '@mui/material';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import {
  Sort as SortIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

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
  const [savedSearchesOpen, setSavedSearchesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listingType, setListingType] = useState('sale');
  const [bedsBathsAnchor, setBedsBathsAnchor] = useState<null | HTMLElement>(null);
  const [beds, setBeds] = useState<string[]>([]);
  const [baths, setBaths] = useState<string[]>([]);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [locationSearch, setLocationSearch] = useState(router.query.location?.toString() || '');
  const [nameSearch, setNameSearch] = useState(router.query.name?.toString() || '');
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load saved searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('saved_searches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const openBedsBaths = Boolean(bedsBathsAnchor);
  const openSort = Boolean(sortAnchor);

  const { page = '1', sort = 'default' } = router.query;
  const currentPage = parseInt(page as string, 10);
  const currentSort = sort as string;

  // Active Filter counts for Badges
  const getFilterCount = () => {
    let count = 0;
    const { minPrice, maxPrice, categories, tenure, furnishings, isAuction, bedRooms, bathRooms } = router.query;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (categories) count += (categories as string).split(',').length;
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
    // Initialize local state from current URL query
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

  const getBedsBathsLabel = () => {
    const bedsArr = router.query.bedRooms ? (router.query.bedRooms as string).split(',') : [];
    const bathsArr = router.query.bathRooms ? (router.query.bathRooms as string).split(',') : [];

    let label = "";

    if (bedsArr.length === 1) {
      label += `${bedsArr[0]} bed`;
    } else if (bedsArr.length > 1) {
      label += `${bedsArr.length} beds`;
    }

    if (bathsArr.length > 0) {
      if (label) label += " & ";
      if (bathsArr.length === 1) {
        label += `${bathsArr[0]} bath`;
      } else {
        label += `${bathsArr.length} baths`;
      }
    }

    return label || "Beds & Baths";
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchor(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchor(null);
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
    handleBedsBathsClose();

    const query = { ...router.query };
    delete query.bedRooms;
    delete query.bathRooms;

    router.push({
      pathname: '/',
      query
    });
  };

  // Handle search action
  const handleSearch = () => {
    const query: any = { ...router.query, page: 1 };
    if (locationSearch) query.location = locationSearch;
    else delete query.location;
    if (nameSearch) query.name = nameSearch;
    else delete query.name;

    router.push({
      pathname: '/',
      query
    });
  };

  const handleSaveSearch = () => {
    // Generate a descriptive name if name/location are empty
    let generatedName = nameSearch || locationSearch;

    if (!generatedName) {
      const filters = getCurrentFilters();
      const bedsBaths = getBedsBathsLabel();

      const parts = [];
      if (filters.categories) parts.push(filters.categories[0]);
      if (bedsBaths !== "Beds & Baths") parts.push(bedsBaths);
      if (filters.minPrice || filters.maxPrice) parts.push("Price Filter");

      generatedName = parts.length > 0 ? parts.join(' - ') : 'General Search';
    }

    // Don't save if there are literally no filters and no search terms
    if (generatedName === 'General Search' && getFilterCount() === 0 && getBedsBathsCount() === 0) {
      return;
    }

    const newSave = {
      id: Date.now(),
      name: generatedName,
      query: { ...router.query, location: locationSearch, name: nameSearch },
      timestamp: new Date().toISOString(),
      filters: getFilterCount() + getBedsBathsCount()
    };
    const updated = [newSave, ...savedSearches];
    setSavedSearches(updated);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
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
    router.push({
      pathname: '/',
      query: search.query
    });
    setSavedSearchesOpen(false);
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

    if (filters.minPrice) query.minPrice = filters.minPrice.toString();
    if (filters.maxPrice) query.maxPrice = filters.maxPrice.toString();
    if (filters.categories && filters.categories.length > 0) {
      query.categories = filters.categories.join(',');
    }
    if (filters.bedRooms && filters.bedRooms.length > 0) {
      query.bedRooms = filters.bedRooms.join(',');
    }
    if (filters.bathRooms && filters.bathRooms.length > 0) {
      query.bathRooms = filters.bathRooms.join(',');
    }
    if (filters.tenure && filters.tenure.length > 0) {
      query.tenure = filters.tenure.join(',');
    }
    if (filters.furnishings && filters.furnishings.length > 0) {
      query.furnishings = filters.furnishings.join(',');
    }
    if (filters.isAuction) {
      query.isAuction = 'true';
    }
    if (listingType) query.section = listingType;

    router.push({
      pathname: '/',
      query,
    });

    setMobileFiltersOpen(false);
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
    if (router.query.bedRooms) {
      filters.bedRooms = (router.query.bedRooms as string).split(',').map(n => parseInt(n, 10));
    }
    if (router.query.bathRooms) {
      filters.bathRooms = (router.query.bathRooms as string).split(',').map(n => parseInt(n, 10));
    }
    if (router.query.tenure) {
      filters.tenure = (router.query.tenure as string).split(',');
    }
    if (router.query.furnishings) {
      filters.furnishings = (router.query.furnishings as string).split(',');
    }
    if (router.query.isAuction === 'true') {
      filters.isAuction = true;
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
            borderRadius: 1,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 2,
            alignItems: 'center',
            bgcolor: 'white'
          }}
        >
          {/* Advanced Search: Location + Name */}
          <Box sx={{ display: 'flex', flex: 1, gap: 2, width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField
              fullWidth
              placeholder="Search Locations (City, State)"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
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
            <TextField
              fullWidth
              placeholder="Search Project or Property Name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: '#FBFDFF'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Tooltip title="Apply location and name filters" arrow>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  height: { md: 56 },
                  minWidth: 120
                }}
              >
                Search
              </Button>
            </Tooltip>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' }, mx: 1 }} />

          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0, width: { xs: '100%', lg: 'auto' }, justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1.5}>
              <Tooltip title="View all filter options" arrow>
                <Badge
                  badgeContent={getFilterCount()}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 4,
                      top: 4,
                      border: '2px solid white',
                      height: 20,
                      minWidth: 20,
                      borderRadius: '50%',
                      fontWeight: 700
                    }
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                      py: 1.5,
                      borderColor: getFilterCount() > 0 ? 'primary.main' : '#E2E8F0',
                      color: getFilterCount() > 0 ? 'primary.main' : 'text.primary',
                      bgcolor: getFilterCount() > 0 ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37, 99, 235, 0.04)' }
                    }}
                  >
                    Filters
                  </Button>
                </Badge>
              </Tooltip>

              <Tooltip title="Quick Bedroom & Bathroom selection" arrow>
                <Badge
                  badgeContent={getBedsBathsCount()}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 4,
                      top: 4,
                      border: '2px solid white',
                      height: 20,
                      minWidth: 20,
                      borderRadius: '50%',
                      fontWeight: 700
                    }
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<BathtubIcon />}
                    onClick={handleBedsBathsClick}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                      py: 1.5,
                      borderColor: router.query.bedRooms || router.query.bathRooms ? 'primary.main' : '#E2E8F0',
                      color: router.query.bedRooms || router.query.bathRooms ? 'primary.main' : 'text.primary',
                      bgcolor: router.query.bedRooms || router.query.bathRooms ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(37, 99, 235, 0.04)' }
                    }}
                  >
                    {getBedsBathsLabel()}
                  </Button>
                </Badge>
              </Tooltip>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Stack direction="row" spacing={1}>
              <Tooltip title="Save these search criteria" arrow>
                <IconButton
                  onClick={handleSaveSearch}
                  sx={{
                    border: '1px solid #E2E8F0',
                    borderRadius: 1,
                    p: 1.5,
                    color: 'primary.main'
                  }}
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Saved & Recent searches" arrow>
                <Badge
                  badgeContent={savedSearches.length}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      right: 4,
                      top: 4,
                      border: '2px solid white',
                      height: 20,
                      minWidth: 20,
                      borderRadius: '50%',
                      fontWeight: 700
                    }
                  }}
                >
                  <IconButton
                    onClick={() => setSavedSearchesOpen(true)}
                    sx={{
                      border: '1px solid #E2E8F0',
                      borderRadius: 1,
                      p: 1.5,
                      color: 'text.secondary'
                    }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Badge>
              </Tooltip>
            </Stack>
          </Stack>

          <Popover
            open={openBedsBaths}
            anchorEl={bedsBathsAnchor}
            onClose={handleBedsBathsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{ sx: { p: 3, width: 320, borderRadius: 1.5, mt: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
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
              sx={{ mt: 3, py: 1.5, borderRadius: 1, fontWeight: 700 }}
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
                borderRadius: 1,
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
                <Tooltip title="Change listing order" arrow>
                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={handleSortClick}
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      borderColor: '#E2E8F0',
                      color: 'text.primary',
                      fontWeight: 500,
                      textTransform: 'none',
                      bgcolor: 'white',
                      '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                    }}
                  >
                    {getSortLabel(currentSort)}
                  </Button>
                </Tooltip>

                <Popover
                  open={openSort}
                  anchorEl={sortAnchor}
                  onClose={handleSortClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { p: 0, width: 260, borderRadius: 3, mt: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
                    <Typography sx={{ fontWeight: 700 }}>Sort By</Typography>
                    <Button
                      size="small"
                      onClick={() => { handleSortChange('default'); handleSortClose(); }}
                      sx={{ fontWeight: 600, textTransform: 'none' }}
                    >
                      Clear
                    </Button>
                  </Box>

                  <Stack spacing={0}>
                    {[
                      { label: 'Recommended', value: 'default' },
                      { label: 'Price: Low to High', value: 'priceLowToHigh' },
                      { label: 'Price: High to Low', value: 'priceHighToLow' },
                      { label: 'Floor Size: Low to High', value: 'floorSizeLowToHigh' },
                      { label: 'Floor Size: High to Low', value: 'floorSizeHighToLow' },
                      { label: 'PSF: Low to High', value: 'psfLowToHigh' },
                      { label: 'PSF: High to Low', value: 'psfHighToLow' },
                      { label: 'Newest Listings', value: 'newest' },
                      { label: 'Oldest Listings', value: 'oldest' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        fullWidth
                        onClick={() => { handleSortChange(option.value); handleSortClose(); }}
                        sx={{
                          justifyContent: 'space-between',
                          px: 2,
                          py: 1.5,
                          borderRadius: 0,
                          color: currentSort === option.value ? 'primary.main' : 'text.primary',
                          fontWeight: currentSort === option.value ? 700 : 500,
                          textTransform: 'none',
                          bgcolor: 'transparent',
                          '&:hover': { bgcolor: '#F8FAFC' }
                        }}
                      >
                        {option.label}
                        {currentSort === option.value && <CheckIcon fontSize="small" color="primary" />}
                      </Button>
                    ))}
                  </Stack>
                </Popover>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, val) => val && setViewMode(val)}
                  size="small"
                  sx={{ bgcolor: 'white' }}
                >
                  <ToggleButton value="grid">
                    <Tooltip title="Grid View" arrow>
                      <GridViewIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton value="list">
                    <Tooltip title="List View" arrow>
                      <ViewListIcon fontSize="small" />
                    </Tooltip>
                  </ToggleButton>
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
                    <Grid size={viewMode === 'list' ? { xs: 12 } : { xs: 12, sm: 6, md: 4 }} key={property.id || property._id}>
                      <PropertyCard property={property} viewMode={viewMode} />
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
              {/* Resources Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: '1.25rem' }}>Property Discovery & Resources</Typography>
                <Typography variant="body2" color="#64748B" sx={{ mb: 2, lineHeight: 1.6, fontSize: '0.95rem' }}>
                  There are {initialData?.total?.toLocaleString()} Properties for {listingType === 'rent' ? 'rent' : 'sale'} in Malaysia. You can use the enhanced search filters available to find the right
                  <Link href="#" sx={{ color: 'primary.main', textDecoration: 'underline', mx: 0.5 }}>landed homes</Link>,
                  <Link href="#" sx={{ color: 'primary.main', textDecoration: 'underline', mx: 0.5 }}>condominium</Link>,
                  <Link href="#" sx={{ color: 'primary.main', textDecoration: 'underline', mx: 0.5 }}>bungalow</Link> or
                  <Link href="#" sx={{ color: 'primary.main', textDecoration: 'underline', mx: 0.5 }}>residential land</Link> in this area.
                </Typography>
              </Box>

              {/* Map View Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 1.5,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  bgcolor: 'white'
                }}
              >
                <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.2)', p: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Explore on Map</Typography>
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        bgcolor: '#FCD34D',
                        color: '#92400E',
                        fontWeight: 800,
                        fontSize: '0.65rem',
                        height: 20
                      }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="#64748B" sx={{ mb: 3, lineHeight: 1.6, fontSize: '0.95rem' }}>
                    View all {initialData?.total?.toLocaleString()} Properties for {listingType} in Malaysia on an interactive map. Find listings near your preferred locations, schools, and amenities.
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    Open Map View →
                  </Button>
                </Box>
              </Paper>

              {/* Popular Locations */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 1.5,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  bgcolor: 'white'
                }}
              >
                <Box sx={{ bgcolor: '#EFF6FF', p: 2, borderBottom: '1px solid #E2E8F0' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: '1.1rem' }}>📍</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>Popular Locations</Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', display: 'block', mb: 2, letterSpacing: '0.05em' }}>
                    TOP STATES
                  </Typography>
                  <Stack spacing={1.5}>
                    {[
                      'Selangor',
                      'Johor',
                      'Kuala Lumpur',
                      'Penang',
                      'Kedah'
                    ].map((loc) => (
                      <Stack key={loc} direction="row" spacing={1.5} alignItems="center">
                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.primary' }} />
                        <Link
                          href="#"
                          underline="hover"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 500,
                            fontSize: '0.95rem'
                          }}
                        >
                          Property for {listingType === 'rent' ? 'Rent' : 'Sale'} in {loc}
                        </Link>
                      </Stack>
                    ))}
                    <Link
                      href="#"
                      underline="hover"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        pt: 1,
                        display: 'block'
                      }}
                    >
                      View More
                    </Link>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Filters Modal */}
      <Dialog
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 1,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon sx={{ color: 'text.primary' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Filter Properties</Typography>
          </Stack>
          <IconButton onClick={() => setMobileFiltersOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Filters
            onFilterChange={handleFilterChange}
            initialFilters={getCurrentFilters()}
            onClose={() => setMobileFiltersOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Saved Searches Drawer */}
      <Drawer
        anchor="right"
        open={savedSearchesOpen}
        onClose={() => setSavedSearchesOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, borderRadius: '12px 0 0 12px' }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Saved Searches</Typography>
              <Typography variant="body2" color="text.secondary">Access your recent and saved filters</Typography>
            </Box>
            <IconButton onClick={() => setSavedSearchesOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            {savedSearches.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BookmarkBorderIcon sx={{ fontSize: 48, color: '#E2E8F0', mb: 2 }} />
                <Typography color="text.secondary">No saved searches yet</Typography>
                <Typography variant="caption" color="text.secondary">Click the bookmark icon to save a search</Typography>
              </Box>
            ) : (
              savedSearches.map((search: any) => (
                <Paper
                  key={search.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' },
                    position: 'relative'
                  }}
                  onClick={() => applySavedSearch(search)}
                >
                  <Box sx={{ pr: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }} noWrap>
                      {search.name}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HistoryIcon sx={{ fontSize: 14 }} />
                        {new Date(search.timestamp).toLocaleDateString()}
                      </Typography>
                      {search.filters > 0 && (
                        <Chip
                          label={`${search.filters} filters`}
                          size="small"
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSavedSearch(search.id);
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))
            )}
          </Stack>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Searched results are saved"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          sx: {
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 600,
            borderRadius: 1,
          }
        }}
      />
    </Box >
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
      section,
      bedRooms,
      bathRooms,
      tenure,
      furnishings,
      isAuction,
      location,
      name
    } = context.query;

    // Build filters from query params
    const filters: PropertyFilters = {};
    if (minPrice) filters.minPrice = parseFloat(minPrice as string);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
    if (categories) filters.categories = (categories as string).split(',');
    if (location) filters.location = location as string;
    if (name) filters.name = name as string;

    // Section handle
    if (section === 'rent') filters.section = 'rent';
    else filters.section = 'sale'; // Default

    // Handle bedRooms and bathRooms as arrays of numbers
    if (bedRooms) {
      filters.bedRooms = (bedRooms as string).split(',').map(n => n === 'Studio' ? 0 : parseInt(n, 10)).filter(num => !isNaN(num));
    }
    if (bathRooms) {
      filters.bathRooms = (bathRooms as string).split(',').map(n => parseInt(n, 10)).filter(num => !isNaN(num));
    }
    if (tenure) {
      filters.tenure = (tenure as string).split(',');
    }
    if (furnishings) {
      filters.furnishings = (furnishings as string).split(',');
    }
    if (isAuction === 'true') {
      filters.isAuction = true;
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
      // The API provides pagination info in _meta
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
