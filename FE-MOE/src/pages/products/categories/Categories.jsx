import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  fetchAllCategories,
  postCategory,
  putCategory,
  deleteCategory,
} from "~/apis/categoriesApi";
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

export const Categories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    handleSetCategories();
  }, []);

  const handleSetCategories = async () => {
    const res = await fetchAllCategories();
    setCategories(res.data);
  };

  const handlePostCategory = async (data) => {
    await postCategory(data);
    handleSetCategories();
  };

  const handleEditCategory = async (data, id) => {
    await putCategory(data, id);
    handleSetCategories();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    handleSetCategories();
  };
  const ondelete = async (id) => {
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa danh mục này?",
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
          Quản lý danh mục
        </Typography>
      </Grid>
      <Box className="mb-5 mt-5">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField variant="standard" label="Tìm kiếm danh mục" fullWidth />
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogModify
                buttonTitle="Thêm mới danh mục"
                icon={<AddIcon />}
                title="Thêm mới danh mục"
                label="Nhập tên danh mục"
                handleSubmit={handlePostCategory}
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
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày sửa</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories &&
                categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>{category.createdAt}</TableCell>
                    <TableCell>{category.updatedAt}</TableCell>
                    <TableCell>{category.createdBy}</TableCell>
                    <TableCell>
                      <DialogModifyIconButton
                        icon={<EditIcon />}
                        title="Chỉnh sửa danh mục"
                        label="Nhập tên danh mục"
                        color="warning"
                        value={category.name}
                        id={category.id}
                        handleSubmit={handleEditCategory}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(category.id)}
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
