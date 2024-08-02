import React, { useContext, useMemo, useState } from 'react';
import logo from '../Assets/Images/kinetic-data-logo-rgb.svg'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout } from '@kineticdata/react';
import { KineticModal } from './Widgets/KineticModal'
import { ProfileChange } from './Widgets/ProfileChange';
import { urlPrefix } from '../GlobalResources/Helpers';

export const Header = ({ loggedIn, profile }) => {
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const [ isHelpMenuOpen, setIsHelpMenuOpen ] = useState(false);
  const [ isProfileMenuOpen, setIsProfileMenuOpen ] = useState(false);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);

const helpContent = useMemo(() => {
  if (userProfile) {
    return [
      userProfile.spaceAdmin && 
          <a 
            id='platform-documentation'
            href='https://docs.kineticdata.com/' 
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Platform Documentation
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>,
      userProfile.spaceAdmin && 
          <a 
            id='documentation-lin'
            href={`${urlPrefix}/app/docs/space/core`}
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            API Reference Docs        
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>,
          <a 
            id='bundle-documentation'
            href='https://docs.kineticdata.com/docs/bundle-introduction' 
            className='external-header-dropdown-link'
            target="_blank" 
            rel="noopener noreferrer" 
          >
            Bundle Documentation
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>,
          <a 
            id='documentation-li'
            href={`${urlPrefix}/app/console/#/space/about`}
            className='external-header-dropdown-link'  
            target="_blank" 
            rel="noopener noreferrer" 
          >
            About Kinetic Platform
            <i className='las la-external-link-alt console-icon-spacing'/>
          </a>,
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
    ]
}}, [userProfile])

// Create the profile dropdown content
const profileDropdownHeader = useMemo(() => ( userProfile &&
    <>
      <div className='user-info'>
        <div className='user-info-top'>
          <div className='user-icon-backing' >
            <div className='header-dropdown-profile in-dropdown'>
                  {userProfile.displayName[0]}
            </div>
          </div>
        </div>
        <div className='user-info-bottom'>
          <div className='user-name'>
            {userProfile.displayName}
            <button 
              aria-label='Update User Profile' 
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsProfileMenuOpen(false);
              }} 
              className='edit-icon-wrapper' 
            >
              <i 
                className="las la-edit edit-icon" 
                aria-hidden="true" 
              />
            </button>
          </div>
          <div>{userProfile.email}</div>
          <a 
            id='logout-link'
            href='/' 
            onClick={logout}
            className=' button signout-button'
          >
            Sign Out
          </a>
        </div>
      </div>
    </>
  ), [userProfile]);
  
  return (
    <div className='header-containter'>
      <Link to="/">
        <img
          alt="logo"
          src={logo}
        />
      </Link>
      {loggedIn && profile && (
        <div className="header-logged-in">
          <DropdownMenu 
            isDropdownOpen={isHelpMenuOpen}
            closeDropdown={() => setIsHelpMenuOpen(false)}
            dropdownFace={
              <button 
                aria-label='Help Menu'
                className='help-menu-btn'
                onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsHelpMenuOpen(!isHelpMenuOpen);
                }}
              >
                <i className="las la-ellipsis-v standard-icon-size" aria-hidden='true' />
              </button>
            } 
            dropdownContent={helpContent}
            contentClassName='help-menu'
          />
          <DropdownMenu 
            isDropdownOpen={isProfileMenuOpen}
            closeDropdown={() => setIsProfileMenuOpen(false)}
            dropdownFace={
              <button 
                aria-label='Profile Menu'
                className='header-dropdown-profile'
                onClick={() => {
                    setIsHelpMenuOpen(false);
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
              >
                {userProfile.displayName[0]}
              </button>
            } 
            aboveListContent={profileDropdownHeader}
            contentClassName='profile-menu'
          />
        </div>
      )}
      <KineticModal
        isModalOpen={isProfileModalOpen} 
        closeModal={() => setIsProfileModalOpen(false)} 
        modalTitle='Edit Your Profile'
        content={<ProfileChange setIsProfileModalOpen={setIsProfileModalOpen} />} 
      />
    </div>
  );
}
