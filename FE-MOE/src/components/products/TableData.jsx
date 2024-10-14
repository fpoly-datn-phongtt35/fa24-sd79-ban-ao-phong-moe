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
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Badge, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ArchiveIcon from "@mui/icons-material/Archive";
import { ImageRotator } from "../common/ImageRotator ";

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
    <Box marginTop={2}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          variant="soft"
        >
          <TableHead>
            <TableRow>
              <TableCell className="text-center">Ảnh</TableCell>
              <TableCell className="text-center">Tên sản phẩm</TableCell>
              <TableCell className="text-center">Danh mục</TableCell>
              <TableCell className="text-center">Thương hiệu</TableCell>
              <TableCell className="text-center">Chất liệu</TableCell>
              <TableCell className="text-center">Xuất xứ</TableCell>
              <TableCell className="text-center">Số lượng</TableCell>
              <TableCell className="text-center">Trạng thái</TableCell>
              <TableCell className="text-center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  Không tìm thấy sản phẩm!
                </TableCell>
              </TableRow>
            )}
            {data &&
              data.map((value) => (
                <TableRow key={value.id}>
                  <TableCell className="text-center">
                    <ImageRotator imageUrl={value.imageUrl} w={70} h={90}/>
                  </TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell className="text-center">
                    {value.category}
                  </TableCell>
                  <TableCell className="text-center">{value.brand}</TableCell>
                  <TableCell className="text-center">
                    {value.material}
                  </TableCell>
                  <TableCell className="text-center">{value.origin}</TableCell>
                  <TableCell className="text-center">
                    {value.productQuantity > 0 ? (
                      value.productQuantity
                    ) : (
                      <Badge bg="danger">Hết hàng</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      defaultChecked={value.status === "ACTIVE"}
                      onClick={() =>
                        props.onSetStatus(value.id, value.status === "ACTIVE")
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <IconButton
                      color="warning"
                      onClick={() => navigate(`/product/edit/${value.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="gray"
                      onClick={() => props.onMoveToBin(value.id)}
                    >
                      <ArchiveIcon />
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
