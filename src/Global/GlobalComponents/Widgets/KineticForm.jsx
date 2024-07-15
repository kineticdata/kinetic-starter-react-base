import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CoreForm } from '@kineticdata/react/lib/components';
import {valuesFromQueryParams} from '../../GlobalResources/Helpers'

export const KineticForm = props => {
    const { kappSlug, formSlug, submissionId, isEditMode } = props;
    const [ searchParams ] = useSearchParams();
    const [ kapp, setKapp ] = useState(kappSlug);
    const [ form, setForm ] = useState(formSlug);
    const paramFieldValues = valuesFromQueryParams(searchParams)
    const navigate = useNavigate();
  
    // if only a submissionId was passed in, set the Kapp Slug
    // and Form Slug used for redirecting
    const handleLoaded = () => form => {
        setForm(form.slug());
        setKapp(form.kapp().slug());
    };

    const handleRedirect = () => response => {
        // Check if either currentPage is null (pre form consolidation) or
        // displayedPage.type is not 'confirmation' (post form-consolidation)
        // to determine that there is no confirmation page and we should redirect.
        if (
            !response.submission.currentPage ||
            (response.submission.displayedPage &&
                response.submission.displayedPage.type !== 'confirmation')
        ) {
            navigate(`/kapps/${kapp}/forms/${form}/submissions`);
        }
    };

    return submissionId ? (
        <CoreForm
            submission={submissionId}
            review={isEditMode}
            onLoaded={handleLoaded()}
            onUpdated={handleRedirect()}
            onCompleted={handleRedirect()}
            {...props}
        />
    ) : (
        <CoreForm
            kapp={kapp}
            form={form}
            onCompleted={handleRedirect()}
            values={paramFieldValues || props.values}
            {...props}
        />
    );
};
