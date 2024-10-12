import {
  Box,
  Container,
  Grid,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { HeardForm } from "~/components/other/HeaderForm";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "~/apis/categoriesApi";
import { fetchAllCountry } from "~/apis/countryApi";
import { fetchAllBrands } from "~/apis/brandsApi";
import { fetchAllMaterials } from "~/apis/materialApi";
import StandardImageList from "~/components/common/StandardImageList";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchAllColors } from "~/apis/colorApi";
import { fetchAllSizes } from "~/apis/sizesApi";
import { postProduct } from "~/apis/productApi";
import { useNavigate } from "react-router-dom";
import { uploadSingleImage } from "~/utils/cloudinarySingleUpload";
import { NHV_CLODINARY } from "~/utils/constants";
import { result } from "lodash";

export const ProductFrom = () => {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [productDetails, setProductDetails] = useState([
    {
      retailPrice: "",
      sizeId: "",
      colorId: "",
      quantity: "",
    },
  ]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    status: "",
    categoryId: "",
    brandId: "",
    materialId: "",
    origin: "",
    description: "",
    status: "ACTIVE",
    imageUrl: [],
    productDetails: [],
    userId: localStorage.getItem("userId"),
  });

  const navigate = useNavigate();
  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = () => {
    handleFetchContry();
    handleFetchBrand();
    handleFetchCategory();
    handleFetchMaterial();
    handleSetColors();
    handleSetSizes();
  };

  const handleFetchContry = async () => {
    const res = await fetchAllCountry();
    setCountries(res);
  };

  const handleFetchCategory = async () => {
    const res = await fetchAllCategories();
    setCategories(res.data);
  };

  const handleFetchBrand = async () => {
    const res = await fetchAllBrands();
    setBrands(res.data);
  };

  const handleFetchMaterial = async () => {
    const res = await fetchAllMaterials();
    setMaterials(res.data);
  };

  const handleSetColors = async () => {
    const res = await fetchAllColors();
    setColors(res.data);
  };

  const handleSetSizes = async () => {
    const res = await fetchAllSizes();
    setSizes(res.data);
  };

  const handleInputChangeDetail = (index, event) => {
    const { name, value } = event.target;
    const newProductDetails = [...productDetails];
    newProductDetails[index][name] = value;
    setProductDetails(newProductDetails);
    setProduct({
      ...product,
      productDetails: productDetails,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const addProductDetail = () => {
    setProduct({
      ...product,
      productDetails: productDetails,
    });
    setProductDetails([
      ...productDetails,
      {
        retailPrice: "",
        sizeId: "",
        colorId: "",
        quantity: "",
      },
    ]);
  };

  const handleImagesUpload = (imageUrls) => {
    setProduct({
      ...product,
      productDetails: productDetails,
    });
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageUrl: imageUrls,
    }));
  };

  const removeProductDetail = (index) => {
    const newProductDetails = productDetails.filter((_, i) => i !== index);
    setProductDetails(newProductDetails);
    setProduct({
      ...product,
      productDetails: productDetails,
    });
  };

  const handleUploadImages = () => {
    const url = [];
    const countFiles = product.imageUrl.length;
    for (let i = 0; i < countFiles; i++) {
      uploadSingleImage(NHV_CLODINARY, product.imageUrl[i]).then((result) => {
        url.push(result);
      });
    }
    handleImagesUpload(url);
    console.log(url);
    console.log("First");
    
  };

  const handleSubmit = async () => {
    // TODO: Add product to database
    console.log(product);
    await postProduct(product);

    navigate("/product");
  };

  return (
    <Container
      maxWidth="max-width"
      className="bg-white"
      style={{ height: "100%", marginTop: "15px" }}
    >
      <HeardForm title="Thêm sản phẩm" />
      <Box marginTop={3}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              size="small"
              label="Tên Sản Phẩm"
              fullWidth
              name="name"
              defaultValue={product.name}
              onChange={handleInputChange}
              // helperText="Please enter product name"
            />
          </Grid>

          <Grid container spacing={2} item xs={6}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="origin">Xuất sứ</InputLabel>
                <Select
                  labelId="origin"
                  label="Xuất sứ"
                  name="origin"
                  value={product.origin || ""}
                  onChange={handleInputChange}
                >
                  {countries &&
                    countries.map((value, index) => (
                      <MenuItem key={index} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="brand">Thương hiệu</InputLabel>
                <Select
                  labelId="brand"
                  label="Thương hiệu"
                  name="brandId"
                  value={product.brandId || ""}
                  onChange={handleInputChange}
                >
                  {brands &&
                    brands.map((value, index) => (
                      <MenuItem key={index} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="category">Loại sản phẩm</InputLabel>
              <Select
                labelId="category"
                label="Loại sản phẩm"
                name="categoryId"
                value={product.categoryId || ""}
                onChange={handleInputChange}
              >
                {categories &&
                  categories.map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="material">Chất liệu</InputLabel>
              <Select
                labelId="material"
                label="Chất liệu"
                name="materialId"
                value={product.materialId || ""}
                onChange={handleInputChange}
              >
                {materials &&
                  materials.map((value, index) => (
                    <MenuItem key={index} value={value.id}>
                      {value.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={addProductDetail}
            >
              Thêm thuộc tính
            </Button>
          </Grid>

          {productDetails.map((detail, index) => (
            <Grid container spacing={2} key={index} item xs={12}>
              <Grid item xs={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="color">Màu sắc</InputLabel>
                  <Select
                    labelId={`color-label-${index}`}
                    name="colorId"
                    value={detail.colorId}
                    onChange={(event) => handleInputChangeDetail(index, event)}
                    label="Màu sắc"
                  >
                    {colors &&
                      colors.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {value.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="size">Kích thước</InputLabel>
                  <Select
                    labelId={`size-label-${index}`}
                    name="sizeId"
                    value={detail.sizeId}
                    label="Kích thước"
                    onChange={(event) => handleInputChangeDetail(index, event)}
                  >
                    {sizes &&
                      sizes.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {value.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={2}>
                <TextField
                  size="small"
                  label="Giá"
                  type="number"
                  fullWidth
                  name="retailPrice"
                  defaultValue={detail.retailPrice}
                  onChange={(event) => handleInputChangeDetail(index, event)}
                />
              </Grid>

              <Grid item xs={2}>
                <TextField
                  size="small"
                  label="Số lượng"
                  type="number"
                  fullWidth
                  name="quantity"
                  defaultChecked={detail.quantity}
                  onChange={(event) => handleInputChangeDetail(index, event)}
                />
              </Grid>

              <Grid item xs={2}>
                <IconButton
                  color="error"
                  onClick={() => removeProductDetail(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <StandardImageList onImagesUpload={handleImagesUpload} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mô tả"
              multiline
              fullWidth
              rows={4}
              name="description"
              defaultValue={product.description}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              onClick={handleSubmit}
            >
              Thêm sản phẩm
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
