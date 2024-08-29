import React from "react";
import { ActivitiesCard } from "./ActivitiesCard";
import Box from '@mui/material/Box';

export const ActivitiesList = ({ activities }) => {
    
    return (
        <Box 
            sx={{
                flex: '1',
                maxHeight: '75vh',
                overflowY: 'auto',
                marginBottom: '3rem',
                borderRadius: '.75rem',
                boxShadow: '0 .25rem .375rem -.125rem rgba(0, 0, 0, 0.05), 0 .625rem 1rem -3px rgba(0, 0, 0, 0.1)',
                border: 'solid 1px',
                borderColor: 'greyscale.tertiary',
                bgcolor: 'greyscale.quinary'
            }}
        >
            <Box 
                sx={{ m: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}
            >
                <Box 
                    sx={{ fontSize: '1.25rem', fontWeight: '600'}}
                >
                    Activities
                </Box>
                {activities.map((activity, idx) => <ActivitiesCard key={idx} activity={activity} />)}
            </Box>
        </Box>
    )
}