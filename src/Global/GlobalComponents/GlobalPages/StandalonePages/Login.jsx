import React, { useCallback } from 'react';
import { history } from '../../../../index';
import logo from '../../../Assets/Images/kinetic-data-logo-rgb.svg'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const Login = ({
  error,
  onChangePassword,
  onChangeUsername,
  onLogin,
  password,
  redirect,
  username,
}) => {
  const onSubmit = useCallback(event => {
      const redirectCallback = redirect ? () => history.push('/') : null;
      return onLogin(event, redirectCallback);
  }, [onLogin, redirect]);
    
  return (
    <Box sx={{ 
      width: '31.875rem',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.5rem',
      p: '2.5rem',
      boxShadow: '0 1rem 1.5rem 0 rgba(0, 0, 0, 0.12);',
      bgcolor: 'greyscale.quinary',
      borderRadius: '.75rem'
    }}>
      <img
        alt="logo"
        src={logo}
        />
        <Box>
          <FormControl variant='outlined' sx={{ gap: '2.5rem'}}>
            <TextField
              required
              id="username"
              label="Username"
              placeholder="Username"
              onChange={onChangeUsername}
              value={username}
              sx={{
                width: '26.875rem',
                height: '2.5rem',
                borderRadius: '.25rem',
              }}
            />
            <TextField
              required
              type='password'
              id="password"
              label="Password"
              placeholder="Password"
              onChange={onChangePassword}
              value={password}
              sx={{
                width: '26.875rem',
                height: '2.5rem',
                borderRadius: '.25rem',
              }}
            />
            {error && 
              <Box
                sx={{
                  width: '26.875rem',
                  height: '3.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '.5rem',
                  p: '1rem 1.25rem',
                  color: 'error.main',
                  bgcolor: 'error.quaternary'
                }}
              >
                Invalid username or password
              </Box>
            }
          </FormControl>
        </Box>
        <Button 
          type='submit'
          variant='contained'
          disabled={!(username.length > 0 && password.length > 0)}
          onClick={onSubmit}
          sx={{
            width: '14rem',
            height: '3rem',
            p: '.75rem',
            borderRadius: '.25rem',
            mt: '1rem'
          }}
        >
          Sign In
        </Button>
    </Box>
  );
};
