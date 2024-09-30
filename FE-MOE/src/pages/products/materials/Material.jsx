import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { fetchAllBrands, postBrand, putBrand, deleteBrand } from "~/apis/brandsApi";

import { fetchAllMaterials, postMaterial, putMaterial, deleteMaterial } from "~/apis/materialApi";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Grid, TextField, Box, Typography } from "@mui/material";
import { DialogModify } from "~/components/common/DialogModify";
import { DialogModifyIconButton } from "~/components/common/DialogModifyIconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export const Material = () => {
  const [materials, setMaterials] = useState(null);

  useEffect(() => {
    handleSetMaterials();
  }, []);

  const handleSetMaterials = async () => {
    const res = await fetchAllMaterials();
    setMaterials(res.data);
  };

  const handlePostMaterial= async (data) => {
    await postMaterial(data);
    handleSetMaterials();
  };

  const handleEditMaterial= async (data, id) => {
    await putMaterial(data, id);
    handleSetMaterials();
  };

  const handleDelete = async (id) => {
    await deleteMaterial(id);
    handleSetMaterials();
  };
  const ondelete = async (id) => {
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa chất liệu này?",
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
          Quản lý chất liệu
        </Typography>
      </Grid>
      <Box className="mb-5 mt-5">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <TextField variant="standard" label="Tìm kiếm chất liệu" fullWidth />
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogModify
                buttonTitle="Thêm mới chất liệu"
                icon={<AddIcon />}
                title="Thêm mới chất liệu"
                label="Nhập tên chất liệu"
                handleSubmit={handlePostMaterial}
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
                <TableCell>Tên chất liệu</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Ngày sửa</TableCell>
                <TableCell>Người tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials &&
                materials.map((materials, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{materials.name}</TableCell>
                    <TableCell>{materials.productCount}</TableCell>
                    <TableCell>{materials.createdAt}</TableCell>
                    <TableCell>{materials.updatedAt}</TableCell>
                    <TableCell>{materials.createdBy}</TableCell>
                    <TableCell>
                      <DialogModifyIconButton
                        icon={<EditIcon />}
                        title="Chỉnh sửa chất liệu"
                        label="Nhập tên chất liệu"
                        color="warning"
                        value={materials.name}
                        id={materials.id}
                        handleSubmit={handleEditMaterial}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(materials.id)}
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
