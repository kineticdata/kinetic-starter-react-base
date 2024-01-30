import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchKapp } from '@kineticdata/react';
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";

export const KappLanding = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [kappData, setKappData ] = useState();
    const { kappSlug } = useParams();

    useEffect(() => {
        if(kappData) {
            updateBreadcrumbs({ page: `${kappData.name}`, path: `/kapps/${kappData.slug}`});
        }
    }, [kappData])

    useEffect(() => {
        fetchKapp({ kappSlug, include: 'details' }).then(({ kapp }) => setKappData(kapp));
    }, [kappSlug])

    return kappData ? (
        <>
            <PageTitle title={kappData.name} />
        </>
    ) : <LoadingSpinner />
};
