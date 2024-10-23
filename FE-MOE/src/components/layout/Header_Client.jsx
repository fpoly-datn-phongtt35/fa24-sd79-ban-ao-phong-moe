import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button, Badge, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNavigate } from "react-router-dom";
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
    localStorage.removeItem("accessToken"); // Xóa token khi đăng xuất
    navigate("/login");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#fff", boxShadow: "none", borderBottom: "1px solid #e0e0e0" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" style={{ fontWeight: "bold", color: "#000", fontSize: "24px" }}>
          MOE SHOP
        </Typography>

        {/* Navigation links */}
        <Box display="flex" alignItems="center" gap={3}>
          <Button onClick={() => navigate("/")} style={{ color: "#000", textTransform: "none" }}>Trang chủ</Button>
          <Button onClick={() => navigate("/#product")} style={{ color: "#000", textTransform: "none" }}>Sản phẩm</Button>
          <Button onClick={() => navigate("/contact")} style={{ color: "#000", textTransform: "none" }}>Liên hệ</Button>
          <Button onClick={() => navigate("/about")} style={{ color: "#000", textTransform: "none" }}>Giới thiệu</Button>
        </Box>

        {/* Icons section */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={hasAuthenticated ? handleMenuClick : singIn}>
            <AccountCircleIcon style={{ color: "#000" }} />
          </IconButton>
          <IconButton>
            <SearchIcon style={{ color: "#000" }} />
          </IconButton>
          <IconButton>
            <Badge badgeContent={2} color="primary">
              <ShoppingBagIcon style={{ color: "#000" }} />
            </Badge>
          </IconButton>
        </Box>

        {/* Menu for user actions */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Quản lý tài khoản</MenuItem>
          <MenuItem onClick={handleMenuClose}>Đơn hàng của tôi</MenuItem>
          <MenuItem onClick={handleMenuClose}>Lịch sử hủy đơn</MenuItem>
          <MenuItem onClick={handleMenuClose}>Đánh giá của tôi</MenuItem>
          {isManager && <MenuItem onClick={() => navigate("/dashboard")}>Trang quản lý</MenuItem>}
          {hasAuthenticated && <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header_Client;
