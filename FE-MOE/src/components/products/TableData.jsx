import { Box, CircularProgress, IconButton, Switch } from "@mui/material";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { useEffect, useState } from "react";
import ArchiveIcon from "@mui/icons-material/Archive";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { ImageRotator } from "../common/ImageRotator ";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  Grid,
  Option,
  Select,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { MoeAlert } from "../other/MoeAlert";

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
      <Grid
        container
        spacing={2}
        sx={{ flexGrow: 1 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Grid size={8}>
          <Typography color="neutral" level="title-lg" noWrap variant="plain">
            Danh sách sản phẩm
          </Typography>
        </Grid>
        <Grid size={2}>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="neutral" level="title-md" noWrap variant="plain">
              Hiển thị:
            </Typography>
            <Select
              defaultValue={3}
              sx={{ width: "80px" }}
              onChange={(event, value) => props.onSetPageSize(value)}
            >
              <Option value={3}>3</Option>
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </Stack>
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
              <th className="text-center" style={{ width: "200px" }}>
                Tên sản phẩm
              </th>
              <th className="text-center">Danh mục</th>
              <th className="text-center">Thương hiệu</th>
              <th className="text-center">Chất liệu</th>
              <th className="text-center">Xuất xứ</th>
              <th className="text-center">Số lượng</th>
              {!props.restore && <th className="text-center">Trạng thái</th>}
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
                      <Chip color="danger" variant="soft">
                        Hết hàng
                      </Chip>
                    )}
                  </td>
                  {!props.restore && (
                    <td className="text-center">
                      <Switch
                        defaultChecked={value.status === "ACTIVE"}
                        onClick={() =>
                          props.onSetStatus(value.id, value.status === "ACTIVE")
                        }
                      />
                    </td>
                  )}
                  {props.restore ? (
                    <td className="text-center">
                      <MoeAlert
                      title="Cảnh báo"
                        message="Bạn có muốn khôi phục sản phẩm này không?"
                        event={() => props.onRestoreProduct(value.id)}
                        button={
                          <Tooltip
                            title="Khôi phục vào danh sách sản phẩm"
                            variant="plain"
                          >
                            <IconButton color="primary">
                              <SettingsBackupRestoreOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      />

                      <MoeAlert
                        title="Cảnh báo"
                        message="Xóa vĩnh viễn sản phẩm này không?"
                        event={() => props.onDeleteForerver(value.id)}
                        button={
                          <Tooltip title="Xóa vĩnh viễn" variant="plain">
                            <IconButton color="error">
                              <DeleteOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </td>
                  ) : (
                    <td className="text-center">
                      <Tooltip title="Xem chi tiết sản phẩm" variant="plain">
                        <IconButton
                          color="warning"
                          onClick={() => navigate(`/product/view/${value.id}`)}
                        >
                          <EditNoteTwoToneIcon />
                        </IconButton>
                      </Tooltip>

                      <MoeAlert
                        title="Cảnh báo"
                        message="Bạn có muốn chuyển sản phẩm vào kho lưu trữ không?"
                        event={() => props.onMoveToBin(value.id)}
                        button={
                          <Tooltip
                            title="Chuyển vào kho lưu trữ"
                            variant="plain"
                          >
                            <IconButton color="primary">
                              <ArchiveIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};
