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
    const [ pageError, setPageError ] = useState();

    useEffect(() => {
        updateBreadcrumbs({
            pageNames: ['Kapps List'],
            path: '/kapps'
        });
    }, [])

    useEffect(() => {
        fetchKapps({include: 'details, attributesMap[Icon]'})
            .then(({ kapps, error }) => !error ? setKappsList(kapps) : setPageError(error));
    }, [])

    const generateKappCards = useMemo(() => {
        return kappsList.map(kapp => {
            return <KineticCard 
                        key={kapp.slug}
                        title={kapp.name}
                        icon={kapp.attributesMap['Icon'] && kapp.attributesMap['Icon'][0] }
                        subtext={`Last Updated: ${formatDate(kapp.updatedAt, 'MMM Do YYYY')}`}
                        linkPath={kapp.slug}
                        cardClassname='kapp-card' 
                    />
        })
    }, [kappsList])

    const pageTitleLink = useMemo(() => {
        return (
            <Link to='https://docs.kineticdata.com/docs/kapps' className="support-docs-link link tertiary-btn" target="_blank">
                <div className="las la-book-open link-spacing standard-icon-size" aria-hidden="true" />
                Kapp Support Docs
            </Link>
        )
    }, [])
    
    return kappsList.length && !pageError ? (
        <div className='kapps-list-page-wrapper'>
            <PageTitle title='TEST' rightSide={pageTitleLink} />
            <div className="kapp-cards-wrapper">
                {generateKappCards}
            </div>
        </div>
    ) : <LoadingSpinner error={pageError} />
};
