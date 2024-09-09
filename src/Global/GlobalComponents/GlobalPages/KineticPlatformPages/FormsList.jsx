import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { fetchKapp, fetchForms } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { formatDate, sortAlpha } from "../../../GlobalResources/Helpers";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

export const FormsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const { kappSlug } = useParams();
    const [ kappData, setKappData ] = useState();
    const [ formsData, setFormsData ] = useState();
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        if(kappData) {
            updateBreadcrumbs({
                pageNames: ['Kapps List', kappData.name, 'Forms List'],
                path: `/kapps/${kappSlug}/forms`});
        }
    }, [kappData])

    useEffect(() => {
        fetchKapp({ kappSlug, include: 'details' })
            .then(({ kapp, error }) => !error ? setKappData(kapp) : setPageError(error));
        fetchForms({ kappSlug, include: 'details' }).then(({ forms, error }) => {
            if (!error) {
                const parsedData = forms.map((form, idx) => ({
                    name: form, 
                    description: form.description, 
                    updatedAt: form.updatedAt,
                    submissionsLink: form,
                    id: idx
                }))
                setFormsData(parsedData)
            } else {
                setPageError(error)
            }
        });
    }, [kappSlug])    

    const getFormLink = props => (
        <Link  
            component={RouterLink} 
            to={`${props.value.slug}`}
            sx ={{ 
                fontWeight: 'bold',
                color: 'primary.secondary',
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                }
            }} 
        >
            {props.value.name}
        </Link>
    );

    const getViewSubmissionsLink = props =>  (
        <Link 
            component={RouterLink}
            to={`${props.value.slug}/submissions`} 
            sx ={{ 
                fontWeight: 'bold',
                color: 'primary.secondary',
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                }
            }} 
        >
            View Form Submissions
        </Link>
    );

    const columns = useMemo(() => {
        return [{
            headerName: 'Form Name', 
            field: 'name', 
            renderCell: getFormLink,
            type: 'string',
            sortComparator: sortAlpha,
            flex: 1
        }, {
            headerName: 'Description', 
            field: 'description', 
            flex: 2
        },{
            headerName: 'Updated at', 
            field: 'updatedAt', 
            renderCell: props => formatDate(props.value, 'MMMM Do, YYYY - h:mm:ss a'),
            flex: 1
        },{
            headerName: ' ',
            field: 'submissionsLink', 
            renderCell: getViewSubmissionsLink,
            flex: 1
        }];
    }) 

    const kappSubmissionsLink = useMemo(() => (
        <Link 
            component={RouterLink} 
            to={`/kapps/${kappSlug}/submissions`}
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
            View Kapp Submissions
        </Link>
    ), [kappSlug])

    return kappData && formsData && !pageError ? (
        <> 
            <PageTitle title={kappData.name} rightSide={kappSubmissionsLink} />
            <Box>
                <DataGrid 
                    columns={columns} 
                    rows={formsData} 
                    autoHeight={true}
                    pageSizeOptions={[ 10, 25, 50, 100]} 
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{ mb: '1.5rem'}}
                />
            </Box>
        </>
    ) : <LoadingSpinner error={pageError} />
};
