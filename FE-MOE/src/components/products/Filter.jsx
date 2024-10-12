import {
  Box,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export const Filter = (props) => {
  return (
    <Box marginTop={2} sx={{backgroundColor: "#fff", padding: "15px", boxShadow: 1, borderRadius: 1}}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Input
          placeholder="Tìm kiếm..."
          variant="standard"
          onChange={props.onChangeSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          }
          />
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl variant="standard" fullWidth >
                <Select label="Trạng thái" value={props.status} onChange={props.onChangeStatus}>
                  <MenuItem value="ALL">Tất cả</MenuItem>
                  <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
                  <MenuItem value="INACTIVE">Ngừng hoạt động</MenuItem>
                  <MenuItem value="OUT_OF_STOCK">Hết hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
