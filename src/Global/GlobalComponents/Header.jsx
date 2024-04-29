import React, { useContext, useMemo, useState } from 'react';
import logo from '../Assets/Images/KD logo.png'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout } from '@kineticdata/react';
import { getHelpLinks, getUserInitials } from '../GlobalResources/Helpers';
import { KineticModal } from './Widgets/KineticModal'
import { ProfileChange } from './Widgets/ProfileChange';

export const Header = ({ loggedIn, profile }) => {
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const [ isHelpMenuOpen, setIsHelpMenuOpen ] = useState(false);
  const [ isProfileMenuOpen, setIsProfileMenuOpen ] = useState(false);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);

const helpContent = useMemo(() => {
  if (userProfile) {
  return getHelpLinks(userProfile.spaceAdmin);
}}, [userProfile])

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
          <div className='user-name'>
            {userProfile.displayName}
            <button onClick={() => setIsProfileModalOpen(true)} className='edit-icon-wrapper' >
              <i 
                className="fa fa-pencil-square-o edit-icon" 
                aria-hidden="true" 
              />
            </button>
          </div>
          <div>{userProfile.email}</div>
          <a 
            id='logout-link'
            href='/' 
            onClick={logout}
            className='button cancel'
          >
            Sign Out
          </a>
        </div>
      </div>
    </>
  ), [userProfile]);
  
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
            dropdownFace={
              <div className='header-dropdown-links'>
                <i className='fa fa-ellipsis-v help-link' aria-hidden='true' />
              </div>
            } 
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
      <KineticModal
        isModalOpen={isProfileModalOpen} 
        setIsModalOpen={setIsProfileModalOpen} 
        content={<ProfileChange setIsProfileModalOpen={setIsProfileModalOpen} />} 
      />
    </div>
  );
}
