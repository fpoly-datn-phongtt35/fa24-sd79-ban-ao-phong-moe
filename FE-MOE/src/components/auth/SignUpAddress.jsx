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
  Option,
  Select,
  Typography,
} from "@mui/joy";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "~/context/AuthContext";
import { API_ADDRESS } from "~/utils/constants";

function SignUpAddress() {
  const context = useContext(AuthContext);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: context?.dataRegister?.cityId || "",
      district: context?.dataRegister?.districtId || "",
      ward: context?.dataRegister?.ward || "",
      streetName: context?.dataRegister?.streetName || "",
    },
  });

  const selectedCity = watch("city");
  const selectedDistrict = watch("district");

  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get(`${API_ADDRESS}?depth=1`);
      setCities(response.data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (context?.dataRegister) {
      setValue("city", context.dataRegister.cityId || "");
      setValue("district", context.dataRegister.districtId || "");
      setValue("ward", context.dataRegister.ward || "");
      setValue("streetName", context.dataRegister.streetName || "");
    }
  }, [context?.dataRegister, setValue]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedCity) {
        const response = await axios.get(
          `${API_ADDRESS}p/${selectedCity}?depth=2`
        );
        setDistricts(response.data.districts);
      } else {
        setDistricts([]);
      }
      setValue("district", "");
      setValue("ward", "");
      setWards([]);
    };
    fetchDistricts();
  }, [selectedCity, setValue]);

  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        const response = await axios.get(
          `${API_ADDRESS}d/${selectedDistrict}?depth=2`
        );
        setWards(response.data.wards);
      } else {
        setWards([]);
      }
      setValue("ward", "");
    };
    fetchWards();
  }, [selectedDistrict, setValue]);

  const onSubmit = (data) => {
    const city = cities.find((c) => c.code === data.city);
    const district = districts.find((d) => d.code === data.district);
    const ward = wards.find((w) => w.name === data.ward);

    context.setDataRegister((prev) => ({
      ...prev,
      city: city?.name || "",
      cityId: city?.code || null,
      district: district?.name || "",
      districtId: district?.code || null,
      ward: ward?.name || "",
      streetName: data.streetName || "",
    }));
    context.setStep(3);
  };

  return (
    <form
      style={{
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      onSubmit={handleSubmit(onSubmit)}
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
        ĐỊA CHỈ GIAO HÀNG
      </Typography>

      <FormControl sx={{ mb: 2, width: "100%" }} error={!!errors.city}>
        <FormLabel required>Thành phố</FormLabel>
        <Controller
          name="city"
          control={control}
          rules={{ required: "Thành phố không được bỏ trống" }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Chọn thành phố"
              onChange={(e, v) => field.onChange(v)}
            >
              <Option disabled value="">
                Chọn thành phố
              </Option>
              {cities.map((city) => (
                <Option key={city.code} value={city.code}>
                  {city.name}
                </Option>
              ))}
            </Select>
          )}
        />
        {errors.city && <FormHelperText>{errors.city.message}</FormHelperText>}
      </FormControl>

      <FormControl sx={{ mb: 2, width: "100%" }} error={!!errors.district}>
        <FormLabel required>Quận/Huyện</FormLabel>
        <Controller
          name="district"
          control={control}
          rules={{ required: "Quận/Huyện không được bỏ trống" }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Chọn quận/huyện"
              onChange={(e, v) => field.onChange(v)}
            >
              <Option disabled value="">
                Chọn quận/huyện
              </Option>
              {districts.map((district) => (
                <Option key={district.code} value={district.code}>
                  {district.name}
                </Option>
              ))}
            </Select>
          )}
        />
        {errors.district && (
          <FormHelperText>{errors.district.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl sx={{ mb: 2, width: "100%" }} error={!!errors.ward}>
        <FormLabel required>Phường/Xã</FormLabel>
        <Controller
          name="ward"
          control={control}
          rules={{ required: "Phường/Xã không được bỏ trống" }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Chọn phường/xã"
              onChange={(e, v) => field.onChange(v)}
            >
              <Option disabled value="">
                Chọn phường/xã
              </Option>
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.name}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          )}
        />
        {errors.ward && <FormHelperText>{errors.ward.message}</FormHelperText>}
      </FormControl>

      <FormControl sx={{ mb: 2, width: "100%" }} error={!!errors.streetName}>
        <FormLabel required>Địa chỉ chi tiết</FormLabel>
        <Controller
          name="streetName"
          control={control}
          rules={{ required: "Địa chỉ chi tiết không được bỏ trống" }}
          render={({ field }) => (
            <Input {...field} placeholder="Nhập địa chỉ chi tiết" />
          )}
        />
        {errors.streetName && (
          <FormHelperText>{errors.streetName.message}</FormHelperText>
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
          onClick={() => context.setStep(1)}
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

export default SignUpAddress;
