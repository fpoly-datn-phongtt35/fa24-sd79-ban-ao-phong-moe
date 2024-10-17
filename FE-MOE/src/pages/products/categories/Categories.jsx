import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  fetchAllCategories,
  postCategory,
  putCategory,
  deleteCategory,
} from "~/apis/categoriesApi";
import AddIcon from "@mui/icons-material/Add";
import FolderDeleteTwoToneIcon from "@mui/icons-material/FolderDeleteTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { DialogModify } from "~/components/common/DialogModify";
import { DialogModifyIconButton } from "~/components/common/DialogModifyIconButton";
import { Grid, Box, IconButton } from "@mui/material";
import { BreadcrumbsAttributeProduct } from "~/components/other/BreadcrumbsAttributeProduct";
import {
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Sheet,
  Table,
} from "@mui/joy";

export const Categories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    handleSetCategories();
  }, []);

  const handleSetCategories = async () => {
    const res = await fetchAllCategories();
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
    swal({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn xóa danh mục này?",
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
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}
    >
      <BreadcrumbsAttributeProduct tag="danh mục" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
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
                <th className="text-center">Ngày tạo</th>
                <th className="text-center">Ngày sửa</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{category.name}</td>
                    <td className="text-center">{category.productCount}</td>
                    <td className="text-center">{category.createdAt}</td>
                    <td className="text-center">{category.updatedAt}</td>
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
                      <IconButton
                        color="error"
                        onClick={() => ondelete(category.id)}
                      >
                        <FolderDeleteTwoToneIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <LinearProgress color="primary" size="sm" value={50} variant="soft" />
        </Sheet>
      </Box>
    </Container>
  );
};
