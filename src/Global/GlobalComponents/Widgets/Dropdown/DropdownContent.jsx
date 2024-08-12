import React, { useEffect, useMemo, useRef } from 'react';

export const DropdownContent = ({
    dropdownContent, 
    contentClassName, 
    isDropdownOpen, 
    closeDropdown, 
    aboveListContent, 
    belowListContent
}) => {
    const dropdownRef = useRef(null);

    const handleOutsideClick = event => {
        if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            // If the outside area being clicked is the dropdown face button itself
            // wait for the initial button click to complete before closing the dropdown
            // This prevents the open function from happening after this close call goes through
            if (dropdownRef.current.classList.contains("dropdown-content")) {
                setTimeout(() => {
                    closeDropdown()
                }, 100)
            } else {
                closeDropdown()
            }
        }
    };

    const handleEscapePress = event => {
        if (isDropdownOpen && event.key === 'Escape') {
            closeDropdown();
        }
    };

    useEffect(() => {
      document.addEventListener("mouseup", handleOutsideClick);
      document.addEventListener("keyup", handleEscapePress);
      return () => {
        document.removeEventListener("mouseup", handleOutsideClick);
        document.removeEventListener("keyup", handleEscapePress);
      };
    });

    const dropdownContentMap = useMemo(() => (
            dropdownContent.map((dropdownItem, key) => (
                // This is specifically a div and not a button to allow accessibility
                // tabbing to not focus on this element and instead focus on the content
                <div 
                    className={`${dropdownItem.className ? dropdownItem.className : ''} dropdown-links`}
                    onClick={() => closeDropdown()}
                    key={key}
                >
                    {dropdownItem.render || dropdownItem}        
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
