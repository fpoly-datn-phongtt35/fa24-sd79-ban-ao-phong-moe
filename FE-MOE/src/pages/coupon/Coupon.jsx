import React, { useEffect, useState } from 'react';
import { Grid, Box, Link, Typography, Container, Breadcrumbs } from "@mui/material";
import CouponPagination from "~/components/coupon/CouponPagination";
import CouponSearchFilter from "~/components/coupon/CouponSearchFilter";
import CouponTable from "~/components/coupon/CouponTable";
import { deleteCoupon, fetchAllCoupon } from '~/apis/couponApi';
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from 'react-router-dom';

export const Coupon = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [pageNo, setPage] = useState(1);
  const [pageSize, setSize] = useState(5);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [keyword, startDate, endDate, discountType, type, status]);

  useEffect(() => {
    handleSetCoupon();
  }, [pageNo, pageSize, sortBy, sort, keyword, startDate, endDate, discountType, type, status]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSetCoupon = async () => {
    const res = await fetchAllCoupon(pageNo, keyword, startDate, endDate, discountType, type, status, pageSize, sortBy, sort);
    setCoupons(res.data.content);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
  };

  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    setSize(newSize);
    setPage(1);
  };

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sort === 'asc';
    const newSort = isAsc ? 'desc' : 'asc';

    setPage(1);
    setSort(newSort);
    setSortBy(property);
  };

  const handleClear = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setDiscountType('');
    setType('');
    setStatus('');
    setPage(1);
    setSort('asc');
    setSortBy('');
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
    handleDelete(id);
  };

  return (
    <Container
      maxWidth="max-width"
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}
    >
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
            Quản lý phiếu giảm giá
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box className="mb-5">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CouponSearchFilter
              keyword={keyword}
              setKeyword={setKeyword}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              discountType={discountType}
              setDiscountType={setDiscountType}
              type={type}
              setType={setType}
              status={status}
              setStatus={setStatus}
              handleClear={handleClear}
            />
          </Grid>
          <Grid item xs={12}>
            <CouponTable
              coupons={coupons}
              sortBy={sortBy}
              sort={sort}
              handleRequestSort={handleRequestSort}
              onDelete={onDelete}
              pageNo={pageNo}
              pageSize={pageSize}
            />
          </Grid>
          <Grid item xs={12}>
            <CouponPagination
              totalPages={totalPages}
              pageNo={pageNo}
              handlePageChange={handlePageChange}
              couponsLength={coupons.length}
              totalElements={totalElements}
              pageSize={pageSize}
              handleSizeChange={handleSizeChange}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Coupon;
