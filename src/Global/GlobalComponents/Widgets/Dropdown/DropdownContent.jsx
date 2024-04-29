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

    const handleEscapePress = event => {
        if (isDropdownOpen && event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscapePress);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("keydown", handleEscapePress);
      };
    });

    const dropdownContentMap = useMemo(() => (
            dropdownContent.map((dropdownItem, key) => (
                // This is specifically a div and not a button to allow accessibility
                // tabbing to not focus on this element and instead focus on the content
                <div 
                    className={`${dropdownItem.className ? dropdownItem.className : ''} dropdown-links`}
                    onClick={() => setIsDropdownOpen()}
                    key={key}
                    aria-hidden='true'
                >
                    {dropdownItem.render}        
                </div>
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
