import React, { useMemo, useState } from 'react';
import logo from '../../Assets/Images/kinetic-data-logo-rgb.svg'
import { urlPrefix } from '../../GlobalResources/Helpers';
import { ProfileDropdown } from './ProfileDropdown';
import { ProfileChange } from '../Widgets/ProfileChange';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';

export const Header = ({ loggedIn, profile }) => {
  const [ profileAnchor, setProfileAnchor ] = useState(null);
  const [ menuAnchor, setMenuAnchor ] = useState(null);
  const [ isModalOpen , setIsModalOpen ] = useState(false);
  const isProfileOpen = useMemo(() => Boolean(profileAnchor), [profileAnchor]);
  const isMenuOpen = useMemo(() => Boolean(menuAnchor), [menuAnchor]);

  const toggleDropdown = (type, event) => {
    if (type === 'profile') {
      if (isProfileOpen) {
        setProfileAnchor(null);
      } else {
        setProfileAnchor(event.currentTarget)
      }
      return;
    }
    if (type === 'menu') {
      if (isMenuOpen) {
        setProfileAnchor(null);
      } else {
        setMenuAnchor(event.currentTarget)
      }
      return;
    }
  }

const helpContent = useMemo(() => {
  if (profile) {
    return [
      profile.spaceAdmin && 
          <Link
            id='platform-documentation'
            href='https://docs.kineticdata.com/' 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '15.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            Platform Documentation
            <LaunchIcon sx={{ color: 'greyscale.main', fontSize: '1rem' }} />
          </Link>,
      profile.spaceAdmin && 
          <Link
            id='documentation-lin'
            href={`${urlPrefix}/app/docs/space/core`}
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '15.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            API Reference Docs        
            <LaunchIcon sx={{ color: 'greyscale.main', fontSize: '1rem' }} />
          </Link>,
          <Link
            id='bundle-documentation'
            href='https://docs.kineticdata.com/docs/bundle-introduction' 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '15.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            Bundle Documentation
            <LaunchIcon sx={{ color: 'greyscale.main', fontSize: '1rem' }} />
          </Link>,
          <Link
            id='documentation-li'
            href={`${urlPrefix}/app/console/#/space/about`}  
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '15.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            About Kinetic Platform
            <LaunchIcon sx={{ color: 'greyscale.main', fontSize: '1rem' }} />
          </Link>,
          <Link
            id='console-link'
            href='app' 
            target="_blank" 
            rel="noopener noreferrer" 
            underline="none"
            sx={{ width: '15.625rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            Space Console
            <LaunchIcon sx={{ color: 'greyscale.main', fontSize: '1rem' }} />
          </Link>
    ]
}}, [profile])
  
  return (
    <Box>
      <AppBar position="static" sx={{bgcolor: 'greyscale.quaternary'}}>
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Link href="/">
              <img
                alt="logo"
                src={logo}
              />
            </Link>
          {loggedIn && profile && (
            <Box>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={event => toggleDropdown('menu', event)}
              >
                <MoreVertIcon sx={{ color: 'greyscale.main', m: '.5rem'}} />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="profile"
                onClick={event => toggleDropdown('profile', event)}
              >
                <Avatar variant='circular' sx={{ bgcolor: 'secondary.secondary'}}>{profile.displayName[0]}</Avatar>
              </IconButton>
              <Menu
                open={isMenuOpen}
                onClose={() => setMenuAnchor(null)}
                anchorEl={menuAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {helpContent.map((link, idx) => (
                    <MenuItem key={idx} >
                      {link}
                    </MenuItem>
                ))}      
              </Menu> 
              <Menu
                open={isProfileOpen}
                onClose={() => setProfileAnchor(null)}
                anchorEl={profileAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {profile && <ProfileDropdown 
                  profile={profile}
                  openModal={() => setIsModalOpen(true)}
                  closeProfileAnchor={() => setProfileAnchor(false)}
                />}
              </Menu> 
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="change-profile"
        aria-describedby="update-user-info"
      >
        <Box
          id='change-profile'
          sx={{
            width: '38.125rem',
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'greyscale.quaternary',
            p: '2.5rem',
            borderRadius: '.25rem'
          }}
        >
          <ProfileChange closeModal={() => setIsModalOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
}
