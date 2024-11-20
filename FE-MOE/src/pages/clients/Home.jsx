// Author: Nong Hoang Vu || JavaTech
// Facebook:https://facebook.com/NongHoangVu04
// Github: https://github.com/JavaTech04
// Youtube: https://www.youtube.com/@javatech04/?sub_confirmation=1
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  fetchAllProducts,
  fetchBestSellingProducts,
} from "~/apis/client/apiClient";
import AdBanner from "~/components/clients/events/AdBanner";
import TopProductCard from "~/components/clients/cards/TopProductCard";
import { ProductCard } from "~/components/clients/cards/ProductCard";
import ListCategories from "~/components/clients/attributes/ListCategories";
import Features from "~/components/clients/other/Features";
import { ScrollToTop } from "~/utils/defaultScroll";

const Home = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToTop, setGoToTop] = useState(false);
  const [loadingViewMore, setLoadingViewMore] = useState(false);

  useEffect(() => {
    handleSetProducts();
  }, [currentPage]);

  useEffect(() => {
    ScrollToTop();
    const res = async () => {
      await fetchBestSellingProducts().then((res) => {
        setBestSellingProducts(res.data);
      });
    };
    res();

    const scrollableElement = document.querySelector(".content-area_client");
    const handleScroll = () => {
      if (scrollableElement.scrollTop > 200) {
        setGoToTop(true);
      } else {
        setGoToTop(false);
      }
    };

    scrollableElement.addEventListener("scroll", handleScroll);

    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSetProducts = async () => {
    const res = await fetchAllProducts(currentPage);
    setProducts((prev) => [...prev, ...res?.data]);
    setLoadingViewMore(false);
  };

  const viewMore = async () => {
    setLoadingViewMore(true);
    setCurrentPage(currentPage + 1);
    handleSetProducts();
  };

  if (bestSellingProducts?.length === 0 || products?.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="95vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <AdBanner />
      <Box padding={3}>
        <Typography
          level="h4"
          sx={{
            textAlign: "center",
            fontWeight: "700",
            color: "text.primary",
            fontSize: "2rem",
            textTransform: "uppercase",
            letterSpacing: 1.5,
            position: "relative",
            mb: 3,
            padding: "0 20px",
            ":before": {
              content: '""',
              position: "absolute",
              bottom: -5,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "3px",
              backgroundColor: "primary.main",
              borderRadius: "4px",
              transition: "all 0.3s ease",
            },
            ":hover": {
              color: "primary.main",
              transform: "scale(1.05)",
              ":before": {
                width: "100%",
              },
            },
          }}
        >
          Sản Phẩm Bán Chạy
        </Typography>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {bestSellingProducts &&
            bestSellingProducts?.map((product, index) => (
              <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                <TopProductCard product={product} />
              </Grid>
            ))}
        </Grid>
      </Box>
      <Box>
        <Grid container spacing={2} padding={3}>
          <Grid
            xs={12}
            sm={2.5}
            sx={{
              maxHeight: "100%",
              overflowY: "auto",
            }}
          >
            <ListCategories />
          </Grid>
          <Grid
            xs={12}
            sm={9.5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="https://i.pinimg.com/originals/a5/cb/fe/a5cbfe3fcc1932ba364ef3cf75313415.png"
              alt="banner"
              style={{
                width: "100%", // Đảm bảo chiếm hết chiều rộng cột
                maxHeight: "350px", // Giữ chiều cao tối đa
                objectFit: "cover", // Cắt ảnh phù hợp với kích thước
                borderRadius: "8px", // Bo góc mềm mại cho hình ảnh
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng shadow
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box padding={3}>
        <Typography level="title-lg">Sản Phẩm Nổi Bật</Typography>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Grid marginTop={2} container spacing={2}>
          {products &&
            products?.map((product, index) => (
              <Grid key={index} xs={12} sm={6} md={3} lg={2}>
                <ProductCard product={product} />
              </Grid>
            ))}
        </Grid>
        {products?.length > 0 && (
          <Box sx={{ margin: 3, display: "flex", justifyContent: "center" }}>
            <Button
              color="neutral"
              variant="soft"
              onClick={() => viewMore()}
              loading={loadingViewMore}
            >
              Xem thêm
            </Button>
          </Box>
        )}
      </Box>
      {goToTop && (
        <Box sx={{ position: "fixed", bottom: 30, right: 30 }}>
          <IconButton
            variant="soft"
            color="neutral"
            onClick={() => ScrollToTop()}
            sx={{ width: 50, height: 50, borderRadius: "50%" }}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Box>
      )}
      <Box>
        <Divider sx={{ my: 1, width: "100%" }} />
        <Features />
      </Box>
    </Box>
  );
};

export default Home;
