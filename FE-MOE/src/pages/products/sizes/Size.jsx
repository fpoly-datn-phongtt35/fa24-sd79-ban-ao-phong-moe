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
import { deleteSize, fetchAllSizes, postSize, putSize } from "~/apis/sizesApi";
import { DialogIconUpdate } from "~/components/sizes/DialogIconUpdate";
import { DialogStore } from "~/components/sizes/DialogStore";
import { MoeAlert } from "~/components/other/MoeAlert";

export const Size = () => {
  const [sizes, setSizes] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSetSizes();
  }, [keyword]);

  const handleSetSizes = async () => {
    const res = await fetchAllSizes(keyword);
    setSizes(res.data);
  };

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
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
    handleDelete(id);
  };

  if (!sizes) {
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
      <BreadcrumbsAttributeProduct tag="kích thước" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                onChange={onChangeSearch}
                startDecorator={<SearchIcon />}
                placeholder="Tìm kiếm kích thước"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogStore
                buttonTitle="Thêm mới kích thước"
                icon={<AddIcon />}
                title="Thêm mới kích thước"
                label="Nhập tên kích thước"
                handleSubmit={handlePostSize}
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
                <th className="text-center">Size</th>
                <th className="text-center">Chiều dài</th>
                <th className="text-center">Chiều rộng</th>
                <th className="text-center">Độ dài tay áo</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {sizes?.length === 0 && (
                <tr>
                  <td colSpan={7} align="center">
                    Không tìm thấy sản phẩm!
                  </td>
                </tr>
              )}
              {sizes &&
                sizes.map((sizes, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{sizes.name}</td>
                    <td className="text-center">{sizes.length}</td>
                    <td className="text-center">{sizes.width}</td>
                    <td className="text-center">{sizes.sleeve}</td>
                    <td className="text-center">{sizes.createdBy}</td>
                    <td className="text-center">
                      <DialogIconUpdate
                        icon={<EditNoteTwoToneIcon />}
                        title="Chỉnh sửa size"
                        label="Nhập tên size"
                        color="warning"
                        name={sizes.name}
                        length={sizes.length}
                        width={sizes.width}
                        sleeve={sizes.sleeve}
                        id={sizes.id}
                        handleSubmit={handleEditSize}
                      />
                      <MoeAlert
                        title="Cảnh báo"
                        message="Bạn có chắc chắn xóa size này?"
                        event={() => ondelete(sizes.id)}
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
