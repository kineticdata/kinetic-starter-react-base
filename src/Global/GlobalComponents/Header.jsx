import React, { useContext, useMemo } from 'react';
import logo from '../Assets/Images/KD logo.png'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout } from '@kineticdata/react';

export const Header = ({ loggedIn, profile }) => {

  const headerDropdownContent = useMemo(() => ([
    {
      render: 
        <Link 
          id='profile-link'
          to='profile' 
        >
          Profile
        </Link>,
      style: 'profile-menu-link',
      id: 'profile-link'
    },
    {
      render: 
        <Link 
          id='documentation-link'
          to='documentation' 
        >
          Documentation
        </Link>,
      style: 'profile-menu-link',
      id: 'documentation-link'
    },
    {
      render: 
        <Link 
          id='console-link'
          to='/app/console' 
        >
          Console
          <i className='la la-external-link-alt console-icon-spacing' />
        </Link>,
      style: 'profile-menu-link',
      id: 'console-link'
    },
    {
      render: 
        <a 
          id='logout-link'
          href='/' 
          onClick={logout}
        >
          Logout
        </a>,
      style: 'profile-menu-link',
      id: 'logout-link'
    }
]), [])
  
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
        <div className="flex-row">
          <div>
            <div className='search-box'>
              <input className="search-text" type="text" placeholder="Search Kinetic Data" />
              <div className="search-btn">
                <i className='fa fa-search' aria-hidden="true"></i>
              </div>
              
            </div>
          </div>
          <div>
            <DropdownMenu 
              dropdownFace={<i className='las la-user header-dropdown-icon' />} 
              faceStyle='header-profile-dropdown'
              dropdownContent={headerDropdownContent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
