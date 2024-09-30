import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  fetchAllBrands,
  postBrand,
  putBrand,
  deleteBrand,
} from "~/apis/brandsApi";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DialogModify } from "~/components/common/DialogModify";
import { DialogModifyIconButton } from "~/components/common/DialogModifyIconButton";
import {
  Grid,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Stack,
} from "@mui/material";

export const Brand = () => {
  const [brands, setBrands] = useState(null);

  useEffect(() => {
    handleSetBrands();
  }, []);

  const handleSetBrands = async () => {
    const res = await fetchAllBrands();
    setBrands(res.data);
  };

  const handlePostBrand = async (data) => {
    await postBrand(data);
    handleSetBrands();
  };

  const handleEditBrand = async (data, id) => {
    await putBrand(data, id);
    handleSetBrands();
  };

  const handleDelete = async (id) => {
    await deleteBrand(id);
    handleSetBrands();
  };
  const ondelete = async (id) => {
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa thương hiệu này?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        handleDelete(id);
      }
    });
  };

  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        bgcolor={"#1976d2"}
        height={"50px"}
      >
        <Typography
          xs={4}
          margin={"4px"}
          variant="h6"
          gutterBottom
          color="#fff"
        >
          Quản lý thương hiệu
        </Typography>
      </Grid>
      <Box className="mb-5 mt-5">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField
              variant="standard"
              label="Tìm kiếm thương hiệu"
              fullWidth
            />
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogModify
                buttonTitle="Thêm mới thương hiệu"
                icon={<AddIcon />}
                title="Thêm mới thương hiệu"
                label="Nhập tên thương hiệu"
                handleSubmit={handlePostBrand}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên thương hiệu</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày sửa</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands &&
                brands.map((brands, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{brands.name}</TableCell>
                    <TableCell>{brands.productCount}</TableCell>
                    <TableCell>{brands.createdAt}</TableCell>
                    <TableCell>{brands.updatedAt}</TableCell>
                    <TableCell>{brands.createdBy}</TableCell>
                    <TableCell>
                      <DialogModifyIconButton
                        icon={<EditIcon />}
                        title="Chỉnh sửa thương hiệu"
                        label="Nhập tên thương hiệu"
                        color="warning"
                        value={brands.name}
                        id={brands.id}
                        handleSubmit={handleEditBrand}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(brands.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack
          marginTop={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Pagination count={10} variant="outlined" shape="rounded" />
        </Stack>
      </Box>
    </Container>
  );
};
