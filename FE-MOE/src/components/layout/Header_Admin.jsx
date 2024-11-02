// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import { accessUserAPI, handleLogoutAPI } from "~/apis";
import {
  Autocomplete,
  Badge,
  Button,
  DialogContent,
  Drawer,
  Input,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemDecorator,
  ModalClose,
  Tooltip,
  Typography,
} from "@mui/joy";
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
  { title: "Tạo phiếu giảm giá", path: "/coupon/create" },
  { title: "Quản lý đợt giảm giá", path: "/promotions" },
  { title: "Tạo đợt giảm giá", path: "/promotions/add" },
];
export const Header_Admin = (props) => {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleAccessData();
  }, []);

  const handleAccessData = async () => {
    await accessUserAPI("ADMIN").then((res) => {
      setData(res);
    });
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
            freeSolo
            startDecorator={<SearchIcon color="primary" />}
            placeholder="Tìm kiếm"
            sx={{ width: 350, backgroundColor: "#f9fafc", border: "none" }}
            options={managementOptions}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
              if (newValue) {
                navigate(newValue.path);
              }
            }}
            components={{
              Input: (props) => <Input {...props} type="search" />,
            }}
          />
        </Box>
        <Box
          sx={{ marginRight: "10px", display: "flex", alignItems: "center" }}
        >
          <Tooltip title="Thông báo" variant="plain">
            <Button
              size="sm"
              variant="soft"
              sx={{ backgroundColor: "#fffbf2", color: "#ffc86e" }}
            >
              <Badge color="danger" size="sm">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </Button>
          </Tooltip>
        </Box>
        <Box sx={{ marginLeft: "5px", display: "flex", alignItems: "center" }}>
          <Tooltip title="Tài khoản" variant="plain">
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => setOpen(true)}
              color="inherit"
            >
              <Badge
                color="success"
                badgeInset="10%"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar alt={data?.username} src={data?.avatar} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Box
            sx={{ marginLeft: "10px", textAlign: "left", cursor: "pointer" }}
            onClick={() => setOpen(true)}
          >
            <Typography level="title-md">{data?.fullName}</Typography>
            <Typography level="body-sm" sx={{ color: "grey.500" }}>
              Admin
            </Typography>
          </Box>
          <Box>
            <Drawer
              anchor="right"
              size="sm"
              open={open}
              onClose={() => setOpen(false)}
            >
              <ModalClose />
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1.5,
                  pb: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Badge
                  color="success"
                  badgeInset="20%"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Avatar alt={data?.username} src={data?.avatar} />
                </Badge>
                <div>
                  <Typography level="title-md">{data?.username}</Typography>
                  <Typography level="body-sm">{data?.fullName}</Typography>
                </div>
              </Box>
              <DialogContent>
                <List>
                  <ListDivider />
                  <ListItem>
                    <ListItemButton onClick={() => alert("Comming soon!")}>
                      <ListItemDecorator>
                        <PermIdentityOutlinedIcon />
                      </ListItemDecorator>
                      Thông tin tài khoản
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton onClick={() => alert("Comming soon!")}>
                      <ListItemDecorator>
                        <HttpsOutlinedIcon />
                      </ListItemDecorator>
                      Đổi mật khẩu
                    </ListItemButton>
                  </ListItem>
                  <ListDivider />
                  <ListItem>
                    <ListItemButton onClick={() => alert("Comming soon!")}>
                      <ListItemDecorator>
                        <SettingsOutlinedIcon />
                      </ListItemDecorator>
                      Cài đặt
                    </ListItemButton>
                  </ListItem>
                  <ListDivider />
                  <ListItem>
                    <ListItemButton onClick={() => handleLogout()}>
                      <ListItemDecorator>
                        <LogoutOutlinedIcon />
                      </ListItemDecorator>
                      Đăng xuất
                    </ListItemButton>
                  </ListItem>
                </List>
              </DialogContent>
            </Drawer>
          </Box>
        </Box>
      </div>
    </header>
  );
};
