import React from "react";
import { Box, Typography, Input, Button, Link } from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";

function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: 700,
        maxHeight: 700,
        maxWidth: 1305,
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1400,
          overflow: "hidden",
        }}
      >
        {/* Left Side Image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${SideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 700, // Tăng kích thước ảnh
            height: 600,
          }}
        />

        {/* Right Side Form */}
        <Box
          sx={{
            flex: 1,
            padding: "40px",
            marginLeft: "40px", // Tạo khoảng cách xa hơn giữa ảnh và form
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography level="h4" marginBottom={3}>
            ĐĂNG NHẬP
          </Typography>
          <Input
            placeholder="Nhập tên tài khoản hoặc email"
            type="email"
            fullWidth
            sx={{ mb: 2, maxWidth: 320 }} // Giảm chiều ngang của ô nhập
          />
          <Input
            placeholder="Mật khẩu"
            type="password"
            fullWidth
            sx={{ mb: 2, maxWidth: 320 }} // Giảm chiều ngang của ô nhập
          />

          {/* Box containing Log In button and Forget Password link */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: 320,
            }}
          >
            <Button variant="solid" color="danger" sx={{ width: "35%" }}>
              Đăng nhập
            </Button>
            <Link href="#" underline="hover" sx={{ color: "danger.500" }}>
              Quên mật khẩu
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
