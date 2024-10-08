import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const TableData = (props) => {
  const [data, setData] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  if (!data) {
    return (
      <Box
        margin={10}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box marginTop={5}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Chất liệu</TableCell>
              <TableCell>Xuất xứ</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((value) => (
                <TableRow key={value.id}>
                  <TableCell>
                    <Image src={value.imageUrl[0] || "https://flysunrise.com/wp-content/uploads/2024/03/featured-image-placeholder.jpg"} rounded width={100} />
                  </TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>{value.category}</TableCell>
                  <TableCell>{value.brand}</TableCell>
                  <TableCell>{value.material}</TableCell>
                  <TableCell>{value.origin}</TableCell>
                  <TableCell>{value.description}</TableCell>
                  <TableCell>{value.productQuantity}</TableCell>
                  <TableCell>
                    <IconButton color="warning">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: "fixed",
          bottom: 15,
          right: 15,
        }}
        onClick={() => navigate("/product/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
