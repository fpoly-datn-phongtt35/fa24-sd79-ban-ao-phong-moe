// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import swal from 'sweetalert';
// import { fetchAllCoupon, deleteCoupon } from '~/apis/couponApi';
// import {
//   Container, Grid, TextField, Box, Typography, IconButton, Table, TableBody, TableCell,
//   TableContainer, TableHead, TableRow, Paper, Pagination, Stack, Select, MenuItem, Button, TableSortLabel, Link
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import PublicIcon from '@mui/icons-material/Public';
// import PersonIcon from '@mui/icons-material/Person';
// import PercentIcon from '@mui/icons-material/Percent';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import { Breadcrumbs } from '@mui/joy';
// import HomeIcon from "@mui/icons-material/Home";
// import { useNavigate } from "react-router-dom";
// import { MoeAlert } from '~/components/other/MoeAlert';

// const Coupon = () => {
//   const [coupons, setCoupons] = useState([]);
//   const [pageNo, setPage] = useState(1);
//   const [pageSize, setSize] = useState(5);
//   const [keyword, setKeyword] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [discountType, setDiscountType] = useState('');
//   const [type, setType] = useState('');
//   const [status, setStatus] = useState('');
//   const [sort, setSort] = useState('desc');
//   const [sortBy, setSortBy] = useState('');
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     handleSetCoupon();
//   }, [pageNo, pageSize, sortBy, sort, keyword, startDate, endDate, discountType, type, status]);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       handleSetCoupon();
//     }, 1000);

//     return () => clearTimeout(delayDebounceFn);
//   }, [keyword, startDate, endDate, discountType, type, status]);

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   const handleSetCoupon = async () => {
//     const res = await fetchAllCoupon(pageNo, keyword, startDate, endDate, discountType, type, status, pageSize, sortBy, sort);
//     setCoupons(res.data.content);
//     setTotalPages(res.data.totalPages);
//     setTotalElements(res.data.totalElements);
//   };

//   // Hàm thay đổi kích thước trang
//   const handleSizeChange = (event) => {
//     const newSize = event.target.value;
//     setSize(newSize);
//     setPage(1); // Reset to first page on page size change
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = sortBy === property && sort === 'asc';
//     const newSort = isAsc ? 'desc' : 'asc';

//     setSort(newSort);
//     setSortBy(property);
//     setPage(1); // Reset to first page
//   };

//   const handleClear = () => {
//     setKeyword('');
//     setStartDate('');
//     setEndDate('');
//     setDiscountType('');
//     setType('');
//     setStatus('');
//     setPage(1);
//     setSort('asc');
//     setSortBy('');
//     handleSetCoupon(1, pageSize);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteCoupon(id);
//       handleSetCoupon();
//     } catch (error) {
//       console.error('Failed to delete coupon', error);
//       swal('Error', 'Failed to delete coupon', 'error');
//     }
//   };

//   const onDelete = async (id) => {
//     handleDelete(id);
//   };

//   return (
//     <Container maxWidth="max-width" className="bg-white" style={{ height: '100%', marginTop: '15px' }}>
//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         marginBottom={2}
//         height={"50px"}
//       >
//         <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
//           <Link
//             underline="hover"
//             sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
//             color="inherit"
//             onClick={() => navigate("/")}
//           >
//             <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
//             Trang chủ
//           </Link>
//           <Typography sx={{ color: "text.white", cursor: "pointer" }}>
//             Quản lý phiếu giảm giá
//           </Typography>
//         </Breadcrumbs>
//       </Grid>
//       <Box className="mb-5" style={{ marginTop: '50px' }}>
//         {/* First row: Search, Start Date, End Date, Clear */}
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Tìm phiếu giảm giá"
//               variant="standard"
//               fullWidth
//               value={keyword}
//               onChange={(e) => {
//                 setPage(1)
//                 setKeyword(e.target.value)
//               }}
//               size="small"
//               style={{ minHeight: '40px' }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Từ ngày"
//               type="date"
//               variant="standard"
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               value={startDate}
//               onChange={(e) => {
//                 setPage(1)
//                 setStartDate(e.target.value)
//               }}
//               size="small"
//               style={{ minHeight: '40px' }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Đến ngày"
//               type="date"
//               variant="standard"
//               InputLabelProps={{ shrink: true }}
//               fullWidth
//               value={endDate}
//               onChange={(e) => {
//                 setPage(1)
//                 setEndDate(e.target.value)
//               }}
//               size="small"
//               style={{ minHeight: '40px' }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => navigate("/coupon/create")}
//               fullWidth
//               size="small"
//               style={{ height: '40px' }}
//             >
//               Thêm mới
//             </Button>
//           </Grid>
//         </Grid>

//         {/* Second row: Kiểu, Loại, Trạng thái, Thêm mới */}
//         <Grid container spacing={2} alignItems="center" style={{ marginTop: '10px' }}>
//           <Grid item xs={12} sm={3}>
//             <Select
//               value={discountType}
//               onChange={(e) => {
//                 setPage(1)
//                 setDiscountType(e.target.value);
//                 handleSetCoupon();
//               }}
//               displayEmpty
//               fullWidth
//               size="small"
//               style={{ height: '40px' }}
//             >
//               <MenuItem value="">Loại</MenuItem>
//               <MenuItem value="PERCENTAGE">Phần trăm</MenuItem>
//               <MenuItem value="FIXED_AMOUNT">Số tiền cố định</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Select
//               value={type}
//               onChange={(e) => {
//                 setPage(1)
//                 setType(e.target.value)
//               }}
//               displayEmpty
//               fullWidth
//               size="small"
//               style={{ height: '40px' }}
//             >
//               <MenuItem value="">Kiểu</MenuItem>
//               <MenuItem value="PERSONAL">Cá nhân</MenuItem>
//               <MenuItem value="PUBLIC">Công khai</MenuItem>
//             </Select>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Select
//               value={status}
//               onChange={(e) => {
//                 setPage(1)
//                 setStatus(e.target.value)
//               }}
//               displayEmpty
//               fullWidth
//               size="small"
//               style={{ height: '40px' }}
//             >
//               <MenuItem value="">Trạng thái</MenuItem>
//               <MenuItem value="START">Bắt đầu</MenuItem>
//               <MenuItem value="END">Kết thúc</MenuItem>
//               <MenuItem value="PENDING">Chưa bắt đầu</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleClear}
//               fullWidth
//               size="small"
//               style={{ height: '40px' }}
//             >
//               Xóa lọc
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       <Grid container>
//         <Grid item xs={12}>
//           <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     STT
//                   </TableCell>
//                   <TableCell>
//                     <TableSortLabel
//                       active={sortBy === 'name'}
//                       direction={sortBy === 'name' ? sort : 'asc'}
//                       onClick={() => handleRequestSort('name')}
//                     >
//                       Tên phiếu giảm giá
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell align="left">
//                     <TableSortLabel
//                       active={sortBy === 'code'}
//                       direction={sortBy === 'code' ? sort : 'asc'}
//                       onClick={() => handleRequestSort('code')}
//                     >
//                       Mã
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell align="left">
//                     <TableSortLabel
//                       active={sortBy === 'quantity'}
//                       direction={sortBy === 'quantity' ? sort : 'asc'}
//                       onClick={() => handleRequestSort('quantity')}
//                     >
//                       Số lượng
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell align="left">Loại</TableCell>
//                   <TableCell align="left">Kiểu</TableCell>
//                   <TableCell align="left">Trạng thái</TableCell>
//                   <TableCell align="left">
//                     <TableSortLabel
//                       active={sortBy === 'startDate'}
//                       direction={sortBy === 'startDate' ? sort : 'asc'}
//                       onClick={() => handleRequestSort('startDate')}
//                     >
//                       Bắt đầu
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell align="left">
//                     <TableSortLabel
//                       active={sortBy === 'endDate'}
//                       direction={sortBy === 'endDate' ? sort : 'asc'}
//                       onClick={() => handleRequestSort('endDate')}
//                     >
//                       Kết thúc
//                     </TableSortLabel>
//                   </TableCell>
//                   <TableCell align="right">Hành động</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {coupons.length === 0 && (
//                   <tr>
//                     <td colSpan={9} align="center">
//                       Không tìm thấy phiếu giảm giá nào!
//                     </td>
//                   </tr>
//                 )}
//                 {coupons && coupons.map((coupon, index) => (
//                   <TableRow key={coupon.id}>
//                     <TableCell>{(pageNo - 1) * pageSize + index + 1}</TableCell>
//                     <TableCell>{coupon.name}</TableCell>
//                     <TableCell align="left">{coupon.code}</TableCell>
//                     <TableCell align="left">{coupon.quantity}</TableCell>
//                     <TableCell align="left">
//                       {coupon.discountType === 'PERCENTAGE' ? <PercentIcon /> : <AttachMoneyIcon />}
//                     </TableCell>
//                     <TableCell align="left">
//                       {coupon.type === 'PUBLIC' ? <PublicIcon /> : <PersonIcon />}
//                     </TableCell>
//                     <TableCell align="left">{coupon.status}</TableCell>
//                     <TableCell align="left">{coupon.startDate}</TableCell>
//                     <TableCell align="left">{coupon.endDate}</TableCell>
//                     <TableCell align="right">
//                       <IconButton
//                         onClick={() => navigate(`/coupon/detail/${coupon.id}`)}
//                         color="primary"
//                         size="small"
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <MoeAlert title="Cảnh báo" message="Bạn có muốn xóa phiếu giảm giá này?"
//                         event={() => onDelete(coupon.id)}
//                         button={<IconButton
//                           color="secondary"
//                           size="small"
//                         >
//                           <DeleteIcon />
//                         </IconButton>}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>
//       </Grid>

//       {/* Pagination */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" marginY="10px">
//         <Typography>{`Hiển thị ${coupons.length} trong tổng số ${totalElements} kết quả`}</Typography>

//         <Box alignItems="center">
//           {totalPages > 1 && (
//             <Stack spacing={2}>
//               <Pagination
//                 count={totalPages}
//                 page={pageNo}
//                 onChange={handlePageChange}
//                 variant="outlined"
//                 shape="rounded"
//               />
//             </Stack>
//           )}
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Typography>Hiển thị:</Typography>
//           <Select
//             value={pageSize}
//             onChange={handleSizeChange}
//             size="small"
//             style={{ marginLeft: '10px', width: '80px' }}
//           >
//             <MenuItem value={5}>5</MenuItem>
//             <MenuItem value={10}>10</MenuItem>
//             <MenuItem value={20}>20</MenuItem>
//           </Select>
//         </Box>
//       </Stack>



//     </Container>
//   );
// };

// export default Coupon;




// 



//create
  {/* <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            label="Tìm kiếm khách hàng"
                            fullWidth
                            margin="normal"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />

                        <table className="table table-bordered table-hover">
                            <thead className="table-primary text-center">
                                <tr>
                                    {type === 'PERSONAL' ? (
                                        <th>
                                            <Checkbox
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                    ) : (
                                        <th style={{ width: '1%' }}></th>
                                    )}
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} align="center">
                                            Không tìm thấy khách hàng!
                                        </td>
                                    </tr>
                                )}
                                {customers && customers.map((customer, index) => (
                                    <tr key={index}>
                                        {type === 'PERSONAL' ? (
                                            <td>
                                                <Checkbox
                                                    checked={isSelected(customer.id)}
                                                    onChange={() => handleSelectCustomer(customer.id)}
                                                />
                                            </td>
                                        ) : (
                                            <td></td>
                                        )}
                                        <td>{customer.fullName}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.email}</td>
                                        <td>{formatDateCustomer(customer.dateOfBirth)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedCustomersError && (
                            <Typography color="error">{selectedCustomersError}</Typography>
                        )}
                        <Box mt={2} display="flex" justifyContent="center">
                            {totalPages > 1 && (
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Stack>
                            )}
                        </Box>
                    </Grid> */}



// update
                     {/* <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            label="Tìm kiếm khách hàng"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <table className="table table-bordered table-hover">
                            <thead className="table-primary text-center">
                                <tr>
                                    {couponType === 'PERSONAL' ? (
                                        <th>
                                            <Checkbox
                                                checked={isAllSelected}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                    ) : (
                                        <th style={{ width: '1%' }}></th>
                                    )}
                                    <th>Tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Email</th>
                                    <th>Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} align="center">
                                            Không tìm thấy khách hàng!
                                        </td>
                                    </tr>
                                )}
                                {customers && customers.map((customer, index) => (
                                    <tr key={index}>
                                        {couponType === 'PERSONAL' ? (
                                            <td>
                                                <Checkbox
                                                    checked={isSelected(customer.id)}
                                                    onChange={() => handleSelectCustomer(customer.id)}
                                                />
                                            </td>
                                        ) : (
                                            <td></td>
                                        )}
                                        <td>{customer.fullName}</td>
                                        <td>{customer.phoneNumber}</td>
                                        <td>{customer.email}</td>
                                        <td>{formatDateCustomer(customer.dateOfBirth)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedCustomersError && (
                            <Typography color="error">{selectedCustomersError}</Typography>
                        )}
                        <Box mt={2} display="flex" justifyContent="center">
                            {totalPages > 1 && (
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Stack>
                            )}
                        </Box>
                    </Grid> */}