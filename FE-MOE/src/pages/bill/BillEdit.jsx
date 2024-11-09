import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, Stepper } from '@mui/joy';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import ContactsRoundedIcon from '@mui/icons-material/ContactsRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import StepIndicator, { stepIndicatorClasses } from '@mui/joy/StepIndicator';
import Step, { stepClasses } from '@mui/joy/Step';
import { getBillEdit } from '~/apis/billListApi';
import PrintIcon from '@mui/icons-material/Print';
import { Button } from '@mui/material';

export default function BillEdit() {
  const { id } = useParams();
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBillEdit = async () => {
      const bill = await getBillEdit(id);
      console.log(bill.data)
      setBillData(bill.data);
    };
    fetchBillEdit();
  }, [id]);

  const statusMap = {
    '2': 'Chờ xác nhận',
    '4': 'Chờ giao',
    '3': 'Hoàn thành',
    '7': 'Đã hủy',
  };

  return (
    <Container maxWidth="max-Width" style={{ backgroundColor: 'white', height: '100%', marginTop: '15px' }}>
      {/* Order Status */}
      <Box display="flex" flexDirection="column" alignItems="start">
        {billData?.map((bd) => (
          <Typography key={bd.id || bd.code} variant="h6" style={{ marginBottom: '20px' }}>
            <span style={{ color: '#ae4f0c' }}>Danh sách hóa đơn</span> / Hóa đơn: {bd.code}
          </Typography>
        ))}
        <Stepper
          size="lg"
          sx={{
            width: '100%',
            '--StepIndicator-size': '3rem',
            '--Step-connectorInset': '0px',
            [`& .${stepIndicatorClasses.root}`]: {
              borderWidth: 4,
            },
            [`& .${stepClasses.root}::after`]: {
              height: 4,
            },
            [`& .${stepClasses.completed}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                borderColor: 'primary.300',
                color: 'primary.300',
              },
              '&::after': {
                bgcolor: 'primary.300',
              },
            },
            [`& .${stepClasses.active}`]: {
              [`& .${stepIndicatorClasses.root}`]: {
                borderColor: 'currentColor',
              },
            },
            [`& .${stepClasses.disabled} *`]: {
              color: 'neutral.outlinedDisabledColor',
            },
          }}
        >
          <Step
            completed
            orientation="vertical"
            indicator={
              <StepIndicator variant="outlined" color="primary">
                <ShoppingCartRoundedIcon />
              </StepIndicator>
            }
          />
          <Step
            orientation="vertical"
            completed
            indicator={
              <StepIndicator variant="outlined" color="primary">
                <ContactsRoundedIcon />
              </StepIndicator>
            }
          />
          <Step
            orientation="vertical"
            completed
            indicator={
              <StepIndicator variant="outlined" color="primary">
                <LocalShippingRoundedIcon />
              </StepIndicator>
            }
          />
          <Step
            orientation="vertical"
            active
            indicator={
              <StepIndicator variant="solid" color="primary">
                <CreditCardRoundedIcon />
              </StepIndicator>
            }
          >
            <Typography
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'lg',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}
            >
              Payment and Billing
            </Typography>
          </Step>
          <Step
            orientation="vertical"
            disabled
            indicator={
              <StepIndicator variant="outlined" color="neutral">
                <CheckCircleRoundedIcon />
              </StepIndicator>
            }
          />
        </Stepper>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={2} marginTop="20px">
        <div>
          <Button variant="contained" color="error">Hủy</Button>
          <Button variant="contained" style={{ backgroundColor: '#0D47A1', color: 'white' }}>Giao hàng</Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="error"
            startIcon={<PrintIcon />}
          >
            In Hóa Đơn
          </Button>

          <Button variant="contained" style={{ backgroundColor: '#0D47A1', color: 'white' }}>Chi tiết</Button>
        </div>
      </Box>
      {/* Thông tin đơn hàng */}
      <hr />

      <Box mb={4}>
        <Typography variant="h5" style={{ color: 'red', fontWeight: 'bold' }}>THÔNG TIN ĐƠN HÀNG</Typography>
        {billData?.map((bd) => (
          <Box key={bd.id || bd.code} display="flex" justifyContent="space-between" mt={2}>
            <Box>
              <Typography>Trạng thái: <span style={{ color: 'red' }}>{statusMap[bd?.status] || '#'}</span></Typography>
              <Typography>Mã đơn hàng: {bd?.orderCode || 'HD15030032'}</Typography>
              <Typography>Loại thanh toán: <span style={{ color: 'red' }}>{bd?.paymentMethod || '#'}</span></Typography>
            </Box>
            <Box textAlign="right">
              <Typography>Phí vận chuyển: {bd?.shipping || 'free'}</Typography>
              <Typography>Tổng tiền: {bd?.subtotal || ''}</Typography>
              <Typography>Phải thanh toán: {bd?.total || ''}</Typography>
            </Box>
          </Box>
        ))}
      </Box>


      {/* Thông tin khách hàng */}
      <hr />
      {billData?.map((bd) => (
        <Box mb={4}>
          <Typography variant="h5" style={{ color: 'red', fontWeight: 'bold' }}>THÔNG TIN KHÁCH HÀNG</Typography>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" style={{ backgroundColor: '#FFD700', color: 'black' }}>Thay đổi thông tin</Button>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box>
              <Typography>Tên khách hàng: {bd?.customer?.lastName}  {bd?.customer?.firstName}</Typography>
              <Typography>Số điện thoại: {bd?.phone || '0387880000'}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography>Email: {bd?.customer?.user?.email}</Typography>
              <Typography>
                Địa chỉ: {bd?.customer?.customerAddress?.streetName}-{bd?.customer?.customerAddress?.ward}-{bd?.customer?.customerAddress?.district}-{bd?.customer?.customerAddress?.city}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}

      {/* Lịch sử thanh toán */}
      {/* Danh sách sản phẩm */}
    </Container>
  );
}
