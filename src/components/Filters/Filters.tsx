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
    { label: 'Residential', value: 'Residential', icon: <HomeIcon fontSize="small" /> },
    { label: 'Commercial', value: 'Commercial', icon: <BusinessIcon fontSize="small" /> },
    { label: 'Agricultural', value: 'Agricultural', icon: <GrassIcon fontSize="small" /> },
    { label: 'Industrial', value: 'Industrial', icon: <FactoryIcon fontSize="small" /> },
    { label: 'Others', value: 'Others', icon: <MoreHorizIcon fontSize="small" /> },
];

const BEDROOMS = ['Studio', '1', '2', '3', '4', '5+'];

const Filters: React.FC<FiltersProps> = ({ onFilterChange, initialFilters = {} }) => {
    const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice?.toString() || '');
    const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice?.toString() || '');
    const [category, setCategory] = useState<string>(initialFilters.categories?.[0] || 'all');
    const [bedrooms, setBedrooms] = useState<string[]>(initialFilters.bedRooms?.map(b => b === 0 ? 'Studio' : b.toString()) || []);

    const handleApplyFilters = () => {
        const filters: PropertyFilters = {
            ...(category !== 'all' && { categories: [category] }), // Send category as is, assuming API expects exact casing
            ...(minPrice && { minPrice: parseFloat(minPrice) }),
            ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
            ...(bedrooms.length > 0 && {
                bedRooms: bedrooms.map(b => b === 'Studio' ? 0 : parseInt(b, 10))
            }),
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setCategory('all');
        setBedrooms([]);
        onFilterChange({});
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                                borderRadius: 2,
                                border: '1px solid #E2E8F0',
                                color: category === cat.value ? 'white' : 'text.primary',
                                bgcolor: category === cat.value ? 'primary.main' : 'white',
                                px: 2,
                                py: 1,
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
                            borderRadius: '8px !important',
                            fontWeight: 600,
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

            <Divider />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
                <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2, borderColor: 'primary.main', color: 'primary.main', fontWeight: 700 }}
                >
                    Clear All
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    fullWidth
                    sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                >
                    Apply Filters
                </Button>
            </Stack>
        </Stack>
    );
};

export default Filters;
