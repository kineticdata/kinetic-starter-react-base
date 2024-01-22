import React, { useState } from 'react';
import { DropdownContent } from './DropdownContent';

export const DropdownMenu = ({dropdownFace, faceStyle, dropdownContent, contentStyle}) => {
    const [ isContentOpen, setIsContentOpen ] = useState(false);

    return (
        <>
            <div 
                onClick={() => setIsContentOpen(!isContentOpen)}
                className={faceStyle} 
            >
                {dropdownFace}
            </div>

            <DropdownContent 
                dropdownContent={dropdownContent}
                contentStyle={contentStyle}
                isContentOpen={isContentOpen}
                setIsContentOpen={() => setIsContentOpen(isContentOpen)}
            />
        </>
    );
}