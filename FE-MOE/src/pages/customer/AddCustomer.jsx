import React, { useState } from 'react';
import { Container, Box, Grid, Typography, Paper, Avatar } from '@mui/material';
import { toast } from 'react-toastify';
import { postCustomer, postcustomerImage } from '~/apis/customerApi';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Button, FormControl, FormLabel, Input, Link, Radio, RadioGroup } from '@mui/joy';
import HomeIcon from "@mui/icons-material/Home";

export const AddCustomer = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    if (name === 'gender') {
      setCustomerData({ ...customerData, gender: value });
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();

    const customerWithTimestamps = {
      ...customerData,
      dateOfBirth: formatDate(customerData.dateOfBirth),
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    try {
      setIsLoading(true);
      await postCustomer(customerWithTimestamps)
        .then(async (res) => {
          if (imageObject === null) {
            toast.success('Thêm thành công');
            setIsLoading(false);
            navigate('/customer');
            return;
          }
          const formData = new FormData();
          formData.append("images", imageObject)
          formData.append("productId", res)
          await postcustomerImage(formData).then(() => {
            toast.success('Thêm thành công');
            setIsLoading(false);
            navigate('/customer');
          })
        });
    } catch (error) {
      setIsLoading(false);
      toast.error('Thêm thất bại!');
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
                      <FormControl>
                        <FormLabel required>Họ</FormLabel>
                        <Input
                          value={customerData.lastName}
                          name="lastName"
                          onChange={handleChange}
                          placeholder='Họ'
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Tên</FormLabel>
                        <Input
                          value={customerData.firstName}
                          name="firstName"
                          onChange={handleChange}
                          placeholder='Tên'
                        />
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
                        />
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
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Email</FormLabel>
                        <Input
                          value={customerData.user.email}
                          name="email"
                          onChange={handleChange}
                          placeholder='Email'
                          type="email"
                        />
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
                        />
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
                            />
                            <Radio
                              label="Nữ"
                              checked={customerData.gender === 'FEMALE'}
                              onChange={handleChange}
                              value="FEMALE"
                              name="gender"
                            />
                            <Radio
                              label="Khác"
                              checked={customerData.gender === 'OTHER'}
                              onChange={handleChange}
                              value="OTHER"
                              name="gender"
                            />

                          </Box>

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
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Thành phố</FormLabel>
                        <Input
                          name="city"
                          value={customerData.address.city}
                          placeholder='Thành phố'
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Quận/Huyện</FormLabel>
                        <Input
                          name="district"
                          value={customerData.address.district}
                          placeholder='Quận/Huyện'
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Phường/Xã</FormLabel>
                        <Input
                          name="ward"
                          value={customerData.address.ward}
                          placeholder='Phường/Xã'
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel required>Tên đường</FormLabel>
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
                      Thêm Người Dùng
                    </Button>
                    <Button disabled={isLoading} variant="soft" type="submit" color="danger" onClick={() => navigate("/customer")}>
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
