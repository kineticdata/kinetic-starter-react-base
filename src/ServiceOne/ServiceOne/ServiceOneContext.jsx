import { createContext, useMemo, useState } from 'react';

// Create the context for use
export const ServiceOneContext = createContext({});

export function ServiceOneContextWrapper({children}) {
    const [ serviceOneCount, setServiceOneCount ] = useState(0);

    const ServiceOneContextData = useMemo(() => ({
            serviceOneCount,
            setServiceOneCount
    }), [serviceOneCount]);
    
    return (
        <ServiceOneContext.Provider value={ServiceOneContextData}>
            {children}
        </ServiceOneContext.Provider>
    );
}
