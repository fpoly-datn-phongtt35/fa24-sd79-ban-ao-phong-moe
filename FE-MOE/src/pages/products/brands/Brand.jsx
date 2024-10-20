import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderDeleteTwoToneIcon from "@mui/icons-material/FolderDeleteTwoTone";
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
import {
  deleteBrand,
  fetchAllBrands,
  postBrand,
  putBrand,
} from "~/apis/brandsApi";
import { MoeAlert } from "~/components/other/MoeAlert";

export const Brand = () => {
  const [brands, setBrands] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSetBrands();
  }, [keyword]);

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSetBrands = async () => {
    const res = await fetchAllBrands(keyword);
    setBrands(res.data);
  };

  const handlePostBrand = async (data) => {
    await postBrand(data);
    handleSetBrands();
  };

  const handleEditBrand = async (data, id) => {
    await putBrand(data, id);
    handleSetBrands();
  };

  const handleDelete = async (id) => {
    await deleteBrand(id);
    handleSetBrands();
  };
  const ondelete = async (id) => {
    handleDelete(id);
  };
  if (!brands) {
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
      <BreadcrumbsAttributeProduct tag="thương hiệu" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                onChange={onChangeSearch}
                startDecorator={<SearchIcon />}
                placeholder="Tìm kiếm thương hiệu"
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <DialogModify
                buttonTitle="Thêm mới thương hiệu"
                icon={<AddIcon />}
                title="Thêm mới thương hiệu"
                label="Nhập tên thương hiệu"
                handleSubmit={handlePostBrand}
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
                <th className="text-center">Tên thương hiệu</th>
                <th className="text-center">Sản phẩm</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {brands?.length === 0 && (
                <tr>
                  <td colSpan={5} align="center">
                    Không tìm thấy sản phẩm!
                  </td>
                </tr>
              )}
              {brands &&
                brands.map((brand, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{brand.name}</td>
                    <td className="text-center">{brand.productCount}</td>
                    <td className="text-center">{brand.createdBy}</td>
                    <td className="text-center">
                      <DialogModifyIconButton
                        icon={<EditNoteTwoToneIcon />}
                        title="Chỉnh sửa thương hiệu"
                        label="Nhập tên thương hiệu"
                        color="warning"
                        value={brand.name}
                        id={brand.id}
                        handleSubmit={handleEditBrand}
                      />
                      <MoeAlert
                        title="Cảnh báo"
                        message="Bạn có chắc chắn xóa thương hiệu này?"
                        event={() => ondelete(brand.id)}
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
