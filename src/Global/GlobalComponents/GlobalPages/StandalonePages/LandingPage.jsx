import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// LandingPage redirects to the kapps list by default,
// update this component if a unique landing page is needed.
export const LandingPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/kapps')
    },[])
};          