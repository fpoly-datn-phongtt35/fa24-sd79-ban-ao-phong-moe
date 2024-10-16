import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Box, Typography, TextField, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchAllCustomer, deleteCustomer, searchKeywordAndDate } from '~/apis/customerApi';
import { toast } from 'react-toastify';
import swal from 'sweetalert';

export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [loading, setLoading] = useState(false);


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSetCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetchAllCustomer(page - 1, pageSize);
      setCustomers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch customers.');
    } finally {
      setLoading(false);
    }
  };


  const handleSearchKeywordAndDate = async () => {
    try {
      setLoading(true);
      const res = await searchKeywordAndDate(keyword || '', gender || '', birth || '');
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    handleSetCustomer();
  }, [page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchKeywordAndDate();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, gender, birth]);

  const handleClear = () => {
    setKeyword('');
    setGender('');
    setBirth('');
    setPage(1);
    handleSetCustomer();
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      handleSetCustomer();
    } catch (error) {
      console.error('Failed to delete customer', error);
      swal('Error', 'Failed to delete customer', 'error');
    }
  };

  const onDelete = (id) => {
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg" className="bg-white" style={{ marginTop: '15px' }}>
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
              label="Giới tính"
              variant="standard"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Ngày sinh"
              type="date"
              variant="standard"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
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
                  <TableCell>{index + 1 + (page - 1) * pageSize}</TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                  <TableCell>{formatDate(customer.dateOfBirth)}</TableCell>
                  <TableCell>{customer.city}, {customer.district}, {customer.ward}, {customer.streetName}</TableCell>
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
                <TableCell colSpan={11}>Không có khách hàng nào được tìm thấy.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
      
    </Container>
  );
};
