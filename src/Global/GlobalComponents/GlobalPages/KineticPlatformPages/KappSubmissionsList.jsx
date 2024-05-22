import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchKapp, searchSubmissions } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticQueryTable } from "../../Widgets/KineticQueryTable";
import { formatDate } from "../../../GlobalResources/Helpers";

export const KappSubmissionsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs, tableQuery } = globalState;
    const { kappSlug } = useParams();
    const [ kappData, setKappData ] = useState();
    const [ submissionsData, setSubmissionsData ] = useState();
    const [ pageError, setPageError ] = useState();

    const defaultQuery = { 
        kapp: kappSlug, 
        limit: 10,
        search: {
            include: ['details', 'form'],
            orderBy: 'handle',
            direction: 'ASC',
        } 
    };

    const columns = useMemo(() => ([
            { title: 'Handle', value: 'handle', sortBy: true },
            { title: 'Label', value: 'label', sortBy: true },
            { title: 'Form Name', value: 'name', sortBy: true },
            { title: 'Submitter', value: 'submittedBy', sortBy: true },
            { title: 'State', value: 'state', sortBy: true },
            { title: 'Created at', value: 'createdAt', sortBy: true }
        ]));

    const getLink = ( name, formSlug, submissionId ) => {
        let url;
        if (submissionId) {
            url = `/kapps/${kappSlug}/forms/${formSlug}/submissions/${submissionId}`
        } else {
            url = `/kapps/${kappSlug}/forms/${formSlug}/`
        }

        return (
            <Link to={url} className="link">
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
            updateBreadcrumbs({
                pageNames: ['Kapps List', kappData.name, 'Submissions List'],
                path: `/kapps/${kappSlug}/submissions`});
        } else {
            fetchKapp({ kappSlug, include: 'details' }).then(({ kapp }) => setKappData(kapp)).catch(error => setPageError(error));
        }
    }, [kappData]);

    useEffect(() => {
        searchSubmissions(tableQuery || defaultQuery).then(({ submissions }) => {
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
            console.log('OPE', tableQuery, parsedData)
            setSubmissionsData(parsedData)
        }).catch(error => setPageError(error));
    }, [kappSlug, tableQuery]);

    return kappData && submissionsData ? (
        <>
            <PageTitle title={`${kappData.name} Submissions`} />
            <KineticQueryTable columns={columns} data={submissionsData} defaultQuery={defaultQuery} />
        </>
    ) : <LoadingSpinner error={pageError} />
};
