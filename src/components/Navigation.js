import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="topnav">
      <ul className="nav-list">
        <li className="nav-item"><Link to="/">Customers</Link></li>
        <li className="nav-item"><Link to="/trainings">Trainings</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;