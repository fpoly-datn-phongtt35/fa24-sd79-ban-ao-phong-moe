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
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Typography } from "@mui/joy";
import logo from "~/assert/images/MainLogo.jpg";
import { MoeAlert } from "../other/MoeAlert";
import { useContext, useState } from "react";
import { playAudio } from "~/utils/speak";
import { CommonContext } from "~/context/CommonContext";

export const Sidebar_Admin = (props) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const context = useContext(CommonContext);

  const handleLogout = async () => {
    await handleLogoutAPI();
    navigate("/");
  };

  return (
    <Box>
      <Box
        sx={{
          cursor: "pointer",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fbfbfb",
          borderRadius: "8px",
          transition: "background 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          },
        }}
        marginBottom={3}
        marginTop={1}
        onClick={() => navigate("/dashboard")}
        onMouseEnter={() => {
          setHovered(true);
          playAudio();
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src={
            hovered
              ? "https://cdn.pixabay.com/animation/2022/07/29/10/38/10-38-33-739_512.gif"
              : logo
          }
          alt="MOE Logo"
          style={{
            maxWidth: !props.collapsed ? "80px" : "50px",
            borderRadius: "4px",
            transition: "transform 0.3s ease",
            transform: hovered ? "rotate(360deg)" : "rotate(0deg)",
          }}
        />
        {!props.collapsed && (
          <Typography
            level="title-lg"
            sx={{
              color: "#0071bd",
              marginTop: 1,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            MOE SHOP
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
            icon={<ShoppingCartIcon style={{ color: "#0071bd" }} />}
            component={<Link to="/bill" />}
          >
            <Typography sx={{ color: "#32383e" }} level="body-md">
              Bán tại quầy
            </Typography>
          </MenuItem>

          <SubMenu
            disabled={!context?.isManager}
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
            <MenuItem
              component={<Link to="/employee" />}
              disabled={!context?.isManager}
            >
              <Typography sx={{ color: "#32383e" }} level="body-md">
                Nhân viên
              </Typography>
            </MenuItem>
          </SubMenu>
          <SubMenu
            disabled={!context?.isManager}
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
                Đợt giảm giá
              </Typography>
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<BarChartOutlinedIcon style={{ color: "#0071bd" }} />}
            component={<Link to="/statistical" />}
          >
            <Typography sx={{ color: "#32383e" }} level="body-md">
              Thống kê
            </Typography>
          </MenuItem>
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
