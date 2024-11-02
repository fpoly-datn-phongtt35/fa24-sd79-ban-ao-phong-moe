import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { accessUserAPI, handleLogoutAPI } from "~/apis";
import { MoeAlert } from "../other/MoeAlert";
import { Autocomplete, Badge, Button, Input, Typography } from "@mui/joy";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchIcon from "@mui/icons-material/Search";

const managementOptions = [
  { title: "Bán tại quầy", path: "/" },
  { title: "Quản lý sản phẩm", path: "/product" },
  { title: "Thêm sản phẩm", path: "/product/new" },
  { title: "Quản lý danh mục", path: "/product/categories" },
  { title: "Quản lý thương hiệu", path: "/product/brand" },
  { title: "Quản lý chất liệu", path: "/product/material" },
  { title: "Quản lý kích thước", path: "/product/size" },
  { title: "Quản lý màu sắc", path: "/product/color" },
  { title: "Kho lưu trữ", path: "/product/archive" },
  { title: "Quản lý khách hàng", path: "/customer" },
  { title: "Thêm khách hàng", path: "/customer/add" },
  { title: "Quản lý nhân viên", path: "/employee" },
  { title: "Thêm nhân viên", path: "/employee/add" },
  { title: "Quản lý phiếu giảm giá", path: "/coupon" },
  { title: "Tạo phiếu giảm giá", path: "/coupon/add" },
  { title: "Quản lý đợt giảm giá", path: "/promotions" },
  { title: "Tạo đợt giảm giá", path: "/promotions/add" },
];
export const Header_Admin = (props) => {
  const [data, setData] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    handleAccessData();
  }, []);

  const handleAccessData = async () => {
    await accessUserAPI("ADMIN").then((res) => {
      setData(res);
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
        <Box
          sx={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          <Autocomplete
            freeSolo={true}
            startDecorator={<SearchIcon color="primary" />}
            placeholder="Tìm kiếm"
            sx={{ border: "none", width: 350, backgroundColor: "#f9fafc" }}
            options={managementOptions}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              if (newValue) {
                navigate(newValue.path);
              }
            }}
            renderInput={(params) => <Input {...params} type="search" />}
          />
        </Box>
        <Box
          sx={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          <Button
            size="sm"
            variant="soft"
            sx={{ backgroundColor: "#fffbf2", color: "#ffc86e" }}
          >
            <Badge color="danger" size="sm">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </Button>
        </Box>
        <Box sx={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar alt={data?.username} src={data?.avatar} />
          </IconButton>
          <Box sx={{ marginLeft: "10px", textAlign: "left" }}>
            <Typography level="title-md">{data?.fullName}</Typography>
            <Typography level="body-sm" sx={{ color: "grey.500" }}>
              Admin
            </Typography>
          </Box>
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
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                flexDirection: "column",
              }}
            >
              <Avatar
                src={data?.avatar}
                alt={data?.username}
                sx={{ width: 56, height: 56 }}
              />
              <Typography level="title-md">{data?.username}</Typography>
              <Typography level="body-sm" sx={{ color: "grey.500" }}>
                Admin
              </Typography>
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
