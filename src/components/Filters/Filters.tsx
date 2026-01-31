import React, { useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Paper,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import GrassIcon from '@mui/icons-material/Grass';
import FactoryIcon from '@mui/icons-material/Factory';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AppsIcon from '@mui/icons-material/Apps';
import { PropertyFilters, PropertyTypeOption } from '@/lib/api/properties';

interface FiltersProps {
    propertyTypes?: PropertyTypeOption[];
    onFilterChange: (filters: PropertyFilters) => void;
    initialFilters?: PropertyFilters;
    onClose?: () => void;
}

const CATEGORIES = [
    { label: 'All Properties', value: 'all', icon: <AppsIcon fontSize="small" /> },
    { label: 'Residential', value: 'residential', icon: <HomeIcon fontSize="small" /> },
    { label: 'Commercial', value: 'commercial', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Agricultural', value: 'agricultural', icon: <GrassIcon fontSize="small" /> },
    { label: 'Industrial', value: 'industrial', icon: <FactoryIcon fontSize="small" /> },
    { label: 'Others', value: 'others', icon: <MoreHorizIcon fontSize="small" /> },
];

const BEDROOMS = ['Studio', '1', '2', '3', '4', '5+'];
const TENURES = [
    { label: 'Freehold', value: 'freehold' },
    { label: 'Leasehold', value: 'leasehold' },
    { label: 'N/A', value: 'na' }
];
const FURNISHINGS = [
    { label: 'Unfurnished', value: 'unfurnished' },
    { label: 'Partially Furnished', value: 'partially' },
    { label: 'Fully Furnished', value: 'fully' },
    { label: 'N/A', value: 'na' }
];

const Filters: React.FC<FiltersProps> = ({ propertyTypes = [], onFilterChange, initialFilters = {}, onClose }) => {
    const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice?.toString() || '');
    const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice?.toString() || '');
    const [category, setCategory] = useState<string>(initialFilters.categories?.[0] || 'all');
    const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types || []);
    const [bedrooms, setBedrooms] = useState<string[]>(initialFilters.bedRooms?.map(b => b === 0 ? 'Studio' : b.toString()) || []);
    const [bathrooms, setBathrooms] = useState<string[]>(initialFilters.bathRooms?.map(b => b.toString()) || []);
    const [tenure, setTenure] = useState<string[]>(initialFilters.tenure || []);
    const [furnishing, setFurnishing] = useState<string[]>(initialFilters.furnishings || []);
    const [isAuction, setIsAuction] = useState<boolean>(initialFilters.isAuction || false);

    const handleApplyFilters = () => {
        const filters: PropertyFilters = {
            ...(category !== 'all' && { categories: [category] }),
            ...(selectedTypes.length > 0 && { types: selectedTypes }),
            ...(minPrice && { minPrice: parseFloat(minPrice) }),
            ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
            ...(bedrooms.length > 0 && {
                bedRooms: bedrooms.map(b => b === 'Studio' ? 0 : parseInt(b, 10))
            }),
            ...(bathrooms.length > 0 && {
                bathRooms: bathrooms.map(b => parseInt(b, 10))
            }),
            ...(tenure.length > 0 && { tenure }),
            ...(furnishing.length > 0 && { furnishings: furnishing }),
            ...(isAuction && { isAuction: true }),
        };
        onFilterChange(filters);
        if (onClose) onClose();
    };

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setCategory('all');
        setSelectedTypes([]);
        setBedrooms([]);
        setBathrooms([]);
        setTenure([]);
        setFurnishing([]);
        setIsAuction(false);
        onFilterChange({});
    };

    const toggleType = (value: string) => {
        setSelectedTypes((prev) =>
            prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
        );
    };

    const selectAllTypes = () => {
        if (selectedTypes.length === propertyTypes.length) {
            setSelectedTypes([]);
        } else {
            setSelectedTypes(propertyTypes.map((t) => t.value));
        }
    };

    const toggleMultiSelect = (val: string, current: string[], setter: (v: string[]) => void) => {
        if (current.includes(val)) {
            setter(current.filter(item => item !== val));
        } else {
            setter([...current, val]);
        }
    };

    return (
        <Box sx={{ pb: 2 }}>
            <Stack spacing={4}>
                {/* Price Range */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Price Range</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#64748B' }}>Minimum Price</Typography>
                            <TextField
                                placeholder="Select min price"
                                fullWidth
                                variant="outlined"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0.75,
                                        bgcolor: '#FFFFFF',
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: '#64748B' }}>Maximum Price</Typography>
                            <TextField
                                placeholder="Select max price"
                                fullWidth
                                variant="outlined"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 0.75,
                                        bgcolor: '#FFFFFF',
                                        '& fieldset': { borderColor: '#E2E8F0' },
                                        '&:hover fieldset': { borderColor: 'primary.main' },
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Property Category */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Property Category</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                        {CATEGORIES.map((cat) => (
                            <Button
                                key={cat.value}
                                variant={category === cat.value ? 'contained' : 'outlined'}
                                startIcon={cat.icon}
                                onClick={() => setCategory(cat.value)}
                                sx={{
                                    borderRadius: 0.75,
                                    borderWidth: '1px !important',
                                    borderColor: category === cat.value ? 'primary.main' : '#E2E8F0',
                                    color: category === cat.value ? 'white' : '#64748B',
                                    bgcolor: category === cat.value ? 'primary.main' : 'white',
                                    px: 2,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        bgcolor: category === cat.value ? 'primary.dark' : '#F8FAFC',
                                        borderColor: category === cat.value ? 'primary.dark' : '#CBD5E1',
                                        boxShadow: 'none',
                                    }
                                }}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {/* Select Property Types - from API */}
                {propertyTypes.length > 0 && (
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Select Property Types</Typography>
                        <FormGroup sx={{ gap: 0.5 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedTypes.length === propertyTypes.length}
                                        indeterminate={selectedTypes.length > 0 && selectedTypes.length < propertyTypes.length}
                                        onChange={selectAllTypes}
                                        sx={{ color: '#64748B', '&.Mui-checked': { color: 'primary.main' } }}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>
                                        All {category !== 'all' ? CATEGORIES.find((c) => c.value === category)?.label || 'Properties' : 'Properties'}
                                    </Typography>
                                }
                            />
                            {propertyTypes.map((opt) => (
                                <FormControlLabel
                                    key={opt.value}
                                    control={
                                        <Checkbox
                                            checked={selectedTypes.includes(opt.value)}
                                            onChange={() => toggleType(opt.value)}
                                            sx={{ color: '#64748B', '&.Mui-checked': { color: 'primary.main' } }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>{opt.label}</Typography>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </Box>
                )}

                {/* Bedrooms */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Bedrooms</Typography>
                    <ToggleButtonGroup
                        value={bedrooms}
                        onChange={(e, val) => setBedrooms(val)}
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            '& .MuiToggleButton-root': {
                                flex: '1 1 auto',
                                minWidth: '70px',
                                border: '1px solid #E2E8F0 !important',
                                borderRadius: '4px !important',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: '#64748B',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }
                            }
                        }}
                    >
                        {BEDROOMS.map((bed) => (
                            <ToggleButton key={bed} value={bed}>{bed}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {/* Bathrooms */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Bathrooms</Typography>
                    <ToggleButtonGroup
                        value={bathrooms}
                        onChange={(e, val) => setBathrooms(val)}
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            '& .MuiToggleButton-root': {
                                flex: '1 1 auto',
                                minWidth: '70px',
                                border: '1px solid #E2E8F0 !important',
                                borderRadius: '4px !important',
                                fontWeight: 600,
                                textTransform: 'none',
                                color: '#64748B',
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }
                            }
                        }}
                    >
                        {['1', '2', '3', '4', '5+'].map((bath) => (
                            <ToggleButton key={bath} value={bath}>{bath}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Tenure</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {TENURES.map((t) => (
                                <Button
                                    key={t.value}
                                    variant={tenure.includes(t.value) ? 'contained' : 'outlined'}
                                    onClick={() => toggleMultiSelect(t.value, tenure, setTenure)}
                                    sx={{
                                        borderRadius: 0.75,
                                        borderWidth: '1px !important',
                                        borderColor: tenure.includes(t.value) ? 'primary.main' : '#E2E8F0',
                                        color: tenure.includes(t.value) ? 'white' : '#64748B',
                                        bgcolor: tenure.includes(t.value) ? 'primary.main' : 'white',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        boxShadow: 'none',
                                        '&:hover': { bgcolor: tenure.includes(t.value) ? 'primary.dark' : '#F8FAFC' }
                                    }}
                                >
                                    {t.label}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#1E293B' }}>Auction</Typography>
                        <Button
                            fullWidth
                            variant={isAuction ? 'contained' : 'outlined'}
                            onClick={() => setIsAuction(!isAuction)}
                            sx={{
                                borderRadius: 0.75,
                                borderWidth: '1px !important',
                                borderColor: isAuction ? 'primary.main' : '#E2E8F0',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.1,
                                color: isAuction ? 'white' : '#64748B',
                                bgcolor: isAuction ? 'primary.main' : 'white',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: isAuction ? 'primary.dark' : '#F8FAFC' }
                            }}
                        >
                            Auction Properies Only
                        </Button>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ my: 1, borderColor: '#F1F5F9' }} />

                {/* Footer Action Buttons - Sticky at the bottom */}
                <Box
                    sx={{
                        position: 'sticky',
                        bottom: -24, // Matches DialogContent px: 3 padding offset
                        bgcolor: 'white',
                        pt: 2,
                        pb: 2,
                        mt: 'auto',
                        borderTop: '1px solid #F1F5F9',
                        zIndex: 10,
                        mx: -3, // Counteract DialogContent px: 3 padding
                        px: 3,
                        display: 'flex',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        fullWidth
                        sx={{
                            py: 1.5,
                            borderRadius: 1,
                            borderColor: '#CBD5E1',
                            color: '#0F172A',
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': { borderColor: '#94A3B8', bgcolor: '#F8FAFC' }
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleApplyFilters}
                        fullWidth
                        sx={{
                            py: 1.5,
                            borderRadius: 1,
                            fontWeight: 700,
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' }
                        }}
                    >
                        Apply Filters
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default Filters;
