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
  Checkbox,
} from "@mui/joy";
import SideImage from "~/assert/images/SideImage.svg";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import { CommonContext } from "~/context/CommonContext";
import Cookies from "js-cookie";

function SignIn() {
  const navigate = useNavigate();

  const usernameCookie = Cookies.get("usernameCookie") || "";
  const passwordCookie = Cookies.get("passwordCookie") || "";
  const [message, setMessage] = useState("");

  const [isRememberMe, setIsRememberMe] = useState(
    Cookies.get("isRememberMe") === "true"
  );

  const context = useContext(CommonContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: usernameCookie,
      password: passwordCookie,
    },
  });

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

          if (isRememberMe) {
            Cookies.set("usernameCookie", data.username, { expires: 30 });
            Cookies.set("passwordCookie", data.password, { expires: 30 });
            Cookies.set("isRememberMe", "true", { expires: 30 });
          } else {
            Cookies.remove("usernameCookie");
            Cookies.remove("passwordCookie");
            Cookies.remove("isRememberMe");
          }
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
              ĐĂNG NHẬP
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
            <FormControl
              error={!!errors?.username}
              sx={{ mb: 2, width: "100%" }}
            >
              <FormLabel required>Tên tài khoản hoặc email</FormLabel>
              <Input
                placeholder="Nhập tên tài khoản hoặc email"
                type="text"
                fullWidth
                {...register("username", { required: true })}
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.username && (
                <FormHelperText>
                  Vui lòng nhập tên tài khoản hoặc email của bạn!
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              error={!!errors?.password}
              sx={{ mb: 2, width: "100%" }}
            >
              <FormLabel required>Mật khẩu</FormLabel>
              <Input
                placeholder="Mật khẩu"
                type="password"
                fullWidth
                {...register("password", { required: true })}
                sx={{
                  borderRadius: 2,
                  borderColor: "#d1d1d1",
                  "&:focus": { borderColor: "#3f51b5" },
                }}
              />
              {errors.password && (
                <FormHelperText>Vui lòng nhập mật khẩu!</FormHelperText>
              )}
            </FormControl>
            <Checkbox
              label="Remember me"
              size="sm"
              checked={isRememberMe}
              onChange={(e) => setIsRememberMe(e.target.checked)}
            />
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

export default SignIn;
