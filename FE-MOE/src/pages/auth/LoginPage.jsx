import React, { useState } from "react";
import { Box, Typography, Input, Button, Link } from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";
import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      username,
      password,
      platform: "web",
    };
    const res = await authorizedAxiosInstance.post(
      `${API_ROOT}/auth/access`,
      data
    );
    document.cookie =
      `role=${res.data.authority};path=/;max-age=` + 7 * 24 * 60 * 60;
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    navigate("/dashboard");
  };
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
            width: 700,
            height: 600,
          }}
        />

        {/* Right Side Form */}
        <Box
          sx={{
            flex: 1,
            padding: "40px",
            marginLeft: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Typography level="h4" marginBottom={3}>
              ĐĂNG NHẬP
            </Typography>
            <Input
              placeholder="Nhập tên tài khoản hoặc email"
              type="text"
              fullWidth
              sx={{ mb: 2, maxWidth: 320 }}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              fullWidth
              sx={{ mb: 2, maxWidth: 320 }}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: 320,
              }}
            >
              <Button
                type="submit"
                variant="solid"
                color="danger"
                sx={{ width: "35%" }}
              >
                Đăng nhập
              </Button>
              <Link href="#" underline="hover" sx={{ color: "danger.500" }}>
                Quên mật khẩu
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
