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
    Avatar,
} from '@mui/material';
import { Property } from '@/lib/api/properties';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import GavelIcon from '@mui/icons-material/Gavel';

interface PropertyCardProps {
    property: Property;
    viewMode?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
    const isList = viewMode === 'list';

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
                flexDirection: isList ? { xs: 'column', sm: 'row' } : 'column',
                position: 'relative',
                borderRadius: 1,
                border: '1px solid #E2E8F0',
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: isList ? 'none' : 'translateY(-4px)',
                    boxShadow: '0 12px 20px -5px rgb(0 0 0 / 0.1)',
                    borderColor: 'primary.main'
                },
            }}
        >
            <Box sx={{
                position: 'relative',
                width: isList ? { xs: '100%', sm: '320px' } : '100%'
            }}>
                <CardMedia
                    component="img"
                    height={isList ? "100%" : "220"}
                    image={property.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
                    alt={property.name}
                    sx={{
                        objectFit: 'cover',
                        height: isList ? { xs: '200px', sm: '100%' } : '220px'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'linear-gradient(135deg, rgb(52, 98, 244), rgb(36, 79, 182))',
                        color: 'white',
                        px: '16px',
                        py: '8px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        boxShadow: 'rgba(52, 98, 244, 0.3) 0px 2px 8px',
                        zIndex: 2,
                    }}
                >
                    {formatPrice(property.price)}
                </Box>

                {/* Auction Badge */}
                {property.isAuction && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: 0,
                            bgcolor: '#FBBF24',
                            color: '#1E293B',
                            px: 2,
                            py: 1,
                            borderRadius: '0 8px 8px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                    >
                        <GavelIcon sx={{ fontSize: 18 }} />
                        Auction
                    </Box>
                )}

                {/* Share Button Overlay */}
                <IconButton
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: '#64748B',
                        '&:hover': { bgcolor: 'white' },
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                >
                    <IosShareIcon sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2.5, flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            fontSize: '1.15rem',
                            lineHeight: 1.3,
                            mb: 2,
                            color: '#1E293B',
                            display: '-webkit-box',
                            WebkitLineClamp: isList ? 1 : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {property.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: '#64748B', mr: 1, mt: 0.2 }} />
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#64748B',
                                fontSize: '0.9rem',
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {property.address}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BedIcon sx={{ fontSize: 18, color: '#64748B' }} />
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.9rem' }}>{property.bedRooms ?? '-'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BathtubIcon sx={{ fontSize: 18, color: '#64748B' }} />
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.9rem' }}>{property.bathRooms ?? '-'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SquareFootIcon sx={{ fontSize: 18, color: '#64748B' }} />
                            <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                                {areaValue > 0 ? areaValue.toLocaleString() : '-'} sqft
                            </Typography>
                        </Box>
                    </Stack>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SquareFootIcon sx={{ fontSize: 16, color: '#64748B', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.9rem' }}>
                            {psf > 0 ? `RM ${psf} psf` : '-'}
                        </Typography>
                    </Box>
                </Box>

                {/* Agent Section */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            src={property.account?.avatar || `https://i.pravatar.cc/150?u=${property.account?.id}`}
                            sx={{ width: 44, height: 44, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>
                                {property.account?.name || 'Authorized Agent'}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                <VerifiedIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#3B82F6' }}>
                                    Verified Agent
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <IconButton
                        sx={{
                            bgcolor: '#22C55E',
                            color: 'white',
                            '&:hover': { bgcolor: '#16A34A' },
                            width: 44,
                            height: 44
                        }}
                    >
                        <WhatsAppIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PropertyCard;
