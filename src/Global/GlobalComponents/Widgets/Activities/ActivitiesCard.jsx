import React, { useMemo } from "react";
import { formatDate, getStatusColors } from "../../../GlobalResources/Helpers";
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

export const ActivitiesCard = ({ activity }) => {

    const parsedData = useMemo(() => {
        try {
            return activity.data ? JSON.parse(activity.data) : 'N/A';
        } catch (e) {
            return activity.data;
        }
    })

    const getChipStyle = useMemo(() => {
        return getStatusColors(activity.type);
    }, [activity])

    return (
        <Card 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
                p: '.75rem',
                borderRadius: '.25rem',
                bgcolor: 'greyscale.quaternary'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <Box sx={{ fontSize: '1.25rem', fontWeight: '600' }}>{activity.label}</Box>
                <Chip label={activity.type} sx={getChipStyle} />
            </Box>
            <>
            {typeof parsedData === 'object' ?
                <ul>
                    {Object.keys(parsedData).map((dataKey, idx) => <li key={idx}>{dataKey}: {parsedData[dataKey] || 'N/A'}</li>)}
                </ul>
            :
                <Box>{parsedData}</Box>
            }
            </>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <Box sx={{ display: 'flex'}}>
                    <Box sx={{ 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        lineHeight: '1.5', 
                        mr: '.25rem'
                    }}>Created:
                    </Box>  
                        {formatDate(activity.createdAt, 'MM/DD/YYYY')}
                    </Box>
                <Box sx={{ display: 'flex'}}>
                    <Box sx={{ 
                        fontSize: '1rem', 
                        fontWeight: 'bold', 
                        lineHeight: '1.5', 
                        mr: '.25rem'
                    }}>Last Update:
                    </Box>  
                        {formatDate(activity.updatedAt, 'MM/DD/YYYY')}
                    </Box>
            </Box>
        </Card>
    )
};