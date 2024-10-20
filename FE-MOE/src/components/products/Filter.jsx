import { Box, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import Input from "@mui/joy/Input";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { Microphone } from "./Microphone";

export const Filter = ({ method }) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleKeywordVoice = (keyword) => {
    setValue(keyword);
    method.onChangeSearchVoice(keyword);
  };

  const medthod = {
    setOpen,
    open,
    setValue,
    handleKeywordVoice,
    method
  };
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
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FilterAltOutlinedIcon
              sx={{ color: "#32383e", marginRight: 1 }}
              size="sm"
            />
            Bộ lọc
          </Typography>
        </Grid>
        <Grid size={6}>
          <Button
            variant="soft"
            size="sm"
            onClick={method.clearFilter}
            startDecorator={<RefreshIcon />}
            sx={{ marginRight: 1 }}
          >
            Làm mới
          </Button>
          {method.btnAdd && (
            <Button
              variant="soft"
              size="sm"
              onClick={() => navigate("/product/new")}
              startDecorator={<AddIcon />}
            >
              Thêm sản phẩm
            </Button>
          )}
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
                    value={value}
                    type="search"
                    placeholder="Tìm kiếm…"
                    startDecorator={<SearchIcon />}
                    endDecorator={<Microphone method={medthod} />}
                    onChange={(e) => {
                      method.onChangeSearch(e);
                      setValue(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    label="Trạng thái"
                    value={method.status}
                    onChange={(event, value) => method.onChangeStatus(value)}
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
                    value={method.category}
                    onChange={(event, value) => method.onChangeCategory(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {method?.attributes?.categories?.map((value) => (
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
                    value={method.brand}
                    onChange={(event, value) => method.onChangeBrand(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {method?.attributes?.brands?.map((value) => (
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
                    value={method.material}
                    onChange={(event, value) => method.onChangeMaterial(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {method?.attributes?.materials?.map((value) => (
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
                    value={method.origin}
                    onChange={(event, value) => method.onChangeOrigin(value)}
                  >
                    <Option value="">Tất cả</Option>
                    {method?.attributes?.origin?.map((value, index) => (
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
