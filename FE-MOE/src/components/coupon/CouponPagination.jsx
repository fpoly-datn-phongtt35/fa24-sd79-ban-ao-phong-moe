import { Stack, Box, Typography, TextField, Pagination } from "@mui/material";

const CouponPagination = ({
  totalPages,
  pageNo,
  handlePageChange,
  couponsLength,
  totalElements,
  pageSize,
  handleSizeChange,
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" marginY="10px">
      <Typography>{`Hiển thị ${couponsLength} trong tổng số ${totalElements} kết quả`}</Typography>

      <Box>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={pageNo}
            onChange={(_, newPage) => handlePageChange(newPage)}
            variant="outlined"
            shape="rounded"
          />
        )}
      </Box>

      <Box display="flex" alignItems="center">
        <Typography>Hiển thị:</Typography>
        <TextField
          value={pageSize || ""}
          onChange={(e) => {
            const newSize = parseInt(e.target.value, 10);
            if (!isNaN(newSize) && newSize > 0) {
              handleSizeChange(newSize);
            }
          }}
          size="small"
          variant="outlined"
          sx={{ width: "80px", marginLeft: "8px" }}
          inputProps={{
            type: "number",
            min: 1,
            step: 1,
          }}
        />
      </Box>
    </Stack>
  );
};

export default CouponPagination;
