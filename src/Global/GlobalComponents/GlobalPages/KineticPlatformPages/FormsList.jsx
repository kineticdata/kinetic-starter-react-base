import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchKapp, fetchForms } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { KineticTable } from "../../Widgets/KineticTable";

export const FormsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [kappData, setKappData ] = useState();
    const [formsData, setFormsData ] = useState();
    const { kappSlug } = useParams();

    const columns = useMemo(() => {
        return [{
            title: 'Form Name', 
            value: 'name', 
            sortable: true,
        }, {
            title: 'Description', 
            value: 'description', 
            sortable: true,
        },{
            title: 'Updated at', 
            value: 'updatedAt', 
            sortable: true,
        },{
            title: '', 
            value: 'submissionsLink', 
            sortable: true,
        }];
    }) 

    const getViewSubmissionsLink = formSlug =>  {
        return (
            <Link 
                to={`forms/${formSlug}/submissions`} 
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
            updateBreadcrumbs({ page: `${kappData.name}`, path: `/kapps/${kappSlug}/forms`});
        }
    }, [kappData])

    useEffect(() => {
        fetchKapp({ kappSlug, include: 'details' }).then(({ kapp }) => setKappData(kapp));
        fetchForms({ kappSlug, include: 'details' }).then(({ forms }) => {
            const parsedData = forms.map(form => ({
                name: getFormLink(form.name, form.slug), 
                description: form.description, 
                updatedAt: moment(form.updatedAt).format('MMMM Do, YYYY h:mm:ss a'),
                submissionsLink: getViewSubmissionsLink(form.slug)
            }))
            setFormsData(parsedData)
        });
    }, [kappSlug])


    return kappData && formsData ? (
        <>
            <PageTitle title={kappData.name} />
            <KineticTable columns={columns} data={formsData} showPagination />
        </>
    ) : <LoadingSpinner />
};
