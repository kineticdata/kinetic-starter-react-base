import { useEffect, useRef } from "react";

// Helper.js is a global file that provides mutli use 
// helper functions for within the application.

export const urlPrefix = process.env.REACT_APP_PROXY_HOST;

export const formatDate = ( date, dateFormat ) => {
    return moment(date).format(dateFormat)
}

// Fetches form field values from query parameters and
// returns them as a map
export const valuesFromQueryParams = queryParams => {
    return Object.entries(Object.fromEntries([...queryParams])).reduce((values, [key, value]) => {
        if (key.startsWith('values[')) {
          const vk = key.match(/values\[(.*?)\]/)[1];
          return { ...values, [vk]: value };
        }
        return values;
    }, {});
};

// Builds the modal content, adding in a ref hook and event listener for any 
// mouseclicks outside the modal, which will close it
export const withClickOutside = (ModalContent, isOpen, setIsOpen) => {
  const Component = (props) => {
    const ref = useRef();
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current !== null && 
          ref.current !== undefined && 
          !ref.current.contains(event.target)) {
          setIsOpen();
        }
      };

      const handleEscapePress = event => {
        if (isOpen && event.key === 'Escape') {
          setIsOpen();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapePress);
    }, [ref]);
  
      return <ModalContent isOpen={isOpen} setIsOpen={setIsOpen} ref={ref} />;
    };
  
    return <Component />;
  }
  