import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { Link, useParams } from "react-router-dom";
import { fetchForm } from '@kineticdata/react';
import { CoreForm } from "@kineticdata/react/lib/components";
import { PageTitle } from "../../Widgets/PageTitle";

export const FormLanding = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ formData, setFormData ] = useState();
    const { kappSlug, formSlug } = useParams();

    useEffect(() => {
        if(formData) {
            updateBreadcrumbs({ 
                page: `${formData.name} Form`, 
                path: `/kapps/${kappSlug}/forms/${formSlug}`
            });
        }
    }, [formData]);

    useEffect(() => {
        fetchForm({ kappSlug, formSlug }).then(({ form }) => setFormData(form));
    }, [])

    const pageTitleLink = useMemo(() => {
        return (
            <Link to='submissions' className="support-docs-link link">
                <div className="fa fa-book link-spacing" aria-hidden="true" />
                Form Submissions
            </Link>
        )
    }, [])

    return formData && (
        <>
            <PageTitle title={formData.name} subtext={formData.description && formData.description} rightSide={pageTitleLink} />
            <div className="form-page-wrapper">
                <CoreForm
                    kapp={kappSlug}
                    form={formSlug}
                />
            </div>
        </>
    )
};
