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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { requestForgotPassword } from "~/apis";

function RequestForgotPassword({ method }) {
  const [attemptCount, setAttemptCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const savedCount = localStorage.getItem("attemptCount");
    const savedTimeout = localStorage.getItem("timeout");

    if (savedCount) {
      setAttemptCount(parseInt(savedCount, 10));
    }

    if (savedTimeout) {
      const remainingTime = Math.ceil((savedTimeout - Date.now()) / 1000);
      if (remainingTime > 0) {
        setIsDisabled(true);
        setCountdown(remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setIsDisabled(false);
          setAttemptCount(0);
          localStorage.removeItem("timeout");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = (data) => {
    if (isDisabled) {
      toast.error("Vui lòng chờ hết thời gian chờ.");
      return;
    }

    if (attemptCount >= 5) {
      setIsDisabled(true);
      const timeout = Date.now() + 60000;
      localStorage.setItem("timeout", timeout);
      setCountdown(60);
      toast.error("Quá số lần thử, vui lòng chờ 60 giây.");
    } else {
      handleVerification(data.email);

      setAttemptCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("attemptCount", newCount);
        return newCount;
      });
    }
  };

  const handleVerification = async (email) => {
    await requestForgotPassword(email)
      .then((res) => {
        method.setToken(res.data);
        method.setStep(1);
        method.setEmail(email);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

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
        QUÊN MẬT KHẨU
      </Typography>

      <FormControl error={!!errors.email} sx={{ mb: 2 }}>
        <FormLabel required>Địa chỉ email</FormLabel>
        <Input
          placeholder="Nhập email..."
          {...register("email", {
            required: "Email không được để trống",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Địa chỉ email không hợp lệ",
            },
          })}
        />
        {errors.email && (
          <FormHelperText>{errors.email.message}</FormHelperText>
        )}
      </FormControl>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => navigate("/sign-in")}
          type="button"
          variant="soft"
          color="neutral"
          sx={{
            width: "45%",
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          Đăng nhập
        </Button>
        <Button
          type="submit"
          variant="soft"
          color="primary"
          disabled={isDisabled}
          sx={{
            width: "45%",
            backgroundColor: isDisabled ? "#f0f0f0" : "#1976d2",
            color: isDisabled ? "#a6a6a6" : "white",
            "&:hover": {
              backgroundColor: isDisabled ? "#f0f0f0" : "#1565c0",
            },
          }}
        >
          {isDisabled ? `Chờ ${countdown}s` : "Tiếp tục"}
        </Button>
      </Box>
    </form>
  );
}

export default RequestForgotPassword;
