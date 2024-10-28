// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
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
import StorefrontIcon from "@mui/icons-material/Storefront";
import logo from "~/assert/images/MainLogo.jpg";
import { MoeAlert } from "../other/MoeAlert";

export const Sidebar_Admin = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await handleLogoutAPI();
    navigate("/");
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
          <MenuItem
            icon={<StorefrontIcon style={{ color: "#0071bd" }} />}
            component={<Link to="/" />}
          >
            <Typography sx={{ color: "#32383e" }} level="body-md">
              Cửa hàng
            </Typography>
          </MenuItem>
          <SubMenu
            label="Bán hàng"
            icon={<ShoppingCartIcon style={{ color: "#0071bd" }} />}
          >
            <MenuItem component={<Link to="/dashboard?offline" />}>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Bán tại quầy
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Đơn đặt hàng
              </Typography>
            </MenuItem>
            <MenuItem>
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Hóa đơn
              </Typography>
            </MenuItem>
          </SubMenu>
          <SubMenu
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
            <MenuItem component={<Link to="/product/archive" />}>
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
          <MoeAlert
            title="Đăng xuất"
            message="Bạn có muốn đăng xuất không?"
            event={handleLogout}
            button={
              <MenuItem icon={<LogoutIcon style={{ color: "#0071bd" }} />}>
                <Typography sx={{ color: "#32383e" }} level="body-md">
                  Đăng xuất
                </Typography>
              </MenuItem>
            }
          />
        </Menu>
      </Sidebar>
    </Box>
  );
};
