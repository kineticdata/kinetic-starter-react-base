// Helper.js is a global file that provides mutli use 
// helper functions for use within the application.

import { useEffect, useRef } from "react";

const urlPrefix = process.env.REACT_APP_PROXY_HOST;

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

      const handleEscapePress = event => {
        if (isOpen && event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapePress);
    }, [ref]);
  
      return <ModalContent isOpen={isOpen} setIsOpen={setIsOpen} ref={ref} />;
    };
  
    return <Component />;
  }

  const fileSizeUnits = ['B', 'KB', 'MB', 'GB', 'TB'];

  export const humanizeFileSize = (sizeInBytes) => {
    let unitIndex = 0;
    let size = sizeInBytes;
    while (size > 1024 && unitIndex < fileSizeUnits.length - 1) {
      unitIndex++;
      size = size / 1024;
    }
    const fixed = Number.isInteger(size) ? size : size.toFixed(2);
    return `${fixed} ${fileSizeUnits[unitIndex]}`;
  }

  export const getHelpLinks = spaceAdmin => {
    return [
      spaceAdmin && {
        render: 
          <a 
            id='platform-documentation'
            href='https://docs.kineticdata.com/' 
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Platform Documentation
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>
      },
      spaceAdmin && {
        render: 
          <a 
            id='documentation-lin'
            href={`${urlPrefix}/app/docs/space/core`}
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            API Reference Docs        
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>
      },
      {
        render: 
          <a 
            id='bundle-documentation'
            href='https://docs.kineticdata.com/docs/bundle-introduction' 
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Bundle Documentation
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>
      },
      {
        render: 
          <a 
            id='documentation-li'
            href={`${urlPrefix}/app/console/#/space/about`}
            className='external-header-dropdown-link'  
            target="_blank" 
            rel="noopener noreferrer" 
          >
            About Kinetic Platform
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>
      },
      {
        render: 
          <a 
            id='console-link'
            href='app' 
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Space Console
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>
      }
    ]
  }