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
  Grid,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/joy";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "~/context/AuthContext";
import { convertToMMDDYYYY, formatDateSignUp } from "~/utils/format";
import InfoIcon from "@mui/icons-material/Info";

function SignUpInfo() {
  const context = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: context?.dataRegister?.firstName,
      lastName: context?.dataRegister?.lastName,
      gender: context?.dataRegister?.gender,
      birthDate:
        context?.dataRegister?.dateOfBirth &&
        convertToMMDDYYYY(context.dataRegister.dateOfBirth),
    },
  });

  const onSubmit = (data) => {
    context.setDataRegister((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: formatDateSignUp(data.birthDate),
    }));
    context.setStep(2);
  };

  const validateAge = (value) => {
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age > 16 ||
      (age === 16 && monthDifference > 0) ||
      (age === 16 &&
        monthDifference === 0 &&
        today.getDate() >= birthDate.getDate())
    ) {
      return true;
    }
    return "Bạn phải đủ 16 tuổi.";
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
        THÔNG TIN NGƯỜI DÙNG
      </Typography>

      {/* Thông báo lỗi nếu có */}
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

      <Grid container spacing={3}>
        <Grid xs={6}>
          <FormControl error={!!errors?.lastName} sx={{ mb: 2, width: "100%" }}>
            <FormLabel required>Họ</FormLabel>
            <Input
              placeholder="Nhập họ của bạn..."
              sx={{ "--Input-focusedThickness": "1px" }}
              {...register("lastName", {
                required: "Họ không được để trống",
                minLength: {
                  value: 2,
                  message: "Vui lòng nhập đúng thông tin!",
                },
                maxLength: {
                  value: 15,
                  message: "Vui lòng nhập đúng thông tin!",
                },
              })}
            />
            {errors.lastName && (
              <FormHelperText>{errors.lastName.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid xs={6}>
          <FormControl
            error={!!errors?.firstName}
            sx={{ mb: 2, width: "100%" }}
          >
            <FormLabel required>Tên</FormLabel>
            <Input
              placeholder="Nhập tên của bạn..."
              sx={{ "--Input-focusedThickness": "1px" }}
              {...register("firstName", {
                required: "Tên không được để trống",
                minLength: {
                  value: 2,
                  message: "Vui lòng nhập đúng thông tin!",
                },
                maxLength: {
                  value: 15,
                  message: "Vui lòng nhập đúng thông tin!",
                },
              })}
            />
            {errors.firstName && (
              <FormHelperText>{errors.firstName.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <FormControl error={!!errors?.birthDate} sx={{ mb: 2, width: "100%" }}>
        <FormLabel required>Ngày sinh</FormLabel>
        <Input
          type="date"
          sx={{ "--Input-focusedThickness": "1px" }}
          {...register("birthDate", {
            required: "Ngày sinh không được để trống",
            validate: validateAge,
          })}
        />
        {errors.birthDate && (
          <FormHelperText>{errors.birthDate.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors?.gender} sx={{ mb: 2 }}>
        <FormLabel required>Giới tính</FormLabel>
        <RadioGroup
          defaultValue={context?.dataRegister?.gender}
          name="gender"
          aria-labelledby="gender-group"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Radio
              value="MALE"
              slotProps={{ input: { "aria-label": "MALE" } }}
              {...register("gender", {
                required: "Giới tính không được để trống",
              })}
            />
            <Typography>Nam</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Radio
              value="FEMALE"
              slotProps={{ input: { "aria-label": "FEMALE" } }}
              {...register("gender")}
            />
            <Typography>Nữ</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Radio
              value="OTHER"
              slotProps={{ input: { "aria-label": "OTHER" } }}
              {...register("gender")}
            />
            <Typography>Khác</Typography>
          </Box>
        </RadioGroup>
        {errors.gender && (
          <FormHelperText>{errors.gender.message}</FormHelperText>
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
            "&:hover": {
              backgroundColor: "#d6d6d6",
            },
          }}
          onClick={() => context.setStep(0)}
        >
          Quay lại
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

export default SignUpInfo;
