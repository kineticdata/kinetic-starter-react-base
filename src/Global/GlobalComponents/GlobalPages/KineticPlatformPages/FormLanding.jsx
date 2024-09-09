import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { Link as RouterLink, useParams } from "react-router-dom";
import { fetchForm } from '@kineticdata/react';
import { PageTitle } from "../../Widgets/PageTitle";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { KineticForm } from "../../Widgets/KineticForm";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export const FormLanding = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const { kappSlug, formSlug } = useParams();
    const [ formData, setFormData ] = useState();
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        if(formData) {
            updateBreadcrumbs({ 
                pageNames: ['Kapps List', formData.kapp.name, 'Forms List', formData.name],
                path: `/kapps/${kappSlug}/forms/${formSlug}`
            });
        }
    }, [formData]);

    useEffect(() => {
        fetchForm({
            kappSlug,
            formSlug,
            include: 'kapp'
        }).then(({ form, error }) => !error ? setFormData(form) : setPageError(error));
    }, [])

    const pageTitleLink = useMemo(() => {
        return (
            <Link 
                to='submissions' 
                component={RouterLink}
                sx ={{ 
                    display: 'flex',
                    alignItems: 'center',
                    ml: '1rem',
                    borderRadius: '.25rem',
                    fontWeight: 'bold',
                    color: 'primary.secondary',
                    textDecoration: 'none',
                    maxHeight: '3rem',
                    p: '0.5rem 0.75rem',
                    '&:hover': {
                        color: 'primary.primary',
                        bgcolor: 'primary.quaternary',
                        cursor: 'pointer'
                    }
                }} 
            >
                <MenuBookIcon sx={{ mr: '.5rem' }} />
                Form Submissions
            </Link>
        )
    }, [])

    const titleSubtext = useMemo(() => {
        if (formData && formData.description) {
            return (
                <Box sx={{ fontSize: 'medium', color: 'greyscale.secondary', fontWeight: '400'}}>
                    {formData.description}
                </Box>
            )
        }
    }, [formData])

    return formData && !pageError ? (
        <>
            <PageTitle title={formData.name} subtext={titleSubtext} rightSide={pageTitleLink} />
            <Box 
                sx={{
                    mb: '3rem',
                    borderRadius: '.75rem',
                    boxShadow: '0 .25rem .375rem -.125rem rgba(0, 0, 0, 0.05), 0 .625rem 1rem -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid',
                    borderColor: 'greyscale.tertiary',                
                }} 
            >
                <KineticForm
                    kappSlug={kappSlug}
                    formSlug={formSlug}
                />
            </Box>
        </>
    ) : <LoadingSpinner error={pageError} />
};
