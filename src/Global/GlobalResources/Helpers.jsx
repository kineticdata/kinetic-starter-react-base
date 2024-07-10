import { useEffect, useRef } from "react";
import qs from "qs";

// Helper.js is a global file that provides mutli use 
// helper functions for within the application.

const urlPrefix = process.env.REACT_APP_PROXY_HOST;

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