import {
  Box,
  FormControl,
  Grid,
  // Input,
  InputAdornment,
  // MenuItem,
  // Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Input from '@mui/joy/Input';
import { Option, Select } from "@mui/joy";

export const Filter = (props) => {
  return (
    <Box
      marginTop={2}
      sx={{
        backgroundColor: "#fff",
        padding: "15px",
        boxShadow: 1,
        borderRadius: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Input type="search" placeholder="Tìm kiếm…" startDecorator={<SearchIcon/>}  onChange={props.onChangeSearch}/>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Select
                label="Trạng thái"
                value={props.status}
                onChange={(event, value) => props.onChangeStatus(value)}
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="ACTIVE">Đang hoạt động</Option>
                <Option value="INACTIVE">Ngừng hoạt động</Option>
                <Option value="OUT_OF_STOCK">Hêt hàng</Option>
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
