import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../../../GlobalResources/GlobalContextWrapper';

export const DropdownContent = ({dropdownContent, contentStyle, isContentOpen, setIsContentOpen}) => {
    const globalState = useContext(GlobalContext);
    const { userProfile } = globalState;

    const dropdownContentMap = useMemo(() => (
        dropdownContent.map(content => (
            <div 
                className={`${content.style !== undefined && content.style} content-spacing`}
                onClick={() => setIsContentOpen()}
                key={content.id}
            >
                {content.render}        
            </div>
        ))
    ), [dropdownContent])

    return (
        <div className={`dropdown-content${contentStyle !== undefined ? ` ${contentStyle}` : ''}${isContentOpen ? '' : ' open'}`}>
            <div className='user-info'>
                <div className='user-name'>{userProfile.displayName}</div>
                <div>{userProfile.email}</div>
            </div>
            <hr className='user-info-seperator' />
            <div>
                {dropdownContentMap}
            </div>
        </div>
    );
}