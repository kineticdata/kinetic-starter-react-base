import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { fetchForm, searchSubmissions } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { formatDate, getStatusColors, sortAlpha } from "../../../GlobalResources/Helpers";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

export const FormSubmissionsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const { kappSlug, formSlug } = useParams();
    const [ formData, setFormData ] = useState();
    const [ submissionsData, setsubmissionsData ] = useState();
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        if(formData) {
            updateBreadcrumbs({
                pageNames: ['Kapps List', formData.kapp.name, 'Forms List', formData.name, 'Submissions List'],
                path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`
            });
        }
    }, [formData]);

    useEffect(() => {
        fetchForm({ kappSlug, formSlug, include: 'details, kapp' }).then(({ form, error }) => !error ? setFormData(form) : setPageError(error));

        searchSubmissions({
            kapp: kappSlug,
            form: formSlug,
            search: {
                include: ['details', 'values']
            }
            }).then(({ submissions, error }) => {
                if (!error) {
                    const parsedData = submissions.map((submission, idx) => ({
                        handle: submission,
                        label: submission.label,
                        state: submission.coreState,
                        createdAt: submission.createdAt,
                        updatedAt: submission.updatedAt,
                        id: idx
                    }));
                    setsubmissionsData(parsedData);
                } else {
                    setPageError(error);
                }
            }
        );
    }, [kappSlug, formSlug]);

    const getState = props =>  <Chip label={props.value} sx={getStatusColors(props.value)} />;

    const getSubmissionLink = props => (
        <Link  
            component={RouterLink} 
            to={`${props.value.id}`}
            sx ={{ 
                fontWeight: 'bold',
                color: 'primary.secondary',
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                }
            }} 
        >
            {props.value.handle}
        </Link>
    ); 

    const columns = useMemo(() => {
        return [{
            headerName: 'Handle', 
            field: 'handle', 
            renderCell: getSubmissionLink,
            type: 'string',
            sortComparator: sortAlpha,
            flex: 1
        }, 
        {
            headerName: 'Label', 
            field: 'label', 
            flex: 1
        },
        {
            headerName: 'State', 
            field: 'state', 
            renderCell: getState,
            flex: 1
        }, 
        {
            headerName: 'Created at', 
            field: 'createdAt', 
            renderCell: props => formatDate(props.value, 'MMMM Do, YYYY - h:mm:ss a'),
            flex: 1
        },
        {
            headerName: 'Updated at', 
            field: 'updatedAt',             
            renderCell: props => formatDate(props.value, 'MMMM Do, YYYY - h:mm:ss a'),
            flex: 1
        }];
    }) 
    
    const pageTitleLink = useMemo(() => {
            return (
                <Link 
                    component={RouterLink}
                    to={`/kapps/${kappSlug}/forms/${formSlug}`}
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
                    Create Submission
                </Link>
            )
    }, [])

    return formData && submissionsData && !pageError ? (
        <>
            <PageTitle title={`${formData.name} Submissions`} rightSide={pageTitleLink} />
            <Box>
                <DataGrid 
                    columns={columns} 
                    rows={submissionsData} 
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
