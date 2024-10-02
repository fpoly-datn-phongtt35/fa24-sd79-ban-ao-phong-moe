import { useEffect, useState } from "react";
import { fetchAllSizes, postSize, putSize, deleteSize } from "~/apis/sizesApi";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DialogStore } from "~/components/sizes/DialogStore";
import { DialogIconUpdate } from "~/components/sizes/DialogIconUpdate";
import {
  Container,
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

export const Size = () => {
  const [sizes, setSizes] = useState(null);

  useEffect(() => {
    handleSetSizes();
  }, []);

  const handleSetSizes = async () => {
    const res = await fetchAllSizes();
    setSizes(res.data);
  };

  const handlePostSize = async (data) => {
    await postSize(data);
    handleSetSizes();
  };

  const handleEditSize = async (data, id) => {
    await putSize(data, id);
    handleSetSizes();
  };

  const handleDelete = async (id) => {
    await deleteSize(id);
    handleSetSizes();
  };
  const ondelete = async (id) => {
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa size này?",
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
          Quản lý size
        </Typography>
      </Grid>
      <Box className="mb-5 mt-5">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField variant="standard" label="Tìm kiếm size" fullWidth />
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogStore
                buttonTitle="Thêm mới size"
                icon={<AddIcon />}
                title="Thêm mới size"
                handleSubmit={handlePostSize}
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
                <TableCell>Size</TableCell>
                <TableCell>Chiều dài</TableCell>
                <TableCell>Chiều rộng</TableCell>
                <TableCell>Độ dài tay áo</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày sửa</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sizes &&
                sizes.map((sizes, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sizes.name}</TableCell>
                    <TableCell>{sizes.length}</TableCell>
                    <TableCell>{sizes.width}</TableCell>
                    <TableCell>{sizes.sleeve}</TableCell>
                    <TableCell>{sizes.createdAt}</TableCell>
                    <TableCell>{sizes.updatedAt}</TableCell>
                    <TableCell>{sizes.createdBy}</TableCell>
                    <TableCell>
                      <DialogIconUpdate
                        icon={<EditIcon />}
                        title="Chỉnh sửa size"
                        label="Nhập tên size"
                        color="warning"
                        value={sizes}
                        id={sizes.id}
                        handleSubmit={handleEditSize}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(sizes.id)}
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
