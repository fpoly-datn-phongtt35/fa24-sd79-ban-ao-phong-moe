import { Box, CircularProgress, IconButton, Switch } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ArchiveIcon from "@mui/icons-material/Archive";
import { ImageRotator } from "../common/ImageRotator ";
import { Button, Grid, Sheet, Table, Typography } from "@mui/joy";

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
      <Grid container spacing={2} sx={{ flexGrow: 1 }} style={{display: 'flex', alignItems: 'center', justifyContent: "space-between",}}>
        <Grid size={8}>
          <Typography color="neutral" level="title-lg" noWrap variant="plain">
            Danh sách sản phẩm
          </Typography>
        </Grid>
        <Grid size={4}>
          <Button  onClick={() => navigate("/product/add")} startDecorator={<AddIcon/>}>Thêm sản phẩm</Button>
        </Grid>
      </Grid>
      <Sheet
        sx={{
          marginTop: 2,
          padding: "2px",
          borderRadius: "5px",
        }}
      >
        <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
          <thead>
            <tr>
              <th className="text-center">Ảnh</th>
              <th className="text-center">Tên sản phẩm</th>
              <th className="text-center">Danh mục</th>
              <th className="text-center">Thương hiệu</th>
              <th className="text-center">Chất liệu</th>
              <th className="text-center">Xuất xứ</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={9} align="center">
                  Không tìm thấy sản phẩm!
                </td>
              </tr>
            )}
            {data &&
              data.map((value) => (
                <tr key={value.id}>
                  <td className="text-center">
                    <ImageRotator imageUrl={value.imageUrl} w={70} h={90} />
                  </td>
                  <td>{value.name}</td>
                  <td className="text-center">{value.category}</td>
                  <td className="text-center">{value.brand}</td>
                  <td className="text-center">{value.material}</td>
                  <td className="text-center">{value.origin}</td>
                  <td className="text-center">
                    {value.productQuantity > 0 ? (
                      value.productQuantity
                    ) : (
                      <Badge bg="danger">Hết hàng</Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <Switch
                      defaultChecked={value.status === "ACTIVE"}
                      onClick={() =>
                        props.onSetStatus(value.id, value.status === "ACTIVE")
                      }
                    />
                  </td>
                  <td className="text-center">
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
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};
