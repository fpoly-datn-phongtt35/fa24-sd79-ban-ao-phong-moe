import { useEffect, useState } from "react";
import { fetchAllColors, postColor, putColor, deleteColor } from "~/apis/colorApi";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DialogStore } from "~/components/colors/DialogStore";
import { DialogIconUpdate } from "~/components/colors/DialogIconUpdate";
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

export const Color = () => {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    handleSetColors();
  }, []);

  const handleSetColors = async () => {
    const res = await fetchAllColors();
    setColors(res.data);
  };

  const handlePostColor = async (data) => {
    await postColor(data);
    handleSetColors();
  };

  const handleEditColor = async (data, id) => {
    await putColor(data, id);
    handleSetColors();
  };

  const handleDelete = async (id) => {
    await deleteColor(id);
    handleSetColors();
  };
  const ondelete = async (id) => {
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa color này?",
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
          Quản lý color
        </Typography>
      </Grid>
      <Box className="mb-5 mt-5">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField variant="standard" label="Tìm kiếm color" fullWidth />
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogStore
                buttonTitle="Thêm mới color"
                icon={<AddIcon />}
                title="Thêm mới color"
                handleSubmit={handlePostColor}
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
                <TableCell>Tên màu</TableCell>
                <TableCell>Hex code</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày sửa</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colors &&
                colors.map((color, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{color.name}</TableCell>
                    <TableCell>{color.hex_code}</TableCell>
                    <TableCell>{color.createdAt}</TableCell>
                    <TableCell>{color.updatedAt}</TableCell>
                    <TableCell>{color.createdBy}</TableCell>
                    <TableCell>
                      <DialogIconUpdate
                        icon={<EditIcon />}
                        title="Chỉnh sửa color"
                        label="Nhập tên color"
                        color="warning"
                        value={color}
                        id={color.id}
                        handleSubmit={handleEditColor}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(color.id)}
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
