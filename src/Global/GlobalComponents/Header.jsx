import React, { useContext, useEffect, useMemo, useState } from 'react';
import logo from '../Assets/Images/KD logo.png'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout, updateProfile } from '@kineticdata/react';
import { getHelpLinks, getUserInitials } from '../GlobalResources/Helpers';
import { KineticModal } from './Widgets/KineticModal'
import { LoadingSpinner } from './Widgets/LoadingSpinner';

export const Header = ({ loggedIn, profile }) => {
  const globalState = useContext(GlobalContext);
  const { userProfile } = globalState;
  const [ isHelpMenuOpen, setIsHelpMenuOpen ] = useState(false);
  const [ isProfileMenuOpen, setIsProfileMenuOpen ] = useState(false);
  const [ isProfileModalOpen, setIsProfileModalOpen ] = useState(false);
  const [ isPasswordOpen, setIsPasswordOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

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
            <i 
              onClick={() => setIsProfileModalOpen(true)}
              className="fa fa-pencil-square-o edit-icon" 
              aria-hidden="true" 
            />
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

  // TODO: Update this so the new profile updates the global 
  // userProfile to trigger rerenders for cascading rerenders
  const handleProfileUpdate = event => {
    event.preventDefault();
    const formData = new FormData(event.target)
    const newProfileData = {
      displayName: formData.get('displayName'),
      email: formData.get('email'),
    }

    if (formData.get('password') && formData.get('passwordConfirmation')) {
      newProfileData.password = formData.get('password');
      newProfileData.passwordConfirmation = formData.get('passwordConfirmation');
     }

    setIsLoading(true);
    updateProfile({
      profile: newProfileData,
    }).then(({ profile }) => {
      setIsLoading(false);
      setIsProfileModalOpen(false);
    });
  };

  // TODO: add form validation
  const profileModal = useMemo(() => {
    return userProfile && (
      <div className='profile-modal-wrapper'>
          <div className='profile-modal-header'>
            Edit Your Profile
            <i className="fa fa-times button cancel" aria-hidden="true" onClick={() => setIsProfileModalOpen(false)} />
          </div>
            <form id='profile-change' onSubmit={handleProfileUpdate}>
              <div className='profile-modal-body'>
              {!isLoading ?
                <>
                  <label>
                    <div className='profile-label'>Email</div>
                    <input name='email' type='text' defaultValue={userProfile.email} />
                  </label>
                  <label>
                    <div className='profile-label'>Display Name</div>
                    <input name='displayName' type='text' defaultValue={userProfile.displayName} />
                  </label>
                  <div className={`${isPasswordOpen && 'password-wrapper'}`}>
                  {isPasswordOpen && 
                    <>
                      <label>
                        <div className='profile-label required'>Password</div>
                        <input name='password' type='password' />
                      </label>
                      <label>
                        <div className='profile-label required'>Password Confirmation</div>
                        <input name='passwordConfirmation' type='password' />
                      </label>
                    </>
                  }
                    <button 
                      onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                      className='button primary-with-border'
                    >
                      {isPasswordOpen ? 'Cancel Password Change' : 'Change Password'}
                    </button>
                  </div>
                </>
                : <LoadingSpinner />}
              </div>
            </form>
          <div className='profile-modal-footer'>
            <button className='button update' form='profile-change' type='submit'>
              <i className="fa fa-check profile-check-spacing" aria-hidden="true"></i>
              Update Profile
            </button>
          </div>
      </div>
    )
  }, [userProfile, isPasswordOpen, isLoading]);
  
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
      <KineticModal
        isModalOpen={isProfileModalOpen} 
        setIsModalOpen={setIsProfileModalOpen} 
        content={profileModal} 
      />
    </div>
  );
}
