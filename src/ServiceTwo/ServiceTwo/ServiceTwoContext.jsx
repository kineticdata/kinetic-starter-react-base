import { createContext, useMemo, useState } from 'react';

// Create the context for use
export const ServiceTwoContext = createContext({});

export function ServiceTwoContextWrapper({children}) {
    const [ serviceTwoCount, setServiceTwoCount ] = useState(0);

    const ServiceTwoContextData = useMemo(() => ({
        serviceTwoCount,
        setServiceTwoCount
    }), [serviceTwoCount]);
    
    return (
        <ServiceTwoContext.Provider value={ServiceTwoContextData}>
            {children}
        </ServiceTwoContext.Provider>
    );
}
