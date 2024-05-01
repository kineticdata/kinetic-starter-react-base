import React from 'react';
import { ErrorDisplay } from './ErrorDisplay';

export const LoadingSpinner = ({error}) => {

    return error ? 
    <ErrorDisplay error={error} /> :
    (
        <div className='loading-wrapper'>
            <div className="html-spinner" />
        </div>
    );
};