import {
  Box,
  Button,
  FormControl,
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
    console.log(data.birthDate);

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
      style={{ width: "100%", maxWidth: 400 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography
        level="h4"
        marginBottom={3}
        textAlign="center"
        fontWeight="bold"
      >
        THÔNG TIN NGƯỜI DÙNG
      </Typography>
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid xs={6}>
          <FormControl error={!!errors?.lastName} sx={{ mb: 2, width: "100%" }}>
            <FormLabel required>Họ</FormLabel>
            <Input
              placeholder="Nhập họ của bạn..."
              sx={{ "--Input-focusedThickness": "1px" }}
              {...register("lastName", {
                required: "Họ không được để trống",
                minLength: {
                  value: 3,
                  message: "Vui lòng nhập đúng thông tin!",
                },
                maxLength: {
                  value: 15,
                  message: "Vui lòng nhập đúng thông tin!",
                },
              })}
            />
            {errors.lastName && (
              <Typography color="danger" fontSize="sm">
                {errors.lastName.message}
              </Typography>
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
                  value: 3,
                  message: "Vui lòng nhập đúng thông tin!",
                },
                maxLength: {
                  value: 15,
                  message: "Vui lòng nhập đúng thông tin!",
                },
              })}
            />
            {errors.firstName && (
              <Typography color="danger" fontSize="sm">
                {errors.firstName.message}
              </Typography>
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
          <Typography color="danger" fontSize="sm">
            {errors.birthDate.message}
          </Typography>
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
          <Typography color="danger" fontSize="sm">
            {errors.gender.message}
          </Typography>
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
          sx={{ width: "45%" }}
          onClick={() => context.setStep(0)}
        >
          Quay lại
        </Button>
        <Button
          type="submit"
          variant="soft"
          color="neutral"
          sx={{ width: "45%" }}
        >
          Tiếp tục
        </Button>
      </Box>
    </form>
  );
}

export default SignUpInfo;
