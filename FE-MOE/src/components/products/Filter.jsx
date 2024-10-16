import { Box, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RefreshIcon from "@mui/icons-material/Refresh";
import Input from "@mui/joy/Input";
import {
  Button,
  FormControl,
  FormLabel,
  Option,
  Select,
  Typography,
} from "@mui/joy";

export const Filter = (props) => {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0.5em",
        }}
      >
        <Grid size={6}>
          <Typography
            color="neutral"
            level="title-lg"
            noWrap
            variant="plain"
            sx={{display: "flex", alignItems: "center"}}
          >
            <FilterAltOutlinedIcon sx={{ color: "#32383e", marginRight: 1 }} size="sm" />
            Bộ lọc
          </Typography>
        </Grid>
        <Grid size={6}>
          <Button
            variant="plain"
            size="sm"
            onClick={props.clearFilter}
            startDecorator={<RefreshIcon />}
          >
            Làm mới
          </Button>
        </Grid>
      </Grid>
      <Box>
        <Grid container spacing={2} marginTop={0.5}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <FormControl>
                  <FormLabel>Tìm kiếm</FormLabel>
                  <Input
                    type="search"
                    placeholder="Tìm kiếm…"
                    // value={props.keyword}
                    startDecorator={<SearchIcon />}
                    onChange={props.onChangeSearch}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    label="Trạng thái"
                    value={props.status}
                    onChange={(event, value) => props.onChangeStatus(value)}
                  >
                    <Option value="ALL">Tất cả</Option>
                    <Option value="ACTIVE">Đang hoạt động</Option>
                    <Option value="INACTIVE">Ngừng hoạt động</Option>
                    <Option value="OUT_OF_STOCK">Hết hàng</Option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl>
                  <FormLabel>Danh mục</FormLabel>
                  <Select
                    label="Danh mục"
                    value={props.category}
                    onChange={(event, value) => props.onChangeCategory(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {props?.attributes?.categories?.map((value) => (
                      <Option key={value.id} value={value.name}>
                        {value.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <FormLabel>Thương hiệu</FormLabel>
                  <Select
                    label="Thương hiệu"
                    value={props.brand}
                    onChange={(event, value) => props.onChangeBrand(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {props?.attributes?.brands?.map((value) => (
                      <Option key={value.id} value={value.name}>
                        {value.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <FormLabel>Chất liệu</FormLabel>
                  <Select
                    label="Chất liệu"
                    value={props.material}
                    onChange={(event, value) => props.onChangeMaterial(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {props?.attributes?.materials?.map((value) => (
                      <Option key={value.id} value={value.name}>
                        {value.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl>
                  <FormLabel>Xuất xứ</FormLabel>
                  <Select
                    label="Xuất sứ"
                    value={props.origin}
                    onChange={(event, value) => props.onChangeOrigin(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {props?.attributes?.origin?.map((value, index) => (
                      <Option key={index} value={value}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
