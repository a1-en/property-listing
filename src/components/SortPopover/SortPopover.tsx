import React from 'react';
import {
    Popover,
    Box,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface SortPopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    currentSort: string;
    handleSortChange: (val: string) => void;
    getSortLabel: (val: string) => string;
}

const SortPopover: React.FC<SortPopoverProps> = ({
    open,
    anchorEl,
    onClose,
    currentSort,
    handleSortChange,
    getSortLabel
}) => {
    React.useEffect(() => {
        const handleScroll = () => {
            if (open) {
                onClose();
            }
        };

        if (open) {
            // Use capture phase to catch scroll events from any parent/container
            document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        }

        return () => {
            document.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, [open, onClose]);

    const sortOptions = [
        { label: 'Recommended', value: 'default' },
        { label: 'Price: Low to High', value: 'priceLowToHigh' },
        { label: 'Price: High to Low', value: 'priceHighToLow' },
        { label: 'Floor Size: Low to High', value: 'floorSizeLowToHigh' },
        { label: 'Floor Size: High to Low', value: 'floorSizeHighToLow' },
        { label: 'PSF: Low to High', value: 'psfLowToHigh' },
        { label: 'PSF: High to Low', value: 'psfHighToLow' },
        { label: 'Newest Listings', value: 'newest' },
        { label: 'Oldest Listings', value: 'oldest' },
    ];

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { p: 0, width: 260, borderRadius: 1, mt: 1, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } }}
        >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
                <Typography sx={{ fontWeight: 700 }}>Sort By</Typography>
                <Button
                    size="small"
                    onClick={() => { handleSortChange('default'); onClose(); }}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                    Clear
                </Button>
            </Box>

            <Stack spacing={0}>
                {sortOptions.map((option) => (
                    <Button
                        key={option.value}
                        fullWidth
                        onClick={() => { handleSortChange(option.value); onClose(); }}
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
    );
};

export default SortPopover;
