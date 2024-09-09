import React, { useContext, useEffect, useMemo, useState } from "react";
import { fetchKapps } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { formatDate } from "../../../GlobalResources/Helpers";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const KappsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ kappsList, setKappsList ] = useState([]);
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        updateBreadcrumbs({
            pageNames: ['Kapps List'],
            path: '/kapps'
        });
    }, [])

    useEffect(() => {
        fetchKapps({include: 'details, attributesMap[Icon]'})
            .then(({ kapps, error }) => !error ? setKappsList(kapps) : setPageError(error));
    }, [])

    const generateKappCards = useMemo(() => {
        return kappsList.map((kapp,idx) => {
            return (
                <CardActionArea href={kapp.slug} sx={{ border: 'none'}} key={idx}>
                    <Card sx={{ 
                        border: 'solid 2px', 
                        borderColor: 'greyscale.tertiary',
                        bgcolor: 'greyscale.quinary',
                        borderRadius: '.75rem',
                        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            bgcolor: 'primary.quaternary',
                            borderColor: 'primary.secondary'
                        }
                    }}>
                        <Box 
                            sx={{
                                m: '2rem 1.75rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: '1.5rem',
                                color: 'greyscale.main'
                            }}
                        >
                            <Box className={`${kapp.attributesMap['Icon'] && `las ${kapp.attributesMap['Icon'][0]}`}`} sx={{ fontSize: '2.25rem', height: '2.25rem' }} />
                            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'fex', flexWrap: 'wrap'}}>
                                {kapp.name}
                            </Box>
                            <Box sx={{ fontSize: '1rem', fontStyle: 'italic'}}>
                                {`Last Updated: ${formatDate(kapp.updatedAt, 'MMM Do YYYY')}`}
                            </Box>
                        </Box>
                    </Card>
                </CardActionArea>
            )
        })
    }, [kappsList])

    const pageTitleLink = useMemo(() => {
        return (
            <Link 
                to='https://docs.kineticdata.com/docs/kapps'
                target="_blank"
                sx ={{ 
                    display: 'flex',
                    alignItems: 'center',
                    ml: '1rem',
                    borderRadius: '.25rem',
                    fontWeight: 'bold',
                    color: 'primary.secondary',
                    textDecoration: 'none',
                    p: '0.5rem 0.75rem',
                    '&:hover': {
                        color: 'primary.primary',
                        bgcolor: 'primary.quaternary',
                        cursor: 'pointer'
                    }
                }} 
            >
                <MenuBookIcon sx={{ mr: '.5rem' }} />
                Kapp Support Docs
            </Link>
        )
    }, [])
    
    return kappsList.length && !pageError ? (
        <Box sx={{width: '100%', mb: '1rem'}}>
            <PageTitle title='Kapps' rightSide={pageTitleLink} />
            <Box 
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(calc(25% - 2rem), 1fr))',
                    gap: '2rem'
                }}
            >
                {generateKappCards}
            </Box>
        </Box>
    ) : <LoadingSpinner error={pageError} />
};
