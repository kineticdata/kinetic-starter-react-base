import React, { useMemo } from "react";
import { formatDate } from "../../../GlobalResources/Helpers";

export const ActivitiesCard = ({activity}) => {

    const parsedData = useMemo(() => {
        try {
            return activity.data ? JSON.parse(activity.data) : 'N/A';
        } catch (e) {
            return activity.data;
        }
    })

    return (
        <div className="activity-card-wrapper">
            <div className="space-between-row">
                <div className="activity-title">{activity.label}</div>
                <div className="activity-type">{activity.type}</div>
            </div>
            <>
            {console.log('OPE', parsedData, Object.keys(parsedData))}
            {typeof parsedData === 'object' ?
                <ul>
                    {Object.keys(parsedData).map((dataKey, idx) => <li key={idx}>{dataKey}: {parsedData[dataKey] || 'N/A'}</li>)}
                </ul>
            :
                <div className="activity-body">{parsedData}</div>
            }
            </>
            <div className="space-between-row">
                <div className="activity-date">Created:<br /> {formatDate(activity.createdAt, 'MMMM Do, YYYY - h:mm:ss a')}</div>
                <div className="activity-date">Last Update:<br /> {formatDate(activity.updatedAt, 'MMMM Do, YYYY - h:mm:ss a')}</div>
            </div>
        </div>
    )
};