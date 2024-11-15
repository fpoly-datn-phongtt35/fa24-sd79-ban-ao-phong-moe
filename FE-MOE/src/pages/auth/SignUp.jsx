// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
} from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";
import { API_ROOT } from "~/utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import { CommonContext } from "~/context/CommonContext";

function SignUp() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const context = useContext(CommonContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = {
      username: data.username,
      password: data.password,
      platform: "web",
    };
    console.log(result);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 750,
        maxHeight: 750,
        maxWidth: 1305,
        margin: "auto",
        p: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: 1400,
          overflow: "hidden",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${SideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 636,
            height: 636,
            borderRadius: "8px 0 0 8px",
          }}
        />

        <Box
          sx={{
            flex: 1,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Typography
              level="h4"
              marginBottom={3}
              textAlign="center"
              fontWeight="bold"
            >
              ĐĂNG KÝ TÀI KHOẢN
            </Typography>
            {message.length > 0 && (
              <Alert
                sx={{
                  alignItems: "flex-start",
                  mb: 2,
                  maxWidth: "100%",
                  backgroundColor: "#fff9e6",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
                startDecorator={<InfoIcon />}
                variant="soft"
                color="warning"
              >
                <Typography level="body-sm" color="warning">
                  {message}
                </Typography>
              </Alert>
            )}
            <FormControl sx={{ mb: 2, width: "100%" }}>
              <FormLabel required>Username</FormLabel>
              <Input
                placeholder="Nhập username"
                type="text"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.username && (
                <FormHelperText>Username không hợp lệ!</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ mb: 2, width: "100%" }}>
              <FormLabel required>Email</FormLabel>
              <Input
                placeholder="Nhập email"
                type="email"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.email && (
                <FormHelperText>Email không hợp lệ!</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ mb: 2, width: "100%" }}>
              <FormLabel required>Số điện thoại</FormLabel>
              <Input
                placeholder="Nhập số điện thoại"
                type="tel"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.phone && (
                <FormHelperText>Số điện thoại không hợp lệ!</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ mb: 2, width: "100%" }}>
              <FormLabel required>Mật khẩu</FormLabel>
              <Input
                placeholder="Nhập mật khẩu"
                type="password"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.password && (
                <FormHelperText>Mật khẩu không hợp lệ!</FormHelperText>
              )}
            </FormControl>
            <FormControl sx={{ mb: 2, width: "100%" }}>
              <FormLabel required>Nhập lại mật khẩu</FormLabel>
              <Input
                placeholder="Nhập mật khẩu"
                type="password"
                fullWidth
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.confirmPassword && (
                <FormHelperText>Mật khẩu không khớp!</FormHelperText>
              )}
            </FormControl>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                mt: 2,
              }}
            >
              <Button
                type="submit"
                variant="soft"
                color="neutral"
                sx={{
                  width: "45%",
                  backgroundColor: "#3f51b5",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                  },
                }}
              >
                Đăng ký
              </Button>
              <Link to="/sign-in" underline="hover" color="neutral">
                Tôi đã có tài khoản
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
