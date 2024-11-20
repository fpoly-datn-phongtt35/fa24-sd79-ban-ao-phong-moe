// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Input,
  List,
  ListItem,
  Option,
  Radio,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import {
  fetchBrands,
  fetchCategories,
  fetchMaterials,
  getProductsFilter,
} from "~/apis/client/apiClient";
import { CommonContext } from "~/context/CommonContext";
import AdBanner from "~/components/clients/events/AdBanner";
import TopProductCard from "~/components/clients/cards/TopProductCard";
import { Pagination } from "@mui/material";
import debounce from "lodash.debounce";
import SvgIconDisplay from "~/components/other/SvgIconDisplay";
import BagSvgIcon from "~/assert/icon/bag-svgrepo-com.svg";
import { ScrollToTop } from "~/utils/defaultScroll";

function Products() {
  const context = useContext(CommonContext);

  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [brands, setBrands] = useState(null);

  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const [filters, setFilters] = useState({
    pageNo: 1,
    pageSize: 12,
    keyword: "",
    categoryIds: [],
    brandIds: [],
    materialIds: [],
    minPrice: null,
    maxPrice: null,
    sortBy: "DEFAULT",
  });

  useEffect(() => {
    ScrollToTop();
    handleFetchCategories();
    handleFetchBrands();
    handleFetchMaterials();
  }, []);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      keyword: context.keyword,
      pageNo: 1,
    }));
  }, [context.keyword]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchData();
    }, 1000);

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [filters]);

  const handleFetchCategories = async () => {
    await fetchCategories().then((res) => setCategories(res.data));
  };

  const handleFetchBrands = async () => {
    await fetchBrands().then((res) => setBrands(res.data));
  };

  const handleFetchMaterials = async () => {
    await fetchMaterials().then((res) => setMaterials(res.data));
  };

  const fetchData = async () => {
    await getProductsFilter(filters).then((res) => {
      setProducts(res.data);
    });
  };

  const handlePageChange = (event, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, pageNo: value }));
  };

  const updateSortBy = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, sortBy: value }));
    setFilters((prevFilters) => ({ ...prevFilters, pageNo: 1 }));
  };

  const updatePageSize = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, pageSize: value }));
    setFilters((prevFilters) => ({ ...prevFilters, pageNo: 1 }));
  };

  const handleApplyFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      minPrice: minPrice,
      maxPrice: maxPrice,
      pageNo: 1,
    }));
    fetchData();
  };

  const handleCategoryChange = (categoryId, checked) => {
    setFilters((prevFilters) => {
      const updatedCategoryIds = checked
        ? [...prevFilters.categoryIds, categoryId]
        : prevFilters.categoryIds.filter((id) => id !== categoryId);

      return {
        ...prevFilters,
        categoryIds: updatedCategoryIds,
        pageNo: 1,
      };
    });
  };

  const handleBrandChange = (brandId, checked) => {
    setFilters((prevFilters) => {
      const updatedBrandIds = checked
        ? [...prevFilters.brandIds, brandId]
        : prevFilters.brandIds.filter((id) => id !== brandId);

      return {
        ...prevFilters,
        brandIds: updatedBrandIds,
        pageNo: 1,
      };
    });
  };

  const handleMaterialChange = (materialId, checked) => {
    setFilters((prevFilters) => {
      const updatedMaterialIds = checked
        ? [...prevFilters.materialIds, materialId]
        : prevFilters.materialIds.filter((id) => id !== materialId);

      return {
        ...prevFilters,
        materialIds: updatedMaterialIds,
        pageNo: 1,
      };
    });
  };
  return (
    <Box>
      <AdBanner />
      <Box padding={3}>
        <Grid container spacing={2}>
          <Grid xs={2} sx={{ borderRight: "1px solid #c3c3c38f" }}>
            <Stack spacing={2}>
              <Box>
                <Typography level="h4">Danh mục</Typography>
                <Divider />
                <List size="sm">
                  {categories &&
                    categories.map((category, index) => (
                      <ListItem key={index}>
                        <Checkbox
                          variant="outlined"
                          label={category.name}
                          size="sm"
                          onChange={(e) =>
                            handleCategoryChange(category.id, e.target.checked)
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
              <Box>
                <Typography level="h4">Thương hiệu</Typography>
                <Divider />
                <List size="sm">
                  {brands &&
                    brands.map((brand, index) => (
                      <ListItem key={index}>
                        <Checkbox
                          variant="outlined"
                          label={brand.name}
                          size="sm"
                          onChange={(e) =>
                            handleBrandChange(brand.id, e.target.checked)
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
              <Box>
                <Typography level="h4">Chất liệu</Typography>
                <Divider />
                <List size="sm">
                  {materials &&
                    materials.map((material, index) => (
                      <ListItem key={index}>
                        <Checkbox
                          variant="outlined"
                          label={material.name}
                          size="sm"
                          onChange={(e) =>
                            handleMaterialChange(material.id, e.target.checked)
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
              <Box>
                <Typography
                  level="h4"
                  sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
                >
                  Khoảng giá
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                  }}
                >
                  <Input
                    onChange={(e) => setMinPrice(e.target.value)}
                    type="number"
                    placeholder="Min"
                    sx={{
                      width: "48%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      "&:focus": {
                        borderColor: "#4CAF50",
                      },
                      backgroundColor: "#fff",
                    }}
                  />
                  <Input
                    onChange={(e) => setMaxPrice(e.target.value)}
                    type="number"
                    placeholder="Max"
                    sx={{
                      width: "48%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      "&:focus": {
                        borderColor: "#4CAF50",
                      },
                      backgroundColor: "#fff",
                    }}
                  />
                </Box>

                <Box marginTop={2}>
                  <Button
                    fullWidth
                    onClick={() => handleApplyFilter()}
                    variant="contained"
                    sx={{
                      padding: "10px",
                      textTransform: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      backgroundColor: "#45a9ec",
                    }}
                  >
                    Áp dụng
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Grid>
          <Grid xs={10}>
            <Stack
              spacing={1}
              direction="row"
              useFlexGap
              sx={{ flexWrap: "wrap" }}
            >
              <Box
                marginTop
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  width: "100%",
                  borderBottom: "1px solid #c3c3c38f",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography level="title-md">Sắp xếp theo</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 2,
                      gap: 2,
                    }}
                  >
                    <Radio
                      checked={filters?.sortBy === "DEFAULT"}
                      value="DEFAULT"
                      label="Mặc định"
                      onChange={(e) => updateSortBy(e.target.value)}
                    />
                    <Radio
                      checked={filters.sortBy === "CREATED_AT"}
                      value="CREATED_AT"
                      label="Mới nhất"
                      onChange={(e) => updateSortBy(e.target.value)}
                    />
                    <Select
                      value={filters.sortBy}
                      sx={{ minWidth: 200 }}
                      placeholder="Giá"
                      onChange={(_, value) => updateSortBy(value)}
                    >
                      <Option value="PRICE_ASC">Từ thấp đến cao</Option>
                      <Option value="PRICE_DESC">Từ cao đến thấp</Option>
                    </Select>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography marginRight={1} level="title-md">
                    Hiển thị:{" "}
                  </Typography>
                  <Select
                    value={filters.pageSize}
                    onChange={(_, value) => updatePageSize(value)}
                  >
                    <Option value={6}>6</Option>
                    <Option value={12}>12</Option>
                    <Option value={18}>18</Option>
                    <Option value={24}>24</Option>
                  </Select>
                </Box>
              </Box>
              <Box marginTop sx={{ width: "100%" }}>
                {context.keyword && (
                  <Typography margin={1} level="body-md">
                    Kết quả tìm kiếm cho từ khoá:&nbsp;
                    <strong style={{ color: "red" }}>
                      '{context.keyword}'
                    </strong>
                  </Typography>
                )}

                <Grid marginTop={1} container spacing={2}>
                  {products &&
                    products.content?.map((product, index) => (
                      <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                        <TopProductCard product={product} />
                      </Grid>
                    ))}
                </Grid>
              </Box>
              {products?.content?.length === 0 && (
                <Box
                  marginTop
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid marginTop={2} container spacing={2}>
                    <Box sx={{ textAlign: "center", p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <SvgIconDisplay
                          icon={BagSvgIcon}
                          width="100px"
                          height="100px"
                        />
                      </Box>
                      <Typography level="h5" fontWeight="bold" color="neutral">
                        Không tìm thấy sản phẩm nào
                      </Typography>
                    </Box>
                  </Grid>
                </Box>
              )}
            </Stack>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              padding={3}
            >
              {products?.totalPages > 1 && (
                <Stack>
                  <Pagination
                    count={products?.totalPages}
                    page={filters.pageNo}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                  />
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Products;
