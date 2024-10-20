import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import FolderDeleteTwoToneIcon from "@mui/icons-material/FolderDeleteTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { Grid, Box, IconButton } from "@mui/material";
import { BreadcrumbsAttributeProduct } from "~/components/other/BreadcrumbsAttributeProduct";
import {
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Table,
} from "@mui/joy";
import {
  deleteColor,
  fetchAllColors,
  postColor,
  putColor,
} from "~/apis/colorApi";
import { DialogStore } from "~/components/colors/DialogStore";
import { DialogIconUpdate } from "~/components/colors/DialogIconUpdate";
import { MoeAlert } from "~/components/other/MoeAlert";

export const Color = () => {
  const [colors, setColors] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSetColors();
  }, [keyword]);

  const handleSetColors = async () => {
    const res = await fetchAllColors(keyword);
    setColors(res.data);
  };

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
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
    handleDelete(id);
  };

  if (!colors) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        width="80vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="max-width"
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}
    >
      <BreadcrumbsAttributeProduct tag="màu sắc" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                onChange={onChangeSearch}
                startDecorator={<SearchIcon />}
                placeholder="Tìm kiếm màu sắc"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogStore
                buttonTitle="Thêm mới màu sắc"
                icon={<AddIcon />}
                title="Thêm mới màu sắc"
                label="Nhập tên màu sắc"
                handleSubmit={handlePostColor}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
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
                <th className="text-center">STT</th>
                <th className="text-center">Tên màu</th>
                <th className="text-center">Hex code</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {colors?.length === 0 && (
                <tr>
                  <td colSpan={5} align="center">
                    Không tìm thấy sản phẩm!
                  </td>
                </tr>
              )}
              {colors &&
                colors.map((color, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{color.name}</td>
                    <td className="text-center">{color.hex_code}</td>
                    <td className="text-center">{color.createdBy}</td>
                    <td className="text-center">
                      <DialogIconUpdate
                        icon={<EditNoteTwoToneIcon />}
                        title="Chỉnh sửa color"
                        label="Nhập tên color"
                        color="warning"
                        name={color.name}
                        hex_code={color.hex_code}
                        id={color.id}
                        handleSubmit={handleEditColor}
                      />
                      <MoeAlert
                        title="Cảnh báo"
                        message="Bạn có chắc chắn xóa color này?"
                        event={() => ondelete(color.id)}
                        button={
                          <IconButton color="error">
                            <FolderDeleteTwoToneIcon />
                          </IconButton>
                        }
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>
    </Container>
  );
};
