import React, { useCallback, useMemo } from 'react';

export const DropdownContent = ({
    dropdownContent, 
    contentClassName, 
    isDropdownOpen, 
    setIsDropdownOpen, 
    aboveListContent, 
    belowListContent
}) => {
    const dropdownContentMap = useMemo(() => (
            dropdownContent.map((dropdownItem, key) => (
                <div 
                    className={`${dropdownItem.className ? dropdownItem.className : ''} dropdown-links`}
                    onClick={() => setIsDropdownOpen()}
                    key={key}
                >
                    {dropdownItem.render}        
                </div>
            ))
    ), [dropdownContent])

    return isDropdownOpen && (
        <div className={`dropdown-content${contentClassName !== undefined ? 
            ` ${contentClassName}` : ''}`}
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
