import {
  Container, Grid, Box, Typography, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { fetchAllCustomer, deleteCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  useEffect(() => {
    handleSetCustomer();
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchKeywordAndDate();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, startDate, endDate]);

  const handleSetCustomer = async () => {
    try {
      const response = await fetchAllCustomer();
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to fetch customers.');
    }
  };
  const handleSearchKeywordAndDate = async () => {
    try {
      const res = await searchKeywordAndDate(keyword || '', startDate || '', endDate || '');
      setCustomers(res.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  const handleClear = () => {

    setKeyword('');
    setStartDate('');
    setEndDate('');


    handleSetCoupon();
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      await handleSetCustomer();
      // handleSetCustomer;
    } catch (error) {
      console.error('Failed to delete customer', error);
      swal('Error', 'Failed to delete customer', 'error');
    }
  };

  const onDelete = async (id) => {
    swal({
      title: 'Xác nhận xóa',
      text: 'Bạn có chắc chắn muốn xóa khách hàng này?',
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
          Quản lý khách hàng
        </Typography>
      </Grid>
      <Box className="mb-5" style={{ marginTop: '50px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Tìm kiếm"
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
        
 
        <Grid container spacing={2} style={{ marginTop: '10px' }} justifyContent="flex-end">
        <Grid item xs={6} sm={2}>
      <Button variant="outlined" color="secondary" onClick={handleClear} fullWidth size="small">
        Clear
      </Button>
    </Grid>
          <Grid item xs={6} sm={2}>
            <Button variant="contained" color="success" component={Link} to="/customer/add" fullWidth size="small">
              + Tạo mới
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="customer table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Họ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                  <TableCell>{customer.dateOfBirth}</TableCell>
                  <TableCell>{customer.customerAddress}</TableCell>
                  <TableCell>{customer.image}</TableCell>
                  <TableCell>{customer.createdAt}</TableCell>
                  <TableCell>{customer.updatedAt}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/customer/${customer.id}`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(customer.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10}>No customer found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
