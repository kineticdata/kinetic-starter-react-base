import React, { useMemo } from "react";
import { formatDate } from "../../../GlobalResources/Helpers";

export const ActivitiesCard = ({ activity }) => {

    const parsedData = useMemo(() => {
        try {
            return activity.data ? JSON.parse(activity.data) : 'N/A';
        } catch (e) {
            return activity.data;
        }
    })

    const getBadgeColors = () => {
        switch (activity.type) {
            case 'Approval':
                return 'badge-approval';
            case 'Submission Submitted':
                return 'badge-submitted';
            default: 
                return 'badge-approval';
        }
    }

    return (
        <div className="activity-card-wrapper">
            <div className="space-between-row">
                <div className="activity-title">{activity.label}</div>
                <div className={`activity-type ${getBadgeColors()}`}>{activity.type}</div>
            </div>
            <>
            {typeof parsedData === 'object' ?
                <ul>
                    {Object.keys(parsedData).map((dataKey, idx) => <li key={idx}>{dataKey}: {parsedData[dataKey] || 'N/A'}</li>)}
                </ul>
            :
                <div className="activity-body">{parsedData}</div>
            }
            </>
            <div className="space-between-row">
                <div className="activity-date"><div className="activity-date-title">Created:</div>  {formatDate(activity.createdAt, 'MM/DD/YYYY')}</div>
                <div className="activity-date"><div className="activity-date-title">Last Update:</div>  {formatDate(activity.updatedAt, 'MM/DD/YYYY')}</div>
            </div>
        </div>
    )
};