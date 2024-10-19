import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { handleLogoutAPI } from "~/apis";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Typography } from "@mui/joy";
import logo from "~/assert/MainLogo.jpg";
import { useEffect, useState } from "react";

export const Sidebar_Admin = (props) => {
  const navigate = useNavigate();
  const [ADMIN, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(getAuthority() == "USER");
  }, []);

  const getAuthority = () => {
    const roleCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="));

    return roleCookie ? roleCookie.split("=")[1] : "";
  };

  const handleLogout = () => {
    swal({
      title: "Cảnh báo",
      text: "Bạn có muốn đăng xuất không?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (confirm) => {
      if (confirm) {
        await handleLogoutAPI();
        navigate("/");
      }
    });
  };

  return (
    <Box>
      <Box
        sx={{
          cursor: "pointer",
          padding: 1,
          display: "flex",
          alignItems: "center",
          background: "#fbfbfb",
        }}
        marginBottom={3}
        marginTop={1}
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={logo}
          alt="MOE Logo"
          style={{
            maxWidth: !props.collapsed ? "80px" : "50px",
            marginLeft: "10px",
          }}
        />
        {!props.collapsed && (
          <Typography level="title-lg" sx={{ color: "#0071bd", marginLeft: 1 }}>
            MOE Store
          </Typography>
        )}
      </Box>
      <Sidebar
        className="sidebar"
        collapsed={props.collapsed}
        rootStyles={{ background: "#fff" }}
      >
        <Menu
          rootStyles={{
            color: "#32383e",
          }}
        >
          <MenuItem
            icon={<HomeIcon style={{ color: "#0071bd" }} />}
            component={<Link to="/dashboard" />}
          >
            <Typography sx={{ color: "#32383e" }} level="body-md">
              Trang chủ
            </Typography>
          </MenuItem>
          <SubMenu
            label="Bán hàng"
            icon={<ShoppingCartIcon style={{ color: "#0071bd" }} />}
          >
            <MenuItem component={<Link to="/dashboard?offline" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Offline
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Online
              </Typography>
            </MenuItem>
          </SubMenu>
          <SubMenu
            disabled={ADMIN}
            label="Sản phẩm"
            icon={
              <i className="fa-solid fa-shirt" style={{ color: "#0071bd" }}></i>
            }
          >
            <MenuItem component={<Link to="/product" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Quản lý sản phẩm
              </Typography>
            </MenuItem>
            <MenuItem component={<Link to="/product/categories" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Quản lý danh mục
              </Typography>
            </MenuItem>
            <MenuItem component={<Link to="/product/brand" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Quản lý thương hiệu
              </Typography>
            </MenuItem>
            <MenuItem component={<Link to="/product/material" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Quản lý chất liệu
              </Typography>
            </MenuItem>
            <SubMenu label="Thuộc tính sản phẩm">
              <MenuItem component={<Link to="/product/size" />}>
                <Typography sx={{ color: "#32383e" }} level="body-md">
                  Quản lý kích thước
                </Typography>
              </MenuItem>
              <MenuItem component={<Link to="/product/color" />}>
                <Typography sx={{ color: "#32383e" }} level="body-md">
                  Quản lý màu sắc
                </Typography>
              </MenuItem>
            </SubMenu>
            <MenuItem disabled={ADMIN} component={<Link to="/product/archive" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Kho lưu trữ
              </Typography>
            </MenuItem>
          </SubMenu>
          <SubMenu
            label="Người dùng"
            icon={<PeopleAltIcon style={{ color: "#0071bd" }} />}
          >
            <MenuItem component={<Link to="/customer" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Khách hàng
              </Typography>
            </MenuItem>
            <MenuItem component={<Link to="/employee" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Nhân viên
              </Typography>
            </MenuItem>
          </SubMenu>
          <SubMenu
            label="Giảm giá"
            icon={<ReceiptIcon style={{ color: "#0071bd" }} />}
          >
            <MenuItem component={<Link to="/coupon" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Phiếu giảm giá
              </Typography>
            </MenuItem>
            <MenuItem component={<Link to="/promotions" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Quản lý đợt giảm giá
              </Typography>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu
          rootStyles={{
            color: "#657d8d",
          }}
        >
          <MenuItem
            icon={<LogoutIcon style={{ color: "#0071bd" }} />}
            onClick={handleLogout}
          >
            <Typography sx={{ color: "#32383e" }} level="body-md">
              Đăng xuất
            </Typography>
          </MenuItem>
        </Menu>
      </Sidebar>
    </Box>
  );
};
