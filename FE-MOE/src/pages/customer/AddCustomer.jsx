import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Typography, Paper, Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import { postCustomer, postcustomerImage } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Button, FormControl, FormLabel, Input, Link, Option, Radio, RadioGroup, Select } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";
import axios from 'axios';

const host = "https://provinces.open-api.vn/api/";

export const AddCustomer = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    email: '',
    password: '',
    username: '',
  });

  const validateForm = () => {
    const specialCharRegex = /^[a-zA-ZÀ-ỹ]+( [a-zA-ZÀ-ỹ]+)*$/;
    const phoneRegex = /^0\d{9,11}$/;
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    const passwordRegex = /^[^\s]{6,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const minAge = 16;
  
    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };
  
    const newErrors = {
      lastName: customerData.lastName
        ? customerData.lastName.length > 20
          ? "Họ không được vượt quá 20 ký tự"
          : !specialCharRegex.test(customerData.lastName)
          ? "Họ chỉ được chứa chữ cái và dấu tiếng Việt"
          : ""
        : "Họ không được để trống",
  
      firstName: customerData.firstName
        ? customerData.firstName.length > 50
          ? "Tên không được vượt quá 50 ký tự"
          : !specialCharRegex.test(customerData.firstName)
          ? "Tên chỉ được chứa chữ cái và dấu tiếng Việt"
          : ""
        : "Tên không được để trống",
  
      phoneNumber: customerData.phoneNumber
        ? phoneRegex.test(customerData.phoneNumber)
          ? ""
          : "Số điện thoại không hợp lệ"
        : "Số điện thoại không được để trống",
  
      gender: customerData.gender ? "" : "Phải chọn giới tính",
  
      dateOfBirth: customerData.dateOfBirth
        ? calculateAge(customerData.dateOfBirth) >= minAge
          ? ""
          : "Phải trên 16 tuổi"
        : "Phải chọn ngày sinh",
  
      email: customerData.email
        ? emailRegex.test(customerData.email)
          ? ""
          : "Email không đúng định dạng"
        : "Email không được để trống",
  
      username: customerData.username
        ? usernameRegex.test(customerData.username)
          ? ""
          : "Tên tài khoản phải từ 3-20 ký tự và không chứa ký tự đặc biệt"
        : "Tên tài khoản không được để trống",
  
      password: customerData.password
        ? passwordRegex.test(customerData.password)
          ? ""
          : "Mật khẩu phải từ 6 đến 50 ký tự và không chứa khoảng trắng"
        : "Mật khẩu không được để trống",
    };
  
    setErrors(newErrors);
     
    return Object.values(newErrors).every((error) => error === "");
  };

  useEffect(() => {
    const fetchCities = async () => {
      const response = await axios.get(`${host}?depth=1`);
      setCities(response.data);
    };
    fetchCities();
  }, []);

  const handleCityChange = async (e) => {
    const cityId = e;
    setSelectedCity(cityId);
    setSelectedDistrict("");
    setSelectedWard("");
    if (cityId) {
      const response = await axios.get(`${host}p/${cityId}?depth=2`);
      setDistricts(response.data.districts);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    if (districtId) {
      const response = await axios.get(`${host}d/${districtId}?depth=2`);
      setWards(response.data.wards);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e);
  };


  const formatDate = (dateString, time = "00:00:00") => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} | ${time}`;
  };

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    customerAddress: '',
    image: 'null',
    address: [{
      city: '',
      district: '',
      ward: '',
      streetName: ''
    }],
    user: [{
      email: '',
      password: '',
      username: ''
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', 
    }));
  
  
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const confirm = await swal({
      title: 'Xác nhận thêm khách hàng',
      text: 'Bạn có chắc chắn muốn thêm khách hàng này?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    });
  
    if (!confirm) {
      return; // Nếu người dùng chọn "Hủy", không thực hiện hành động.
    }
  
    const currentDate = new Date().toISOString();
  
    const cityName = cities.find((city) => city.code == selectedCity)?.name;
    const districtName = districts.find((district) => district.code == selectedDistrict)?.name;
    const wardName = wards.find((ward) => ward.name == selectedWard)?.name;
  
    const customerWithTimestamps = {
      ...customerData,
      city: cityName,
      city_id: selectedCity,
      district: districtName,
      district_id: selectedDistrict,
      ward: wardName,
      dateOfBirth: formatDate(customerData.dateOfBirth),
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  
    try {
      setIsLoading(true);
  
      const res = await postCustomer(customerWithTimestamps);
  
      if (imageObject === null) {
        toast.success('Thêm thành công');
        setIsLoading(false);
        navigate('/customer');
        return;
      }
  
      const formData = new FormData();
      formData.append("images", imageObject);
      formData.append("productId", res);
  
      await postcustomerImage(formData);
  
      toast.success('Thêm thành công');
      setIsLoading(false);
      navigate('/customer');
    } catch (error) {
      setIsLoading(false);
      toast.error('Có lỗi xảy ra khi thêm khách hàng');
    }
  };
  
  

  const handleImageChange = (event) => {
    var file = event.target.files[0];
    var url = URL.createObjectURL(file)
    setImagePreview(url)
    setImageObject(file)
  }

  return (
    <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px" }}>
      <Box mt={4} mb={4}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          marginBottom={2}
          height={"50px"}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
            <Link
              disabled={isLoading}
              underline="hover"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              color="inherit"
              onClick={() => navigate("/")}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Trang chủ
            </Link>
            <Link
              disabled={isLoading}
              underline="hover"
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              color="inherit"
              onClick={() => navigate("/customer")}
            >
              Quản lý khách hàng
            </Link>
            <Typography sx={{ color: "text.white", cursor: "pointer" }}>
              Thêm khách hàng
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Paper elevation={3}>
          <Box p={4}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      src={imagePreview || '/placeholder-image.png'}
                      alt="User Image"
                      sx={{ width: 150, height: 150 }}
                    />
                    <Button
                      variant="soft"
                      component="label"
                      color='primary'
                      sx={{ mt: 2 }}
                      disabled={isLoading}
                    >
                      Chọn Ảnh
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl error={!!errors.lastName}>
                        <FormLabel required>Họ</FormLabel>
                        <Input
                          value={customerData.lastName}
                          name="lastName"
                          onChange={handleChange}
                          placeholder='Họ'
                          sx={{
                            border: `1px solid ${errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.lastName ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.lastName && (
                          <Typography color="error" variant="body2">{errors.lastName}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl error={!!errors.firstName}>
                        <FormLabel required>Tên</FormLabel>
                        <Input
                          value={customerData.firstName}
                          name="firstName"
                          onChange={handleChange}
                          placeholder='Tên'
                          sx={{
                            border: `1px solid ${errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.firstName ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.firstName && (
                          <Typography color="error" variant="body2">{errors.firstName}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Tên tài khoản</FormLabel>
                        <Input
                          value={customerData.user.username}
                          name="username"
                          onChange={handleChange}
                          placeholder='Tên tài khoản'
                          sx={{
                            border: `1px solid ${errors.username ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.username ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.username ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.username && (
                          <Typography color="error" variant="body2">{errors.username}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Mật Khẩu</FormLabel>
                        <Input
                          value={customerData.user.password}
                          name="password"
                          type="password"
                          onChange={handleChange}
                          placeholder='Mật Khẩu'
                          sx={{
                            border: `1px solid ${errors.password ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.password ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.password ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.password && (
                          <Typography color="error" variant="body2">{errors.password}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl >
                        <FormLabel required>Email</FormLabel>
                        <Input
                          value={customerData.user.email}
                          name="email"
                          onChange={handleChange}
                          placeholder='Email'
                          type="email"
                          sx={{
                            border: `1px solid ${errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.email ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.email && (
                          <Typography color="error" variant="body2">{errors.email}</Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Số Điện Thoại</FormLabel>
                        <Input
                          value={customerData.phoneNumber}
                          name="phoneNumber"
                          onChange={handleChange}
                          placeholder='Số Điện Thoại'
                          sx={{
                            border: `1px solid ${errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.phoneNumber ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.phoneNumber && (
                          <Typography color="error" variant="body2">{errors.phoneNumber}</Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Giới tính</FormLabel>
                        <RadioGroup >
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Radio
                              label="Nam"
                              checked={customerData.gender === 'MALE'}
                              onChange={handleChange}
                              value="MALE"
                              name="gender"
                              sx={{
                                color: errors.gender ? 'red' : 'default',
                                '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                              }}
                            />
                            <Radio
                              label="Nữ"
                              checked={customerData.gender === 'FEMALE'}
                              onChange={handleChange}
                              value="FEMALE"
                              name="gender"
                              sx={{
                                color: errors.gender ? 'red' : 'default',
                                '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                              }}
                            />
                            <Radio
                              label="Khác"
                              checked={customerData.gender === 'OTHER'}
                              onChange={handleChange}
                              value="OTHER"
                              name="gender"
                              sx={{
                                color: errors.gender ? 'red' : 'default',
                                '&.Mui-checked': { color: errors.gender ? 'red' : 'primary.main' },
                              }}
                            />

                          </Box>
                          {errors.gender && (
                            <Typography color="error" variant="body2">{errors.gender}</Typography>
                          )}
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Ngày sinh</FormLabel>
                        <Input
                          name="dateOfBirth"
                          value={customerData.dateOfBirth}
                          onChange={handleChange}
                          placeholder='Ngày sinh'
                          type='date'
                          sx={{
                            border: `1px solid ${errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                            '&:hover:not(.Mui-disabled):before': {
                              borderColor: errors.dateOfBirth ? 'red' : 'rgba(0, 0, 0, 0.23)',
                            },
                            '&.Mui-focused': {
                              borderColor: errors.dateOfBirth ? 'red' : 'primary.main',
                            },
                          }}
                        />
                        {errors.dateOfBirth && (
                          <Typography color="error" variant="body2">{errors.dateOfBirth}</Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel >Thành phố</FormLabel>
                        <Select onChange={(e, v) => handleCityChange(v)} placeholder="Chọn thành phố">
                          <Option value="" disabled>
                            Chọn tỉnh thành
                          </Option>
                          {cities.map((city) => (
                            <Option key={city.code} value={city.code}>
                              {city.name}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel >Quận/Huyện</FormLabel>
                        <Select value={selectedDistrict}
                          onChange={(e, v) => handleDistrictChange(v)}
                          placeholder="Chọn quận huyện">
                          <Option value="" disabled>
                            Chọn quận huyện
                          </Option>
                          {districts.map((district) => (
                            <Option key={district.code} value={district.code}>
                              {district.name}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel >Phường/Xã</FormLabel>
                        <Select value={selectedWard} onChange={(e, v) => handleWardChange(v)}
                          placeholder="Chọn phường xã">
                          <Option value="" disabled>
                            Chọn phường xã
                          </Option>
                          {wards.map((ward) => (
                            <Option key={ward.code} value={ward.name}>
                              {ward.name}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>Tên đường</FormLabel>
                        <Input
                          name="streetName"
                          value={customerData.address.streetName}
                          placeholder='Tên đường'
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} sx={{ marginTop: 1 }}>
                    <Button loading={isLoading} variant="soft" type="submit" color="primary" sx={{ marginRight: 1 }}>
                      Thêm khách hàng
                    </Button>
                    <Button variant="soft" type="submit" color="danger" onClick={() => navigate("/customer")}>
                      Hủy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
