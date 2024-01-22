import React from 'react';
import { WallySpinner } from '../../Assets/Images/Loading';

export const LoadingSpinner = () => {

    return (
        <div className='loading-wrapper'>
            <WallySpinner />
            <div id="html-spinner" />
        </div>
    );
};