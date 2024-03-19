import React, { useContext, useMemo, useState } from 'react';
import logo from '../Assets/Images/KD logo.png'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout } from '@kineticdata/react';
import { getUserInitials } from '../GlobalResources/Helpers';

export const Header = ({ loggedIn, profile }) => {
  const [ isHelpMenuOpen, setIsHelpMenuOpen ] = useState(false);
  const [ isProfileMenuOpen, setIsProfileMenuOpen ] = useState(false);
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const urlPrefix = process.env.REACT_APP_PROXY_HOST;

const helpContent = useMemo(() => ([
  {
    render: 
      <a 
        id='platform-documentation'
        href='https://docs.kineticdata.com/' 
        className='external-header-dropdown-link'
        target="_blank" 
        rel="noopener noreferrer" 
      >
        Platform Documentation
        <i className='fa fa-external-link console-icon-spacing' />
      </a>
  },
  {
    render: 
      <a 
        id='documentation-lin'
        href={`${urlPrefix}/app/docs/space/core`}
        className='external-header-dropdown-link'
        target="_blank" 
        rel="noopener noreferrer" 
      >
        API Reference Docs        
        <i className='fa fa-external-link console-icon-spacing' />
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
        <i className='fa fa-external-link console-icon-spacing' />
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
        <i className='fa fa-external-link console-icon-spacing' />
      </a>
  }
]), [])

const profileDropdownHeader = useMemo(() => ( userProfile &&
    <>
      <div className='user-info'>
        <div className='user-info-top'>
          <div className='user-icon-backing' >
            <div className='header-dropdown-profile in-dropdown'>
                  {getUserInitials(userProfile.displayName)}
            </div>
          </div>
        </div>
        <div className='user-info-bottom'>
          <div className='user-name'>{userProfile.displayName}</div>
          <div>{userProfile.email}</div>
          <a 
           id='logout-link'
           href='/' 
           onClick={logout}
           className='signout-link'
         >
           Sign Out
         </a>
        </div>
      </div>
    </>
  ), [userProfile])
  
  return (
    <div className='header-containter'>
      <Link to="/" className='header-logo-link'>
        <img
          alt="logo"
          src={logo}
          style={{
            height: 60,
          }}
          />
      </Link>
      {loggedIn && profile && (
        <div className="header-logged-in">
          <DropdownMenu 
            isDropdownOpen={isHelpMenuOpen}
            setIsDropdownOpen={() => {
              setIsProfileMenuOpen(false);
              setIsHelpMenuOpen(!isHelpMenuOpen);
            }}
            dropdownFace={<i className='fa fa-ellipsis-v help-link' aria-hidden='true' />} 
            dropdownContent={helpContent}
            contentClassName='help-menu'
          />
          <DropdownMenu 
            isDropdownOpen={isProfileMenuOpen}
            setIsDropdownOpen={() => {
              setIsHelpMenuOpen(false);
              setIsProfileMenuOpen(!isProfileMenuOpen)
            }}
            dropdownFace={
              <div className='header-dropdown-profile'>
                {getUserInitials(userProfile.displayName)}
              </div>
            } 
            aboveListContent={profileDropdownHeader}
            contentClassName='profile-menu'
          />
        </div>
      )}
    </div>
  );
}
