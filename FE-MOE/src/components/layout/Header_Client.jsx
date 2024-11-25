// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { accessUserAPI, handleLogoutAPI } from "~/apis";
import debounce from "lodash.debounce";
import { Autocomplete, Avatar, Input, Tooltip, Typography } from "@mui/joy";
import { CommonContext } from "~/context/CommonContext";
import { SearchBase } from "~/apis/client/apiClient";

const Header_Client = () => {
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const context = useContext(CommonContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      setHasAuthenticated(true);
      handleAccessData();
    } else {
      setHasAuthenticated(false);
    }
  }, [accessToken]);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      setLoading(true);
      await SearchBase(keyword)
        .then((res) => setOptions(res.data))
        .finally(() => setLoading(false));
    }, 1000),
    []
  );

  useEffect(() => {
    if (inputValue) {
      handleSearch(inputValue);
    }
  }, [inputValue, handleSearch]);

  const handleSelectOption = (event, option) => {
    if (option) {
      setInputValue("");
      setOptions([]);
      navigate(`/view/${option.id}`);
    }
  };

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
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    await handleLogoutAPI();
    localStorage.removeItem("orderItems");
    localStorage.removeItem("accessToken");
    document.cookie = "role=; path=/; max-age=0";
    context.setAmoutCart(null);
    navigate("/sign-in");
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
            sx={{
              color: location.pathname === "/" ? "primary.main" : "#000",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              ":hover": {
                color: "primary.main",
                transform: "scale(1.05)",
              },
            }}
          >
            Trang chủ
          </Button>
          <Button
            onClick={() => navigate("/search")}
            sx={{
              color: location.pathname === "/search" ? "primary.main" : "#000",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              ":hover": {
                color: "primary.main",
                transform: "scale(1.05)",
              },
            }}
          >
            Sản phẩm
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            sx={{
              color: location.pathname === "/contact" ? "primary.main" : "#000",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              ":hover": {
                color: "primary.main",
                transform: "scale(1.05)",
              },
            }}
          >
            Liên hệ
          </Button>
          <Button
            onClick={() => navigate("/about")}
            sx={{
              color: location.pathname === "/about" ? "primary.main" : "#000",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              ":hover": {
                color: "primary.main",
                transform: "scale(1.05)",
              },
            }}
          >
            Giới thiệu
          </Button>
          {!localStorage.getItem("accessToken") &&
            (location.pathname.includes("sign-up") ? (
              <Button
                onClick={singIn}
                sx={{
                  color: "#000",
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  ":hover": {
                    color: "primary.main",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Đăng nhập
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/sign-up")}
                sx={{
                  color: "#000",
                  textTransform: "none",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  ":hover": {
                    color: "primary.main",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Đăng ký
              </Button>
            ))}
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Autocomplete
              freeSolo
              startDecorator={
                <SearchIcon
                  color="primary"
                  onClick={() => {
                    setOptions([]);
                    navigate("/search");
                  }}
                />
              }
              placeholder="Tìm kiếm"
              sx={{ width: 350, backgroundColor: "#f9fafc", border: "none" }}
              options={options}
              getOptionLabel={(option) => option.name || ""}
              onInputChange={(event, newInputValue) => {
                context.setKeyword(newInputValue);
                setInputValue(newInputValue);
              }}
              components={{
                Input: (props) => (
                  <Input {...props} type="search" value={inputValue} />
                ),
              }}
              loading={loading}
              renderOption={(props, option) => {
                const { key, ownerState, ...restProps } = props;
                return (
                  <Box
                    {...restProps}
                    key={key}
                    display="flex"
                    marginBottom={3}
                    alignItems="center"
                    onClick={() => handleSelectOption(null, option)}
                  >
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      width={40}
                      height={40}
                      style={{ marginRight: 8 }}
                    />
                    <Typography level="title-sm" noWrap variant="plain">
                      {option.name}
                    </Typography>
                  </Box>
                );
              }}
            />
          </Box>

          <IconButton>
            <Badge badgeContent={2} color="primary">
              <FavoriteBorderOutlinedIcon />
            </Badge>
          </IconButton>
          <Tooltip variant="plain" title="Giỏ hàng">
            <IconButton onClick={() => navigate("/cart")}>
              <Badge badgeContent={context.amoutCart} color="primary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton onClick={hasAuthenticated ? handleMenuClick : singIn}>
            <Avatar src={avatar} alt={username} />
          </IconButton>
        </Box>

        {/* Menu for profile */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography
              level="tile-md"
              startDecorator={<AccountCircleOutlinedIcon />}
              onClick={() => navigate("/my-account")}
            >
              Quản lý tài khoản
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => navigate("/my-order")}>
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
