import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { Link, useParams } from "react-router-dom";
import { fetchForm } from '@kineticdata/react';
import { PageTitle } from "../../Widgets/PageTitle";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { KineticForm } from "../../Widgets/KineticForm";

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
            <Link to='submissions' className="support-docs-link link">
                <div className="fa fa-book link-spacing" aria-hidden="true" />
                Form Submissions
            </Link>
        )
    }, [])

    return formData && !pageError ? (
        <>
            <PageTitle title={formData.name} subtext={formData.description && formData.description} rightSide={pageTitleLink} />
            <div className="form-page-wrapper">
                <KineticForm
                    kappSlug={kappSlug}
                    formSlug={formSlug}
                />
            </div>
        </>
    ) : <LoadingSpinner error={pageError} />
};
