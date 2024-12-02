import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css'

const Navbar: React.FC = () => {
  const location = useLocation();

  // Only render Navbar on pages other than Login
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/item-management">Item Management</Link>
        </li>
        <li>
          <Link to="/transaction">Transaction</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
