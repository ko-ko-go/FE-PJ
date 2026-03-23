"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                gap: 2
            }}
        >
            <CircularProgress color="secondary" size={48} thickness={4} />
            <Typography variant="h6" color="text.secondary" fontWeight="500">
                Loading...
            </Typography>
        </Box>
    );
}
