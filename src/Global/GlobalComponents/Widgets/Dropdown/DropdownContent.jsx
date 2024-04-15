import React, { useEffect, useMemo, useRef } from 'react';

export const DropdownContent = ({
    dropdownContent, 
    contentClassName, 
    isDropdownOpen, 
    setIsDropdownOpen, 
    aboveListContent, 
    belowListContent
}) => {
    const dropdownRef = useRef(null);

    const handleOutsideClick = event => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false)
        }
      };

    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    });

    const dropdownContentMap = useMemo(() => (
            dropdownContent.map((dropdownItem, key) => (
                <button 
                    className={`${dropdownItem.className ? dropdownItem.className : ''} dropdown-links remove-padding`}
                    onClick={() => setIsDropdownOpen()}
                    key={key}
                >
                    {dropdownItem.render}        
                </button>
            ))
    ), [dropdownContent])

    return isDropdownOpen && (
        <div 
            className={`dropdown-content${contentClassName !== undefined ? 
            ` ${contentClassName}` : ''}`}
            ref={dropdownRef}
        >
            {aboveListContent}
            {dropdownContent && dropdownContent.length > 0 && 
                <div className='dropdown-content-list'>
                    {dropdownContentMap}
                </div>
            }
            {belowListContent}
        </div>
    );
};
