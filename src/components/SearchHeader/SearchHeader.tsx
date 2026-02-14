import React from 'react';
import {
    Box,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Stack,
    Tooltip,
    Badge,
    ToggleButtonGroup,
    ToggleButton,
    Popover,
    Typography,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import BedIcon from '@mui/icons-material/Bed';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HistoryIcon from '@mui/icons-material/History';

interface SearchHeaderProps {
    locationSearch: string;
    setLocationSearch: (val: string) => void;
    setNameSearch: (val: string) => void;
    handleSearch: () => void;
    filterCount: number;
    setMobileFiltersOpen: (val: boolean) => void;
    bedsBathsCount: number;
    bedsBathsLabel: string;
    handleBedsBathsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    listingType: string;
    handleSectionChange: (val: string) => void;
    handleSaveSearch: () => void;
    savedSearchesCount: number;
    setSavedSearchesOpen: (val: boolean) => void;
    router: any;
    // BedsBaths Popover props
    openBedsBaths: boolean;
    bedsBathsAnchor: HTMLElement | null;
    handleBedsBathsClose: () => void;
    handleBedsBathsClear: () => void;
    beds: string[];
    setBeds: (val: any) => void;
    baths: string[];
    setBaths: (val: any) => void;
    handleBedsBathsApply: () => void;
    // Price Popover props
    priceAnchor: HTMLElement | null;
    minPrice: string;
    maxPrice: string;
    setMinPrice: (val: string) => void;
    setMaxPrice: (val: string) => void;
    handlePriceClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handlePriceClose: () => void;
    handlePriceApply: () => void;
    handlePriceClear: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    locationSearch,
    setLocationSearch,
    setNameSearch,
    handleSearch,
    filterCount,
    setMobileFiltersOpen,
    bedsBathsCount,
    bedsBathsLabel,
    handleBedsBathsClick,
    listingType,
    handleSectionChange,
    handleSaveSearch,
    savedSearchesCount,
    setSavedSearchesOpen,
    router,
    openBedsBaths,
    bedsBathsAnchor,
    handleBedsBathsClose,
    handleBedsBathsClear,
    beds,
    setBeds,
    baths,
    setBaths,
    handleBedsBathsApply,
    priceAnchor,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    handlePriceClick,
    handlePriceClose,
    handlePriceApply,
    handlePriceClear
}) => {
    React.useEffect(() => {
        const handleScroll = () => {
            if (openBedsBaths) handleBedsBathsClose();
            if (priceAnchor) handlePriceClose();
        };

        if (openBedsBaths || priceAnchor) {
            document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        }

        return () => {
            document.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, [openBedsBaths, handleBedsBathsClose, priceAnchor, handlePriceClose]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                mb: 4,
                borderRadius: 1,
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 1.5,
                alignItems: 'stretch',
                bgcolor: 'white',
                overflow: 'hidden',
                minWidth: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    flex: 1,
                    width: '100%',
                    minWidth: 0,
                    gap: 1.5,
                    alignItems: { xs: 'stretch', md: 'center' }
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Search by property name, location, area or landmark"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            bgcolor: 'white',
                            height: 48,
                            '& fieldset': { borderColor: '#E2E8F0' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        endAdornment: locationSearch && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setLocationSearch('');
                                        setNameSearch('');
                                        const query = { ...router.query };
                                        delete query.location;
                                        delete query.name;
                                        router.push({ pathname: '/', query });
                                    }}
                                >
                                    <CloseIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        height: 48,
                        px: 3,
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        flexShrink: { xs: 0, md: 0 }
                    }}
                >
                    Search
                </Button>
                <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', minWidth: 0 }}>
                    <Tooltip title="View all filter options" arrow>
                        <Badge
                            badgeContent={filterCount}
                            color="primary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    right: 1,
                                    top: 1,
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
                                    height: 48,
                                    px: 2.5,
                                    borderColor: '#E2E8F0',
                                    color: 'text.primary',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                                }}
                            >
                                Filters
                            </Button>
                        </Badge>
                    </Tooltip>

                    {(router.query.minPrice || router.query.maxPrice) && (
                        <Tooltip title="Quick Price Range selection" arrow>
                            <Button
                                variant="outlined"
                                onClick={handlePriceClick}
                                sx={{
                                    borderRadius: 1,
                                    height: 48,
                                    px: 2.5,
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    bgcolor: 'rgba(34, 197, 94, 0.04)',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                                }}
                            >
                                {router.query.minPrice && router.query.maxPrice ? `RM ${router.query.minPrice} - ${router.query.maxPrice}` :
                                    router.query.minPrice ? `Min RM ${router.query.minPrice}` :
                                        `Under RM ${router.query.maxPrice}`}
                            </Button>
                        </Tooltip>
                    )}

                    <Tooltip title="Quick Bedroom & Bathroom selection" arrow>
                        <Badge
                            badgeContent={bedsBathsCount}
                            color="primary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    right: 1,
                                    top: 1,
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
                                startIcon={<BedIcon />}
                                onClick={handleBedsBathsClick}
                                sx={{
                                    borderRadius: 1,
                                    height: 48,
                                    px: 2.5,
                                    borderColor: '#E2E8F0',
                                    color: 'text.primary',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                                }}
                            >
                                {bedsBathsLabel}
                            </Button>
                        </Badge>
                    </Tooltip>

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
                                textTransform: 'none',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                color: 'primary.main',
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

                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Save this search" arrow>
                            <IconButton
                                onClick={handleSaveSearch}
                                sx={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: 1,
                                    height: 48,
                                    width: 48,
                                    color: 'primary.main'
                                }}
                            >
                                <BookmarkBorderIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Saved & Recent searches" arrow>
                            <Badge
                                badgeContent={savedSearchesCount}
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
                                        height: 48,
                                        width: 48,
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
                    open={Boolean(priceAnchor)}
                    anchorEl={priceAnchor}
                    onClose={handlePriceClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    PaperProps={{ sx: { p: 3, width: 320, borderRadius: 1.5, mt: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ fontWeight: 700 }}>Price Range (RM)</Typography>
                        <Button size="small" onClick={handlePriceClear} sx={{ fontWeight: 600 }}>Clear</Button>
                    </Box>
                    <Stack spacing={2}>
                        <TextField
                            label="Min Price"
                            fullWidth
                            size="small"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="e.g. 100,000"
                        />
                        <TextField
                            label="Max Price"
                            fullWidth
                            size="small"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="e.g. 500,000"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handlePriceApply}
                            sx={{ mt: 1, py: 1.5, borderRadius: 1, fontWeight: 700 }}
                        >
                            Apply
                        </Button>
                    </Stack>
                </Popover>

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
                                control={<Checkbox size="small" checked={beds.includes(num)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeds((prev: string[]) => e.target.checked ? [...prev, num] : prev.filter(b => b !== num))} />}
                                label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{num}</Typography>}
                            />
                        ))}
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, mt: 2 }}>Bathrooms</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                        {['1', '2', '3', '4', '5+'].map((num) => (
                            <FormControlLabel
                                key={num}
                                control={<Checkbox size="small" checked={baths.includes(num)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaths((prev: string[]) => e.target.checked ? [...prev, num] : prev.filter(b => b !== num))} />}
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
            </Box>
        </Paper>
    );
};

export default SearchHeader;
