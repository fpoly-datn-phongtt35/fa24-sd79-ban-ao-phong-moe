import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Sheet, Typography, Input, Button, Grid, Select, Option, FormControl, FormLabel, Breadcrumbs, Link, Box, Radio, RadioGroup, Avatar } from "@mui/joy";
import HomeIcon from "@mui/icons-material/Home";

export const AccountInfo = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageObject, setImageObject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Grid sx={{ mb: 2 }}>
        <Sheet
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 'md',

          }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ ml: "5px" }}>
            <Link disabled underline="hover" color="inherit" onClick={() => navigate("/")}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Trang chủ
            </Link>
            <Link disabled underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
              Tài khoản
            </Link>
            <Link disabled underline="hover" color="inherit" onClick={() => navigate("/my-account")}>
              Thông Tin Tài Khoản
            </Link>
          </Breadcrumbs>
        </Sheet>
      </Grid>

      <Grid container spacing={2}>
        <Grid xs={12} md={3}>
          <Sheet
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              p: 2,
              borderRadius: 'md',
            }}
          >
            <Typography level="h6" color="primary" fontWeight="lg">Thông tin tài khoản</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Tích lũy điểm</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Chia sẻ</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Đổi quà</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Quản lý đơn hàng</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Sổ địa chỉ</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Sản phẩm bạn đã xem</Typography>
            <Typography variant="body1" sx={{ cursor: 'pointer' }}>Đổi mật khẩu</Typography>
          </Sheet>
        </Grid>

        
        <Grid xs={12} md={9}>
          <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md' }}>
            <Typography level="h5" fontWeight="lg" gutterBottom>THÔNG TIN TÀI KHOẢN</Typography>

            <Grid container spacing={2}>
             
              <Grid xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    src={imagePreview || '/placeholder-image.png'}
                    alt="User Image"
                    sx={{ width: 150, height: 150 }}
                    variant="solid"
                  />
                  <Button disabled={isLoading}
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2 }}
                  >
                    Chọn Ảnh
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Form Fields */}
              <Grid xs={12} sm={8}>
                <form noValidate autoComplete="off">
                  <Grid container spacing={2}>
                    <Grid xs={12}>
                      <FormControl >
                        <FormLabel required>Họ</FormLabel>
                        <Input placeholder="Nhập họ" required />
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <FormControl >
                        <FormLabel required>Tên</FormLabel>
                        <Input placeholder="Nhập tên" required />
                      </FormControl>
                    </Grid>

                    <Grid xs={12}>
                      <FormControl >
                        <FormLabel required>Điện thoại</FormLabel>
                        <Input placeholder="Nhập điện thoại" required />
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <FormControl >
                        <FormLabel required>Email</FormLabel>
                        <Input placeholder="Nhập email" required />
                      </FormControl>
                    </Grid>

                    <Grid xs={6}>
                      <FormControl >
                        <FormLabel>Giới tính</FormLabel>
                        <RadioGroup >
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Radio
                              label="Nam"
                              value="MALE"
                              name="gender"
                            />
                            <Radio
                              label="Nữ"
                              value="FEMALE"
                              name="gender"
                            />
                            <Radio
                              label="Khác"
                              value="OTHER"
                              name="gender"
                            />

                          </Box>
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid xs={6}>
                      <FormControl >
                        <FormLabel required>Ngày sinh</FormLabel>
                        <Input type="date" required />
                      </FormControl>
                    </Grid>

                    <Grid xs={12}>
                      <Button variant="solid" color="warning" fullWidth sx={{ fontWeight: 'bold' }}>
                        CẬP NHẬT
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Sheet>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AccountInfo;
