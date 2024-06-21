import React, { useContext, useEffect, useMemo, useState } from "react";
import { PageTitle } from "../../Widgets/PageTitle";
import { fetchSubmission } from '@kineticdata/react';
import { GlobalContext } from "../../../GlobalResources/GlobalContextWrapper";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../Widgets/LoadingSpinner";
import { type } from "jquery";

export const Ticket = () => {
    const globalState = useContext(GlobalContext);
    const { updateBreadcrumbs } = globalState;
    const [ ticketData, setTicketData ] = useState();
    const [ pageError, setPageError ] = useState();
    const { kappSlug, ticketId } = useParams();

    const reminderEmail = useMemo(() => {
        return <button
            className="cancel"
            onClick={() => console.log('REMINDER EMAIL')}
        >
                Send Reminder Email
        </button>
    } ,[])

    useEffect(() => {
        updateBreadcrumbs({
            pageNames: ['Kapps List', 'Kapp Landing', 'Ticket'],
            path: `/kapps/${kappSlug}/ticket/${ticketId}`
        });
    }, [])

    useEffect(() => {
        fetchSubmission({
            id: ticketId, 
            include: 'values, details'
        }).then(({ submission, error }) => !error ? setTicketData(submission) : setPageError(error))
    }, [ticketId])

    console.log('OPE', ticketData, ticketData && Object.keys(ticketData.values))

    return !pageError && ticketData ? (
        <>
            <PageTitle title='Ticket' rightSide={reminderEmail} />
            <div className='form-page-wrapper width-limit'>
                <div className="infowrapper">
                    {Object.keys(ticketData.values).map((keyValue, idx) => {
                        return (
                            <div key={idx} className="key-value-pair">
                                <div className="key">{keyValue}:</div>
                            </div>
                        )
                    })}
                </div>
                <div className="infowrapper">
                    {Object.keys(ticketData.values).map((keyValue, idx) => {
                        console.log('HIT', typeof ticketData.values[keyValue])
                        if (typeof ticketData.values[keyValue] === 'string') {
                            return (
                                <div key={idx} className="key-value-pair">
                                    <div className="value">{ticketData.values[keyValue] || 'N/A'}</div>
                                </div>
                            )
                        } else {
                            return (
                                <div key={idx} className="key-value-pair">
                                    <div className="value">N/A</div>
                                </div>
                            )

                        }
                    })}
                </div>
            </div>
        </>
    ) : <LoadingSpinner error={pageError} />
}