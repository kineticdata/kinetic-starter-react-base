import React, { useContext, useMemo } from 'react';
import logo from '../Assets/Images/KD logo.png'
import { GlobalContext } from '../GlobalResources/GlobalContextWrapper';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './Widgets/Dropdown/Dropdown';
import { logout } from '@kineticdata/react';

export const Header = ({ loggedIn, profile }) => {
  const globalState = useContext(GlobalContext);
  const { globalCount } = globalState;

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
    <div className='flex-row header-containter'>
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
        <div className="nav-items flex-row">
          <div>
            Global Count: {globalCount}
          </div>
          <div>
            <div className='search-box'>
              <input className="search-text" type="text" placeholder="Search Kinetic Data" />
              <a href="#" className="search-btn">
                <i className='fa fa-search' aria-hidden="true"></i>
              </a>
              
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
