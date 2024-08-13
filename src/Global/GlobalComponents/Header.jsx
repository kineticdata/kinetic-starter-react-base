import React, { useMemo, useState } from 'react';
import logo from '../Assets/Images/kinetic-data-logo-rgb.svg'
import { logout } from '@kineticdata/react';
import { urlPrefix } from '../GlobalResources/Helpers';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';

export const Header = ({ loggedIn, profile }) => {
  const [ profileAnchor, setProfileAnchor ] = useState(null);
  const [ menuAnchor, setMenuAnchor ] = useState(null);
  const isProfileOpen = useMemo(() => Boolean(profileAnchor), [profileAnchor]);
  const isMenuOpen = useMemo(() => Boolean(menuAnchor), [menuAnchor]);
  const [ isModalOpen , setIsModalOpen ] = useState(false);


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
            <i className='las la-external-link-alt console-icon-spacing'/>
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
            <i className='las la-external-link-alt console-icon-spacing'/>
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
            <i className='las la-external-link-alt console-icon-spacing'/>
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
            <i className='las la-external-link-alt console-icon-spacing'/>
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
            <i className='las la-external-link-alt console-icon-spacing'/>
          </Link>
    ]
}}, [profile])

// Create the profile dropdown content
const profileDropdownHeader = useMemo(() => ( profile &&
  <Box sx={{p: '.5rem 1rem'}}>
    <Box sx={{width: '19.875rem', height: '4.625rem', bgcolor: 'primary.quaternary', borderRadius: '.5rem', mb: '2.375rem'}}>
      <Avatar 
        variant='circular' 
        sx={{ 
          bgcolor: 'secondary.secondary',
          height: '4.563rem',
          width: '4.563rem',
          position: 'absolute',
          top: '3.35rem',
          left: '9rem',
          fontSize: '2.25rem'
        }}
      >
        {profile.displayName[0]}
      </Avatar>
    </Box>
    <Box sx={{
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column',
      gap: '1rem',
      pt: '1rem'
    }}>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem'}}>
        <Typography sx={{fontWeight: '800', fontSize: '1.5rem'}}>
          {profile.displayName}
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="profile"
          onClick={() => {
            setIsModalOpen(true);
            setProfileAnchor(null);
          }}
          sx={{
            color: 'primary.secondary', 
            fontWeight: 'bold',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'primary.quaternary',
            }
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Typography>
        {profile.email}
      </Typography>
      <Button 
        variant='text'
        href='/'
        onClick={logout}
        sx={{
          color: 'primary.secondary', 
          fontWeight: 'bold',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: 'primary.quaternary',
          }
        }}
      >
        Sign Out
      </Button>
    </Box>
  </Box>
  ), [profile]);
  
  return profile && (
    <Box>
      <AppBar position="static" sx={{bgcolor: 'greyscale.quaternary'}}>
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Link to="/">
              <img
                alt="logo"
                src={logo}
                />
            </Link>
          {loggedIn && profile && (
            <Box>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={event => toggleDropdown('menu', event)}
                >
                  <MoreVertIcon sx={{ color: 'greyscale.main'}} />
              </IconButton>
              <IconButton
                size="large"
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
                  {profileDropdownHeader}
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
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'greyscale.quaternary',
            p: '1rem',
            borderRadius: '.25rem'
          }}
        >
          PROFILE CHANGE GOES HERE
        </Box>
      </Modal>
    </Box>
  );
}
