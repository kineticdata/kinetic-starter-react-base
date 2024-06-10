import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchKapp, fetchForms } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticClientTable } from "../../Widgets/KineticClientTable";
import { formatDate } from "../../../GlobalResources/Helpers";

export const FormsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const { kappSlug } = useParams();
    const [kappData, setKappData ] = useState();
    const [formsData, setFormsData ] = useState();
    const [ pageError, setPageError ] = useState();

    const columns = useMemo(() => {
        return [{
            title: 'Form Name', 
            value: 'name', 
            sortBy: 'string',
        }, {
            title: 'Description', 
            value: 'description', 
        },{
            title: 'Updated at', 
            value: 'updatedAt', 
            sortBy: 'date',
        },{
            title: ' ', 
            value: 'submissionsLink', 
        }];
    }) 

    const getViewSubmissionsLink = formSlug =>  {
        return (
            <Link 
                to={`${formSlug}/submissions`} 
                className="link"
            >
                View Form Submissions
            </Link>
        )
    };

    const getFormLink = ( formName, formSlug ) => {
        return (
            <Link   
                to={`${formSlug}`}
                className="link"
            >
                {formName}
            </Link>
        )
    }

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
                const parsedData = forms.map(form => ({
                    name: {
                        toDisplay: getFormLink(form.name, form.slug),
                        toSort: form.name,
                    }, 
                    description: form.description, 
                    updatedAt: {
                        toDisplay: formatDate(form.updatedAt, 'MMMM Do, YYYY - h:mm:ss a'),
                        toSort: form.updatedAt,
                    },
                    submissionsLink: getViewSubmissionsLink(form.slug)
                }))
                setFormsData(parsedData)
            } else {
                setPageError(error)
            }
        });
    }, [kappSlug])

    const kappSubmissionsLink = useMemo(() => (
        <Link className="button cancel support-docs-link" to={`/kapps/${kappSlug}/submissions`}>
            View Kapp Submissions
        </Link>
    ), [kappSlug])

    return (kappData && formsData) && !pageError ? (
        <> 
            <PageTitle title={kappData.name} rightSide={kappSubmissionsLink} />
            <KineticClientTable columns={columns} data={formsData} showPagination />
        </>
    ) : <LoadingSpinner error={pageError} />
};
