import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


// Landing pages allow optional contend to be rendered however
// the default setting will route users through the page unless
// unique content is added here.
export const KappLanding = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('forms')
    }, [])
};
