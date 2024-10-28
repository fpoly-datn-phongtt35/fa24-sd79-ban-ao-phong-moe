import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Badge,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from "react-router-dom";
import { handleLogoutAPI } from "~/apis";
import { Avatar, Input } from "@mui/joy";

const IconSvgCustom = ({ icon, title }) => (
  <img src={icon} alt={title} style={{ width: "40px", height: "40px" }} />
);

const Header_Client = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setAvatar(localStorage.getItem("avatar"));
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
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: "#fff",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", color: "#000", fontSize: "24px" }}
        >
          MOE SHOP
        </Typography>

        {/* Navigation links */}
        <Box display="flex" alignItems="center" gap={3}>
          <Button
            onClick={() => navigate("/")}
            style={{ color: "#000", textTransform: "none" }}
          >
            Trang chủ
          </Button>
          <Button
            onClick={() => navigate("/#product")}
            style={{ color: "#000", textTransform: "none" }}
          >
            Sản phẩm
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            style={{ color: "#000", textTransform: "none" }}
          >
            Liên hệ
          </Button>
          <Button
            onClick={() => navigate("/about")}
            style={{ color: "#000", textTransform: "none" }}
          >
            Giới thiệu
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Input
              type="search"
              endDecorator={<SearchIcon />}
              placeholder="Tìm kiếm"
            />
          </Box>
          <IconButton>
            <Badge badgeContent={2} color="primary">
              <FavoriteBorderOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton>
            <Badge badgeContent={2} color="primary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={hasAuthenticated ? handleMenuClick : singIn}>
            <Avatar src={avatar} alt="avatar" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Quản lý tài khoản</MenuItem>
          <MenuItem onClick={handleMenuClose}>Đơn hàng của tôi</MenuItem>
          <MenuItem onClick={handleMenuClose}>Lịch sử hủy đơn</MenuItem>
          <MenuItem onClick={handleMenuClose}>Đánh giá của tôi</MenuItem>
          {isManager && (
            <MenuItem onClick={() => navigate("/dashboard")}>
              Trang quản lý
            </MenuItem>
          )}
          {hasAuthenticated && (
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header_Client;
