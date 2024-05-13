import React from "react";
import { ActivitiesCard } from "./ActivitiesCard";

export const ActivitiesList = ({activities, styling}) => {
    
    return (
        <div className={styling}>
            <div className="activities-list">
                <div className='activities-title'>
                    Activities
                </div>
                {activities.map((activity, idx) => <ActivitiesCard key={idx} activity={activity} />)}
            </div>
        </div>
    )
}