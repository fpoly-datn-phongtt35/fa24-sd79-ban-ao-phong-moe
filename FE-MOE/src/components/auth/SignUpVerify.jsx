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
import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "~/context/AuthContext";
import InfoIcon from "@mui/icons-material/Info";
import { sentOtp, verifyOtp } from "~/apis";
import { toast } from "react-toastify";

function SignUpVerify() {
  const context = useContext(AuthContext);

  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (context?.dataRegister) {
      getOTP();
    }
  }, []);

  const onSubmit = async (data) => {
    var object = {
      otp: data.verificationCode,
      token: token,
    };
    await verifyOtp(object).then((res) => {
      if (res?.status === 200) {
        context.setStep(4);
      }
    });
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      getOTP();
      setCountdown(30);
    } catch (error) {
      toast.error("Lỗi khi gửi lại mã xác thực");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getOTP = async () => {
    await sentOtp(context?.dataRegister?.email).then((res) => {
      setToken(res.data);
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
            backgroundColor: countdown > 0 ? "#f0f0f0" : "#1976d2",
            color: countdown > 0 ? "#a6a6a6" : "white",
            "&:hover":
              countdown > 0
                ? { backgroundColor: "#f0f0f0" }
                : { backgroundColor: "#1565c0" },
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
          sx={{
            width: "45%",
            backgroundColor: "#1976d2",
            color: "white",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Xác thực
        </Button>
      </Box>
    </form>
  );
}

export default SignUpVerify;
