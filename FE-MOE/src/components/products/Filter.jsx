import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export const Filter = (props) => {
  return (
    <Box marginTop={5}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            type="search"
            placeholder="Search..."
            variant="standard"
            onChange={props.onChangeSearch}
            fullWidth
          />
        </Grid>

        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl variant="standard">
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
