import React, { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import logo from "~/assert/MainLogo.jpg";
import { useNavigate } from "react-router-dom";
import { Input } from "@mui/joy";
import { handleLogoutAPI } from "~/apis";

const Header_Client = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getAuthority = () => {
      const roleCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("role="));

      return roleCookie ? roleCookie.split("=")[1] : "";
    };
    if (accessToken) {
      setHasAuthenticated(true);
      if (getAuthority() !== "USER") {
        setIsManager(true);
      } else {
        setIsManager(false);
      }
    } else {
      setHasAuthenticated(false);
    }
  }, []);

  const navigate = useNavigate();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const singIn = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await handleLogoutAPI();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" className="header_container_client">
        <Toolbar className="header_toolbar_client">
          <div className="header_logo_client">
            <img src={logo} alt="Logo" />
          </div>
          <div className="header_search_client">
            <Input
              placeholder="Tìm Kiếm Sản Phẩm..."
              className="search_input_client"
            />
            <IconButton
              type="submit"
              aria-label="search"
              className="search_button_client"
            >
              <SearchIcon />
            </IconButton>
          </div>
          <div className="header_icons_client">
            <IconButton className="icon_cart_client">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              className="icon_account_client"
              onClick={handleMenuClick}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              className="menu_account_client"
            >
              <MenuItem onClick={handleMenuClose}>Đang cập nhật!</MenuItem>
              {isManager && (
                <MenuItem onClick={() => navigate("/dashboard")}>
                  Trang quản Lý
                </MenuItem>
              )}
              {hasAuthenticated && (
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              )}
              {!hasAuthenticated && (
                <MenuItem onClick={singIn}>Đăng nhập</MenuItem>
              )}
            </Menu>
          </div>
        </Toolbar>

        {/* Navbar dưới cùng */}
        {/* <Toolbar className="navbar_client">
          <Tabs aria-label="nav tabs">
            <Tab label="Trang Chủ" onClick={() => navigate("/")} />
            <Tab label="Giới Thiệu" onClick={() => navigate("/")} />
            <Tab label="Sản Phẩm" onClick={() => navigate("/")} />
            <Tab label="Cửa Hàng" onClick={() => navigate("/")} />
            <Tab label="Liên Hệ" onClick={() => navigate("/")} />
            <Tab label="Tuyển Dụng" onClick={() => navigate("/")} />
            <Tab label="Tin Tức" onClick={() => navigate("/")} />
          </Tabs>
        </Toolbar> */}
      </AppBar>
    </>
  );
};

export default Header_Client;
