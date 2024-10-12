import React, { useState, useEffect } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';

export const Header = () => {
  const [username, setUsername] = useState("Unknown");
  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setAvatar(localStorage.getItem("avatar"));
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://www.moe.co.nz/wp-content/uploads/2021/12/Moe_Logo_Alpha.png"
          alt="MOE Logo"
          className="img-fluid"
          style={{ width: "80px", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
      </div>
      <div className="header-left">
        {/* <Box sx={{marginRight: "5px"}}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon color="action" />
          </Badge>
        </Box> */}
        <Box sx={{marginLeft: "5px"}}>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Tooltip title={username}>
              <Avatar alt={username} src={avatar} />
            </Tooltip>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </Box>
      </div>
    </header>
  );
};
