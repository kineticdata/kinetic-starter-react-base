import React, { useEffect, useMemo, useState } from "react";
import { fetchKapps } from '@kineticdata/react';
import { KineticCard } from "../../Widgets/KineticCard";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";

export const KappsList = () => {
    const [ kappsList, setKappsList ] = useState([]);

    useEffect(() => {
        fetchKapps({include: 'details, attributesMap[Icon]'})
            .then(({ kapps }) => setKappsList(kapps));
    }, [])

    const generateKappCards = useMemo(() => {
        return kappsList.map(kapp => {
            return <KineticCard 
                        key={kapp.name}
                        title={kapp.name}
                        icon={kapp.attributesMap['Icon'][0]}
                        subtext={moment(kapp.updatedAt).format("MMM Do YY")}
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
