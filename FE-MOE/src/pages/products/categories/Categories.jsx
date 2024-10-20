import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  fetchAllCategories,
  postCategory,
  putCategory,
  deleteCategory,
} from "~/apis/categoriesApi";
import debounce from "lodash.debounce";
import AddIcon from "@mui/icons-material/Add";
import FolderDeleteTwoToneIcon from "@mui/icons-material/FolderDeleteTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { DialogModify } from "~/components/common/DialogModify";
import { DialogModifyIconButton } from "~/components/common/DialogModifyIconButton";
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
import { MoeAlert } from "~/components/other/MoeAlert";

export const Categories = () => {
  const [categories, setCategories] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSetCategories();
  }, [keyword]);

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSetCategories = async () => {
    const res = await fetchAllCategories(keyword);
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
    handleDelete(id);
  };
  if (!categories) {
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
      <BreadcrumbsAttributeProduct tag="danh mục" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                onChange={onChangeSearch}
                startDecorator={<SearchIcon />}
                placeholder="Tìm kiếm danh mục"
                fullWidth
              />
            </FormControl>
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
                <th className="text-center">Tên danh mục</th>
                <th className="text-center">Sản phẩm</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories?.length === 0 && (
                <tr>
                  <td colSpan={5} align="center">
                    Không tìm thấy sản phẩm!
                  </td>
                </tr>
              )}
              {categories &&
                categories.map((category, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{category.name}</td>
                    <td className="text-center">{category.productCount}</td>
                    <td className="text-center">{category.createdBy}</td>
                    <td className="text-center">
                      <DialogModifyIconButton
                        icon={<EditNoteTwoToneIcon />}
                        title="Chỉnh sửa danh mục"
                        label="Nhập tên danh mục"
                        color="warning"
                        value={category.name}
                        id={category.id}
                        handleSubmit={handleEditCategory}
                      />
                      <MoeAlert
                        title="Cảnh báo"
                        message="Bạn có chắc chắn xóa danh mục này?"
                        event={() => ondelete(category.id)}
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
