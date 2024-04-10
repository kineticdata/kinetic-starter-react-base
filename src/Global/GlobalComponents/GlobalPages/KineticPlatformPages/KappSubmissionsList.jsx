import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchKapp, searchSubmissions } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticTable } from "../../Widgets/KineticTable";
import { formatDate } from "../../../GlobalResources/Helpers";

export const KappSubmissionsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ kappData, setKappData ] = useState();
    const [ submissionsData, setSubmissionsData ] = useState();
    const { kappSlug } = useParams();

    const columns = useMemo(() => {
        return [{
            title: 'Handle', 
            value: 'handle', 
            sortBy: 'string',
        },{
            title: 'Label', 
            value: 'label', 
            sortBy: 'string',
        },{
            title: 'Form Name', 
            value: 'name', 
            sortBy: 'string',
        },{
            title: 'Submitter', 
            value: 'submittedBy', 
            sortBy: 'string',
        },{
            title: 'State', 
            value: 'state', 
            sortBy: 'string',
        },{
            title: 'Created at', 
            value: 'createdAt', 
            sortBy: 'date',
        }];
    }) 

    const getLink = ( name, formSlug, submissionId ) => {
        let url;
        if (submissionId) {
            url = `/kapps/${kappSlug}/forms/${formSlug}/submissions/${submissionId}`
        } else {
            url = `/kapps/${kappSlug}/forms/${formSlug}/`
        }

        return (
            <Link   
                to={url}
                className="link"
            >
                {name}
            </Link>
        )
    };

    const getState = state =>  {
        return (
            <div className={`state ${state.toLowerCase()}`}>
                {state}
            </div>
        )
    };

    useEffect(() => {
        if(kappData) {
            updateBreadcrumbs({ page: `${kappData.name} Submissions`, path: `/kapps/${kappSlug}/submissions`});
        }
    }, [kappData]);

    useEffect(() => {
        fetchKapp({ kappSlug, include: 'details' }).then(({ kapp }) => setKappData(kapp));
        searchSubmissions({ kappSlug, search: {include: ['details', 'form']} }).then(({ submissions }) => {
            const parsedData = submissions.map(submission => ({
                handle: {
                    toDisplay: getLink(submission.handle, submission.form.slug, submission.id),
                    toSort: submission.handle,
                },
                label: submission.label,
                name: {
                    toDisplay: getLink(submission.form.name, submission.form.slug),
                    toSort: submission.form.name,
                },
                submittedBy: submission.submittedBy || '',
                state: {
                    toDisplay: getState(submission.coreState),
                    toSort: submission.coreState,
                },
                createdAt: {
                    toDisplay: formatDate(submission.createdAt, 'MMMM Do, YYYY - h:mm:ss a'),
                    toSort: submission.createdAt,
                },
            }))
            setSubmissionsData(parsedData)
        });
    }, [kappSlug]);

    return kappData && submissionsData ? (
        <>
            <PageTitle title={`${kappData.name} Submissions`} />
            <KineticTable columns={columns} data={submissionsData} showPagination />
        </>
    ) : <LoadingSpinner />
};
