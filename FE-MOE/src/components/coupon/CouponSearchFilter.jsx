import { Grid, TextField, Select, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Button } from '@mui/joy';
import { Refresh } from '@mui/icons-material';

const CouponSearchFilter = ({
  keyword, setKeyword, startDate, setStartDate, endDate, setEndDate, discountType,
  setDiscountType, type, setType, status, setStatus, handleClear
}) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
        <TextField
          label="Tìm phiếu giảm giá"
          variant="standard"
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="small"
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
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="solid"
          color="primary"
          onClick={() => navigate("/coupon/create")}
          fullWidth
          size="lg"
          startDecorator={<AddIcon />}
        >
          Tạo mới
        </Button>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
        >
          <MenuItem value="">Loại</MenuItem>
          <MenuItem value="PERCENTAGE">Phần trăm</MenuItem>
          <MenuItem value="FIXED_AMOUNT">Số tiền cố định</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
        >
          <MenuItem value="">Kiểu</MenuItem>
          <MenuItem value="PERSONAL">Cá nhân</MenuItem>
          <MenuItem value="PUBLIC">Công khai</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          fullWidth
          size="small"
        >
          <MenuItem value="">Trạng thái</MenuItem>
          <MenuItem value="START">Bắt đầu</MenuItem>
          <MenuItem value="END">Kết thúc</MenuItem>
          <MenuItem value="PENDING">Chưa bắt đầu</MenuItem>
        </Select>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Button
          variant="soft"
          sx={{ backgroundColor: 'purple', color: 'white' }}
          fullWidth
          onClick={handleClear}
          size="lg"
          startDecorator={<Refresh />}
        >
          Làm mới
        </Button>
      </Grid>

    </Grid>
  );
};

export default CouponSearchFilter;
