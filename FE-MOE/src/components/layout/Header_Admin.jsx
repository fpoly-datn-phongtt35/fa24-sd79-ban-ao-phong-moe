import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { handleLogoutAPI } from "~/apis";
import { MoeAlert } from "../other/MoeAlert";
import { Typography } from "@mui/joy";

export const Header_Admin = (props) => {
  const [username, setUsername] = useState("Unknown");
  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const navigate = useNavigate();

  const handleLogout = async () => {
    await handleLogoutAPI();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">
        <MenuIcon
          size="sm"
          sx={{ color: "#0071bd" }}
          onClick={props.onCollapsed}
        />
      </div>
      <div className="header-left">
        <Box sx={{ marginLeft: "5px" }}>
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
            <MenuItem onClick={handleClose}>Username</MenuItem>
            <MenuItem onClick={handleClose}>Thông tin tài khoản</MenuItem>
            <MenuItem onClick={handleClose}>Cài đặt</MenuItem>
            <MoeAlert
              title="Đăng xuất"
              message="Bạn có muốn đăng xuất không?"
              event={handleLogout}
              button={
                <MenuItem>
                  <Typography sx={{ color: "#32383e" }} level="body-md">
                    Đăng xuất
                  </Typography>
                </MenuItem>
              }
            />
          </Menu>
        </Box>
      </div>
    </header>
  );
};
