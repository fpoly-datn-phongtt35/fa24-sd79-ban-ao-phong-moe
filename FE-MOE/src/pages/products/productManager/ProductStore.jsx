import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Link,
  Option,
  Select,
  Sheet,
  Table,
  Textarea,
  Typography,
  Card,
  CardCover,
  CircularProgress,
} from "@mui/joy";
import { Container } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  attributeProducts,
  postProduct,
  postProductImage,
} from "~/apis/productApi";
import { useForm } from "react-hook-form";
import SaveAsOutlinedIcon from "@mui/icons-material/SaveAsOutlined";
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import { toast } from "react-toastify";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export const ProductStore = () => {
  const [attributes, setAttribute] = useState(null);
  const [colorCount, setColorCount] = useState([]);
  const [sizeCount, setSizeCount] = useState([]);
  const [details, setDetails] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [images, setImages] = useState([]);

  const [colorError, setColorError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [attributesError, setAttributesError] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    const res = await attributeProducts();
    setAttribute(res);
  };

  useEffect(() => {
    const newDetails = [];

    colorCount.forEach((color) => {
      sizeCount.forEach((size) => {
        const existingDetail = details.find(
          (d) => d.colorId === color.id && d.sizeId === size.id
        );
        newDetails.push(
          existingDetail || {
            colorId: color.id,
            colorName: color.name,
            sizeId: size.id,
            sizeName: size.name,
            retailPrice: "",
            quantity: "",
          }
        );
      });
    });

    setDetails(newDetails);
  }, [colorCount, sizeCount]);

  const handleInputDetails = (index, event) => {
    const { name, value } = event?.target;
    const updatedDetails = [...details];
    updatedDetails[index][name] = value;
    if (name === "retailPrice") {
      if (value < 100) {
        setAttributesError((prev) => {
          const newErrors = [...prev];
          newErrors[index] = { ...newErrors[index], retailPrice: true };
          return newErrors;
        });
      } else {
        setAttributesError((prev) => {
          const newErrors = [...prev];
          newErrors[index] = { ...newErrors[index], retailPrice: false };
          return newErrors;
        });
      }
    }

    if (name === "quantity") {
      if (value < 0) {
        setAttributesError((prev) => {
          const newErrors = [...prev];
          newErrors[index] = { ...newErrors[index], quantity: true };
          return newErrors;
        });
      } else {
        setAttributesError((prev) => {
          const newErrors = [...prev];
          newErrors[index] = { ...newErrors[index], quantity: false };
          return newErrors;
        });
      }
    }
    setDetails(updatedDetails);
    setValue("productDetails", details);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const newImages = [];
    const newImageUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({ img: url, title: file.name });
      newImageUrls.push(files[i]);
    }

    setUploadedImages(newImages);
    handleImagesUpload(newImageUrls);
  };

  const handleImagesUpload = (files) => {
    setImages(files);
  };

  const onValidateAttributes = () => {
    if (colorCount.length === 0) {
      setColorError(true);
    } else {
      setColorError(false);
    }
    if (sizeCount.length === 0) {
      setSizeError(true);
    } else {
      setSizeError(false);
    }
  };

  const nameValue = watch("name");

  const onSubmit = async (data) => {
    if (colorCount.length > 0 && sizeCount.length > 0) {
      if (
        attributesError.some((error) => error.retailPrice || error.quantity)
      ) {
        return;
      }
      let product = {
        name: data.name,
        categoryId: data.category,
        brandId: data.brand,
        materialId: data.material,
        origin: data.origin,
        description: data.description,
        status: "ACTIVE",
        productDetails: data.productDetails,
        userId: localStorage.getItem("userId"),
      };
      if (images.length === 0) {
        toast.error("Vui lòng chọn ảnh");
        return;
      }
      setIsSubmit(true);
      await postProduct(product).then(async (response) => {
        let formData = new FormData();
        formData.append("productId", response);
        images.forEach((image) => {
          formData.append("images", image);
        });
        await postProductImage(formData).then(() => {
          toast.success("Thêm thành công");
          setIsSubmit(false);
          navigate("/product");
        });
      });
    }
  };

  if (isSubmit) {
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
    <Container maxWidth="max-width" sx={{ height: "100vh", marginTop: "15px" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        marginBottom={2}
        height={"50px"}
      >
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "5px" }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/")}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Trang chủ
          </Link>
          <Link
            underline="hover"
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            color="inherit"
            onClick={() => navigate("/product")}
          >
            Quản lý sản phẩm
          </Link>
          <Typography sx={{ color: "text.white", cursor: "pointer" }}>
            Thêm sản phẩm
          </Typography>
        </Breadcrumbs>
      </Grid>
      {/* handle form */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid xs={12}>
            <Box>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl error={!!errors?.name}>
                    <FormLabel required>Tên sản phẩm</FormLabel>
                    <Input
                      placeholder="Nhập tên sản phẩm..."
                      fullWidth
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl error={!!errors?.origin}>
                    <FormLabel required>Xuất xứ</FormLabel>
                    <Select
                      defaultValue=""
                      {...register("origin", { required: true })}
                    >
                      <Option value="" disabled>
                        Chọn xuất xứ
                      </Option>
                      {attributes &&
                        attributes?.origin?.map((value, index) => (
                          <Option key={index} value={value}>
                            {value}
                          </Option>
                        ))}
                    </Select>
                    {errors.origin && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl error={!!errors?.brand}>
                    <FormLabel required>Thương hiệu</FormLabel>
                    <Select
                      defaultValue=""
                      {...register("brand", { required: true })}
                    >
                      <Option value="" disabled>
                        Chọn thương hiệu
                      </Option>
                      {attributes?.brands &&
                        attributes?.brands.map((brand, index) => (
                          <Option value={brand.id} key={index}>
                            {brand.name}
                          </Option>
                        ))}
                    </Select>
                    {errors.brand && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl error={!!errors?.category}>
                    <FormLabel required>Danh mục</FormLabel>
                    <Select
                      defaultValue=""
                      {...register("category", { required: true })}
                    >
                      <Option value="" disabled>
                        Chọn danh mục
                      </Option>
                      {attributes?.categories &&
                        attributes.categories.map((value, index) => (
                          <Option key={index} value={value.id}>
                            {value.name}
                          </Option>
                        ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl error={!!errors?.material}>
                    <FormLabel required>Chất liệu</FormLabel>
                    <Select
                      defaultValue=""
                      {...register("material", { required: true })}
                    >
                      <Option value="" disabled>
                        Chọn chất liệu
                      </Option>
                      {attributes?.materials &&
                        attributes.materials.map((value, index) => (
                          <Option key={index} value={value.id}>
                            {value.name}
                          </Option>
                        ))}
                    </Select>
                    {errors.material && (
                      <FormHelperText>Vui lòng không bỏ trống!</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                {/* TODO Handle product details */}
                <Grid xs={6}>
                  <FormControl error={colorError}>
                    <FormLabel required>Màu sắc</FormLabel>
                    <Autocomplete
                      placeholder="Chọn màu"
                      multiple
                      limitTags={2}
                      filterSelectedOptions
                      options={attributes?.colors || []}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        const data = value.map((color) => {
                          return {
                            id: color.id,
                            name: color.name,
                          };
                        });
                        setColorCount(data);
                      }}
                    />
                    {colorError && (
                      <FormHelperText>Vui lòng không bỏ trống</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl error={sizeError}>
                    <FormLabel required>Kích thước</FormLabel>
                    <Autocomplete
                      placeholder="Chọn kích thước"
                      multiple
                      limitTags={3}
                      filterSelectedOptions
                      options={attributes?.sizes || []}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        const data = value.map((size) => {
                          return {
                            id: size.id,
                            name: size.name,
                          };
                        });
                        setSizeCount(data);
                      }}
                    />
                    {sizeError && (
                      <FormHelperText>Vui lòng không bỏ trống</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid xs={12}>
            {colorCount &&
              colorCount.map((color, colorIndex) => (
                <Sheet key={color.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#636b74",
                      padding: "10px",
                      borderRadius: "3px",
                      marginTop: "10px",
                    }}
                  >
                    <Typography sx={{ color: "#ffff" }} level="title-md">
                      Các sản phẩm màu {color.name}
                    </Typography>
                  </Box>
                  <Table borderAxis="x">
                    <thead>
                      <tr>
                        <th className="text-center">Tên thuộc tính</th>
                        <th className="text-center">Kích thước</th>
                        <th className="text-center">Màu sắc</th>
                        <th className="text-center">Giá tiền</th>
                        <th className="text-center">Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeCount.length === 0 && (
                        <tr>
                          <td colSpan={3} align="center">
                            Chưa có kích thước!
                          </td>
                        </tr>
                      )}
                      {sizeCount &&
                        sizeCount.map((size, sizeIndex) => {
                          const detailIndex =
                            colorIndex * sizeCount.length + sizeIndex;
                          const detail = details[detailIndex];
                          return (
                            <tr key={`${color.id}-${size.id}`}>
                              <td>
                                {nameValue} [{size.name}] - [{color.name}]
                              </td>
                              <td className="text-center">{size.name}</td>
                              <td className="text-center">{color.name}</td>
                              <td className="text-center">
                                <Input
                                  required
                                  error={
                                    attributesError[detailIndex]?.retailPrice
                                  }
                                  value={detail?.retailPrice || ""}
                                  type="number"
                                  name="retailPrice"
                                  onChange={(event) =>
                                    handleInputDetails(detailIndex, event)
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <Input
                                  error={attributesError[detailIndex]?.quantity}
                                  required
                                  value={detail?.quantity || ""}
                                  type="number"
                                  name="quantity"
                                  onChange={(event) =>
                                    handleInputDetails(detailIndex, event)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </Sheet>
              ))}
          </Grid>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                minRows={3}
                maxRows={10}
                placeholder="Nhập mô tả..."
              ></Textarea>
            </FormControl>
          </Grid>
          <Grid xs={12}>
            <Box
              component="ul"
              sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 0, m: 0 }}
            >
              {uploadedImages.length > 0 &&
                uploadedImages.map((item) => (
                  <Card
                    key={item.img}
                    component="li"
                    sx={{
                      minWidth: 150,
                      maxWidth: 250,
                      minHeight: 150,
                      maxHeight: 250,
                      flexGrow: 1,
                    }}
                  >
                    <CardCover>
                      <img src={item.img} loading="lazy" alt={item.title} />
                    </CardCover>
                  </Card>
                ))}
            </Box>
          </Grid>
          <Grid xs={12}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Button
                  color="neutral"
                  variant="outlined"
                  startDecorator={<SaveAsOutlinedIcon />}
                  type="submit"
                  onClick={onValidateAttributes}
                >
                  Lưu sản phẩm
                </Button>
              </Grid>
              <Grid size={6}>
                <Button
                  component="label"
                  role={undefined}
                  tabIndex={-1}
                  variant="outlined"
                  color="neutral"
                  sx={{ marginBottom: 1 }}
                  startDecorator={
                    <SvgIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                        />
                      </svg>
                    </SvgIcon>
                  }
                >
                  Upload a file
                  <VisuallyHiddenInput
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
