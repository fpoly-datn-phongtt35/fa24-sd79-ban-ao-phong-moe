import React, { useState } from "react";
import { Container, Sheet, Typography, Input, Button, Grid, Select, Option, FormControl, FormLabel, Breadcrumbs, Link, Box, Radio, RadioGroup, Avatar } from "@mui/joy";

import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { toast } from "react-toastify";
import HomeIcon from "@mui/icons-material/Home";

export const EmployeeMe = () => {


    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Grid sx={{ mb: 2 }}>
            <Sheet variant="outlined" sx={{ display: 'flex', flexDirection: 'column', borderRadius: 'md' }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ ml: "5px" }}>
                <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Trang chủ
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate("/EmployeeMe")}>
                  Thông Tin Tài Khoản
                </Link>
              </Breadcrumbs>
            </Sheet>
          </Grid>
    
          <Grid container spacing={2}>    
            <Grid xs={12} md={9}>
              <Box p={0}>
                {/* <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off"> */}
                <Box component="form" noValidate autoComplete="off">
                  <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md' }}>
                    <Typography level="h5" fontWeight="lg" gutterBottom>THÔNG TIN TÀI KHOẢN</Typography>
    
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar
                            // src={imagePreview || '/placeholder-image.png'}
                            // alt="User Image"
                            // sx={{ width: 150, height: 150 }}
                            // variant="solid"
                          />
                          {/* <Button disabled={isLoading} variant="outlined" component="label" sx={{ mt: 2 }}> */}
                            Chọn Ảnh
                            {/* <input type="file" accept="image/*" hidden onChange={handleImageChange} /> */}
                          {/* </Button> */}
                        </Box>
                      </Grid>
    
                      <Grid xs={12} sm={8}>
                        <Grid spacing={2}>
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel required>Họ</FormLabel>
                              {/* <Input
                                value={accountData.lastName}
                                name="lastName"
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                sx={{
                                  border: `1px solid ${errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                                  '&:hover:not(.Mui-disabled):before': { borderColor: errors.lastName ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                                  '&.Mui-focused': { borderColor: errors.lastName ? 'red' : 'primary.main' },
                                }}
                              />
                              {errors.lastName && (
                                <Typography color="danger" variant="body2">{errors.lastName}</Typography>
                              )} */}
                            </FormControl>
                          </Grid>
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel required>Tên</FormLabel>
                              {/* <Input
                                placeholder="Nhập tên"
                                value={accountData.firstName}
                                name="firstName"
                                onChange={handleChange}
                                sx={{
                                  border: `1px solid ${errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                                  '&:hover:not(.Mui-disabled):before': { borderColor: errors.firstName ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                                  '&.Mui-focused': { borderColor: errors.firstName ? 'red' : 'primary.main' },
                                }}
                              />
                              {errors.firstName && (
                                <Typography color="danger" variant="body2">{errors.firstName}</Typography>
                              )} */}
                            </FormControl>
                          </Grid>
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel required>Điện thoại</FormLabel>
                              {/* <Input
                                placeholder="Nhập điện thoại"
                                value={accountData.phoneNumber}
                                name="phoneNumber"
                                onChange={handleChange}
                                sx={{
                                  border: `1px solid ${errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                                  '&:hover:not(.Mui-disabled):before': { borderColor: errors.phoneNumber ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                                  '&.Mui-focused': { borderColor: errors.phoneNumber ? 'red' : 'primary.main' },
                                }}
                              />
                              {errors.phoneNumber && (
                                <Typography color="danger" variant="body2">{errors.phoneNumber}</Typography>
                              )} */}
                            </FormControl>
                          </Grid>
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel required>Email</FormLabel>
                              {/* <Input
                                placeholder="Nhập email"
                                value={accountData.email}
                                name="email"
                                onChange={handleChange}
                                sx={{
                                  border: `1px solid ${errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)'}`,
                                  '&:hover:not(.Mui-disabled):before': { borderColor: errors.email ? 'red' : 'rgba(0, 0, 0, 0.23)' },
                                  '&.Mui-focused': { borderColor: errors.email ? 'red' : 'primary.main' },
                                }}
                              />
                              {errors.email && (
                                <Typography color="danger" variant="body2">{errors.email}</Typography>
                              )} */}
                            </FormControl>
                          </Grid>
    
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel>Giới tính</FormLabel>
                              {/* <RadioGroup>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Radio
                                    label="Nam"
                                    checked={accountData.gender === 'MALE'}
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
                                    checked={accountData.gender === 'FEMALE'}
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
                                    checked={accountData.gender === 'OTHER'}
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
                                  <Typography color="danger" variant="body2">{errors.gender}</Typography>
                                )}
                              </RadioGroup> */}
                            </FormControl>
                          </Grid>
    
                          <Grid xs={12} mb={2}>
                            <FormControl>
                              <FormLabel required>Ngày sinh</FormLabel>
                              {/* <Input
                                name="dateOfBirth"
                                value={accountData.dateOfBirth}
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
                                <Typography color="danger" variant="body2">{errors.dateOfBirth}</Typography>
                              )} */}
                            </FormControl>
                          </Grid>
    
                          <Grid xs={6} sx={{ marginTop: 1 }}>
                            {/* <Button loading={isLoading} variant="soft" type="submit" color='primary' sx={{ marginRight: 1 }}>
                              Cập Nhật Người Dùng
                            </Button> */}
                            <Button>
                            Cập Nhật Người Dùng
                            </Button>
                            {/* <Button variant="soft" color="danger" onClick={() => navigate("/")}>
                              Hủy
                            </Button> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Sheet>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      );
    
};
export default EmployeeMe;

