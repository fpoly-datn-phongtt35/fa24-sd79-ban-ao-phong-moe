// Author: Nong Hoang Vu || JavaTech
// Facebook: https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validInfo } from "~/apis";
import { AuthContext } from "~/context/AuthContext";
import InfoIcon from "@mui/icons-material/Info";

function SignUpBase() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      username: context.dataRegister.username,
      email: context.dataRegister.email,
      password: context.dataRegister.password,
      confirmPassword: context.dataRegister.password,
      phoneNumber: context.dataRegister.phoneNumber,
    },
  });

  const onSubmit = async (data) => {
    const result = {
      username: data.username,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    };
    validInfo(result.email, result.username)
      .then(() => {
        setMessage("");
        context.setStep(1);
        context.setDataRegister(result);
      })
      .catch((err) => {
        setMessage(err?.response?.data?.message);
      });
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        level="h4"
        marginBottom={3}
        textAlign="center"
        fontWeight="bold"
        sx={{
          color: "#1976d2",
        }}
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

      <FormControl error={!!errors?.username} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Username</FormLabel>
        <Input
          placeholder="Nhập username"
          type="text"
          {...register("username", {
            required: "Username không được để trống!",
            minLength: {
              value: 3,
              message: "Username phải từ 3 ký tự!",
            },
            maxLength: {
              value: 30,
              message: "Username không được vượt quá 30 ký tự!",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Username không được chứa ký tự đặc biệt!",
            },
          })}
          sx={{
            "--Input-focusedThickness": "1px",
          }}
        />
        {errors.username && (
          <FormHelperText>{errors.username.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors?.email} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Email</FormLabel>
        <Input
          placeholder="Nhập email"
          type="email"
          {...register("email", {
            required: "Email không được để trống!",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ!",
            },
          })}
          sx={{
            "--Input-focusedThickness": "1px",
          }}
        />
        {errors.email && (
          <FormHelperText>{errors.email.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors?.phoneNumber} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Số điện thoại</FormLabel>
        <Input
          placeholder="Nhập số điện thoại"
          type="tel"
          {...register("phoneNumber", {
            required: "Số điện thoại không được để trống!",
            pattern: {
              value: /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          })}
          sx={{
            "--Input-focusedThickness": "1px",
          }}
        />
        {errors.phoneNumber && (
          <FormHelperText>{errors.phoneNumber.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors?.password} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Mật khẩu</FormLabel>
        <Input
          placeholder="Nhập mật khẩu"
          type="password"
          {...register("password", {
            required: "Mật khẩu không được để trống!",
            minLength: {
              value: 6,
              message: "Mật khẩu phải từ 6 ký tự trở lên!",
            },
            maxLength: {
              value: 50,
              message: "Mật khẩu không được vượt quá 50 ký tự!",
            },
          })}
          sx={{
            "--Input-focusedThickness": "1px",
          }}
        />
        {errors.password && (
          <FormHelperText>{errors.password.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        error={!!errors?.confirmPassword}
        sx={{ mb: 2, width: "100%" }}
      >
        <FormLabel required>Nhập lại mật khẩu</FormLabel>
        <Input
          placeholder="Nhập lại mật khẩu"
          type="password"
          {...register("confirmPassword", {
            required: "Nhập lại mật khẩu không được để trống!",
            validate: (value) => value === password || "Mật khẩu không khớp!",
          })}
          sx={{
            "--Input-focusedThickness": "1px",
          }}
        />
        {errors.confirmPassword && (
          <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
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
          type="button"
          variant="soft"
          color="neutral"
          onClick={() => navigate("/sign-in")}
          sx={{
            width: "45%",
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#d6d6d6",
            },
          }}
        >
          Tôi đã có tài khoản
        </Button>
        <Button
          type="submit"
          variant="soft"
          color="primary"
          sx={{
            width: "45%",
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Tiếp tục
        </Button>
      </Box>
    </form>
  );
}

export default SignUpBase;
