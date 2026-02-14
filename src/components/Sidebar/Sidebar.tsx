import React from 'react';
import {
    Grid,
    Stack,
    Box,
    Typography,
    Link,
    Paper,
    Chip,
    Button,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface SidebarProps {
    totalCount: number;
    listingType: string;
}

const Sidebar: React.FC<SidebarProps> = ({ totalCount, listingType }) => {
    return (
        <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={4}>
                {/* Resources Section */}
                <Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: '1.25rem' }}>Property Discovery & Resources</Typography>
                    <Typography variant="body2" color="#64748B" sx={{ mb: 2, lineHeight: 1.6, fontSize: '0.95rem' }}>
                        There are {totalCount?.toLocaleString()} Properties for {listingType === 'rent' ? 'rent' : 'sale'} in Malaysia. You can use the enhanced search filters available to find the right
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
                            View all {totalCount?.toLocaleString()} Properties for {listingType} in Malaysia on an interactive map. Find listings near your preferred locations, schools, and amenities.
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
    );
};

export default Sidebar;
