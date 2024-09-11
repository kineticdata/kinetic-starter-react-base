import { useEffect } from "react";

// Landing pages allow optional contend to be rendered however
// the default setting will route users through the page unless
// unique content is added here.
export const KappLanding = () => {
    
    useEffect(() => {
        // use location replace so this page does not get added to browser history.
        window.location.replace(`${window.location.href}/forms`);
    }, [])
};
