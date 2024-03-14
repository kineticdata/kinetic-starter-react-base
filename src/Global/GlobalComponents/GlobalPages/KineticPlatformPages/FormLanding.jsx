import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { useParams } from "react-router-dom";
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

    return formData && (
        <>
            <PageTitle title={formData.name} subtext={formData.description && formData.description} />
            <CoreForm
                kapp={kappSlug}
                form={formSlug}
            />
        </>
    )
};
