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
  Link,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert,
} from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import { CommonContext } from "~/context/CommonContext";

function LoginPage() {
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
    await axios
      .post(`${API_ROOT}/auth/access`, result)
      .then((res) => {
        if (res.status === 200) {
          setMessage("");
          document.cookie =
            `role=${res.data.authority};path=/;max-age=` + 7 * 24 * 60 * 60;
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          context.handleFetchCarts();
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || error?.message);
      });
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: 750,
        maxHeight: 750,
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
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${SideImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 636,
            height: 636,
          }}
        />

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography level="h4" marginBottom={3}>
              ĐĂNG NHẬP
            </Typography>
            {message.length > 0 && (
              <Alert
                sx={{ alignItems: "flex-start", mb: 2, maxWidth: 320 }}
                startDecorator={<InfoIcon />}
                variant="soft"
                color="warning"
              >
                <div>
                  <Typography level="body-sm" color="warning">
                    {message}
                  </Typography>
                </div>
              </Alert>
            )}
            <FormControl
              error={!!errors?.username}
              sx={{ mb: 2, maxWidth: 320 }}
            >
              <FormLabel required>Tên tài khoản hoặc email</FormLabel>
              <Input
                placeholder="Nhập tên tài khoản hoặc email"
                type="text"
                fullWidth
                {...register("username", { required: true })}
              />
              {errors.username && (
                <FormHelperText>
                  Vui lòng nhập tên tài khoản hoặc email của bạn!
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              error={!!errors?.password}
              sx={{ mb: 2, maxWidth: 320 }}
            >
              <FormLabel required>Mật khẩu</FormLabel>
              <Input
                placeholder="Mật khẩu"
                type="password"
                fullWidth
                {...register("password", { required: true })}
              />
              {errors.password && (
                <FormHelperText>Vui lòng nhập mật khẩu!</FormHelperText>
              )}
            </FormControl>
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
                variant="soft"
                color="neutral"
                sx={{ width: "35%" }}
              >
                Đăng nhập
              </Button>
              <Link href="#" underline="hover" color="neutral">
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
