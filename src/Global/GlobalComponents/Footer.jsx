import React from "react";
import logo from '../Assets/Images/Kinetic-logo-white.svg'
import Box from '@mui/material/Box';

export const Footer = () => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: 'solid .125rem',
            borderColor: 'secondary.secondary',
            p: '.75rem 0',
            bgcolor: 'greyscale.main'
        }}
    >
        <a href='https://kineticdata.com/' target='_blank' aria-label="A link to the homepage.">
            <img src={logo} alt="Logo" aria-label="The KineticData logo" />
        </a>
    </Box>
);
