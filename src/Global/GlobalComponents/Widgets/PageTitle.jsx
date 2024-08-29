import React from "react";
import Box from '@mui/material/Box';

export const PageTitle = ({ title, subtext, rightSide }) => (
    <Box 
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: '.75rem'
        }}
    >
        <>
            <Box sx={{ fontSize: '2rem', fontWeight: '800' }}>
                {title}
            {subtext && 
                <>
                    {subtext}
                </>
            }
            </Box>
        </>
        <>
            {rightSide && rightSide}
        </>
    </Box>
);
