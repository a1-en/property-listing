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
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import GrassIcon from '@mui/icons-material/Grass';
import FactoryIcon from '@mui/icons-material/Factory';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AppsIcon from '@mui/icons-material/Apps';
import { PropertyFilters } from '@/lib/api/properties';

interface FiltersProps {
    onFilterChange: (filters: PropertyFilters) => void;
    initialFilters?: PropertyFilters;
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

const Filters: React.FC<FiltersProps> = ({ onFilterChange, initialFilters = {} }) => {
    const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice?.toString() || '');
    const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice?.toString() || '');
    const [category, setCategory] = useState<string>(initialFilters.categories?.[0] || 'all');
    const [bedrooms, setBedrooms] = useState<string[]>(initialFilters.bedRooms?.map(b => b === 0 ? 'Studio' : b.toString()) || []);
    const [tenure, setTenure] = useState<string[]>(initialFilters.tenure || []);
    const [furnishing, setFurnishing] = useState<string[]>(initialFilters.furnishings || []);
    const [isAuction, setIsAuction] = useState<boolean>(initialFilters.isAuction || false);

    const handleApplyFilters = () => {
        const filters: PropertyFilters = {
            ...(category !== 'all' && { categories: [category] }), // Send category as is, assuming API expects exact casing
            ...(minPrice && { minPrice: parseFloat(minPrice) }),
            ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
            ...(bedrooms.length > 0 && {
                bedRooms: bedrooms.map(b => b === 'Studio' ? 0 : parseInt(b, 10))
            }),
            ...(tenure.length > 0 && { tenure }),
            ...(furnishing.length > 0 && { furnishings: furnishing }),
            ...(isAuction && { isAuction: true }),
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setCategory('all');
        setBedrooms([]);
        setTenure([]);
        setFurnishing([]);
        setIsAuction(false);
        onFilterChange({});
    };

    const toggleMultiSelect = (val: string, current: string[], setter: (v: string[]) => void) => {
        if (current.includes(val)) {
            setter(current.filter(item => item !== val));
        } else {
            setter([...current, val]);
        }
    };

    return (
        <Stack spacing={4}>
            {/* Price Range */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Price Range</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>Minimum Price</Typography>
                        <TextField
                            placeholder="Select min price"
                            fullWidth
                            size="small"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600 }}>Maximum Price</Typography>
                        <TextField
                            placeholder="Select max price"
                            fullWidth
                            size="small"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Property Category */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Property Category</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={category === cat.value ? 'contained' : 'outlined'}
                            startIcon={cat.icon}
                            onClick={() => setCategory(cat.value)}
                            sx={{
                                borderRadius: 0.75, // 3px for a squarer look
                                border: '1px solid #E2E8F0',
                                color: category === cat.value ? 'white' : 'text.primary',
                                bgcolor: category === cat.value ? 'primary.main' : 'white',
                                px: 1.5,
                                py: 0.8,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: category === cat.value ? 'primary.dark' : '#F8FAFC',
                                    borderColor: category === cat.value ? 'primary.dark' : '#CBD5E1',
                                }
                            }}
                        >
                            {cat.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Bedrooms */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Bedrooms</Typography>
                <ToggleButtonGroup
                    value={bedrooms}
                    onChange={(e, val) => setBedrooms(val)}
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        '& .MuiToggleButton-root': {
                            flex: 1,
                            minWidth: '80px',
                            border: '1px solid #E2E8F0 !important',
                            borderRadius: '4px !important',
                            fontWeight: 600,
                            textTransform: 'none',
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

            {/* Tenure */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Tenure</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {TENURES.map((t) => (
                        <Button
                            key={t.value}
                            variant={tenure.includes(t.value) ? 'contained' : 'outlined'}
                            onClick={() => toggleMultiSelect(t.value, tenure, setTenure)}
                            sx={{
                                flex: '1 1 calc(33.33% - 12px)',
                                minWidth: '80px',
                                borderRadius: 0.75,
                                border: '1px solid #E2E8F0',
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                color: tenure.includes(t.value) ? 'white' : 'text.primary',
                                bgcolor: tenure.includes(t.value) ? 'primary.main' : 'white',
                                '&:hover': {
                                    bgcolor: tenure.includes(t.value) ? 'primary.dark' : '#F8FAFC',
                                    borderColor: tenure.includes(t.value) ? 'primary.dark' : '#CBD5E1',
                                }
                            }}
                        >
                            {t.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Furnishing */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Furnishing</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {FURNISHINGS.map((f) => (
                        <Button
                            key={f.value}
                            variant={furnishing.includes(f.value) ? 'contained' : 'outlined'}
                            onClick={() => toggleMultiSelect(f.value, furnishing, setFurnishing)}
                            sx={{
                                flex: '1 1 calc(50% - 12px)',
                                minWidth: '120px',
                                borderRadius: 0.75,
                                border: '1px solid #E2E8F0',
                                textTransform: 'none',
                                fontWeight: 600,
                                py: 1.2,
                                color: furnishing.includes(f.value) ? 'white' : 'text.primary',
                                bgcolor: furnishing.includes(f.value) ? 'primary.main' : 'white',
                                '&:hover': {
                                    bgcolor: furnishing.includes(f.value) ? 'primary.dark' : '#F8FAFC',
                                    borderColor: furnishing.includes(f.value) ? 'primary.dark' : '#CBD5E1',
                                }
                            }}
                        >
                            {f.label}
                        </Button>
                    ))}
                </Box>
            </Box>

            {/* Auction */}
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>Auction</Typography>
                <Button
                    fullWidth
                    variant={isAuction ? 'contained' : 'outlined'}
                    onClick={() => setIsAuction(!isAuction)}
                    sx={{
                        borderRadius: 1,
                        border: '1px solid #E2E8F0',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5,
                        color: isAuction ? 'white' : 'text.primary',
                        bgcolor: isAuction ? 'primary.main' : 'white',
                        '&:hover': {
                            bgcolor: isAuction ? 'primary.dark' : '#F8FAFC',
                            borderColor: isAuction ? 'primary.dark' : '#CBD5E1',
                        }
                    }}
                >
                    Auction
                </Button>
            </Box>

            <Divider />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ position: 'sticky', bottom: 0, bgcolor: 'white', pt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 1, borderColor: 'primary.main', color: 'primary.main', fontWeight: 700, textTransform: 'none' }}
                >
                    Clear All
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 1, fontWeight: 700, textTransform: 'none' }}
                >
                    Apply Filters
                </Button>
            </Stack>
        </Stack>
    );
};

export default Filters;
