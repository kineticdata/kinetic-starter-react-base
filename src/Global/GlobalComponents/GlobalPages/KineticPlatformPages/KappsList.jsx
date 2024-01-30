import React, { useContext, useEffect, useMemo, useState } from "react";
import { fetchKapps } from '@kineticdata/react';
import { KineticCard } from "../../Widgets/KineticCard";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";

export const KappsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ kappsList, setKappsList ] = useState([]);

    useEffect(() => {
        updateBreadcrumbs({ page: 'Kapps List', path: '/kapps'});
    }, [])

    useEffect(() => {
        fetchKapps({include: 'details, attributesMap[Icon]'})
            .then(({ kapps }) => setKappsList(kapps));
    }, [])

    const generateKappCards = useMemo(() => {
        return kappsList.map(kapp => {
            return <KineticCard 
                        key={kapp.slug}
                        title={kapp.name}
                        icon={kapp.attributesMap['Icon'][0]}
                        subtext={moment(kapp.updatedAt).format("MMM Do YYYY")}
                        linkPath={kapp.slug}
                        cardClassname='kapp-card' 
                    />
        })
    }, [kappsList])
    
    return kappsList.length ? (
        <div className='kapps-list-page-wrapper'>
            <PageTitle title='KAPPS' />
            <div className="kapp-cards-wrapper">
                {generateKappCards}
            </div>
        </div>
    ) : <LoadingSpinner />
};
