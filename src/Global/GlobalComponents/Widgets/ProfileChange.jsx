import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalResources/GlobalContextWrapper";
import { updateProfile } from '@kineticdata/react';
import { LoadingSpinner } from "./LoadingSpinner";
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

export const ProfileChange = ({ closeModal }) => {
    const globalState = useContext(GlobalContext);
    const { userProfile, setUserProfile, isAuthorized } = globalState;
    const [ changeData, setChangeData ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isPasswordOpen, setIsPasswordOpen ] = useState(false);
    const [ doPasswordsMatch, setDoPasswordsMatch ] = useState(true);
    const [ pageError, setPageError ] = useState();

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
        }).then(({ error }) => {
          if (!error) {
            setIsLoading(false);
            closeModal();
            setUserProfile({...userProfile, email: newProfileData.email, displayName: newProfileData.displayName})
          } else {
            setPageError(error);
          }
        });
    };

    return changeData && !pageError && isAuthorized ? (
      <>                                
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            lineHeight: '1.25',
            fontSize: '1.5rem',
            fontWeight: '600',
            borderBottom: '1px solid',
            borderColor: 'secondary.secondary',
            mb: '1.75rem',
            pb: '1.75rem'
          }}
        >
          Edit Your Profile
          <Button 
            onClick={() => closeModal()} 
            sx={{ 
              minWidth: '0',
              color: 'primary.secondary',
              fontWeight: 'bold',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'primary.quaternary',
              },
            }} 
            aria-label="Close Modal."
          >
            <CloseIcon sx={{p: '.5rem', fontSize: '2.5rem'}} />
          </Button>
        </Box>
        <Box>
          {!isLoading ?
            <FormControl variant='outlined' sx={{ gap: '2.5rem', width: '100%'}}>
              <TextField
                id="email"
                label="Email"
                placeholder="Email"
                onChange={event => setChangeData({...changeData, email: event.target.value})}
                value={changeData.email}
                sx={{
                  height: '2.5rem',
                  borderRadius: '.25rem',
                }}
              />
              <TextField
                id="displayName"
                label="Display Name"
                placeholder="Display Name"
                onChange={event => setChangeData({...changeData, displayName: event.target.value})}
                value={changeData.displayName}
                sx={{
                  height: '2.5rem',
                  borderRadius: '.25rem',
                }}
              />
              {/* Turnery prevents a console error that occurs when using a && safety check */}
              <Box sx={
                isPasswordOpen ? {
                  border: '1px solid', 
                  borderColor: 'greyscale.tertiary', 
                  borderRadius: '.25rem', 
                  p: '1rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '2.5rem'
                } : {}}
              >
                {isPasswordOpen && 
                  <>
                    <TextField
                      id="password"
                      type='password'
                      label="Password"
                      placeholder="Password"
                      onChange={event => setChangeData({...changeData, password: event.target.value})}
                      value={changeData.password}
                      sx={{
                        height: '2.5rem',
                        borderRadius: '.25rem',
                      }}
                    />
                    <TextField
                      id="passwordConfirmation"
                      type='password'
                      label="Password Confirmation"
                      placeholder="Password Confirmation"
                      onChange={event => setChangeData({...changeData, passwordConfirmation: event.target.value})}
                      value={changeData.passwordConfirmation}
                      sx={{
                        height: '2.5rem',
                        borderRadius: '.25rem',
                      }}
                    />
                    {!doPasswordsMatch && 
                      <Box
                        sx={{
                          height: '3.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '.5rem',
                          p: '1rem 1.25rem',
                          color: 'error.main',
                          bgcolor: 'error.quaternary'
                        }}
                      >
                        Password inputs must match.
                      </Box>
                    }
                    </>
                }
                <Button 
                  variant='outlined'
                  onClick={() => setIsPasswordOpen(!isPasswordOpen)} 
                  sx={{ 
                    color: 'primary.secondary',
                    fontWeight: 'bold',
                    width: 'fit-content',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'primary.quaternary',
                    },
                  }} 
                  aria-label="Cancel password change."
                >
                    {isPasswordOpen ? 'Cancel Password Change' : 'Change Password'}
                </Button>
              </Box>
            </FormControl> 
            : 
            <Box sx={{height: '16rem'}}>
              <LoadingSpinner error={pageError} />
            </Box>
          }
        </Box>
        <Box sx={{pt: '1.75rem', justifyContent: 'flex-end', borderTop: '1px solid', borderTopColor: 'secondary.secondary', mt: '1.75rem', gap: '.5rem'}}>
          <Button 
            type='submit'
            variant='contained'
            disabled={isLoading || !doPasswordsMatch}
            onClick={handleProfileUpdate}
            sx={{
              borderRadius: '.25rem',
              bgcolor: 'primary.secondary',
              fontWeight: 'bold',
              width: 'fit-content',
              '&:hover': {
                bgcolor: 'primary.primary',
              },
            }}
          >
            Update Profile
          </Button>
        </Box>
      </>
    ) : <LoadingSpinner error={pageError} />
  };