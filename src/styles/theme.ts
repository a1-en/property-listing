import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3B82F6', // Modern vibrant blue
            light: '#60A5FA',
            dark: '#2563EB',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10B981', // Emerald for secondary actions/status
        },
        background: {
            default: '#F8FAFC', // Very light grey-blue background
            paper: '#ffffff',
        },
        text: {
            primary: '#1E293B', // Slate 800
            secondary: '#64748B', // Slate 500
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            color: '#0F172A',
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        body1: {
            color: '#1E293B',
        },
        body2: {
            color: '#64748B',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    border: '1px solid #E2E8F0',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});

export default theme;
