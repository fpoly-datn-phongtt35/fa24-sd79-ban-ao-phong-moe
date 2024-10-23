import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Typography, Grid, IconButton } from '@mui/joy';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <Grid container spacing={2}>
      {/* Phần Thông tin liên hệ */}
      <Grid item xs={12} sm={4}>
        <Box sx={{ padding: 2, border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <Typography level="h6" startDecorator={<PhoneIcon />} sx={{ marginBottom: 2 }}>
            Gọi cho chúng tôi
          </Typography>
          <Typography level="body2">Chúng tôi hoạt động 24/7, 7 ngày trong tuần.</Typography>
          <Typography level="body2" sx={{ fontWeight: 'bold' }}>
            Điện thoại: 1004
          </Typography>

          <hr style={{ margin: '16px 0' }} />

          <Typography level="h6" startDecorator={<EmailIcon />} sx={{ marginBottom: 2 }}>
            Viết thư cho chúng tôi
          </Typography>
          <Typography level="body2">
            Điền vào form và chúng tôi sẽ liên hệ lại trong vòng 24 giờ.
          </Typography>
          <Typography level="body2" sx={{ fontWeight: 'bold' }}>
            Email: supportmoestore@moe.vn
          </Typography>
        </Box>
      </Grid>

      {/* Phần form liên hệ */}
      <Grid item xs={12} sm={8}>
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl required>
                <FormLabel>Tên của bạn</FormLabel>
                <Input
                  placeholder="Nhập tên của bạn"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl required>
                <FormLabel>Email của bạn</FormLabel>
                <Input
                  placeholder="Nhập email của bạn"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl required>
                <FormLabel>Số điện thoại của bạn</FormLabel>
                <Input
                  placeholder="Nhập số điện thoại của bạn"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <FormLabel>Lời nhắn của bạn</FormLabel>
                <Textarea
                  placeholder="Nhập lời nhắn"
                  minRows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  sx={{ marginBottom: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" color="primary" variant="solid" fullWidth>
                Gửi lời nhắn
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
