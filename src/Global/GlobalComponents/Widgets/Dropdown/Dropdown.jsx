import React from 'react';
import { DropdownContent } from './DropdownContent';

// DropDownMenu is an unopinionated dropdown that allows for optional
// list view with element insertion above and below. Styles can
// be manipulated through props. contentClassName should be used for
// positioning and optionally overriding default styling. DropDownMenu
// should be controlled almost entirely from it's component of origin.
export const DropdownMenu = ({
    dropdownFace, 
    faceStyle, 
    isDropdownOpen, 
    setIsDropdownOpen,
    dropdownContent, 
    contentClassName, 
    aboveListContent, 
    belowListContent
}) => (
        <div className={faceStyle}>
            {dropdownFace}
            <DropdownContent 
                dropdownContent={dropdownContent || []}
                contentClassName={contentClassName}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                aboveListContent={aboveListContent}
                belowListContent={belowListContent}
            />
        </div>
    );
