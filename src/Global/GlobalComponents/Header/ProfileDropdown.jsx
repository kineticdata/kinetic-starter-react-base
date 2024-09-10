import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@kineticdata/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

export const ProfileDropdown = ({profile, openModal, closeProfileAnchor}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: '.5rem 1rem' }}>
      <Box
        sx={{
          width: '19.875rem',
          height: '4.625rem',
          bgcolor: 'primary.quaternary',
          borderRadius: '.5rem',
          mb: '2.375rem',
        }}
      >
        <Avatar
          variant="circular"
          sx={{
            bgcolor: 'secondary.secondary',
            height: '4.563rem',
            width: '4.563rem',
            position: 'absolute',
            top: '3.35rem',
            left: '9rem',
            fontSize: '2.25rem',
          }}
        >
          {profile.displayName[0]}
        </Avatar>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '1rem',
          pt: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <Typography sx={{ fontWeight: '800', fontSize: '1.5rem' }}>
            {profile.displayName}
          </Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="profile"
            onClick={() => {
              openModal();
              closeProfileAnchor();
            }}
            sx={{
              color: 'primary.secondary',
              fontWeight: 'bold',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'primary.quaternary',
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
        <Typography>{profile.email}</Typography>
        <Button
          variant="text"
          onClick={() => logout(() => navigate('/'))}
          sx={{
            color: 'primary.secondary',
            fontWeight: 'bold',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'primary.quaternary',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  )
};
