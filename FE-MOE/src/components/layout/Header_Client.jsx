import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Badge,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import { accessUserAPI, handleLogoutAPI } from "~/apis";
import { Avatar, Input, Typography } from "@mui/joy";

const Header_Client = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (accessToken) {
      setHasAuthenticated(true);
      handleAccessData();
    } else {
      setHasAuthenticated(false);
    }
  }, [accessToken]);

  const navigate = useNavigate();

  const handleAccessData = async () => {
    await accessUserAPI("USER").then((res) => {
      setAvatar(res?.avatar);
      setUsername(res?.username);
    });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const singIn = () => {
    navigate("/signin");
  };

  const handleLogout = async () => {
    await handleLogoutAPI();
    localStorage.removeItem("accessToken");
    document.cookie = "role=; path=/; max-age=0";
    navigate("/signin");
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
            <Avatar src={avatar} alt={username} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography
              level="tile-md"
              startDecorator={<AccountCircleOutlinedIcon />}
            >
              Quản lý tài khoản
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Typography
              level="tile-md"
              startDecorator={<ShoppingCartOutlinedIcon />}
            >
              Đơn hàng của tôi
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Typography
              level="tile-md"
              startDecorator={<FeedbackOutlinedIcon />}
            >
              Đánh giá của tôi
            </Typography>
          </MenuItem>
          {hasAuthenticated && (
            <MenuItem onClick={handleLogout}>
              <Typography
                level="tile-md"
                startDecorator={<LogoutOutlinedIcon />}
              >
                Đăng xuất
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header_Client;
