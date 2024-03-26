import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchForm, searchSubmissions, defineKqlQuery } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticTable } from "../../Widgets/KineticTable";

export const FormSubmissionsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ formsData, setFormsData ] = useState();
    const [ submissionsData, setsubmissionsData ] = useState();
    const { kappSlug, formSlug } = useParams();

    const columns = useMemo(() => {
        return [{
            title: 'Handle', 
            value: 'handle', 
            sortBy: 'string',
        }, 
        {
            title: 'Label', 
            value: 'label', 
            sortBy: 'string',
        },
        {
            title: 'State', 
            value: 'state', 
            sortBy: 'string',
        }, 
        {
            title: 'Created at', 
            value: 'createdAt', 
            sortBy: 'date',
        },
        {
            title: 'Updated at', 
            value: 'updatedAt', 
            sortBy: 'date',
        }];
    }) 

    const getState = state =>  {
        return (
            <div className={`state ${state.toLowerCase()}`}>
                {state}
            </div>
        )
    };

    const getSubmissionLink = ( handle, submissionId ) => {
        return (
            <Link   
                to={`${submissionId}`}
                className="link"
            >
                {handle}
            </Link>
        )
    };

    useEffect(() => {
        if(formsData) {
            updateBreadcrumbs({ page: `${formsData.name} Submissions`, path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`});
        }
    }, [formsData]);

    useEffect(() => {
        fetchForm({ kappSlug, formSlug, include: 'details' }).then(({ form }) => setFormsData(form));

        const query = defineKqlQuery()
            .end();

        searchSubmissions({
            kappSlug,
            search: {
                q: query({}),
                include: ['details', 'values']
            }
            }).then(({ submissions }) => {
                const parsedData = submissions.map(submission => ({
                    handle: {
                        toDisplay: getSubmissionLink(submission.handle, submission.id),
                        toSort: submission.handle,
                    },
                    label: submission.label,
                    state: {
                        toDisplay: getState(submission.coreState),
                        toSort: submission.coreState,
                    },
                    createdAt: {
                        toDisplay: moment(submission.createdAt).format('MMMM Do, YYYY - h:mm:ss a'),
                        toSort: submission.createdAt,
                    },
                    updatedAt: {
                        toDisplay: moment(submission.updatedAt).format('MMMM Do, YYYY - h:mm:ss a'),
                        toSort: submission.updatedAt,
                    },
                }));
                setsubmissionsData(parsedData);
            }
        );
    }, [kappSlug, formSlug]);

    return formsData && submissionsData ? (
        <>
            <PageTitle title={`${formsData.name} Submissions`} />
            <KineticTable columns={columns} data={submissionsData} showPagination />
        </>
    ) : <LoadingSpinner />
};
