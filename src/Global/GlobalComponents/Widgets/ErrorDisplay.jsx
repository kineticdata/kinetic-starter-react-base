import React from "react";
import Box from '@mui/material/Box';

export const ErrorDisplay = ({error}) => {
// Console log the error being returned 
    console.log('The following error has ocurred:', `\n`, `\n`, error);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            m: 'auto'
        }}>
            Oops! <br />
            Something went wrong on this page, <br />
            if the problem persists please contact your administrator.
        </Box>
    )
}