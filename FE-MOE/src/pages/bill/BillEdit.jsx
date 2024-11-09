import React from 'react';
import { Box, Typography, IconButton, Button, Input } from '@mui/joy';
import ArticleIcon from '@mui/icons-material/Article';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Step, Stepper, StepLabel, StepConnector } from '@mui/material';

const steps = [
  { label: 'Tạo đơn hàng', icon: <ArticleIcon />, time: '17:52:50 21/12/2023' },
  { label: 'Chờ giao', icon: <LocalShippingIcon />, time: '18:14:48 21/12/2023' },
  { label: 'Đang giao hàng', icon: <LocalShippingIcon />, time: '' },
  { label: 'Đã giao hàng', icon: <CheckCircleIcon />, time: '' },
];

export default function BillEdit() {
  return (
    <Box className="bill-edit" sx={{ padding: 3, maxWidth: 900, margin: 'auto' }}>
      
      {/* Stepper Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Chi tiết hóa đơn
        </Typography>
        <Stepper activeStep={1} alternativeLabel connector={<StepConnector />}>
          {steps.map((step, index) => (
            <Step key={index}>
              <IconButton size="large" color="primary" style={{ color: index <= 1 ? '#4CAF50' : '#c4c4c4' }}>
                {step.icon}
              </IconButton>
              <StepLabel>
                <Typography variant="body2">{step.label}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {step.time}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Order Information */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <Box>
          <Typography variant="h6">THÔNG TIN ĐƠN HÀNG</Typography>
          <Typography>Trạng thái: <strong>Chờ giao</strong></Typography>
          <Typography>Mã đơn hàng: HD15030032</Typography>
          <Typography>Loại đơn hàng: Giao hàng</Typography>
          <Typography>Phí vận chuyển: 38,501 ₫</Typography>
          <Typography>Tổng tiền: 200,000 ₫</Typography>
          <Typography>Phải thanh toán: 238,501 ₫</Typography>
        </Box>
        <Box>
          <Typography variant="h6">THÔNG TIN KHÁCH HÀNG</Typography>
          <Typography>Tên khách hàng: Phong</Typography>
          <Typography>Số điện thoại: 0387880000</Typography>
          <Typography>Email: DungNA29@gmail.com</Typography>
          <Typography>Địa chỉ: Số 8, Xã Tân Quang, Huyện Văn Lâm, Hưng Yên</Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Thay đổi thông tin
          </Button>
        </Box>
      </Box>

      {/* Product List */}
      <Box>
        <Typography variant="h6" gutterBottom>
          DANH SÁCH SẢN PHẨM
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <img src="/path/to/image.png" alt="Sản phẩm" style={{ width: 80, height: 80, marginRight: 16 }} />
          <Box>
            <Typography>Giày MLB Chunky Wide New York [Đen - 40]</Typography>
            <Typography variant="caption">Mã sản phẩm: WYORKDEN40CASU</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
              <Input type="number" value="2" readOnly sx={{ width: 60, marginRight: 2 }} />
              <Typography variant="body2">Tổng: 200,000 ₫</Typography>
            </Box>
          </Box>
        </Box>
        <Button variant="outlined" color="primary">
          Thêm sản phẩm
        </Button>
      </Box>
    </Box>
  );
}
