import React from 'react';
import {
    Drawer,
    Box,
    Stack,
    Typography,
    IconButton,
    Paper,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface SavedSearchesProps {
    open: boolean;
    onClose: () => void;
    savedSearches: any[];
    applySavedSearch: (search: any) => void;
    handleDeleteSavedSearch: (id: number) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({
    open,
    onClose,
    savedSearches,
    applySavedSearch,
    handleDeleteSavedSearch
}) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
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
                    <IconButton onClick={onClose}>
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
    );
};

export default SavedSearches;
