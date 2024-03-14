import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../GlobalResources/GlobalContextWrapper';
import { LoadingSpinner } from '../../Widgets/LoadingSpinner';

// LandingPage redirects to the kapps list by default,
// update this component if a unique landing page is needed.
export const LandingPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/kapps')
    },[])
};          