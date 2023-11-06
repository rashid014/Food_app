import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './SideNavbar.css'; // You should include the CSS file here

const iconSize = 50; // Adjust the icon size as needed

const iconStyle = {
  fontSize: iconSize,
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'center', // Center items vertically
};

function SideNavbar() {
  const [isSideNavOpen, setSideNavOpen] = useState(false);

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  return (
    <nav className={`mini-navbar ${isSideNavOpen ? 'sidenav-open' : ''}`}>
      <Drawer variant="temporary" open={isSideNavOpen} onClose={toggleSideNav}>
        <Container maxWidth="xs">
          <List>
            <div style={listItemStyle}>
              <ListItemIcon>
                <AccountCircleIcon style={iconStyle} />
              </ListItemIcon>
              <h2 className="text-center mt-5">Admin</h2>
            </div>
            <ListItem button component={Link} to="/adminHome">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/admin-approval">
              <ListItemText primary="Restaurant Approval" />
            </ListItem>
            <ListItem button component={Link} to="/restaurant-management">
              <ListItemText primary="Restaurant Management" />
            </ListItem>
            <ListItem button component={Link} to="/partner-approval">
              <ListItemText primary="Partner Approval" />
            </ListItem>
            <ListItem button component={Link} to="/admin-payment">
              <ListItemText primary="Restaurant Payment" />
            </ListItem>
            <ListItem button component={Link} to="/restaurants">
              <ListItemText primary="Restaurants" />
            </ListItem>
            <ListItem button component={Link} to="/users">
              <ListItemText primary="Users" />
            </ListItem>
           
          </List>
        </Container>
      </Drawer>
      <div className="mini-navbar-button" onClick={toggleSideNav}>
        <AccountCircleIcon style={iconStyle} />
      </div>
    </nav>
  );
}

export default SideNavbar;
