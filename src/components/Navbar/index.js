import React from 'react';
import { Link } from 'react-router-dom';

import "./index.css"


const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/add-item">Add Item</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
