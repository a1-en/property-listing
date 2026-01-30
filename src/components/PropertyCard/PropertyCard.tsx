import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Stack,
    IconButton,
} from '@mui/material';
import { Property } from '@/lib/api/properties';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const areaValue = property.floorSize ? parseFloat(property.floorSize) : 0;
    const psf = areaValue > 0 ? Math.round(property.price / areaValue) : 0;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="240"
                    image={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                    alt={property.name}
                    sx={{ objectFit: 'cover' }}
                />

                {/* Price Tag Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                >
                    {formatPrice(property.price)}
                </Box>

                {/* Favorite & Share Buttons */}
                <Stack
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16
                    }}
                >
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#f8fafc' },
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        <FavoriteBorderIcon fontSize="small" sx={{ color: '#64748B' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#f8fafc' },
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        <IosShareIcon fontSize="small" sx={{ color: '#64748B' }} />
                    </IconButton>
                </Stack>

                {/* Agent Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end'
                    }}
                >
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                        {property.account?.name || 'AGENT NAME'}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        lineHeight: 1.4,
                        mb: 1.5,
                        minHeight: '2.8rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'text.primary',
                    }}
                >
                    {property.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5, mt: 0.2 }} />
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {property.address}
                    </Typography>
                </Box>

                <Stack direction="row" spacing={2.5} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{property.bedRooms ?? '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BathtubIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{property.bathRooms ?? '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SquareFootIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {areaValue > 0 ? areaValue.toLocaleString() : '-'} sqft
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ pt: 2, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {psf > 0 ? `RM ${psf} psf` : '-'}
                    </Typography>
                    <Chip
                        label={property.category}
                        size="small"
                        sx={{
                            bgcolor: '#EFF6FF',
                            color: 'primary.main',
                            fontWeight: 700,
                            borderRadius: '4px',
                            textTransform: 'capitalize'
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PropertyCard;
