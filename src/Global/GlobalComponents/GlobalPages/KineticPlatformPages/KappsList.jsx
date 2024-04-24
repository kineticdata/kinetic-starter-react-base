import React, { useContext, useEffect, useMemo, useState } from "react";
import { fetchKapps } from '@kineticdata/react';
import { KineticCard } from "../../Widgets/KineticCard";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { PageTitle } from "../../Widgets/PageTitle";
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { Link } from "react-router-dom";
import { formatDate } from "../../../GlobalResources/Helpers";

export const KappsList = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ kappsList, setKappsList ] = useState([]);

    useEffect(() => {
        updateBreadcrumbs({
            pageNames: ['Kapps List'],
            path: '/kapps'
        });
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
                        subtext={formatDate(kapp.updatedAt, 'MMM Do YYYY')}
                        linkPath={kapp.slug}
                        cardClassname='kapp-card' 
                    />
        })
    }, [kappsList])

    // TODO: Add th to URL
    const pageTitleLink = useMemo(() => {
        return (
            <Link className="support-docs-link link">
                <div className="fa fa-book link-spacing" aria-hidden="true" />
                Kapp Support Docs
            </Link>
        )
    }, [])
    
    return kappsList.length ? (
        <div className='kapps-list-page-wrapper'>
            <PageTitle title='KAPPS' rightSide={pageTitleLink} />
            <div className="kapp-cards-wrapper">
                {generateKappCards}
            </div>
        </div>
    ) : <LoadingSpinner />
};
