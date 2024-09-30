import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { fetchAllCoupon, deleteCoupon, searchKeywordAndDate } from '~/apis/couponApi';
import {
  Container, Grid, TextField, Box, Typography, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Pagination, Stack, Select, MenuItem, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDiscountType, setFilterDiscountType] = useState('');

  useEffect(() => {
    handleSetCoupon();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchKeywordAndDate();
    }, 1000); // Add a 1s debounce for search inputs

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, startDate, endDate]);

  const handleSetCoupon = async () => {
    const res = await fetchAllCoupon();
    setCoupons(res.data);
  };

  const handleSearchKeywordAndDate = async () => {
    try {
      const res = await searchKeywordAndDate(keyword || '', startDate || '', endDate || '');
      setCoupons(res.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleClear = () => {
    // Reset all search filters
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setFilterType('');
    setFilterStatus('');
    setFilterDiscountType('');
    // Re-fetch all coupons
    handleSetCoupon();
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      handleSetCoupon();
    } catch (error) {
      console.error('Failed to delete coupon', error);
      swal('Error', 'Failed to delete coupon', 'error');
    }
  };

  const onDelete = async (id) => {
    swal({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa phiếu giảm giá này?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        handleDelete(id);
      }
    });
  };

  return (
    <Container maxWidth="max-width" className="bg-white" style={{ height: '100%', marginTop: '15px' }}>
      <Grid container spacing={2} alignItems="center" bgcolor={'#1976d2'} height={'50px'}>
        <Typography xs={4} margin={'4px'} variant="h6" gutterBottom color="#fff">
          Quản lý phiếu giảm giá
        </Typography>
      </Grid>
      <Box className="mb-5" style={{ marginTop: '50px' }}>
  {/* First row of inputs */}
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={4}>
      <TextField
        label="Tìm phiếu giảm giá"
        variant="standard"
        fullWidth
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        label="Từ ngày"
        type="date"
        variant="standard"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        size="small"
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextField
        label="Đến ngày"
        type="date"
        variant="standard"
        InputLabelProps={{ shrink: true }}
        fullWidth
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        size="small"
      />
    </Grid>
  </Grid>

  {/* Second row of inputs */}
  <Grid container spacing={2} alignItems="center" style={{ marginTop: '10px' }}>
    <Grid item xs={12} sm={4}>
      <Select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="">Kiểu</MenuItem>
        <MenuItem value="personal">Cá nhân</MenuItem>
        <MenuItem value="public">Công khai</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Select
        value={filterDiscountType}
        onChange={(e) => setFilterDiscountType(e.target.value)}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="">Loại</MenuItem>
        <MenuItem value="percentage">Phần trăm</MenuItem>
        <MenuItem value="fixed_amount">Số tiền cố định</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="">Trạng thái</MenuItem>
        <MenuItem value="Ongoing">Đang diễn ra</MenuItem>
        <MenuItem value="Ended">Kết thúc</MenuItem>
        <MenuItem value="Not Started">Chưa bắt đầu</MenuItem>
      </Select>
    </Grid>
  </Grid>

  {/* Buttons: Clear and Create New */}
  <Grid container spacing={2} style={{ marginTop: '10px' }} justifyContent="flex-end">
    <Grid item xs={6} sm={2}>
      <Button variant="outlined" color="secondary" onClick={handleClear} fullWidth size="small">
        Clear
      </Button>
    </Grid>
    <Grid item xs={6} sm={2}>
      <Button variant="contained" color="success" component={Link} to="/coupon/create" fullWidth size="small">
        + Tạo mới
      </Button>
    </Grid>
  </Grid>
</Box>


      <TableContainer component={Paper}>
        <Table aria-label="coupon table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Kiểu</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <TableRow key={coupon.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.name}</TableCell>
                  <TableCell>
                    {coupon.type === 'public' ? (
                      <PublicIcon sx={{ color: 'blue' }} titleAccess="Public Coupon" />
                    ) : coupon.type === 'personal' ? (
                      <PersonIcon sx={{ color: 'green' }} titleAccess="Personal Coupon" />
                    ) : (
                      <span>{coupon.type}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === 'percentage' ? (
                      <PercentIcon sx={{ color: 'purple' }} titleAccess="Percentage Discount" />
                    ) : coupon.discountType === 'pixed_amount' ? (
                      <AttachMoneyIcon sx={{ color: 'goldenrod' }} titleAccess="Pixed Amount Discount" />
                    ) : (
                      <span>{coupon.discountType}</span>
                    )}
                  </TableCell>
                  <TableCell>{coupon.quantity}</TableCell>
                  <TableCell>{coupon.startDate}</TableCell>
                  <TableCell>{coupon.endDate}</TableCell>
                  <TableCell>
                    <span
                      className={`badge ${coupon.status === 'Ongoing'
                        ? 'bg-success'
                        : coupon.status === 'Ended'
                          ? 'bg-danger'
                          : coupon.status === 'Not Started'
                            ? 'bg-info'
                            : ''
                        }`}
                    >
                      {coupon.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/coupon/detail/${coupon.id}`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(coupon.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>No coupons found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} marginTop={2}>
        <Pagination count={10} page={page} onChange={(e, value) => setPage(value)} />
      </Stack>
    </Container>
  );
};

export default Coupon;
