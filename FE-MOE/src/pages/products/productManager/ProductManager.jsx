import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import HomeIcon from "@mui/icons-material/Home";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  attributeProducts,
  postProduct,
  postProductImage,
} from "~/apis/productApi";
import { useNavigate } from "react-router-dom";
import StandardImageList from "~/components/common/StandardImageList";
import { toast } from "react-toastify";

export const ProductManager = () => {
  const [attributes, setAttribute] = useState(null);
  const [colorCount, setColorCount] = useState([]);
  const [sizeCount, setSizeCount] = useState([]);
  const [details, setDetails] = useState([]);
  const [images, setImages] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);

  const [error, setError] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttributes();
  }, []);

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

  const handleInputDetails = (index, event) => {
    const { name, value } = event.target;
    const updatedDetails = [...details];
    updatedDetails[index][name] = value;
    setDetails(updatedDetails);
    setValue("productDetails", details);
  };

  const handleImagesUpload = (files) => {
    setImages(files);
  };

  const onSubmit = async (data) => {
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
  };

  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
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
      {/* <HeardForm title="Thêm sản phẩm" /> */}
      <form action="#" method="post" onSubmit={handleSubmit(onSubmit)}>
        <Box marginTop={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  label="Tên sản phẩm"
                  fullWidth
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <FormHelperText error>
                    Vui lòng điền đầy đủ thông tin
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="origin">Xuất sứ</InputLabel>
                <Select
                  labelId="origin"
                  label="Xuất sứ"
                  defaultValue=""
                  {...register("origin", { required: true })}
                >
                  {attributes &&
                    attributes.origin.map((value, index) => (
                      <MenuItem key={index} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
                {errors.origin && (
                  <FormHelperText error>
                    Vui lòng điền đầy đủ thông tin
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="brand">Thương hiệu</InputLabel>
                <Select
                  labelId="brand"
                  label="Thương hiệu"
                  defaultValue=""
                  {...register("brand", { required: true })}
                >
                  {attributes?.brands &&
                    attributes.brands.map((value, index) => (
                      <MenuItem key={index} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                </Select>
                {errors.brand && (
                  <FormHelperText error>
                    Vui lòng điền đầy đủ thông tin
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="category">Loại sản phẩm</InputLabel>
                <Select
                  labelId="category"
                  label="Loại sản phẩm"
                  defaultValue=""
                  {...register("category", { required: true })}
                >
                  {attributes?.categories &&
                    attributes.categories.map((value, index) => (
                      <MenuItem key={index} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                </Select>
                {errors.category && (
                  <FormHelperText error>
                    Vui lòng điền đầy đủ thông tin
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="material">chất liệu</InputLabel>
                <Select
                  labelId="material"
                  label="chất liệu"
                  defaultValue=""
                  {...register("material", { required: true })}
                >
                  {attributes?.materials &&
                    attributes.materials.map((value, index) => (
                      <MenuItem key={index} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                </Select>
                {errors.material && (
                  <FormHelperText error>
                    Vui lòng điền đầy đủ thông tin
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* TODO Handle product details */}
            <Grid item xs={6}>
              <Autocomplete
                multiple
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Color"
                    placeholder="Color"
                    error={!!errors.color}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={attributes?.sizes || []}
                filterSelectedOptions
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
                renderInput={(params) => (
                  <TextField {...params} label="Size" placeholder="Size" />
                )}
              />
            </Grid>
            {colorCount &&
              colorCount.map((color, colorIndex) => (
                <Grid item xs={12} key={color.id}>
                  <TableContainer component={Paper}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      padding="5px"
                      bgcolor="#5d94c5"
                    >
                      <Typography variant="h6" component="div" color="#fff">
                        Các sản phẩm màu {color.name}
                      </Typography>
                    </Box>
                    <Table sx={{ minWidth: 60 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Giá tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sizeCount.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Box
                                display="flex"
                                justifyContent="center"
                                padding="5px"
                              >
                                <Typography variant="i" component="div">
                                  Chưa có thuộc tính size
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                        {sizeCount &&
                          sizeCount.map((size, sizeIndex) => {
                            const detailIndex =
                              colorIndex * sizeCount.length + sizeIndex;
                            const detail = details[detailIndex];
                            return (
                              <TableRow key={sizeIndex}>
                                <TableCell>{sizeIndex + 1}</TableCell>
                                <TableCell>
                                  Sản phẩm [{color.name} - {size.name}]
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Số lượng"
                                    type="number"
                                    name="quantity"
                                    value={detail?.quantity || ""}
                                    onChange={(event) =>
                                      handleInputDetails(detailIndex, event)
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Giá tiền"
                                    type="number"
                                    name="retailPrice"
                                    value={detail?.retailPrice || ""}
                                    error={
                                      errors.details?.[detailIndex]
                                        ?.retailPrice === ""
                                    }
                                    // error={true}
                                    onChange={(event) =>
                                      handleInputDetails(detailIndex, event)
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ))}

            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                multiline
                fullWidth
                rows={4}
                {...register("description", { required: true })}
              />
              {errors.description && (
                <FormHelperText error>
                  Vui lòng điền đầy đủ thông tin
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <StandardImageList onImagesUpload={handleImagesUpload} />
            </Grid>
            <Grid item xs={12}>
              <Button
                className="me-2"
                color="error"
                variant="contained"
                type="button"
                onClick={() => navigate("/product")}
              >
                Thoát
              </Button>
              {isSubmit ? (
                <Button disabled>
                  <CircularProgress />
                </Button>
              ) : (
                <Button variant="contained" type="submit">
                  Lưu
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </form>
    </Container>
  );
};
