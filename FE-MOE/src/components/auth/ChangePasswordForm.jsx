// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Typography,
} from "@mui/joy";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { changePassword } from "~/apis";

function ChangePasswordForm({ method }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    var value = {
      email: method.email,
      password: data.newPassword,
    };

    console.log(value);
    
    await changePassword(value).then((res) => {
      if (res?.status === 200) {
        navigate("/sign-in");
      }
    });
  };

  const newPassword = watch("newPassword");

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
        ĐỔI MẬT KHẨU
      </Typography>

      {/* Nhập mật khẩu mới */}
      <FormControl error={!!errors?.newPassword} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Nhập mật khẩu mới</FormLabel>
        <Input
          type="password"
          placeholder="Nhập mật khẩu mới..."
          {...register("newPassword", {
            required: "Mật khẩu không được để trống",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
            validate: (value) =>
              !/\s/.test(value) || "Mật khẩu không được chứa khoảng trắng",
          })}
        />
        {errors.newPassword && (
          <FormHelperText>{errors.newPassword.message}</FormHelperText>
        )}
      </FormControl>

      {/* Nhập lại mật khẩu */}
      <FormControl
        error={!!errors?.confirmPassword}
        sx={{ mb: 2, width: "100%" }}
      >
        <FormLabel required>Nhập lại mật khẩu</FormLabel>
        <Input
          type="password"
          placeholder="Nhập lại mật khẩu..."
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) =>
              value === newPassword || "Mật khẩu không trùng khớp",
          })}
        />
        {errors.confirmPassword && (
          <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
        )}
      </FormControl>

      {/* Buttons */}
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
          sx={{
            width: "45%",
            backgroundColor: "#f0f0f0",
            color: "#666",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
          onClick={() => navigate("/sign-in")}
        >
          Hủy
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
          Xác nhận
        </Button>
      </Box>
    </form>
  );
}

export default ChangePasswordForm;
