import { Stack, Box, Typography, Select, MenuItem, Pagination } from '@mui/material';

const CouponPagination = ({ totalPages, pageNo, handlePageChange, couponsLength, totalElements, pageSize, handleSizeChange }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" marginY="10px">
      <Typography>{`Hiển thị ${couponsLength} trong tổng số ${totalElements} kết quả`}</Typography>
      <Box>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={pageNo}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        )}
      </Box>
      <Box display="flex" alignItems="center">
        <Typography>Hiển thị:</Typography>
        <Select value={pageSize} onChange={handleSizeChange} size="small">
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Box>
    </Stack>
  );
};

export default CouponPagination;
