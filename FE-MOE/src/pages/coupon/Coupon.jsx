import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { fetchAllCoupon, deleteCoupon, searchKeywordAndDate } from '~/apis/couponApi';
import {
  Container, Grid, TextField, Box, Typography, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Pagination, Stack, Select, MenuItem, Button, TableSortLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]); // Initialize as an empty array
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5); // Default page size
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  useEffect(() => {
    handleSearchKeywordAndDate(page, size);
  }, [page, size, order, orderBy]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchKeywordAndDate();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, startDate, endDate, discountType, type, status]);


  const handleSetCoupon = async () => {
    const res = await fetchAllCoupon();
    setCoupons(res.data.content); // Lấy danh sách coupon từ 'content'
    setTotalPages(res.data.totalPages); // Đặt giá trị tổng số trang
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Update current page
    handleSearchKeywordAndDate(value, size); // Call API with the updated page
  };

  // Cập nhật hàm tìm kiếm, phân trang, và sắp xếp
  const handleSearchKeywordAndDate = async (currentPage = page, currentSize = size, currentOrderBy = orderBy, currentOrder = order) => {
    try {
        const res = await searchKeywordAndDate(
            keyword || '',
            startDate || '',
            endDate || '',
            discountType || '',
            type || '',
            status || '',
            currentPage,
            currentSize,
            currentOrderBy,
            currentOrder
        );

        if (res && res.data) {
            setCoupons(res.data.content || []); // Use empty array if content is undefined
            setTotalPages(res.data.totalPages || 0);
            setTotalElements(res.data.totalElements || 0);
        } else {
            setCoupons([]); // In case of unexpected response
        }
    } catch (error) {
        console.error('Error during search:', error);
        setCoupons([]); // Ensure coupons is an array on error
    }
};


  // Hàm thay đổi kích thước trang
  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    setSize(newSize);  // Cập nhật kích thước trang
    setPage(1);  // Reset về trang 1
    handleSearchKeywordAndDate(1, newSize);  // Gọi API với kích thước mới
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    handleSearchKeywordAndDate(page, size, property, newOrder);
};


  const handleClear = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setDiscountType('');
    setType('');
    setStatus('');
    setPage(1);
    setOrder('asc'); // Reset order to ascending
    setOrderBy('');  // Reset orderBy to no specific sorting
    handleSearchKeywordAndDate(1, size);
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
        {/* First row: Search, Start Date, End Date, Clear */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Tìm phiếu giảm giá"
              variant="standard"
              fullWidth
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="small"
              style={{ minHeight: '40px' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Từ ngày"
              type="date"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              style={{ minHeight: '40px' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Đến ngày"
              type="date"
              variant="standard"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              style={{ minHeight: '40px' }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="success"
              onClick={handleClear}
              component={Link}
              to="/coupon/create"
              fullWidth
              size="small"
              style={{ height: '40px' }}
            >
              Thêm mới
            </Button>
          </Grid>
        </Grid>

        {/* Second row: Kiểu, Loại, Trạng thái, Thêm mới */}
        <Grid container spacing={2} alignItems="center" style={{ marginTop: '10px' }}>
          <Grid item xs={12} sm={3}>
            <Select
              value={discountType}
              onChange={(e) => {
                setDiscountType(e.target.value);
                handleSearchKeywordAndDate();
              }}
              displayEmpty
              fullWidth
              size="small"
              style={{ height: '40px' }}
            >
              <MenuItem value="">Loại</MenuItem>
              <MenuItem value="percentage">Phần trăm</MenuItem>
              <MenuItem value="fixed_amount">Số tiền cố định</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              style={{ height: '40px' }}
            >
              <MenuItem value="">Kiểu</MenuItem>
              <MenuItem value="personal">Cá nhân</MenuItem>
              <MenuItem value="public">Công khai</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
              fullWidth
              size="small"
              style={{ height: '40px' }}
            >
              <MenuItem value="">Trạng thái</MenuItem>
              <MenuItem value="Bắt đầu">Bắt đầu</MenuItem>
              <MenuItem value="Kết thúc">Kết thúc</MenuItem>
              <MenuItem value="C.Bắt đầu">Chưa bắt đầu</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClear}
              fullWidth
              size="small"
              style={{ height: '40px' }}
            >
              Xóa lọc
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'} // Set the direction based on current state
                      onClick={() => handleRequestSort('name')}
                    >
                      Tên phiếu giảm giá
                    </TableSortLabel>

                  </TableCell>
                  <TableCell align="left">
                    <TableSortLabel
                      active={orderBy === 'code'}
                      direction={orderBy === 'code' ? order : 'asc'}
                      onClick={() => handleRequestSort('code')}
                    >
                      Mã
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="left">
                    <TableSortLabel
                      active={orderBy === 'quantity'}
                      direction={orderBy === 'quantity' ? order : 'asc'}
                      onClick={() => handleRequestSort('quantity')}
                    >
                      Số lượng
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="left">Loại</TableCell>
                  <TableCell align="left">Kiểu</TableCell>
                  <TableCell align="left">Trạng thái</TableCell>
                  <TableCell align="left">
                    <TableSortLabel
                      active={orderBy === 'startDate'}
                      direction={orderBy === 'startDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('startDate')}
                    >
                      Bắt đầu
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="left">
                    <TableSortLabel
                      active={orderBy === 'endDate'}
                      direction={orderBy === 'endDate' ? order : 'asc'}
                      onClick={() => handleRequestSort('endDate')}
                    >
                      Kết thúc
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>{coupon.name}</TableCell>
                    <TableCell align="left">{coupon.code}</TableCell>
                    <TableCell align="left">{coupon.quantity}</TableCell>
                    <TableCell align="left">
                      {coupon.discountType === 'percentage' ? <PercentIcon /> : <AttachMoneyIcon />}
                    </TableCell>
                    <TableCell align="left">
                      {coupon.type === 'public' ? <PublicIcon /> : <PersonIcon />}
                    </TableCell>
                    <TableCell align="left">{coupon.status}</TableCell>
                    <TableCell align="left">{coupon.startDate}</TableCell>
                    <TableCell align="left">{coupon.endDate}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        to={`/coupon/detail/${coupon.id}`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => onDelete(coupon.id)}
                        color="secondary"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Pagination */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginY="10px">
        <Typography>{`Hiển thị ${coupons.length} trong tổng số ${totalPages} kết quả`}</Typography>
        <Box display="flex" alignItems="center">
          <Typography>Hiển thị:</Typography>
          <Select
            value={size}
            onChange={handleSizeChange}
            size="small"
            style={{ marginLeft: '10px', width: '80px' }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>
      </Stack>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        size="large"
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      />
    </Container>
  );
};

export default Coupon;
