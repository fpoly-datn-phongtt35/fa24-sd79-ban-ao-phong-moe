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
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Sheet,
  Table,
} from "@mui/joy";
import {
  deleteMaterial,
  fetchAllMaterials,
  postMaterial,
  putMaterial,
} from "~/apis/materialApi";

export const Material = () => {
  const [materials, setMaterials] = useState(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    handleSetMaterials();
  }, [keyword]);

  const debouncedSearch = debounce((value) => {
    setKeyword(value);
  }, 300);

  const onChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSetMaterials = async () => {
    const res = await fetchAllMaterials(keyword);
    setMaterials(res.data);
  };

  const handlePostMaterial = async (data) => {
    await postMaterial(data);
    handleSetMaterials();
  };

  const handleEditMaterial = async (data, id) => {
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
      sx={{ height: "100vh", marginTop: "15px", backgroundColor: "#fff" }}
    >
      <BreadcrumbsAttributeProduct tag="chất liệu" />
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <FormControl>
              <FormLabel>Tìm kiếm</FormLabel>
              <Input
                onChange={onChangeSearch}
                startDecorator={<SearchIcon />}
                placeholder="Tìm kiếm chất liệu"
                fullWidth
              />
            </FormControl>
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
                <th className="text-center">Tên chất liệu</th>
                <th className="text-center">Sản phẩm</th>
                <th className="text-center">Ngày tạo</th>
                <th className="text-center">Ngày sửa</th>
                <th className="text-center">Người tạo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {materials &&
                materials.map((material, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{material.name}</td>
                    <td className="text-center">{material.productCount}</td>
                    <td className="text-center">{material.createdAt}</td>
                    <td className="text-center">{material.updatedAt}</td>
                    <td className="text-center">{material.createdBy}</td>
                    <td className="text-center">
                      <DialogModifyIconButton
                        icon={<EditNoteTwoToneIcon />}
                        title="Chỉnh sửa chất liệu"
                        label="Nhập tên chất liệu"
                        color="warning"
                        value={material.name}
                        id={material.id}
                        handleSubmit={handleEditMaterial}
                      />
                      <IconButton
                        color="error"
                        onClick={() => ondelete(material.id)}
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
