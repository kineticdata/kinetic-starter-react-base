// Helper.js is a global file that provides mutli use 
// helper functions for use within the application.

import { useEffect, useRef, useState } from "react";

// TODO: verify the logic; do we only ever want 2 initials?
export const getUserInitials = displayName => {
    // Returns full name initials if seperated by a space
    if (displayName.includes(' ')) {
        return displayName.split(' ').map(name => name[0]).join('');
    //Returns first initial if there's not a space and displayName is not an email
    } else if (!displayName.includes('@')) {
        return displayName[0];
        // Returns email prefix if displayName an email
    } else if (displayName.includes('@')) {
        return displayName.split('@')[0];
    } else {
        return 'NA';
    }
}

export const formatDate = ( date, dateFormat ) => {
    return moment(date).format(dateFormat)
}

// Builds the modal content, adding in a ref hook and event listener for any 
// mouseclicks outside the modal. In that case it will close the modal
export const withClickOutside = (ModalContent, isOpen, setIsOpen) => {
  const Component = (props) => {
    const ref = useRef();
    
    useEffect(() => {
      const handleClickOutside = (event) => {
          if (ref.current !== null && 
            ref.current !== undefined && 
            !ref.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
      }, [ref]);
  
      return <ModalContent isOpen={isOpen} setIsOpen={setIsOpen} ref={ref} />;
    };
  
    return <Component />;
  }