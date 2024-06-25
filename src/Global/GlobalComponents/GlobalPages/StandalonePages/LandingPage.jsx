import { useEffect } from 'react';

// LandingPage redirects to the kapps list by default,
// update this component if a unique landing page is needed.
export const LandingPage = () => {
    
    useEffect(() => {
        // use location replace so this page does not get added to browser history.
        window.location.replace(`${window.location.href}kapps`);
    },[])
};          