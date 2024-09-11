import React, { useContext } from "react";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";
import { Link as RouterLink } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export const BreadcrumbHandler = () => {
    const globalState = useContext(GlobalContext);
    const { breadcrumbs } = globalState;

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                m: '1rem 0 .75rem'
            }}
        >
            <Breadcrumbs
                separator={<NavigateNextIcon sx={{ color: 'primary.secondary', fontSize: '1.25rem'}} />}
                aria-label="breadcrumb"
            >
                {breadcrumbs.map((crumb, idx) => {
                    return (
                        <Link 
                            key={idx}
                            component={RouterLink}
                            to={crumb.path} 
                            sx={{
                                p: '.25rem .75rem',
                                borderRadius: '.25rem',
                                textDecoration: 'none',
                                color: 'primary.secondary',
                                fontWeight: 'bold',
                                '&:hover': {
                                    color: 'primary.primary',
                                    bgcolor: 'primary.quaternary',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                },
                                '&:focus': {
                                    color: 'primary.primary',
                                    bgcolor: 'primary.quaternary',
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            {crumb.page}
                        </Link>
                    )
                })}
            </Breadcrumbs>
        </Box>
    )
}