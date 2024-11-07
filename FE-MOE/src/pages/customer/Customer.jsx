import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Pagination

} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { fetchAllCustomer, deleteCustomer, searchKeywordAndDate, setLocked } from '~/apis/customerApi';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import HomeIcon from "@mui/icons-material/Home";
import { Avatar, Breadcrumbs, Button, FormControl, FormLabel, Input, Link, Modal, ModalClose, Option, Select, Sheet, Switch, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';


export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [lockedStates, setLockedStates] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navigate = useNavigate()


  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
 
  const mapGender = (gender) => {
    switch (gender) {
      case 'MALE':
        return 'Nam';
      case 'FEMALE':
        return 'Nữ';
      case 'OTHER':
        return 'Khác';
      default:
        return '';
    }
  };

  const handleSetCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetchAllCustomer(page - 1, pageSize);
      setCustomers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Không thể tìm kiếm khách hàng.');
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
      console.error('Lỗi khi tìm kiếm:', error);
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

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      handleSetCustomer();
    } catch (error) {
      console.error('Xóa không thành công', error);
      swal('Error', 'Xóa không thành công', 'error');
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

  const handleClear = () => {
    setKeyword('');
    setGender('');
    setBirth('');
    setPage(1);
    handleSetCustomer();
  };
  const onSetLocked = async (id, currentLockedState) => {
    const updatedLockedState = !currentLockedState;

    try {

      await setLocked(id, updatedLockedState);


      setLockedStates((prevStates) => ({
        ...prevStates,
        [id]: updatedLockedState,
      }));

      console.log(`Customer ${id} isLocked: ${updatedLockedState}`);
    } catch (error) {
      console.error("Failed to update lock status:", error);
    }
  };

  const onDetailsClick = (customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  return (
    <Container maxWidth="max-width"
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        marginBottom={2}
        height={"50px"}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Typography sx={{ color: "text.white", cursor: "pointer" }}>
            Quản lý khách hàng
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                value={keyword}
                placeholder='Tìm kiếm'
                fullWidth
                onChange={(e) => setKeyword(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Giới tính</FormLabel>
              <Select value={gender} onChange={(event, value) => setGender(value)}>
                <Option value="" disabled={false}>--Chọn giới tính--</Option>
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="OTHER">Khác</Option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} marginTop={2} justifyContent='end' display='flex'>
            <Button size="sm" variant="solid" onClick={handleClear} startDecorator={<RefreshIcon />} color="danger" className='me-3'>
              Làm mới
            </Button>
            <Button size="sm" variant="solid" onClick={() => navigate("/customer/add")} startDecorator={<AddIcon />} >
              Tạo mới
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box marginBottom={2}>

      </Box>
      <TableContainer sx={{ border: '1px solid #38383e78' }} component={Paper}>
        <Table aria-label="customer table">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên tài khoản</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell><Avatar src={customer?.image} variant="solid" /></TableCell>
                  <TableCell>{customer.username}</TableCell>
                  <TableCell>{customer.fullName}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{mapGender(customer.gender)} </TableCell>
                  <TableCell>{formatDate(customer.dateOfBirth)}</TableCell>
                  <TableCell>
                    <Switch size="lg"
                      checked={lockedStates[customer.id] ?? customer.isLocked}
                      onClick={() => onSetLocked(customer.id, lockedStates[customer.id] ?? customer.isLocked)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onDetailsClick(customer)}>
                      <RemoveRedEyeIcon color="warning" />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/customer/${customer.id}`)} >
                      <EditIcon color="primary" />
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
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg', mb: 1 }}
          >
            Thông tin chi tiết
          </Typography>
          {selectedCustomer && (
            <>
              <Typography id="modal-desc" textColor="text.tertiary">
                <strong>Tên tài khoản:</strong> {selectedCustomer.username}<br />
                <strong>Họ và tên:</strong> {selectedCustomer.fullName}<br />
                <strong>Email:</strong> {selectedCustomer.email}<br />
                <strong>Số điện thoại:</strong> {selectedCustomer.phoneNumber}<br />
                <strong>Giới tính:</strong> {mapGender(selectedCustomer.gender)}<br />
                <strong>Ngày sinh:</strong> {formatDate(selectedCustomer.dateOfBirth)}<br />
                <strong>Địa chỉ:</strong> {selectedCustomer.streetName} {', '+selectedCustomer.ward}{', '+selectedCustomer.district}{', '+selectedCustomer.city}<br />
                <strong>Ngày tạo:</strong> {formatDate(selectedCustomer.createdAt)}<br />
                <strong>Ngày cập nhật:</strong> {formatDate(selectedCustomer.updatedAt)}<br />
              </Typography>
            </>
          )}
        </Sheet>
      </Modal>
    </Container>
  );
};
