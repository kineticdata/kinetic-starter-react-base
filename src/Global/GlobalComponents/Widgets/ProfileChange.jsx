import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";
import { updateProfile } from '@kineticdata/react';
import { LoadingSpinner } from "./LoadingSpinner";

export const ProfileChange = ({ setIsProfileModalOpen }) => {
    const globalState = useContext(GlobalContext);
    const { userProfile, setUserProfile } = globalState;
    const [ changeData, setChangeData ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isPasswordOpen, setIsPasswordOpen ] = useState(false);
    const [ doPasswordsMatch, setDoPasswordsMatch ] = useState(true);

    useEffect(() => {
        if (userProfile) {
            setChangeData({
                displayName: userProfile.displayName,
                email: userProfile.email,
                password: '',
                passwordConfirmation: ''
            })
        }
    }, [userProfile])

    useEffect(() => {
        if (changeData && changeData.password !== changeData.passwordConfirmation) {
            setDoPasswordsMatch(false);
        } else {
            setDoPasswordsMatch(true);
        }
    }, [changeData]);

    const handleProfileUpdate = () => {
        let newProfileData = changeData;

        if (newProfileData.password.length === 0) {
            delete newProfileData.password;
            delete newProfileData.passwordConfirmation;
        }

        setIsLoading(true);
        updateProfile({
        profile: newProfileData,
        }).then(({ profile }) => {
            setIsLoading(false);
            setIsProfileModalOpen(false);
            setUserProfile({...userProfile, email: newProfileData.email, displayName: newProfileData.displayName})
        });
    };

    return changeData && (
      <div className='profile-modal-wrapper'>
          <div className='profile-modal-header'>
            Edit Your Profile
            <i className="fa fa-times button cancel" aria-hidden="true" onClick={() => setIsProfileModalOpen(false)} />
          </div>
            <div className='profile-modal-body'>
              {!isLoading ?
                <>
                  <label>
                    <div className='profile-label'>Email</div>
                    <input type='text' value={changeData.email} onChange={event => setChangeData({...changeData, email: event.target.value})} />
                  </label>
                  <label>
                    <div className='profile-label'>Display Name</div>
                    <input type='text' value={changeData.displayName} onChange={event => setChangeData({...changeData, displayName: event.target.value})} />
                  </label>
                  <div className={`${isPasswordOpen && 'password-wrapper'}`}>
                  {isPasswordOpen && 
                    <>
                      <label>
                        <div className='profile-label required'>Password</div>
                        <input type='password' value={changeData.password} onChange={event => setChangeData({...changeData, password: event.target.value})} />
                      </label>
                      <label>
                        <div className='profile-label required'>Password Confirmation</div>
                        <input className={`${!doPasswordsMatch ? 'pass-mismatch' : ''}`} type='password' value={changeData.passwordConfirmation} onChange={event => setChangeData({...changeData, passwordConfirmation: event.target.value})} />
                        {!doPasswordsMatch && <div className="required-text">Passwords must match.</div>}
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
          <div className='profile-modal-footer'>
            <button className='edit' disabled={!doPasswordsMatch} onClick={handleProfileUpdate}>
              <i className="fa fa-check profile-check-spacing" aria-hidden="true"></i>
              Update Profile
            </button>
          </div>
      </div>
    )
  };