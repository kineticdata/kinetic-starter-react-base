import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { fetchKapp, searchSubmissions } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { formatDate, getStatusColors, sortAlpha } from "../../../GlobalResources/Helpers";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

export const KappSubmissionsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const { kappSlug } = useParams();
    const [ kappData, setKappData ] = useState();
    const [ submissionsData, setSubmissionsData ] = useState();
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        if(kappData) {
            updateBreadcrumbs({
                pageNames: ['Kapps List', kappData.name, 'Submissions List'],
                path: `/kapps/${kappSlug}/submissions`});
        } else {
            fetchKapp({ kappSlug, include: 'details' }).then(({ kapp, error }) => !error ? setKappData(kapp) : setPageError(error));
        }
    }, [kappData]);

    useEffect(() => {
        searchSubmissions({ kappSlug, search: { include: ['details', 'form'] } }).then(({ submissions, error }) => {
          if (!error) {
            const parsedData = submissions.map((submission, idx) => ({
                handle: submission,
                label: submission.label,
                name: submission.form,
                submittedBy: submission.submittedBy || '',
                state: submission.coreState,
                createdAt: submission.createdAt,
                id: idx
            }))
            setSubmissionsData(parsedData);
          } else {
            setPageError(error);
          }
        });
    }, [kappSlug]);

    const getLink = props => {
        let url;
        if (props.value.id) {
            url = `/kapps/${kappSlug}/forms/${props.value.form.slug}/submissions/${props.value.id}`
        } else {
            url = `/kapps/${kappSlug}/forms/${props.value.form.slug}/`
        }

        return (
            <Link 
                to={url} 
                component={RouterLink}          
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
        )
    };

    const getState = props =>  <Chip label={props.value} sx={getStatusColors(props.value)} />;

    const columns = useMemo(() => ([
            { 
                headerName: 'Handle', 
                field: 'handle', 
                sortBy: true, 
                renderCell: getLink,
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
                headerName: 'Form Name', 
                field: 'name', 
                flex: 1
            },
            { 
                headerName: 'Submitter', 
                field: 'submittedBy', 
                sortBy: true, 
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
                sortBy: true, 
                flex: 1
            }
    ]));

    return kappData && submissionsData && !pageError ? (
        <>
            <PageTitle title={`${kappData.name} Submissions`} />
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
