import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Grid,
  Select,
  Option,
  Textarea,
} from "@mui/joy";
import Button from "@mui/joy/Button";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { attributeProducts, updateProduct } from "~/apis/productApi";
import { useForm } from "react-hook-form";
import { postBrand } from "~/apis/brandsApi";
import { postCategory } from "~/apis/categoriesApi";
import { postMaterial } from "~/apis/materialApi";
import { DialogModifyV2 } from "../common/DialogModifyV2";

export const ModifyProduct = (props) => {
  const [open, setOpen] = useState(false);
  const [attributes, setAttribute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAttributes();
    setValue("userId", localStorage.getItem("userId"));
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchAttributes = async () => {
    const res = await attributeProducts();
    setAttribute(res);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    await updateProduct(data, props.id).then(() => {
      setOpen(false);
      setIsLoading(false);
      props.getProduct();
    });
  };

  const handlePostBrand = async (data) => {
    await postBrand(data).then(() => fetchAttributes());
  };

  const handlePostCategory = async (data) => {
    await postCategory(data).then(() => fetchAttributes());
  };

  const handlePostMaterial = async (data) => {
    await postMaterial(data).then(() => fetchAttributes());
  };
  return (
    <>
      <Button
        size="sm"
        color="neutral"
        variant="soft"
        startDecorator={<EditIcon />}
        onClick={() => setOpen(true)}
      >
        Chỉnh sửa
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>
          <DialogContent>Thay đổi thông tin sản phẩm</DialogContent>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid size={6}>
                  <FormControl required error={!!errors?.name}>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <Input
                      autoFocus
                      defaultValue={props?.data?.name}
                      placeholder="Nhập tên sản phẩm..."
                      sx={{ width: 370 }}
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl required>
                    <FormLabel>Xuất sứ</FormLabel>
                    <Select
                      placeholder="Chọn nơi xuất sứ"
                      defaultValue={props?.data?.origin}
                      sx={{ width: 250 }}
                      {...register("origin", { required: true })}
                    >
                      {attributes?.origin &&
                        attributes?.origin.map((origin, index) => (
                          <Option value={origin} key={index}>
                            {origin}
                          </Option>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl required>
                    <FormLabel>Thương hiệu</FormLabel>
                    <Select
                      defaultValue={props?.data?.brand.id}
                      placeholder="Chọn thương hiệu"
                      sx={{ width: 200 }}
                      {...register("brandId", { required: true })}
                    >
                      {attributes?.brands &&
                        attributes?.brands.map((brand, index) => (
                          <Option value={brand.id} key={index}>
                            {brand.name}
                          </Option>
                        ))}
                      <DialogModifyV2
                        buttonTitle="Thêm mới thương hiệu"
                        icon={<AddIcon />}
                        title="Thêm mới thương hiệu"
                        label="Nhập tên thương hiệu"
                        handleSubmit={handlePostBrand}
                      />
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl required>
                    <FormLabel>Danh mục</FormLabel>
                    <Select
                      defaultValue={props?.data?.category.id}
                      placeholder="Chọn danh mục"
                      sx={{ width: 200 }}
                      {...register("categoryId", { required: true })}
                    >
                      {attributes?.categories &&
                        attributes?.categories.map((category, index) => (
                          <Option value={category.id} key={index}>
                            {category.name}
                          </Option>
                        ))}
                      <DialogModifyV2
                        buttonTitle="Thêm mới danh mục"
                        icon={<AddIcon />}
                        title="Thêm mới danh mục"
                        label="Nhập tên danh mục"
                        handleSubmit={handlePostCategory}
                      />
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl required>
                    <FormLabel>Chất liệu</FormLabel>
                    <Select
                      defaultValue={props?.data?.material.id}
                      placeholder="Chọn chất liệu"
                      sx={{ width: 200 }}
                      {...register("materialId", { required: true })}
                    >
                      {attributes?.materials &&
                        attributes?.materials.map((material, index) => (
                          <Option value={material.id} key={index}>
                            {material.name}
                          </Option>
                        ))}
                      <DialogModifyV2
                        buttonTitle="Thêm mới chất liệu"
                        icon={<AddIcon />}
                        title="Thêm mới chất liệu"
                        label="Nhập tên chất liệu"
                        handleSubmit={handlePostMaterial}
                      />
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={6}>
                  <FormControl
                    sx={{ width: 630 }}
                    error={!!errors?.description}
                  >
                    <FormLabel>Mô tả</FormLabel>
                    <Textarea
                      minRows={3}
                      maxRows={10}
                      placeholder="Nhập mô tả..."
                      defaultValue={props?.data?.description}
                      {...register("description", { required: false })}
                    />
                    {errors.description && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                loading={isLoading}
                type="submit"
                startDecorator={<SaveIcon />}
              >
                Lưu
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
};
