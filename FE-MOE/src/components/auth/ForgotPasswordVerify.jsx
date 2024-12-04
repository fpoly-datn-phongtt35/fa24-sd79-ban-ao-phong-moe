// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InfoIcon from "@mui/icons-material/Info";
import { requestForgotPassword, verifyOtp } from "~/apis";
import { toast } from "react-toastify";

function ForgotPasswordVerify({ method }) {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Restore state from localStorage
    const savedCount = localStorage.getItem("attemptCount");
    const savedTimeout = localStorage.getItem("timeout");

    if (savedCount) {
      setAttemptCount(parseInt(savedCount, 10));
    }

    if (savedTimeout) {
      const remainingTime = Math.ceil((savedTimeout - Date.now()) / 1000);
      if (remainingTime > 0) {
        setIsLocked(true);
        setCountdown(remainingTime);
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setIsLocked(false);
          setAttemptCount(0);
          localStorage.removeItem("timeout");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = async (data) => {
    if (isLocked) {
      toast.error("Vui lòng chờ hết thời gian chờ.");
      return;
    }

    var object = {
      otp: data.verificationCode,
      token: method.token,
    };

    const response = await verifyOtp(object);

    if (response?.status === 200) {
      toast.success("Xác thực thành công!");
      method.setStep(2);
    } else {
      setAttemptCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setIsLocked(true);
          const timeout = Date.now() + 60000; // 60 seconds
          localStorage.setItem("timeout", timeout);
          setCountdown(60);
          toast.error("Quá số lần thử, vui lòng chờ 60 giây.");
        } else {
          toast.error("Mã xác thực không đúng. Vui lòng thử lại.");
        }
        localStorage.setItem("attemptCount", newCount);
        return newCount;
      });
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await getOTP();
      setCountdown(30);
    } catch (error) {
      toast.error("Lỗi khi gửi lại mã xác thực");
    } finally {
      setIsResending(false);
    }
  };

  const getOTP = async () => {
    const response = await requestForgotPassword(method?.email);
    if (response?.status === 200) {
      method.setToken(response.data);
      toast.success("Mã xác thực đã được gửi lại.");
    }
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
        XÁC THỰC MÃ
      </Typography>

      {errors.length > 0 && (
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
            {errors[0]?.message}
          </Typography>
        </Alert>
      )}

      <FormControl
        error={!!errors?.verificationCode}
        sx={{ mb: 2, width: "100%" }}
      >
        <FormLabel required>Nhập mã xác thực</FormLabel>
        <Input
          placeholder="Nhập mã xác thực..."
          sx={{ "--Input-focusedThickness": "1px" }}
          {...register("verificationCode", {
            required: "Mã xác thực không được để trống",
            minLength: {
              value: 5,
              message: "Mã xác thực không hợp lệ",
            },
            maxLength: {
              value: 11,
              message: "Mã xác thực không hợp lệ",
            },
          })}
        />
        {errors.verificationCode && (
          <FormHelperText>{errors.verificationCode.message}</FormHelperText>
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
          sx={{
            width: "45%",
            backgroundColor: "#f0f0f0",
          }}
          disabled={isResending || countdown > 0}
          onClick={handleResendCode}
        >
          {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã"}
        </Button>
        <Button
          type="submit"
          variant="soft"
          color="primary"
          disabled={isLocked}
          sx={{
            width: "45%",
            backgroundColor: isLocked ? "#f0f0f0" : "#1976d2",
            color: isLocked ? "#a6a6a6" : "white",
            "&:hover": isLocked
              ? { backgroundColor: "#f0f0f0" }
              : { backgroundColor: "#1565c0" },
          }}
        >
          {isLocked ? `Chờ ${countdown}s` : "Xác thực"}
        </Button>
      </Box>
    </form>
  );
}

export default ForgotPasswordVerify;
