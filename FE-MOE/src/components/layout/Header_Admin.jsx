// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { accessUserAPI, handleLogoutAPI } from "~/apis";
import { MoeAlert } from "../other/MoeAlert";
import { Tooltip, Typography } from "@mui/joy";

export const Header_Admin = (props) => {
  const [username, setUsername] = useState("Unknown");
  const [avatar, setAvatar] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    handleAccessData();
  }, []);

  const handleAccessData = async () => {
    await accessUserAPI("ADMIN").then((res) => {
      setAvatar(res?.avatar);
      setUsername(res?.username);
    });
  };

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
            <Tooltip variant="plain" title={username}>
              <Avatar alt={username} src={avatar} />
            </Tooltip>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
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
            <MenuItem
              sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
            >
              <Avatar src={avatar} alt={username} />
              <Typography level="title-md">{username}</Typography>
            </MenuItem>
            <hr />
            <MenuItem
              onClick={handleClose}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
            >
              <AccountCircleIcon />
              <Typography level="body-md">Thông tin tài khoản</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5 }}
            >
              <SettingsIcon />
              <Typography level="body-md">Cài đặt</Typography>
            </MenuItem>
            <MoeAlert
              title="Đăng xuất"
              message="Bạn có muốn đăng xuất không?"
              event={handleLogout}
              button={
                <MenuItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                  }}
                >
                  <LogoutIcon />
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
